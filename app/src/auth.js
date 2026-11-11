// 0. BOOTSTRAP GLOBALS
import $ from 'jquery';
import './scripts/core/config.js';
if (!window.jQuery || !window.jQuery.fn || (!window.jQuery.fn.DataTable && !window.jQuery.fn.summernote)) {
    window.jQuery = window.$ = $;
}
globalThis.jQuery = globalThis.$ = window.jQuery;

// 1. PROJECT STYLES
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'animate.css/animate.css';
import './scss/auth-bundle.scss';

// 2. VENDOR JS
import * as bootstrap from 'bootstrap';
import * as Popper from '@popperjs/core';

// 3. EXPOSE GLOBALS
window.Popper = Popper;
window.bootstrap = bootstrap;

// 4. CORE & UTILITIES
import { initPreloader } from './scripts/core/preloader.js';
import { initMobileController } from './scripts/core/mobile-controller.js';

const initAuth = () => {
    try {
        initPreloader();
        initMobileController();
    } catch (error) {
        console.error("❌ Auth Initialization Failed:", error);
        document.body.classList.add('is-loaded');
        document.querySelector('.preloader')?.classList.add('preloader--hidden');
    }
};

if (document.readyState === 'loading') {
    window.addEventListener("DOMContentLoaded", initAuth, { once: true });
} else {
    initAuth();
}
