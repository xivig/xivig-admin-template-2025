import fs from 'fs';
import path from 'path';

const SKIP_URI_RE = /^(https?:|mailto:|tel:|javascript:|#|%23|data:|about:|blob:|\$\{|\/\/)/i;

function getHtmlFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            getHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

function normalizeUrlValue(rawValue, rootPrefix) {
    if (!rawValue) return rawValue;
    const value = rawValue.trim();
    if (!value || SKIP_URI_RE.test(value)) return rawValue;

    const match = value.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);
    const pathname = match ? match[1] : value;
    const suffix = `${match?.[2] || ''}${match?.[3] || ''}`;

    if (!pathname) return rawValue;

    // 1. Source image directories -> assets/<rest>
    if (
        pathname.startsWith('/app/src/images/') ||
        pathname.startsWith('app/src/images/') ||
        /^(\.\.\/)+(?:app\/)?src\/images\//.test(pathname) ||
        pathname.startsWith('/src/images/')
    ) {
        const rest = pathname.replace(/^(?:(?:\.\.\/)+|\/)?(?:app\/)?src\/images\//, '');
        return `${rootPrefix}assets/${rest}${suffix}`;
    }

    // 2. Public images / data / compiled assets
    if (/^(?:(?:\.\.\/)+|\/)images\//.test(pathname)) {
        const rest = pathname.replace(/^(?:(?:\.\.\/)+|\/)images\//, '');
        return `${rootPrefix}images/${rest}${suffix}`;
    }
    if (/^(?:(?:\.\.\/)+|\/)data\//.test(pathname)) {
        const rest = pathname.replace(/^(?:(?:\.\.\/)+|\/)data\//, '');
        return `${rootPrefix}data/${rest}${suffix}`;
    }
    if (/^(?:(?:\.\.\/)+|\.\/|\/)assets\//.test(pathname)) {
        const rest = pathname.replace(/^(?:(?:\.\.\/)+|\.\/|\/)assets\//, '');
        return `${rootPrefix}assets/${rest}${suffix}`;
    }

    // 3. HTML pages -> flat <name>.html
    if (pathname === '/') {
        return `${rootPrefix}index.html${suffix}`;
    }
    if (pathname.endsWith('.html')) {
        if (
            pathname.startsWith('/app/pages/') ||
            pathname.startsWith('app/pages/') ||
            pathname.startsWith('/pages/') ||
            pathname.startsWith('pages/') ||
            pathname.startsWith('/') ||
            pathname.startsWith('../') ||
            pathname.startsWith('./') ||
            !pathname.includes('/')
        ) {
            const basename = path.posix.basename(pathname.replace(/\\/g, '/'));
            return `${rootPrefix}${basename}${suffix}`;
        }
    }

    return rawValue;
}

/**
 * Normalizes paths, converts module tags to classic deferred CORS-free scripts/links,
 * and injects idempotent window.XIVIG_ROOT across all built HTML files.
 */
export function fixLinks(folder = './dist') {
    const absFolder = path.resolve(folder);
    if (!fs.existsSync(absFolder)) {
        console.log(`⚠️ Folder ${folder} does not exist, skipping link replacement.`);
        return 0;
    }

    const htmlFiles = getHtmlFiles(absFolder);
    let updatedCount = 0;

    for (const file of htmlFiles) {
        let content = fs.readFileSync(file, 'utf8');
        const relDir = path.relative(absFolder, path.dirname(file));
        const depth = relDir === '' ? 0 : relDir.split(path.sep).length;
        const rootPrefix = depth === 0 ? './' : '../'.repeat(depth);

        // 1. Idempotent XIVIG_ROOT injection
        const rootScriptRe = /[ \t]*<script>\s*window\.XIVIG_ROOT\s*=\s*["'][^"']*["'];?\s*<\/script>\s*/g;
        content = content.replace(rootScriptRe, '');
        const rootInjection = `<script>window.XIVIG_ROOT = "${rootPrefix}";</script>`;
        content = content.replace(/<head([^>]*)>/i, `<head$1>\n    ${rootInjection}`);

        // 2. Normalize HTML attributes (before script tag rewriting)
        content = content.replace(
            /(^|[\s<])(href|src|action|data-src|poster)=("([^"]*)"|'([^']*)')/gi,
            (full, prefix, attr, quoted, dblVal, sglVal) => {
                const quoteChar = quoted[0];
                const origVal = dblVal !== undefined ? dblVal : sglVal;
                const normalized = normalizeUrlValue(origVal, rootPrefix);
                return `${prefix}${attr}=${quoteChar}${normalized}${quoteChar}`;
            }
        );

        // 3. Normalize inline CSS url(...)
        content = content.replace(/url\((['"]?)([^)'"]+)\1\)/gi, (full, q, innerUrl) => {
            const normalized = normalizeUrlValue(innerUrl, rootPrefix);
            return `url(${q}${normalized}${q})`;
        });

        // 4. Strip crossorigin from local stylesheet links (prevents file:// CORS blocking) & remove modulepreloads
        content = content.replace(
            /<link\b([^>]*\brel=["']stylesheet["'][^>]*)\s+crossorigin(?:=["'][^"']*["'])?([^>]*)>/gi,
            '<link$1$2>'
        );
        content = content.replace(/\s*<link\b[^>]*\brel=["']modulepreload["'][^>]*>\r?\n?/gi, '');

        // 5. Convert Vite module script chunks to classic <script defer> bundles (works over file:// & HTTP)
        let entryBundle = null;
        if (/\b(?:src|href)=["'][^"']*assets\/(?:home(?:\.bundle)?\.js|home\.css)["']/i.test(content)) {
            entryBundle = 'home.bundle.js';
        } else if (/\b(?:src|href)=["'][^"']*assets\/(?:auth(?:\.bundle)?\.js|auth\.css)["']/i.test(content)) {
            entryBundle = 'auth.bundle.js';
        } else {
            entryBundle = 'main.bundle.js';
        }

        const pageScriptPaths = [];
        content = content.replace(
            /[ \t]*<script\b[^>]*\btype=["']module["'][^>]*\bsrc=["']([^"']*assets\/[^"']+)["'][^>]*>\s*<\/script>\r?\n?/gi,
            (match, srcVal) => {
                if (srcVal.includes('assets/pages/')) {
                    const normalizedPageSrc = normalizeUrlValue(srcVal, rootPrefix);
                    pageScriptPaths.push(normalizedPageSrc);
                }
                return '';
            }
        );

        // Remove any prior deferred bundle tags if fixLinks is re-run, then re-insert cleanly before </head>
        content = content.replace(
            /[ \t]*<script\s+defer\s+src=["'][^"']*assets\/(?:(?:main|home|auth)\.bundle|pages\/[^"']+)\.js["']>\s*<\/script>\r?\n?/gi,
            ''
        );

        const scriptTags = [
            `  <script defer src="${rootPrefix}assets/${entryBundle}"></script>`,
            ...pageScriptPaths.map((p) => `  <script defer src="${p}"></script>`),
        ].join('\n');

        content = content.replace(/<\/head>/i, `${scriptTags}\n</head>`);

        fs.writeFileSync(file, content, 'utf8');
        updatedCount++;
    }

    console.log(`✅ Normalized relative paths & classic assets in ${updatedCount} HTML files (${folder}).`);
    return updatedCount;
}

const isMain = process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('tasks/utils/replace-links.js');
if (isMain) {
    const args = process.argv.slice(2);
    const targets = args.length > 0 ? args : ['./dist'];
    for (const target of targets) {
        fixLinks(target);
    }
}
