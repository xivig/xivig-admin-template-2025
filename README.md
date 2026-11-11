# 🚀 XIVIG Admin Panel — Elite Architect Edition v2.0

[![Vite](https://img.shields.io/badge/Bundler-Vite%208-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Gulp](https://img.shields.io/badge/Task%20Runner-Gulp%205-CF4647?style=flat&logo=gulp&logoColor=white)](https://gulpjs.com/)
[![Bootstrap](https://img.shields.io/badge/UI%20Framework-Bootstrap%205.3.8-7952B3?style=flat&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Handlebars](https://img.shields.io/badge/Templating-Handlebars-f0772b?style=flat&logo=handlebars.js&logoColor=white)](https://handlebarsjs.com/)
[![Sass](https://img.shields.io/badge/Styles-Sass%207--1-CC6699?style=flat&logo=sass&logoColor=white)](https://sass-lang.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue.svg)](https://xivig.github.io/xivig-gulp-vite-bs5-admin-panel/)

> **The definitive enterprise administrative dashboard and systems operations console.**  
> Engineered with a modern **Vite 8 Native Pipeline** (Rolldown bundler, native ESM Hot Module Replacement, Sharp image optimization, atomic HTML flattening, classic CORS-free bundles for `file://` & HTTP, and automated link/asset verification) — cleanly organized with zero Gulp runtime dependency.

---

## 📖 Essential Documentation Links

* 📘 [**Complete Technical Documentation Manual (`docs/DOCUMENTATION.md`)**](docs/DOCUMENTATION.md) — Exhaustive 13-chapter guide detailing the Vite 8 build pipeline, 7-1 Sass tokens, Handlebars layout engine, modular JavaScript architecture, 108+ view catalog, multi-chart integration, and deployment recipes.
* 🛠️ [**Developer Guides Directory (`docs/`)**](docs/) — Focused internal specifications for the build system, SCSS tokens, JavaScript controllers, HTML directory maps, and Laravel Blade conversion.

---

## 🌐 Live Interactive Demonstration

Experience the compiled dashboard live in your browser:
* 🔗 **[Launch XIVIG Admin Panel Live Demo (GitHub Pages) ↗](https://xivig.github.io/xivig-gulp-vite-bs5-admin-panel/)**

---

## ✨ Key Architectural Highlights

* **🏛️ 108+ Enterprise Views**: Curated across 12 domain suites including Executive Telemetry, Cloud Deployments, E-Commerce Platform, Project Management, User Administration, and Productivity Apps.
* **⚡ Pure Vite 8 Build Engine**:
  * **Vite 8**: Sub-second dev server startup (`localhost:3000`) with seamless `/app/pages/`, `/pages/`, and flat `/<page>.html` route resolution.
  * **Zero-Gulp Production Pipeline**: Direct Sharp WebP/JPG/PNG optimization, vector SVG/ICO preservation, classic CORS-free IIFE bundles (`*.bundle.js`) + `file://` data fallbacks, flat `dist/*.html` output, and strict `verify-dist.js` checks.
* **🎨 Elite Glassmorphism Aesthetics**: Modern mesh gradients, floating glass navigation, dynamic breadcrumbs, depth elevations, and micro-interactions powered by Animate.css and AOS.
* **🌓 Adaptive Theme Architecture**: Native Dark / Light mode switching powered by Bootstrap 5.3 CSS variables and persistent localStorage state with **zero Flash of Unstyled Content (FOUC)**.
* **📱 Mobile-First Architecture**: Dedicated native-app-style bottom navigation bar, offcanvas sliding drawers, responsive data grids, and touch-optimized form pickers.
* **🧩 Handlebars Component System**: Modular component separation utilizing Handlebars layouts (`admin-layout`, `auth-layout`, `home-layout`, `landing-layout`, `blank-layout`) and reusable partials.
* **📊 Comprehensive Multi-Chart Ecosystem**: Native integrations for **ApexCharts**, **Chart.js**, **ECharts**, and **Highcharts** with automated tree-shaking, theme synchronization, and vendor chunk isolation.
* **♿ WCAG 2.2 Accessibility**: High-contrast ratios, skip-to-content links, screen-reader aria attributes, and keyboard-focusable interactions.
* **🔄 Laravel Blade Migration Suite**: Built-in automated Python and Node migration tools (`tasks/utils/convert-to-laravel.py`, `organize-laravel-assets.py`) to port the entire template into Laravel Blade in seconds.

---

## 🛠 Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Core Bundler** | [Vite](https://vitejs.dev/) | `^8.0.x` | Dev server, HMR, Rolldown/Rollup asset bundling |
| **Build Pipeline** | Node ESM Plugins (`tasks/build/`) | Native | Classic IIFE bundles, HTML flattening, CORS-free `file://` links, verification |
| **CSS Framework** | [Bootstrap](https://getbootstrap.com/) | `^5.3.8` | Grid, utility classes, offcanvas, modals, and base styles |
| **CSS Preprocessor**| [Dart Sass](https://sass-lang.com/) | `^1.99.x` | Modular 7-1 architecture with silenced legacy deprecations |
| **Templating Engine**| [Handlebars](https://handlebarsjs.com/) | `^2.0.x` | Partials, layouts, blocks via `vite-plugin-handlebars` |
| **Image Optimizer** | [Sharp](https://sharp.pixelplumbing.com/) | `^0.33.5` | Direct WebP, JPEG, and PNG optimization + static SVG/ICO copy |
| **Icons** | [Bootstrap Icons](https://icons.getbootstrap.com/) & [FontAwesome](https://fontawesome.com/) | `1.13.x` / `7.2.x` | Scalable vector glyphs and symbol sets |
| **Data Tables** | [DataTables.net](https://datatables.net/) | `^2.2.x` | Searchable, paginated, responsive enterprise data grids |
| **Data Viz** | ApexCharts, Chart.js, ECharts, Highcharts | Latest | High-velocity analytics and real-time telemetry graphs |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: `v20.x` or `v22.x`+ (`engines.node >= 20.0.0`)
- **npm**: `v10.x`+ (or `pnpm` / `yarn`)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/xivig/xivig-gulp-vite-bs5-admin-panel.git
cd xivig-gulp-vite-bs5-admin-panel

# Install dependencies
npm install
```

### 2. Local Development (Vite Dev Server)
Launches Vite with instant HMR and opens the dashboard at `http://localhost:3000/`:
```bash
npm run dev
```

### 3. Production Build (Flattened `dist/` + Verification)
Executes the modern Vite 8 + Node ESM pipeline (bundle SCSS/ESM &rarr; optimize JPG/PNG to WebP via Sharp &rarr; preserve SVG/GIF/ICO &rarr; atomically flatten all 109 HTML pages into `dist/*.html` &rarr; normalize relative paths &rarr; verify links/assets via `verify-dist.js`):
```bash
npm run build
```

### 4. Preview & Verify Compiled Production Build
Serves the compiled flattened `dist/` directory locally via Vite Preview:
```bash
npm run preview
```

Validate all 109 flattened HTML files, relative links, and compiled CSS/image assets on disk:
```bash
npm run verify
```

---

## 📂 Project Directory Structure

```text
xivig-gulp-vite-bs5-admin-panel/
├── app/
│   ├── pages/                     # 108+ Structured Handlebars/HTML page views
│   │   ├── analytics/             # System metrics, telemetry, traffic overview
│   │   ├── apps/                  # Chat, Calendar, Mailbox, Kanban, Task Manager, File Manager
│   │   ├── auth/                  # Login, Register, 2FA, KYC Onboarding, Lockscreen
│   │   ├── charts/                # ApexCharts, ECharts, Chart.js, Highcharts
│   │   ├── deployments/           # CI/CD pipelines, build histories, releases
│   │   ├── ecommerce/             # Products, Orders, Cart, Checkout, Add/Edit
│   │   ├── error/                 # 400, 403, 404, 500, 503 error states
│   │   ├── forms/                 # Form pickers, advanced inputs, wizard, cropper, dropzone
│   │   ├── projects/              # Project list, details, editor, Kanban boards
│   │   ├── tables/                # Basic tables, responsive DataTables
│   │   ├── ui-elements/           # Buttons, cards, modals, tabs, offcanvas, carousels
│   │   └── users/                 # User directory, profile, access controls
│   └── src/                       # Primary Source Assets
│       ├── images/                # Raw source images (processed to WebP via Sharp)
│       ├── partials/              # 21 Handlebars layouts, headers, sidebars, footers
│       ├── plugins/               # Vendored and patched JavaScript modules
│       ├── scripts/               # Modular ES6 controllers, app logic, chart runners
│       └── scss/                  # 7-1 Sass architecture (base, components, layout, pages)
├── .github/workflows/             # GitHub Actions CI/CD (builds & deploys flat dist/ to GitHub Pages)
├── docs/                          # Technical manual (`DOCUMENTATION.md`) and developer Markdown guides
├── dist/                          # Flattened production output (gitignored; generated via `npm run build` & CI)
├── public/                        # Static assets, icons JSON, and sidebar-config.json
├── tasks/                         # Modular Vite 8 build plugins & verification utilities
│   ├── build/                     # Vite 8 plugins & Sharp ESM image optimizer
│   └── utils/                     # Idempotent link normalizer, dist verifier, Blade migration tools
├── vite.config.js                 # Modern Vite 8 + Rolldown configuration with manual chunks
├── package.json                   # Project manifest, dependencies, and scripts
└── README.md                      # Primary project overview and quick reference
```

---

## 📑 Domain Suite Catalog (108+ Views)

| Domain Suite | Directory | Primary Views & Capabilities |
| :--- | :--- | :--- |
| **Core Dashboards** | `/`, `/pages/` | `index.html` (Architect Dashboard), `dashboard-v2.html` (Executive Telemetry), `elite-media-gallery.html` |
| **Analytics & Metrics** | `app/pages/analytics/` | `overview.html` (Traffic & conversion analytics), `system-metrics.html` (CPU, memory, server load telemetry) |
| **Productivity Apps** | `app/pages/apps/` | `chat.html` (Real-time chat UI), `calendar.html` (FullCalendar), `inbox.html`, `compose.html`, `kanban.html`, `task-manager.html`, `file-manager.html`, `video-player.html` |
| **DevOps & Releases** | `app/pages/deployments/` | `deployment-list.html`, `deployment-details.html`, `deployment-add.html`, `build-history.html`, `releases.html` |
| **E-Commerce Suite** | `app/pages/ecommerce/` | `ecommerce-products.html`, `ecommerce-product-detail.html`, `ecommerce-cart.html`, `checkout.html`, `ecommerce-orders.html`, `order-details.html`, `payment-success.html` |
| **Authentication** | `app/pages/auth/` | `login.html`, `register.html`, `forgot-password.html`, `reset-password.html`, `two-factor-authentication.html`, `lockscreen.html`, `account-onboarding.html`, `multi-step-account-onboarding.html` |
| **Project Management** | `app/pages/projects/` | `project-list.html`, `project-details.html`, `project-add.html`, `project-edit.html` |
| **Forms & Pickers** | `app/pages/forms/` | `form-basic.html`, `form-grid.html`, `form-extras.html`, `form-pickers.html` (Air-Datepicker/Pickr), `form-wizard.html`, `image-cropper.html`, `summernote-editor.html`, `image-dropzone.html` |
| **Data Grids & Tables**| `app/pages/tables/` | `basic-table.html` (Striped/Hover tables), `datatable.html` (Search, Column visibility, Export to Excel/PDF) |
| **UI Component Library**| `app/pages/ui-elements/` | Buttons, Cards, Modals, Offcanvas, Carousels, Progress bars, SweetAlert2, Tabs, Typography, Timelines, Range Sliders |
| **User Administration**| `app/pages/users/` | `user-list.html`, `user-details.html`, `user-add.html`, `user-edit.html`, `profile.html`, `account-settings.html`, `store-settings.html`, `admin-settings.html` |
| **System & Errors** | `app/pages/error/` | `400.html`, `403.html`, `404.html`, `500.html`, `503.html`, `maintenance.html`, `faq.html`, `sitemap.html`, `pricing-table.html`, `invoice.html` |

---

## 🎨 Theme & Token Customization

The dashboard features real-time theme switching with no page reload. All colors, borders, and elevations are bound to CSS Custom Properties (Tokens):

```scss
/* Theme Variables Defined in app/src/scss/base/_tokens.scss */
:root {
  --elite-primary: #6366f1;        /* Indigo Elite Accent */
  --elite-primary-rgb: 99, 102, 241;
  --bg-body: #f8fafc;
  --card-bg: #ffffff;
  --card-border: rgba(226, 232, 240, 0.8);
}

[data-bs-theme="dark"] {
  --elite-primary: #818cf8;
  --bg-body: #0b0f12;
  --card-bg: #15191c;
  --card-border: rgba(51, 65, 85, 0.6);
}
```

### Instant Theme Programmatic API
```javascript
import { setTheme } from './app/src/scripts/core/settings.js';

// Switch theme programmatically (dispatches 'xivig-theme-changed' event to all chart engines)
setTheme('dark');
```

---

## 🔄 Porting to Laravel Blade

The repository includes a complete migration toolkit in `tasks/utils/`:

```bash
# 1. Convert Handlebars templates to Blade directives
python tasks/utils/convert-to-laravel.py

# 2. Distribute compiled assets into Laravel's public/ folder
python tasks/utils/organize-laravel-assets.py
```

For full step-by-step instructions, see the [Laravel Implementation Guide in docs](docs/LARAVEL_IMPLEMENTATION.md) and [Chapter 11 of docs/DOCUMENTATION.md](docs/DOCUMENTATION.md#11-laravel-blade-migration-framework).

---

## 🤝 Contributing & License

Contributions, feedback, and feature requests are welcome! Feel free to open an issue or submit a pull request on the [GitHub Repository](https://github.com/xivig/xivig-gulp-vite-bs5-admin-panel).

Distributed under the permissive **[MIT License](LICENSE)**. Free for personal, commercial, and open-source use.
