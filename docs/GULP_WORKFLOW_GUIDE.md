# Build Customization & Legacy Gulp Shim Guide

Starting with the Vite 8 architecture upgrade, primary development, Sharp image optimization, HTML flattening, link normalization, and verification run **natively inside Vite 8 & Node ESM** (`tasks/build/` and `tasks/utils/`) without needing heavy Gulp streams.

## 1. Modern Extension Points (`tasks/build/`)

- **`tasks/build/vite-plugins.js`**: Houses `xivigDevRewritePlugin` (dev server route matching) and `xivigFlatDistPlugin` (`closeBundle` image optimization, flat `dist/*.html` output, and `replace-links.js` normalization).
- **`tasks/build/optimize-images.js`**: Pure Node + Sharp worker pool optimizing `.jpg`/`.png` (+ `.webp`) and copying `.svg`/`.gif`/`.ico`.
- **`tasks/utils/verify-dist.js`**: Post-build verification gate run automatically by `npm run build` and `npm run verify`.

## 2. Optional Gulp 5 Compatibility Shim (`gulpfile.js`)

`gulpfile.js` is preserved as a minimal compatibility entrypoint delegating cleanly to Vite 8 and Node ESM:

```javascript
import fs from 'fs/promises';
import gulp from 'gulp';
import { build as viteBuildApi, createServer } from 'vite';
import { verifyBuildOutput } from './tasks/utils/verify-dist.js';

export const clean = () => fs.rm('dist', { recursive: true, force: true });
export const dev = async () => {
    const server = await createServer();
    await server.listen();
    server.printUrls();
};
export const viteBuild = async () => viteBuildApi();
export const verify = async () => verifyBuildOutput('./dist');

export const build = gulp.series(clean, viteBuild, verify);
export default build;
```

## 3. Adding Custom Build Steps

Prefer adding lightweight async functions inside `tasks/build/vite-plugins.js` (`closeBundle`) or npm scripts invoking ESM helpers under `tasks/utils/` so builds stay fast and Gulp-independent.
