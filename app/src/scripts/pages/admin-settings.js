import Sortable from 'sortablejs';
import NotificationService from '../components/sweet-alert.js';

/**
 * Admin Settings Module - Enhanced Elite Version
 * Handles dynamic sidebar management, submenus, and branding.
 */
export const initAdminSettings = async () => {
    const sortableContainer = document.getElementById('sortable-sidebar');
    if (!sortableContainer) return;

    // --- 1. DATA INITIALIZATION ---
    let sidebarData = JSON.parse(localStorage.getItem('xivig_sidebar_config'));
    let currentEditingSubmenu = [];

    const renderNestedSubmenus = (container, items) => {
        container.innerHTML = '';
        items.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'nested-item border-start border-2 border-primary ps-3 my-3';
            const hasSubmenu = item.submenu && item.submenu.length > 0;

            div.innerHTML = `
                <div class="d-flex gap-2 mb-2 align-items-center">
                    <input type="text" class="form-control form-control-sm rounded-3 sub-label" value="${item.label}" placeholder="Sub-item Label">
                    <input type="text" class="form-control form-control-sm rounded-3 sub-path" value="${item.path}" placeholder="Path">
                    <button type="button" class="btn btn-sm btn-outline-danger border-0 remove-sub" data-index="${index}"><i class="bi bi-x-lg"></i></button>
                </div>
                <div class="form-check form-switch mb-2">
                    <input class="form-check-input has-nested-submenu" type="checkbox" ${hasSubmenu ? 'checked' : ''}>
                    <label class="form-check-label small">Has Nested Submenu?</label>
                </div>
                <div class="nested-submenu-container ps-3 ${hasSubmenu ? '' : 'd-none'}">
                    <!-- Nested items go here -->
                </div>
                <button type="button" class="btn btn-sm btn-outline-primary rounded-pill px-3 mt-2 add-nested-submenu-item ${hasSubmenu ? '' : 'd-none'}">
                    <i class="bi bi-plus-lg me-1"></i> Add Level 2 Item
                </button>
            `;
            container.appendChild(div);

            if (hasSubmenu) {
                const nestedContainer = div.querySelector('.nested-submenu-container');
                renderNestedSubmenus(nestedContainer, item.submenu);
            }
        });
    };

    // This function will now just kick off the recursive render
    const renderSubmenuItems = () => {
        const topLevelContainer = document.getElementById('submenu-list');
        if (topLevelContainer) {
            renderNestedSubmenus(topLevelContainer, currentEditingSubmenu);
        }
    };

    // --- 2. CORE RENDERING ---
    const renderLivePreview = () => {
        const preview = document.getElementById('sidebar-live-preview');
        if (!preview) return;

        let html = `
            <div class="sidebar-mini shadow-lg" style="width: 100%; height: 100%; background: var(--elite-dark); color: #fff; border-radius: 12px; font-size: 0.75rem;">
                <div class="p-3 border-bottom border-white border-opacity-10 d-flex align-items-center gap-2">
                    <img src="${localStorage.getItem('xivig_logo') || `${window.XIVIG_ROOT || '/'}images/logo.png`}" style="width: 20px;">
                    <span class="fw-bold text-white small">${JSON.parse(localStorage.getItem('xivig_branding'))?.title || 'XivigApp'}</span>
                </div>
                <div class="p-2">
                    ${sidebarData.map(item => `
                        <div class="d-flex align-items-center gap-2 p-2 mb-1 rounded" style="background: rgba(255,255,255,0.05);">
                            <i class="${item.icon}" style="color: var(--elite-primary);"></i>
                            <span>${item.label}</span>
                            ${item.hasSubmenu ? '<i class="bi bi-chevron-down ms-auto x-small"></i>' : ''}
                        </div>
                        ${item.hasSubmenu ? `
                            <div class="ps-4 mb-2 opacity-50">
                                ${item.submenu?.map(sub => `<div class="py-1 border-start border-white border-opacity-10 ps-2 mb-1">${sub.label}</div>`).join('')}
                            </div>
                        ` : ''}
                    `).join('')}
                    <div class="d-flex align-items-center gap-2 p-2 mt-4 rounded text-danger">
                        <i class="bi bi-box-arrow-right"></i>
                        <span>Logout</span>
                    </div>
                </div>
            </div>
        `;
        preview.innerHTML = html;
    };

    const renderItems = () => {
        sortableContainer.innerHTML = '';
        sidebarData.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item p-3 d-flex align-items-center justify-content-between';
            li.dataset.id = item.id;
            li.innerHTML = `
                <div class="d-flex align-items-center">
                    <div class="handle me-3"><i class="bi bi-grip-vertical fs-5"></i></div>
                    <div class="icon-box me-3 bg-primary-soft p-2 rounded text-primary">
                        <i class="${item.icon}"></i>
                    </div>
                    <div>
                        <h6 class="mb-0 fw-bold text-dark">${item.label}</h6>
                        <small class="text-muted">${item.path} ${item.hasSubmenu ? `(${item.submenu?.length || 0} sub-items)` : ''}</small>
                    </div>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-light rounded-circle edit-item" data-index="${index}"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-light rounded-circle text-danger delete-item" data-index="${index}"><i class="bi bi-trash"></i></button>
                </div>
            `;
            sortableContainer.appendChild(li);
        });

        // Initialize Sortable
        new Sortable(sortableContainer, {
            handle: '.handle',
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            onEnd: function (evt) {
                const movedItem = sidebarData.splice(evt.oldIndex, 1)[0];
                sidebarData.splice(evt.newIndex, 0, movedItem);
                saveData(true);
                renderLivePreview(); // Update preview on sort
            }
        });

        renderLivePreview(); // Always update preview
    };

    const saveData = (silent = false) => {
        localStorage.setItem('xivig_sidebar_config', JSON.stringify(sidebarData));
        
        // Custom event to tell the sidebar to re-render if it exists in the same session
        window.dispatchEvent(new Event('sidebarUpdated'));

        if (!silent) {
            NotificationService.success('Config Saved', 'Sidebar changes applied globally.');
        }
    };

    // --- 3. ASYNC INIT ---
    if (!sidebarData) {
        try {
            const root = window.XIVIG_ROOT || '/';
            const response = await fetch(`${root}data/sidebar-config.json`);
            sidebarData = await response.json();
            localStorage.setItem('xivig_sidebar_config', JSON.stringify(sidebarData));
            renderItems();
        } catch (err) {
            console.error('❌ Failed to load sidebar-config.json', err);
            sidebarData = [];
            renderItems();
        }
    } else {
        renderItems();
    }

    // --- 4. EVENT LISTENERS ---

    // Form Handling
    const menuForm = document.getElementById('menu-item-form');
    const modal = document.getElementById('addMenuModal');
    const bsModal = modal ? new bootstrap.Modal(modal) : null;

    const buildNestedSubmenuData = (container) => {
        const items = [];
        const itemElements = container.querySelectorAll(':scope > .nested-item');

        itemElements.forEach(el => {
            const label = el.querySelector('.sub-label').value;
            const path = el.querySelector('.sub-path').value;
            const hasNested = el.querySelector('.has-nested-submenu').checked;
            const nestedContainer = el.querySelector('.nested-submenu-container');

            if (label && path) {
                const newItemData = { label, path };
                if (hasNested && nestedContainer) {
                    newItemData.hasSubmenu = true;
                    newItemData.submenu = buildNestedSubmenuData(nestedContainer);
                } else {
                    newItemData.hasSubmenu = false;
                    newItemData.submenu = null;
                }
                items.push(newItemData);
            }
        });
        return items;
    };

    menuForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const editIndex = parseInt(document.getElementById('edit-index').value);
        const label = document.getElementById('item-label').value;
        const icon = document.getElementById('item-icon').value;
        const path = document.getElementById('item-path').value;
        const hasSubmenu = document.getElementById('item-has-dropdown').checked;

        const newItem = {
            id: editIndex === -1 ? Date.now() : sidebarData[editIndex].id,
            label, icon, path, hasSubmenu,
            submenu: null
        };
        
        if (hasSubmenu) {
            const topLevelContainer = document.getElementById('submenu-list');
            newItem.submenu = buildNestedSubmenuData(topLevelContainer);
        }

        if (editIndex === -1) {
            sidebarData.push(newItem);
        } else {
            sidebarData[editIndex] = newItem;
        }

        saveData();
        renderItems();
        bsModal?.hide();
    });

    // Delegated event listener for the whole submenu form
    document.getElementById('submenu-list')?.addEventListener('click', (e) => {
        // Handle removing an item
        if (e.target.closest('.remove-sub')) {
            e.target.closest('.nested-item')?.remove();
            return;
        }

        // Handle adding a nested item
        if (e.target.closest('.add-nested-submenu-item')) {
            const container = e.target.closest('.nested-item').querySelector('.nested-submenu-container');
            if (container) {
                const newItem = document.createElement('div');
                newItem.className = 'nested-item border-start border-2 border-primary ps-3 my-3';
                newItem.innerHTML = `
                    <div class="d-flex gap-2 mb-2 align-items-center">
                        <input type="text" class="form-control form-control-sm rounded-3 sub-label" value="" placeholder="Sub-item Label">
                        <input type="text" class="form-control form-control-sm rounded-3 sub-path" value="" placeholder="Path">
                        <button type="button" class="btn btn-sm btn-outline-danger border-0 remove-sub"><i class="bi bi-x-lg"></i></button>
                    </div>
                    <div class="form-check form-switch mb-2">
                        <input class="form-check-input has-nested-submenu" type="checkbox">
                        <label class="form-check-label small">Has Nested Submenu?</label>
                    </div>
                    <div class="nested-submenu-container ps-3 d-none"></div>
                    <button type="button" class="btn btn-sm btn-outline-primary rounded-pill px-3 mt-2 add-nested-submenu-item d-none">
                        <i class="bi bi-plus-lg me-1"></i> Add Level 2 Item
                    </button>
                `;
                container.appendChild(newItem);
            }
            return;
        }
    });

    document.getElementById('submenu-list')?.addEventListener('change', (e) => {
        // Handle toggling the "Has Nested Submenu" checkbox
        if (e.target.classList.contains('has-nested-submenu')) {
            const container = e.target.closest('.nested-item');
            if (container) {
                container.querySelector('.nested-submenu-container')?.classList.toggle('d-none', !e.target.checked);
                container.querySelector('.add-nested-submenu-item')?.classList.toggle('d-none', !e.target.checked);
            }
        }
    });

    // Add top-level submenu item
    document.getElementById('add-submenu-item')?.addEventListener('click', () => {
        const topLevelContainer = document.getElementById('submenu-list');
        if(!topLevelContainer) return;
        
        const newItem = document.createElement('div');
        newItem.className = 'nested-item border-start border-2 border-primary ps-3 my-3';
        newItem.innerHTML = `
            <div class="d-flex gap-2 mb-2 align-items-center">
                <input type="text" class="form-control form-control-sm rounded-3 sub-label" value="" placeholder="Sub-item Label">
                <input type="text" class="form-control form-control-sm rounded-3 sub-path" value="" placeholder="Path">
                <button type="button" class="btn btn-sm btn-outline-danger border-0 remove-sub"><i class="bi bi-x-lg"></i></button>
            </div>
            <div class="form-check form-switch mb-2">
                <input class="form-check-input has-nested-submenu" type="checkbox">
                <label class="form-check-label small">Has Nested Submenu?</label>
            </div>
            <div class="nested-submenu-container ps-3 d-none"></div>
            <button type="button" class="btn btn-sm btn-outline-primary rounded-pill px-3 mt-2 add-nested-submenu-item d-none">
                <i class="bi bi-plus-lg me-1"></i> Add Level 2 Item
            </button>
        `;
        topLevelContainer.appendChild(newItem);
    });

    // Edit/Delete Main Items
    sortableContainer.addEventListener('click', (e) => {
        const delBtn = e.target.closest('.delete-item');
        const editBtn = e.target.closest('.edit-item');

        if (delBtn) {
            const index = parseInt(delBtn.dataset.index);
            NotificationService.confirm('Delete Item?', `Are you sure you want to remove "${sidebarData[index].label}"?`)
                .then(res => {
                    if (res.isConfirmed) {
                        sidebarData.splice(index, 1);
                        saveData();
                        renderItems();
                    }
                });
        }

        if (editBtn) {
            const index = parseInt(editBtn.dataset.index);
            const item = sidebarData[index];
            document.getElementById('edit-index').value = index;
            document.getElementById('item-label').value = item.label;
            document.getElementById('item-icon').value = item.icon;
            document.getElementById('item-path').value = item.path;
            document.getElementById('item-has-dropdown').checked = item.hasSubmenu;
            
            currentEditingSubmenu = item.submenu ? [...item.submenu] : [];
            document.getElementById('submenu-container').classList.toggle('d-none', !item.hasSubmenu);
            renderSubmenuItems();
            
            document.getElementById('menuModalLabel').innerText = 'Edit Menu Item';
            bsModal?.show();
        }
    });

    // RESET Modal on Add
    document.querySelector('[data-bs-target="#addMenuModal"]')?.addEventListener('click', () => {
        document.getElementById('edit-index').value = "-1";
        menuForm.reset();
        currentEditingSubmenu = [];
        document.getElementById('submenu-container').classList.add('d-none');
        document.getElementById('menuModalLabel').innerText = 'Add Menu Item';
    });

    // --- 5. BRANDING & EXTRAS ---
    
    // Branding Form
    const brandingForm = document.getElementById('branding-form');
    brandingForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('sidebar-title-input').value;
        const accent = document.getElementById('accent-color').value;
        localStorage.setItem('xivig_branding', JSON.stringify({ title, accent }));
        
        // Notify sidebar
        window.dispatchEvent(new Event('brandingUpdated'));
        NotificationService.success('Branding Updated', 'Look and feel synchronized.');
    });

    // Export Action
    document.getElementById('export-config')?.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
            sidebar: sidebarData,
            branding: JSON.parse(localStorage.getItem('xivig_branding')) || {},
            logo: localStorage.getItem('xivig_logo')
        }, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", "xivig_elite_config.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });

    // Import Action
    const importTrigger = document.getElementById('import-trigger');
    const importInput = document.getElementById('import-config');
    
    importTrigger?.addEventListener('click', () => importInput.click());
    importInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (re) => {
            try {
                const config = JSON.parse(re.target.result);
                let importedSidebar = null;

                // Handle wrapped format vs raw array
                if (Array.isArray(config)) {
                    importedSidebar = config;
                } else if (config.sidebar && Array.isArray(config.sidebar)) {
                    importedSidebar = config.sidebar;
                    if (config.branding) localStorage.setItem('xivig_branding', JSON.stringify(config.branding));
                    if (config.logo) localStorage.setItem('xivig_logo', config.logo);
                }

                if (importedSidebar) {
                    sidebarData = importedSidebar;
                    localStorage.setItem('xivig_sidebar_config', JSON.stringify(sidebarData));
                    
                    // Immediate UI update
                    renderItems();
                    window.dispatchEvent(new Event('sidebarUpdated'));
                    window.dispatchEvent(new Event('brandingUpdated'));

                    NotificationService.success('Import Success', 'Dashboard configuration restored.');
                } else {
                    throw new Error('Invalid format');
                }
                
                e.target.value = '';
                setTimeout(() => window.location.reload(), 1500);
            } catch (err) {
                console.error('❌ Import Error:', err);
                NotificationService.error('Import Failed', 'Invalid JSON configuration file.');
                e.target.value = '';
            }
        };
        reader.readAsText(file);
    });

    // Reset All
    document.getElementById('reset-settings')?.addEventListener('click', () => {
        NotificationService.confirm('Factory Reset?', 'Revert everything to system defaults?')
            .then(res => {
                if (res.isConfirmed) {
                    localStorage.clear();
                    window.location.reload();
                }
            });
    });
};
