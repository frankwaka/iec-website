// IEC Website — Main JavaScript

// ===== LOGO ENTRANCE ANIMATION — Centered logo only =====
(function() {
    try {
        var overlay = document.getElementById('logoIntro');
        var diamond = document.getElementById('logoDiamond');
        var navbar  = document.getElementById('navbar');
        var glow1   = document.getElementById('logoGlow1');
        var glow2   = document.getElementById('logoGlow2');
        var glow3   = document.getElementById('logoGlow3');
        var logoText = document.getElementById('logoText');
        var cleaned  = false;

        // Failsafe: always remove overlay after 5s no matter what
        function cleanup() {
            if (cleaned) return;
            cleaned = true;
            try {
                if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
                if (navbar) {
                    navbar.classList.remove('intro-hidden');
                    navbar.classList.remove('intro-reveal');
                }
                document.body.style.overflow = '';
                sessionStorage.setItem('iec_intro_played', '1');
            } catch(e) {}
        }

        // SAFETY NET — if anything fails, page still works after 5s
        setTimeout(cleanup, 5000);

        if (!overlay || !diamond || !navbar) { cleanup(); return; }

        // Only play on first visit per session
        var played = false;
        try { played = sessionStorage.getItem('iec_intro_played'); } catch(e) {}
        if (played) { cleanup(); return; }

        // Prevent scroll during animation
        document.body.style.overflow = 'hidden';

        // Phase 1: Main diamond appears with staggered glow rings (200ms)
        setTimeout(function() {
            try {
                diamond.classList.add('animate');
                if (glow1) setTimeout(function(){ glow1.classList.add('animate'); }, 100);
                if (glow2) setTimeout(function(){ glow2.classList.add('animate'); }, 300);
                if (glow3) setTimeout(function(){ glow3.classList.add('animate'); }, 500);
            } catch(e) {}
        }, 200);

        // Phase 2: Brand text appears (800ms)
        setTimeout(function() {
            try { if (logoText) logoText.classList.add('animate'); } catch(e) {}
        }, 800);

        // Phase 3: Elegant fade out (2000ms)
        setTimeout(function() {
            try {
                diamond.style.transition = 'opacity 0.5s ease-out, transform 0.8s ease-out';
                diamond.style.opacity = '0';
                diamond.style.transform = 'scale(0.9)';
                if (logoText) {
                    logoText.style.transition = 'opacity 0.4s ease-out';
                    logoText.style.opacity = '0';
                }
            } catch(e) {}

            // Phase 4: Fade overlay & reveal navbar (600ms after phase 3)
            setTimeout(function() {
                try {
                    if (overlay) {
                        overlay.classList.add('animating');
                        overlay.classList.add('done');
                    }
                    if (navbar) {
                        navbar.classList.remove('intro-hidden');
                        navbar.classList.add('intro-reveal');
                        var navLinks = navbar.querySelector('.nav-links');
                        if (navLinks) navLinks.classList.add('animate-entrance');
                    }
                    document.body.style.overflow = '';
                    sessionStorage.setItem('iec_intro_played', '1');

                    // Clean up overlay after fade
                    setTimeout(function() {
                        cleanup();
                        try {
                            var navLinks2 = navbar ? navbar.querySelector('.nav-links') : null;
                            if (navLinks2) navLinks2.classList.remove('animate-entrance');
                        } catch(e) {}
                    }, 800);
                } catch(e) { cleanup(); }
            }, 600);
        }, 2000);

    } catch(e) {
        // If anything crashes, forcefully remove overlay
        var ov = document.getElementById('logoIntro');
        if (ov && ov.parentNode) ov.parentNode.removeChild(ov);
        var nb = document.getElementById('navbar');
        if (nb) nb.classList.remove('intro-hidden');
        document.body.style.overflow = '';
    }
})();

// Navbar scroll effect
const navbar = document.getElementById('navbar') || document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 60);
    lastScroll = y;
});

// Full-screen menu overlay
const menuToggle = document.getElementById('menuToggle');
const menuOverlay = document.getElementById('menuOverlay');
const menuClose = document.getElementById('menuClose');

