/**
 * EditorModule - A Vanilla JS Wrapper for Summernote
 * This module allows you to interact with Summernote without direct jQuery calls in your feature scripts.
 */
export default class EditorModule {
    /**
     * @param {string|HTMLElement} target - Selector or DOM element
     * @param {Object} options - Summernote configuration options
     */
    constructor(target, options = {}) {
        this.element = typeof target === 'string' ? document.querySelector(target) : target;
        this.options = options;
        this.instance = null;
        this.selector = typeof target === 'string' ? target : 'Element';
    }

    /**
     * Initialize the editor
     */
    init() {
        if (!this.element) {
            console.error(`EditorModule: Target "${this.selector}" not found.`);
            return this;
        }

        if (this.element.getAttribute('data-summernote-initialized')) {
            console.warn(`EditorModule: Target "${this.selector}" is already initialized.`);
            return this;
        }

        if (!window.jQuery || !window.jQuery.fn.summernote) {
            console.error("EditorModule: jQuery or Summernote plugin missing.");
            return this;
        }

        const $ = window.jQuery;
        const $el = $(this.element);

        const defaultConfig = {
            height: 350,
            placeholder: 'Start writing...',
            dialogsInBody: true,
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'italic', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph', 'height']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'video', 'hr']],
                ['view', ['fullscreen', 'codeview', 'help']]
            ],
            callbacks: {
                onInit: () => {
                    // Small delay to ensure DOM is ready
                    setTimeout(() => this._applyEliteStyles(), 10);
                    
                    if (this.options.callbacks && typeof this.options.callbacks.onInit === 'function') {
                        this.options.callbacks.onInit();
                    }
                }
            }
        };

        const config = {
            ...defaultConfig,
            ...this.options
        };

        $el.summernote(config);
        this.instance = $el;
        this.element.setAttribute('data-summernote-initialized', 'true');

        return this;
    }

    /**
     * Internal styling logic using Vanilla JS where possible
     * @private
     */
    _applyEliteStyles() {
        const editorWrapper = this.element.nextElementSibling;

        if (editorWrapper && editorWrapper.classList.contains('note-editor')) {
            // 1. Use a lighter border/shadow so it doesn't "pop" out of the card unexpectedly
            editorWrapper.classList.add('border', 'rounded-4', 'overflow-hidden', 'bg-white');

            // 2. Remove 'mb-4' from here. Handle spacing in the parent layout instead.
            editorWrapper.style.marginBottom = '0';

            const toolbar = editorWrapper.querySelector('.note-toolbar');
            if (toolbar) {
                toolbar.classList.add('border-0', 'bg-light', 'py-2', 'px-3');

                const buttons = toolbar.querySelectorAll('.note-btn');
                buttons.forEach(btn => {
                    btn.classList.add('shadow-none', 'border-0', 'bg-transparent');
                });
            }

            const editable = editorWrapper.querySelector('.note-editable');
            if (editable) {
                editable.classList.add('p-4', 'bg-white');
            }
        }
    }

    /**
     * Get the HTML content from the editor
     * @returns {string}
     */
    getContent() {
        return this.instance ? this.instance.summernote('code') : '';
    }

    /**
     * Set the HTML content of the editor
     * @param {string} html 
     */
    setContent(html) {
        if (this.instance) {
            this.instance.summernote('code', html);
        }
    }

    /**
     * Focus the editor
     */
    focus() {
        if (this.instance) {
            this.instance.summernote('focus');
        }
    }

    /**
     * Disable the editor
     */
    disable() {
        if (this.instance) {
            this.instance.summernote('disable');
        }
    }

    /**
     * Enable the editor
     */
    enable() {
        if (this.instance) {
            this.instance.summernote('enable');
        }
    }

    /**
     * Destroy the editor instance
     */
    destroy() {
        if (this.instance) {
            this.instance.summernote('destroy');
            this.instance = null;
            if (this.element) {
                this.element.removeAttribute('data-summernote-initialized');
            }
        }
    }
}