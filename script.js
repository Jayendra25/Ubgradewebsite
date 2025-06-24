// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Force start from top on initial page load
    if (!sessionStorage.getItem('assignmentsScrollPosition') || !document.referrer.includes('/weeks/')) {
        window.scrollTo(0, 0);
    }
    
    // Add smooth scrolling for anchor links
    addSmoothScrolling();
    
    // Initialize theme (light/dark mode)
    initTheme();
    
    // Apply typing effect to all paragraphs
    applyTypingEffect();
    
    // Initialize background scroll animations
    initScrollAnimations();
    
    // Initialize page navigation state preservation
    initNavigationStatePreservation();
    
    // Fade-in effect for elements with the 'fade-in' class
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Create an intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Once the animation is done, unobserve the element
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // viewport
        threshold: 0.1, // 10% of the element must be visible
        rootMargin: '0px 0px -50px 0px' // Adds a small margin to the bottom
    });
    
    // Observe each element
    fadeElements.forEach(element => {
        observer.observe(element);
    });
});

// Function to initialize theme (light/dark mode)
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use the OS preference
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Set initial theme
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i><span class="feature-label">NEW</span>';
        }
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i><span class="feature-label">NEW</span>';
        }
    }
    
    // Add click event to theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            let theme = 'light';
            
            // Toggle theme
            if (document.documentElement.getAttribute('data-theme') === 'light') {
                document.documentElement.setAttribute('data-theme', 'dark');
                theme = 'dark';
                this.innerHTML = '<i class="fas fa-sun"></i><span class="feature-label">NEW</span>';
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                this.innerHTML = '<i class="fas fa-moon"></i><span class="feature-label">NEW</span>';
            }
            
            // Save preference
            localStorage.setItem('theme', theme);
        });
    }
}

