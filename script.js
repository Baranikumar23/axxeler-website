document.addEventListener('DOMContentLoaded', () => {
    
    // --- Theme Handling ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    if (themeToggleBtn) {
        // Initial icon state based on data-theme attribute set in head
        if (document.documentElement.getAttribute('data-theme') === 'light') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }

        themeToggleBtn.addEventListener('click', () => {
            if (document.documentElement.getAttribute('data-theme') === 'light') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            }
        });
    }

    // --- Mobile Navigation Toggle ---
    const mobileBtn = document.getElementById('mobile-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

    function toggleMenu() {
        mobileBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    }

    mobileBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // --- Header Background on Scroll ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- Intersection Observer for Scroll Animations ---
    const faders = document.querySelectorAll('.fade-in, .service-card, .feature-list li, .contact-info, .contact-form-wrapper, .section-title, .section-desc');
    
    faders.forEach(fader => {
        fader.classList.add('fade-in');
    });

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // --- Form Submission Handling ---
    const leadForm = document.getElementById('lead-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page reload
            
            // Basic validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            
            if(name && email) {
                // UI state change to simulate processing
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = 'Processing Request...';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';

                // Send data to Formspree
                fetch(leadForm.action, {
                    method: leadForm.method,
                    body: new FormData(leadForm),
                    headers: {
                        'Accept': 'application/json'
                    }
                }).then(response => {
                    if (response.ok) {
                        formStatus.textContent = "Thank you! Your AI audit request has been received. We'll be in touch shortly.";
                        formStatus.className = "form-status success";
                        leadForm.reset();
                    } else {
                        response.json().then(data => {
                            if (Object.hasOwn(data, 'errors')) {
                                formStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
                            } else {
                                formStatus.textContent = "Oops! There was a problem submitting your form";
                            }
                            formStatus.style.color = "#ef4444";
                        });
                    }
                }).catch(error => {
                    formStatus.textContent = "Oops! There was a problem submitting your form";
                    formStatus.style.color = "#ef4444";
                }).finally(() => {
                    // Reset button
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';

                    // Clear message after 5 seconds
                    setTimeout(() => {
                        formStatus.textContent = '';
                        formStatus.className = 'form-status';
                        formStatus.style.color = ""; // reset inline style
                    }, 5000);
                });
            }
        });
    }

    // Set current year in footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
