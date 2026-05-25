const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV !== 'production' ? 'rewire180-local-dev-secret' : null);
if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in production.");
    process.exit(1);
}

const rateLimit = require('express-rate-limit');

// Rate limiters for sensitive endpoints
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per window
    message: { error: 'Too many login attempts from this IP, please try again after 15 minutes' }
});

const resetPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 password reset requests per hour
    message: { error: 'Too many password reset requests from this IP, please try again later' }
});

// POST /api/auth/login
router.post('/login', loginLimiter, async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ error: 'Username and password are required' });

    const admin = await db.getAdmin(username);
    if (!admin)
        return res.status(401).json({ error: 'Invalid credentials' });

    if (!bcrypt.compareSync(password, admin.password))
        return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, message: 'Login successful' });
});

// POST /api/auth/change-password
router.post('/change-password', async (req, res) => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Not authenticated' });
    
    let decoded;
    try { decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET); } catch { return res.status(401).json({ error: 'Invalid token' }); }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required' });
    }

    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const admin = await db.getAdmin(decoded.username);
    if (!admin || !bcrypt.compareSync(currentPassword, admin.password)) {
        return res.status(401).json({ error: 'Incorrect current password' });
    }

    await db.updatePassword(decoded.username, bcrypt.hashSync(newPassword, 10));
    res.json({ message: 'Password updated successfully' });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', resetPasswordLimiter, async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const admin = await db.getAdminByEmail(email);
    if (!admin) {
        return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 3600000; // 1 hour

    await db.setResetToken(admin.username, token, expiry);

    // Use dynamic origin/host for deployed version, fallback to localhost
    const baseUrl = process.env.SITE_URL || req.headers.origin || `${req.headers['x-forwarded-proto'] || req.protocol}://${req.headers.host}`;
    const resetLink = `${baseUrl}/admin/login.html?reset_token=${token}`;

    console.log(`\n--- PASSWORD RESET REQUEST for ${email} ---`);
    // Note: Reset link/token NOT logged for security

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
            console.log("Email sent via Nodemailer to", email);
        }
    } catch (err) {
        console.error('Failed to send email:', err);
    }

    res.json({ message: 'If that email exists, a reset link has been sent.' });
});

// POST /api/auth/reset-password
router.post('/reset-password', loginLimiter, async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'Valid token and new password (min 6 chars) are required' });
    }

    // Find admin by reset token instead of hardcoded username
    const admin = await db.getAdminByResetToken(token);

    if (!admin || !admin.reset_token || admin.reset_token !== token) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    if (Date.now() > admin.reset_token_expiry) {
        return res.status(400).json({ error: 'Reset token has expired' });
    }

    await db.updatePassword(admin.username, bcrypt.hashSync(newPassword, 10));
    await db.clearResetToken(admin.username);

    res.json({ message: 'Password has been reset successfully' });
});

module.exports = router;
