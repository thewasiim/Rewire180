// ─── CONTENT LOADER — fetch from backend API and apply to page ────────────────
(async function loadDynamicContent() {
    try {
        const res = await fetch('/api/content');
        if (!res.ok) return; // fallback to static HTML if server unreachable
        const data = await res.json();
        applyContent(data);
    } catch (e) {
        // Server offline — static HTML content remains as fallback
        console.log('Content server not reachable, using static content.');
    }
})();

function applyContent(data) {
    for (const [key, item] of Object.entries(data)) {
        const value = item.value;
        if (!value) continue;

        // ── TEXT elements: any element with data-content-key ──────────────────────
        const textEl = document.querySelector(`[data-content-key="${key}"]`);

        // ── VIDEO elements ────────────────────────────────────────────────────────
        if (item.type === 'video') {
            // Direct video element (e.g. review videos that use src directly)
            if (textEl && textEl.tagName === 'VIDEO') {
                textEl.src = value;
                continue;
            }
            // Source element inside a video
            const srcEl = document.querySelector(`source[data-content-key="${key}"]`);
            if (srcEl) {
                srcEl.src = value;
                const videoEl = srcEl.closest('video');
                if (videoEl) videoEl.load();
            }
            continue;
        }

        // ── IMAGE elements ────────────────────────────────────────────────────────
        if (item.type === 'image') {
            if (textEl && textEl.tagName === 'IMG') {
                textEl.src = value;
            }
            continue;
        }

        // ── DYNAMIC LISTS ────────────────────────────────────────────────────────
        if (item.type === 'list_object' && key === 'video_reviews_list') {
            renderVideoReviewsList(value);
            continue;
        }

        if (item.type === 'list_object' && key === 'testimonials_list') {
            renderTestimonialsList(value);
            continue;
        }

        if (item.type === 'list_string' && key === 'photo_reviews_list') {
            renderPhotoReviewsList(value);
            continue;
        }

        // ── TEXT/LINK elements ────────────────────────────────────────────────────
        if (!textEl) continue;

        // Special: method_features — render as a list
        if (key === 'method_features') {
            const listEl = document.getElementById('method-features-list');
            if (listEl) {
                const lines = value.split('\n').filter(l => l.trim());
                listEl.innerHTML = lines.map(l => `<li>${l.trim()}</li>`).join('');
            }
            continue;
        }

        // Special: CTA / button link fields — update href of nearest anchor
        if (key === 'hero_cta_link') {
            document.getElementById('hero-cta-btn')?.setAttribute('href', value);
            continue;
        }
        if (key === 'skills_btn_1') {
            document.getElementById('skills-btn-1')?.setAttribute('href', value);
            continue;
        }
        if (key === 'skills_btn_2') {
            document.getElementById('skills-btn-2')?.setAttribute('href', value);
            continue;
        }
        if (key === 'method_btn_link') {
            document.getElementById('method-cta-btn')?.setAttribute('href', value);
            continue;
        }
        if (key === 'vip_btn_link') {
            document.getElementById('vip-cta-btn')?.setAttribute('href', value);
            continue;
        }

        // Default: set textContent
        textEl.textContent = value;
    }
}

// ─── DYNAMIC SWIPER RENDERING ─────────────────────────────────────────────────
let reviewsSwiperInstance = null;
let videoSwiperInstance = null;
let resizeTimer;

function renderPhotoReviewsList(photosArr) {
    const wrapper = document.querySelector('.reviews-swiper .swiper-wrapper');
    if (!wrapper) return;

    if (reviewsSwiperInstance) {
        reviewsSwiperInstance.destroy(true, true);
        reviewsSwiperInstance = null;
    }

    wrapper.innerHTML = photosArr.map((url, i) => `
    <div class="swiper-slide ss-card">
      <img src="${url}" alt="Review ${i + 1}">
    </div>
  `).join('');

    // Initialize Swiper after DOM update
    reviewsSwiperInstance = new Swiper('.reviews-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        speed: 800,
        grabCursor: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
        },
    });
}

function renderVideoReviewsList(videosArr) {
    const container = document.querySelector('.video-reviews-swiper');
    const wrapper = container ? container.querySelector('.swiper-wrapper') : null;
    if (!wrapper) return;

    if (videoSwiperInstance) {
        videoSwiperInstance.destroy(true, true);
        videoSwiperInstance = null;
        container.classList.remove('swiper', 'swiper-initialized', 'swiper-horizontal');
    }

    wrapper.innerHTML = videosArr.map((rev, i) => `
    <div class="swiper-slide review-stack">
        <div class="review-card text-card">
            <p>${rev.text || ''}</p>
        </div>
        <div class="review-card video-card">
            <video src="${rev.video || ''}" controls preload="metadata"></video>
        </div>
    </div>
  `).join('');

    initVideoReviewsSwiper(videosArr.length);
}

