/**
 * Elite Mobile Controller
 * Handles mobile-specific interactions like sidebar overlay,
 * bottom navigation, and touch gestures.
 */

export const initMobileController = () => {
    const isMobile = window.innerWidth <= 768;
    
    // 1. Sidebar Mobile Logic
    const setupSidebarMobile = () => {
        const sidebar = document.getElementById('sidebar');
        const toggle = document.getElementById('sidebar-toggle');
        const close = document.getElementById('sidebar-close');
        
        if (!sidebar) return;

        // Create overlay if it doesn't exist
        let overlay = document.querySelector('.sidebar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);
        }

        const openSidebar = () => {
            sidebar.classList.add('open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeSidebar = () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (toggle) toggle.addEventListener('click', openSidebar);
        if (close) close.addEventListener('click', closeSidebar);
        overlay.addEventListener('click', closeSidebar);
    };

    // 2. Bottom Navigation Active State
    const setupBottomNav = () => {
        const bottomLinks = document.querySelectorAll('.mobile-bottom-nav__item');
        const currentPath = window.location.pathname;

        bottomLinks.forEach(link => {
            if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href'))) {
                link.classList.add('active');
            }
        });
    };

    // 3. Dynamic Resize Handler
    window.addEventListener('resize', () => {
        const nowMobile = window.innerWidth <= 768;
        if (nowMobile) {
            setupSidebarMobile();
        }
    });

    if (isMobile) {
        setupSidebarMobile();
        setupBottomNav();
    }
};

export default initMobileController;
