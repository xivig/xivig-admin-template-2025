/**
 * AJAX-based Icon Filtering for FontAwesome
 * Searches through all 2000+ icons efficiently
 */
export const initIconApp = async () => {
    const searchInput = document.getElementById('iconFilterInput');
    const container = document.getElementById('iconContainer');

    if (!searchInput || !container) return;

    let allIcons = [];

    // 1. Fetch the data (AJAX)
    console.log("📥 Fetching FontAwesome Icons data...");
    try {
        const paths = [
            '/data/fa-icons.json',
            'data/fa-icons.json',
            '../data/fa-icons.json',
            '../../data/fa-icons.json',
            '../../../data/fa-icons.json',
            'public/data/fa-icons.json'
        ];

        let response;
        for (const path of paths) {
            try {
                const res = await fetch(path);
                const contentType = res.headers.get('content-type');
                if (res.ok && contentType && contentType.includes('application/json')) {
                    response = res;
                    console.log(`✅ Found data at: ${path}`);
                    break;
                }
            } catch (e) {
                // Continue to next path
            }
        }

        if (!response) {
            throw new Error(`Could not find fa-icons.json in any of the attempted paths.`);
        }
        
        const data = await response.json();
        
        // Flatten the data into a list of style+name pairs
        Object.keys(data).forEach(name => {
            const icon = data[name];
            if (icon.svgs && icon.svgs.classic) {
                Object.keys(icon.svgs.classic).forEach(style => {
                    const prefix = style === 'brands' ? 'fa-brands' : (style === 'solid' ? 'fa-solid' : 'fa-regular');
                    allIcons.push({ name, prefix });
                });
            }
        });

        console.log(`✅ Loaded ${allIcons.length} FontAwesome icons.`);

        if (allIcons.length === 0) {
            container.innerHTML = '<div class="col-12 text-center py-5"><p class="text-danger">No icons found in data file.</p></div>';
            return;
        }
    } catch (error) {
        console.error('❌ Failed to load FontAwesome icons:', error);
        container.innerHTML = `<div class="col-12 text-center py-5">
            <p class="text-danger">Failed to load icon library.</p>
            <small class="text-muted">${error.message}</small>
        </div>`;
        return;
    }

    // 2. Render helper
    const renderIcons = (list) => {
        const displayList = list.slice(0, 500);
        
        container.innerHTML = `
            <div class="card-box pd-20 mb-30 shadow-sm border-0 bg-transparent">
                <div class="row fontawesome-icon-list g-3">
                    ${displayList.map(icon => `
                        <div class="col-xl-3 col-lg-4 col-md-6 icon-item animate__animated animate__fadeIn" data-name="${icon.name}">
                            <div class="fa-hover border rounded-3 p-3 transition-all d-flex align-items-center" title="Click to copy">
                                <div class="icon-preview me-3 shadow-sm rounded p-2 text-primary text-center" style="width: 45px;">
                                    <i class="${icon.prefix} fa-${icon.name} fs-4"></i>
                                </div>
                                <span class="icon-class text-muted small fw-bold text-truncate">${icon.prefix} fa-${icon.name}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>`;

        // Attach copy listeners
        const iconItems = container.querySelectorAll('.icon-item');
        iconItems.forEach(item => {
            item.addEventListener('click', () => {
                const iconClass = item.querySelector('.icon-class').textContent;
                const preview = item.querySelector('.fa-hover');
                copyToClipboard(`<i class="${iconClass}"></i>`, preview);
            });
        });
    };

    const copyToClipboard = (text, element) => {
        navigator.clipboard.writeText(text).then(() => {
            const originalHTML = element.innerHTML;
            element.innerHTML = `<span class="text-white small fw-bold w-100 text-center">Copied!</span>`;
            setTimeout(() => {
                element.innerHTML = originalHTML;
            }, 1000);
        });
    };

    // Initial render
    renderIcons(allIcons);

    // 3. Search Logic
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filtered = allIcons.filter(icon => icon.name.includes(query));
        renderIcons(filtered);
    });
};
