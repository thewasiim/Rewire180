
document.addEventListener('DOMContentLoaded', function () {
    // Existing Reviews Screenshot Swiper
    const swiper = new Swiper('.reviews-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
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
    // Select all slides (review-stack elements)
    const videoReviewSlides = videoReviewsContainer ? videoReviewsContainer.querySelectorAll('.review-stack') : [];
    const totalSlides = videoReviewSlides.length;
    let videoSwiperInstance = null;

    function initVideoReviewsSwiper() {
        if (!videoReviewsContainer) return;

        const isMobile = window.innerWidth <= 768; // Mobile breakpoint
        const slidesPerViewDesktop = 4;
        const slidesPerViewMobile = 2;

        // Logic:
        // Desktop: Slider active if > 4 items
        // Mobile: Slider active if > 2 items
        const needsSlider = isMobile ? totalSlides > slidesPerViewMobile : totalSlides > slidesPerViewDesktop;

        if (needsSlider) {
            // We need a slider
            if (!videoSwiperInstance) {
                videoReviewsContainer.classList.add('swiper', 'swiper-initialized', 'swiper-horizontal');

                videoSwiperInstance = new Swiper('.video-reviews-swiper', {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    // Ensure smooth touch interaction
                    grabCursor: true,
                    touchStartPreventDefault: false,
                    // Loop only if we have enough slides to loop smoothly, or just set to false if simplify
                    loop: false,
                    autoplay: {
                        delay: 4000,
                        disableOnInteraction: false,
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
                        // Mobile/Tablet
                        320: {
                            slidesPerView: 1,
                            spaceBetween: 15,
                        },
                        550: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        // Desktop
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
            // We do NOT need a slider -> Destroy if exists
            if (videoSwiperInstance) {
                videoSwiperInstance.destroy(true, true);
                videoSwiperInstance = null;

                // Remove swiper classes to restore grid/stack layout
                videoReviewsContainer.classList.remove('swiper', 'swiper-initialized', 'swiper-horizontal');
                console.log('Video Swiper Destroyed');
            }
        }
    }

    // Run on load
    initVideoReviewsSwiper();

    // Run on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initVideoReviewsSwiper, 200);
    });
});
