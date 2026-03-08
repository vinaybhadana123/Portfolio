// Smooth scrolling for navigation links
const pageAnchors = document.querySelectorAll('a[href^="#"]');
pageAnchors.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });

        // if mobile menu is open, close it after navigating
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && navLinks.classList.contains('open')) {
            navLinks.classList.remove('open');
            const toggle = document.querySelector('.nav-toggle');
            if (toggle) {
                toggle.setAttribute('aria-expanded', 'false');
                toggle.querySelector('i').classList.replace('fa-times','fa-bars');
            }
        }
    });
});

// mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const mobileLinks = document.querySelector('.nav-links');
if (navToggle && mobileLinks) {
    navToggle.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!expanded));
        mobileLinks.classList.toggle('open');
        const icon = navToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });
}

// Navbar background & visibility change on scroll (direction-aware)
(function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScrollY = window.scrollY;

    function handleNavbar() {
        const currentScroll = window.scrollY;

        if (currentScroll <= 10) {
            // near top of the page: remove special states to let hero show through
            navbar.classList.remove('nav-scrolled', 'nav-visible', 'nav-hidden');
        } else {
            // mark as scrolled so we can style it (glass bg etc.)
            navbar.classList.add('nav-scrolled');

            if (currentScroll < lastScrollY) {
                // user is scrolling UP -> make navbar more visible/beautiful
                navbar.classList.add('nav-visible');
                navbar.classList.remove('nav-hidden');
            } else {
                // user is scrolling DOWN -> subtle minimized state
                navbar.classList.add('nav-hidden');
                navbar.classList.remove('nav-visible');
            }
        }

        lastScrollY = currentScroll;
    }

    window.addEventListener('scroll', handleNavbar);
    window.addEventListener('load', handleNavbar);
})();

// Animate elements on scroll
const animateOnScroll = function() {
    const elements = document.querySelectorAll('.skill-card, .project-card');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Set initial styles for animation
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.skill-card, .project-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
});

// Add scroll event listener
window.addEventListener('scroll', animateOnScroll);

// Trigger animation on page load
window.addEventListener('load', animateOnScroll);

// Theme Switcher
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

// Check for saved theme preference or use system preference
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
}

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    if (newTheme === 'dark') {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
});

/* Rotating subtitle START - JavaScript to type, pause, delete and cycle through multiple roles */
(function() {
    const roles = [
        'Frontend Developer',
        'Web Developer',
        'Teamwork',
        'Communication',
        'continious learner'
    ];

    const el = document.getElementById('subtitle');
    const cursor = document.querySelector('.subtitle .cursor');
    if (!el) return; // safely exit if element not present

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const TYPE_SPEED = 100; // ms per character when typing
    const DELETE_SPEED = 50; // ms per character when deleting
    const HOLD_DELAY = 1500;  // ms to hold fully typed word before deleting

    function type() {
        const current = roles[roleIndex];

        if (isDeleting) {
            charIndex = Math.max(0, charIndex - 1);
            el.textContent = current.substring(0, charIndex);
        } else {
            charIndex = Math.min(current.length, charIndex + 1);
            el.textContent = current.substring(0, charIndex);
        }

        let timeout = isDeleting ? DELETE_SPEED : TYPE_SPEED;

        if (!isDeleting && charIndex === current.length) {
            // finished typing - hold before deleting
            timeout = HOLD_DELAY;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // finished deleting - move to next role
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            timeout = 300; // small pause before typing next word
        }

        setTimeout(type, timeout);
    }

    // start typing when DOM is ready (safe if script moved or deferred)
    document.addEventListener('DOMContentLoaded', () => {
        // ensure the initial content matches the first role
        el.textContent = roles[0].substring(0, 0);
        type();
    });
})();
/* Rotating subtitle END */

/* Download CV handler START - attempts a safe HEAD fetch, falls back to direct navigation */
(function() {
    const downloadLink = document.querySelector('a.btn.download');
    if (!downloadLink) return;

    downloadLink.addEventListener('click', function(e) {
        const url = this.getAttribute('href');
        // Try using HEAD to check availability without blocking; some setups (file://) will throw, so we fallback gracefully.
        e.preventDefault();
        try {
            fetch(url, { method: 'HEAD' }).then(res => {
                if (res.ok) {
                    // file exists - proceed with download
                    window.location.href = url;
                } else {
                    alert('CV not found at ' + url + '. Please add your CV file to that location or update the download link.');
                }
            }).catch(() => {
                // network/file system restrictions -> attempt to navigate to the link anyway
                window.location.href = url;
            });
        } catch (err) {
            window.location.href = url; // last resort fallback
        }
    });
})();
/* Download CV handler END */

// Chat widget logic START
(function() {
    const openBtn = document.getElementById('open-chat');
    const closeBtn = document.getElementById('close-chat');
    const container = document.getElementById('chat-container');
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const messages = document.getElementById('chat-messages');
    const modeToggle = document.getElementById('mode-toggle-chat');
    const title = document.getElementById('chat-title');

    if (!openBtn || !container || !form || !input || !messages || !modeToggle) {
        return; // chat elements missing
    }

    let currentMode = 'chat'; // or 'bot'

    function scrollBottom() {
        messages.scrollTop = messages.scrollHeight;
    }

    function addMessage(sender, text) {
        const el = document.createElement('div');
        el.classList.add('message', sender);
        el.textContent = text;
        messages.appendChild(el);
        scrollBottom();
    }

    const botResponses = {
        chat: msg => `You said: "${msg}"`,
        bot: msg => `🤖 Bot echo: ${msg}`
    };

    openBtn.addEventListener('click', () => {
        container.classList.remove('hidden');
        input.focus();
    });

    closeBtn.addEventListener('click', () => {
        container.classList.add('hidden');
    });

    modeToggle.addEventListener('click', () => {
        currentMode = currentMode === 'chat' ? 'bot' : 'chat';
        title.textContent = currentMode === 'chat' ? 'Chat Mode' : 'Bot Mode';
        modeToggle.textContent = currentMode === 'chat' ? 'Switch to Bot Mode' : 'Switch to Chat Mode';
        addMessage('bot', `Mode changed to ${currentMode}.`);
    });

    form.addEventListener('submit', e => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        addMessage('user', text);
        input.value = '';

        // simulate response
        setTimeout(() => {
            const reply = botResponses[currentMode](text);
            addMessage('bot', reply);
        }, 500);
    });

    // close when clicking outside container
    document.addEventListener('click', e => {
        if (!container.contains(e.target) && e.target !== openBtn) {
            container.classList.add('hidden');
        }
    });
})();
// Chat widget logic END 