// ─── CONFIG ───────────────────────────────────────────────────────────────────
const TOKEN = localStorage.getItem('adminToken');

// Redirect to login if not authenticated
if (!TOKEN) {
    window.location.href = '/admin/login.html';
}

let contentData = {};
let testimonialsData = [];

// Section key maps
const SECTION_KEYS = {
    hero: ['hero_video', 'hero_eyebrow', 'hero_title', 'hero_subtitle', 'hero_cta_link'],
    skills: ['skills_video_1', 'skills_text_1', 'skills_btn_1', 'skills_video_2', 'skills_text_2', 'skills_btn_2'],
    method_pricing: ['method_title', 'method_subtitle', 'method_features', 'method_price_1', 'method_price_2', 'method_btn_link'],
    vip_pricing: ['vip_title', 'vip_subtitle', 'vip_note', 'vip_description', 'vip_price_uk', 'vip_price_abroad', 'vip_btn_link'],
    video_reviews: ['video_reviews_list'],
    photo_reviews: ['photo_reviews_list']
};

// ─── INIT ─────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
    initSections();
    await loadContent();
    await loadAnalytics();
});

// ─── LOAD CONTENT FROM API ────────────────────────────────────────────────────
async function loadContent() {
    try {
        const res = await fetch('/api/content');
        if (res.status === 401) { logout(); return; }
        const data = await res.json();
        contentData = data;
        populateFields(data);
        initTestimonialsAdmin(data);
    } catch (err) {
        showToast('Failed to load content from server. Is the server running?', 'error');
    }
}

function populateFields(data) {
    if (data.video_reviews_list) buildVideoReviews(data.video_reviews_list.value || []);
    if (data.photo_reviews_list) buildPhotoReviews(data.photo_reviews_list.value || []);

    for (const [key, item] of Object.entries(data)) {
        if (item.type === 'list_string' || item.type === 'list_object') continue;

        const el = document.getElementById(key);
        if (!el) continue;

        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.value = item.value || '';
        }

        // Update current file label
        const currentEl = document.getElementById(`${key}-current`);
        if (currentEl) {
            const filename = item.value ? item.value.split('/').pop() : 'Not set';
            currentEl.textContent = filename;
        }

        // Show preview if it's a media type
        const previewWrap = document.getElementById(`${key}-preview`);
        if (previewWrap && item.value) {
            const mediaEl = previewWrap.querySelector('video, img');
            if (mediaEl) {
                if (mediaEl.tagName === 'VIDEO') mediaEl.src = item.value;
                else mediaEl.src = item.value;
                previewWrap.style.display = 'block';
            }
        }
    }
}

// ─── DYNAMIC: BUILD VIDEO REVIEWS ────────────────────────────────────────────
function buildVideoReviews(reviewsArr) {
    const container = document.getElementById('video-reviews-container');
    if (!reviewsArr) { container.innerHTML = ''; return; }

    container.innerHTML = reviewsArr.map((rev, i) => `
    <div class="review-item">
      <div class="review-item-header">
        <div>
           <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
           Video Review ${i + 1}
        </div>
        <button class="btn" style="background:var(--danger);padding:4px 8px;font-size:12px" onclick="removeReview('video_reviews_list', ${i})">Remove</button>
      </div>
      <div class="fields-grid">
        <div class="field-group field-full">
          <label class="field-label">Review Video</label>
          <div class="upload-zone">
            <input type="file" accept="video/*" onchange="handleListUpload(this, 'video_reviews_list', ${i}, 'video')">
            <div class="upload-label">
              <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <strong>Upload Review Video</strong>
            </div>
            <div class="progress-bar-wrap" id="video_reviews_list_${i}_video-progress"><div class="progress-bar"></div></div>
            <div class="upload-preview" id="video_reviews_list_${i}_video-preview" style="${rev.video ? 'display:block' : 'display:none'}"><video controls src="${rev.video || ''}"></video></div>
          </div>
          <p style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">Current: <span id="video_reviews_list_${i}_video-current" style="color:var(--accent)">${rev.video ? rev.video.split('/').pop() : 'loading...'}</span></p>
        </div>
        <div class="field-group field-full">
          <label class="field-label">Review Text</label>
          <textarea id="video_reviews_list_${i}_text" rows="3" placeholder="Customer review text..." onchange="updateListText('video_reviews_list', ${i}, this.value)">${rev.text || ''}</textarea>
        </div>
      </div>
    </div>
  `).join('');
}

