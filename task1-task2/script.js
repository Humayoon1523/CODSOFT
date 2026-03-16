// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Custom Cursor ---
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');
    
    cursorDot.classList.add('cursor-dot');
    cursorOutline.classList.add('cursor-outline');
    
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);
    
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        // Slight delay for the outline
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // --- Theme Toggle Integration ---
    const themeBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        let theme = 'dark';
        if (document.body.classList.contains('light-theme')) {
            theme = 'light';
        }
        localStorage.setItem('theme', theme);
    });
    
    // Hover effect on interactable elements
    const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-card');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('cursor-hover');
        });
    });
    
    // --- 2. Dynamic Typing Effect ---
    const textElement = document.querySelector('.hero-content h2');
    if (textElement) {
        const texts = [
            "Computer Software Engineering Student",
            "Full Stack Web Developer",
            "Creative Problem Solver",
            "Cybersecurity Enthusiast"
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function typeWriter() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                textElement.innerText = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                textElement.innerText = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typingSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === currentText.length) {
                typingSpeed = 2000; // Pause at end of word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingSpeed = 500; // Pause before new word
            }
            
            setTimeout(typeWriter, typingSpeed);
        }
        
        // Start typing effect after the initial load animation
        setTimeout(typeWriter, 1500);
    }
    
    // --- 3. Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.section-title, .about-content > div, .skill-card, .project-card, .contact-item, .contact-form, .timeline-item, .service-card, .cert-card');
    
    // Add base class for reveal
    revealElements.forEach((el, index) => {
        el.classList.add('reveal-on-scroll');
        // Staggered delay for grid items
        if(el.classList.contains('skill-card') || el.classList.contains('project-card')) {
            el.style.transitionDelay = `${(index % 3) * 0.15}s`;
        }
    });
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;
        
        revealElements.forEach(el => {
            const revealTop = el.getBoundingClientRect().top;
            if (revealTop < windowHeight - revealPoint) {
                el.classList.add('reveal-active');
            }
        });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load
    
    // --- 4. 3D Tilt Effect on Cards ---
    const tiltCards = document.querySelectorAll('.skill-card, .project-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            // Keep the 3D tilt reset, but check if we're interrupting the CSS scale
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease';
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)'; // Restore accordion transition
            }, 500);
        });
        
        // Add Accordion CLICK functionality
        if (card.classList.contains('skill-card')) {
            card.addEventListener('click', () => {
                // Remove active from all skill cards
                document.querySelectorAll('.skill-card').forEach(c => c.classList.remove('active'));
                // Add active to the clicked card
                card.classList.add('active');
            });
        }
    });

    // Keyboard navigation for skill slider
    document.addEventListener('keydown', (e) => {
        const skillCards = document.querySelectorAll('.skill-card');
        if (skillCards.length === 0) return;
        
        // Find current active index
        let activeIdx = -1;
        skillCards.forEach((c, idx) => {
            if (c.classList.contains('active')) activeIdx = idx;
        });
        
        if (activeIdx !== -1) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                skillCards[activeIdx].classList.remove('active');
                const nextIdx = (activeIdx + 1) % skillCards.length;
                skillCards[nextIdx].classList.add('active');
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                skillCards[activeIdx].classList.remove('active');
                const prevIdx = (activeIdx - 1 + skillCards.length) % skillCards.length;
                skillCards[prevIdx].classList.add('active');
            }
        }
    });

    // --- Contact Form Validation & Submission ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        // Create feedback element
        const feedbackEl = document.createElement('div');
        feedbackEl.className = 'form-feedback';
        contactForm.appendChild(feedbackEl);

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Basic Validation Check
            const name = contactForm.querySelector('input[type="text"]').value.trim();
            const email = contactForm.querySelector('input[type="email"]').value.trim();
            const message = contactForm.querySelector('textarea').value.trim();
            
            if (!name || !email || !message) {
                feedbackEl.textContent = 'Please fill out all fields.';
                feedbackEl.className = 'form-feedback error';
                return;
            }

            // Loading state
            submitBtn.classList.add('btn-loading');
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner"></i>';
            feedbackEl.className = 'form-feedback'; // reset

            // Simulate API Call delay
            setTimeout(() => {
                submitBtn.classList.remove('btn-loading');
                submitBtn.innerHTML = originalBtnText;
                
                feedbackEl.textContent = 'Message sent successfully! I will get back to you soon.';
                feedbackEl.className = 'form-feedback success';
                
                contactForm.reset(); // clear form
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    feedbackEl.className = 'form-feedback';
                }, 5000);
                
            }, 1500);
        });
    }
});


    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('nav-active');
            // Toggle icon
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('nav-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            });
        });
    }

