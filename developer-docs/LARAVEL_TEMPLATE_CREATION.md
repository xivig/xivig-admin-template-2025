# Laravel Template Creation Process

This document outlines the process used to convert the core frontend repository into the Laravel-specific version found in `resources/views`. This serves as a guide for maintaining and extending the Laravel template.

---

## 1. Architectural Mapping

The conversion follows a 1:1 mapping from the Handlebars/HTML structure to Laravel's Blade engine.

| Frontend Component | Laravel/Blade Location |
| :--- | :--- |
| `app/src/partials/` | `resources/views/partials/` |
| `app/src/partials/*-layout.html` | `resources/views/layouts/` |
| `app/pages/` | `resources/views/pages/` |
| Asset Paths (`/app/src/`) | `{{ asset('...') }}` |

### 1.1 Directory Tree Mapping

A visual representation of how the source frontend structure maps to the final Laravel implementation:

```text
Frontend Source (Gulp/Vite)         Laravel Implementation (Blade/Vite)
├── app/
│   ├── pages/                      ├── resources/views/pages/
│   │   ├── xivig.html -------------->  ├── xivig.blade.php
│   │   └── ecommerce/ -------------->  └── ecommerce/
│   └── src/
│       ├── partials/               ├── resources/views/partials/
│       │   ├── head.html ----------->  ├── head.blade.php
│       │   ├── header.html --------->  ├── header.blade.php
│       │   └── home-layout.html ---->  └── resources/views/layouts/home.blade.php
│       ├── scss/ ------------------->  ├── resources/scss/
│       ├── scripts/ ---------------->  ├── resources/js/ (app.js)
│       └── images/ ----------------->  └── public/assets/
├── public/ ------------------------->  └── public/
└── package.json -------------------->  └── package.json (Merged Dependencies)
```

### 1.2 Asset Organization

Laravel assets are divided into two categories: **Processed Resources** (via Vite) and **Static Assets** (via Public).

#### Processed Resources (`resources/`)
These files are compiled, minified, and versioned by Vite.
- **Styles (`resources/scss/`)**: The modular SCSS architecture. The entry point is `main.scss`.
- **Scripts (`resources/js/`)**: ES6 modules. The entry point is `app.js` (which orchestrates all `init` functions).
- **Usage in Blade**: 
  ```html
  @vite(['resources/scss/main.scss', 'resources/js/app.js'])
  ```

#### Static Assets (`public/`)
These files are served directly by the web server without processing. We use a **Categorized Asset Model** to keep layouts isolated:

- **Directory Structure**:
  - `public/assets/admin/`: JS, CSS, and Images for the main dashboard.
  - `public/assets/home/`: JS, CSS, and Images for the landing page.
  - `public/assets/auth/`: JS, CSS, and Images for login/register pages.
- **Usage in Blade**:
  ```html
  <!-- Images -->
  <img src="{{ asset('assets/admin/images/logo.png') }}">

  <!-- Minified Standalone JS/CSS -->
  <link rel="stylesheet" href="{{ asset('assets/admin/css/vendor-core.css') }}">
  <script src="{{ asset('assets/admin/js/main.js') }}"></script>
  ```

---

## 2. Layout Inheritance Model

We use Blade's `@extends`, `@section`, and `@yield` to manage complex layouts.

### 2.1 The Base Layout (`layouts/admin.blade.php`)
The admin layout defines the global shell, including the sidebar, header, and footer. It provides several hooks for child pages:
- `@yield('title')`: The page title (also used in breadcrumbs).
- `@yield('extra_css')`: Page-specific styles.
- `@yield('content')`: The main page content.
- `@yield('extra_js')`: Page-specific scripts.

### 2.2 Standardized Page Header
Every page using the `admin` layout automatically generates a shadow-sm page header with breadcrumbs.
- The `parentTitle` section is optional and can be provided for multi-level navigation.

---

## 3. Conversion Workflow

### 3.1 Step 1: Partial Conversion
All `.html` partials were renamed to `.blade.php`.
- Handlebars `{{> partial-name }}` tags were replaced with `@include('partials.partial-name')`.
- Handlebars variables `{{title}}` were replaced with `@yield('title')` or Blade variables `{{ $title }}`.

### 3.2 Step 2: Page Implementation
Each page in `resources/views/pages/` follows this structure:

```php
@extends('layouts.admin')

@section('title', 'Dashboard Overview')
@section('parentTitle', 'Dashboard')

@section('content')
    <!-- Page-specific HTML content here -->
@endsection

@section('extra_js')
    <script>
        // Page-specific initialization logic
    </script>
@endsection
```

