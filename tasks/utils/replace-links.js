import fs from "fs";
import path from "path";

/**
 * Recursively walk through a directory
 */
function walk(dir, callback) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(file => {
        const filepath = path.join(dir, file);
        const stat = fs.statSync(filepath);

        if (stat.isDirectory()) {
            walk(filepath, callback);
        } else if (filepath.endsWith(".html") || filepath.endsWith(".css") || filepath.endsWith(".js") || filepath.endsWith(".json")) {
            callback(filepath);
        }
    });
}

/**
 * Fixes absolute links and strips 'app/' prefix for docs/dist compatibility.
 * Replaces leading slashes with relative path prefixes.
 * @param {string} folder Root folder to process (e.g. './dist')
 */
export function fixLinks(folder) {
    const rootDir = path.resolve(folder);
    console.log(`🛠️ Refining links in: ${folder}`);

    walk(folder, file => {
        let content = fs.readFileSync(file, "utf8");
        const relativePathToRoot = path.relative(path.dirname(file), rootDir);
        const prefix = relativePathToRoot ? relativePathToRoot.replace(/\\/g, '/') + '/' : './';

        // 1. Inject Root Path for JS
        if (file.endsWith(".html")) {
            const rootScript = `<script>window.XIVIG_ROOT = "${prefix}";</script>`;
            if (content.includes("<head>")) {
                content = content.replace("<head>", `<head>\n    ${rootScript}`);
            } else {
                content = rootScript + "\n" + content;
            }
        }

        // 2. Handle HTML attributes (href, src, data-src, etc.)
        // Case A: Starting with / (e.g. href="/app/...")
        const attrSlashRegex = /(href|src|data-src|poster)=(['"])\/([^'"]*)(['"])/g;
        content = content.replace(attrSlashRegex, (match, attr, q1, p1, q2) => {
            if (p1.startsWith('http') || p1.startsWith('//') || p1.startsWith('data:') || p1.startsWith('tel:') || p1.startsWith('mailto:') || p1.startsWith('#')) {
                return match;
            }
            let target = p1;
            if (target.startsWith('app/')) target = target.substring(4);
            target = target.replace(/^src\/images\//, 'assets/');
            if (target === '' || target === '/') target = 'index.html';
            return `${attr}=${q1}${prefix}${target}${q2}`;
        });

        // Case B: Starting with app/ (e.g. href="app/...")
        const attrAppRegex = /(href|src|data-src|poster)=(['"])app\/([^'"]*)(['"])/g;
        content = content.replace(attrAppRegex, (match, attr, q1, p1, q2) => {
            let target = p1;
            target = target.replace(/^src\/images\//, 'assets/');
            return `${attr}=${q1}${prefix}${target}${q2}`;
        });


        // 2. Handle JSON paths (e.g. "path": "/app/pages/...")
        const jsonPathRegex = /(['"])(path|src|url|image|icon)\1\s*:\s*(['"])\/([^'"]*)\3/g;
        content = content.replace(jsonPathRegex, (match, q1, key, q2, p1) => {
             if (p1.startsWith('http') || p1.startsWith('//') || p1.startsWith('data:')) {
                return match;
            }
            let target = p1;
            if (target.startsWith('app/')) target = target.substring(4);
            target = target.replace(/^src\/images\//, 'assets/');
            if (target === '' || target === '/') target = 'index.html';
            return `"${key}": ${q2}${prefix}${target}${q2}`;
        });

        // 3. Handle CSS url() patterns (common in style tags or CSS files)
        const urlRegex = /url\((['"]?)\/([^)]*)\1\)/g;
        content = content.replace(urlRegex, (match, q, p1) => {
            if (p1.startsWith('http') || p1.startsWith('//') || p1.startsWith('data:')) {
                return match;
            }
            
            let target = p1.replace(/^['"]|['"]$/g, '');
            if (target.startsWith('app/')) target = target.substring(4);
            target = target.replace(/^src\/images\//, 'assets/');
            
            return `url(${q}${prefix}${target}${q})`;
        });

        // 4. Final cleanup: Ensure no double slashes like .././
        content = content.replace(/\/\.\//g, '/');

        fs.writeFileSync(file, content, "utf8");
    });
    
    console.log(`✅ Links refined for ${folder}`);
}

// If running directly via 'node tasks/utils/replace-links.js'
const isMain = process.argv[1] && (process.argv[1].endsWith('replace-links.js') || process.argv[1].includes('replace-links.js'));
if (isMain) {
    fixLinks("./dist");
    fixLinks("./docs");
}
