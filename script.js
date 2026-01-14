/**
 * ================================================
 * HOLISTIC MENTAL HEALTH SERVICES
 * Complete JavaScript with ES6 Class Architecture
 * ================================================
 */

// =========================
// PROGRESS NAVIGATION MANAGER
// =========================
class EnhancedProgressNavigation {
    constructor() {
        // DOM Elements
        this.header = document.getElementById('progressHeader');
        this.pageProgressFill = document.querySelector('.page-progress-fill');
        this.progressLineFill = document.querySelector('.progress-line-fill');
        this.mobileProgressLine = document.querySelector('.mobile-progress-line');
        this.navDots = document.querySelectorAll('.nav-dot');
        this.mobileDots = document.querySelectorAll('.mobile-dot');
        this.mobileSectionLabel = document.querySelector('.mobile-section-label');
        this.mobileSectionCount = document.querySelector('.mobile-section-count');
        
        // State
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
        this.updateActiveSection();
    }

    setupSections() {
        // Build sections array from navigation dots
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

    setupScrollProgress() {
        const updateProgress = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.pageYOffset;
            const progress = Math.min((scrolled / documentHeight) * 100, 100);
            
            // Update page progress bar
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

            // Find active section
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
        const progress = (activeIndex / (totalSections - 1)) * 100;
        
        // Update desktop progress line fill
        if (this.progressLineFill) {
            this.progressLineFill.style.width = `${progress}%`;
        }
        
        // Update mobile progress line
        if (this.mobileProgressLine) {
            this.mobileProgressLine.style.setProperty('--mobile-progress', `${progress}%`);
            // Use CSS to update the ::after pseudo-element
            const styleSheet = document.styleSheets[0];
            const rule = `.mobile-progress-line::after { width: ${progress}%; }`;
            
            // Find and update or insert the rule
            for (let i = 0; i < styleSheet.cssRules.length; i++) {
                if (styleSheet.cssRules[i].selectorText === '.mobile-progress-line::after') {
                    styleSheet.deleteRule(i);
                    break;
                }
            }
            styleSheet.insertRule(rule, styleSheet.cssRules.length);
        }

        // Update desktop navigation dots
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

        // Update mobile section label
        if (this.mobileSectionLabel) {
            this.mobileSectionLabel.textContent = activeSection.label;
        }
        
        // Update mobile section counter
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

        // Desktop dots
        this.navDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                const target = dot.getAttribute('data-target');
                scrollToSection(target);
            });
        });

        // Mobile dots
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
        // DOM Elements
        this.modal = document.getElementById('locationsModal');
        this.openBtn = document.getElementById('locationsBtn');
        this.closeBtn = document.getElementById('modalClose');
        this.overlay = this.modal ? this.modal.querySelector('.modal-overlay') : null;
        this.locationCards = this.modal ? this.modal.querySelectorAll('.location-card') : [];
        
        // State
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
        // Open modal
        this.openBtn.addEventListener('click', () => this.open());

        // Close modal
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }

        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }

        // Prevent clicks inside modal from closing
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
        // Stagger animation for location cards
        this.locationCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.transitionDelay = `${index * 0.1}s`;
        });
    }

    open() {
        this.isOpen = true;
        
        // Save scroll position and prevent body scroll
        this.scrollPosition = window.pageYOffset;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollPosition}px`;
        document.body.style.width = '100%';
        
        // Open modal
        this.modal.classList.add('active');
        
        // Animate cards
        setTimeout(() => {
            this.locationCards.forEach(card => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }, 200);
        
        // Focus management
        if (this.closeBtn) {
            this.closeBtn.focus();
        }
    }

    close() {
        this.isOpen = false;
        
        // Animate cards out
        this.locationCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
        });
        
        // Close modal after animation
        setTimeout(() => {
            this.modal.classList.remove('active');
            
            // Restore body scroll
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            window.scrollTo(0, this.scrollPosition);
        }, 300);
    }

    // Public method to programmatically open modal
    openModal() {
        this.open();
    }

    // Public method to programmatically close modal
    closeModal() {
        this.close();
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
        this.setupRippleEffect();
        this.setupHoverSound();
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
                icon.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
        
        // Add ripple animation
        this.addRippleAnimation();
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

    setupHoverSound() {
        // Optional: Add subtle haptic feedback for mobile
        this.actionIcons.forEach(icon => {
            icon.addEventListener('touchstart', () => {
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            });
        });
    }
}

// =========================
// INITIALIZE ENHANCED HEADER SYSTEM
// =========================
class EnhancedHeaderSystem {
    constructor() {
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
        // Initialize enhanced progress navigation
        const progressNav = new EnhancedProgressNavigation();
        
        // Initialize locations modal
        const locationsModal = new LocationsModal();
        
        // Initialize action icons enhancements
        new ActionIconsEnhancer();

        // Make instances globally accessible
        window.enhancedProgressNav = progressNav;
        window.locationsModal = locationsModal;

        // Refresh positions after images load
        window.addEventListener('load', () => {
            if (progressNav) {
                progressNav.refreshPositions();
            }
        });
        
        // Refresh on window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (progressNav) {
                    progressNav.refreshPositions();
                }
            }, 250);
        });
        
        console.log('%c✨ Enhanced Header System Initialized', 'color: #5DBBC3; font-size: 16px; font-weight: bold;');
    }
}

// Initialize the enhanced header system
new EnhancedHeaderSystem();

// =========================
// HERO VIDEO CONTROLLER
// =========================
class HeroVideo {
    constructor() {
        this.video = document.querySelector('.hero-bg-video');
        this.hero = document.querySelector('.hero');
        
        if (this.video) {
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
                    this.video.play();
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
// STATISTICS COUNTER CLASS
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
// TESTIMONIALS SLIDER CLASS
// =========================
class TestimonialsSlider {
    constructor() {
        this.track = document.getElementById('testimonialTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dotsContainer = document.getElementById('sliderDots');
        
        if (!this.track) return;
        
        this.cards = Array.from(this.track.children);
        this.currentIndex = 0;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000;
        
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
        });

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
        });
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
        });
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
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    const offsetTop = target.offsetTop - 75;
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
// INITIALIZE APPLICATION
// =========================
class App {
    constructor() {
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
        const EnhancedHeaderSystem = new EnhancedHeaderSystem();
        new HeroVideo();
        new StatisticsCounter();
        new TestimonialsSlider();
        new FormHandler();
        new ScrollToTop();
        new CircleAnimation();
        new SmoothScrollEnhancer();

        // Make progressNav globally accessible
        window.progressNav = progressNav;

        // Add notification styles
        this.addNotificationStyles();
        
        // Refresh positions after images load
        window.addEventListener('load', () => {
            if (progressNav) {
                progressNav.refreshPositions();
            }
        });
        
        // Refresh on window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (progressNav) {
                    progressNav.refreshPositions();
                }
            }, 250);
        });
        
        console.log('%c✨ Holistic Mental Health Services', 'color: #5DBBC3; font-size: 20px; font-weight: bold;');
        console.log('%cWebsite initialized successfully!', 'color: #7B88C4; font-size: 14px;');
    }

    addNotificationStyles() {
        const style = document.createElement('style');
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

// Initialize the application
new App();