// ─── DYNAMIC: BUILD PHOTO REVIEWS ────────────────────────────────────────────
function buildPhotoReviews(photosArr) {
    const container = document.getElementById('photo-reviews-container');
    if (!photosArr) { container.innerHTML = ''; return; }

    container.innerHTML = `
    <div class="fields-grid">
      ${photosArr.map((filepath, i) => `
        <div class="field-group" style="position:relative; border: 1px solid var(--border); padding: 10px; border-radius: 6px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
            <label class="field-label">Screenshot ${i + 1}</label>
            <button class="btn" style="background:transparent; color:var(--danger); padding:0; height:auto" onclick="removeReview('photo_reviews_list', ${i})">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
          </div>
          <div class="upload-zone">
            <input type="file" accept="image/*" onchange="handleListUpload(this, 'photo_reviews_list', ${i}, 'image')">
            <div class="upload-label">
              <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
            <div class="progress-bar-wrap" id="photo_reviews_list_${i}-progress"><div class="progress-bar"></div></div>
            <div class="upload-preview" id="photo_reviews_list_${i}-preview" style="${filepath ? 'display:block' : 'display:none'}"><img src="${filepath || ''}" alt="Review ${i + 1}"></div>
          </div>
          <p style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">Current: <span id="photo_reviews_list_${i}-current" style="color:var(--accent)">${filepath ? filepath.split('/').pop() : 'loading...'}</span></p>
        </div>
      `).join('')}
    </div>
  `;
}

// ─── LIST MANIPULATION (ADD/REMOVE/UPDATE) ────────────────────────────────────
async function addVideoReview() {
    const newItem = { video: '', text: '' };
    await apiListAdd('video_reviews_list', newItem);
}

async function addPhotoReview() {
    const newItem = '';
    await apiListAdd('photo_reviews_list', newItem);
}

async function removeReview(listKey, index) {
    if (!confirm('Are you sure you want to remove this review?')) return;
    try {
        const res = await fetch(`/api/content/list/${listKey}/${index}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${TOKEN}` }
        });
        if (res.ok) {
            showToast('Item removed', 'success');
            await loadContent(); // Reload everything to redraw DOM
        } else {
            showToast('Failed to remove item', 'error');
        }
    } catch (err) {
        showToast('Network error', 'error');
    }
}

async function apiListAdd(listKey, item) {
    try {
        const res = await fetch(`/api/content/list/${listKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${TOKEN}` },
            body: JSON.stringify({ item })
        });
        if (res.ok) {
            showToast('New item added', 'success');
            await loadContent(); // Reload DOM
        } else {
            showToast('Failed to add item', 'error');
        }
    } catch (err) {
        showToast('Network error', 'error');
    }
}

// Called directly by the textareas in video reviews
function updateListText(listKey, index, textVal) {
    if (contentData[listKey] && Array.isArray(contentData[listKey].value)) {
        contentData[listKey].value[index].text = textVal;
    }
}

