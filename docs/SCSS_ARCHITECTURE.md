# SCSS Architecture & Indexing Guide

This project follows a modular **7-1 Pattern** architecture, which separates styles into logical directories for maximum maintainability.

## 📂 Directory Structure

All styles are located in `app/src/scss/`.

### 1. `base/`
Global project foundations.
- `_tokens.scss`: CSS Variables (Design Tokens) for colors, shadows, and spacing.
- `_variables.scss`: Sass-specific variables.
- `_mixins.scss`: Reusable logic (Glassmorphism, Shadows, Flexbox centering).
- `_reset.scss`: CSS Normalize and global base rules.
- `_typography.scss`: Global font settings and text utilities.

### 2. `layout/`
The structural "shell" of the application.
- `_header.scss`: Top navigation bar.
- `_sidebar.scss`: Left navigation menu.
- `_footer.scss`: Bottom branding area.
- `_main-container.scss`: The primary content wrapper.
- `_preloader.scss`: Initial loading screen.
- `_settings-panel.scss`: Right-side configuration drawer.

### 3. `components/`
Modular UI elements. Managed by `components/_index.scss`.
- `_card.scss`, `_button.scss`, `_tabs.scss`, etc.
- `_form-wizard.scss`: Stepper components.
- `_cart.scss`: Ecommerce cart items.
- `_search-results.scss`: Global search UI.

### 4. `pages/`
View-specific styles.
- `auth/`: Login, Register, and Account Onboarding pages.
- `error/`: 404, 503, and maintenance pages.
- `_landing.scss`: Homepage and landing logic.
- `_chat.scss`, `_kanban.scss`, `_inbox.scss`: App-specific views.

### 5. `utilities/`
Theme fixes and final overrides.
- `_theme-fixes.scss`: Dark/Light mode consistency patches.
- `_custom.scss`: Final overrides and experimental tweaks. **Edit this for quick, non-modular changes.**

### 6. `vendors/`
Third-party plugin overrides and icon settings.
- `_bs-icon.scss`, `_fa-icon.scss`: Icon library configuration.
- `_monokai.scss`: Syntax highlighting theme.

---

## 🛠 How to Import

### The Index Pattern
Each folder contains an `_index.scss` file. This means you can import an entire category at once:
```scss
// In main.scss (app/src/scss/main.scss)
@use "base";       // Automatically loads tokens, variables, mixins, etc.
@use "components"; // Automatically loads all UI components.
```

### Accessing Variables & Mixins
To use variables or mixins in a specific component, always include the reference at the top of the file:
```scss
@use "../base/variables" as *;
@use "../base/mixins" as *;

.my-new-component {
    color: $primary-color;
    @include elite-shadow();
}
```

## 🚀 Entry Points
1. `main.scss`: The primary manifest used for the entire application (located in `app/src/scss/main.scss`).
2. `vendors/vendors.scss`: A specialized manifest for third-party CSS imports, optimized for Vite bundling.
