# Xivig Admin Template - AI Assistant Guide

This document provides project-specific context and instructions for AI assistants working on the Xivig Admin Panel repository.

## 🛠 Tech Stack Core
- **Frontend**: Bootstrap 5.3, SCSS (7-1 Pattern), ES6 Modules.
- **Templating**: Handlebars (for frontend source) -> Laravel Blade (for integration).
- **Build System**: Hybrid (Vite for fast dev/compilation, Gulp for image optimization and asset exports).

## 📂 Key Architectures

### 1. The Initialization Pattern (JS)
All JavaScript logic follows a safety-checked initialization pattern. Never add global logic that executes on every page.
```javascript
export const initFeature = () => {
    const el = document.getElementById('target-id');
    if (!el) return;
    // logic...
};
```

### 2. Layout Inheritance (Blade)
The Laravel version uses `@extends('layouts.admin')`.
- **Hooks**: `@yield('title')`, `@yield('parentTitle')`, `@yield('extra_css')`, `@yield('extra_js')`.

## 🤖 Automation Scripts (`../tasks/utils/`)
- `convert-to-laravel.py`: Mass converts Handlebars to Blade.
- `organize-laravel-assets.py`: Organizes `dist/` and `app/src/images/` into `public/assets/`.
- `replace-links.js`: Post-build path normalization.

## 📝 Conventions
- **Naming**: `kebab-case` for all files and directories.
- **Assets**: Use root-relative paths in source (`/app/src/images/...`) and `{{ asset('assets/admin/images/...') }}` in Blade.
- **Deployment**: The `docs/` folder is the GitHub Pages target and is synchronized automatically by the `build` task.

## 📚 Documentation Reference
- `UTILITY_SCRIPTS.md`: Script manual.
- `BUILD_SYSTEM_GUIDE.md`: Dev/Build/Deploy manual.
- `LARAVEL_TEMPLATE_CREATION.md`: Blade implementation guide.
- `GULP_WORKFLOW_GUIDE.md`: Task extension guide.