function initVideoReviewsSwiper(totalSlides) {
    const container = document.querySelector('.video-reviews-swiper');
    if (!container) return;

    const isMobile = window.innerWidth <= 768;
    const needsSlider = isMobile ? totalSlides > 2 : totalSlides > 4;

    if (needsSlider) {
        if (!videoSwiperInstance) {
            container.classList.add('swiper', 'swiper-initialized', 'swiper-horizontal');
            videoSwiperInstance = new Swiper('.video-reviews-swiper', {
                slidesPerView: 1,
                spaceBetween: 20,
                grabCursor: true,
                loop: false,
                speed: 400,
                touchRatio: 1,
                touchAngle: 45,
                simulateTouch: true,
                shortSwipes: true,
                longSwipes: true,
                longSwipesRatio: 0.3,
                resistanceRatio: 0.7,
                threshold: 5,
                autoplay: { delay: 4000, disableOnInteraction: true, pauseOnMouseEnter: true },
                pagination: { el: '.video-reviews-pagination', clickable: true },
                navigation: {
                    nextEl: '.video-reviews-swiper .video-swiper-next',
                    prevEl: '.video-reviews-swiper .video-swiper-prev',
                },
                breakpoints: {
                    320: { slidesPerView: 1, spaceBetween: 15 },
                    550: { slidesPerView: 2, spaceBetween: 20 },
                    1024: { slidesPerView: 3, spaceBetween: 24 },
                    1280: { slidesPerView: 4, spaceBetween: 28 },
                },
            });
        }
    } else {
        if (videoSwiperInstance) {
            videoSwiperInstance.destroy(true, true);
            videoSwiperInstance = null;
            container.classList.remove('swiper', 'swiper-initialized', 'swiper-horizontal');
        }
    }
}

// Global resize listener for the conditional video swiper
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const slides = document.querySelectorAll('.video-reviews-swiper .review-stack');
        if (slides.length > 0) initVideoReviewsSwiper(slides.length);
    }, 200);
});
// ─── TESTIMONIALS SLIDER ──────────────────────────────────────────────────────
function renderTestimonialsList(testimonialsArr) {
    const track = document.getElementById('tsTrack');
    if (!track) return;

    const activeTestimonials = (testimonialsArr || []).filter(t => t.active !== false);

    track.innerHTML = activeTestimonials.map(t => `
        <div class="ts-card">
            <div class="ts-badge">${t.badge || ''}</div>
            <div class="ts-quote">&ldquo;</div>
            <p class="ts-text">${t.text || ''}</p>
            <div class="ts-footer">
                <div class="ts-avatar" style="background:${t.color || '#3B82F6'};">
                    ${(t.initials || '').toUpperCase()}
                </div>
                <div>
                    <div class="ts-name">${t.name || ''}</div>
                    <div class="ts-meta">${t.meta || ''}</div>
                    <div class="ts-stars">${t.stars || ''}</div>
                </div>
            </div>
        </div>
    `).join('');

    // Re-initialize slider after DOM update
    initTestimonialsSlider();
}

function initTestimonialsSlider() {
    const track = document.getElementById('tsTrack');
    if (!track) return;

    const cards = track.querySelectorAll('.ts-card');
    const dotsEl = document.getElementById('tsDots');
    let cur = 0;

    function getVisible() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 4;
    }

    function getGap() {
        return window.innerWidth <= 768 ? 0 : 16;
    }

    function buildDots() {
        dotsEl.innerHTML = ''; // reset
        const steps = cards.length - getVisible() + 1;
        for (let i = 0; i < steps; i++) {
            const d = document.createElement('div');
            d.className = 'ts-dot' + (i === 0 ? ' active' : '');
            d.onclick = () => go(i);
            dotsEl.appendChild(d);
        }
    }

    function go(n) {
        const steps = cards.length - getVisible() + 1;
        cur = Math.max(0, Math.min(n, steps - 1));
        const cardW = cards[0].offsetWidth + getGap();
        prevTranslate = -(cur * cardW);
        track.style.transform = `translateX(${prevTranslate}px)`;
        track.style.transition = 'transform 0.3s ease-out';
        dotsEl.querySelectorAll('.ts-dot').forEach((d, i) =>
            d.classList.toggle('active', i === cur)
        );
    }

    document.getElementById('tsPrev').onclick = () => go(cur - 1);
    document.getElementById('tsNext').onclick = () => go(cur + 1);

    buildDots();

    // ── Touch / Drag swipe logic ──────────────────────────────────────────────
    let isDragging = false;
    let startX = 0;
    let startTranslate = 0;
    let dragTranslate = 0;

    // Mouse events
    track.addEventListener('mousedown', onDragStart);
    track.addEventListener('mouseup', onDragEnd);
    track.addEventListener('mouseleave', () => { if (isDragging) onDragEnd(); });
    track.addEventListener('mousemove', onDragMove);

    // Touch events — touchmove is NON-passive so we can preventDefault (stops page scroll during swipe)
    track.addEventListener('touchstart', onDragStart, { passive: true });
    track.addEventListener('touchend', onDragEnd, { passive: true });
    track.addEventListener('touchcancel', onDragEnd, { passive: true });
    track.addEventListener('touchmove', onTouchMove, { passive: false });

    function getX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    function onDragStart(e) {
        isDragging = true;
        startX = getX(e);
        startTranslate = dragTranslate;
        track.style.transition = 'none';
        if (e.type === 'mousedown') track.style.cursor = 'grabbing';
    }

    function onTouchMove(e) {
        if (!isDragging) return;
        const diff = getX(e) - startX;
        // Only block scroll if swiping horizontally
        if (Math.abs(diff) > 5) e.preventDefault();
        dragTranslate = startTranslate + diff;
        track.style.transform = `translateX(${dragTranslate}px)`;
    }

    function onDragMove(e) {
        if (!isDragging) return;
        dragTranslate = startTranslate + (getX(e) - startX);
        track.style.transform = `translateX(${dragTranslate}px)`;
    }

    function onDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        track.style.cursor = 'grab';
        const movedBy = dragTranslate - startTranslate;
        const threshold = 50;
        if (movedBy < -threshold && cur < cards.length - getVisible()) cur += 1;
        else if (movedBy > threshold && cur > 0) cur -= 1;
        go(cur);
        dragTranslate = -(cur * (cards[0].offsetWidth + getGap()));
    }

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            cur = 0;
            buildDots();
            go(0);
            dragTranslate = 0;
        }, 200);
    });
}

document.addEventListener('DOMContentLoaded', initTestimonialsSlider);