// Custom handler for lists (arrays) uploading via Multer
async function handleListUpload(input, listKey, index, mediaType) {
    const file = input.files[0];
    if (!file) return;

    // Use a temporary key for the progress bar wrapping
    const tempKey = mediaType === 'video' ? `${listKey}_${index}_video` : `${listKey}_${index}`;
    const url = await handleUpload(input, 'null', mediaType, tempKey); // pass null contentKey so DB doesn't auto-update

    if (url) {
        // Update the local array and save the whole array back to DB
        if (mediaType === 'video') {
            contentData[listKey].value[index].video = url;
            document.getElementById(`${tempKey}-preview`).querySelector('video').src = url;
        } else {
            contentData[listKey].value[index] = url;
            document.getElementById(`${tempKey}-preview`).querySelector('img').src = url;
        }

        // Auto-save the array
        const updates = {};
        updates[listKey] = contentData[listKey].value;
        await fetch('/api/content/bulk/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${TOKEN}` },
            body: JSON.stringify({ updates })
        });
    }
}

// ─── FILE UPLOAD ──────────────────────────────────────────────────────────────
async function handleUpload(input, contentKey, mediaType, overrideProgressKey = null) {
    const file = input.files[0];
    if (!file) return;

    // Use override if provided (useful for dynamic lists), otherwise default contentKey
    const targetKey = overrideProgressKey || contentKey;
    const progressWrap = document.getElementById(`${targetKey}-progress`);
    const progressBar = progressWrap?.querySelector('.progress-bar');
    const previewWrap = document.getElementById(`${targetKey}-preview`);
    const currentEl = document.getElementById(`${targetKey}-current`);

    // Show progress bar
    if (progressWrap) progressWrap.style.display = 'block';

    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('file', file);
        if (contentKey !== 'null') formData.append('contentKey', contentKey); // only send if not null

        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable && progressBar) {
                progressBar.style.width = `${Math.round((e.loaded / e.total) * 100)}%`;
            }
        });

        xhr.addEventListener('load', () => {
            if (progressWrap) progressWrap.style.display = 'none';
            if (progressBar) progressBar.style.width = '0%';

            if (xhr.status >= 200 && xhr.status < 300) {
                const resp = JSON.parse(xhr.responseText);
                // Update preview
                if (previewWrap) {
                    const mediaEl = previewWrap.querySelector('video, img');
                    if (mediaEl) {
                        mediaEl.src = resp.url;
                        previewWrap.style.display = 'block';
                    }
                }
                if (currentEl) currentEl.textContent = resp.filename;
                showToast(`✅ ${file.name} uploaded successfully!`, 'success');
                resolve(resp.url);
            } else {
                const err = JSON.parse(xhr.responseText);
                showToast(`Upload failed: ${err.error} `, 'error');
                resolve(null);
            }
        });

        xhr.addEventListener('error', () => {
            if (progressWrap) progressWrap.style.display = 'none';
            showToast('Upload failed — network error', 'error');
            resolve(null);
        });

        xhr.open('POST', '/api/upload');
        xhr.setRequestHeader('Authorization', `Bearer ${TOKEN} `);
        xhr.send(formData);
    });
}

// ─── SAVE SECTION ─────────────────────────────────────────────────────────────
async function saveSection(section) {
    const keys = SECTION_KEYS[section];
    if (!keys) { showToast('Unknown section', 'error'); return; }

    const updates = {};
    for (const key of keys) {
        const el = document.getElementById(key);
        if (el) updates[key] = el.value;
    }

    try {
        const res = await fetch('/api/content/bulk/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN} `
            },
            body: JSON.stringify({ updates })
        });

        if (res.status === 401) { logout(); return; }

        const data = await res.json();
        if (data.success) {
            showToast(`✅ Saved! ${data.updated} field(s) updated.`, 'success');
        } else {
            showToast(data.error || 'Save failed', 'error');
        }
    } catch (err) {
        showToast('Cannot reach server. Check if it\'s running.', 'error');
    }
}

// ─── TESTIMONIALS ADMIN ────────────────────────────────────────────────────────
function initTestimonialsAdmin(data) {
    const src = data || contentData || {};
    const item = src.testimonials_list;
    if (item && Array.isArray(item.value)) {
        testimonialsData = item.value.map(t => ({ ...t }));
    } else {
        testimonialsData = [];
    }
    renderTestimonialsAdmin();
}

