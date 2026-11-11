# XIVIG Admin Panel — Complete Technical Documentation Manual
## Enterprise Elite Admin Dashboard & Systems Operations Console

[![Version](https://img.shields.io/badge/Version-2.0.0%20Elite-indigo?style=flat-square)](package.json)
[![Vite](https://img.shields.io/badge/Bundler-Vite%208-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Gulp](https://img.shields.io/badge/Task%20Runner-Gulp%205-CF4647?style=flat-square&logo=gulp&logoColor=white)](https://gulpjs.com/)
[![Bootstrap](https://img.shields.io/badge/UI%20Framework-Bootstrap%205.3.8-7952B3?style=flat-square&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Sass](https://img.shields.io/badge/Styles-Sass%207--1-CC6699?style=flat-square&logo=sass&logoColor=white)](https://sass-lang.com/)
[![Handlebars](https://img.shields.io/badge/Templates-Handlebars-f0772b?style=flat-square&logo=handlebars.js&logoColor=white)](https://handlebarsjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](../LICENSE)

---

## Table of Contents

1. [Architectural Overview & Core Philosophy](#1-architectural-overview--core-philosophy)
2. [Dual-Engine Hybrid Pipeline (Vite + Gulp)](#2-dual-engine-hybrid-pipeline-vite--gulp)
3. [Templating System & Layout Engine](#3-templating-system--layout-engine)
4. [7-1 Sass Design System & CSS Token Architecture](#4-7-1-sass-design-system--css-token-architecture)
5. [Dark / Light Mode & Theme Engine](#5-dark--light-mode--theme-engine)
6. [JavaScript Architecture & Modular Controller Pattern](#6-javascript-architecture--modular-controller-pattern)
7. [Comprehensive Domain Suite Catalog (108+ Views)](#7-comprehensive-domain-suite-catalog-108-views)
   - [7.1 Core Dashboards](#71-core-dashboards)
   - [7.2 Analytics & System Telemetry](#72-analytics--system-telemetry)
   - [7.3 Productivity & Workspace Applications](#73-productivity--workspace-applications)
   - [7.4 DevOps & Cloud Deployments](#74-devops--cloud-deployments)
   - [7.5 E-Commerce Platform](#75-e-commerce-platform)
   - [7.6 Identity & Authentication Suite](#76-identity--authentication-suite)
   - [7.7 Project Management Suite](#77-project-management-suite)
   - [7.8 Forms & Advanced Input Controls](#78-forms--advanced-input-controls)
   - [7.9 Tables & Data Grids](#79-tables--data-grids)
   - [7.10 UI Components & Elements Library](#710-ui-components--elements-library)
   - [7.11 User Administration & Access Control](#711-user-administration--access-control)
   - [7.12 System, Utility & Error States](#712-system-utility--error-states)
8. [Multi-Chart Engine Ecosystem](#8-multi-chart-engine-ecosystem)
9. [Component & Plugin Integration Reference](#9-component--plugin-integration-reference)
10. [Build Workflows & Task Automation](#10-build-workflows--task-automation)
11. [Laravel Blade Migration Framework](#11-laravel-blade-migration-framework)
12. [Production Deployment & Web Server Setup](#12-production-deployment--web-server-setup)
13. [Troubleshooting & Developer FAQs](#13-troubleshooting--developer-faqs)

---

## 1. Architectural Overview & Core Philosophy

**XIVIG Admin Panel** is an enterprise-grade administrative dashboard and systems operations template built for mission-critical web applications, SaaS platforms, cloud management portals, and internal enterprise tooling.

### Core Architectural Pillars

```
┌────────────────────────────────────────────────────────────────────────┐
│                        XIVIG ARCHITECTURE PILLARS                      │
├─────────────────────┬───────────────────┬──────────────────────────────┤
│ 1. MODULARITY       │ 2. DUAL PIPELINE  │ 3. ENTERPRISE PERFORMANCE    │
│ Reusable Handlebars │ Vite for sub-sec  │ Zero-FOUC theme switching,   │
│ partials, 7-1 Sass, │ HMR in dev; Gulp5 │ isolated vendor chunking,    │
│ scoped JS modules   │ for Sharp & dist  │ WebP next-gen compression    │
└─────────────────────┴───────────────────┴──────────────────────────────┘
```

1. **Modularity at Every Layer**:
   - **HTML**: Modular Handlebars layouts (`admin-layout`, `home-layout`, `auth-layout`, `blank-layout`) injecting DRY partial components.
   - **CSS**: Strict 7-1 Sass architecture dividing styles into tokens, base rules, layouts, components, pages, vendors, and utilities.
   - **JS**: Standalone ES6 modules initialized via safe DOM-checking closures (`init*()`), eliminating global namespace pollution.

2. **Dual-Engine Hybrid Workflow**:
   - **Vite 8**: Delivers sub-second cold starts, instant native ESM Hot Module Replacement (HMR), and automated manual chunking via Rollup.
   - **Gulp 5**: Orchestrates industrial post-processing, Sharp WebP compression, relative link normalization, vendor asset distribution, and static documentation exports.

3. **Enterprise Aesthetics & Accessibility**:
   - Ultra-refined glassmorphism, depth elevations, floating headers, and native-app mobile bottom navigation bars.
   - WCAG 2.2 compliant contrast ratios, accessible focus rings, keyboard navigability, and ARIA labels.

---

## 2. Dual-Engine Hybrid Pipeline (Vite + Gulp)

Traditional bundlers often struggle with multi-page static admin templates containing dozens of vendor plugins. XIVIG solves this through a coordinated **Dual-Engine Pipeline**:

```
                       DEVELOPMENT WORKFLOW
                       ────────────────────
  Developer Edits  ───►  Vite Dev Server (Port 3000)
  (HBS, SCSS, JS)       ├── Handlebars Plugin: Instant HTML rendering
                        ├── Dart Sass: Sub-second CSS compilation
                        └── Native ESM: Hot Module Replacement (HMR)

                        PRODUCTION WORKFLOW
                        ───────────────────
  npm run build    ───►  Vite 8 Native Pipeline (Rolldown + Sharp + Node ESM)
                        ├── 1. Vite 8 Compilation (Rolldown)
                        │      ├── CSS Extraction & Native Minification
                        │      └── Manual Chunks: vendor-core, vendor-charts...
                        ├── 2. Native Sharp Optimization (tasks/build/optimize-images.js)
                        │      └── PNG/JPG -> compressed + WebP, SVG/GIF/ICO preserved
                        ├── 3. Atomic HTML Flattening (dist/app/pages -> dist/*.html)
                        ├── 4. Idempotent Link Normalizer (replace-links.js -> ./ + single XIVIG_ROOT)
                        └── 5. Integrity Verification (verify-dist.js -> 109 flat HTMLs, 0 broken links)
```

### Why Both Vite and Gulp?

| Concern | Vite Alone | Gulp Alone | XIVIG Dual-Engine Model |
|---|---|---|---|
| **Dev Server Startup** | < 300ms | 4–10 seconds | **Sub-second (Vite)** |
| **HMR Responsiveness** | Instantaneous | Page reload | **Instantaneous (Vite)** |
| **Image Compression** | Basic plugin | Sharp WebP pipeline | **Industrial Sharp WebP (Gulp)** |
| **Subdirectory Paths** | Requires fixed base | Regex streaming | **Automatic Relative Links (Gulp)** |
| **Vendor Package Sync**| Bundled only | File-level copying | **Selective Vendor Bundling + Copy** |
| **Multi-Tier Export**  | Single outDir | Flexible streams | **Exports to dist/ and docs/ (Gulp)**|

---

## 3. Templating System & Layout Engine

All views in `app/pages/` are authored using **Handlebars** via `vite-plugin-handlebars`. Page views inherit master layouts using Handlebars block injection `{{#> layout-name }} ... {{/layout-name}}`.

### Available Master Layouts (`app/src/partials/`)

```
app/src/partials/
├── admin-layout.html       # Primary administrative interface (Sidebar, Header, Main, Footer)
├── home-layout.html        # Public-facing portals, knowledge bases, and landing pages
├── auth-layout.html        # Clean, centered canvas for login, register, 2FA, lockscreen
├── landing-layout.html     # Full-width marketing showcase with transparent navigation
├── blank-layout.html       # Minimalist scaffold for embeds, modals, and print views
├── head.html               # Standardized meta tags, fonts, stylesheets, and favicons
├── header.html             # Top glassmorphism navigation bar, notifications, user menu
├── sidebar.html            # Multi-level hierarchical accordion navigation drawer
├── footer.html             # Copyright, versioning, and secondary system links
├── scripts.html            # Core bundle scripts, vendor loaders, and initialization triggers
└── settings-panel.html     # Slide-over theme configurator, layout toggle, and color switcher
```

### Creating a New Page Example

To add a new admin view (e.g. `app/pages/analytics/custom-report.html`):

```html
{{#> admin-layout title="Custom Analytics Report" }}

<div class="page-header d-flex justify-content-between align-items-center mb-4">
  <div>
    <h1 class="page-title mb-1">Custom Analytics Report</h1>
    <nav class="breadcrumb mb-0">
      <a href="/index.html" class="breadcrumb-item">Home</a>
      <a href="#" class="breadcrumb-item">Analytics</a>
      <span class="breadcrumb-item active">Custom Report</span>
    </nav>
  </div>
  <div class="d-flex gap-2">
    <button class="btn btn-outline-secondary btn-sm" id="btnExportPdf">
      <i class="bi bi-file-earmark-pdf me-1"></i> Export PDF
    </button>
    <button class="btn btn-primary btn-sm" id="btnRunQuery">
      <i class="bi bi-play-fill me-1"></i> Run Report
    </button>
  </div>
</div>

<div class="row g-4">
  <div class="col-xl-8">
    <div class="card border-0 shadow-sm rounded-4 p-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="card-title mb-0">Telemetry Real-Time Graph</h5>
        <span class="badge bg-success-subtle text-success">Live Data</span>
      </div>
      <div id="telemetryChart" style="min-height: 320px;"></div>
    </div>
  </div>
  <div class="col-xl-4">
    <div class="card border-0 shadow-sm rounded-4 p-4">
      <h5 class="card-title mb-3">Key Performance Indicators</h5>
      <ul class="list-group list-group-flush">
        <li class="list-group-item d-flex justify-content-between px-0">
          <span>Throughput</span><strong class="text-primary">12.4k req/s</strong>
        </li>
        <li class="list-group-item d-flex justify-content-between px-0">
          <span>Average Latency</span><strong class="text-success">18 ms</strong>
        </li>
        <li class="list-group-item d-flex justify-content-between px-0">
          <span>Error Rate</span><strong class="text-danger">0.02%</strong>
        </li>
      </ul>
    </div>
  </div>
</div>

{{/admin-layout}}
```

---

## 4. 7-1 Sass Design System & CSS Token Architecture

The stylesheet system lives in `app/src/scss/` and strictly adheres to the industry-standard **7-1 Sass pattern**:

```
app/src/scss/
├── base/
│   ├── _tokens.scss          # CSS Custom Properties (Design Tokens) for Light & Dark
│   ├── _variables.scss       # Sass-specific variables, breakpoints, font-stacks
│   ├── _mixins.scss          # Glassmorphism, elevations, flex helpers, media queries
│   ├── _reset.scss           # Cross-browser normalization and box-sizing
│   └── _typography.scss      # Plus Jakarta Sans, Outfit, and JetBrains Mono definitions
├── layout/
│   ├── _header.scss          # Floating topbar, search drawer, quick action dropdowns
│   ├── _sidebar.scss         # Accordion sidebar, brand emblem, badges, active pill states
│   ├── _footer.scss          # Sticky footer, metadata, and status badges
│   ├── _main-container.scss  # Responsive content canvas, grid margins, mobile paddings
│   ├── _preloader.scss       # Smooth page-load spinner and dismiss animations
│   └── _settings-panel.scss  # Offcanvas customization drawer
├── components/
│   ├── _button.scss          # Elevated, soft, pill, icon, and gradient button variants
│   ├── _card.scss            # Rounded-4 cards, hover lifts, glass cards, card headers
│   ├── _tabs.scss            # Pill tabs, underline indicators, segment controls
│   ├── _form-wizard.scss     # Multi-step progress bars and validation states
│   ├── _cart.scss            # E-Commerce shopping cart drawers and line items
│   └── _search-results.scss  # Live search dropdown and result highlight cards
├── pages/
│   ├── auth/                 # Split-screen auth, card auth, lockscreen styling
│   ├── error/                # 404, 500, maintenance graphics and error codes
│   ├── _chat.scss            # Message bubbles, contact list, audio/video call overlays
│   ├── _kanban.scss          # Column dragging, card tags, sprint indicators
│   ├── _inbox.scss           # Mailbox list, split preview, compose modal
│   └── _landing.scss         # Hero section, feature grids, pricing comparison
├── vendors/
│   ├── _bs-icon.scss         # Bootstrap Icons adjustments
│   ├── _fa-icon.scss         # FontAwesome 7 integration
│   └── _monokai.scss         # Highlight.js code syntax highlighting theme
├── utilities/
│   ├── _theme-fixes.scss     # Contrast adjustments for high-contrast dark themes
│   └── _custom.scss          # Project-specific overrides and atomic classes
└── main.scss                 # Master entry point importing all indices
```

### Design Tokens (`app/src/scss/base/_tokens.scss`)

```scss
:root {
  /* Brand Accents */
  --elite-primary: #6366f1;
  --elite-primary-rgb: 99, 102, 241;
  --elite-secondary: #64748b;
  --elite-success: #10b981;
  --elite-warning: #f59e0b;
  --elite-danger: #ef4444;
  --elite-info: #06b6d4;

  /* Surface & Elevation (Light Mode) */
  --bg-body: #f8fafc;
  --bg-surface: #ffffff;
  --card-bg: #ffffff;
  --card-border: rgba(226, 232, 240, 0.8);
  --header-bg: rgba(255, 255, 255, 0.85);
  --sidebar-bg: #ffffff;
  --text-primary: #0f172a;
  --text-muted: #64748b;

  /* Glassmorphism Defaults */
  --glass-blur: blur(12px);
  --glass-border: 1px solid rgba(255, 255, 255, 0.2);
  --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.08);
}

[data-bs-theme="dark"] {
  /* Surface & Elevation (Dark Mode) */
  --bg-body: #0b0f12;
  --bg-surface: #15191c;
  --card-bg: #15191c;
  --card-border: rgba(51, 65, 85, 0.6);
  --header-bg: rgba(21, 25, 28, 0.85);
  --sidebar-bg: #111417;
  --text-primary: #f8fafc;
  --text-muted: #94a3b8;

  --glass-border: 1px solid rgba(255, 255, 255, 0.06);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
```

---

## 5. Dark / Light Mode & Theme Engine

The theme architecture is powered by native Bootstrap 5.3+ CSS attributes and synchronized through `localStorage`.

### Zero-FOUC Initialization

To prevent any **Flash of Unstyled Content (FOUC)** during cold page loads, the following inline script executes synchronously in `app/src/partials/head.html` before the DOM renders:

```html
<script>
  (function () {
    const savedTheme = localStorage.getItem('xivig-global-theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
  })();
</script>
```

### Programmatic Theme API

Theme switching is exposed globally via [`app/src/scripts/core/settings.js`](../app/src/scripts/core/settings.js):

```javascript
// Toggle theme programmatically
export function setTheme(mode) {
  const targetTheme = (mode === 'dark' || mode === 'light') ? mode : 'light';
  document.documentElement.setAttribute('data-bs-theme', targetTheme);
  localStorage.setItem('xivig-global-theme', targetTheme);

  // Dispatch event for third-party charts (ApexCharts, ECharts, Highcharts)
  window.dispatchEvent(new CustomEvent('xivig-theme-changed', { 
    detail: { theme: targetTheme } 
  }));
}
```

---

## 6. JavaScript Architecture & Modular Controller Pattern

All application JavaScript is structured in `app/src/scripts/`. Each file exports an initialization function that validates DOM presence before running:

```
app/src/scripts/
├── core/
│   ├── jquery-setup.js       # Global jQuery exposure bridge ($ and jQuery on window)
│   ├── sidebar.js            # Sidebar toggle, accordion menu, active item highlighting
│   ├── preloader.js          # Preloader screen dismissal with opacity transition
│   ├── ui-controller.js      # Global tooltips, popovers, smooth scrolling
│   └── settings.js           # Theme persistence and UI preferences
├── components/
│   ├── data-table.js         # DataTables wrapper with responsive buttons
│   ├── sweet-alert.js        # SweetAlert2 notification dialog presets
│   ├── lightbox.js           # Fancybox / Lightbox media gallery viewer
│   └── video-player.js       # Plyr video and audio player initialization
├── apps/
│   ├── chat-search.js        # Filter contacts and messages in real-time
│   ├── kanban.js             # Drag-and-drop SortableJS board implementation
│   ├── mail-logic.js         # Select-all, mark-as-read, folder switching
│   └── task-manager.js       # Checkbox completion and priority filtering
├── forms/
│   ├── form-wizard.js        # Multi-step checkout & onboarding wizards
│   ├── form-pickers.js       # Air-Datepicker, Pickr color picker, Timedropper
│   └── form-adv.js           # Select2, input masking, Dropzone configurations
├── charts/
│   ├── apexchart-manager.js  # ApexCharts configurations with dark-mode listener
│   ├── echart.js             # Apache ECharts telemetry diagrams
│   ├── highchart-manager.js  # Highcharts financial and gauge charts
│   └── chart-manager.js      # Chart.js dashboards
└── pages/
    ├── dashboard.js          # Primary dashboard analytics runner
    ├── account-onboarding.js # Multi-step customer KYC and setup flow
    └── landing.js            # Marketing landing interactions and scroll reveals
```

### Safe Scoped Execution Pattern

```javascript
// app/src/scripts/apps/chat-search.js
export function initChatSearch() {
  const searchInput = document.querySelector('#chatSearchInput');
  const userList = document.querySelectorAll('.chat-user-item');

  // Guard clause: Only run if elements exist on the current page
  if (!searchInput || !userList.length) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    userList.forEach(item => {
      const name = item.querySelector('.chat-user-name')?.textContent.toLowerCase() || '';
      item.style.display = name.includes(query) ? '' : 'none';
    });
  });
}
```

### Rollup Manual Chunking Strategy (`vite.config.js`)

To prevent bloated single-file bundles, Rollup isolates large third-party libraries into dedicated cached chunks:

```javascript
manualChunks(id) {
  if (id.includes('node_modules/jquery/')) return 'vendor-jquery';
  if (id.includes('echarts') || id.includes('zrender')) return 'vendor-echarts';
  if (id.includes('highcharts')) return 'vendor-highcharts';
  if (id.includes('apexcharts')) return 'vendor-apexcharts';
  if (id.includes('chart.js')) return 'vendor-chartjs';
  if (id.includes('@fullcalendar')) return 'vendor-fullcalendar';
  if (id.includes('node_modules')) return 'vendor-core';
}
```

---

## 7. Comprehensive Domain Suite Catalog (108+ Views)

The template features **108+ fully implemented views** spanning 12 distinct business domains:

### 7.1 Core Dashboards
| View | Source Path | Target Capabilities |
|---|---|---|
| **Architect Dashboard v1** | `index.html` | System overview, traffic telemetry, server health, active transactions, user footprint |
| **Executive Telemetry v2** | `app/pages/dashboard-v2.html` | High-density KPI cards, revenue velocity, conversion funnels, regional activity map |
| **Elite Media Gallery** | `app/pages/elite-media-gallery.html` | Masonry photo/video showcase, category filters, metadata modal, lightbox zoom |

### 7.2 Analytics & System Telemetry
| View | Source Path | Target Capabilities |
|---|---|---|
| **Analytics Overview** | `app/pages/analytics/overview.html` | Bounce rates, session duration, referrers, device breakdown, cohort analysis |
| **System Metrics** | `app/pages/analytics/system-metrics.html` | Real-time CPU, RAM, disk I/O, network bandwidth, process monitoring table |

### 7.3 Productivity & Workspace Applications
| View | Source Path | Target Capabilities |
|---|---|---|
| **Real-Time Chat** | `app/pages/apps/chat.html` | DMs, channels, typing indicators, file attachments, online indicators |
| **FullCalendar Suite** | `app/pages/apps/calendar.html` | Month/Week/Day/List views, drag-and-drop events, category filter badges |
| **Mailbox Inbox** | `app/pages/apps/inbox.html` | Starred, drafts, sent, trash, multi-select bulk actions, search filter |
| **Mail Compose** | `app/pages/apps/compose.html` | Rich WYSIWYG body editor, CC/BCC drawers, drag-and-drop attachments |
| **Interactive Kanban** | `app/pages/apps/kanban.html` | Drag-and-drop task columns (Backlog, In Progress, Review, Done), task creation |
| **Task Manager** | `app/pages/apps/task-manager.html` | Priority tags, due dates, assignee avatars, sub-task progress bars |
| **File Manager** | `app/pages/apps/file-manager.html` | Folder hierarchy, storage usage gauge, thumbnail grid/list view, upload modal |
| **Video Player** | `app/pages/apps/video-player.html` | Plyr video/audio player, playlist queue, transcript toggle, quality selector |

### 7.4 DevOps & Cloud Deployments
| View | Source Path | Target Capabilities |
|---|---|---|
| **Deployment List** | `app/pages/deployments/deployment-list.html` | Active production/staging clusters, health checks, uptime indicators |
| **Deployment Details**| `app/pages/deployments/deployment-details.html`| Build logs, commit hashes, deployment rollback triggers, container stats |
| **New Deployment** | `app/pages/deployments/deployment-add.html` | Branch selection, environment variables form, webhook trigger settings |
| **Build History** | `app/pages/deployments/build-history.html` | CI/CD build run times, artifact sizes, status badges (Passed, Failed, Running) |
| **Releases & Tags** | `app/pages/deployments/releases.html` | Semantic version tags (`v2.1.0`), release notes changelog, asset downloads |

### 7.5 E-Commerce Platform
| View | Source Path | Target Capabilities |
|---|---|---|
| **Product Catalog** | `app/pages/ecommerce/ecommerce-products.html` | Grid/List view switcher, price filters, category facets, star ratings |
| **Product Detail** | `app/pages/ecommerce/ecommerce-product-detail.html` | Multi-angle image zoom, SKU variations, inventory counter, reviews tab |
| **Product Showcase** | `app/pages/ecommerce/ecommerce-product-show.html` | Large-format product visualizer with specifications table |
| **Add Product** | `app/pages/ecommerce/ecommerce-add-product.html` | Multi-image dropzone, pricing, inventory stock, tax rules, SEO metadata |
| **Edit Product** | `app/pages/ecommerce/ecommerce-edit-product.html` | Existing product modification, thumbnail replacement, variant matrix |
| **Shopping Cart** | `app/pages/ecommerce/ecommerce-cart.html` | Line item quantities, coupon code validator, subtotal/shipping calculation |
| **Checkout Flow** | `app/pages/ecommerce/checkout.html` | Multi-step shipping, billing address, credit card/debit/wallet selection |
| **Order Management** | `app/pages/ecommerce/ecommerce-orders.html` | Filterable orders table, tracking IDs, fulfillment status badges |
| **Order Details** | `app/pages/ecommerce/ecommerce-order-details.html`| Printable invoice, customer timeline, package delivery tracking |
| **Payment Success** | `app/pages/ecommerce/payment-success.html` | Confirmation badge, order number, receipt download, back-to-store button |

### 7.6 Identity & Authentication Suite
| View | Source Path | Target Capabilities |
|---|---|---|
| **User Sign In** | `app/pages/auth/login.html` | Split-screen branding, remember me, password reveal toggle, social OAuth |
| **User Registration**| `app/pages/auth/register.html` | Password strength meter, terms acceptance checkbox, account verification |
| **Forgot Password** | `app/pages/auth/forgot-password.html` | Email recovery link dispatcher with anti-spam rate limiting |
| **Reset Password** | `app/pages/auth/reset-password.html` | Secure token verification and new password confirmation form |
| **2FA Verification** | `app/pages/auth/two-factor-authentication.html` | 6-digit TOTP input boxes with auto-focus and clipboard paste support |
| **Screen Lock** | `app/pages/auth/lockscreen.html` | Avatar-centered session unlock dialog with PIN/password field |
| **User Onboarding** | `app/pages/auth/account-onboarding.html` | Profile completion, team invitation, role selection wizard |
| **Multi-Step KYC** | `app/pages/auth/multi-step-account-onboarding.html`| Identity verification, business documents upload, tax residency wizard |

### 7.7 Project Management Suite
| View | Source Path | Target Capabilities |
|---|---|---|
| **Projects Overview**| `app/pages/projects/project-list.html` | Card grid with progress bars, team avatars, budget indicators, deadlines |
| **Project Details** | `app/pages/projects/project-details.html` | Gantt chart view, activity timeline, attached files, team member roster |
| **Create Project** | `app/pages/projects/project-add.html` | Project title, client selector, date range picker, milestone definitions |
| **Edit Project** | `app/pages/projects/project-edit.html` | Budget adjustments, milestone reordering, status updates |

### 7.8 Forms & Advanced Input Controls
| View | Source Path | Target Capabilities |
|---|---|---|
| **Basic Inputs** | `app/pages/forms/form-basic.html` | Text inputs, floating labels, select menus, checkboxes, radios, switches |
| **Grid & Alignment**| `app/pages/forms/form-grid.html` | Responsive Bootstrap form-row layouts, inline inputs, input groups |
| **Advanced Inputs** | `app/pages/forms/advanced-components.html` | Autocomplete, tagify, masked inputs (phone, credit card, currency) |
| **Form Pickers** | `app/pages/forms/form-pickers.html` | Air-Datepicker range, Timedropper 12/24h clock, Pickr color picker |
| **Form Wizard** | `app/pages/forms/form-wizard.html` | Linear validation steps, tab indicators, previous/next event triggers |
| **Image Cropper** | `app/pages/forms/image-cropper.html` | Interactive Cropper.js studio: aspect ratio locks, rotate, zoom, preview |
| **Drag & Dropzone** | `app/pages/forms/image-dropzone.html` | Multi-file upload area, thumbnail previews, size limit validation |
| **Summernote WYSIWYG**| `app/pages/forms/summernote-editor.html`| Rich text authoring, HTML source view, table insertion, image uploads |
| **Form Extras** | `app/pages/forms/form-extras.html` | Character counters, toggle buttons, inline validation feedback states |

### 7.9 Tables & Data Grids
| View | Source Path | Target Capabilities |
|---|---|---|
| **Basic Tables** | `app/pages/tables/basic-table.html` | Striped, bordered, borderless, hoverable, contextual colored rows |
| **DataTables Suite**| `app/pages/tables/datatable.html` | Search input, column sort, pagination, CSV/Excel/PDF export, print mode |

### 7.10 UI Components & Elements Library
| View | Source Path | Target Capabilities |
|---|---|---|
| **Buttons & Badges**| `app/pages/ui-elements/ui-buttons.html` | Solid, outline, soft, gradient, icon buttons, button groups, badge pills |
| **Cards & Panels** | `app/pages/ui-elements/ui-cards.html` | Basic cards, metric cards, stat counters, image cards, card actions |
| **Hover Cards** | `app/pages/ui-elements/ui-cards-hover.html` | Interactive cards with 3D tilts, hover elevations, and accent borders |
| **Modals & Dialogs**| `app/pages/ui-elements/ui-modals.html` | Centered, scrollable, full-screen, video modals, modal animations |
| **Offcanvas Drawers**| `app/pages/ui-elements/ui-offcanvas.html`| Left, right, top, bottom sliding drawers with backdrop controls |
| **Carousels** | `app/pages/ui-elements/ui-carousel.html` | Autoplay sliders, fade transitions, indicators, responsive thumbnails |
| **Tabs & Accordions**| `app/pages/ui-elements/ui-tabs.html` | Underline tabs, pill tabs, vertical tabs, accordion collapse sections |
| **Notifications** | `app/pages/ui-elements/ui-notification.html` | Toast messages, inline alert banners, floating corner notifications |
| **SweetAlert2** | `app/pages/ui-elements/ui-sweet-alert.html` | Success, warning, confirmation dialogs, timer alerts, input prompts |
| **Progress Bars** | `app/pages/ui-elements/ui-progressbar.html` | Striped, animated, stacked, circular progress bars |
| **Range Sliders** | `app/pages/ui-elements/ui-range-slider.html`| Single, double range handles, tooltip labels, step increments |
| **Timelines** | `app/pages/ui-elements/ui-timeline.html` | Vertical activity log with timestamp badges, icons, and action links |
| **Typography** | `app/pages/ui-elements/ui-typography.html` | Display headings, lead paragraphs, blockquotes, code blocks, lists |
| **Bootstrap Icons** | `app/pages/ui-elements/bootstrap-icon.html` | Interactive search catalog of 2,000+ vector glyphs with copy-class |
| **FontAwesome Icons**| `app/pages/ui-elements/font-awesome.html` | Search catalog of FontAwesome 7 icon set with copy-code snippet |

### 7.11 User Administration & Access Control
| View | Source Path | Target Capabilities |
|---|---|---|
| **User Directory** | `app/pages/users/user-list.html` | Searchable user grid/table, status badges (Active, Suspended), roles |
| **User Profile** | `app/pages/users/user-details.html` | Bio, contact details, social links, activity log, authored articles |
| **Add New User** | `app/pages/users/user-add.html` | Form for personal info, avatar upload, role assignments, department |
| **Edit User** | `app/pages/users/user-edit.html` | Update permissions, password reset, account status toggle |
| **Account Settings**| `app/pages/account-settings.html` | Security tab, notification preferences, connected devices, API tokens |
| **Store Settings** | `app/pages/store-settings.html` | Currency, tax rates, shipping providers, payment gateway credentials |
| **Admin Settings** | `app/pages/admin-settings.html` | System maintenance mode, backup triggers, email SMTP configuration |

### 7.12 System, Utility & Error States
| View | Source Path | Target Capabilities |
|---|---|---|
| **400 Bad Request** | `app/pages/error/400.html` | Clean error illustration with redirect button |
| **403 Forbidden** | `app/pages/error/403.html` | Access denied security screen with permission request link |
| **404 Not Found** | `app/pages/error/404.html` | Creative missing page graphic with search bar |
| **500 Server Error**| `app/pages/error/500.html` | System failure screen with error reference ID |
| **503 Unavailable** | `app/pages/error/503.html` | Maintenance status screen with estimated recovery time |
| **Maintenance** | `app/pages/maintenance.html` | Scheduled maintenance banner with live countdown timer |
| **FAQ & Knowledge** | `app/pages/faq.html` | Categorized searchable accordion knowledge base |
| **Sitemap Directory**| `app/pages/sitemap.html` | Complete visual tree linking every page in the template |
| **Pricing Tables** | `app/pages/pricing-table.html` | Monthly/Annual billing toggle, feature comparison matrix |
| **Invoice Template**| `app/pages/invoice.html` | Clean printable invoice with line items, tax, and pay button |
| **Global Search** | `app/pages/search.html` | Universal search results page with category tabs |
| **Course Platform** | `app/pages/course-dashboard.html` | LMS student dashboard: active courses, progress, certificates |

---

## 8. Multi-Chart Engine Ecosystem

XIVIG provides native, pre-configured integrations for **four major charting libraries**. Each engine includes dark/light theme listeners to adapt colors on the fly.

### 1. ApexCharts Integration (`app/src/scripts/charts/apexchart-manager.js`)
Best for modern financial dashboards, sparklines, and area charts:
```javascript
import ApexCharts from 'apexcharts';

export function renderSalesChart(selector) {
  const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
  const options = {
    chart: {
      type: 'area',
      height: 350,
      fontFamily: 'inherit',
      background: 'transparent',
      toolbar: { show: false }
    },
    theme: { mode: isDark ? 'dark' : 'light' },
    colors: ['#6366f1', '#10b981'],
    series: [
      { name: 'Revenue', data: [31, 40, 28, 51, 42, 109, 100] },
      { name: 'Expenses', data: [11, 32, 45, 32, 34, 52, 41] }
    ],
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] }
  };
  const chart = new ApexCharts(document.querySelector(selector), options);
  chart.render();

  // Listen for global theme toggle
  window.addEventListener('xivig-theme-changed', (e) => {
    chart.updateOptions({ theme: { mode: e.detail.theme } });
  });
}
```

### 2. Apache ECharts (`app/src/scripts/charts/echart.js`)
Best for high-volume real-time telemetry, heatmaps, and funnel diagrams.

### 3. Chart.js (`app/src/scripts/charts/chart-manager.js`)
Best for lightweight, canvas-based bar, radar, and doughnut charts.

### 4. Highcharts (`app/src/scripts/charts/highchart-manager.js`)
Best for stock tickers, candlestick trading, and enterprise financial reports.

---

## 9. Component & Plugin Integration Reference

| Plugin | Version | Typical Target Views | Bundle Strategy |
|---|---|---|---|
| **DataTables.net** | `^2.2.x` | `datatable.html`, `ecommerce-orders.html` | `vendor-core.js` |
| **FullCalendar** | `^6.1.x` | `calendar.html` | `vendor-fullcalendar.js` |
| **Cropper.js** | `^2.1.x` | `image-cropper.html`, `profile.html` | Dynamic import |
| **Dropzone** | `^6.0.x` | `image-dropzone.html`, `ecommerce-add-product.html` | Dynamic import |
| **Summernote** | `^0.9.x` | `summernote-editor.html`, `compose.html` | Copied to `dist/plugins/` |
| **SweetAlert2** | `^11.x` | `ui-sweet-alert.html`, universal alerts | `vendor-core.js` |
| **SortableJS** | `^1.15.x` | `kanban.html`, `task-manager.html` | `vendor-core.js` |
| **Plyr** | `^3.8.x` | `video-player.html` | `vendor-core.js` |
| **Air-Datepicker** | `^3.6.x` | `form-pickers.html`, `calendar.html` | Copied to `dist/plugins/` |

---

## 10. Build Workflows & Task Automation

All build automation is centralized in `package.json` and orchestrated by `gulpfile.js`:

### CLI Command Summary

```bash
# 1. Start development server with instant HMR
npm run dev

# 2. Compile full production build into flat dist/ and verify integrity
npm run build

# 3. Preview the compiled production build locally
npm run preview

# 4. Run automated link and asset integrity checks on dist/
npm run verify

# 5. Manual idempotent link normalization on ./dist
npm run fix-links

# 6. Optional minimal Gulp 5 compatibility runner
npm run build:gulp
```

### Build Pipeline Step-by-Step (`npm run build`)

1. **`vite build`**: Employs `vite.config.js` (Vite 8 + Rolldown) to bundle SCSS/ESM cleanly with empty-output cleanup (`emptyOutDir: true`).
2. **`optimizeProjectImages`** ([`tasks/build/optimize-images.js`](../tasks/build/optimize-images.js)): Runs inside Vite's `closeBundle` hook using `sharp` directly in parallel workers — compressing PNG/JPG alongside `.webp` variants and copying `.svg`, `.gif`, `.ico` into `dist/assets/`.
3. **Atomic Flattening** ([`tasks/build/vite-plugins.js`](../tasks/build/vite-plugins.js)): Validates zero filename collisions, moves `dist/app/pages/**/*.html` directly into `dist/*.html`, and deletes `dist/app/`.
4. **Idempotent Link Normalization** ([`tasks/utils/replace-links.js`](../tasks/utils/replace-links.js)): Rewrites `/app/pages/...`, `/pages/...`, `/app/src/images/...`, `/images/...`, `/data/...`, and CSS `url(...)` paths to portable `./...` relative paths, converts module chunks into CORS-free classic `<script defer>` bundles, strips `crossorigin` from stylesheet links for `file://` support, and injects `window.XIVIG_ROOT = "./"` cleanly once.
5. **Integrity Verification** ([`tasks/utils/verify-dist.js`](../tasks/utils/verify-dist.js)): Audits all 109 flat HTML pages, classic script/stylesheet tags, single `window.XIVIG_ROOT` injection, compiled CSS `url()` targets, and local assets on disk.

---

## 11. Laravel Blade Migration Framework

XIVIG includes built-in migration automation in [`tasks/utils/`](../tasks/utils/) to port the entire template into Laravel Blade in seconds.

### Automated Conversion Scripts

```
tasks/utils/
├── convert-to-laravel.py        # Python script converting Handlebars syntax to Blade
├── organize-laravel-assets.py   # Distributes compiled assets into Laravel's public/ folder
├── rename-html-to-blade.js      # Renames .html files to .blade.php
└── apply-master-layout.js       # Extracts page body and wraps in @extends('layouts.admin')
```

### Migration Execution

```bash
# Step 1: Convert all HTML/Handlebars pages to Blade directives
python tasks/utils/convert-to-laravel.py

# Step 2: Organize assets into Laravel public/assets/
python tasks/utils/organize-laravel-assets.py
```

### Mapping Matrix

| XIVIG Frontend | Laravel Destination | Blade Helper Equivalent |
|---|---|---|
| `app/src/partials/admin-layout.html` | `resources/views/layouts/admin.blade.php` | `@extends('layouts.admin')` |
| `app/src/partials/header.html` | `resources/views/partials/header.blade.php` | `@include('partials.header')` |
| `app/src/partials/sidebar.html` | `resources/views/partials/sidebar.blade.php` | `@include('partials.sidebar')` |
| `app/pages/ecommerce/*.html` | `resources/views/pages/ecommerce/*.blade.php`| `view('pages.ecommerce.index')`|
| `/app/src/images/logo.png` | `public/assets/admin/images/logo.png` | `{{ asset('assets/admin/images/logo.png') }}` |
| Main CSS/JS bundle | `resources/scss/main.scss` & `resources/js/app.js` | `@vite(['resources/scss/main.scss', 'resources/js/app.js'])` |

---

## 12. Production Deployment & Web Server Setup

### 1. GitHub Pages (Automated via GitHub Actions)
This repository ships with [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml), which automatically builds flattened `./dist`, runs `verify-dist.js`, and publishes cleanly to the `gh-pages` branch and GitHub Pages artifact on every push to `main`:
1. Push your commits to `main`.
2. In repository **Settings > Pages**, choose either **GitHub Actions** or **Deploy from a branch (`gh-pages` / `(root)`)**.
*(Developer Markdown documentation lives cleanly in [`docs/`](./); the included `public/.nojekyll` file ensures GitHub Pages serves all static files and asset directories cleanly without Jekyll processing).*

### 2. Nginx Web Server Configuration
For self-hosted production deployments, point your web root to `dist/`:

```nginx
server {
    listen 80;
    server_name admin.yourdomain.com;
    root /var/www/xivig-admin-panel/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable Gzip / Brotli compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    # Aggressive caching for versioned static assets
    location ~* \.(?:css|js|webp|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3. Apache Web Server (`.htaccess`)
Place an `.htaccess` file inside `dist/`:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

---

## 13. Troubleshooting & Developer FAQs

### Q1: `npm install` fails with Sharp or Python build errors
* **Fix**: Ensure Node.js 18 or 20 LTS is installed. Sharp requires pre-compiled binaries matching your architecture. Clear npm cache and retry:
  ```bash
  npm cache clean --force
  rm -rf node_modules package-lock.json
  npm install
  ```

### Q2: Dark mode reverts to light mode when navigating to a new page
* **Fix**: Ensure the zero-FOUC script in `app/src/partials/head.html` has not been deleted or moved. The theme attribute `data-bs-theme` must be set synchronously on `document.documentElement` before stylesheets are parsed.

### Q3: Asset links show 404 when deployed to a subfolder
* **Fix**: Run `npm run fix-links` (or `npm run build`). The idempotent script [`tasks/utils/replace-links.js`](../tasks/utils/replace-links.js) converts all root-relative `/app/...` and `/pages/...` paths into portable flattened `./...` relative paths matching the root `dist/*.html` layout.

### Q4: jQuery plugins throw `$ is not a function`
* **Fix**: Global jQuery is exported in [`app/src/scripts/core/jquery-setup.js`](../app/src/scripts/core/jquery-setup.js). Ensure `jquery-setup.js` is imported in your main JavaScript entry file prior to invoking legacy jQuery plugins.

---

## License & Intellectual Property

XIVIG Admin Panel is open-source software licensed under the **[MIT License](../LICENSE)**.

```
Copyright (c) 2026 XIVIG Studio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```
