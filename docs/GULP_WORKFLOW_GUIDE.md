# Build Pipeline & Vite 8 Extension Guide

Xivig Admin Panel uses a **100% native Vite 8 + Node ESM** build pipeline (legacy Gulp workflows and `gulpfile.js` have been retired cleanly in favor of programmatic Vite hooks and direct Sharp optimization).

## 1. Build Extension Points (`tasks/`)

- **`tasks/build/vite-plugins.js`**:
  - `xivigDevRewritePlugin`: Dev server middleware mapping `/app/pages/**`, `/pages/**`, and flat `/<page>.html` identically during local development.
  - `xivigFlatDistPlugin`: Post-bundle hook compiling classic CORS-free `*.bundle.js` scripts, running Sharp optimization, atomically flattening `dist/*.html`, and normalizing links.
- **`tasks/build/optimize-images.js`**: Multi-worker Node + Sharp pipeline optimizing `.jpg`/`.png` (+ `.webp`) and preserving `.svg`/`.gif`/`.ico`.
- **`tasks/utils/replace-links.js`**: Idempotent HTML link normalizer, `crossorigin` stripper (`file://` compatibility), and single `window.XIVIG_ROOT` injector.
- **`tasks/utils/verify-dist.js`**: Automated post-build audit script (`npm run verify`) validating 109 flat HTML files and zero broken assets.

## 2. Adding Custom Build Steps

Add lightweight async steps cleanly inside `xivigFlatDistPlugin.closeBundle()` or register Node ESM helper scripts in `package.json`.
