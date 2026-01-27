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
// HERO VIDEO CONTROLLER
// =========================
class HeroVideo {
    constructor() {
        this.video = document.querySelector('.hero-bg-video');
        this.hero = document.querySelector('.hero');
        if (this.video && this.hero) this.init();
    }

    init() {
        this.setupVideoAutoplay();
        this.setupVideoOptimization();
        this.addVideoFallback();
    }

    setupVideoAutoplay() {
        this.video.addEventListener('loadeddata', () => {
            this.video.play().catch(() => {
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
            const container = document.querySelector('.hero-video-container');
            if (container) {
                container.style.background = 'linear-gradient(135deg, #5DBBC3 0%, #7B88C4 100%)';
            }
            this.video.style.display = 'none';
        });
    }
}

// =========================
// STATISTICS COUNTER CLASS
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
// FOUNDER IMAGE PARALLAX
// =========================
class FounderImageParallax {
    constructor() {
        this.founderImage = document.querySelector('.founder-image-wrapper');
        this.founderSection = document.querySelector('.founder-spotlight');
        if (this.founderImage && this.founderSection) this.init();
    }

    init() {
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
            this.founderImage.style.transform = `translateY(${scrollProgress * 30}px)`;
        }
    }
}

// =========================
// CREDENTIAL TAGS ANIMATION
// =========================
class CredentialTagsAnimation {
    constructor() {
        this.credentialTags = document.querySelectorAll('.credential-tag');
        if (this.credentialTags.length > 0) this.init();
    }

    init() {
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
// VALUE CARDS EFFECT
// =========================
class ValueCardsEffect {
    constructor() {
        this.valueCards = document.querySelectorAll('.value-card');
        if (this.valueCards.length > 0) this.init();
    }

    init() {
        this.valueCards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                const rect = card.getBoundingClientRect();
                const glow = document.createElement('div');
                glow.style.cssText = `
                    position: absolute;
                    top: ${e.clientY - rect.top}px;
                    left: ${e.clientX - rect.left}px;
                    width: 200px; height: 200px;
                    background: radial-gradient(circle, rgba(93, 187, 195, 0.15) 0%, transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                    transform: translate(-50%, -50%);
                    transition: opacity 0.6s ease;
                `;
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
        this.prevBtn.addEventListener('click', () => { this.prevSlide(); this.resetAutoplay(); });
        this.nextBtn.addEventListener('click', () => { this.nextSlide(); this.resetAutoplay(); });

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
// SERVICE MODAL SYSTEM
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

        // Animate sections
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

        // CTA button handler
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
// TRUST BAR ANIMATION
// =========================
class TrustBarAnimation {
    constructor() {
        this.trustBar = document.querySelector('.trust-bar');
        this.trustItems = document.querySelectorAll('.trust-item');
        this.animated = false;
        
        if (this.trustBar && this.trustItems.length > 0) this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animated) {
                    this.animateTrustItems();
                    this.animated = true;
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(this.trustBar);
    }

    animateTrustItems() {
        this.trustItems.forEach((item, index) => {
            const number = item.querySelector('strong');
            if (!number) return;

            // Prepare animation
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';

            // Animate in
            setTimeout(() => {
                item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';

                // Animate number counting
                this.animateNumber(number);
            }, index * 100);
        });
    }

    animateNumber(element) {
        const text = element.textContent;
        const hasPercent = text.includes('%');
        const hasPlus = text.includes('+');
        const numericText = text.replace(/[^0-9.]/g, '');
        const target = parseFloat(numericText);
        
        if (isNaN(target)) return;

        const duration = 1500;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        let step = 0;

        const interval = setInterval(() => {
            step++;
            current = Math.min(current + increment, target);
            
            let displayValue = Math.floor(current);
            if (target % 1 !== 0) {
                displayValue = current.toFixed(1);
            }
            
            element.textContent = displayValue + (hasPercent ? '%' : '') + (hasPlus ? '+' : '');

            if (step >= steps || current >= target) {
                element.textContent = text; // Restore original
                clearInterval(interval);
            }
        }, duration / steps);
    }
}

class FAQSection {
    constructor() {
        this.faqSection = document.querySelector('.faq-section');
        this.categoryButtons = document.querySelectorAll('.faq-category-btn');
        this.faqItems = document.querySelectorAll('.faq-item');
        this.faqQuestions = document.querySelectorAll('.faq-question');
        
        this.activeCategory = 'all';
        this.openItems = new Set();
        
        if (this.faqSection) {
            this.init();
        }
    }

    init() {
        this.setupCategoryFiltering();
        this.setupAccordion();
        this.setupKeyboardNavigation();
        this.setupDeepLinking();
        this.animateOnScroll();
    }

    /**
     * Category Filtering System
     */
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
        
        // Close all open items when switching categories
        this.closeAllItems();
        
        this.faqItems.forEach((item, index) => {
            const itemCategory = item.getAttribute('data-category');
            const shouldShow = category === 'all' || itemCategory === category;
            
            if (shouldShow) {
                // Show with staggered animation
                setTimeout(() => {
                    item.classList.remove('hidden');
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    
                    // Trigger animation
                    requestAnimationFrame(() => {
                        item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    });
                }, index * 50);
            } else {
                // Hide with fade out
                item.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.opacity = '0';
                item.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    item.classList.add('hidden');
                }, 300);
            }
        });
    }

    updateActiveButton(activeButton) {
        this.categoryButtons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }

    /**
     * Accordion Functionality
     */
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
        
        if (isOpen) {
            this.closeItem(item);
        } else {
            this.openItem(item);
        }
    }

