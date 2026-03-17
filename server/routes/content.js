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

// GET /api/content — public
router.get('/', async (req, res) => {
    const data = await db.getAllContent();
    res.json(data);
});

// GET /api/content/structured — admin only
router.get('/structured', requireAuth, async (req, res) => {
    const data = await db.getStructured();
    res.json(data);
});

// PUT /api/content/bulk/update — bulk update (admin only)
router.put('/bulk/update', requireAuth, async (req, res) => {
    const { updates } = req.body;
    if (!updates || typeof updates !== 'object')
        return res.status(400).json({ error: 'updates object required' });
    await db.bulkUpdate(updates);
    res.json({ success: true, updated: Object.keys(updates).length });
});

// PUT /api/content/:key — single update (admin only)
router.put('/:key', requireAuth, async (req, res) => {
    const { key } = req.params;
    const { value } = req.body;
    if (value === undefined) return res.status(400).json({ error: 'Value is required' });
    const ok = await db.updateContent(key, value);
    if (!ok) return res.status(404).json({ error: `Content key "${key}" not found` });
    res.json({ success: true, key, value });
});

// POST /api/content/list/:key — add an item to a list (admin only)
router.post('/list/:key', requireAuth, async (req, res) => {
    const { key } = req.params;
    const { item } = req.body;
    if (item === undefined) return res.status(400).json({ error: 'Item is required' });

    const ok = await db.listAdd(key, item);
    if (!ok) return res.status(400).json({ error: `Key "${key}" is not a valid list` });
    res.json({ success: true, key, value: item });
});

// DELETE /api/content/list/:key/:index — remove an item from a list (admin only)
router.delete('/list/:key/:index', requireAuth, async (req, res) => {
    const { key, index } = req.params;
    const ok = await db.listRemove(key, parseInt(index, 10));
    if (!ok) return res.status(400).json({ error: `Could not remove item from "${key}" at index ${index}` });
    res.json({ success: true, key, index });
});

module.exports = router;
