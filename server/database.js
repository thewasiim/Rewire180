const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'rewire180-db.json');
const adapter = new FileSync(DB_PATH);
const db = low(adapter);

// ─── DEFAULT DATA ─────────────────────────────────────────────────────────────
db.defaults({
  admin: [],
  content: []
}).write();

// ─── SEED ADMIN ───────────────────────────────────────────────────────────────
if (db.get('admin').size().value() === 0) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.get('admin').push({ id: 1, username: 'admin', password: hash, email: 'mwasim0048@gmail.com' }).write();
  console.log('✅ Default admin created (username: admin, password: admin123)');
}

// ─── DEFAULT CONTENT ─────────────────────────────────────────────────────────
const defaultContent = [
  // Hero
  { key: 'hero_video', value: 'src/assets/videos/hero-video.mp4', type: 'video', label: 'Hero Video', section: 'hero' },
  { key: 'hero_eyebrow', value: '180 DAY TRANSFORMATION PROGRAM', type: 'text', label: 'Hero Eyebrow Text', section: 'hero' },
  { key: 'hero_title', value: '180 days to transform your body and build the confidence that lasts.', type: 'text', label: 'Hero Title', section: 'hero' },
  { key: 'hero_subtitle', value: 'In 180 days I help busy professionals build a strong body and unshakeable confidence and mindset without sacrificing their time.', type: 'text', label: 'Hero Subtitle', section: 'hero' },
  { key: 'hero_cta_link', value: '#vip-pricing', type: 'text', label: 'Hero CTA Link', section: 'hero' },

  // Skills
  { key: 'skills_video_1', value: 'src/assets/videos/hero-video.mp4', type: 'video', label: 'Skills Video 1', section: 'skills' },
  { key: 'skills_text_1', value: 'Follow this step-by-step system to build a strong body and unstoppable confidence.', type: 'text', label: 'Skills Card 1 Text', section: 'skills' },
  { key: 'skills_btn_1', value: '#vip-pricing', type: 'text', label: 'Skills Card 1 Button Link', section: 'skills' },
  { key: 'skills_video_2', value: 'src/assets/videos/hero-video.mp4', type: 'video', label: 'Skills Video 2', section: 'skills' },
  { key: 'skills_text_2', value: 'Learn how to stay consistent, disciplined, and mentally sharp for life.', type: 'text', label: 'Skills Card 2 Text', section: 'skills' },
  { key: 'skills_btn_2', value: '#method-pricing', type: 'text', label: 'Skills Card 2 Button Link', section: 'skills' },

  // Video Reviews
  {
    key: 'video_reviews_list',
    type: 'list_object',
    label: 'Video Reviews',
    section: 'video_reviews',
    value: [
      { video: 'reviews/v1.mp4', text: '"I was burnt out and had failed at online coaching before, but James\' course helped me get set up fast and sign my first four clients. Best investment I\'ve made."' },
      { video: 'reviews/v2.mp4', text: '"Before joining, I was overwhelmed and my business was stuck. The mentorship gave me clarity, direction, and systems that helped my revenue grow massively."' },
      { video: 'reviews/v3.mp4', text: '"Joining the mentorship was one of the best decisions I made. My followers grew fast and my systems finally made sense."' },
      { video: 'reviews/v4.mp4', text: '"Clear steps, real systems, and real results. This program helped me stop guessing and start executing."' }
    ]
  },

  // Photo Reviews
  {
    key: 'photo_reviews_list',
    type: 'list_string',
    label: 'Photo Reviews',
    section: 'photo_reviews',
    value: [
      'src/assets/images/Gemini_Generated_Image_m9l67wm9l67wm9l6.png',
      'src/assets/images/Gemini_Generated_Image_m9l67wm9l67wm9l6.png',
      'src/assets/images/Gemini_Generated_Image_m9l67wm9l67wm9l6.png',
      'src/assets/images/Gemini_Generated_Image_m9l67wm9l67wm9l6.png',
      'src/assets/images/Gemini_Generated_Image_m9l67wm9l67wm9l6.png'
    ]
  },

  // 180 Method Pricing
  { key: 'method_title', value: 'The 180™ Method', type: 'text', label: 'Method Title', section: 'method_pricing' },
  { key: 'method_subtitle', value: 'PRIVATE COACHING', type: 'text', label: 'Method Subtitle', section: 'method_pricing' },
  { key: 'method_features', value: 'Personalised weekly training\nTailored nutrition updates\nPrivate coaching app access\nWeekly check-ins\nDaily accountability & motivation\nGroup video calls\nMindset coaching & confidence-building exercises\nPractical strategies to believe in yourself and take consistent action\nTrain anywhere, anytime', type: 'text', label: 'Method Features (one per line)', section: 'method_pricing' },
  { key: 'method_price_1', value: '£1,000 / month', type: 'text', label: 'Method Option 1 Price', section: 'method_pricing' },
  { key: 'method_price_2', value: '£6,000 upfront', type: 'text', label: 'Method Option 2 Price', section: 'method_pricing' },
  { key: 'method_btn_link', value: '#', type: 'text', label: 'Method Button Link', section: 'method_pricing' },

  // VIP Pricing
  { key: 'vip_title', value: 'VIP Private Coaching', type: 'text', label: 'VIP Title', section: 'vip_pricing' },
  { key: 'vip_subtitle', value: 'IN PERSON', type: 'text', label: 'VIP Subtitle', section: 'vip_pricing' },
  { key: 'vip_note', value: 'Willing to relocate', type: 'text', label: 'VIP Note', section: 'vip_pricing' },
  { key: 'vip_description', value: 'Fully immersive coaching for clients who want a total transformation in body, mind, and confidence. 2–4 week intensive. UK & international. Includes training, nutrition, lifestyle, and mindset mastery.', type: 'text', label: 'VIP Description', section: 'vip_pricing' },
  { key: 'vip_price_uk', value: '£10,000', type: 'text', label: 'VIP Price (UK)', section: 'vip_pricing' },
  { key: 'vip_price_abroad', value: '£20,000', type: 'text', label: 'VIP Price (Abroad)', section: 'vip_pricing' },
  { key: 'vip_btn_link', value: '#', type: 'text', label: 'VIP Button Link', section: 'vip_pricing' },
];

