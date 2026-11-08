// js/scripts/UiController.js
// import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.js';

// export default class UiController {
//     /**
//      * Initializes all Bootstrap 5 interactive components
//      * within a specific container (defaults to document).
//      */
//     static initPopovers(container) {
//         const triggers = container.querySelectorAll('[data-bs-toggle="popover"]');
//         return [...triggers].map(el => new bootstrap.Popover(el, {
//             container: 'body', // Appends popover to body to avoid z-index/overflow issues
//             trigger: 'click' // Ensure click behavior is consistent
//         }));
//     }

//     static initTooltips(container) {
//         const triggers = container.querySelectorAll('[data-bs-toggle="tooltip"]');
//         return [...triggers].map(el => new bootstrap.Tooltip(el));
//     }

//     static initPopovers(container) {
//         const triggers = container.querySelectorAll('[data-bs-toggle="popover"]');
//         return [...triggers].map(el => new bootstrap.Popover(el));
//     }
// }

export default class UiController {
    static init(container = document) {
        this.initTooltips(container);
        this.initPopovers(container);
    }

    static initTooltips(container) {
        const triggers = container.querySelectorAll('[data-bs-toggle="tooltip"]');
        return [...triggers].map(el => new bootstrap.Tooltip(el));
    }

    static initPopovers(container) {
        const triggers = container.querySelectorAll('[data-bs-toggle="popover"]');
        return [...triggers].map(el => new bootstrap.Popover(el, {
            container: 'body',
            trigger: 'click'
        }));
    }
}