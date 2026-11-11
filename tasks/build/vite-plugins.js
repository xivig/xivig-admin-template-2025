import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { build as viteBuild } from 'vite';
import { fixLinks } from '../utils/replace-links.js';
import { optimizeProjectImages } from './optimize-images.js';

function collectFiles(dir, ext = '.html', results = []) {
    if (!fs.existsSync(dir)) return results;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            collectFiles(fullPath, ext, results);
        } else if (entry.name.endsWith(ext)) {
            results.push(fullPath);
        }
    }
    return results;
}

/**
 * Strips styles during classic IIFE secondary compilation because CSS is already
 * extracted cleanly by the primary Vite HTML build.
 */
function stubStylesPlugin() {
    return {
        name: 'xivig-stub-styles',
        enforce: 'pre',
        resolveId(source) {
            if (/\.(css|scss|sass)(\?.*)?$/i.test(source)) {
                return `\0stub-css:${source}`;
            }
        },
        load(id) {
            if (id.startsWith('\0stub-css:')) return '';
        },
    };
}

/**
 * Generates lightweight CORS-free classic script wrappers under dist/data/*.js
 * so icons and sidebar configuration load cleanly even when opened via file://.
 */
async function buildClassicDataScripts(resolvedOutDir) {
    const dataDir = path.join(resolvedOutDir, 'data');
    if (!fs.existsSync(dataDir)) return;

    const bsJsonPath = path.join(dataDir, 'bootstrap-icons.json');
    if (fs.existsSync(bsJsonPath)) {
        const raw = JSON.parse(await fsp.readFile(bsJsonPath, 'utf8'));
        const keys = Object.keys(raw);
        await fsp.writeFile(
            path.join(dataDir, 'bootstrap-icons.js'),
            `window.XIVIG_BS_ICONS=${JSON.stringify(keys)};`,
            'utf8'
        );
    }

    const faJsonPath = path.join(dataDir, 'fa-icons.json');
    if (fs.existsSync(faJsonPath)) {
        const raw = JSON.parse(await fsp.readFile(faJsonPath, 'utf8'));
        const pairs = [];
        for (const name of Object.keys(raw)) {
            const icon = raw[name];
            if (icon?.svgs?.classic) {
                for (const style of Object.keys(icon.svgs.classic)) {
                    const prefix = style === 'brands' ? 'fa-brands' : (style === 'solid' ? 'fa-solid' : 'fa-regular');
                    pairs.push([name, prefix]);
                }
            }
        }
        await fsp.writeFile(
            path.join(dataDir, 'fa-icons.js'),
            `window.XIVIG_FA_ICONS=${JSON.stringify(pairs)};`,
            'utf8'
        );
    }

    const sidebarJsonPath = path.join(dataDir, 'sidebar-config.json');
    if (fs.existsSync(sidebarJsonPath)) {
        const raw = await fsp.readFile(sidebarJsonPath, 'utf8');
        await fsp.writeFile(
            path.join(dataDir, 'sidebar-config.js'),
            `window.XIVIG_SIDEBAR_CONFIG=${raw.trim()};`,
            'utf8'
        );
    }
}

/**
 * Compiles main/home/auth entry points into self-contained classic IIFE bundles
 * so every page works cleanly on BOTH HTTP(S) AND CORS-restricted file:// URLs.
 */
