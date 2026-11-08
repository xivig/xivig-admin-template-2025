# Root Directory Organization Guide

The project root has been organized to ensure a clean, professional, and scalable workspace.

## 📂 Folder Overview

| Directory | Purpose |
| :--- | :--- |
| `app/` | **Main Workspace**: Contains the core source code and page templates. |
| `app/pages/` | **Primary Source**: Contains all HTML views including `dashboard-v2.html` and `admin-settings.html`. |
| `app/src/` | **Source Code**: Modular SCSS architecture, categorized JS scripts, and local plugins. |
| `public/` | **Static Assets**: Assets served as-is (data, fonts) without processing. |
| `tasks/` | **Automation**: Gulp task modules and migration/utility scripts. |
| `developer-docs/` | **Documentation**: Comprehensive guides for SCSS, JS, and HTML architectures. |
| `dist/` | **Build Output**: Compiled and optimized files for production. |
| `docs/` | **Deployment**: Static site export for GitHub Pages. |
| `node_modules/` | **Dependencies**: Third-party packages. |

## 📄 Core Configuration Files

- `index.html`: The main entrance to the dashboard (located in the root).
- `vite.config.js`: Primary build and development server configuration.
- `gulpfile.js`: Task orchestration for image optimization and asset exports.
- `package.json`: Project metadata and dependency management.
- `LICENSE`: Project licensing terms.
- `README.md`: Professional project overview and getting started guide.

## 🚀 Navigation & Asset Paths

-   **HTML Files**: Primary entry point is `index.html` in the root; all others are in `app/pages/`.
-   **Links**: Always use root-relative paths (e.g., `<a href="/app/pages/auth/login.html">`).
-   **Images/Scripts**: Referenced via `/app/src/...` or `/public/...`.

---
*Maintained by the Elite Architect Team*