    openItem(item) {
        // Add active class
        item.classList.add('active');
        this.openItems.add(item);
        
        // Get the answer element
        const answer = item.querySelector('.faq-answer');
        const content = item.querySelector('.faq-answer-content');
        
        if (answer && content) {
            // Calculate the height needed
            const contentHeight = content.scrollHeight;
            answer.style.maxHeight = `${contentHeight + 50}px`;
        }
        
        // Scroll into view if needed (with offset for header)
        setTimeout(() => {
            const rect = item.getBoundingClientRect();
            const isInViewport = rect.top >= 100 && rect.bottom <= window.innerHeight;
            
            if (!isInViewport) {
                const yOffset = -100; // Header offset
                const y = item.getBoundingClientRect().top + window.pageYOffset + yOffset;
                
                window.scrollTo({
                    top: y,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }

    closeItem(item) {
        item.classList.remove('active');
        this.openItems.delete(item);
        
        const answer = item.querySelector('.faq-answer');
        if (answer) {
            answer.style.maxHeight = '0';
        }
    }

    closeAllItems() {
        this.faqItems.forEach(item => {
            if (item.classList.contains('active')) {
                this.closeItem(item);
            }
        });
    }

    /**
     * Keyboard Navigation
     */
    setupKeyboardNavigation() {
        this.faqQuestions.forEach((question, index) => {
            question.addEventListener('keydown', (e) => {
                const faqItem = question.closest('.faq-item');
                
                // Enter or Space to toggle
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleItem(faqItem);
                }
                
                // Arrow keys to navigate
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.focusNextQuestion(index);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.focusPreviousQuestion(index);
                }
                
                // Home/End keys
                if (e.key === 'Home') {
                    e.preventDefault();
                    this.faqQuestions[0].focus();
                } else if (e.key === 'End') {
                    e.preventDefault();
                    this.faqQuestions[this.faqQuestions.length - 1].focus();
                }
            });
            
            // Make questions focusable
            question.setAttribute('tabindex', '0');
            question.setAttribute('role', 'button');
            question.setAttribute('aria-expanded', 'false');
        });
    }

    focusNextQuestion(currentIndex) {
        const visibleQuestions = Array.from(this.faqQuestions).filter(q => {
            const item = q.closest('.faq-item');
            return !item.classList.contains('hidden');
        });
        
        const currentQuestion = this.faqQuestions[currentIndex];
        const currentIndexInVisible = visibleQuestions.indexOf(currentQuestion);
        
        if (currentIndexInVisible < visibleQuestions.length - 1) {
            visibleQuestions[currentIndexInVisible + 1].focus();
        }
    }

    focusPreviousQuestion(currentIndex) {
        const visibleQuestions = Array.from(this.faqQuestions).filter(q => {
            const item = q.closest('.faq-item');
            return !item.classList.contains('hidden');
        });
        
        const currentQuestion = this.faqQuestions[currentIndex];
        const currentIndexInVisible = visibleQuestions.indexOf(currentQuestion);
        
        if (currentIndexInVisible > 0) {
            visibleQuestions[currentIndexInVisible - 1].focus();
        }
    }

    /**
     * Deep Linking Support
     * Allows linking directly to specific FAQ items
     */
    setupDeepLinking() {
        // Check if URL has a hash
        const hash = window.location.hash;
        if (hash && hash.startsWith('#faq-')) {
            setTimeout(() => {
                const targetId = hash.substring(1);
                const targetItem = document.getElementById(targetId);
                
                if (targetItem && targetItem.classList.contains('faq-item')) {
                    // Open the item
                    this.openItem(targetItem);
                    
                    // Scroll to it
                    setTimeout(() => {
                        targetItem.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }, 300);
                }
            }, 500);
        }
    }

    /**
     * Animate FAQ items on scroll
     */
    animateOnScroll() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered animation
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 50);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Initially hide items for animation
        this.faqItems.forEach(item => {
            if (!item.classList.contains('hidden')) {
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                observer.observe(item);
            }
        });
    }

    /**
     * Utility: Get all visible FAQ items
     */
    getVisibleItems() {
        return Array.from(this.faqItems).filter(item => 
            !item.classList.contains('hidden')
        );
    }

    /**
     * Public method to open a specific FAQ by index
     */
    openFAQByIndex(index) {
        const visibleItems = this.getVisibleItems();
        if (index >= 0 && index < visibleItems.length) {
            this.openItem(visibleItems[index]);
        }
    }

    /**
     * Public method to search FAQ content
     */
    searchFAQs(searchTerm) {
        const term = searchTerm.toLowerCase();
        let foundCount = 0;
        
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question-text').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer-content').textContent.toLowerCase();
            
            const matches = question.includes(term) || answer.includes(term);
            
            if (matches) {
                item.classList.remove('hidden');
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
                foundCount++;
            } else {
                item.classList.add('hidden');
            }
        });
        