// Function to initialize background scroll animations
function initScrollAnimations() {
    // Background parallax effect
    const floatingElements = document.querySelectorAll('.floating-element');
    const fadeBg = document.querySelector('.fade-bg');
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('main section');
    const videoContainers = document.querySelectorAll('.video-container');
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const bgCircles = document.querySelectorAll('.bg-circle');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    // Check if these elements exist on the page
    if (!floatingElements.length && !fadeBg) return;
    
    // Store initial positions for floating elements
    floatingElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        element.dataset.initialTop = rect.top;
        element.dataset.initialLeft = rect.left;
    });
    
    // Create an Intersection Observer for sections
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    });
    
    // Observe each section
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Observe video containers
    videoContainers.forEach(container => {
        sectionObserver.observe(container);
    });
    
    // Observe reveal elements
    revealElements.forEach(element => {
        sectionObserver.observe(element);
    });
    
    // Initialize rotation and position values for circles
    bgCircles.forEach((circle, index) => {
        circle.dataset.rotation = Math.random() * 360;
        circle.dataset.posX = parseInt(window.getComputedStyle(circle).left);
        circle.dataset.posY = parseInt(window.getComputedStyle(circle).top);
        circle.dataset.amplitude = 30 + (index * 10);
        circle.dataset.speed = 0.5 + (index * 0.2);
    });
    
    let lastScrollTop = 0;
    let scrollDirection = 0;
    let ticking = false;
    let scrollThreshold = 150; // Threshold to hide scroll indicator
    let lastAnimationTime = 0;
    const animationInterval = 1000 / 60; // 60fps target
    
    // Optimized scroll event handler using requestAnimationFrame
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const now = performance.now();
                const scrollTop = window.scrollY;
                const scrollDelta = scrollTop - lastScrollTop;
                scrollDirection = scrollDelta > 0 ? 1 : -1;
                
                // Hide scroll indicator after scrolling past threshold
                if (scrollIndicator && scrollTop > scrollThreshold) {
                    scrollIndicator.classList.add('hidden');
                }
                
                // Throttle animations to target frame rate
                if (now - lastAnimationTime >= animationInterval) {
                    updateAnimations(scrollTop, scrollDelta, scrollDirection);
                    lastAnimationTime = now;
                }
                
                lastScrollTop = scrollTop;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true }); // Add passive flag for better performance
    
    function updateAnimations(scrollTop, scrollDelta, scrollDirection) {
        const windowHeight = window.innerHeight;
        const documentHeight = document.body.clientHeight;
        
        // Add header scroll effect
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Calculate scroll percentage
        const scrollPercentage = (scrollTop) / (documentHeight - windowHeight);
        
        // Add fast-scroll class to body when scrolling quickly
        const isFastScroll = Math.abs(scrollDelta) > 30;
        if (isFastScroll) {
            document.body.classList.add('fast-scroll');
            
            // Randomly animate some circles for fast scrolling
            // Limit animation to once every 500ms for performance
            if (Math.random() > 0.9) {
                const randomCircle = bgCircles[Math.floor(Math.random() * bgCircles.length)];
                randomCircle.classList.remove('animate-up', 'animate-down');
                
                // Choose animation direction based on scroll direction
                if (scrollDirection > 0) {
                    randomCircle.classList.add('animate-down');
                } else {
                    randomCircle.classList.add('animate-up');
                }
                
                // Remove the animation class after it completes
                setTimeout(() => {
                    randomCircle.classList.remove('animate-up', 'animate-down');
                }, 2000);
            }
        } else {
            document.body.classList.remove('fast-scroll');
        }
        
        // Use transform: translate3d() for GPU acceleration and reduce the number of properties being animated
        floatingElements.forEach(element => {
            const speed = element.classList.contains('floating-square') ? 0.5 : 
                        element.classList.contains('floating-triangle') ? 0.7 : 0.3;
            
            const moveY = scrollTop * speed;
            
            // Use translate3d for hardware acceleration
            if (element.classList.contains('floating-square')) {
                element.style.transform = `translate3d(${moveY * 0.2}px, ${moveY}px, 0) rotate(${scrollTop * 0.05}deg)`;
            } else if (element.classList.contains('floating-triangle')) {
                element.style.transform = `translate3d(${-moveY * 0.3}px, ${moveY * 0.8}px, 0) rotate(${-scrollTop * 0.08}deg)`;
            } else {
                element.style.transform = `translate3d(${moveY * 0.1}px, ${moveY * 0.6}px, 0) scale(${1 + scrollPercentage * 0.3})`;
            }
            
            // Only update opacity on fast scroll to reduce layout calculations
            if (isFastScroll && element.style.opacity !== '0.12') {
                element.style.opacity = '0.12';
            } else if (!isFastScroll && element.style.opacity !== '0.08') {
                element.style.opacity = '0.08';
            }
        });
        
        // Reduce the number of circles being animated based on viewport visibility
        bgCircles.forEach((circle, index) => {
            // Skip animation for circles that are likely out of viewport
            const rect = circle.getBoundingClientRect();
            if (rect.bottom < -100 || rect.top > window.innerHeight + 100) {
                return;
            }
            
            // Get stored values
            let rotation = parseFloat(circle.dataset.rotation || 0);
            const amplitude = parseFloat(circle.dataset.amplitude || 30);
            const speed = parseFloat(circle.dataset.speed || 0.5);
            
            // Update rotation based on scroll
            rotation += scrollDelta * 0.05 * speed;
            circle.dataset.rotation = rotation;
            
            // Calculate position offsets based on scroll
            const xOffset = Math.sin(scrollTop * 0.001 * speed) * amplitude * scrollDirection;
            const yOffset = Math.cos(scrollTop * 0.001 * speed) * amplitude;
            
            // Scale based on scroll percentage and direction
            const scale = 0.5 + (scrollPercentage * 1.5) + (Math.min(Math.abs(scrollDelta) * 0.001, 0.5));
            
            // Enhanced opacity based on scroll speed
            let opacity = 0.03 + (scrollPercentage * 0.07);
            
            // Increase opacity when scrolling fast
            if (isFastScroll) {
                opacity += Math.min(Math.abs(scrollDelta) * 0.001, 0.1);
            }
            
            // Apply transformations with acceleration based on scroll speed
            const accelerationFactor = Math.min(Math.abs(scrollDelta) * 0.01, 2);
            circle.style.transform = `translate3d(${xOffset * accelerationFactor}px, ${yOffset * accelerationFactor}px, 0) rotate(${rotation}deg) scale(${scale})`;
            
            // Only update properties if they've changed significantly
            if (Math.abs(parseFloat(circle.style.opacity) - opacity) > 0.02) {
                circle.style.opacity = opacity;
            }
            
            // Add blur effect based on scroll speed - but only on desktop
            if (window.innerWidth > 768) {
                if (isFastScroll) {
                    const blurAmount = Math.min(Math.abs(scrollDelta) * 0.05, 5);
                    circle.style.filter = `blur(${blurAmount}px)`;
                } else if (circle.style.filter !== 'blur(0px)') {
                    circle.style.filter = 'blur(0px)';
                }
            }
        });
        
        // Fade background based on scroll position and velocity
        if (fadeBg) {
            const baseOpacity = Math.min(scrollPercentage * 2, 0.3);
            const velocityEffect = Math.min(Math.abs(scrollDelta) * 0.0005, 0.15);
            fadeBg.style.opacity = baseOpacity + velocityEffect;
        }
    }
    
    // Trigger a scroll event to initialize positions
    window.dispatchEvent(new Event('scroll'));
}

