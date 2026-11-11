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

    // Separate query string and hash fragment safely
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

    // 2. Public images / data / plugins / compiled assets
    if (/^(?:(?:\.\.\/)+|\/)images\//.test(pathname)) {
        const rest = pathname.replace(/^(?:(?:\.\.\/)+|\/)images\//, '');
        return `${rootPrefix}images/${rest}${suffix}`;
    }
    if (/^(?:(?:\.\.\/)+|\/)data\//.test(pathname)) {
        const rest = pathname.replace(/^(?:(?:\.\.\/)+|\/)data\//, '');
        return `${rootPrefix}data/${rest}${suffix}`;
    }
    if (/^(?:(?:\.\.\/)+|\/)plugins\//.test(pathname)) {
        const rest = pathname.replace(/^(?:(?:\.\.\/)+|\/)plugins\//, '');
        return `${rootPrefix}plugins/${rest}${suffix}`;
    }
    if (/^(?:(?:\.\.\/)+|\.\/|\/)assets\//.test(pathname)) {
        const rest = pathname.replace(/^(?:(?:\.\.\/)+|\.\/|\/)assets\//, '');
        return `${rootPrefix}assets/${rest}${suffix}`;
    }

    // 3. HTML pages (root or nested under /app/pages/** or /pages/**) -> flat <name>.html
    if (pathname === '/') {
        return `${rootPrefix}index.html${suffix}`;
    }
    if (pathname.endsWith('.html')) {
        // Explicit app/pages or pages paths or relative parent html links flatten to basename
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
 * Normalizes paths and injects idempotent window.XIVIG_ROOT across all built HTML files.
 * @param {string} folder Target build directory (default "./dist")
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

        // Idempotent XIVIG_ROOT injection: strip any duplicate pre-existing inline XIVIG_ROOT tags first, then insert exactly once
        const rootScriptRe = /[ \t]*<script>\s*window\.XIVIG_ROOT\s*=\s*["'][^"']*["'];?\s*<\/script>\s*/g;
        const cleanedContent = content.replace(rootScriptRe, '');
        const rootInjection = `<script>window.XIVIG_ROOT = "${rootPrefix}";</script>`;

        content = cleanedContent.replace(/<head([^>]*)>/i, `<head$1>\n    ${rootInjection}`);

        // Normalize HTML attributes (word-boundary before attribute so data-action="..." is untouched!)
        content = content.replace(
            /(^|[\s<])(href|src|action|data-src|poster)=("([^"]*)"|'([^']*)')/gi,
            (full, prefix, attr, quoted, dblVal, sglVal) => {
                const quoteChar = quoted[0];
                const origVal = dblVal !== undefined ? dblVal : sglVal;
                const normalized = normalizeUrlValue(origVal, rootPrefix);
                return `${prefix}${attr}=${quoteChar}${normalized}${quoteChar}`;
            }
        );

        // Normalize inline CSS url(...) references inside HTML style attributes or <style> blocks
        content = content.replace(/url\((['"]?)([^)'"]+)\1\)/gi, (full, q, innerUrl) => {
            const normalized = normalizeUrlValue(innerUrl, rootPrefix);
            return `url(${q}${normalized}${q})`;
        });

        fs.writeFileSync(file, content, 'utf8');
        updatedCount++;
    }

    console.log(`✅ Normalized relative paths in ${updatedCount} HTML files (${folder}).`);
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
