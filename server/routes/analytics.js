const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || 'rewire180-super-secret-key-change-in-production';

function requireAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Not authenticated' });
    try { req.admin = jwt.verify(auth.split(' ')[1], JWT_SECRET); next(); }
    catch { return res.status(401).json({ error: 'Invalid or expired token' }); }
}

// POST /api/analytics/track — public (called silently by the website)
router.post('/track', async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || req.ip;
    const userAgent = req.headers['user-agent'] || '';
    const page = req.body.page || '/';
    const referrer = req.body.referrer || '';

    await db.logVisit({ ip, userAgent, page, referrer });
    res.json({ ok: true });
});

// GET /api/analytics — admin only
router.get('/', requireAuth, async (req, res) => {
    const data = await db.getAnalytics();
    res.json(data);
});

module.exports = router;
