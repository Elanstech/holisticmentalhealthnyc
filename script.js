/**
 * ================================================
 * HOLISTIC MENTAL HEALTH SERVICES
 * Complete Website JavaScript - Full Integration
 * Modern ES6+ Architecture with All Features
 * ================================================
 */

// =========================
// ENHANCED PROGRESS NAVIGATION CLASS
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
        
        if (this.header) {
            this.init();
        }
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
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        };

        this.navDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                const target = dot.getAttribute('data-target');
                scrollToSection(target);
            });
        });

        this.mobileDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                const target = dot.getAttribute('data-target');
                scrollToSection(target);
            });
        });
    }

    setupHeaderScroll() {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                this.header.classList.add('header-scrolled');
            } else {
                this.header.classList.remove('header-scrolled');
            }

            lastScroll = currentScroll;
        }, { passive: true });
    }

    updateActiveSection() {
        setTimeout(() => {
            const event = new Event('scroll');
            window.dispatchEvent(event);
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
// LOCATIONS MODAL CLASS
// =========================
class LocationsModal {
    constructor() {
        this.modal = document.getElementById('locationsModal');
        this.openBtn = document.getElementById('locationsBtn');
        this.closeBtn = document.getElementById('modalClose');
        this.overlay = this.modal ? this.modal.querySelector('.modal-overlay') : null;
        this.locationCards = this.modal ? this.modal.querySelectorAll('.location-card') : [];
        
        this.isOpen = false;
        this.scrollPosition = 0;
        
        if (this.modal && this.openBtn) {
            this.init();
        }
    }

    init() {
        this.setupEventListeners();
        this.setupKeyboardNavigation();
        this.setupCardAnimations();
    }

    setupEventListeners() {
        this.openBtn.addEventListener('click', () => this.open());

        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }

        const modalContent = this.modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    setupCardAnimations() {
        this.locationCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.transitionDelay = `${index * 0.1}s`;
        });
    }

    open() {
        this.isOpen = true;
        
        this.scrollPosition = window.pageYOffset;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollPosition}px`;
        document.body.style.width = '100%';
        
        this.modal.classList.add('active');
        
        setTimeout(() => {
            this.locationCards.forEach(card => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }, 200);
        
        if (this.closeBtn) {
            this.closeBtn.focus();
        }
    }

    close() {
        this.isOpen = false;
        
        this.locationCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
        });
        
        setTimeout(() => {
            this.modal.classList.remove('active');
            
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, this.scrollPosition);
        }, 300);
    }
}

// =========================
// ACTION ICONS ENHANCEMENT
// =========================
class ActionIconsEnhancer {
    constructor() {
        this.actionIcons = document.querySelectorAll('.action-icon');
        
        if (this.actionIcons.length > 0) {
            this.init();
        }
    }

    init() {
        this.addRippleAnimation();
        this.setupRippleEffect();
        this.setupHoverFeedback();
    }

    addRippleAnimation() {
        if (!document.getElementById('ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(30);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupRippleEffect() {
        this.actionIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                const rect = icon.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    width: 2px;
                    height: 2px;
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 50%;
                    left: ${x}px;
                    top: ${y}px;
                    pointer-events: none;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                `;
                
                icon.style.position = 'relative';
                icon.style.overflow = 'hidden';
                icon.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    setupHoverFeedback() {
        this.actionIcons.forEach(icon => {
            icon.addEventListener('touchstart', () => {
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            }, { passive: true });
        });
    }
}

// =========================
// HERO VIDEO CONTROLLER
// =========================
class HeroVideo {
    constructor() {
        this.video = document.querySelector('.hero-bg-video');
        this.hero = document.querySelector('.hero');
        
        if (this.video && this.hero) {
            this.init();
        }
    }

    init() {
        this.setupVideoAutoplay();
        this.setupVideoOptimization();
        this.addVideoFallback();
    }

    setupVideoAutoplay() {
        this.video.addEventListener('loadeddata', () => {
            this.video.play().catch(error => {
                console.log('Video autoplay prevented:', error);
                this.video.muted = true;
                this.video.play();
            });
        });
    }

    setupVideoOptimization() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.video.play().catch(() => {});
                } else {
                    this.video.pause();
                }
            });
        }, { threshold: 0.25 });

        observer.observe(this.hero);
    }

    addVideoFallback() {
        this.video.addEventListener('error', () => {
            console.log('Video failed to load, showing fallback gradient');
            const container = document.querySelector('.hero-video-container');
            if (container) {
                container.style.background = 'linear-gradient(135deg, #5DBBC3 0%, #7B88C4 100%)';
            }
            this.video.style.display = 'none';
        });
    }
}

