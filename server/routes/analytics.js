const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database');

const JWT_SECRET = process.env.JWT_SECRET || (process.env.NODE_ENV !== 'production' ? 'rewire180-local-dev-secret' : null);
if (!JWT_SECRET) {
    console.error("FATAL ERROR: JWT_SECRET is not defined in production.");
    process.exit(1);
}

function requireAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Not authenticated' });
    try { req.admin = jwt.verify(auth.split(' ')[1], JWT_SECRET); next(); }
    catch { return res.status(401).json({ error: 'Invalid or expired token' }); }
}

const rateLimit = require('express-rate-limit');
const trackLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // Limit each IP to 30 tracked events per minute
    message: { error: 'Too many analytics pings from this IP' }
});

// POST /api/analytics/track — public (called silently by the website)
router.post('/track', trackLimiter, async (req, res) => {
    // Because app.set('trust proxy', 1) is set in server.js, req.ip safely pulls the real client IP.
    const ip = req.ip;
    const userAgent = (req.headers['user-agent'] || '').slice(0, 500); // Truncate to avoid massive logs
    const page = (req.body.page || '/').slice(0, 500);
    const referrer = (req.body.referrer || '').slice(0, 500);

    await db.logVisit({ ip, userAgent, page, referrer });
    res.json({ ok: true });
});

// GET /api/analytics — admin only
router.get('/', requireAuth, async (req, res) => {
    const data = await db.getAnalytics();
    res.json(data);
});

module.exports = router;
