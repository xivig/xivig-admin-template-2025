/**
 * XIVIG Global Configuration
 * Centralized settings for API endpoints, third-party keys, and environment-specific variables.
 */

export const CONFIG = {
    // API Endpoints
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://127.0.0.1:8000/api' 
        : 'https://api.xivig.com/api', // Replace with your production API URL

    // Third-Party Services
    STRIPE_PUBLIC_KEY: 'pk_test_placeholder', // Replace with your actual Stripe Publishable Key

    // Application Settings
    VERSION: '1.0.1',
    DEBUG: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
};

// Expose to window for legacy scripts or quick debugging
window.XIVIG_CONFIG = CONFIG;
