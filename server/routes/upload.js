const express = require('express');
const router = express.Router();
const multer = require('multer');
const jwt = require('jsonwebtoken');
const db = require('../database');
const cloudinary = require('cloudinary').v2;

const JWT_SECRET = process.env.JWT_SECRET || 'rewire180-super-secret-key-change-in-production';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

function requireAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Not authenticated' });
    try { req.admin = jwt.verify(auth.split(' ')[1], JWT_SECRET); next(); }
    catch { return res.status(401).json({ error: 'Invalid or expired token' }); }
}

// Use memory storage instead of disk (serverless compatible)
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (/\.(mp4|mov|avi|webm|jpg|jpeg|png|gif|webp)$/i.test(file.originalname)) cb(null, true);
        else cb(new Error('Only video and image files are allowed'), false);
    },
    limits: { fileSize: 500 * 1024 * 1024 } // 500MB
});

// POST /api/upload
router.post('/', requireAuth, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    try {
        // Determine resource type based on mimetype
        const resourceType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'rewire180',
                    resource_type: resourceType,
                    public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
                    eager_async: true,
                    flags: 'lossy'
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        const publicUrl = result.secure_url;

        // Update content in DB if contentKey provided
        const { contentKey } = req.body;
        if (contentKey) await db.updateContent(contentKey, publicUrl);

        res.json({
            success: true,
            url: publicUrl,
            filename: req.file.originalname,
            originalName: req.file.originalname,
            size: req.file.size
        });
    } catch (err) {
        console.error('Cloudinary upload error:', err);
        res.status(500).json({ error: 'Failed to upload file to cloud storage' });
    }
});

// Multer error handler
router.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'File too large. Max: 500MB.' });
    res.status(400).json({ error: err.message });
});

module.exports = router;
