/**
 * ================================================
 * HOLISTIC MENTAL HEALTH SERVICES
 * Modern JavaScript with ES6 Class Architecture
 * ================================================
 */

// =========================
// NAVIGATION CLASS
// =========================

class ProgressNavigation {
    constructor() {
        // DOM Elements
        this.header = document.getElementById('progressHeader');
        this.progressFill = document.querySelector('.page-progress-fill');
        this.progressConnector = document.querySelector('.progress-connector');
        this.navPoints = document.querySelectorAll('.nav-point');
        this.mobilePoints = document.querySelectorAll('.mobile-point');
        this.sectionLabel = document.querySelector('.active-section-name');
        
        // State
        this.sections = [];
        this.currentSection = null;
        this.isScrolling = false;
        this.scrollTimeout = null;
        
        // Configuration
        this.offsetThreshold = 150;
        
        this.init();
    }

    init() {
        this.setupSections();
        this.setupScrollProgress();
        this.setupActiveSectionDetection();
        this.setupSmoothScrolling();
        this.setupHeaderScroll();
        this.updateActiveSection();
    }

    /**
     * Map all sections from navigation points
     */
    setupSections() {
        this.navPoints.forEach(point => {
            const target = point.getAttribute('data-target');
            const element = document.getElementById(target);
            
            if (element) {
                this.sections.push({
                    id: target,
                    element: element,
                    navPoint: point,
                    mobilePoint: document.querySelector(`.mobile-point[data-target="${target}"]`),
                    label: point.querySelector('.point-label').textContent
                });
            }
        });
    }

    /**
     * Update page scroll progress bar
     */
    setupScrollProgress() {
        const updateProgress = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.pageYOffset;
            const progress = Math.min((scrolled / documentHeight) * 100, 100);
            
            if (this.progressFill) {
                this.progressFill.style.width = `${progress}%`;
            }
        };

        // Initial update
        updateProgress();

        // Update on scroll (throttled)
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

    /**
     * Detect active section and update navigation
     */
    setupActiveSectionDetection() {
        const detectActive = () => {
            const scrollPosition = window.pageYOffset + this.offsetThreshold;
            
            let activeSection = null;
            let activeSectionIndex = 0;

            // Find the current active section
            for (let i = this.sections.length - 1; i >= 0; i--) {
                const section = this.sections[i];
                const sectionTop = section.element.offsetTop;
                
                if (scrollPosition >= sectionTop) {
                    activeSection = section;
                    activeSectionIndex = i;
                    break;
                }
            }

            // Update if section changed
            if (activeSection && activeSection.id !== this.currentSection) {
                this.currentSection = activeSection.id;
                this.updateNavigationState(activeSection, activeSectionIndex);
            }
        };

        // Initial detection
        detectActive();

        // Detect on scroll
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

    /**
     * Update navigation active and completed states
     */
    updateNavigationState(activeSection, activeIndex) {
        // Calculate progress connector width
        const totalSections = this.sections.length;
        const progress = (activeIndex / (totalSections - 1)) * 100;
        
        if (this.progressConnector) {
            this.progressConnector.style.setProperty('--progress-width', `${progress}%`);
            const connectorAfter = this.progressConnector.querySelector('::after') || this.progressConnector;
            if (connectorAfter) {
                connectorAfter.style.width = `${progress}%`;
            }
        }

        // Update all sections
        this.sections.forEach((section, index) => {
            const isActive = section.id === activeSection.id;
            const isCompleted = index < activeIndex;

            // Desktop navigation
            if (section.navPoint) {
                section.navPoint.classList.toggle('active', isActive);
                section.navPoint.classList.toggle('completed', isCompleted);
            }

            // Mobile navigation
            if (section.mobilePoint) {
                section.mobilePoint.classList.toggle('active', isActive);
                section.mobilePoint.classList.toggle('completed', isCompleted);
            }
        });

        // Update mobile section label
        if (this.sectionLabel) {
            this.sectionLabel.textContent = activeSection.label;
        }
    }

    /**
     * Setup smooth scrolling to sections
     */
    setupSmoothScrolling() {
        const scrollToSection = (target) => {
            const element = document.getElementById(target);
            
            if (!element) return;

            const offsetPosition = element.offsetTop - 75; // Header height offset
            
            this.isScrolling = true;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Reset scrolling flag after animation
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
            }, 1000);
        };

