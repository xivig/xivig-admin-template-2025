# Build System & Workflow Guide

This guide explains how to use the development, build, and verification workflows provided in the Xivig Admin Template. The build system is **Vite 8 native** (Rolldown bundler + Node ESM plugins + Sharp image optimization), retaining only a thin optional Gulp 5 compatibility layer.

---

## 1. Development Workflow

### `npm run dev`
This is your primary command for daily development.
- **What it does:**
  1.  Cleans old build folders.
  2.  Starts the **Vite** development server.
  3.  Opens your default browser to `http://localhost:3000`.
- **Key Features:**
  - **HMR (Hot Module Replacement):** CSS and JS changes are reflected instantly without a full page reload.
  - **Handlebars Rendering:** Compiles your layout and partials on the fly.

---

## 2. Build & Optimization Workflows

### `npm run build`
Generates a flattened, production-ready version of the site in the `dist/` folder and verifies every link and asset.
- **The Step-by-Step Process (`vite build && node tasks/utils/verify-dist.js ./dist`):**
  1.  **Vite 8 + Rolldown Compile:** Compiles all SCSS, bundles ES modules into vendor/app chunks, and empties old `dist/`.
  2.  **Native Sharp Image Optimization (`tasks/build/optimize-images.js`):** Compresses JPG/PNG images with `.webp` variants and copies `.svg`, `.gif`, and `.ico` static assets into `dist/assets/`.
  3.  **CORS-Free Classic Bundles (`tasks/build/vite-plugins.js`):** Compiles self-contained classic IIFE bundles (`assets/main.bundle.js`, `assets/home.bundle.js`, `assets/auth.bundle.js`), converts page scripts, and generates `dist/data/*.js` fallbacks so icon search and dashboards work over both `http(s)://` and local `file://`.
  4.  **Atomic HTML Flattening (`tasks/build/vite-plugins.js`):** Moves `dist/app/pages/**/*.html` directly into root `dist/*.html` and cleans temporary `dist/app/` files.
  5.  **Idempotent Link Normalization (`tasks/utils/replace-links.js`):** Rewrites all `/app/...`, `/pages/...`, `/images/...`, `/data/...`, and CSS `url(...)` paths to portable `./...` relative paths, strips `crossorigin` from CSS links for `file://` compatibility, wires classic `<script defer>` bundles, and injects a single `window.XIVIG_ROOT = "./"`.
  6.  **Verification (`tasks/utils/verify-dist.js`):** Audits all 109 flat HTML files, classic script/CSS tags, single `window.XIVIG_ROOT` injection, compiled CSS `url()` targets, and referenced assets on disk.

---

## 3. Preview & Verification

### `npm run preview`
Starts a local Vite preview server serving the compiled flattened `dist/` folder on port `4173`.
- **Purpose:** Testing the production build exactly as it will appear when hosted.

---

## 4. Summary Table

| Command | Tool | Purpose | Output Folder |
| :--- | :--- | :--- | :--- |
| `npm run dev` | Vite 8 | Rapid development with HMR & route rewrites (`localhost:3000`) | N/A (In-memory) |
| `npm run build` | Vite 8 + Node ESM + Sharp | Full flattened production build, Sharp images & verification | `dist/` |
| `npm run preview` | Vite 8 | Preview compiled flattened build (`localhost:4173`) | `dist/` |
| `npm run verify` | Node (`verify-dist.js`) | Audit 109 HTML files, relative links & CSS/image assets | N/A |
| `npm run fix-links` | Node (`replace-links.js`) | Re-run idempotent path & classic script normalization on `dist/` | `dist/` |

---

## 5. Deployment to GitHub Pages

Automated deployment runs via `.github/workflows/deploy.yml` on every push to `main`:
1. **CI Build:** Runs `npm ci && npm run build` (producing verified flat `./dist`).
2. **Pages Publish:** Publishes `./dist` cleanly to the `gh-pages` branch (`keep_files: false`, `force_orphan: true`) and uploads the GitHub Pages Actions artifact (developer Markdown guides live in `docs/`).

---

## 6. Troubleshooting the Build

-   **Missing Images:** Ensure your images are in `app/src/images/`. `tasks/build/optimize-images.js` handles raster optimization and copies static `.svg`/`.gif`/`.ico` assets cleanly into `dist/assets/`.
-   **Link Errors:** Run `npm run verify` to inspect any broken HTML/CSS/asset paths, and check `tasks/utils/replace-links.js` or `tasks/build/vite-plugins.js`.
-   **Vendor Packages:** Third-party NPM packages are bundled directly by Vite 8 (Rolldown `manualChunks` in `vite.config.js`).
