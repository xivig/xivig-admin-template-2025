# Root Directory Organization Guide

The project root has been organized to ensure a clean, professional, and scalable workspace.

## 📂 Folder Overview

| Directory | Purpose |
| :--- | :--- |
| `.github/workflows/` | **CI/CD**: Automated GitHub Actions build and GitHub Pages (`gh-pages`) deployment. |
| `app/` | **Main Workspace**: Contains the core source code and page templates. |
| `app/pages/` | **Primary Source**: Contains all 108 subpage HTML views (flattened to root in `dist/`). |
| `app/src/` | **Source Code**: Modular 7-1 SCSS architecture, categorized ES6 JS scripts, and raw images. |
| `public/` | **Static Assets**: Static files copied as-is (`.nojekyll`, `images/`, `data/sidebar-config.json`, icons JSON). |
| `tasks/` | **Automation**: Vite build plugins & Sharp optimizer (`tasks/build/`), verification/link scripts & Blade tools (`tasks/utils/`). |
| `docs/` | **Documentation**: Comprehensive Markdown guides for the build system, SCSS, JS, and HTML architectures. |
| `dist/` | **Build Output**: Flattened production bundle (`109` root HTML files + optimized `assets/`). |
| `node_modules/` | **Dependencies**: Third-party packages. |

## 📄 Core Configuration Files

- `index.html`: The main entrance to the dashboard (located in the root).
- `vite.config.js`: Primary Vite 8 build, plugin, and development server configuration.
- `gulpfile.js`: Minimal optional Gulp 5 compatibility wrapper delegating to Vite 8.
- `package.json`: Project metadata and dependency management.
- `LICENSE`: Project licensing terms.
- `README.md`: Professional project overview and getting started guide.

## 🚀 Navigation & Asset Paths

-   **HTML Files**: Primary entry point is `index.html` in the root; all others are in `app/pages/`.
-   **Links**: Always use root-relative paths (e.g., `<a href="/app/pages/auth/login.html">`).
-   **Images/Scripts**: Referenced via `/app/src/...` or `/public/...`.

---
*Maintained by the Elite Architect Team*