function renderTestimonialsAdmin() {
    const container = document.getElementById('testimonials-container');
    if (!container) return;

    if (!testimonialsData || testimonialsData.length === 0) {
        container.innerHTML = `
        <div class="empty-state">
            <p style="color:var(--text-muted);font-size:0.9rem;">No testimonials yet. Click "Add Testimonial" to create one.</p>
        </div>
      `;
        return;
    }

    container.innerHTML = testimonialsData.map((t, i) => `
      <div class="review-item">
        <div class="review-item-header">
          <div>
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-3 3-6 8-6s8 3 8 6" />
            </svg>
            Testimonial ${i + 1}
          </div>
          <button class="btn" style="background:var(--danger);padding:4px 8px;font-size:12px" onclick="deleteTestimonial(${i})">Remove</button>
        </div>
        <div class="fields-grid">
          <div class="field-group field-full">
            <label class="field-label">Badge (e.g. 💼 Busy Professional)</label>
            <input type="text" value="${t.badge || ''}" onchange="updateTesti(${i}, 'badge', this.value)">
          </div>
          <div class="field-group field-full">
            <label class="field-label">Quote Text</label>
            <textarea rows="3" onchange="updateTesti(${i}, 'text', this.value)">${t.text || ''}</textarea>
          </div>
          <div class="field-group">
            <label class="field-label">Name</label>
            <input type="text" value="${t.name || ''}" onchange="updateTesti(${i}, 'name', this.value)">
          </div>
          <div class="field-group">
            <label class="field-label">Meta (location · level)</label>
            <input type="text" value="${t.meta || ''}" onchange="updateTesti(${i}, 'meta', this.value)">
          </div>
          <div class="field-group">
            <label class="field-label">Initials</label>
            <input type="text" maxlength="3" value="${t.initials || ''}" oninput="updateTesti(${i}, 'initials', this.value); updateTestiPreview(${i});">
          </div>
          <div class="field-group">
            <label class="field-label">Avatar Color (hex)</label>
            <input type="text" value="${t.color || '#3B82F6'}" oninput="updateTesti(${i}, 'color', this.value); updateTestiPreview(${i});">
            <div class="ts-avatar" id="testi-avatar-${i}" style="margin-top:8px;background:${t.color || '#3B82F6'};">
              ${(t.initials || '').toUpperCase()}
            </div>
          </div>
          <div class="field-group">
            <label class="field-label">Stars</label>
            <input type="text" value="${t.stars || '★★★★★'}" onchange="updateTesti(${i}, 'stars', this.value)">
          </div>
          <div class="field-group">
            <label class="field-label">Active</label>
            <div style="display:flex;align-items:center;gap:8px;">
              <input type="checkbox" ${t.active === false ? '' : 'checked'} onchange="updateTesti(${i}, 'active', this.checked)">
              <span style="font-size:0.8rem;color:var(--text-muted);">Uncheck to hide from live site</span>
            </div>
          </div>
        </div>
      </div>
    `).join('');
}

function updateTesti(index, field, value) {
    if (!testimonialsData[index]) return;
    testimonialsData[index][field] = value;
}

function updateTestiPreview(index) {
    const avatarEl = document.getElementById(`testi-avatar-${index}`);
    if (!avatarEl || !testimonialsData[index]) return;
    const t = testimonialsData[index];
    avatarEl.textContent = (t.initials || '').toUpperCase();
    avatarEl.style.background = t.color || '#3B82F6';
}

function addTestimonial() {
    const blank = {
        badge: '',
        text: '',
        name: '',
        meta: '',
        initials: '',
        color: '#3B82F6',
        stars: '★★★★★',
        active: true
    };
    testimonialsData.push(blank);
    renderTestimonialsAdmin();
}

function deleteTestimonial(index) {
    if (!confirm('Are you sure you want to remove this testimonial?')) return;
    testimonialsData.splice(index, 1);
    renderTestimonialsAdmin();
}