async function buildClassicEntryBundles(baseDir, assetsDir) {
    const bundles = [
        { entry: 'app/src/main.js', name: 'XivigMain', out: 'main.bundle.js' },
        { entry: 'app/src/home.js', name: 'XivigHome', out: 'home.bundle.js' },
        { entry: 'app/src/auth.js', name: 'XivigAuth', out: 'auth.bundle.js' },
    ];

    for (const bundle of bundles) {
        await viteBuild({
            configFile: false,
            root: baseDir,
            base: './',
            logLevel: 'silent',
            plugins: [stubStylesPlugin()],
            resolve: {
                alias: {
                    '~bootstrap': path.resolve(baseDir, 'node_modules/bootstrap'),
                    '@': path.resolve(baseDir, 'app/src'),
                },
            },
            build: {
                outDir: assetsDir,
                assetsDir: '',
                emptyOutDir: false,
                copyPublicDir: false,
                minify: true,
                rolldownOptions: {
                    checks: { pluginTimings: false },
                    input: path.resolve(baseDir, bundle.entry),
                    output: {
                        format: 'iife',
                        name: bundle.name,
                        entryFileNames: bundle.out,
                    },
                },
            },
        });
    }

    // Convert compiled inline page module scripts (dist/assets/pages/**/*.js) into classic IIFEs
    const pagesAssetsDir = path.join(assetsDir, 'pages');
    for (const jsFile of collectFiles(pagesAssetsDir, '.js')) {
        let code = await fsp.readFile(jsFile, 'utf8');
        if (code.startsWith('/* classic-iife */')) continue;

        code = code.replace(/import\s*\{([^}]+)\}\s*from\s*["'][^"']*config\.js["'];?/g, (_, bindings) => {
            return bindings
                .split(',')
                .map((part) => {
                    const m = part.trim().match(/^(\S+)\s+as\s+(\S+)$/);
                    const localVar = m ? m[2] : part.trim();
                    return `var ${localVar}=window.XIVIG_CONFIG;`;
                })
                .join('');
        });

        code = code.replace(/import\s*\{([^}]+)\}\s*from\s*["'][^"']*main\.js["'];?/g, (_, bindings) => {
            return bindings
                .split(',')
                .map((part) => {
                    const m = part.trim().match(/^(\S+)\s+as\s+(\S+)$/);
                    const localVar = m ? m[2] : part.trim();
                    return `var ${localVar}=window.EditorModule;`;
                })
                .join('');
        });

        code = code.replace(/import\s*["'][^"']+["'];?/g, '');
        code = `/* classic-iife */\n(function(){${code}})();\n`;
        await fsp.writeFile(jsFile, code, 'utf8');
    }

    // Remove legacy ES module split chunks now superseded by *.bundle.js
    const leftoverChunkPrefixes = [
        'mobile-controller.js',
        'rolldown-runtime.js',
        'maintenance.js',
        'config.js',
        'main.js',
        'home.js',
        'auth.js',
    ];
    for (const file of await fsp.readdir(assetsDir)) {
        if (leftoverChunkPrefixes.includes(file) || /^vendor-.*\.js$/.test(file)) {
            await fsp.rm(path.join(assetsDir, file), { force: true });
        }
    }
}

/**
 * Vite dev middleware resolving root `/page.html`, `/pages/.../page.html`, and `/app/pages/.../page.html`
 * cleanly so navigation works identically across Vite Dev Server and flattened production builds.
 */
export function xivigDevRewritePlugin(baseDir) {
    const pageRouteMap = new Map();
    const pagesRoot = path.join(baseDir, 'app', 'pages');

    for (const absFile of collectFiles(pagesRoot, '.html')) {
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

                if (rawPath.startsWith('/src/images/')) {
                    req.url = `/app${rawPath}${q}`;
                    return next();
                }

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
 * Native Vite production finalizer (zero Gulp dependency):
 * 1. Optimizes JPG/PNG (+WebP) & copies SVG/GIF/ICO from app/src/images -> dist/assets/ via Sharp
 * 2. Compiles classic IIFE JS bundles (`main.bundle.js`, `home.bundle.js`, `auth.bundle.js`) + page scripts
 * 3. Atomically flattens dist/app/pages/**\/*.html -> dist/*.html and removes dist/app/
 * 4. Runs idempotent relative link normalization, strips crossorigin for file:// CORS safety, and injects single XIVIG_ROOT
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
            const srcImagesDir = path.resolve(baseDir, 'app/src/images');
            const destAssetsDir = path.join(resolvedOutDir, 'assets');

            // 1. Optimize & copy all source images
            await optimizeProjectImages(srcImagesDir, destAssetsDir);

            // 2. Emit standalone CORS-free classic JS bundles & fallback data scripts
            await buildClassicEntryBundles(baseDir, destAssetsDir);
            await buildClassicDataScripts(resolvedOutDir);

            // 3. Flatten dist/app/pages/**/*.html -> dist/*.html atomically
            const appPagesDir = path.join(resolvedOutDir, 'app', 'pages');
            if (fs.existsSync(appPagesDir)) {
                const nestedHtmls = collectFiles(appPagesDir, '.html');
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

            // 4. Normalize relative paths, strip crossorigin, wire classic scripts & single XIVIG_ROOT
            fixLinks(resolvedOutDir);
        }
    };
}
