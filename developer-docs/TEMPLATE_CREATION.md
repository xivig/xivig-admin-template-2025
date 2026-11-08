# Template Creation & Development Guide

This guide details the architecture and workflow for developing the **Xivig Admin Template**. It is intended for developers who want to extend the template, create new components, or understand the underlying build system.

---

## 1. Core Philosophy

The Xivig template is built on three pillars:
1.  **Modularity:** Every piece of UI (HTML, CSS, JS) is broken into small, reusable modules.
2.  **Explicit Execution:** JavaScript logic is only executed on pages where the target elements exist.
3.  **Modern Tooling:** A hybrid approach using **Vite** for rapid development (HMR) and **Gulp** for industrial-grade post-processing and optimization.

---

## 2. Directory Structure

| Path | Description |
| :--- | :--- |
| `app/pages/` | **HTML Source**: Where your `.html` files live. |
| `app/src/partials/` | **Handlebars Components**: Reusable snippets (header, footer, head). |
| `app/src/scss/` | **Styles**: Modular SCSS (7-1 pattern). |
| `app/src/scripts/` | **Logic**: Modular ES6 JavaScript. |
| `app/src/images/` | **Media**: Source images before optimization. |
| `public/` | **Static**: Files copied directly to the build root (fonts, data). |

---

## 3. The Templating System (Handlebars)

We use `vite-plugin-handlebars` to provide layout and partial support.

### 3.1 Layouts
Layouts are defined in `app/src/partials/`. They use the `{{> @partial-block }}` tag to inject page content.

**Example Layout (`home-layout.html`):**
```html
<!DOCTYPE html>
<html>
<head>{{> head title=title }}</head>
<body>
    {{> header }}
    <main>{{> @partial-block }}</main>
    {{> footer }}
    {{> scripts }}
</body>
</html>
```

### 3.2 Creating a Page
In `app/pages/`, create a new HTML file and wrap it in a layout:

```html
{{#> home-layout title="My New Page" }}
    <section>
        <h1>Content goes here</h1>
    </section>
{{/home-layout}}
```

---

## 4. Styling Architecture (SCSS)

Our SCSS follows the **7-1 Pattern**, managed in `app/src/scss/main.scss`.

1.  **Abstracts**: Variables, tokens, and mixins.
2.  **Base**: Reset, typography, and global styles.
3.  **Layout**: High-level structure (Sidebar, Navbar).
4.  **Components**: Modular UI elements (Buttons, Cards, Modals).
5.  **Pages**: One-off styles for specific views.
6.  **Utilities**: Helper classes and theme-specific overrides.
7.  **Vendors**: Third-party plugin overrides.

**To add a new style:**
1.  Create a file in the appropriate folder (e.g., `components/_card-custom.scss`).
2.  Import it in the folder's `_index.scss`.
3.  Ensure the folder is `@use`-ed in `main.scss`.

---

## 5. Interactive Architecture (JavaScript)

We use ES6 Modules and a functional "Initialization Pattern".

### 5.1 The Initialization Pattern
Every module should export an `init` function that includes a safety check:

```javascript
// app/src/scripts/components/my-feature.js
export const initMyFeature = () => {
    const container = document.getElementById('my-feature-container');
    if (!container) return; // Silent exit if not on current page

    // Feature logic here...
};
```

### 5.2 The Entry Point (`main.js`)
All modules are imported and executed in `app/src/main.js`.

```javascript
import { initMyFeature } from './scripts/components/my-feature.js';

document.addEventListener("DOMContentLoaded", () => {
    initMyFeature();
    // ... other initializations
});
```

---

## 6. The Build Pipeline

We use a hybrid pipeline for maximum efficiency.

### 6.1 Vite (Development)
Handles the dev server and Hot Module Replacement (HMR).
- **Run:** `npm run dev`
- **Config:** `vite.config.js`

### 6.2 Gulp (Production)
Orchestrates the final build process:
1.  **Clean**: Deletes old `dist` and `exports`.
2.  **Vite Build**: Triggers the standard Vite compilation.
3.  **Image Optimization**: Uses `sharp` to compress images and create WebP versions.
4.  **HTML Processing**: Moves pages from `app/pages` to the root for clean URLs.
5.  **Link Fixing**: Automatically adjusts asset paths in the compiled HTML.
6.  **Vendor Copy**: Syncs required `node_modules` to the `dist/plugins` folder.

---

## 7. Creating a New Feature: Step-by-Step

1.  **HTML**: Create a partial in `app/src/partials/` if reusable, or add it to a page in `app/pages/`.
2.  **SCSS**: Create a new file in `app/src/scss/components/` and import it.
3.  **JS**: Create a module in `app/src/scripts/components/`, export an `init` function, and call it in `main.js`.
4.  **Images**: Place any new images in `app/src/images/`. They will be optimized during the build.
5.  **Verify**: Run `npm run dev` to see your changes in real-time.
6.  **Build**: Run `npm run build` to generate the production-ready `dist` folder.

---

## 8. Best Practices

-   **Naming**: Use `kebab-case` for all files and folders.
-   **Selectors**: Use IDs for JS targets (`#my-element`) and classes for styling (`.my-element`).
-   **Images**: Always provide high-resolution source images; the build pipeline handles optimization.
-   **Performance**: Avoid importing large libraries globally in `main.js` if they are only needed on one page. Use dynamic imports where possible.