// =========================
// STATISTICS COUNTER CLASS (Universal)
// =========================
class StatisticsCounter {
    constructor() {
        this.statNumbers = document.querySelectorAll('.stat-number');
        this.animated = new Set();
        
        if (this.statNumbers.length > 0) {
            this.init();
        }
    }

    init() {
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated.has(entry.target)) {
                    this.animateNumber(entry.target);
                    this.animated.add(entry.target);
                }
            });
        }, options);

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
// ABOUT SECTION - FOUNDER IMAGE PARALLAX
// =========================
class FounderImageParallax {
    constructor() {
        this.founderImage = document.querySelector('.founder-image-wrapper');
        this.founderSection = document.querySelector('.founder-spotlight');
        
        if (this.founderImage && this.founderSection) {
            this.init();
        }
    }

    init() {
        this.setupParallaxEffect();
    }

    setupParallaxEffect() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
                } else {
                    window.removeEventListener('scroll', this.handleScroll.bind(this));
                }
            });
        }, { threshold: 0.1 });

        observer.observe(this.founderSection);
    }

    handleScroll() {
        const rect = this.founderSection.getBoundingClientRect();
        const scrollProgress = 1 - (rect.top / window.innerHeight);
        
        if (scrollProgress > 0 && scrollProgress < 1) {
            const translateY = scrollProgress * 30;
            this.founderImage.style.transform = `translateY(${translateY}px)`;
        }
    }
}

// =========================
// ABOUT SECTION - CREDENTIAL TAGS ANIMATION
// =========================
class CredentialTagsAnimation {
    constructor() {
        this.credentialTags = document.querySelectorAll('.credential-tag');
        
        if (this.credentialTags.length > 0) {
            this.init();
        }
    }

    init() {
        this.setupStaggeredAnimation();
    }

    setupStaggeredAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.credentialTags.forEach((tag, index) => {
                        setTimeout(() => {
                            tag.style.opacity = '0';
                            tag.style.transform = 'translateY(20px)';
                            
                            setTimeout(() => {
                                tag.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                                tag.style.opacity = '1';
                                tag.style.transform = 'translateY(0)';
                            }, 50);
                        }, index * 100);
                    });
                    
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });

        if (this.credentialTags.length > 0) {
            observer.observe(this.credentialTags[0].parentElement);
        }
    }
}

// =========================
// ABOUT SECTION - VALUE CARDS EFFECT
// =========================
class ValueCardsEffect {
    constructor() {
        this.valueCards = document.querySelectorAll('.value-card');
        
        if (this.valueCards.length > 0) {
            this.init();
        }
    }

    init() {
        this.setupHoverEffects();
    }

    setupHoverEffects() {
        this.valueCards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const glow = document.createElement('div');
                glow.style.cssText = `
                    position: absolute;
                    top: ${y}px;
                    left: ${x}px;
                    width: 200px;
                    height: 200px;
                    background: radial-gradient(circle, rgba(93, 187, 195, 0.15) 0%, transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                    transform: translate(-50%, -50%);
                    transition: opacity 0.6s ease;
                `;
                glow.classList.add('card-glow');
                
                card.style.position = 'relative';
                card.appendChild(glow);
                
                setTimeout(() => {
                    glow.style.opacity = '0';
                    setTimeout(() => glow.remove(), 600);
                }, 100);
            });
        });
    }
}

