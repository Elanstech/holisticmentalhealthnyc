/**
 * ================================================
 * HOLISTIC MENTAL HEALTH SERVICES
 * Complete Optimized JavaScript - All Features
 * ================================================
 */

// =========================
// 1. ENHANCED PROGRESS NAVIGATION
// =========================
class EnhancedProgressNavigation {
    constructor() {
        this.header = document.getElementById('progressHeader');
        this.pageProgressFill = document.querySelector('.page-progress-fill');
        this.progressLineFill = document.querySelector('.progress-line-fill');
        this.mobileProgressLine = document.querySelector('.mobile-progress-line');
        this.navDots = document.querySelectorAll('.nav-dot');
        this.mobileDots = document.querySelectorAll('.mobile-dot');
        this.mobileSectionLabel = document.querySelector('.mobile-section-label');
        this.mobileSectionCount = document.querySelector('.mobile-section-count');
        
        this.sections = [];
        this.currentSection = null;
        this.offsetThreshold = 100;
        
        if (this.header) this.init();
    }

    init() {
        this.setupSections();
        this.setupScrollProgress();
        this.setupActiveSectionDetection();
        this.setupSmoothScrolling();
        this.setupHeaderScroll();
        this.addMobileProgressStyles();
        this.updateActiveSection();
    }

    setupSections() {
        this.navDots.forEach(dot => {
            const target = dot.getAttribute('data-target');
            const element = document.getElementById(target);
            
            if (element) {
                this.sections.push({
                    id: target,
                    element: element,
                    navDot: dot,
                    mobileDot: document.querySelector(`.mobile-dot[data-target="${target}"]`),
                    label: dot.querySelector('.dot-label') ? 
                           dot.querySelector('.dot-label').textContent : 
                           target.charAt(0).toUpperCase() + target.slice(1)
                });
            }
        });
    }

