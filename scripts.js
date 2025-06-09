// SMG Electrical - Apple-Inspired JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initScrollAnimations();
    initCountUpAnimation();
    initCarousel();
    initFormValidation();
    initSmoothScroll();
    initBackToTop();
    initFloatingActions();
});

// Navigation functionality
function initNavigation() {
    const navWrapper = document.querySelector('.nav-wrapper');
    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 10) {
            navWrapper.classList.add('scrolled');
        } else {
            navWrapper.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close mobile menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Scroll-triggered animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Stagger animations for grid items
                if (entry.target.classList.contains('service-card') ||
                    entry.target.classList.contains('about-item') ||
                    entry.target.classList.contains('testimonial-card')) {
                    const siblings = entry.target.parentElement.children;
                    Array.from(siblings).forEach((sibling, index) => {
                        setTimeout(() => {
                            sibling.classList.add('visible');
                        }, index * 100);
                    });
                }
                
                // Trigger count up for stats
                if (entry.target.classList.contains('stat-item')) {
                    const number = entry.target.querySelector('.stat-number');
                    if (number && !number.classList.contains('counted')) {
                        countUp(number);
                    }
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animatedElements = document.querySelectorAll(
        '.service-card, .stat-item, .about-item, .testimonial-card, .feature-text, .feature-visual'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Count up animation for statistics
function initCountUpAnimation() {
    const statItems = document.querySelectorAll('.stat-item');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.classList.contains('counted')) {
                    countUp(statNumber);
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    statItems.forEach(item => {
        observer.observe(item);
    });
}

// Count up function with easing
function countUp(element) {
    element.classList.add('counted');
    
    const target = parseInt(element.getAttribute('data-target'));
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000; // 2 seconds
    const frameRate = 60; // 60 fps
    const totalFrames = Math.round(duration / (1000 / frameRate));
    let frame = 0;
    
    // Easing function (ease-out-expo)
    const easeOutExpo = (t) => {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };
    
    const counter = setInterval(() => {
        frame++;
        const progress = easeOutExpo(frame / totalFrames);
        const currentCount = Math.round(target * progress);
        
        element.textContent = currentCount + suffix;
        
        if (frame === totalFrames) {
            clearInterval(counter);
            element.textContent = target + suffix;
        }
    }, 1000 / frameRate);
}

// Carousel functionality
function initCarousel() {
    const slides = document.querySelectorAll('.project-slide');
    const navButtons = document.querySelectorAll('.carousel-btn');
    let currentSlide = 0;
    
    if (slides.length === 0) return;
    
    // Auto-play carousel
    const autoPlayInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateCarousel();
    }, 5000);
    
    // Navigation button clicks
    navButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel();
            clearInterval(autoPlayInterval);
        });
    });
    
    function updateCarousel() {
        slides.forEach(slide => slide.classList.remove('active'));
        navButtons.forEach(btn => btn.classList.remove('active'));
        
        slides[currentSlide].classList.add('active');
        navButtons[currentSlide].classList.add('active');
    }
}

// Form validation
function initFormValidation() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    
    // Add input event listeners for floating labels
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Basic validation
        let isValid = true;
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                showError(input, 'This field is required');
            } else {
                clearError(input);
            }
            
            // Email validation
            if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    isValid = false;
                    showError(input, 'Please enter a valid email address');
                }
            }
            
            // Phone validation
            if (input.type === 'tel' && input.value) {
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                if (!phoneRegex.test(input.value)) {
                    isValid = false;
                    showError(input, 'Please enter a valid phone number');
                }
            }
        });
        
        if (isValid) {
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            try {
                await submitForm(new FormData(form));
                
                // Success state
                submitBtn.textContent = 'Message sent!';
                submitBtn.style.background = 'var(--color-success)';
                
                // Reset form
                setTimeout(() => {
                    form.reset();
                    inputs.forEach(input => {
                        input.parentElement.classList.remove('focused');
                    });
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
                
            } catch (error) {
                // Error state
                submitBtn.textContent = 'Error - Please try again';
                submitBtn.style.background = 'var(--color-error)';
                submitBtn.disabled = false;
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                }, 3000);
            }
        }
    });
}

function showError(input, message) {
    const formGroup = input.parentElement;
    formGroup.classList.add('error');
    
    // Remove existing error message
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: var(--color-error);
        font-size: 0.875rem;
        margin-top: 0.25rem;
    `;
    formGroup.appendChild(errorDiv);
}

function clearError(input) {
    const formGroup = input.parentElement;
    formGroup.classList.remove('error');
    
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

async function submitForm(formData) {
    // Simulate API call
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Log form data (replace with actual API call)
            console.log('Form submitted with data:');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
            
            // Simulate 90% success rate
            if (Math.random() > 0.1) {
                resolve();
            } else {
                reject(new Error('Submission failed'));
            }
        }, 2000);
    });
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });
}

// Back to top button
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Floating action buttons
function initFloatingActions() {
    const fabs = document.querySelectorAll('.fab');
    
    // Add ripple effect on click
    fabs.forEach(fab => {
        fab.addEventListener('click', function(e) {
            // Create ripple
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                transform: scale(0);
                animation: ripple 0.6s ease-out;
            `;
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Add ripple animation to stylesheet
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .fab {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Parallax effect for hero section
function initParallax() {
    const heroImage = document.querySelector('.hero-image-wrapper');
    if (!heroImage) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (scrolled < window.innerHeight) {
            heroImage.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    });
}

// Initialize parallax
initParallax();

// Performance optimization - Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll events
const optimizedScroll = debounce(() => {
    // Scroll-based functions here
}, 10);

window.addEventListener('scroll', optimizedScroll);

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initLazyLoading();

// Advanced hover effects for service cards
function initHoverEffects() {
    const cards = document.querySelectorAll('.service-card, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// Initialize hover effects
initHoverEffects();

// Page load animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero elements
    const heroElements = document.querySelectorAll('.hero-headline, .hero-subheadline, .hero-cta-group');
    heroElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        el.classList.add('animate-in');
    });
});

// Service worker registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Service worker registration failed
        });
    });
}

// Analytics tracking (placeholder)
function trackEvent(category, action, label) {
    // Replace with actual analytics implementation
    console.log('Analytics Event:', { category, action, label });
}

// Track CTA clicks
document.querySelectorAll('.btn-primary, .nav-cta, .fab-phone').forEach(btn => {
    btn.addEventListener('click', () => {
        trackEvent('CTA', 'Click', btn.textContent.trim());
    });
});

// Accessibility improvements
function initAccessibility() {
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#services';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--color-primary);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '8px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Ensure all interactive elements are keyboard accessible
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    interactiveElements.forEach(el => {
        if (!el.hasAttribute('tabindex')) {
            el.setAttribute('tabindex', '0');
        }
    });
}

// Initialize accessibility features
initAccessibility();

// Console message
console.log('%cSMG Electrical', 'font-size: 24px; font-weight: bold; color: #0071e3;');
console.log('Premium electrical services on the Gold Coast');
console.log('Need electrical work? Call us at 0412 345 678');