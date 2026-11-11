# Utility Scripts Documentation

This guide provides a detailed description of the utility scripts located in `tasks/utils/`. These scripts handle the automation of the build process, the migration from HTML/Handlebars to Laravel Blade, and asset organization.

---

## 1. Migration & Conversion Scripts

### `convert-to-laravel.py`
**Language:** Python
**Purpose:** The primary tool for mass-converting the entire Handlebars/HTML project into a Laravel Blade structure.
- **What it does:**
  - Converts Handlebars tags (`{{#if}}`, `{{#each}}`) to Blade directives (`@if`, `@foreach`).
  - Maps partials to a new `templates.<type>.partials` directory structure.
  - Automatically wraps pages in the appropriate layout (`admin`, `home`, or `auth`).
  - Fixes asset paths to use the `{{ asset() }}` helper.
- **Usage:** `python tasks/utils/convert-to-laravel.py`

### `apply-master-layout.js`
**Language:** Node.js
**Purpose:** A refactoring tool used to extract the core content of a page and wrap it in the Handlebars `admin-layout`.
- **What it does:**
  - Identifies page titles and parent categories from existing HTML breadcrumbs.
  - Strips out redundant header/footer/sidebar tags.
  - Rewrites the file to use the `{{#> admin-layout }}` partial block.
- **Usage:** `node tasks/utils/apply-master-layout.js`

### `migrate-to-blade.js`
**Language:** Node.js
**Purpose:** A secondary, older migration script for converting individual HTML files to Blade.
- **Note:** Largely superseded by the more comprehensive `convert-to-laravel.py`.
- **Usage:** `node tasks/utils/migrate-to-blade.js`

### `rename-html-to-blade.js`
**Language:** Node.js
**Purpose:** A simple utility to recursively rename all `.html` files in a directory to `.blade.php`.
- **Usage:** `node tasks/utils/rename-html-to-blade.js`

---

## 2. Path & Asset Management

### `replace-links.js`
**Language:** Node.js (ESM)
**Purpose:** Idempotent static path & root-prefix normalizer for flattened `dist/` output.
- **What it does:**
  - Converts root-relative links (`/app/pages/**`, `/pages/**`, `/app/src/images/**`, `/images/**`, `/data/**`, inline `url(...)`) into clean flattened `./...` relative paths for portable root and subpath (GitHub Pages) hosting.
  - Injects `window.XIVIG_ROOT = "./"` idempotently once into `<head>` (never duplicating pre-existing script tags).
- **Usage:** Executed automatically during `vite build` via [`tasks/build/vite-plugins.js`](../tasks/build/vite-plugins.js), or manually via `npm run fix-links`.

### `verify-dist.js`
**Language:** Node.js (ESM)
**Purpose:** Automated post-build quality and link integrity gate.
- **What it does:**
  - Enforces flattened root output (`109` HTML pages at root, zero `dist/app/` or `dist/pages/` subdirectories).
  - Verifies each HTML file contains a single `window.XIVIG_ROOT`, zero broken local HTML/image/asset links, and zero missing CSS `url()` targets.
- **Usage:** Automatically runs at the end of `npm run build` and `npm run build:vite`, or manually via `npm run verify`.

### `organize-laravel-assets.py`
**Language:** Python
**Purpose:** Orchestrates the movement of assets from the source/build folders into the Laravel `public/` directory.
- **What it does:**
  - Creates the categorized `admin`, `home`, and `auth` subdirectories in `public/assets/`.
  - Distributes images and minified JS/CSS into their respective `js/`, `css/`, and `images/` folders.
- **Usage:** `python tasks/utils/organize-laravel-assets.py`

### `fix_paths.py`
**Language:** Python
**Purpose:** A surgical path-fixing tool for correcting inconsistent image paths in the source HTML files.
- **What it does:**
  - Finds patterns like `/src/images/` and ensures they are correctly prefixed with `/app/`.
- **Usage:** `python tasks/utils/fix_paths.py`

---

## 3. Workflow Summary

1.  **Development:** Use `npm run dev` (Vite 8 with seamless route rewrites).
2.  **Refactoring:** Use `apply-master-layout.js` if you add new static pages.
3.  **Build & Verify:** Run `npm run build` (Vite 8 + Sharp + `replace-links.js` + `verify-dist.js`).
4.  **Laravel Export:** 
    -   Run `convert-to-laravel.py` to generate the Blade views.
    -   Run `organize-laravel-assets.py` to populate the `public/` directory.