        return foundCount;
    }
}

// Initialize FAQ Section
document.addEventListener('DOMContentLoaded', () => {
    const faqSection = new FAQSection();
    
    // Make it globally accessible for debugging/external control
    window.faqSection = faqSection;
    
    console.log('%c✓ FAQ Section Initialized', 'color: #5DBBC3; font-weight: bold;');
});


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
        
        if (this.carousel && this.cards.length > 0) {
            this.init();
        }
    }

    init() {
        this.createIndicators();
        this.setupEventListeners();
        this.setupResponsive();
        this.updateCarousel();
        this.startAutoplay();
    }

    /**
     * Determine cards per view based on screen width
     */
    getCardsPerView() {
        const width = window.innerWidth;
        if (width <= 768) return 1;
        if (width <= 1200) return 2;
        return 3;
    }

    /**
     * Create indicator dots
     */
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

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Button controls
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

        // Touch/Swipe support
        let startX = 0;
        let isDragging = false;
        
        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
            this.stopAutoplay();
        }, { passive: true });
        
        this.carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            
            // Visual feedback during drag
            if (Math.abs(diff) > 10) {
                this.carousel.style.transition = 'none';
                const cardWidth = this.cards[0].offsetWidth;
                const gap = 32;
                const baseOffset = -(this.currentIndex * this.cardsPerView * (cardWidth + gap));
                this.carousel.style.transform = `translateX(${baseOffset - diff}px)`;
            }
        }, { passive: true });
        
        this.carousel.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            this.carousel.style.transition = '';
            const diff = startX - e.changedTouches[0].clientX;
            
            if (Math.abs(diff) > 80) {
                diff > 0 ? this.nextSlide() : this.prevSlide();
            } else {
                this.updateCarousel(); // Snap back
            }
            
            this.resetAutoplay();
        }, { passive: true });

        // Mouse/Desktop drag support
        let mouseStartX = 0;
        let isMouseDragging = false;
        
        this.carousel.addEventListener('mousedown', (e) => {
            mouseStartX = e.clientX;
            isMouseDragging = true;
            this.carousel.style.cursor = 'grabbing';
            this.stopAutoplay();
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isMouseDragging) return;
            const diff = mouseStartX - e.clientX;
            
            if (Math.abs(diff) > 10) {
                this.carousel.style.transition = 'none';
                const cardWidth = this.cards[0].offsetWidth;
                const gap = 32;
                const baseOffset = -(this.currentIndex * this.cardsPerView * (cardWidth + gap));
                this.carousel.style.transform = `translateX(${baseOffset - diff}px)`;
            }
        });
        
        document.addEventListener('mouseup', (e) => {
            if (!isMouseDragging) return;
            isMouseDragging = false;
            
            this.carousel.style.transition = '';
            this.carousel.style.cursor = '';
            const diff = mouseStartX - e.clientX;
            
            if (Math.abs(diff) > 80) {
                diff > 0 ? this.nextSlide() : this.prevSlide();
            } else {
                this.updateCarousel(); // Snap back
            }
            
            this.resetAutoplay();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isInViewport() && !this.isTransitioning) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prevSlide();
                    this.resetAutoplay();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextSlide();
                    this.resetAutoplay();
                }
            }
        });

        // Pause on hover
        this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoplay());
    }

    /**
     * Navigate to specific slide
     */
    goToSlide(index) {
        if (this.isTransitioning) return;
        const maxIndex = Math.ceil(this.totalCards / this.cardsPerView) - 1;
        this.currentIndex = Math.max(0, Math.min(index, maxIndex));
        this.updateCarousel();
    }

    /**
     * Go to next slide
     */
    nextSlide() {
        if (this.isTransitioning) return;
        const maxIndex = Math.ceil(this.totalCards / this.cardsPerView) - 1;
        this.currentIndex = (this.currentIndex + 1) > maxIndex ? 0 : this.currentIndex + 1;
        this.updateCarousel();
    }

    /**
     * Go to previous slide
     */
    prevSlide() {
        if (this.isTransitioning) return;
        const maxIndex = Math.ceil(this.totalCards / this.cardsPerView) - 1;
        this.currentIndex = (this.currentIndex - 1) < 0 ? maxIndex : this.currentIndex - 1;
        this.updateCarousel();
    }

    /**
     * Update carousel position and indicators
     */
    updateCarousel() {
        this.isTransitioning = true;
        
        const cardWidth = this.cards[0].offsetWidth;
        const gap = 32;
        const offset = -(this.currentIndex * this.cardsPerView * (cardWidth + gap));
        
        this.carousel.style.transform = `translateX(${offset}px)`;
        
        // Update indicators
        this.indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === this.currentIndex);
        });

        // Reset transition lock
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }

    /**
     * Setup responsive behavior
     */
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

    /**
     * Check if carousel is in viewport
     */
    isInViewport() {
        if (!this.carousel) return false;
        const rect = this.carousel.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Start autoplay
     */
    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => this.nextSlide(), this.autoplayDelay);
    }

    /**
     * Stop autoplay
     */
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    /**
     * Reset autoplay
     */
    resetAutoplay() {
        this.stopAutoplay();
        this.startAutoplay();
    }

    /**
     * Destroy carousel (cleanup)
     */
    destroy() {
        this.stopAutoplay();
        this.indicators.forEach(ind => ind.remove());
    }
}

