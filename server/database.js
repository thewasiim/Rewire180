const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// ─── SUPABASE CLIENT ──────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ─── SEED DATA (runs once) ───────────────────────────────────────────────────
async function seedDatabase() {
  // Seed admin
  const { data: existingAdmin } = await supabase
    .from('admin')
    .select('id')
    .eq('username', 'admin')
    .single();

  if (!existingAdmin) {
    const hash = bcrypt.hashSync('admin123', 10);
    await supabase.from('admin').insert({
      username: 'admin',
      password: hash,
      email: 'mwasim0048@gmail.com'
    });
    console.log('✅ Default admin created (username: admin, password: admin123)');
  }

  // Seed default content
  const { data: existingContent } = await supabase
    .from('content')
    .select('key');

  const existingKeys = (existingContent || []).map(c => c.key);

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

  const toSeed = defaultContent.filter(c => !existingKeys.includes(c.key));
  if (toSeed.length > 0) {
    // For Supabase, value column is JSONB, so wrap string/array values
    const rows = toSeed.map(c => ({
      key: c.key,
      value: JSON.stringify(c.value), // JSONB column
      type: c.type,
      label: c.label,
      section: c.section
    }));
    await supabase.from('content').insert(rows);
    console.log(`✅ Database seeded with ${toSeed.length} default content items`);
  }
}

// Run seed on require
seedDatabase().catch(err => console.error('Seed error:', err));

// ─── HELPER: parse JSONB value ────────────────────────────────────────────────
function parseValue(raw) {
  if (raw === null || raw === undefined) return raw;
  // Supabase returns JSONB as parsed objects already, but if it's a string, parse it
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return raw; }
  }
  return raw;
}

// ─── HELPER METHODS ───────────────────────────────────────────────────────────
module.exports = {
  supabase,

  // Get admin by username
  getAdmin: async (username) => {
    const { data } = await supabase
      .from('admin')
      .select('*')
      .eq('username', username)
      .single();
    return data;
  },

  // Get admin by email
  getAdminByEmail: async (email) => {
    const { data } = await supabase
      .from('admin')
      .select('*')
      .eq('email', email)
      .single();
    return data;
  },

  // Update admin password
  updatePassword: async (username, hash) => {
    await supabase
      .from('admin')
      .update({ password: hash })
      .eq('username', username);
  },

  // Set reset token
  setResetToken: async (username, token, expiry) => {
    await supabase
      .from('admin')
      .update({ reset_token: token, reset_token_expiry: expiry })
      .eq('username', username);
  },

  // Clear reset token
  clearResetToken: async (username) => {
    await supabase
      .from('admin')
      .update({ reset_token: null, reset_token_expiry: null })
      .eq('username', username);
  },

  // Get all content as object { key: { value, type, label, section } }
  getAllContent: async () => {
    const { data: rows } = await supabase.from('content').select('*');
    const result = {};
    (rows || []).forEach(r => {
      result[r.key] = {
        value: parseValue(r.value),
        type: r.type,
        label: r.label,
        section: r.section
      };
    });
    return result;
  },

  // Update a single content item
  updateContent: async (key, value) => {
    const { data } = await supabase
      .from('content')
      .update({ value: JSON.stringify(value), updated_at: new Date().toISOString() })
      .eq('key', key)
      .select();
    return data && data.length > 0;
  },

  // Bulk update
  bulkUpdate: async (updates) => {
    for (const [key, value] of Object.entries(updates)) {
      await supabase
        .from('content')
        .update({ value: JSON.stringify(value), updated_at: new Date().toISOString() })
        .eq('key', key);
    }
  },

  // Get structured content by section
  getStructured: async () => {
    const { data: rows } = await supabase.from('content').select('*');
    const sections = {};
    (rows || []).forEach(r => {
      r.value = parseValue(r.value);
      if (!sections[r.section]) sections[r.section] = [];
      sections[r.section].push(r);
    });
    return sections;
  },

  // List operations (for dynamic arrays like reviews)
  listAdd: async (key, item) => {
    const { data: row } = await supabase
      .from('content')
      .select('value')
      .eq('key', key)
      .single();
    if (!row) return false;
    const arr = parseValue(row.value);
    if (!Array.isArray(arr)) return false;
    arr.push(item);
    await supabase
      .from('content')
      .update({ value: JSON.stringify(arr), updated_at: new Date().toISOString() })
      .eq('key', key);
    return true;
  },

  listRemove: async (key, index) => {
    const { data: row } = await supabase
      .from('content')
      .select('value')
      .eq('key', key)
      .single();
    if (!row) return false;
    const arr = parseValue(row.value);
    if (!Array.isArray(arr) || index < 0 || index >= arr.length) return false;
    arr.splice(index, 1);
    await supabase
      .from('content')
      .update({ value: JSON.stringify(arr), updated_at: new Date().toISOString() })
      .eq('key', key);
    return true;
  },

  // ─── ANALYTICS ──────────────────────────────────────────────────────────────
  logVisit: async (visitData) => {
    await supabase.from('analytics').insert({
      ip: visitData.ip,
      user_agent: visitData.userAgent,
      page: visitData.page,
      referrer: visitData.referrer
    });
  },

  getAnalytics: async () => {
    const { data: all } = await supabase
      .from('analytics')
      .select('*')
      .order('created_at', { ascending: false });

    const rows = all || [];
    const totalViews = rows.length;

    // Unique visitors by IP
    const uniqueIPs = new Set(rows.map(v => v.ip));
    const uniqueVisitors = uniqueIPs.size;

    // Today's views
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayViews = rows.filter(v => v.created_at && v.created_at.startsWith(todayStr)).length;

    // Views per day for last 7 days
    const dailyViews = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      dailyViews[key] = 0;
    }
    rows.forEach(v => {
      if (v.created_at) {
        const day = v.created_at.slice(0, 10);
        if (dailyViews[day] !== undefined) dailyViews[day]++;
      }
    });

    // Top pages
    const pageCounts = {};
    rows.forEach(v => {
      const p = v.page || '/';
      pageCounts[p] = (pageCounts[p] || 0) + 1;
    });
    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([page, count]) => ({ page, count }));

    // Device breakdown
    let desktop = 0, mobile = 0, tablet = 0;
    rows.forEach(v => {
      const ua = (v.user_agent || '').toLowerCase();
      if (/tablet|ipad/i.test(ua)) tablet++;
      else if (/mobile|android|iphone/i.test(ua)) mobile++;
      else desktop++;
    });

    // Recent 20 visits
    const recentVisits = rows.slice(0, 20).map(v => ({
      ip: v.ip,
      page: v.page || '/',
      device: /tablet|ipad/i.test((v.user_agent || '').toLowerCase()) ? 'Tablet'
            : /mobile|android|iphone/i.test((v.user_agent || '').toLowerCase()) ? 'Mobile' : 'Desktop',
      browser: extractBrowser(v.user_agent || ''),
      timestamp: v.created_at
    }));

    return { totalViews, uniqueVisitors, todayViews, dailyViews, topPages, devices: { desktop, mobile, tablet }, recentVisits };
  }
};

// Helper to extract browser name
function extractBrowser(ua) {
  if (/edg/i.test(ua)) return 'Edge';
  if (/opr|opera/i.test(ua)) return 'Opera';
  if (/chrome|crios/i.test(ua)) return 'Chrome';
  if (/firefox|fxios/i.test(ua)) return 'Firefox';
  if (/safari/i.test(ua)) return 'Safari';
  return 'Other';
}