const existingKeys = db.get('content').map('key').value();
const toSeed = defaultContent.filter(c => !existingKeys.includes(c.key));
if (toSeed.length > 0) {
  db.get('content').push(...toSeed).write();
  console.log(`✅ Database seeded with ${toSeed.length} default content items`);
}

// ─── HELPER METHODS ───────────────────────────────────────────────────────────
module.exports = {
  // Get admin by username
  getAdmin: (username) => db.get('admin').find({ username }).value(),

  // Get admin by email
  getAdminByEmail: (email) => db.get('admin').find({ email }).value(),

  // Update admin password
  updatePassword: (username, hash) => {
    db.get('admin').find({ username }).assign({ password: hash }).write();
  },

  // Set reset token
  setResetToken: (username, token, expiry) => {
    db.get('admin').find({ username }).assign({ resetToken: token, resetTokenExpiry: expiry }).write();
  },

  // Clear reset token
  clearResetToken: (username) => {
    db.get('admin').find({ username }).assign({ resetToken: null, resetTokenExpiry: null }).write();
  },

  // Get all content as object { key: { value, type, label, section } }
  getAllContent: () => {
    const rows = db.get('content').value();
    const result = {};
    rows.forEach(r => {
      result[r.key] = { value: r.value, type: r.type, label: r.label, section: r.section };
    });
    return result;
  },

  // Update a single content item
  updateContent: (key, value) => {
    const exists = db.get('content').find({ key }).value();
    if (!exists) return false;
    db.get('content').find({ key }).assign({ value, updated_at: new Date().toISOString() }).write();
    return true;
  },

  // Bulk update
  bulkUpdate: (updates) => {
    for (const [key, value] of Object.entries(updates)) {
      db.get('content').find({ key }).assign({ value, updated_at: new Date().toISOString() }).write();
    }
  },

  // Get structured content by section
  getStructured: () => {
    const rows = db.get('content').value();
    const sections = {};
    rows.forEach(r => {
      if (!sections[r.section]) sections[r.section] = [];
      sections[r.section].push(r);
    });
    return sections;
  },

  // List operations (for dynamic arrays like reviews)
  listAdd: (key, item) => {
    const c = db.get('content').find({ key });
    if (!c.value() || !Array.isArray(c.value().value)) return false;
    c.get('value').push(item).write();
    c.assign({ updated_at: new Date().toISOString() }).write();
    return true;
  },

  listRemove: (key, index) => {
    const c = db.get('content').find({ key });
    if (!c.value() || !Array.isArray(c.value().value)) return false;
    const arr = c.value().value;
    if (index < 0 || index >= arr.length) return false;
    arr.splice(index, 1);
    c.assign({ value: arr, updated_at: new Date().toISOString() }).write();
    return true;
  }
};
