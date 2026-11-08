import { ThemeManager } from './theme-manager.js';

export function initSettings() {
    const body = document.body;
    const html = document.documentElement;

    // Initialize ThemeManager first
    ThemeManager.init();

    // --- 1. THEME TOGGLING (SIDEBAR & HEADER) ---
    const sidebarRadios = document.querySelectorAll('input[name="sidebar-bg"]');
    const headerRadios = document.querySelectorAll('input[name="header-bg"]');

    sidebarRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            ThemeManager.setSidebarStyle(e.target.id === 'sidebar-dark' ? 'dark' : 'light');
        });
    });

    headerRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            let theme = 'auto';
            if (e.target.id === 'header-dark') theme = 'dark';
            if (e.target.id === 'header-white') theme = 'light';
            ThemeManager.setGlobalTheme(theme);
        });
    });


    // --- 2. DROPDOWN ICON CHANGER ---
    const iconRadios = document.querySelectorAll('input[name="menu-icon"]');

    const updateMenuIcons = (selectedId) => {
        const sidebarItems = document.querySelectorAll('.sidebar__item--has-dropdown, .sidebar__sub-item--has-dropdown');
        sidebarItems.forEach(item => {
            item.classList.remove('icon-style-1', 'icon-style-2', 'icon-style-3');
            if (selectedId === 'menu-icon-1') item.classList.add('icon-style-1');
            if (selectedId === 'menu-icon-2') item.classList.add('icon-style-2');
            if (selectedId === 'menu-icon-3') item.classList.add('icon-style-3');
        });
    };

    iconRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            updateMenuIcons(e.target.id);
            localStorage.setItem('xivig-menu-icon', e.target.id);
        });
    });


    // --- 3. RESET FUNCTIONALITY ---
    const resetBtn = document.getElementById('reset-settings');
    resetBtn?.addEventListener('click', () => {
        localStorage.removeItem('xivig-menu-icon');

        // Revert to defaults via ThemeManager
        ThemeManager.setSidebarStyle('dark');
        ThemeManager.setGlobalTheme('auto');
        updateMenuIcons('menu-icon-1');

        // Update Radio Buttons
        const sidebarDark = document.getElementById('sidebar-dark');
        if (sidebarDark) sidebarDark.checked = true;

        const headerAuto = document.getElementById('header-auto');
        if (headerAuto) headerAuto.checked = true;

        const iconDefault = document.getElementById('menu-icon-1');
        if (iconDefault) iconDefault.checked = true;

        window.location.reload();
    });


    // --- 4. PERSISTENCE (LOAD ON START) ---

    // Load Sidebar Style
    const savedSidebar = localStorage.getItem('xivig-sidebar-style');
    if (savedSidebar) {
        const radio = document.getElementById(`sidebar-${savedSidebar}`);
        if (radio) radio.checked = true;
    }

    // Load Global Theme
    const savedTheme = ThemeManager.getSavedGlobalTheme();
    let radioId = 'header-auto';
    if (savedTheme === 'dark') radioId = 'header-dark';
    if (savedTheme === 'light') radioId = 'header-white';

    const themeRadio = document.getElementById(radioId);
    if (themeRadio) themeRadio.checked = true;

    // Load Icons
    const savedIcon = localStorage.getItem('xivig-menu-icon');
    if (savedIcon) {
        updateMenuIcons(savedIcon);
        const radio = document.getElementById(savedIcon);
        if (radio) radio.checked = true;
    }
    }