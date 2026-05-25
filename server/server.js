const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// ─── INIT DATABASE (must be before routes) ────────────────────────────────────
require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Trust front-facing proxy (like Netlify, Vercel, etc.)
app.set('trust proxy', 1);

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
// Security Headers
app.use(helmet({
    contentSecurityPolicy: false, // Leave basic to not break inline assets/cloudinary yet
    crossOriginResourcePolicy: false
}));

// CORS Configuration
const corsOptions = {
    origin: function (origin, callback) {
        // In local development, allow all origins
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        
        // In production, restrict to known domains
        const allowedOrigins = [
            process.env.SITE_URL, 
            'https://rewire180.com', 
            'https://www.rewire180.com',
            'https://rewire180-production.up.railway.app'
        ];
        
        // Allow requests with no origin, known domains, or any netlify preview
        if (!origin || allowedOrigins.includes(origin) || origin.includes('netlify.app') || origin.includes('netlify.com')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── STATIC FILE SERVING ──────────────────────────────────────────────────────
// Serve frontend assets in ALL environments (Netlify, Railway, Local)
const projectRoot = path.join(__dirname, '..');
app.use(express.static(projectRoot));

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Rewire180 API is running 🚀', version: '1.0.0' });
});

// ─── API ROUTES ───────────────────────────────────────────────────────────────
const router = express.Router();
router.use('/auth', require('./routes/auth'));
router.use('/content', require('./routes/content'));
router.use('/upload', require('./routes/upload'));
router.use('/analytics', require('./routes/analytics'));

// Attach the router to handle all possible path patterns
app.use('/api', router);
app.use('/.netlify/functions/api', router);

// ─── CATCH-ALL ────────────────────────────────────────────────────────────────
app.use((req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'Route not found' });
    }
    res.status(404).send('Page not found');
});

// ─── START SERVER ─────────────────────────────────────────────────────────────
// Always listen — works for local dev, Railway, and any Node host.
// (Netlify/Vercel use serverless-http via module.exports, not app.listen)
app.listen(PORT, () => {
    console.log('\n🚀 Rewire180 Server Running!');
    console.log(`   Port: ${PORT}`);
    if (process.env.NODE_ENV !== 'production') {
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
    }
    console.log('');
});

module.exports = app;
