import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { fixLinks } from '../utils/replace-links.js';
import { optimizeProjectImages } from './optimize-images.js';

function collectHtmlFiles(dir, results = []) {
    if (!fs.existsSync(dir)) return results;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            collectHtmlFiles(fullPath, results);
        } else if (entry.name.endsWith('.html')) {
            results.push(fullPath);
        }
    }
    return results;
}

/**
 * Vite dev middleware resolving root `/page.html`, `/pages/.../page.html`, and `/app/pages/.../page.html`
 * cleanly so navigation works identically across Vite Dev Server and flattened production builds.
 */
export function xivigDevRewritePlugin(baseDir) {
    const pageRouteMap = new Map();
    const pagesRoot = path.join(baseDir, 'app', 'pages');

    for (const absFile of collectHtmlFiles(pagesRoot)) {
        const relFromRoot = '/' + path.relative(baseDir, absFile).replace(/\\/g, '/');
        const relFromPages = '/' + path.relative(pagesRoot, absFile).replace(/\\/g, '/');
        const basename = '/' + path.basename(absFile);

        pageRouteMap.set(basename, relFromRoot);
        pageRouteMap.set('/pages' + relFromPages, relFromRoot);
        pageRouteMap.set(relFromRoot, relFromRoot);
    }

    return {
        name: 'xivig-dev-rewrite',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (!req.url) return next();
                const [rawPath, query] = req.url.split('?');
                const q = query ? `?${query}` : '';

                // Resolve legacy /src/images/* references cleanly during dev
                if (rawPath.startsWith('/src/images/')) {
                    req.url = `/app${rawPath}${q}`;
                    return next();
                }

                // Resolve /pages/**, /<name>.html, or /<subdir>/<name>.html to /app/pages/**
                if (rawPath.endsWith('.html') && rawPath !== '/index.html') {
                    if (pageRouteMap.has(rawPath)) {
                        req.url = `${pageRouteMap.get(rawPath)}${q}`;
                    } else {
                        const baseKey = '/' + path.posix.basename(rawPath);
                        if (pageRouteMap.has(baseKey)) {
                            req.url = `${pageRouteMap.get(baseKey)}${q}`;
                        }
                    }
                }
                next();
            });
        }
    };
}

/**
 * Native Vite production finalizer (eliminates Gulp build pipeline dependency):
 * 1. Optimizes JPG/PNG (+WebP) & copies SVG/GIF/ICO from app/src/images -> dist/assets/ via Sharp
 * 2. Atomically flattens dist/app/pages/**\/*.html -> dist/*.html and removes dist/app/
 * 3. Runs idempotent relative link & single window.XIVIG_ROOT normalization
 */
export function xivigFlatDistPlugin(baseDir) {
    let resolvedOutDir = path.resolve(baseDir, 'dist');

    return {
        name: 'xivig-flat-dist',
        apply: 'build',
        configResolved(config) {
            resolvedOutDir = path.resolve(config.root, config.build.outDir || 'dist');
        },
        async closeBundle() {
            // 1. Optimize & sync source images (PNG, JPG, WebP + SVG, GIF, ICO) into dist/assets/
            const srcImagesDir = path.resolve(baseDir, 'app/src/images');
            const destAssetsDir = path.join(resolvedOutDir, 'assets');
            await optimizeProjectImages(srcImagesDir, destAssetsDir);

            // 2. Flatten dist/app/pages/**/*.html -> dist/*.html atomically
            const appPagesDir = path.join(resolvedOutDir, 'app', 'pages');
            if (fs.existsSync(appPagesDir)) {
                const nestedHtmls = collectHtmlFiles(appPagesDir);
                const seenNames = new Set(['index.html']);

                for (const srcHtml of nestedHtmls) {
                    const name = path.basename(srcHtml);
                    if (seenNames.has(name)) {
                        throw new Error(`Duplicate HTML basename detected during flatten: ${name} (${srcHtml})`);
                    }
                    seenNames.add(name);
                    await fsp.copyFile(srcHtml, path.join(resolvedOutDir, name));
                }

                await fsp.rm(path.join(resolvedOutDir, 'app'), { recursive: true, force: true });
            }

            // 3. Normalize paths & inject idempotent window.XIVIG_ROOT
            fixLinks(resolvedOutDir);
        }
    };
}