// =========================
// SERVICES CAROUSEL CLASS
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
        
        if (this.carousel && this.cards.length > 0) {
            this.init();
        }
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
        const totalIndicators = Math.ceil(this.totalCards / this.cardsPerView);
        
        for (let i = 0; i < totalIndicators; i++) {
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
        this.prevBtn.addEventListener('click', () => {
            this.prevSlide();
            this.resetAutoplay();
        });

        this.nextBtn.addEventListener('click', () => {
            this.nextSlide();
            this.resetAutoplay();
        });

        let startX = 0;
        let endX = 0;

        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        this.carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
                this.resetAutoplay();
            }
        }, { passive: true });

        this.carousel.addEventListener('mouseenter', () => {
            this.stopAutoplay();
        });

        this.carousel.addEventListener('mouseleave', () => {
            this.startAutoplay();
        });
    }

    goToSlide(index) {
        const maxIndex = Math.ceil(this.totalCards / this.cardsPerView) - 1;
        this.currentIndex = Math.max(0, Math.min(index, maxIndex));
        this.updateCarousel();
    }

    nextSlide() {
        const maxIndex = Math.ceil(this.totalCards / this.cardsPerView) - 1;
        this.currentIndex = (this.currentIndex + 1) % (maxIndex + 1);
        this.updateCarousel();
    }

    prevSlide() {
        const maxIndex = Math.ceil(this.totalCards / this.cardsPerView) - 1;
        this.currentIndex = (this.currentIndex - 1 + maxIndex + 1) % (maxIndex + 1);
        this.updateCarousel();
    }

    updateCarousel() {
        const cardWidth = this.cards[0].offsetWidth;
        const gap = 32;
        const offset = -(this.currentIndex * this.cardsPerView * (cardWidth + gap));
        
        this.carousel.style.transform = `translateX(${offset}px)`;
        
        this.cards.forEach((card, index) => {
            const startIndex = this.currentIndex * this.cardsPerView;
            const endIndex = startIndex + this.cardsPerView;
            
            if (index >= startIndex && index < endIndex) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
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
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplayDelay);
    }

    stopAutoplay() {
        clearInterval(this.autoplayInterval);
    }

    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }
}

// =========================
// SERVICE MODAL SYSTEM
// =========================
class ServiceModalSystem {
    constructor() {
        this.modal = document.getElementById('serviceModal');
        this.modalContentWrapper = document.getElementById('modalContentWrapper');
        this.modalCloseBtn = document.getElementById('modalCloseBtn');
        this.modalOverlay = this.modal ? this.modal.querySelector('.modal-overlay') : null;
        this.learnMoreButtons = document.querySelectorAll('.service-learn-more');
        this.modalTemplates = document.querySelectorAll('.modal-template');
        
        this.isOpen = false;
        this.scrollPosition = 0;
        
        if (this.modal) {
            this.init();
        }
    }

    init() {
        this.setupEventListeners();
        this.setupKeyboardNavigation();
    }