### 3.3 Step 3: Asset Path Localization
Static paths in the original HTML were converted to use Laravel's `asset()` helper to ensure they resolve correctly regardless of the URL structure.
- **Example:** `<img src="/app/src/images/logo.png">` became `<img src="{{ asset('assets/logo.webp') }}">`.

---

## 4. Laravel-Specific Enhancements

### 4.1 Form Security (CSRF)
Every form in the template (Login, Contact, Settings) was updated to include the `@csrf` directive.

### 4.2 Dynamic Authentication UI
The sidebar was updated with a functional logout form:
```php
<form method="POST" action="{{ route('logout') }}">
    @csrf
    <a href="{{ route('logout') }}" onclick="event.preventDefault(); this.closest('form').submit();">
        Logout
    </a>
</form>
```

### 4.3 Breadcrumb Logic
The breadcrumb system in the `admin` layout is dynamic. It checks for the existence of a `parentTitle` section to decide whether to show a middle link:
```php
@hasSection('parentTitle')
    <li class="breadcrumb-item"><a href="#">@yield('parentTitle')</a></li>
@endif
<li class="breadcrumb-item active">@yield('title')</li>
```

---

## 5. Maintenance Guide

### 5.1 Adding a New Page
1.  Create a new file in `resources/views/pages/`.
2.  Extend the appropriate layout (`admin`, `home`, or `auth`).
3.  Define the `title` and `content` sections.
4.  Add a route in `routes/web.php`.

### 5.2 Modifying the Sidebar
The sidebar is located in `resources/views/partials/sidebar.blade.php`. It uses standard Bootstrap 5 classes and can be extended with Laravel-specific logic (e.g., `@if(auth()->user()->can(...))`).

### 5.3 Updating Assets
If you modify the SCSS or JS in `resources/`, ensure you run:
```bash
npm run dev # for development
npm run build # for production
```
The layouts use `@vite(['resources/scss/main.scss', 'resources/js/app.js'])` to automatically include the correct compiled files.

---

## 6. Optimized Assets & Standalone Views

The build process generates fully optimized and minified versions of the CSS and JS files, located in the `dist/assets` and `docs/assets` folders.

### 6.1 Optimized Asset Manifest

| Asset Name | Type | Size | Description |
| :--- | :--- | :--- | :--- |
| `main.js` | JS | ~90 KB | Main application logic, fully minified. |
| `vendor-core.js` | JS | ~489 KB | All third-party dependencies (Bootstrap, etc.). |
| `vendor-core.css` | CSS | ~141 KB | Combined and minified vendor styles. |
| `preloader.css` | CSS | ~416 B | Standalone preloader styling. |

### 6.2 Recommended Directory Structure for Standalone Laravel
For standalone Laravel templates (not using Vite HMR), place the minified files in the `public` folder using the following structure to keep layouts separated:

```text
public/
├── assets/
│   ├── admin/
│   │   ├── js/main.js
│   │   ├── css/vendor-core.css
│   │   └── images/
│   ├── home/
│   │   ├── js/home.js
│   │   └── images/
│   └── auth/
│       ├── js/auth.js
│       └── images/
```

### 6.3 Final Standalone Blade Views
The template conversion has generated standardized layouts and over 50+ application pages in `resources/views/`:

1.  **Layouts (`resources/views/templates/`)**:
    -   Admin: `admin/layout.blade.php`
    -   Home: `home/layout.blade.php`
    -   Auth: `auth/layout.blade.php`
2.  **Pages (`resources/views/pages/`)**:
    -   Includes `profile.blade.php`, `dashboard-v2.blade.php`, `login.blade.php`, and more.
    -   Each page automatically extends its corresponding standalone layout.

> **Note:** If you need to refresh these views from the frontend source in the future, you can use the conversion tool located at `tasks/utils/convert-to-laravel.py`.

---

## 7. Automation & Routing Details

To make the template truly functional in a Laravel environment, we have provided additional automation scripts and route examples.

### 7.1 Asset Organization Script
Because the Blade templates use categorized asset paths (e.g., `assets/admin/images/`), you need to organize your static files. Use the provided Python script:

**Run:**
```bash
python tasks/utils/organize-laravel-assets.py
```
**What it does:**
1.  Creates categorized folders in `public/assets/` (admin, home, auth).
2.  Copies all images from the frontend source to these folders.
3.  Copies minified CSS/JS from the `dist/` folder to the appropriate public assets directory.

### 7.2 Sample Routes File
A complete `web.php` route file is available at `resources/laravel/web.php`. It includes:
- **Explicit Routes:** For main pages and categories (Ecommerce, Blog, Auth).
- **Dynamic Fallback:** A smart route that automatically maps any `{path}.html` request to the corresponding Blade view in `resources/views/pages/`.

**Implementation:**
Copy the content of `resources/laravel/web.php` into your Laravel project's `routes/web.php`.