// Initialize Team Carousel
document.addEventListener('DOMContentLoaded', () => {
    const teamCarousel = new TeamCarousel();
    
    // Make globally accessible
    window.teamCarousel = teamCarousel;
    
    console.log('%c✓ Team Carousel Initialized', 'color: #5DBBC3; font-weight: bold;');
});

// =========================
// TESTIMONIALS SLIDER - ENHANCED
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
        this.autoplayDelay = 7000; // Longer delay for more content
        this.isTransitioning = false;
        
        if (this.track && this.cards.length > 0) this.init();
    }

    init() {
        this.createDots();
        this.setupEventListeners();
        this.setupAccessibility();
        this.setupResponsive();
        this.updateSlider();
        this.startAutoplay();
        this.animateOnScroll();
    }

    createDots() {
        this.dotsContainer.innerHTML = '';
        for (let i = 0; i < this.totalCards; i++) {
            const dot = document.createElement('div');
            dot.classList.add('testimonial-dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('role', 'button');
            dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
            dot.addEventListener('click', () => { 
                this.goToSlide(i); 
                this.resetAutoplay(); 
            });
            this.dotsContainer.appendChild(dot);
        }
        this.dots = Array.from(this.dotsContainer.children);
    }

    setupEventListeners() {
        // Button controls
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

        // Touch/Swipe support
        let startX = 0;
        let isDragging = false;
        
        this.track.addEventListener('touchstart', (e) => { 
            startX = e.touches[0].clientX;
            isDragging = true;
            this.stopAutoplay();
        }, { passive: true });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            
            // Add visual feedback during drag
            if (Math.abs(diff) > 10) {
                this.track.style.transition = 'none';
                const cardWidth = this.cards[0].offsetWidth;
                const computedStyle = window.getComputedStyle(this.track);
                const gap = parseInt(computedStyle.gap) || 32;
                const baseOffset = -(this.currentIndex * (cardWidth + gap));
                this.track.style.transform = `translateX(${baseOffset - diff}px)`;
            }
        }, { passive: true });
        
        this.track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            this.track.style.transition = '';
            const diff = startX - e.changedTouches[0].clientX;
            
            if (Math.abs(diff) > 80) {
                diff > 0 ? this.nextSlide() : this.prevSlide();
            } else {
                this.updateSlider(); // Snap back
            }
            
            this.resetAutoplay();
        }, { passive: true });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isInViewport() && !this.isTransitioning) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prevSlide();
                    this.resetAutoplay();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextSlide();
                    this.resetAutoplay();
                }
            }
        });

        // Pause on hover
        this.track.addEventListener('mouseenter', () => this.stopAutoplay());
        this.track.addEventListener('mouseleave', () => this.startAutoplay());

        // Pause on focus (accessibility)
        this.cards.forEach(card => {
            card.addEventListener('focusin', () => this.stopAutoplay());
            card.addEventListener('focusout', () => this.startAutoplay());
        });
    }

    setupAccessibility() {
        this.track.setAttribute('role', 'region');
        this.track.setAttribute('aria-label', 'Client testimonials');
        
        this.cards.forEach((card, index) => {
            card.setAttribute('role', 'group');
            card.setAttribute('aria-roledescription', 'slide');
            card.setAttribute('aria-label', `Testimonial ${index + 1} of ${this.totalCards}`);
        });
    }

    setupResponsive() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Recalculate position on resize
                this.updateSlider();
            }, 250);
        });
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
        
        // Calculate offset accounting for gap between cards (responsive)
        const cardWidth = this.cards[0].offsetWidth;
        const computedStyle = window.getComputedStyle(this.track);
        const gap = parseInt(computedStyle.gap) || 32; // Get actual gap from CSS
        const offset = -(this.currentIndex * (cardWidth + gap));
        
        this.track.style.transform = `translateX(${offset}px)`;
        
        // Update dots
        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentIndex);
            dot.setAttribute('aria-current', i === this.currentIndex ? 'true' : 'false');
        });

        // Update card visibility for screen readers
        this.cards.forEach((card, i) => {
            card.setAttribute('aria-hidden', i !== this.currentIndex);
        });

        // Add animation to active card elements
        const activeCard = this.cards[this.currentIndex];
        this.animateCardElements(activeCard);

        // Reset transition lock after animation completes
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }

    animateCardElements(card) {
        const elements = [
            card.querySelector('.testimonial-stars'),
            card.querySelector('.testimonial-title'),
            card.querySelector('.testimonial-text'),
            card.querySelector('.testimonial-author')
        ];

        elements.forEach((el, index) => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    el.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, 100 + (index * 80));
            }
        });
    }

    animateOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startAutoplay();
                } else {
                    this.stopAutoplay();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(this.track);
    }

    isInViewport() {
        const rect = this.track.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
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

    destroy() {
        this.stopAutoplay();
        this.dots.forEach(dot => dot.remove());
    }
}

