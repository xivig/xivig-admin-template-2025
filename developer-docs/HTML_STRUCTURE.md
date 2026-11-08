# HTML Directory Structure & Navigation Guide

To maintain a clean and scalable project, all HTML entry points have been organized into meaningful categories. 

## 📂 Directory Map

All secondary views are located in `app/pages/`, grouped by functionality:

### 1. Root Directory
Primary entrance to the application.
- `index.html`: The main dashboard (v1).

### 2. `app/pages/auth/`
Authentication and user onboarding flow.
- `login.html`, `register.html`, `forgot-password.html`, `reset-password.html`
- `lockscreen.html`, `two-factor-authentication.html`

### 3. `app/pages/ecommerce/`
Store management and product catalogs.
- `ecommerce-products.html`: Grid/List of products.
- `ecommerce-orders.html`, `ecommerce-cart.html`
- `ecommerce-product-detail.html`

### 4. `app/pages/apps/`
Functional application modules.
- `chat.html`, `calendar.html`, `kanban.html`
- `inbox.html`, `task-manager.html`

### 5. `app/pages/ui-elements/`
Comprehensive UI Kit and Bootstrap components.
- `ui-buttons.html`, `ui-cards.html`, `ui-tabs.html`, `ui-modals.html`

### 6. `app/pages/forms/`
Input systems and data collection.
- `form-basic.html`, `form-wizard.html`, `form-pickers.html`

### 7. `app/pages/charts/` & `app/pages/tables/`
Data visualization and structural data.
- **Charts**: `apexcharts.html`, `chartjs.html`, `e-chart.html`
- **Tables**: `basic-table.html`, `datatable.html`

### 8. `app/pages/`
General content, profiles, and secondary views.
- `profile.html`, `account-settings.html`, `store-settings.html`
- `faq.html`, `gallery.html`, `sitemap.html`
- `xivig.html`: Landing page.

### 9. `app/pages/error/`
System error state pages.
- `404.html`, `500.html`, `maintenance.html`

---

## 🛠 Asset Path Logic

The project uses **Root-Relative Paths** (`/app/src/...`) in all partials. This ensures that assets (images, scripts, styles) load correctly regardless of how deep an HTML file is placed in a subdirectory.

### Link Convention
When linking between pages in the sidebar or menu, always use the full path from the root:
```html
<!-- Example: Linking to Login from a nested component -->
<a href="/app/pages/auth/login.html">Login</a>
```

## 🚀 Build Integration

The `vite.config.js` is configured to automatically scan all subdirectories for `.html` files. Any new HTML file added to a subfolder will be automatically detected and included in the production build.