function openMenu() {
    menuOverlay.classList.add('open');
    menuToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeMenu() {
    menuOverlay.classList.remove('open');
    menuToggle.classList.remove('active');
    document.body.style.overflow = '';
}

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        if (menuOverlay.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
}
if (menuClose) {
    menuClose.addEventListener('click', closeMenu);
}
// Close on overlay link click
if (menuOverlay) {
    menuOverlay.querySelectorAll('.menu-overlay-links a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOverlay.classList.contains('open')) {
            closeMenu();
        }
    });
    // Menu overlay language buttons
    menuOverlay.querySelectorAll('.menu-lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (typeof setLanguage === 'function') {
                setLanguage(btn.dataset.lang);
            }
            // Update active state on overlay lang buttons
            menuOverlay.querySelectorAll('.menu-lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// Reveal on scroll — staggered
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Add small delay per card for stagger effect
            const el = entry.target;
            const delay = el.dataset.delay || 0;
            setTimeout(() => el.classList.add('visible'), delay);
            revealObserver.unobserve(el);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

// Auto-tag elements for reveal
document.querySelectorAll(
    '.section, .focus-card, .service-card, .mvv-card, .team-card, ' +
    '.insight-card, .stat-item, .visual-card, .client-logo-item, .process-step, ' +
    '.service-detail-card, .contact-info-block'
).forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger siblings within same parent grid
    const parent = el.parentElement;
    const siblings = Array.from(parent.children);
    const idx = siblings.indexOf(el);
    el.dataset.delay = idx * 80;
    revealObserver.observe(el);
});

// Counter animation
function animateCounter(el, target) {
    const suffix = target.replace(/[0-9]/g, '');
    const num = parseInt(target);
    if (isNaN(num)) return;
    let current = 0;
    const increment = Math.ceil(num / 35);
    const timer = setInterval(() => {
        current += increment;
        if (current >= num) { current = num; clearInterval(timer); }
        el.textContent = current + suffix;
    }, 25);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-number').forEach(n => {
                animateCounter(n, n.textContent.trim());
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);

// Contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const lang = document.documentElement.lang;
        const msgs = {
            'zh-CN': '感谢您的留言！我们会尽快与您联系。',
            'zh-TW': '感謝您的留言！我們會盡快與您聯繫。',
            'en': 'Thank you! We will get back to you soon.'
        };
        alert(msgs[lang] || msgs['zh-CN']);
        contactForm.reset();
    });
}

// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ===== INSIGHTS CAROUSEL =====
(function() {
    const track = document.getElementById('insightsCarousel');
    if (!track) return;

    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');
    const cards = track.querySelectorAll('.carousel-card');

    if (!cards.length) return;

    // Calculate visible cards count
    function getVisibleCount() {
        const trackWidth = track.clientWidth;
        const cardWidth = cards[0].offsetWidth + 24; // gap
        return Math.floor(trackWidth / cardWidth) || 1;
    }

    // Create dots
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const pages = Math.ceil(cards.length / getVisibleCount());
        for (let i = 0; i < pages; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Page ' + (i + 1));
            dot.addEventListener('click', () => scrollToPage(i));
            dotsContainer.appendChild(dot);
        }
    }

    function scrollToPage(page) {
        const cardWidth = cards[0].offsetWidth + 24;
        const visible = getVisibleCount();
        const scrollPos = page * visible * cardWidth;
        track.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }

    function updateState() {
        const scrollLeft = track.scrollLeft;
        const maxScroll = track.scrollWidth - track.clientWidth;

        if (prevBtn) prevBtn.disabled = scrollLeft <= 5;
        if (nextBtn) nextBtn.disabled = scrollLeft >= maxScroll - 5;

        // Update dots
        if (dotsContainer) {
            const cardWidth = cards[0].offsetWidth + 24;
            const visible = getVisibleCount();
            const currentPage = Math.round(scrollLeft / (visible * cardWidth));
            dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentPage);
            });
        }
    }

    // Arrow navigation
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const cardWidth = cards[0].offsetWidth + 24;
            track.scrollBy({ left: -cardWidth * 2, behavior: 'smooth' });
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const cardWidth = cards[0].offsetWidth + 24;
            track.scrollBy({ left: cardWidth * 2, behavior: 'smooth' });
        });
    }

    // Drag to scroll
    let isDragging = false;
    let startX, scrollStart;

    track.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX;
        scrollStart = track.scrollLeft;
        track.classList.add('grabbing');
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.pageX - startX;
        track.scrollLeft = scrollStart - dx;
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            track.classList.remove('grabbing');
        }
    });

    // Prevent link clicks during drag
    track.addEventListener('click', (e) => {
        if (Math.abs(track.scrollLeft - scrollStart) > 10) {
            e.preventDefault();
        }
    }, true);

    // Update on scroll
    track.addEventListener('scroll', updateState);

    // Init
    createDots();
    updateState();
    window.addEventListener('resize', () => { createDots(); updateState(); });
})();