// =========================
// CONTACT FORM HANDLER
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
================================
Sent from Holistic Mental Health Services website`
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
            z-index:10000;display:flex;align-items:center;gap:12px;font-weight:500;
            animation:slideInNotification 0.4s cubic-bezier(0.4, 0, 0.2, 1);max-width:400px;
        `;
        notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}" style="font-size:22px;"></i><span>${message}</span>`;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOutNotification 0.4s forwards';
            setTimeout(() => notification.remove(), 400);
        }, 4000);
    }
}

// =========================
// LOCATIONS INTERACTION
// =========================
class LocationsInteraction {
    constructor() {
        this.locationCards = document.querySelectorAll('.location-card');
        this.partnerCard = document.querySelector('.partner-location-card');
        if (this.locationCards.length > 0) this.init();
    }

    init() {
        this.locationCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 100);
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.2 });
            observer.observe(card);
        });

        if (this.partnerCard) {
            this.partnerCard.style.opacity = '0';
            this.partnerCard.style.transform = 'translateY(40px)';
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.partnerCard.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                        this.partnerCard.style.opacity = '1';
                        this.partnerCard.style.transform = 'translateY(0)';
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.3 });
            observer.observe(this.partnerCard);
        }
    }
}

// =========================
// FLOATING BUTTONS (FAB + Back to Top)
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
    }

    addSVGGradient() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '0');
        svg.setAttribute('height', '0');
        svg.style.position = 'absolute';
        svg.innerHTML = `<defs><linearGradient id="bttGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#5DBBC3"/><stop offset="100%" style="stop-color:#7B88C4"/>
        </linearGradient></defs>`;
        document.body.appendChild(svg);
        if (this.progressCircle) this.progressCircle.style.stroke = 'url(#bttGradient)';
    }

    setupBackToTop() {
        this.backToTopBtn?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.backToTopBtn.style.transform = 'scale(0.9)';
            setTimeout(() => { this.backToTopBtn.style.transform = ''; }, 150);
        });
    }

    setupFAB() {
        this.fabMain?.addEventListener('click', () => this.toggleFAB());
        this.fabBackdrop?.addEventListener('click', () => this.closeFAB());
        
        document.querySelectorAll('.fab-action').forEach(action => {
            action.addEventListener('click', () => setTimeout(() => this.closeFAB(), 150));
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
            scrollTop > this.scrollThreshold 
                ? this.backToTopBtn.classList.add('visible') 
                : this.backToTopBtn.classList.remove('visible');
            
            if (this.progressCircle) {
                this.progressCircle.style.strokeDashoffset = Math.max(0, 100 - scrollPercent);
            }
        }

        if (this.isOpen && Math.abs(this.lastScrollTop - scrollTop) > 50) this.closeFAB();
        this.lastScrollTop = scrollTop;
    }
}