// Function to add smooth scrolling for anchor links
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Use the CSS-based smooth scrolling for better performance
                targetElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Add offset for fixed header if needed
                const scrolledY = window.scrollY;
                if (scrolledY) {
                    setTimeout(() => {
                        window.scrollTo({
                            top: window.scrollY - 70,
                            behavior: 'smooth'
                        });
                    }, 0);
                }
            }
        });
    });
}

// Function to apply typing effect to all paragraphs
function applyTypingEffect() {
    // Select all paragraphs in main content area
    const paragraphs = document.querySelectorAll('main p');
    
    // Only apply to visible paragraphs (performance improvement)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const paragraph = entry.target;
                const originalText = paragraph.textContent;
                
                // Skip if paragraph is empty or already processed
                if (!originalText.trim() || paragraph.dataset.typingProcessed) return;
                
                // Mark as processed to avoid duplicating
                paragraph.dataset.typingProcessed = 'true';
                
                // Store original HTML with formatting
                paragraph.dataset.originalHtml = paragraph.innerHTML;
                // Clear the paragraph
                paragraph.textContent = '';
                
                // Start the typing effect with a short delay
                setTimeout(() => {
                    typeText(paragraph, originalText, 0);
                }, 300);
                
                // Unobserve after processing
                observer.unobserve(paragraph);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px 50px 0px'
    });
    
    // Observe each paragraph
    paragraphs.forEach(paragraph => {
        observer.observe(paragraph);
    });
}

// Type a single paragraph with performance optimizations
function typeText(element, text, index) {
    // Don't start typing if user is actively scrolling to reduce jank
    if (document.body.classList.contains('fast-scroll')) {
        // If scrolling fast, delay typing
        setTimeout(() => typeText(element, text, index), 100);
        return;
    }
    
    // Add typing class at the start to show cursor
    if (index === 0) {
        element.classList.add('typing');
    }
    
    // Batch typing process for better performance
    const chunkSize = 5; // Type 5 characters at once
    const endIndex = Math.min(index + chunkSize, text.length);
    
    if (index < text.length) {
        // Add a chunk of characters at a time
        element.textContent += text.substring(index, endIndex);
        
        // Speed varies slightly for natural effect
        const speed = 2; // Faster typing speed
        
        // Continue to the next chunk
        setTimeout(() => typeText(element, text, endIndex), speed);
    } else {
        // Remove typing class to hide cursor
        element.classList.remove('typing');
        
        // Restore original HTML with formatting after typing is complete
        if (element.dataset.originalHtml) {
            setTimeout(() => {
                element.innerHTML = element.dataset.originalHtml;
            }, 100);
        }
    }
}