        // Desktop navigation points
        this.navPoints.forEach(point => {
            point.addEventListener('click', (e) => {
                e.preventDefault();
                const target = point.getAttribute('data-target');
                scrollToSection(target);
            });
        });

        // Mobile navigation points
        this.mobilePoints.forEach(point => {
            point.addEventListener('click', (e) => {
                e.preventDefault();
                const target = point.getAttribute('data-target');
                scrollToSection(target);
            });
        });
    }

    /**
     * Add scroll effect to header
     */
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

    /**
     * Force update active section (useful after page load)
     */
    updateActiveSection() {
        setTimeout(() => {
            const event = new Event('scroll');
            window.dispatchEvent(event);
        }, 100);
    }

    /**
     * Refresh section positions (call after dynamic content)
     */
    refreshPositions() {
        this.sections.forEach(section => {
            section.offset = section.element.offsetTop;
        });
        this.updateActiveSection();
    }
}

class SmoothScrollEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.enhanceNavLinks();
        this.addKeyboardNavigation();
    }

    /**
     * Enhance all anchor links on the page
     */
    enhanceNavLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            if (anchor.classList.contains('nav-point') || 
                anchor.classList.contains('mobile-point')) {
                return; // Already handled by ProgressNavigation
            }

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

    /**
     * Add keyboard navigation support
     */
    addKeyboardNavigation() {
        const navPoints = document.querySelectorAll('.nav-point');
        
        navPoints.forEach((point, index) => {
            point.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    point.click();
                }
                
                // Arrow key navigation
                if (e.key === 'ArrowRight' && navPoints[index + 1]) {
                    e.preventDefault();
                    navPoints[index + 1].focus();
                } else if (e.key === 'ArrowLeft' && navPoints[index - 1]) {
                    e.preventDefault();
                    navPoints[index - 1].focus();
                }
            });
        });
    }
}

class SectionObserver {
    constructor(progressNav) {
        this.progressNav = progressNav;
        this.observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };
        
        this.init();
    }

    init() {
        if (!('IntersectionObserver' in window)) {
            console.log('IntersectionObserver not supported, using fallback');
            return;
        }

        this.setupObserver();
    }

    setupObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    const section = this.progressNav.sections.find(s => s.id === sectionId);
                    
                    if (section) {
                        const index = this.progressNav.sections.indexOf(section);
                        this.progressNav.updateNavigationState(section, index);
                        this.progressNav.currentSection = sectionId;
                    }
                }
            });
        }, this.observerOptions);

        // Observe all sections
        this.progressNav.sections.forEach(section => {
            observer.observe(section.element);
        });
    }
}

class LogoAnimator {
    constructor() {
        this.logo = document.querySelector('.header-logo');
        this.logoImage = document.querySelector('.logo-image');
        this.lastScroll = 0;
        
        if (this.logo && this.logoImage) {
            this.init();
        }
    }

    init() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.animateLogo();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    animateLogo() {
        const currentScroll = window.pageYOffset;
        const scrollDifference = Math.abs(currentScroll - this.lastScroll);
        
        if (scrollDifference > 5) {
            // Subtle rotation based on scroll direction
            const rotation = currentScroll > this.lastScroll ? 2 : -2;
            this.logoImage.style.transform = `rotate(${rotation}deg)`;
            
            setTimeout(() => {
                this.logoImage.style.transform = 'rotate(0deg)';
            }, 200);
        }
        
        this.lastScroll = currentScroll;
    }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProgressNavigation);
} else {
    initProgressNavigation();
}

