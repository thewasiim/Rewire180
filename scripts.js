document.addEventListener('DOMContentLoaded', function () {
    // Existing Reviews Screenshot Swiper
    const swiper = new Swiper('.reviews-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        speed: 800, // ✅ smooth transition
        effect: 'slide', // ✅ slide effect
        grabCursor: true, // ✅ grab cursor
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true, // ✅ pause on hover
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
        },
    });

    // Video Reviews Swiper - Conditional slider logic
    const videoReviewsContainer = document.querySelector('.video-reviews-swiper');
    const videoReviewSlides = videoReviewsContainer ? videoReviewsContainer.querySelectorAll('.review-stack') : [];
    const totalSlides = videoReviewSlides.length;
    let videoSwiperInstance = null;

    function initVideoReviewsSwiper() {
        if (!videoReviewsContainer) return;

        const isMobile = window.innerWidth <= 768;
        const slidesPerViewDesktop = 4;
        const slidesPerViewMobile = 2;

        const needsSlider = isMobile ? totalSlides > slidesPerViewMobile : totalSlides > slidesPerViewDesktop;

        if (needsSlider) {
            if (!videoSwiperInstance) {
                videoReviewsContainer.classList.add('swiper', 'swiper-initialized', 'swiper-horizontal');

                videoSwiperInstance = new Swiper('.video-reviews-swiper', {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    grabCursor: true,
                    touchStartPreventDefault: false,
                    loop: false,
                    speed: 800, // ✅ smooth transition
                    effect: 'slide', // ✅ slide effect
                    cssMode: false, // ✅ disable CSS mode
                    freeMode: false, // ✅ disable free mode
                    resistance: true, // ✅ enable resistance
                    resistanceRatio: 0.85, // ✅ smooth resistance
                    autoplay: {
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true, // ✅ pause on hover
                    },
                    pagination: {
                        el: '.video-reviews-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.video-reviews-next',
                        prevEl: '.video-reviews-prev',
                    },
                    breakpoints: {
                        320: {
                            slidesPerView: 1,
                            spaceBetween: 15,
                        },
                        550: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 24,
                        },
                        1280: {
                            slidesPerView: 4,
                            spaceBetween: 28,
                        },
                    },
                });
                console.log('Video Swiper Initialized');
            }
        } else {
            if (videoSwiperInstance) {
                videoSwiperInstance.destroy(true, true);
                videoSwiperInstance = null;
                videoReviewsContainer.classList.remove('swiper', 'swiper-initialized', 'swiper-horizontal');
                console.log('Video Swiper Destroyed');
            }
        }
    }

    initVideoReviewsSwiper();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initVideoReviewsSwiper, 200);
    });
});