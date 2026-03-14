const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'rewire180-super-secret-key-change-in-production';

// POST /api/auth/login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ error: 'Username and password are required' });

    const admin = db.getAdmin(username);
    if (!admin)
        return res.status(401).json({ error: 'Invalid credentials' });

    if (!bcrypt.compareSync(password, admin.password))
        return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, message: 'Login successful' });
});

// POST /api/auth/change-password
router.post('/change-password', (req, res) => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Not authenticated' });
    try { jwt.verify(auth.split(' ')[1], JWT_SECRET); } catch { return res.status(401).json({ error: 'Invalid token' }); }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required' });
    }

    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    // Verify current password
    // We get the id/username from the validated token (stored in req.user if we had a middleware, but here we can decode again or just use admin)
    const decoded = jwt.decode(auth.split(' ')[1]);
    const admin = db.getAdmin(decoded.username);
    if (!admin || !bcrypt.compareSync(currentPassword, admin.password)) {
        return res.status(401).json({ error: 'Incorrect current password' });
    }

    db.updatePassword('admin', bcrypt.hashSync(newPassword, 10));
    res.json({ message: 'Password updated successfully' });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    // Validate if the email belongs to the admin
    const admin = db.getAdminByEmail ? db.getAdminByEmail(email) : db.getAdmin('admin');
    // Using a simple check: if no email matches, we don't leak that it failed, just say we sent it
    if (!admin || (admin.email && admin.email !== email)) {
        return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    // Generate token
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 3600000; // 1 hour from now

    db.setResetToken(admin.username, token, expiry);

    // Normally we'd use environment variables for this
    const resetLink = `http://localhost:${process.env.PORT || 3001}/admin/login.html?reset_token=${token}`;

    console.log('\n--- PASSWORD RESET REQUEST ---');
    console.log(`Email: ${email}`);
    console.log(`Reset Link: ${resetLink}`);
    console.log('------------------------------\n');

    try {
        const nodemailer = require('nodemailer');

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
        });

        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            await transporter.sendMail({
                from: `"Rewire180 Admin" <${process.env.SMTP_USER}>`,
                to: email,
                subject: "Password Reset Request",
                text: `You requested a password reset. Click the following link to reset your password: ${resetLink}\n\nThis link will expire in 1 hour.`,
                html: `<p>You requested a password reset.</p><p><a href="${resetLink}">Click here to reset your password</a></p><p>This link will expire in 1 hour.</p>`,
            });
            console.log("Email actually sent via Nodemailer to", email);
        } else {
            console.log("NOTE: Email simulated. Edit the .env file with your Gmail credentials to send a real email.");
        }
    } catch (err) {
        console.error('Failed to send email:', err);
        // We still return success since the token was generated and logged
    }

    res.json({ message: 'If that email exists, a reset link has been sent.' });
});

// POST /api/auth/reset-password
router.post('/reset-password', (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'Valid token and new password (min 6 chars) are required' });
    }

    // Since we only have one admin, we can just check the default admin
    const admin = db.getAdmin('admin');

    if (!admin || !admin.resetToken || admin.resetToken !== token) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    if (Date.now() > admin.resetTokenExpiry) {
        return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Update password and clear token
    db.updatePassword('admin', bcrypt.hashSync(newPassword, 10));
    db.clearResetToken('admin');

    res.json({ message: 'Password has been reset successfully' });
});

module.exports = router;