function initProgressNavigation() {
    // Initialize main navigation system
    const progressNav = new ProgressNavigation();
    
    // Initialize enhancements
    new SmoothScrollEnhancer();
    new SectionObserver(progressNav);
    new LogoAnimator();
    
    // Make progressNav globally accessible for debugging
    window.progressNav = progressNav;
    
    // Refresh positions after images load
    window.addEventListener('load', () => {
        progressNav.refreshPositions();
    });
    
    // Refresh on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            progressNav.refreshPositions();
        }, 250);
    });
    
    console.log('%c✨ Progress Navigation Initialized', 'color: #5DBBC3; font-size: 14px; font-weight: bold;');
}

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js';
    document.head.appendChild(script);
}

/**
 * ================================================
 * HERO VIDEO BACKGROUND CONTROLLER
 * Simple ES6 Class for Video Management
 * ================================================
 */

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

    /**
     * Ensure video plays automatically
     */
    setupVideoAutoplay() {
        this.video.addEventListener('loadeddata', () => {
            this.video.play().catch(error => {
                console.log('Video autoplay prevented:', error);
                // If autoplay is blocked, try muted autoplay
                this.video.muted = true;
                this.video.play();
            });
        });
    }

    /**
     * Pause video when out of viewport for performance
     */
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

    /**
     * Fallback if video fails to load
     */
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

/**
 * ================================================
 * INITIALIZE HERO VIDEO
 * ================================================
 */

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new HeroVideo();
    });
} else {
    new HeroVideo();
}

// =========================
// STATISTICS COUNTER CLASS
// =========================
class StatisticsCounter {
    constructor() {
        this.statNumbers = document.querySelectorAll('.stat-number');
        this.animated = new Set();
        
        this.init();
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

        // Touch events for mobile
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

        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate API call (replace with actual endpoint)
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
// PARTICLES ANIMATION CLASS
// =========================
class ParticlesAnimation {
    constructor() {
        this.container = document.querySelector('.hero-particles');
        
        if (!this.container) return;
        
        this.particles = [];
        this.particleCount = 50;
        
        this.init();
    }

    init() {
        this.createParticles();
        this.animate();
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 2;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, rgba(93, 187, 195, 0.8), rgba(123, 136, 196, 0.4));
                border-radius: 50%;
                left: ${x}%;
                top: ${y}%;
                animation: particleFloat ${duration}s ease-in-out ${delay}s infinite;
                pointer-events: none;
            `;
            
            this.container.appendChild(particle);
            this.particles.push(particle);
        }
    }

    animate() {
        // Particles are animated via CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                0%, 100% {
                    transform: translate(0, 0) scale(1);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0.5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// =========================
// PARALLAX EFFECT CLASS
// =========================
class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('[data-parallax]');
        
        if (this.elements.length === 0) return;
        
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            this.elements.forEach(element => {
                const speed = element.getAttribute('data-parallax') || 0.5;
                const yPos = -(window.pageYOffset * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
}

// =========================
// LAZY LOADING CLASS
// =========================
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        
        if (this.images.length === 0) return;
        
        this.init();
    }

    init() {
        const options = {
            threshold: 0.1,
            rootMargin: '50px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.images.forEach(img => observer.observe(img));
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;

        img.src = src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
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
// INITIALIZE APPLICATION
// =========================
class App {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
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
        new ProgressNavigation();
        new StatisticsCounter();
        new TestimonialsSlider();
        new FormHandler();
        new ScrollToTop();
        new ParticlesAnimation();
        new ParallaxEffect();
        new LazyLoader();
        new CircleAnimation();

        // Add custom notification styles
        this.addNotificationStyles();
        
        // Add smooth scroll behavior
        this.setupSmoothScrolling();
        
        // Log initialization
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

    setupSmoothScrolling() {
        // Add smooth scrolling to all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
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

// Initialize the application
new App();
