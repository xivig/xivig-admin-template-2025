import $ from 'jquery';

// Define globally only if not already established
if (window.jQuery) {
    // Priority: Use the existing global jQuery (from CDN)
    window.$ = window.jQuery;
    globalThis.jQuery = window.jQuery;
    globalThis.$ = window.jQuery;
} else {
    // Fallback: Use the bundled jQuery
    window.jQuery = window.$ = $;
    globalThis.jQuery = globalThis.$ = $;
}

export default window.jQuery;