    addMobileProgressStyles() {
        if (!document.getElementById('mobile-progress-dynamic')) {
            const style = document.createElement('style');
            style.id = 'mobile-progress-dynamic';
            style.textContent = `
                .mobile-progress-line::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    width: 0%;
                    background: linear-gradient(90deg, #5DBBC3, #7B88C4);
                    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                    border-radius: 2px;
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupScrollProgress() {
        const updateProgress = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.pageYOffset;
            const progress = Math.min((scrolled / documentHeight) * 100, 100);
            
            if (this.pageProgressFill) {
                this.pageProgressFill.style.width = `${progress}%`;
            }
        };

        updateProgress();
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateProgress();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    setupActiveSectionDetection() {
        const detectActive = () => {
            const scrollPosition = window.pageYOffset + this.offsetThreshold;
            let activeSection = null;
            let activeSectionIndex = 0;

            for (let i = this.sections.length - 1; i >= 0; i--) {
                const section = this.sections[i];
                const sectionTop = section.element.offsetTop;
                
                if (scrollPosition >= sectionTop) {
                    activeSection = section;
                    activeSectionIndex = i;
                    break;
                }
            }

            if (activeSection && activeSection.id !== this.currentSection) {
                this.currentSection = activeSection.id;
                this.updateNavigationState(activeSection, activeSectionIndex);
            }
        };

        detectActive();
        let scrollTicking = false;
        window.addEventListener('scroll', () => {
            if (!scrollTicking) {
                window.requestAnimationFrame(() => {
                    detectActive();
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        }, { passive: true });
    }

    updateNavigationState(activeSection, activeIndex) {
        const totalSections = this.sections.length;
        const progress = totalSections > 1 ? (activeIndex / (totalSections - 1)) * 100 : 0;
        
        if (this.progressLineFill) {
            this.progressLineFill.style.width = `${progress}%`;
        }
        
        if (this.mobileProgressLine) {
            const mobileProgressStyle = document.getElementById('mobile-progress-dynamic');
            if (mobileProgressStyle) {
                mobileProgressStyle.textContent = `
                    .mobile-progress-line::after {
                        content: '';
                        position: absolute;
                        left: 0;
                        top: 0;
                        height: 100%;
                        width: ${progress}%;
                        background: linear-gradient(90deg, #5DBBC3, #7B88C4);
                        transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                        border-radius: 2px;
                    }
                `;
            }
        }

        this.sections.forEach((section, index) => {
            const isActive = section.id === activeSection.id;
            const isCompleted = index < activeIndex;

            if (section.navDot) {
                section.navDot.classList.toggle('active', isActive);
                section.navDot.classList.toggle('completed', isCompleted);
            }

            if (section.mobileDot) {
                section.mobileDot.classList.toggle('active', isActive);
                section.mobileDot.classList.toggle('completed', isCompleted);
            }
        });

        if (this.mobileSectionLabel) {
            this.mobileSectionLabel.textContent = activeSection.label;
        }
        
        if (this.mobileSectionCount) {
            this.mobileSectionCount.textContent = `${activeIndex + 1} / ${totalSections}`;
        }
    }

    setupSmoothScrolling() {
        const scrollToSection = (target) => {
            const element = document.getElementById(target);
            if (!element) return;
            const offsetPosition = element.offsetTop - 80;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        };

        this.navDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                scrollToSection(dot.getAttribute('data-target'));
            });
        });

        this.mobileDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                scrollToSection(dot.getAttribute('data-target'));
            });
        });
    }

    setupHeaderScroll() {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 50) {
                this.header.classList.add('header-scrolled');
            } else {
                this.header.classList.remove('header-scrolled');
            }
        }, { passive: true });
    }

    updateActiveSection() {
        setTimeout(() => {
            window.dispatchEvent(new Event('scroll'));
        }, 100);
    }

    refreshPositions() {
        this.sections.forEach(section => {
            section.offset = section.element.offsetTop;
        });
        this.updateActiveSection();
    }
}

// =========================
// 2. OPTIMIZED HERO VIDEO
// =========================
class OptimizedHeroVideo {
    constructor() {
        this.video = document.querySelector('.hero-bg-video');
        this.videoContainer = document.querySelector('.hero-video-container');
        this.hero = document.querySelector('.hero');
        this.placeholder = document.querySelector('.hero-placeholder');
        
        this.hasLoaded = false;
        this.isVisible = false;
        
        if (this.video && this.hero) this.init();
    }

    init() {
        if (this.isMobile()) {
            this.skipVideoOnMobile();
            return;
        }

        this.setupIntersectionObserver();
        this.setupVideoHandlers();
        this.prefetchVideo();
    }

    isMobile() {
        return window.innerWidth <= 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    skipVideoOnMobile() {
        if (this.videoContainer) this.videoContainer.style.display = 'none';
        if (this.placeholder) this.placeholder.style.display = 'none';
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasLoaded) {
                    this.loadVideo();
                    this.isVisible = true;
                } else {
                    this.isVisible = false;
                    if (this.hasLoaded && this.video) this.video.pause();
                }
            });
        }, { threshold: 0.25, rootMargin: '50px' });

        observer.observe(this.hero);
    }

    loadVideo() {
        if (this.hasLoaded) return;
        this.hasLoaded = true;
        
        this.video.play().catch(error => {
            this.video.muted = true;
            this.video.play().catch(e => this.handleVideoError());
        });
    }

    setupVideoHandlers() {
        this.video.addEventListener('canplaythrough', () => {
            if (this.videoContainer) this.videoContainer.style.opacity = '1';
        }, { once: true });

        this.video.addEventListener('playing', () => {
            if (this.placeholder) {
                setTimeout(() => this.placeholder.remove(), 500);
            }
        }, { once: true });

        this.video.addEventListener('error', () => this.handleVideoError());

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.video.pause();
            } else if (this.isVisible && this.hasLoaded) {
                this.video.play().catch(() => {});
            }
        });
    }

    prefetchVideo() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            if (connection.effectiveType !== '4g' || connection.saveData) {
                this.video.preload = 'metadata';
            }
        }
    }

    handleVideoError() {
        if (this.videoContainer) this.videoContainer.style.display = 'none';
        if (this.placeholder) {
            this.placeholder.style.animation = 'none';
            this.placeholder.style.opacity = '1';
        }
    }
}

// =========================
// 3. STATISTICS COUNTER
// =========================
class StatisticsCounter {
    constructor() {
        this.statNumbers = document.querySelectorAll('.stat-number');
        this.animated = new Set();
        if (this.statNumbers.length > 0) this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animateNumber(entry.target);
                    this.animated.add(entry.target);
                }
            });
        }, { threshold: 0.5 });
        this.statNumbers.forEach(stat => observer.observe(stat));
    }

    animateNumber(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateNumber = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = target;
            }
        };
        updateNumber();
    }
}

// =========================
// 4. SERVICES CAROUSEL
// =========================
class ServicesCarousel {
    constructor() {
        this.carousel = document.getElementById('servicesCarousel');
        this.cards = document.querySelectorAll('.service-carousel-card');
        this.prevBtn = document.getElementById('servicesPrev');
        this.nextBtn = document.getElementById('servicesNext');
        this.indicatorsContainer = document.getElementById('servicesIndicators');
        
        this.currentIndex = 0;
        this.totalCards = this.cards.length;
        this.cardsPerView = this.getCardsPerView();
        this.autoplayInterval = null;
        this.autoplayDelay = 5000;
        
        if (this.carousel && this.cards.length > 0) this.init();
    }

    init() {
        this.createIndicators();
        this.setupEventListeners();
        this.updateCarousel();
        this.startAutoplay();
        this.setupResponsive();
    }

    getCardsPerView() {
        const width = window.innerWidth;
        if (width <= 768) return 1;
        if (width <= 1200) return 2;
        return 3;
    }

    createIndicators() {
        const totalSlides = Math.ceil(this.totalCards / this.cardsPerView);
        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('carousel-indicator');
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => {
                this.goToSlide(i);
                this.resetAutoplay();
            });
            this.indicatorsContainer.appendChild(indicator);
        }
        this.indicators = Array.from(this.indicatorsContainer.children);
    }

    setupEventListeners() {
        this.prevBtn?.addEventListener('click', () => { this.prevSlide(); this.resetAutoplay(); });
        this.nextBtn?.addEventListener('click', () => { this.nextSlide(); this.resetAutoplay(); });

        let startX = 0;
        this.carousel.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
        this.carousel.addEventListener('touchend', (e) => {
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? this.nextSlide() : this.prevSlide();
                this.resetAutoplay();
            }
        }, { passive: true });

        this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoplay());
    }

    goToSlide(index) {
        const maxIndex = Math.ceil(this.totalCards / this.cardsPerView) - 1;
        this.currentIndex = Math.max(0, Math.min(index, maxIndex));
        this.updateCarousel();
    }

    nextSlide() {
        const maxIndex = Math.ceil(this.totalCards / this.cardsPerView) - 1;
        this.currentIndex = (this.currentIndex + 1) > maxIndex ? 0 : this.currentIndex + 1;
        this.updateCarousel();
    }

    prevSlide() {
        const maxIndex = Math.ceil(this.totalCards / this.cardsPerView) - 1;
        this.currentIndex = (this.currentIndex - 1) < 0 ? maxIndex : this.currentIndex - 1;
        this.updateCarousel();
    }

    updateCarousel() {
        const cardWidth = this.cards[0].offsetWidth;
        const gap = 32;
        const offset = -(this.currentIndex * this.cardsPerView * (cardWidth + gap));
        this.carousel.style.transform = `translateX(${offset}px)`;
        this.indicators.forEach((ind, i) => ind.classList.toggle('active', i === this.currentIndex));
    }

    setupResponsive() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const newCardsPerView = this.getCardsPerView();
                if (newCardsPerView !== this.cardsPerView) {
                    this.cardsPerView = newCardsPerView;
                    this.indicatorsContainer.innerHTML = '';
                    this.createIndicators();
                    this.currentIndex = 0;
                    this.updateCarousel();
                }
            }, 250);
        });
    }

    startAutoplay() { this.autoplayInterval = setInterval(() => this.nextSlide(), this.autoplayDelay); }
    stopAutoplay() { clearInterval(this.autoplayInterval); }
    resetAutoplay() { this.stopAutoplay(); this.startAutoplay(); }
}

// =========================
// 5. SERVICE MODAL SYSTEM
// =========================
class ServiceModalSystem {
    constructor() {
        this.modal = document.getElementById('serviceModal');
        this.modalContentWrapper = document.getElementById('modalContentWrapper');
        this.modalCloseBtn = document.getElementById('modalCloseBtn');
        this.modalOverlay = this.modal ? this.modal.querySelector('.modal-overlay') : null;
        this.learnMoreButtons = document.querySelectorAll('.service-learn-more');
        
        this.isOpen = false;
        this.scrollPosition = 0;
        
        if (this.modal) this.init();
    }

    init() {
        this.learnMoreButtons.forEach(btn => {
            btn.addEventListener('click', () => this.openModal(btn.getAttribute('data-modal')));
        });
        if (this.modalCloseBtn) this.modalCloseBtn.addEventListener('click', () => this.closeModal());
        if (this.modalOverlay) this.modalOverlay.addEventListener('click', () => this.closeModal());
        
        const modalContainer = this.modal.querySelector('.modal-container');
        if (modalContainer) modalContainer.addEventListener('click', (e) => e.stopPropagation());
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.closeModal();
        });
    }

    openModal(modalId) {
        const template = document.getElementById(`modal-${modalId}`);
        if (!template) return;

        const content = template.cloneNode(true);
        content.style.display = 'block';
        this.modalContentWrapper.innerHTML = '';
        this.modalContentWrapper.appendChild(content);

        this.scrollPosition = window.pageYOffset;
        document.body.style.cssText = `overflow:hidden;position:fixed;top:-${this.scrollPosition}px;width:100%`;
        this.modal.classList.add('active');
        this.isOpen = true;

        const sections = this.modalContentWrapper.querySelectorAll('.modal-section, .modal-conditions');
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            setTimeout(() => {
                section.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 100 + (index * 80));
        });

        const ctaBtn = content.querySelector('.modal-cta-btn');
        if (ctaBtn) {
            ctaBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
                setTimeout(() => {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }, 400);
            });
        }
    }

    closeModal() {
        this.isOpen = false;
        const sections = this.modalContentWrapper.querySelectorAll('.modal-section, .modal-conditions');
        sections.forEach((section, i) => {
            setTimeout(() => {
                section.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
            }, i * 30);
        });

        setTimeout(() => {
            this.modal.classList.remove('active');
            document.body.style.cssText = '';
            window.scrollTo(0, this.scrollPosition);
            this.modalContentWrapper.innerHTML = '';
        }, 300);
    }
}

// =========================
// 6. FAQ SECTION
// =========================
class FAQSection {
    constructor() {
        this.faqSection = document.querySelector('.faq-section');
        this.categoryButtons = document.querySelectorAll('.faq-category-btn');
        this.faqItems = document.querySelectorAll('.faq-item');
        this.faqQuestions = document.querySelectorAll('.faq-question');
        
        this.activeCategory = 'all';
        this.openItems = new Set();
        
        if (this.faqSection) this.init();
    }

    init() {
        this.setupCategoryFiltering();
        this.setupAccordion();
        this.setupKeyboardNavigation();
    }

    setupCategoryFiltering() {
        this.categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');
                this.filterByCategory(category);
                this.updateActiveButton(button);
            });
        });
    }

    filterByCategory(category) {
        this.activeCategory = category;
        this.closeAllItems();
        
        this.faqItems.forEach((item, index) => {
            const itemCategory = item.getAttribute('data-category');
            const shouldShow = category === 'all' || itemCategory === category;
            
            if (shouldShow) {
                setTimeout(() => {
                    item.classList.remove('hidden');
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    
                    requestAnimationFrame(() => {
                        item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    });
                }, index * 50);
            } else {
                item.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.opacity = '0';
                item.style.transform = 'translateY(-10px)';
                setTimeout(() => item.classList.add('hidden'), 300);
            }
        });
    }

    updateActiveButton(activeButton) {
        this.categoryButtons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }

    setupAccordion() {
        this.faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.closest('.faq-item');
                this.toggleItem(faqItem);
            });
        });
    }

    toggleItem(item) {
        const isOpen = item.classList.contains('active');
        isOpen ? this.closeItem(item) : this.openItem(item);
    }

    openItem(item) {
        item.classList.add('active');
        this.openItems.add(item);
        
        const answer = item.querySelector('.faq-answer');
        const content = item.querySelector('.faq-answer-content');
        
        if (answer && content) {
            const contentHeight = content.scrollHeight;
            answer.style.maxHeight = `${contentHeight + 50}px`;
        }
    }

    closeItem(item) {
        item.classList.remove('active');
        this.openItems.delete(item);
        
        const answer = item.querySelector('.faq-answer');
        if (answer) answer.style.maxHeight = '0';
    }

    closeAllItems() {
        this.faqItems.forEach(item => {
            if (item.classList.contains('active')) this.closeItem(item);
        });
    }

    setupKeyboardNavigation() {
        this.faqQuestions.forEach((question) => {
            question.addEventListener('keydown', (e) => {
                const faqItem = question.closest('.faq-item');
                
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleItem(faqItem);
                }
            });
            
            question.setAttribute('tabindex', '0');
            question.setAttribute('role', 'button');
        });
    }
}

// =========================
// 7. TEAM CAROUSEL
// =========================
class TeamCarousel {
    constructor() {
        this.carousel = document.getElementById('teamCarousel');
        this.cards = document.querySelectorAll('.team-card');
        this.prevBtn = document.getElementById('teamPrev');
        this.nextBtn = document.getElementById('teamNext');
        this.indicatorsContainer = document.getElementById('teamIndicators');
        
        this.currentIndex = 0;
        this.totalCards = this.cards.length;
        this.cardsPerView = this.getCardsPerView();
        this.autoplayInterval = null;
        this.autoplayDelay = 5000;
        this.isTransitioning = false;
        
        if (this.carousel && this.cards.length > 0) this.init();
    }

    init() {
        this.createIndicators();
        this.setupEventListeners();
        this.setupResponsive();
        this.updateCarousel();
        this.startAutoplay();
    }

    getCardsPerView() {
        const width = window.innerWidth;
        if (width <= 768) return 1;
        if (width <= 1200) return 2;
        return 3;
    }

    createIndicators() {
        this.indicatorsContainer.innerHTML = '';
        const totalSlides = Math.ceil(this.totalCards / this.cardsPerView);
        
        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('team-indicator');
            if (i === 0) indicator.classList.add('active');
            
            indicator.addEventListener('click', () => {
                this.goToSlide(i);
                this.resetAutoplay();
            });
            
            this.indicatorsContainer.appendChild(indicator);
        }
        
        this.indicators = Array.from(this.indicatorsContainer.children);
    }

    setupEventListeners() {
        this.prevBtn?.addEventListener('click', () => {
            if (!this.isTransitioning) {
                this.prevSlide();
                this.resetAutoplay();
            }
        });
        
        this.nextBtn?.addEventListener('click', () => {
            if (!this.isTransitioning) {
                this.nextSlide();
                this.resetAutoplay();
            }
        });

        let startX = 0;
        let isDragging = false;
        
        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.stopAutoplay();
        }, { passive: true });
        
        this.carousel.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            const diff = startX - e.changedTouches[0].clientX;
            
            if (Math.abs(diff) > 80) {
                diff > 0 ? this.nextSlide() : this.prevSlide();
            } else {
                this.updateCarousel();
            }
            
            this.resetAutoplay();
        }, { passive: true });

        this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoplay());
    }

    goToSlide(index) {
        if (this.isTransitioning) return;
        const maxIndex = Math.ceil(this.totalCards / this.cardsPerView) - 1;
        this.currentIndex = Math.max(0, Math.min(index, maxIndex));
        this.updateCarousel();
    }

    nextSlide() {
        if (this.isTransitioning) return;
        const maxIndex = Math.ceil(this.totalCards / this.cardsPerView) - 1;
        this.currentIndex = (this.currentIndex + 1) > maxIndex ? 0 : this.currentIndex + 1;
        this.updateCarousel();
    }

    prevSlide() {
        if (this.isTransitioning) return;
        const maxIndex = Math.ceil(this.totalCards / this.cardsPerView) - 1;
        this.currentIndex = (this.currentIndex - 1) < 0 ? maxIndex : this.currentIndex - 1;
        this.updateCarousel();
    }

    updateCarousel() {
        this.isTransitioning = true;
        
        const cardWidth = this.cards[0].offsetWidth;
        const gap = 32;
        const offset = -(this.currentIndex * this.cardsPerView * (cardWidth + gap));
        
        this.carousel.style.transform = `translateX(${offset}px)`;
        
        this.indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === this.currentIndex);
        });

        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }

    setupResponsive() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const newCardsPerView = this.getCardsPerView();
                if (newCardsPerView !== this.cardsPerView) {
                    this.cardsPerView = newCardsPerView;
                    this.indicatorsContainer.innerHTML = '';
                    this.createIndicators();
                    this.currentIndex = 0;
                    this.updateCarousel();
                }
            }, 250);
        });
    }

    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => this.nextSlide(), this.autoplayDelay);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
}

// =========================
// 8. TESTIMONIALS SLIDER
// =========================
class TestimonialsSlider {
    constructor() {
        this.track = document.getElementById('testimonialsTrack');
        this.cards = document.querySelectorAll('.testimonial-card');
        this.prevBtn = document.getElementById('testimonialPrev');
        this.nextBtn = document.getElementById('testimonialNext');
        this.dotsContainer = document.getElementById('testimonialDots');
        
        this.currentIndex = 0;
        this.totalCards = this.cards.length;
        this.autoplayInterval = null;
        this.autoplayDelay = 7000;
        this.isTransitioning = false;
        
        if (this.track && this.cards.length > 0) this.init();
    }

    init() {
        this.createDots();
        this.setupEventListeners();
        this.updateSlider();
        this.startAutoplay();
    }

    createDots() {
        this.dotsContainer.innerHTML = '';
        for (let i = 0; i < this.totalCards; i++) {
            const dot = document.createElement('div');
            dot.classList.add('testimonial-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => { 
                this.goToSlide(i); 
                this.resetAutoplay(); 
            });
            this.dotsContainer.appendChild(dot);
        }
        this.dots = Array.from(this.dotsContainer.children);
    }

    setupEventListeners() {
        this.prevBtn?.addEventListener('click', () => { 
            if (!this.isTransitioning) {
                this.prevSlide(); 
                this.resetAutoplay();
            }
        });
        
        this.nextBtn?.addEventListener('click', () => { 
            if (!this.isTransitioning) {
                this.nextSlide(); 
                this.resetAutoplay();
            }
        });

        let startX = 0;
        let isDragging = false;
        
        this.track.addEventListener('touchstart', (e) => { 
            startX = e.touches[0].clientX;
            isDragging = true;
            this.stopAutoplay();
        }, { passive: true });
        
        this.track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            const diff = startX - e.changedTouches[0].clientX;
            
            if (Math.abs(diff) > 80) {
                diff > 0 ? this.nextSlide() : this.prevSlide();
            } else {
                this.updateSlider();
            }
            
            this.resetAutoplay();
        }, { passive: true });

        this.track.addEventListener('mouseenter', () => this.stopAutoplay());
        this.track.addEventListener('mouseleave', () => this.startAutoplay());
    }

    goToSlide(index) {
        if (this.isTransitioning) return;
        this.currentIndex = Math.max(0, Math.min(index, this.totalCards - 1));
        this.updateSlider();
    }

    nextSlide() {
        if (this.isTransitioning) return;
        this.currentIndex = (this.currentIndex + 1) >= this.totalCards ? 0 : this.currentIndex + 1;
        this.updateSlider();
    }

    prevSlide() {
        if (this.isTransitioning) return;
        this.currentIndex = (this.currentIndex - 1) < 0 ? this.totalCards - 1 : this.currentIndex - 1;
        this.updateSlider();
    }

    updateSlider() {
        this.isTransitioning = true;
        
        const cardWidth = this.cards[0].offsetWidth;
        const computedStyle = window.getComputedStyle(this.track);
        const gap = parseInt(computedStyle.gap) || 32;
        const offset = -(this.currentIndex * (cardWidth + gap));
        
        this.track.style.transform = `translateX(${offset}px)`;
        
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentIndex);
        });

        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }

    startAutoplay() { 
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => this.nextSlide(), this.autoplayDelay); 
    }
    
    stopAutoplay() { 
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    resetAutoplay() { 
        this.stopAutoplay(); 
        this.startAutoplay(); 
    }
}

// =========================
// 9. CONTACT FORM HANDLER
// =========================
class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = document.querySelector('.submit-btn');
        if (this.form) this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupFormSubmission();
        this.setupPhoneFormatting();
    }

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true, errorMessage = '';

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        } else if (field.type === 'tel' && value && !/^[\d\s\-\+\(\)]{10,}$/.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }

        isValid ? this.clearFieldError(field) : this.showFieldError(field, errorMessage);
        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        field.style.borderColor = '#EF4444';
        const errorEl = document.createElement('span');
        errorEl.className = 'error-message';
        errorEl.style.cssText = 'display:block;color:#EF4444;font-size:13px;margin-top:6px;';
        errorEl.textContent = message;
        field.parentElement.appendChild(errorEl);
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        field.parentElement.querySelector('.error-message')?.remove();
    }

    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const requiredFields = this.form.querySelectorAll('[required]');
            let allValid = true;
            requiredFields.forEach(field => { if (!this.validateField(field)) allValid = false; });

            if (!allValid) {
                this.showNotification('Please fill in all required fields correctly.', 'error');
                return;
            }

            this.submitBtn.disabled = true;
            this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';

            const data = {
                firstName: document.getElementById('firstName')?.value || '',
                lastName: document.getElementById('lastName')?.value || '',
                email: document.getElementById('email')?.value || '',
                phone: document.getElementById('phone')?.value || '',
                service: document.getElementById('service')?.value || 'Not specified',
                preferredLocation: document.getElementById('preferredLocation')?.value || 'Not specified',
                message: document.getElementById('message')?.value || ''
            };

            const subject = encodeURIComponent(`New Inquiry from ${data.firstName} ${data.lastName}`);
            const body = encodeURIComponent(
`New Contact Form Submission
================================
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Service: ${data.service}
Location: ${data.preferredLocation}

Message:
${data.message}
================================`
            );

            setTimeout(() => {
                this.submitBtn.disabled = false;
                this.submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                window.location.href = `mailto:support@holisticmentalhealthny.com?subject=${subject}&body=${body}`;
                this.showNotification('Opening your email client...', 'success');
                setTimeout(() => this.form.reset(), 1000);
            }, 800);
        });
    }

    setupPhoneFormatting() {
        const phoneInput = document.getElementById('phone');
        phoneInput?.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 3) value = `(${value}`;
                else if (value.length <= 6) value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                else value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            }
            e.target.value = value;
        });
    }

    showNotification(message, type = 'success') {
        document.querySelector('.contact-notification')?.remove();
        const notification = document.createElement('div');
        notification.className = 'contact-notification';
        notification.style.cssText = `
            position:fixed;top:100px;right:30px;padding:20px 28px;
            background:${type === 'success' ? 'linear-gradient(135deg, #5DBBC3, #7B88C4)' : '#EF4444'};
            color:white;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,0.2);
            z-index:10000;display:flex;align-items:center;gap:12px;font-weight:500;max-width:400px;
        `;
        notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}" style="font-size:22px;"></i><span>${message}</span>`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }
}

// =========================
// 10. FLOATING BUTTONS
// =========================
class FloatingButtons {
    constructor() {
        this.backToTopBtn = document.getElementById('backToTopBtn');
        this.progressCircle = document.querySelector('.btt-progress-circle');
        this.fabContainer = document.getElementById('fabContainer');
        this.fabMain = document.getElementById('fabMain');
        this.fabBackdrop = document.getElementById('fabBackdrop');
        
        this.isOpen = false;
        this.scrollThreshold = 300;
        this.lastScrollTop = 0;
        
        this.init();
    }

    init() {
        this.addSVGGradient();
        this.setupBackToTop();
        this.setupFAB();
        this.setupScrollListener();
        this.setupOutsideClick();
    }

    addSVGGradient() {
        if (document.getElementById('bttGradient')) return;
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '0');
        svg.setAttribute('height', '0');
        svg.style.position = 'absolute';
        svg.innerHTML = `
            <defs>
                <linearGradient id="bttGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#5DBBC3"/>
                    <stop offset="100%" style="stop-color:#7B88C4"/>
                </linearGradient>
            </defs>
        `;
        document.body.appendChild(svg);
        
        if (this.progressCircle) {
            this.progressCircle.style.stroke = 'url(#bttGradient)';
        }
    }

    setupBackToTop() {
        if (!this.backToTopBtn) return;
        
        this.backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.backToTopBtn.style.transform = 'scale(0.9)';
            setTimeout(() => { this.backToTopBtn.style.transform = ''; }, 150);
        });
    }

    setupFAB() {
        if (!this.fabMain) return;
        
        this.fabMain.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFAB();
        });
        
        if (this.fabBackdrop) {
            this.fabBackdrop.addEventListener('click', () => this.closeFAB());
        }
        
        const fabActions = document.querySelectorAll('.fab-action');
        fabActions.forEach(action => {
            action.addEventListener('click', () => {
                setTimeout(() => this.closeFAB(), 150);
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.closeFAB();
        });
    }

    toggleFAB() {
        this.isOpen ? this.closeFAB() : this.openFAB();
    }

    openFAB() {
        this.isOpen = true;
        this.fabContainer.classList.add('active');
        if (window.innerWidth <= 768) document.body.style.overflow = 'hidden';
    }

    closeFAB() {
        this.isOpen = false;
        this.fabContainer.classList.remove('active');
        document.body.style.overflow = '';
    }

    setupScrollListener() {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        this.handleScroll();
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        if (this.backToTopBtn) {
            if (scrollTop > this.scrollThreshold) {
                this.backToTopBtn.classList.add('visible');
            } else {
                this.backToTopBtn.classList.remove('visible');
            }
            
            if (this.progressCircle) {
                const offset = Math.max(0, 100 - scrollPercent);
                this.progressCircle.style.strokeDashoffset = offset;
            }
        }

        if (this.isOpen && Math.abs(this.lastScrollTop - scrollTop) > 50) {
            this.closeFAB();
        }
        
        this.lastScrollTop = scrollTop;
    }

    setupOutsideClick() {
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.fabContainer.contains(e.target) && 
                !this.fabMain.contains(e.target)) {
                this.closeFAB();
            }
        });
    }
}

// =========================
// MAIN INITIALIZATION
// =========================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({ 
            duration: 1000, 
            once: true, 
            offset: 100, 
            easing: 'ease-out-cubic' 
        });
    }

    // Initialize all modules
    const modules = {
        progressNav: new EnhancedProgressNavigation(),
        heroVideo: new OptimizedHeroVideo(),
        statsCounter: new StatisticsCounter(),
        servicesCarousel: new ServicesCarousel(),
        serviceModals: new ServiceModalSystem(),
        faqSection: new FAQSection(),
        teamCarousel: new TeamCarousel(),
        testimonialsSlider: new TestimonialsSlider(),
        contactForm: new ContactFormHandler(),
        floatingButtons: new FloatingButtons()
    };

    // Make globally accessible
    window.holisticApp = modules;

    // Refresh positions on window load
    window.addEventListener('load', () => {
        setTimeout(() => modules.progressNav?.refreshPositions(), 100);
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            modules.progressNav?.refreshPositions();
        }, 250);
    }, { passive: true });

    console.log('%c✨ Holistic Mental Health Services', 'color: #5DBBC3; font-size: 24px; font-weight: bold;');
    console.log('%c🚀 All Systems Initialized!', 'color: #7B88C4; font-size: 16px;');
});