async function saveTestimonials() {
    // Basic validation for active testimonials
    const hexColorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
    for (let i = 0; i < testimonialsData.length; i++) {
        const t = testimonialsData[i];
        if (t.active === false) continue;
        if (!t.text || !t.name) {
            showToast(`Please fill in text and name for testimonial ${i + 1}.`, 'error');
            return;
        }
        if (t.color && !hexColorRegex.test(t.color.trim())) {
            showToast(`Avatar color for testimonial ${i + 1} must be a valid hex (e.g. #3B82F6).`, 'error');
            return;
        }
    }

    try {
        const res = await fetch('/api/content/testimonials_list', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN} `
            },
            body: JSON.stringify({ value: testimonialsData })
        });

        if (res.status === 401) { logout(); return; }

        const data = await res.json();
        if (data && data.success) {
            showToast('✅ Testimonials saved successfully!', 'success');
            await loadContent();
        } else {
            showToast(data.error || 'Failed to save testimonials', 'error');
        }
    } catch (err) {
        showToast('Cannot reach server. Check if it\'s running.', 'error');
    }
}

// ─── UI HELPERS ───────────────────────────────────────────────────────────────
function togglePanel(header) {
    const body = header.nextElementSibling;
    const toggle = header.querySelector('.panel-toggle');
    body.classList.toggle('open');
    toggle.classList.toggle('open');
}

// ─── TAB-BASED SECTION NAVIGATION ────────────────────────────────────────────
function showSection(id, linkEl) {
    // Prevent default anchor behavior
    if (event) event.preventDefault();

    // Hide all section panels
    document.querySelectorAll('.section-panel').forEach(panel => {
        panel.style.display = 'none';
    });

    // Show the selected panel
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
        // Auto-open the panel body
        const body = target.querySelector('.panel-body');
        const toggle = target.querySelector('.panel-toggle');
        if (body) body.classList.add('open');
        if (toggle) toggle.classList.add('open');
    }

    // Update sidebar active state
    document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
    if (linkEl) {
        linkEl.classList.add('active');
    }

    // Close mobile sidebar
    if (window.innerWidth <= 900) {
        document.getElementById('sidebar').classList.remove('open');
    }

    // Scroll to top
    window.scrollTo({ top: 0 });
}

// Initialize: show only the first section (analytics) on page load
function initSections() {
    const panels = document.querySelectorAll('.section-panel');
    panels.forEach((panel, i) => {
        if (i === 0) {
            panel.style.display = 'block';
        } else {
            panel.style.display = 'none';
        }
    });
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// Click outside sidebar to close (mobile)
document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.getElementById('hamburgerAdmin');
    if (window.innerWidth <= 900 && sidebar.classList.contains('open')) {
        if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    }
});

// ─── MODALS ───────────────────────────────────────────────────────────────────
function openModal() {
    document.getElementById('changePwModal').classList.add('open');
}

function closeModal() {
    document.getElementById('changePwModal').classList.remove('open');
    document.getElementById('currentPw').value = '';
    document.getElementById('newPw').value = '';
    document.getElementById('confirmPw').value = '';
}

async function changePassword() {
    const currentPw = document.getElementById('currentPw').value;
    const newPw = document.getElementById('newPw').value;
    const confirmPw = document.getElementById('confirmPw').value;

    if (!currentPw) {
        showToast('Current password is required', 'error'); return;
    }
    if (newPw.length < 6) {
        showToast('New password must be at least 6 characters', 'error'); return;
    }
    if (newPw !== confirmPw) {
        showToast('New passwords do not match', 'error'); return;
    }

    try {
        const res = await fetch('/api/auth/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN} `
            },
            body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw })
        });

        const data = await res.json();
        if (res.ok) {
            showToast('✅ Password changed successfully!', 'success');
            closeModal();
        } else {
            showToast(data.error || 'Failed to change password', 'error');
        }
    } catch {
        showToast('Cannot reach server', 'error');
    }
}

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login.html';
}

