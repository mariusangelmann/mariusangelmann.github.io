document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.main-nav');
    
    // Enhanced mobile menu toggle with animation
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Touch gesture support for mobile menu
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    const handleSwipe = () => {
        const swipeThreshold = 100;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - close menu
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        } else if (touchEndX > touchStartX + swipeThreshold && !navMenu.classList.contains('active')) {
            // Swipe right - open menu
            navMenu.classList.add('active');
            navToggle.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Enhanced smooth scrolling with progress indicator
    const progressIndicator = document.createElement('div');
    progressIndicator.className = 'scroll-progress';
    progressIndicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--secondary-color), var(--accent-color));
        z-index: 1001;
        transition: width 0.1s;
    `;
    document.body.appendChild(progressIndicator);

    // Smooth scrolling with offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const section = document.querySelector(this.getAttribute('href'));
            if (section) {
                const headerOffset = header.offsetHeight;
                const elementPosition = section.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Dynamic header and scroll progress
    let lastScroll = 0;
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const scrollPercent = (currentScroll / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressIndicator.style.width = `${scrollPercent}%`;
        
        if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }

        header.style.backdropFilter = currentScroll > 0 ? 'blur(20px) saturate(180%)' : 'none';
        
        lastScroll = currentScroll;
    });

    // Enhanced section animations with Intersection Observer
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '-50px'
    };

    // Observe sections
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) translateZ(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px) translateZ(0)';
        section.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        sectionObserver.observe(section);
    });

    // Feature items stagger animation
    const featureObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-item, .benefit-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        featureObserver.observe(item);
    });

    // Highlight boxes reveal animation
    const highlightObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.highlight-box').forEach(box => {
        box.style.opacity = '0';
        box.style.transform = 'translateX(-20px)';
        box.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        highlightObserver.observe(box);
    });

    // CTA buttons hover effect
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('mouseover', () => {
            button.style.transform = 'translateY(-5px)';
            button.style.boxShadow = '0 15px 30px rgba(79, 70, 229, 0.3)';
        });

        button.addEventListener('mouseout', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 10px 20px rgba(79, 70, 229, 0.2)';
        });
    });

    // Active section highlighting with smooth transitions
    const navLinks = document.querySelectorAll('.nav-menu a');
    const observerOptionsForNav = {
        root: null,
        threshold: 0.5,
        rootMargin: `-${header.offsetHeight}px 0px 0px 0px`
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptionsForNav);

    document.querySelectorAll('section[id]').forEach((section) => {
        navObserver.observe(section);
    });
});