import fs from 'fs';
import path from 'path';

const dir = './app/'; // 👈 Updated path
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const skipFiles = [
    'xivig.html', 'login.html', 'register.html', 'lockscreen.html', 'two-factor-authentication.html',
    '400.html', '403.html', '404.html', '500.html', '503.html', 'forgot-password.html', 'reset-password.html'
];

files.forEach(file => {
    if (skipFiles.includes(file)) return;

    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    
    // 1. Extract Title from existing header
    const titleMatch = content.match(/<h2 class="page-header__title h4 text-primary fw-bold mb-1">(.*?)<\/h2>/);
    const pageTitle = titleMatch ? titleMatch[1] : 'Dashboard';

    // 2. Extract Parent Category (if exists in breadcrumbs)
    let parentTitle = '';
    const breadcrumbRegex = /<li class="breadcrumb__item">\s*<a href="#" class="breadcrumb__link">(.*?)<\/a>\s*<\/li>/;
    const parentMatch = content.match(breadcrumbRegex);
    if (parentMatch && !parentMatch[1].includes('Home')) {
        parentTitle = parentMatch[1];
    }

    // 3. Extract Core Content
    // We want everything between the standardized page-header DIV and the footer partial
    const headerEndMarker = '</div>'; // End of the page-header div
    const contentStartIdx = content.indexOf(headerEndMarker) + headerEndMarker.length;
    const contentEndIdx = content.indexOf('{{> footer }}');

    if (contentStartIdx > headerEndMarker.length && contentEndIdx > contentStartIdx) {
        let coreContent = content.substring(contentStartIdx, contentEndIdx).trim();
        
        // Remove closing </main> and container/row divs that are now in the master layout
        // The master layout handles: <main> -> .main__container -> .page-header
        // So we only need the content that was AFTER the header div inside the container
        
        // Clean up the ending of coreContent (remove the trailing </div>s and </main>)
        coreContent = coreContent.replace(/<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/main>/, '');
        coreContent = coreContent.replace(/<\/div>\s*<\/div>\s*<\/div>\s*<\/main>/, '');
        coreContent = coreContent.replace(/<\/div>\s*<\/div>\s*<\/main>/, '');
        coreContent = coreContent.replace(/<\/main>/, '');

        const newFileContent = `{{#> admin-layout title="${pageTitle}"${parentTitle ? ` parentTitle="${parentTitle}"` : ''} }}

${coreContent}

{{/admin-layout}}`;

        fs.writeFileSync(path.join(dir, file), newFileContent);
        console.log(`Refactored ${file} to use Master Layout`);
    }
});
