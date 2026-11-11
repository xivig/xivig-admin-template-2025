# Laravel Implementation Guide: Xivig Admin Template

This guide provides a comprehensive, step-by-step process for integrating the **Xivig Admin Template** into a Laravel application. Much of the Blade conversion has already been initiated in `resources/views`.

---

## 1. Environment Setup

### 1.1 Fresh Laravel Installation (Optional)
If you are moving this into a new project:
```bash
composer create-project laravel/laravel my-xivig-admin
cd my-xivig-admin
```

### 1.2 Merge Dependencies
Your `package.json` currently has many frontend dependencies (ApexCharts, ECharts, Bootstrap, etc.). Ensure these are present in your Laravel project's `package.json`.

Run:
```bash
npm install
```

---

## 2. Asset Management (Vite & Laravel)

Laravel uses the `laravel-vite-plugin`. You need to bridge the gap between your current `app/src` structure and Laravel's expected structure.

### 2.1 Recommended Directory Structure
Move your assets to the `resources` directory if they aren't already there:
- `app/src/scss/` -> `resources/scss/`
- `app/src/scripts/` -> `resources/js/`
- `app/src/images/` -> `public/images/` (for static access) or `resources/images/` (for Vite processing)

### 2.2 Update `vite.config.js`
Replace your current Vite configuration with the Laravel-optimized version:

```javascript
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/scss/main.scss', 
                'resources/js/app.js' // Point to your main entry file
            ],
            refresh: true,
        }),
    ],
    resolve: {
        alias: {
            '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
});
```

---

## 3. Blade Architecture

The repository already contains initial Blade layouts in `resources/views/layouts` and partials in `resources/views/partials`.

### 3.1 Existing Layouts
- `layouts.home`: Use for landing pages.
- `layouts.admin`: Use for the main dashboard area.
- `layouts.auth`: Use for login/register pages.

### 3.2 Usage Example
In your page views (e.g., `resources/views/pages/dashboard.blade.php`):
```php
@extends('layouts.admin')

@section('title', 'Dashboard | Xivig')

@section('content')
    <div class="container-fluid">
        <!-- Dashboard Content -->
    </div>
@endsection
```

---

## 4. Completing the Migration

### 4.1 Routing (`routes/web.php`)
Map your Blade views to routes:

```php
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('pages.xivig'); // Your landing page
})->name('home');

Route::get('/dashboard', function () {
    return view('pages.dashboard');
})->name('dashboard');
```

### 4.2 Image Paths
The current HTML uses paths like `/app/src/images/`. In Laravel/Blade, update these to use the `asset()` helper:

**Old:**
`<img src="/app/src/images/logo.png">`

**New (after moving to public/images):**
`<img src="{{ asset('images/logo.png') }}">`

---

## 5. Development Workflow

1. **Terminal 1 (PHP Server):**
   ```bash
   php artisan serve
   ```
2. **Terminal 2 (Vite HMR):**
   ```bash
   npm run dev
   ```
3. **Production Build:**
   ```bash
   npm run build
   ```

---

## 6. Checklist for Production
- [ ] Ensure all forms have `@csrf`.
- [ ] Move any remaining static pages from `app/pages` to `resources/views/pages`.
- [ ] Replace Handlebars-style `{{> partial}}` with Blade `@include('partials.partial')`.
- [ ] Check `resources/js/app.js` (formerly `main.js`) for any hardcoded URL paths that need updating.
- [ ] Validate that all SCSS variables are correctly imported in `main.scss`.