// =========================
// CIRCLE ANIMATION
// =========================
class CircleAnimation {
    constructor() {
        this.circle = document.querySelector('.holistic-circle');
        if (this.circle) this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const ring = this.circle.querySelector('.orbit-ring');
                if (ring) ring.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
            });
        }, { threshold: 0.3 });
        observer.observe(this.circle);
    }
}

// =========================
// SMOOTH SCROLL ENHANCER
// =========================
class SmoothScrollEnhancer {
    constructor() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#' || href === '#!') return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
                }
            });
        });
    }
}

// =========================
// ADD ANIMATION STYLES
// =========================
function addAnimationStyles() {
    if (document.getElementById('app-animation-styles')) return;
    const style = document.createElement('style');
    style.id = 'app-animation-styles';
    style.textContent = `
        @keyframes slideInNotification { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOutNotification { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
        @keyframes rippleEffect { to { transform: scale(4); opacity: 0; } }
    `;
    document.head.appendChild(style);
}

// =========================
// MAIN APPLICATION
// =========================
class HolisticMentalHealthApp {
    constructor() {
        this.modules = {};
        document.readyState === 'loading' 
            ? document.addEventListener('DOMContentLoaded', () => this.initializeModules())
            : this.initializeModules();
    }

    initializeModules() {
        try {
            addAnimationStyles();
            
            if (typeof AOS !== 'undefined') {
                AOS.init({ duration: 1000, once: true, offset: 100, easing: 'ease-out-cubic' });
            }

            this.modules = {
                progressNav: new EnhancedProgressNavigation(),
                heroVideo: new HeroVideo(),
                statsCounter: new StatisticsCounter(),
                founderParallax: new FounderImageParallax(),
                credentialTags: new CredentialTagsAnimation(),
                valueCards: new ValueCardsEffect(),
                servicesCarousel: new ServicesCarousel(),
                serviceModals: new ServiceModalSystem(),
                testimonialsSlider: new TestimonialsSlider(),
                contactForm: new ContactFormHandler(),
                locationsInteraction: new LocationsInteraction(),
                floatingButtons: new FloatingButtons(),
                circleAnimation: new CircleAnimation(),
                smoothScroll: new SmoothScrollEnhancer()
            };

            window.holisticApp = this.modules;

            window.addEventListener('load', () => {
                setTimeout(() => this.modules.progressNav?.refreshPositions(), 100);
            });

            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => this.modules.progressNav?.refreshPositions(), 250);
            }, { passive: true });

            this.logSuccess();
        } catch (error) {
            console.error('Error initializing modules:', error);
        }
    }

    logSuccess() {
        console.log('%c✨ Holistic Mental Health Services', 'color: #5DBBC3; font-size: 24px; font-weight: bold;');
        console.log('%c🚀 All Systems Initialized!', 'color: #7B88C4; font-size: 16px;');
        console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #D1D5DB;');
        Object.keys(this.modules).forEach(key => console.log(`%c✓ ${key}`, 'color: #10B981;'));
        console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #D1D5DB;');
    }
}

// =========================
// INITIALIZE
// =========================
new HolisticMentalHealthApp();