    setupEventListeners() {
        this.learnMoreButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modalId = button.getAttribute('data-modal');
                this.openModal(modalId);
            });
        });

        if (this.modalCloseBtn) {
            this.modalCloseBtn.addEventListener('click', () => this.closeModal());
        }

        if (this.modalOverlay) {
            this.modalOverlay.addEventListener('click', () => this.closeModal());
        }

        const modalContainer = this.modal.querySelector('.modal-container');
        if (modalContainer) {
            modalContainer.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeModal();
            }
        });
    }

    openModal(modalId) {
        const template = document.getElementById(`modal-${modalId}`);
        
        if (!template) {
            console.error(`Modal template not found: modal-${modalId}`);
            return;
        }

        const content = template.cloneNode(true);
        content.style.display = 'block';
        this.modalContentWrapper.innerHTML = '';
        this.modalContentWrapper.appendChild(content);

        this.animateContentIn();

        this.scrollPosition = window.pageYOffset;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollPosition}px`;
        document.body.style.width = '100%';

        this.modal.classList.add('active');
        this.isOpen = true;

        setTimeout(() => {
            if (this.modalCloseBtn) {
                this.modalCloseBtn.focus();
            }
        }, 100);

        const ctaBtn = content.querySelector('.modal-cta-btn');
        if (ctaBtn) {
            ctaBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeModal();
                setTimeout(() => {
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 400);
            });
        }
    }

    closeModal() {
        this.isOpen = false;

        this.animateContentOut();

        setTimeout(() => {
            this.modal.classList.remove('active');
            
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, this.scrollPosition);
            
            this.modalContentWrapper.innerHTML = '';
        }, 300);
    }

    animateContentIn() {
        const sections = this.modalContentWrapper.querySelectorAll('.modal-section, .modal-conditions, .modal-pricing');
        
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                section.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 100 + (index * 80));
        });
    }

    animateContentOut() {
        const sections = this.modalContentWrapper.querySelectorAll('.modal-section, .modal-conditions, .modal-pricing');
        
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
            }, index * 30);
        });
    }
}

// =========================
// TESTIMONIALS SLIDER CLASS
// =========================
class TestimonialsSlider {
    constructor() {
        this.track = document.getElementById('testimonialTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dotsContainer = document.getElementById('sliderDots');
        
        if (!this.track || !this.prevBtn || !this.nextBtn || !this.dotsContainer) return;
        
        this.cards = Array.from(this.track.children);
        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000;
        this.dots = [];
        
        this.init();
    }

    init() {
        this.createDots();
        this.setupEventListeners();
        this.startAutoplay();
        this.updateSlider();
    }

    createDots() {
        this.cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.resetAutoplay();
            });
            
            this.dotsContainer.appendChild(dot);
        });
        
        this.dots = Array.from(this.dotsContainer.children);
    }

    setupEventListeners() {
        this.prevBtn.addEventListener('click', () => {
            this.prevSlide();
            this.resetAutoplay();
        });

        this.nextBtn.addEventListener('click', () => {
            this.nextSlide();
            this.resetAutoplay();
        });

        let startX = 0;
        let endX = 0;

        this.track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        this.track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
                this.resetAutoplay();
            }
        }, { passive: true });
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlider();
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.cards.length;
        this.updateSlider();
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
        this.updateSlider();
    }

    updateSlider() {
        const offset = -this.currentIndex * 100;
        this.track.style.transform = `translateX(${offset}%)`;
        
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplayDelay);
    }

    resetAutoplay() {
        clearInterval(this.autoplayInterval);
        this.startAutoplay();
    }
}

// =========================
// FORM HANDLER CLASS
// =========================
class FormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        
        if (!this.form) return;
        
        this.init();
    }

    init() {
        this.setupValidation();
        this.setupSubmitHandler();
    }

    setupValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        } else if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        if (!isValid) {
            this.showError(field, errorMessage);
        } else {
            this.clearError(field);
        }

        return isValid;
    }

    showError(field, message) {
        this.clearError(field);
        
        field.style.borderColor = '#EF4444';
        
        const error = document.createElement('span');
        error.className = 'field-error';
        error.style.color = '#EF4444';
        error.style.fontSize = '14px';
        error.style.marginTop = '4px';
        error.style.display = 'block';
        error.textContent = message;
        
        field.parentElement.appendChild(error);
    }

    clearError(field) {
        field.style.borderColor = '';
        
        const error = field.parentElement.querySelector('.field-error');
        if (error) {
            error.remove();
        }
    }

    setupSubmitHandler() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inputs = this.form.querySelectorAll('input[required], textarea[required], select[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                this.submitForm();
            } else {
                this.showNotification('Please fill in all required fields correctly', 'error');
            }
        });
    }

    async submitForm() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            await this.simulateAPICall(data);
            
            this.showNotification('Thank you! We\'ll be in touch within 24 hours.', 'success');
            this.form.reset();
        } catch (error) {
            this.showNotification('Something went wrong. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    simulateAPICall(data) {
        return new Promise((resolve) => {
            console.log('Form submission:', data);
            setTimeout(resolve, 1500);
        });
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #5DBBC3, #7B88C4)' : '#EF4444'};
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}" style="font-size: 24px;"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// =========================
// SCROLL TO TOP CLASS
// =========================
class ScrollToTop {
    constructor() {
        this.button = document.getElementById('scrollTop');
        
        if (!this.button) return;
        
        this.init();
    }

    init() {
        this.setupScrollListener();
        this.setupClickHandler();
    }

    setupScrollListener() {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        }, { passive: true });
    }

    setupClickHandler() {
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// =========================
// CIRCLE ANIMATION CLASS
// =========================
class CircleAnimation {
    constructor() {
        this.circle = document.querySelector('.approach-circle');
        
        if (!this.circle) return;
        
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.circle.style.animationPlayState = 'running';
                } else {
                    this.circle.style.animationPlayState = 'paused';
                }
            });
        }, { threshold: 0.3 });

        observer.observe(this.circle);
    }
}

// =========================
// SMOOTH SCROLL ENHANCEMENT
// =========================
class SmoothScrollEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.enhanceNavLinks();
    }

    enhanceNavLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#' || href === '#!') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// =========================
// PERFORMANCE MONITOR
// =========================
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            loadTime: 0,
            resourceCount: 0,
            memoryUsage: 0
        };
        
        this.init();
    }

    init() {
        window.addEventListener('load', () => {
            if (performance && performance.timing) {
                const perfData = performance.timing;
                this.metrics.loadTime = perfData.loadEventEnd - perfData.navigationStart;
                
                if (performance.getEntriesByType) {
                    this.metrics.resourceCount = performance.getEntriesByType('resource').length;
                }
                
                if (performance.memory) {
                    this.metrics.memoryUsage = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
                }
                
                this.logMetrics();
            }
        });
    }

    logMetrics() {
        console.log('%c📊 Performance Metrics', 'color: #5DBBC3; font-size: 16px; font-weight: bold;');
        console.log(`⏱️  Load Time: ${this.metrics.loadTime}ms`);
        console.log(`📦 Resources Loaded: ${this.metrics.resourceCount}`);
        if (this.metrics.memoryUsage) {
            console.log(`💾 Memory Usage: ${this.metrics.memoryUsage}MB`);
        }
    }
}

// =========================
// MAIN APPLICATION CLASS
// =========================
class HolisticMentalHealthApp {
    constructor() {
        this.modules = {};
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeModules());
        } else {
            this.initializeModules();
        }
    }

    initializeModules() {
        try {
            // Initialize AOS (Animate On Scroll)
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 1000,
                    once: true,
                    offset: 100,
                    easing: 'ease-out-cubic'
                });
            }

            // Initialize all modules
            this.modules.progressNav = new EnhancedProgressNavigation();
            this.modules.locationsModal = new LocationsModal();
            this.modules.actionIcons = new ActionIconsEnhancer();
            this.modules.heroVideo = new HeroVideo();
            this.modules.statsCounter = new StatisticsCounter();
            this.modules.founderParallax = new FounderImageParallax();
            this.modules.credentialTags = new CredentialTagsAnimation();
            this.modules.valueCards = new ValueCardsEffect();
            this.modules.servicesCarousel = new ServicesCarousel();
            this.modules.serviceModals = new ServiceModalSystem();
            this.modules.testimonialsSlider = new TestimonialsSlider();
            this.modules.formHandler = new FormHandler();
            this.modules.scrollToTop = new ScrollToTop();
            this.modules.circleAnimation = new CircleAnimation();
            this.modules.smoothScroll = new SmoothScrollEnhancer();
            this.modules.perfMonitor = new PerformanceMonitor();

            // Make modules globally accessible for debugging
            window.holisticApp = this.modules;

            // Add notification styles
            this.addNotificationStyles();
            
            // Refresh positions after images and resources load
            window.addEventListener('load', () => {
                if (this.modules.progressNav) {
                    setTimeout(() => {
                        this.modules.progressNav.refreshPositions();
                    }, 100);
                }
            });
            
            // Refresh on window resize with debouncing
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    if (this.modules.progressNav) {
                        this.modules.progressNav.refreshPositions();
                    }
                }, 250);
            }, { passive: true });
            
            // Log success message
            this.logSuccess();
            
        } catch (error) {
            console.error('Error initializing modules:', error);
        }
    }

    addNotificationStyles() {
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    logSuccess() {
        console.log('%c✨ Holistic Mental Health Services', 'color: #5DBBC3; font-size: 24px; font-weight: bold;');
        console.log('%c🚀 All Systems Initialized Successfully!', 'color: #7B88C4; font-size: 16px;');
        console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #D1D5DB;');
        console.log('%c✓ Enhanced Progress Navigation', 'color: #10B981;');
        console.log('%c✓ Locations Modal System', 'color: #10B981;');
        console.log('%c✓ Action Icons & Interactions', 'color: #10B981;');
        console.log('%c✓ Hero Video Controller', 'color: #10B981;');
        console.log('%c✓ Statistics Counter', 'color: #10B981;');
        console.log('%c✓ About Section Animations', 'color: #10B981;');
        console.log('%c✓ Services Carousel', 'color: #10B981;');
        console.log('%c✓ Service Modal System', 'color: #10B981;');
        console.log('%c✓ Testimonials Slider', 'color: #10B981;');
        console.log('%c✓ Form Validation & Handling', 'color: #10B981;');
        console.log('%c✓ Scroll To Top', 'color: #10B981;');
        console.log('%c✓ Circle Animation', 'color: #10B981;');
        console.log('%c✓ Smooth Scroll Enhancements', 'color: #10B981;');
        console.log('%c✓ Performance Monitoring', 'color: #10B981;');
        console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #D1D5DB;');
        console.log('%c💡 Access modules via: window.holisticApp', 'color: #6B7280;');
    }
}

// =========================
// INITIALIZE APPLICATION
// =========================
new HolisticMentalHealthApp();
