import { ThemeManager } from '../core/theme-manager.js';

/**
 * Landing page specific logic
 */
export function initLandingPage() {
    const themeToggle = document.getElementById('themeToggleLanding');

    if (themeToggle) {
        // Load initial theme from ThemeManager
        ThemeManager.init();

        themeToggle.addEventListener('click', () => {
            const currentTheme = ThemeManager.getResolvedGlobalTheme();
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            ThemeManager.setGlobalTheme(newTheme);
        });
    }

    // Sticky Navbar logic for glass-nav
    const nav = document.querySelector('.glass-nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                nav.classList.add('py-2', 'shadow-lg');
                nav.style.background = 'var(--glass-nav-bg)';
            } else {
                nav.classList.remove('py-2', 'shadow-lg');
            }
        }, { passive: true });
    }

    // 3. Counter Animation Logic
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseFloat(counter.getAttribute('data-target'));
                    const duration = 2000; // 2 seconds
                    const stepTime = 20;
                    const steps = duration / stepTime;
                    const increment = target / steps;
                    let current = 0;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            counter.innerText = target % 1 === 0 ? target : target.toFixed(1);
                            clearInterval(timer);
                        } else {
                            counter.innerText = target % 1 === 0 ? Math.floor(current) : current.toFixed(1);
                        }
                    }, stepTime);

                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }
}
