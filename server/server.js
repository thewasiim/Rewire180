const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');

// ─── INIT DATABASE (must be before routes) ────────────────────────────────────
require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── STATIC FILE SERVING (local dev only, Netlify serves these automatically) ─
if (process.env.NODE_ENV !== 'production') {
    const projectRoot = path.join(__dirname, '..');
    app.use(express.static(projectRoot));
}

// ─── API ROUTES ───────────────────────────────────────────────────────────────
const router = express.Router();
router.use('/auth', require('./routes/auth'));
router.use('/content', require('./routes/content'));
router.use('/upload', require('./routes/upload'));
router.use('/analytics', require('./routes/analytics'));

// Attach the router to handle all possible path patterns
app.use('/api', router);
app.use('/.netlify/functions/api', router);
app.use('/', router); // fallback for serverless-http path stripping

// ─── CATCH-ALL (local dev only) ───────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
    app.get('*', (req, res) => {
        if (req.path.startsWith('/api')) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.status(404).send('Page not found');
    });
}

// ─── START SERVER (local dev only, not used on Netlify) ───────────────────────
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log('\n🚀 Rewire180 Server Running!');
        console.log(`   Main website:  http://localhost:${PORT}`);
        console.log(`   Admin panel:   http://localhost:${PORT}/admin/login.html`);
        console.log('');
        console.log('📋 API Endpoints:');
        console.log(`   POST /api/auth/login       — Admin login`);
        console.log(`   GET  /api/content          — Get all content (public)`);
        console.log(`   PUT  /api/content/:key     — Update content (admin only)`);
        console.log(`   POST /api/upload           — Upload file (admin only)`);
        console.log(`   POST /api/analytics/track  — Track visitor`);
        console.log(`   GET  /api/analytics        — Get analytics (admin only)`);
        console.log('');
    });
}

module.exports = app;
