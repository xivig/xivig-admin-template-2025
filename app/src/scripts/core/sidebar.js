/**
 * Xivig Architect Sidebar Module
 * Handles responsive toggling, desktop shrinking, and accordion logic.
 */
export function initSidebar() {
    // 0. DYNAMIC SIDEBAR RENDERING (Stub for the missing function)
    const renderSidebar = () => {
        // Re-run active link highlight after render if needed
        highlightActiveLink();
    };

    // 0.1 BRANDING SYNC
    const applyBranding = () => {
        try {
            const branding = JSON.parse(localStorage.getItem('xivig_branding'));
            const logo = localStorage.getItem('xivig_logo');

            if (branding) {
                const sidebarTitle = document.querySelector('.sidebar__title');
                if (sidebarTitle) sidebarTitle.innerText = branding.title || 'Xivig';
                // Use a default color if branding.accent is missing
                document.documentElement.style.setProperty('--elite-primary', branding.accent || '#4e73df');
            }

            if (logo) {
                const sidebarLogo = document.querySelector('.sidebar__logo');
                if (sidebarLogo) sidebarLogo.src = logo;
            }
        } catch (e) {
            console.error("Branding sync failed:", e);
        }
    };

    applyBranding();

    // 0.2 LIVE UPDATE LISTENERS
    window.addEventListener('sidebarUpdated', renderSidebar);
    window.addEventListener('brandingUpdated', applyBranding);

    const body = document.body;
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const toggleBtn = document.querySelector('.menu-icon');
    const closeBtn = document.getElementById('sidebar-close');

    // 1. TOGGLE LOGIC
    const updateToggleIcon = () => {
        const icon = toggleBtn ?.querySelector('i');
        if (!icon) return;

        const isCollapsed = body.classList.contains('sidebar--collapsed');
        const isOpenMobile = sidebar ?.classList.contains('open');

        // If collapsed (desktop) OR open (mobile), show the "indent" icon
        if (isCollapsed || isOpenMobile) {
            icon.classList.replace('bi-list', 'bi-text-indent-left');
            toggleBtn.setAttribute('aria-expanded', 'false');
        } else {
            icon.classList.replace('bi-text-indent-left', 'bi-list');
            toggleBtn.setAttribute('aria-expanded', 'true');
        }
    };

    const toggleSidebar = () => {
        if (window.innerWidth < 1200) {
            const isOpen = sidebar ?.classList.toggle('open');
            overlay ?.classList.toggle('show');
            body.style.overflow = isOpen ? 'hidden' : '';
            sidebar.setAttribute('aria-hidden', !isOpen);
        } else {
            body.classList.toggle('sidebar--collapsed');
        }
        updateToggleIcon();
    };

    const closeMobileSidebar = () => {
        sidebar ?.classList.remove('open');
        overlay ?.classList.remove('show');
        body.style.overflow = '';
        sidebar.setAttribute('aria-hidden', 'true');
        updateToggleIcon();
    };

    // 2. EVENT LISTENERS
    toggleBtn ?.addEventListener('click', (e) => {
        e.preventDefault();
        toggleSidebar();
    });

    overlay ?.addEventListener('click', closeMobileSidebar);
    closeBtn ?.addEventListener('click', (e) => {
        e.preventDefault();
        closeMobileSidebar();
    });

    // 3. RIGHT OFFCANVAS ICON TOGGLE
    const rightOc = document.getElementById('rightSidebar');
    const rightOcBtn = document.querySelector('[data-bs-target="#rightSidebar"]');

    if (rightOc && rightOcBtn) {
        const icon = rightOcBtn.querySelector('i');
        rightOc.addEventListener('show.bs.offcanvas', () => {
            icon ?.classList.replace('bi-gear', 'bi-x-lg');
            rightOcBtn.setAttribute('aria-expanded', 'true');
        });
        rightOc.addEventListener('hide.bs.offcanvas', () => {
            icon ?.classList.replace('bi-x-lg', 'bi-gear');
            rightOcBtn.setAttribute('aria-expanded', 'false');
        });
    }

    // 4. ACCORDION MENU
    const menu = document.getElementById('accordion-menu');

    menu ?.addEventListener('click', (e) => {
        const link = e.target.closest('.sidebar__link,.sidebar__sub-link');
        if (!link) return;

        const parentItem = link.parentElement;
        const hasDropdown = parentItem.classList.contains('sidebar__item--has-dropdown') ||
            parentItem.classList.contains('sidebar__sub-item--has-dropdown');

        if (hasDropdown) {
            e.preventDefault();
            // Close siblings
            const siblings = parentItem.parentElement.querySelectorAll(':scope >.show');
            siblings.forEach(item => {
                if (item !== parentItem) {
                    item.classList.remove('show');
                    const siblingLink = item.querySelector('.sidebar__link, .sidebar__sub-link');
                    siblingLink ?.setAttribute('aria-expanded', 'false');
                }
            });
            const isExpanding = parentItem.classList.toggle('show');
            link.setAttribute('aria-expanded', isExpanding ? 'true' : 'false');
        }
    });

    // 5. ACTIVE LINK LOGIC
    const highlightActiveLink = () => {
        const normalizePageName = (pathname) => {
            const clean = (pathname || '').split('?')[0].split('#')[0];
            if (!clean || clean.endsWith('/')) return 'index.html';
            return clean.split('/').pop() || 'index.html';
        };

        const currentFile = normalizePageName(window.location.pathname);
        const allLinks = document.querySelectorAll('.sidebar__link, .sidebar__sub-link');

        allLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href || ['javascript:;', '#'].includes(href) || /^https?:\/\//i.test(href)) return;

            let targetPath = href;
            try {
                const resolved = new URL(href, window.location.href);
                if (resolved.origin !== window.location.origin) return;
                targetPath = resolved.pathname;
            } catch {
                targetPath = href;
            }

            const targetFile = normalizePageName(targetPath);
            const isMatch = targetFile === currentFile;

            if (isMatch) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');

                // If nested, open and highlight the parent container
                const parentDropdown = link.closest('.sidebar__item--has-dropdown');
                if (parentDropdown) {
                    parentDropdown.classList.add('show', 'active');
                    const parentLink = parentDropdown.querySelector('.sidebar__link');
                    parentLink ?.setAttribute('aria-expanded', 'true');
                } else {
                    link.parentElement.classList.add('active');
                }
            }
        });
    };

    highlightActiveLink();

    // 6. RESIZE HANDLER
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1200) {
            closeMobileSidebar(); // Cleanup mobile state when going to desktop
        } else {
            // When going to mobile, we usually want the sidebar closed by default
            body.classList.remove('sidebar--collapsed');
            updateToggleIcon();
        }
    });
}