// ─── TOAST SYSTEM ─────────────────────────────────────────────────────────────
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const icons = {
        success: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        error: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        warning: '<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.success}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
async function loadAnalytics() {
    try {
        const res = await fetch('/api/analytics', {
            headers: { 'Authorization': `Bearer ${TOKEN}` }
        });
        if (res.status === 401) return;
        const data = await res.json();
        renderAnalytics(data);
    } catch (err) {
        console.warn('Analytics load failed:', err);
    }
}

function renderAnalytics(data) {
    // Stat cards
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setVal('stat-total-views', data.totalViews.toLocaleString());
    setVal('stat-unique-visitors', data.uniqueVisitors.toLocaleString());
    setVal('stat-today-views', data.todayViews.toLocaleString());

    // Bar chart (last 7 days)
    const barChart = document.getElementById('analytics-bar-chart');
    if (barChart && data.dailyViews) {
        const entries = Object.entries(data.dailyViews);
        const maxVal = Math.max(...entries.map(e => e[1]), 1);
        barChart.innerHTML = entries.map(([date, count]) => {
            const pct = Math.max((count / maxVal) * 100, 3);
            const dayName = new Date(date + 'T00:00:00').toLocaleDateString('en', { weekday: 'short' });
            return `
                <div class="bar-col">
                    <div class="bar-value">${count}</div>
                    <div class="bar" style="height:${pct}%"></div>
                    <div class="bar-label">${dayName}</div>
                </div>`;
        }).join('');
    }

    // Device breakdown
    const devicesEl = document.getElementById('analytics-devices');
    if (devicesEl && data.devices) {
        const total = Math.max(data.devices.desktop + data.devices.mobile + data.devices.tablet, 1);
        const items = [
            { name: 'Desktop', icon: '🖥️', count: data.devices.desktop, color: 'var(--accent)' },
            { name: 'Mobile', icon: '📱', count: data.devices.mobile, color: '#EC4899' },
            { name: 'Tablet', icon: '📟', count: data.devices.tablet, color: 'var(--gold)' }
        ];
        devicesEl.innerHTML = items.map(d => `
            <div class="device-row">
                <div class="device-icon">${d.icon}</div>
                <div class="device-info">
                    <div class="device-name">${d.name}</div>
                    <div class="device-bar-wrap">
                        <div class="device-bar-fill" style="width:${(d.count / total) * 100}%;background:${d.color}"></div>
                    </div>
                </div>
                <div class="device-count">${d.count}</div>
            </div>`).join('');
    }

    // Top pages
    const topPagesEl = document.getElementById('analytics-top-pages');
    if (topPagesEl && data.topPages) {
        const maxPage = Math.max(...data.topPages.map(p => p.count), 1);
        if (data.topPages.length === 0) {
            topPagesEl.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;">No page data yet.</p>';
        } else {
            topPagesEl.innerHTML = data.topPages.map(p => `
                <div class="top-page-item">
                    <div class="top-page-name">${p.page}</div>
                    <div class="top-page-bar-wrap">
                        <div class="top-page-bar-fill" style="width:${(p.count / maxPage) * 100}%"></div>
                    </div>
                    <div class="top-page-count">${p.count}</div>
                </div>`).join('');
        }
    }

    // Recent visits table
    const tableBody = document.querySelector('#analytics-recent-table tbody');
    if (tableBody && data.recentVisits) {
        if (data.recentVisits.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);">No visits recorded yet.</td></tr>';
        } else {
            tableBody.innerHTML = data.recentVisits.map(v => {
                const dt = new Date(v.timestamp);
                const time = dt.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
                const deviceClass = v.device.toLowerCase();
                return `
                    <tr>
                        <td>${time}</td>
                        <td>${v.page}</td>
                        <td><span class="device-badge ${deviceClass}">${v.device}</span></td>
                        <td>${v.browser}</td>
                        <td style="color:var(--text-muted)">${v.ip}</td>
                    </tr>`;
            }).join('');
        }
    }
}
