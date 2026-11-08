// 0. BOOTSTRAP GLOBALS
import $ from 'jquery';
if (!window.jQuery || !window.jQuery.fn || (!window.jQuery.fn.DataTable && !window.jQuery.fn.summernote)) {
    window.jQuery = window.$ = $;
}
globalThis.jQuery = globalThis.$ = window.jQuery;

// 1. PROJECT STYLES
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

window.addEventListener("DOMContentLoaded", () => {
    initPreloader();
    initMobileController();
});
