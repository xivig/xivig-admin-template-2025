/**
 * AJAX-based Icon Filtering for Bootstrap Icons
 * Searches through all 2000+ icons efficiently
 */
export const initIconFilter = async (inputId, containerId) => {
    const filterInput = document.getElementById(inputId);
    const container = document.getElementById(containerId);
    if (!filterInput || !container) return;

    let allIcons = [];

    // 1. Fetch the data (AJAX)
    console.log("📥 Fetching Bootstrap Icons data...");
    try {
        const paths = [
            '/data/bootstrap-icons.json',
            'data/bootstrap-icons.json',
            '../data/bootstrap-icons.json',
            '../../data/bootstrap-icons.json',
            '../../../data/bootstrap-icons.json',
            'public/data/bootstrap-icons.json'
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
            throw new Error(`Could not find bootstrap-icons.json in any of the attempted paths.`);
        }
        
        const data = await response.json();
        allIcons = Object.keys(data);
        console.log(`✅ Loaded ${allIcons.length} icons.`);
        
        if (allIcons.length === 0) {
            container.innerHTML = '<div class="col-12 text-center py-5"><p class="text-danger">No icons found in data file.</p></div>';
            return;
        }
    } catch (error) {
        console.error('❌ Failed to load Bootstrap icons:', error);
        container.innerHTML = `<div class="col-12 text-center py-5">
            <p class="text-danger">Failed to load icon library.</p>
            <small class="text-muted">${error.message}</small>
        </div>`;
        return;
    }

    // 2. Render helper
    const renderIcons = (list) => {
        // Limit rendering to 500 for performance, but search covers everything
        const displayList = list.slice(0, 500);
        
        container.innerHTML = displayList.map(name => `
            <div class="col-xl-3 col-md-4 col-sm-6 col-12 animate__animated animate__fadeIn icon-item">
                <div class="fa-hover">
                    <i class="bi bi-${name} fs-4 text-primary me-3"></i>
                    <span class="text-truncate small fw-bold">${name}</span>
                </div>
            </div>
        `).join('');

        // Re-attach copy listeners to new elements
        initIconCopy('.fa-hover');
    };

    // Initial render
    renderIcons(allIcons);

    // 3. Search Logic
    filterInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filtered = allIcons.filter(name => name.includes(query));
        renderIcons(filtered);
    });
};

/**
 * Clipboard & UI Notification logic
 */
export const initIconCopy = (itemSelector) => {
    const iconItems = document.querySelectorAll(itemSelector);

    iconItems.forEach(item => {
        // Remove old listeners to avoid duplicates
        const newItem = item.cloneNode(true);
        item.parentNode.replaceChild(newItem, item);

        newItem.addEventListener('click', async (e) => {
            e.preventDefault();

            const iconElement = newItem.querySelector('i');
            const iconName = newItem.querySelector('span') ?.innerText || "Icon";
            const htmlString = iconElement.outerHTML;

            try {
                await navigator.clipboard.writeText(htmlString);
                showToast(iconName);
            } catch (err) {
                console.error('Failed to copy!', err);
            }
        });
    });
};

function showToast(name) {
    let toast = document.querySelector('.xivig-copy-toast');
    if (toast) toast.remove();

    toast = document.createElement('div');
    toast.className = 'xivig-copy-toast fixed-bottom mb-4 mx-auto bg-dark text-white p-2 px-4 rounded-pill shadow-lg text-center animate__animated animate__fadeInUp';
    toast.style.width = 'fit-content';
    toast.style.zIndex = '9999';
    toast.innerHTML = `<i class="bi bi-check2-circle text-primary me-2"></i> Copied: <code>${name}</code>`;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.replace('animate__fadeInUp', 'animate__fadeOutDown');
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}
