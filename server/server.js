require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// ─── INIT DATABASE (must be before routes) ────────────────────────────────────
require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── STATIC FILE SERVING ──────────────────────────────────────────────────────

// Serve uploaded files (videos, images) at /uploads/
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve the main website from the project root
const projectRoot = path.join(__dirname, '..');
app.use(express.static(projectRoot));

// ─── API ROUTES ───────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/content', require('./routes/content'));
app.use('/api/upload', require('./routes/upload'));

// ─── CATCH-ALL: serve index.html for any unknown route ────────────────────────
app.get('*', (req, res) => {
    // Don't intercept API or file routes
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
        return res.status(404).json({ error: 'Not found' });
    }
    // For HTML pages, let express.static handle them naturally
    // This catch-all handles only missing routes
    res.status(404).send('Page not found');
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log('\n🚀 Rewire180 Server Running!');
    console.log(`   Main website:  http://localhost:${PORT}`);
    console.log(`   Admin panel:   http://localhost:${PORT}/admin/login.html`);
    console.log(`   Uploads dir:   ${path.join(__dirname, 'uploads')}`);
    console.log('');
    console.log('📋 API Endpoints:');
    console.log(`   POST /api/auth/login       — Admin login`);
    console.log(`   GET  /api/content          — Get all content (public)`);
    console.log(`   PUT  /api/content/:key     — Update content (admin only)`);
    console.log(`   POST /api/upload           — Upload file (admin only)`);
    console.log('');
});

module.exports = app;