// Function to initialize navigation state preservation
function initNavigationStatePreservation() {
    // Check if we're on the assignments page
    const isAssignmentsPage = window.location.pathname.endsWith('assignments.html');
    
    if (isAssignmentsPage) {
        // Save scroll position before leaving the page
        const assignmentCards = document.querySelectorAll('.assignment-card');
        if (assignmentCards.length > 0) {
            assignmentCards.forEach(card => {
                const weekLink = card.querySelector('.assignment-link');
                const detailsBtn = card.querySelector('.view-details-btn');
                
                if (weekLink) {
                    weekLink.addEventListener('click', function(e) {
                        // Save current scroll position to sessionStorage
                        sessionStorage.setItem('assignmentsScrollPosition', window.scrollY);
                    });
                }
                
                if (detailsBtn) {
                    detailsBtn.addEventListener('click', function(e) {
                        // Save current scroll position to sessionStorage
                        sessionStorage.setItem('assignmentsScrollPosition', window.scrollY);
                    });
                }
            });
        }
        
        // Check if this is a fresh visit to the page or a return from a week page
        if (document.referrer.includes('/weeks/week')) {
            // Coming back from a week page - restore scroll position
            if (sessionStorage.getItem('assignmentsScrollPosition')) {
                // Get the saved scroll position - but wait for page content to load first
                window.addEventListener('load', function() {
                    // Get the saved scroll position
                    const scrollPosition = parseInt(sessionStorage.getItem('assignmentsScrollPosition'));
                    
                    // Scroll to the saved position with smooth behavior for better UX
                    setTimeout(() => {
                        window.scrollTo({
                            top: scrollPosition,
                            behavior: 'smooth' // Smooth scrolling for better UX
                        });
                    }, 100); // Small delay to ensure page is ready
                });
            }
        } else {
            // Fresh visit - always start from the top
            window.scrollTo(0, 0);
            // Clear any saved position to avoid issues on future visits
            sessionStorage.removeItem('assignmentsScrollPosition');
        }
    }
    
    // Check if we're on a week page
    const isWeekPage = window.location.pathname.includes('/weeks/week');
    
    if (isWeekPage) {
        // Add event listener to the assignments link in nav
        const assignmentsLink = document.querySelector('nav a[href="../assignments.html"]');
        if (assignmentsLink) {
            assignmentsLink.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Instead of normal navigation, set the URL without refreshing
                const originalState = { scrollPos: window.scrollY };
                window.history.pushState(originalState, '', this.href);
                
                // Store the position in sessionStorage for page load fallback
                sessionStorage.setItem('assignmentsScrollPosition', 0);
                
                // Now manually redirect to preserve the browser back button functionality
                window.location.replace(this.href); // Use replace for smoother navigation
            });
        }
        
        // Add custom back button functionality
        const backButton = document.querySelector('.back-to-assignments');
        if (backButton) {
            backButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Instead of normal navigation, set the URL without refreshing
                const originalState = { scrollPos: window.scrollY };
                window.history.pushState(originalState, '', this.href);
                
                // Store the position in sessionStorage for page load fallback
                sessionStorage.setItem('assignmentsScrollPosition', 0);
                
                // Navigate to the assignments page without reloading
                window.location.replace(this.href); // Use replace for smoother navigation
            });
        }
    }
    
    // Handle popstate events (browser back/forward buttons)
    window.addEventListener('popstate', function(e) {
        if (window.location.pathname.endsWith('assignments.html') && sessionStorage.getItem('assignmentsScrollPosition')) {
            setTimeout(function() {
                const scrollPosition = parseInt(sessionStorage.getItem('assignmentsScrollPosition'));
                window.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth' // Smooth scrolling
                });
            }, 100);
        }
    });
} 