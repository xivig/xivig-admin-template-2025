export function initXivig() {
    // console.log("Xivig Architect OS Initialized...");

    // 1. High-Performance Scroll Reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

    // 2. Sticky Navbar Glass Effect
    const nav = document.querySelector('.navbar-xivig');

    // FIX: Check if nav exists BEFORE adding the event listener
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('shadow-sm');
            } else {
                nav.classList.remove('shadow-sm');
            }
        }, {
            passive: true
        }); // Optimized for scrolling performance
    }
}