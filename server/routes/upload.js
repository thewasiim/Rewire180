const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const db = require('../database');
const fs = require('fs');

const JWT_SECRET = process.env.JWT_SECRET || 'rewire180-super-secret-key-change-in-production';

function requireAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Not authenticated' });
    try { req.admin = jwt.verify(auth.split(' ')[1], JWT_SECRET); next(); }
    catch { return res.status(401).json({ error: 'Invalid or expired token' }); }
}

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (/\.(mp4|mov|avi|webm|jpg|jpeg|png|gif|webp)$/i.test(file.originalname)) cb(null, true);
    else cb(new Error('Only video and image files are allowed'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 500 * 1024 * 1024 } });

// POST /api/upload
router.post('/', requireAuth, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const publicUrl = `/uploads/${req.file.filename}`;
    const { contentKey } = req.body;
    if (contentKey) db.updateContent(contentKey, publicUrl);

    res.json({ success: true, url: publicUrl, filename: req.file.filename, originalName: req.file.originalname, size: req.file.size });
});

// Multer error handler
router.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'File too large. Max: 500MB.' });
    res.status(400).json({ error: err.message });
});

module.exports = router;
