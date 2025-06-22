// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.querySelector('.nav-links');
const backToTopBtn = document.getElementById('backToTop');
const loadingScreen = document.getElementById('loadingScreen');

// Theme Toggle
function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
    const icon = themeToggle.querySelector('i');
    icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('active');
    document.body.style.overflow = !isExpanded ? 'hidden' : '';
}

// Back to Top Button
function handleScroll() {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Loading Screen
function hideLoadingScreen() {
    loadingScreen.classList.add('hidden');
    document.body.style.overflow = '';
    // Initialize animations after page load
    initAnimations();
}

// Initialize GSAP Animations
function initAnimations() {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Animate elements with data-animate attribute
    document.querySelectorAll('[data-animate]').forEach(el => {
        const animation = el.getAttribute('data-animate');
        const delay = el.getAttribute('data-delay') || 0;
        const duration = el.getAttribute('data-duration') || 0.6;
        
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: parseFloat(duration),
            delay: parseFloat(delay),
            ease: 'power2.out'
        });
    });

    // Stagger animations for feature cards
    gsap.utils.toArray('.feature-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: '.features-grid',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            delay: i * 0.15,
            ease: 'power2.out'
        });
    });
}

// Initialize Lesson Cards
function initLessonCards() {
    const lessonsGrid = document.getElementById('lessonsGrid');
    if (!lessonsGrid) return;

    const lessons = [
        {
            title: 'Introduction to AI',
            description: 'Learn the fundamentals of artificial intelligence and its applications.',
            icon: 'robot',
            duration: '15 min',
            level: 'Beginner'
        },
        {
            title: 'Machine Learning Basics',
            description: 'Understand the core concepts of machine learning and how it works.',
            icon: 'brain',
            duration: '25 min',
            level: 'Beginner'
        },
        {
            title: 'Neural Networks',
            description: 'Dive deep into neural networks and their architecture.',
            icon: 'network-wired',
            duration: '30 min',
            level: 'Intermediate'
        },
        {
            title: 'Natural Language Processing',
            description: 'Explore how AI processes and understands human language.',
            icon: 'language',
            duration: '20 min',
            level: 'Intermediate'
        },
        {
            title: 'Computer Vision',
            description: 'Learn how AI interprets and analyzes visual information.',
            icon: 'eye',
            duration: '25 min',
            level: 'Intermediate'
        },
        {
            title: 'AI Ethics',
            description: 'Understand the ethical considerations in AI development and deployment.',
            icon: 'balance-scale',
            duration: '20 min',
            level: 'All Levels'
        }
    ];

    lessonsGrid.innerHTML = lessons.map((lesson, index) => `
        <div class="lesson-card" data-animate data-delay="${0.1 + (index * 0.1)}">
            <div class="lesson-icon">
                <i class="fas fa-${lesson.icon}"></i>
            </div>
            <div class="lesson-content">
                <h3>${lesson.title}</h3>
                <p>${lesson.description}</p>
                <div class="lesson-meta">
                    <span class="lesson-duration"><i class="far fa-clock"></i> ${lesson.duration}</span>
                    <span class="lesson-level">${lesson.level}</span>
                </div>
            </div>
            <a href="#" class="lesson-link" aria-label="Start ${lesson.title} lesson"></a>
        </div>
    `).join('');
}

// Initialize Intersection Observer for scroll animations
function initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe elements with reveal class
    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme === 'dark');
    
    // Initialize components
    initLessonCards();
    initIntersectionObserver();
    
    // Set loading screen timeout
    window.addEventListener('load', () => {
        setTimeout(hideLoadingScreen, 800);
    });
});

// Theme toggle
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Mobile menu toggle
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
}

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
});

// Back to top button
window.addEventListener('scroll', handleScroll);
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', scrollToTop);
}

// Handle page transitions
window.addEventListener('beforeunload', () => {
    document.body.classList.add('page-exit');
});

// Initialize GSAP when the page loads
window.addEventListener('load', () => {
    // Force reflow to ensure proper animation triggering
    document.body.offsetHeight;
    document.body.classList.add('page-enter-active');
});
