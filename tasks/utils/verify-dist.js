import fs from 'fs';
import path from 'path';

const EXTERNAL_RE = /^(https?:|mailto:|tel:|javascript:|#|%23|data:|about:|blob:|\$\{|\/\/)/i;

function getHtmlFiles(dir, list = []) {
    if (!fs.existsSync(dir)) return list;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) getHtmlFiles(full, list);
        else if (entry.name.endsWith('.html')) list.push(full);
    }
    return list;
}

/**
 * Verifies a flattened static output directory (`dist` or `docs`) has zero broken links,
 * zero nested page folders, zero missing local assets, and single idempotent XIVIG_ROOT injection.
 */
export function verifyBuildOutput(targetDir = './dist', options = {}) {
    const absDir = path.resolve(targetDir);
    const { expectedHtmlCount = 109 } = options;

    if (!fs.existsSync(absDir)) {
        throw new Error(`Build directory missing: ${absDir}`);
    }

    const errors = [];

    // 1. Must be completely flattened (no nested dist/app or dist/pages)
    if (fs.existsSync(path.join(absDir, 'app'))) {
        errors.push(`${targetDir}/app still exists — HTML flattening failed.`);
    }
    if (fs.existsSync(path.join(absDir, 'pages'))) {
        errors.push(`${targetDir}/pages still exists — output is not flattened.`);
    }

    // 2. Essential static assets and metadata
    const requiredFiles = [
        '.nojekyll',
        'index.html',
        'assets/github.svg',
        'assets/gulp.png',
        'assets/login-page-img.png',
        'assets/register-page-img.png',
        'assets/forgot-password.png',
        'images/logo.png',
        'data/bootstrap-icons.json',
        'data/fa-icons.json',
        'data/sidebar-config.json',
    ];

    for (const rel of requiredFiles) {
        if (!fs.existsSync(path.join(absDir, rel))) {
            errors.push(`Missing required output file: ${targetDir}/${rel}`);
        }
    }

    // 3. Scan every HTML file
    const allHtml = getHtmlFiles(absDir);
    const rootHtml = fs.readdirSync(absDir).filter((f) => f.endsWith('.html'));

    if (allHtml.length !== rootHtml.length) {
        errors.push(`Found ${allHtml.length - rootHtml.length} non-root HTML files in ${targetDir}.`);
    }
    if (expectedHtmlCount && rootHtml.length !== expectedHtmlCount) {
        errors.push(`Expected ${expectedHtmlCount} flat HTML files in ${targetDir}, found ${rootHtml.length}.`);
    }

    for (const htmlFile of allHtml) {
        const relHtml = path.relative(absDir, htmlFile);
        const content = fs.readFileSync(htmlFile, 'utf8');

        // Single XIVIG_ROOT check
        const rootMatches = content.match(/window\.XIVIG_ROOT\s*=/g) || [];
        if (rootMatches.length !== 1) {
            errors.push(`${relHtml}: expected exactly 1 window.XIVIG_ROOT declaration, found ${rootMatches.length}`);
        }

        // Check attribute links
        const attrRe = /(?:^|[\s<])(?:href|src|action|poster)=["']([^"']+)["']/gi;
        let match;
        while ((match = attrRe.exec(content))) {
            const rawUrl = match[1].trim();
            if (!rawUrl || EXTERNAL_RE.test(rawUrl)) continue;

            // Exception: documentation demo action="/upload" inside image-dropzone.html form demo
            if (rawUrl === '/upload') continue;

            const cleanPath = rawUrl.split('?')[0].split('#')[0];
            if (!cleanPath) continue;

            if (cleanPath.startsWith('/')) {
                errors.push(`${relHtml}: unportable root-relative URL "${rawUrl}"`);
                continue;
            }

            const resolved = path.resolve(path.dirname(htmlFile), cleanPath);
            if (!resolved.startsWith(absDir) || !fs.existsSync(resolved)) {
                errors.push(`${relHtml}: broken local reference "${rawUrl}" -> ${path.relative(absDir, resolved)}`);
            }
        }

        // Check CSS url(...) in HTML
        const urlRe = /url\((['"]?)([^)'"]+)\1\)/gi;
        while ((match = urlRe.exec(content))) {
            const rawUrl = match[2].trim();
            if (!rawUrl || EXTERNAL_RE.test(rawUrl)) continue;
            const cleanPath = rawUrl.split('?')[0].split('#')[0];
            if (cleanPath.startsWith('/')) {
                errors.push(`${relHtml}: unportable CSS url() "${rawUrl}"`);
                continue;
            }
            const resolved = path.resolve(path.dirname(htmlFile), cleanPath);
            if (!resolved.startsWith(absDir) || !fs.existsSync(resolved)) {
                errors.push(`${relHtml}: broken CSS url() "${rawUrl}"`);
            }
        }
    }

    // 4. Verify CSS url() references inside compiled stylesheets
    const assetsDir = path.join(absDir, 'assets');
    if (fs.existsSync(assetsDir)) {
        const cssFiles = fs.readdirSync(assetsDir).filter((f) => f.endsWith('.css'));
        for (const cssFile of cssFiles) {
            const cssText = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');
            const cssUrlRe = /url\((['"]?)([^)'"]+)\1\)/gi;
            let cssMatch;
            while ((cssMatch = cssUrlRe.exec(cssText))) {
                const rawCssUrl = cssMatch[2].trim();
                if (!rawCssUrl || EXTERNAL_RE.test(rawCssUrl)) continue;
                const cleanCssPath = rawCssUrl.split('?')[0].split('#')[0];
                const resolvedCss = path.resolve(assetsDir, cleanCssPath);
                if (!resolvedCss.startsWith(absDir) || !fs.existsSync(resolvedCss)) {
                    errors.push(`assets/${cssFile}: broken CSS url() "${rawCssUrl}"`);
                }
            }
        }
    }

    if (errors.length > 0) {
        const preview = errors.slice(0, 25).join('\n  - ');
        throw new Error(`Build verification failed for ${targetDir} (${errors.length} issue(s)):\n  - ${preview}`);
    }

    console.log(`✅ Verified ${targetDir}: ${rootHtml.length} flat HTML files, 0 broken links, 0 missing assets.`);
    return { htmlCount: rootHtml.length };
}

const isMain = process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('tasks/utils/verify-dist.js');
if (isMain) {
    const args = process.argv.slice(2);
    const targets = args.length > 0 ? args : ['./dist'];
    for (const target of targets) {
        verifyBuildOutput(target);
    }
}
