/**
 * Xivig Theme Manager
 * Handles Global Dark/Light mode, Sidebar styles, and Persistence.
 */

export const ThemeManager = {
    GLOBAL_KEY: 'xivig-global-theme',
    SIDEBAR_KEY: 'xivig-sidebar-style',
    
    isInitialized: false,

    init() {
        if (this.isInitialized) return;
        
        this.html = document.documentElement;
        this.body = document.body;
        
        // Load Global Theme
        const globalTheme = localStorage.getItem(this.GLOBAL_KEY) || 'auto';
        this.applyGlobalTheme(globalTheme);
        
        // Load Sidebar Style
        const sidebarStyle = localStorage.getItem(this.SIDEBAR_KEY) || 'dark';
        this.applySidebarStyle(sidebarStyle);
        
        this.listenToSystemChanges();
        this.isInitialized = true;
    },
    
    setGlobalTheme(theme) {
        if (theme === 'auto') {
            localStorage.removeItem(this.GLOBAL_KEY);
        } else {
            localStorage.setItem(this.GLOBAL_KEY, theme);
        }
        this.applyGlobalTheme(theme);
        this.emitChange('global', theme);
    },
    
    setSidebarStyle(style) {
        localStorage.setItem(this.SIDEBAR_KEY, style);
        this.applySidebarStyle(style);
        this.emitChange('sidebar', style);
    },
    
    getSavedGlobalTheme() {
        return localStorage.getItem(this.GLOBAL_KEY) || 'auto';
    },

    getResolvedGlobalTheme() {
        const saved = localStorage.getItem(this.GLOBAL_KEY);
        if (saved && saved !== 'auto') return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },
    
    applyGlobalTheme(theme) {
        const resolved = theme === 'auto' ? this.getResolvedGlobalTheme() : theme;
        this.html.setAttribute('data-bs-theme', resolved);
    },
    
    applySidebarStyle(style) {
        this.body.setAttribute('data-sidebar', style);
    },
    
    listenToSystemChanges() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Standard listener
        mediaQuery.addEventListener('change', () => {
            const saved = localStorage.getItem(this.GLOBAL_KEY);
            if (!saved || saved === 'auto') {
                this.applyGlobalTheme('auto');
                this.emitChange('global', 'auto');
            }
        });
    },
    
    emitChange(type, value) {
        const event = new CustomEvent('xivig:theme-change', { 
            detail: { 
                type,
                value, 
                resolved: type === 'global' ? this.getResolvedGlobalTheme() : value
            } 
        });
        window.dispatchEvent(event);
    }
};
