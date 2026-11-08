# 🚀 XIVIG Admin Panel - Elite Architect Edition

[![Vite](https://img.shields.io/badge/Bundler-Vite%205%2B-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Gulp](https://img.shields.io/badge/Task%20Runner-Gulp%205-CF4647?style=flat&logo=gulp&logoColor=white)](https://gulpjs.com/)
[![Bootstrap](https://img.shields.io/badge/UI%20Kit-Bootstrap%205.3.8-7952B3?style=flat&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Handlebars](https://img.shields.io/badge/Template-Handlebars-f0772b?style=flat&logo=handlebars.js&logoColor=white)](https://handlebarsjs.com/)
[![Sass](https://img.shields.io/badge/Styles-Sass%207--1-CC6699?style=flat&logo=sass&logoColor=white)](https://sass-lang.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue.svg)](https://xivig.github.io/xivig-gulp-vite-bs5-admin-panel/)

> **The definitive enterprise administrative dashboard and systems operations console.**  
> Built with a high-performance hybrid pipeline combining **Vite** for instantaneous Hot Module Replacement (HMR) during development and **Gulp 5** for industrial-grade image optimization, vendor package management, stylesheet minification, and multi-tier static documentation exports.

---

## 🌐 Live Interactive Demonstration

Experience the fully compiled dashboard live in your browser:
🔗 **[Launch XIVIG Admin Panel (Live Demo) ↗](https://htmlpreview.github.io/?https://github.com/xivig/xivig-gulp-vite-bs5-admin-panel/blob/main/docs/index.html)**  
*(Also hosted at [xivig.github.io/xivig-gulp-vite-bs5-admin-panel](https://xivig.github.io/xivig-gulp-vite-bs5-admin-panel/))*

---

## ✨ Key Architectural Features

- **🏛️ 108+ Enterprise Views**: Curated across 12 domain suites including Analytics, DevOps Deployments, E-Commerce, Project Management, User Administration, and Communications.
- **⚡ Dual-Engine Hybrid Pipeline**:
  - **Vite 5/6+**: Instant sub-second dev server startup, ESM imports, and intelligent vendor chunking.
  - **Gulp 5**: Automated image conversion (JPEG/PNG to Next-Gen WebP via Sharp), CSS minification, vendor orchestration, and link normalization.
- **🎨 Elite Glassmorphism Aesthetics**: Modern mesh gradients, floating glass navigation, dynamic breadcrumbs, and micro-interactions powered by Animate.css and AOS.
- **🌓 Adaptive Theme Architecture**: Native Dark / Light mode switching powered by Bootstrap 5.3 CSS variables and persistent localStorage state with zero Flash of Unstyled Content (FOUC).
- **📱 Mobile-First Architecture**: Dedicated native-app-style bottom navigation bar, offcanvas sliding drawers, responsive data grids, and touch-optimized form pickers.
- **🧩 Handlebars Component System**: Modular component separation utilizing Handlebars layouts (`admin-layout`, `auth-layout`, `home-layout`, `landing-layout`, `blank-layout`) and reusable partials.
- **📊 Comprehensive Chart Ecosystem**: Native integrations for **ApexCharts**, **Chart.js**, **ECharts**, and **Highcharts** with automated tree-shaking and vendor chunk isolation.
- **♿ WCAG 2.2 Accessibility**: High-contrast ratios, skip-to-content links, screen-reader aria attributes, and keyboard-focusable interactions.

---

## 🛠 Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Core Bundler** | [Vite](https://vitejs.dev/) | `^8.0.x` | Dev server, HMR, Rolldown/Rollup asset bundling |
| **Task Runner** | [Gulp](https://gulpjs.com/) | `^5.0.x` | Asset pipelines, Sharp image optimization, dist-to-docs export |
| **CSS Framework** | [Bootstrap](https://getbootstrap.com/) | `^5.3.8` | Grid, utility classes, offcanvas, modals, and base styles |
| **CSS Preprocessor**| [Dart Sass](https://sass-lang.com/) | `^1.99.x` | Modular 7-1 architecture with silenced legacy deprecations |
| **Templating Engine**| [Handlebars](https://handlebarsjs.com/) | `^2.0.x` | Partials, layouts, blocks via `vite-plugin-handlebars` |
| **Image Optimizer** | [Sharp](https://sharp.pixelplumbing.com/) | `^4.0.x` | Automated WebP conversion and quality compression |
| **Icons** | [Bootstrap Icons](https://icons.getbootstrap.com/) & [FontAwesome](https://fontawesome.com/) | `1.13.x` / `7.2.x` | Scalable vector glyphs and symbol sets |
| **Data Tables** | [DataTables.net](https://datatables.net/) | `^2.2.x` | Searchable, paginated, responsive enterprise data grids |
| **Data Viz** | ApexCharts, Chart.js, ECharts, Highcharts | Latest | High-velocity analytics and real-time telemetry graphs |

---

## 📂 Project Directory Structure

```text
xivig-gulp-vite-bs5-admin-panel/
├── app/
│   ├── pages/                     # 108+ Structured Handlebars/HTML page views
│   │   ├── analytics/             # System metrics, telemetry, traffic overview
│   │   ├── apps/                  # Chat, Calendar, Mailbox, Kanban, Task Manager
│   │   ├── auth/                  # Login, Register, 2FA, Onboarding, Lockscreen
│   │   ├── charts/                # ApexCharts, ECharts, Chart.js, Highcharts
│   │   ├── deployments/           # CI/CD pipelines, build histories, releases
│   │   ├── ecommerce/             # Products, Orders, Cart, Checkout, Add/Edit
│   │   ├── error/                 # 400, 403, 404, 500, 503 error pages
│   │   ├── forms/                 # Form pickers, advanced inputs, wizard, cropper
│   │   ├── projects/              # Project list, details, editor, Kanban boards
│   │   ├── tables/                # Basic tables, responsive DataTables
│   │   ├── ui-elements/           # Buttons, cards, modals, tabs, offcanvas, carousels
│   │   └── users/                 # User directory, profile, access controls
│   └── src/                       # Primary Source Assets
│       ├── images/                # Raw source images (processed to WebP)
│       ├── partials/              # 21 Handlebars layouts, headers, sidebars, footers
│       ├── plugins/               # Vendored and patched JavaScript modules
│       ├── scripts/               # Modular ES6 controllers, app logic, chart runners
│       └── scss/                  # 7-1 Sass architecture (base, components, layout)
├── developer-docs/                # In-depth architectural guides and specifications
├── dist/                          # Fully compiled production build directory
├── docs/                          # GitHub Pages static export target (relative paths)
├── public/                        # Static assets, fonts, and .nojekyll manifest
├── tasks/                         # Modular Gulp automation modules
│   ├── gulp/                      # Export, serve, and documentation tasks
│   └── utils/                     # Relative link rewriter for subpath deployment
├── gulpfile.js                    # Gulp 5 task orchestrator
├── vite.config.js                 # Modern Vite configuration with Rolldown manual chunks
├── package.json                   # Project manifest, dependencies, and scripts
└── README.md                      # Comprehensive developer handbook
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: `v18.x` or `v20.x`+ recommended
- **npm**: `v9.x`+ (or `pnpm` / `yarn`)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/xivig/xivig-gulp-vite-bs5-admin-panel.git
cd xivig-gulp-vite-bs5-admin-panel

# Install dependencies
npm install
```

### 2. Local Development (Vite Dev Server)
Launches Vite with instant HMR and opens the dashboard in your default browser:
```bash
npm run dev
# Dashboard running at http://localhost:3000/
```

### 3. Production Build
Executes the full hybrid pipeline (clean -> Vite compile -> Sharp image optimization -> HTML page restructuring -> relative link refinement -> vendor assets -> minification -> docs export):
```bash
npm run build
```

### 4. Preview Compiled Production Build
Spins up a local web server serving the compiled `dist/` directory:
```bash
npm run preview
```

### 5. Launch Documentation Server
```bash
npm run docs
```

---

## 📑 Domain Suite Catalog (108+ Views)

| Domain Suite | Directory | Primary Views & Capabilities |
| :--- | :--- | :--- |
| **Dashboard Core** | `/`, `/pages/` | `index.html` (Architect Dashboard), `dashboard-v2.html` (Executive Telemetry), `elite-media-gallery.html` |
| **Analytics & Metrics** | `app/pages/analytics/` | `overview.html` (Traffic & conversion analytics), `system-metrics.html` (CPU, memory, server load telemetry) |
| **Productivity Apps** | `app/pages/apps/` | `chat.html` (Real-time chat UI), `calendar.html` (FullCalendar), `inbox.html`, `compose.html`, `kanban.html`, `task-manager.html`, `file-manager.html`, `video-player.html` |
| **DevOps & Releases** | `app/pages/deployments/` | `deployment-list.html`, `deployment-details.html`, `deployment-add.html`, `build-history.html`, `releases.html` |
| **E-Commerce Suite** | `app/pages/ecommerce/` | `ecommerce-products.html`, `ecommerce-product-detail.html`, `ecommerce-cart.html`, `checkout.html`, `ecommerce-orders.html`, `order-details.html`, `payment-success.html` |
| **Authentication** | `app/pages/auth/` | `login.html`, `register.html`, `forgot-password.html`, `reset-password.html`, `two-factor-authentication.html`, `lockscreen.html`, `account-onboarding.html` |
| **Project Management** | `app/pages/projects/` | `project-list.html`, `project-details.html`, `project-add.html`, `project-edit.html` |
| **Forms & Pickers** | `app/pages/forms/` | `form-basic.html`, `form-grid.html`, `form-extras.html`, `form-pickers.html` (Flatpickr/Pickr), `form-wizard.html`, `image-cropper.html`, `summernote-editor.html` |
| **Data Grids & Tables**| `app/pages/tables/` | `basic-table.html` (Striped/Hover tables), `datatable.html` (Search, Column visibility, Export to Excel/PDF) |
| **UI Component Library**| `app/pages/ui-elements/` | Buttons, Cards, Modals, Offcanvas, Carousels, Progress bars, SweetAlert2, Tabs, Typography, Timelines |
| **User Administration**| `app/pages/users/` | `user-list.html`, `user-details.html`, `user-add.html`, `user-edit.html`, `profile.html`, `account-settings.html` |
| **System & Errors** | `app/pages/error/` | `400.html`, `403.html`, `404.html`, `500.html`, `503.html`, `maintenance.html`, `faq.html`, `sitemap.html` |

---

## 🎨 Theme & Token Customization

The dashboard features real-time theme switching with no page reload. All colors, borders, and shadows are bound to CSS Custom Properties (Tokens):

```scss
/* Theme Variables Defined in app/src/scss/base/_variables.scss */
:root {
  --bs-primary: #6366f1;        /* Indigo Elite Accent */
  --bs-primary-rgb: 99, 102, 241;
  --bs-secondary: #64748b;
  --xivig-card-bg: #ffffff;
  --xivig-border-color: #e2e8f0;
}

[data-bs-theme="dark"] {
  --bs-primary: #818cf8;
  --xivig-card-bg: #1e293b;
  --xivig-border-color: #334155;
  --bs-body-bg: #0b0f12;
}
```

### Instant Theme API
```javascript
// Programmatically toggle theme anywhere in your code
document.documentElement.setAttribute('data-bs-theme', 'dark');
localStorage.setItem('xivig-global-theme', 'dark');
```

---

## 🤝 Contributing & License

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/xivig/xivig-gulp-vite-bs5-admin-panel/issues).

Distributed under the permissive **[MIT License](LICENSE)**. Free for personal, commercial, and open-source use.
