/**
 * Store Settings Module
 */
export const initStoreSettings = () => {
    const container = document.querySelector('.store-settings');
    if (!container) return;

    // --- 1. CSV EXPORT ---
    window.exportStoreCSV = () => {
        const table = document.getElementById('shippingTable');
        if (!table) return;

        const rows = table.querySelectorAll("tr");
        let csv = [];
        for (let i = 0; i < rows.length; i++) {
            let row = [], cols = rows[i].querySelectorAll("td, th");
            for (let j = 0; j < cols.length - 1; j++) { // Skip the 'Manage' column
                row.push('"' + cols[j].innerText.trim().replace(/"/g, '""') + '"');
            }
            csv.push(row.join(","));
        }
        const blob = new Blob([csv.join("\n")], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'shipping_rates.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    // --- 2. SAVE CHANGES EMULATION ---
    window.saveStoreChanges = (btn) => {
        if (!btn) return;
        
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-arrow-repeat aria-hidden="true" class="spinner-border-sm me-2"></i> Saving...';
        btn.disabled = true;

        // Visual feedback using template conventions
        setTimeout(() => {
            btn.innerHTML = '<i class="bi bi-check-lg me-2"></i> Saved Successfully!';
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-success');

            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.classList.remove('btn-success');
                btn.classList.add('btn-primary');
                btn.disabled = false;
                
                // Trigger a global notification if service is available
                if (window.NotificationService) {
                    NotificationService.success('Update Complete', 'Store settings have been synchronized.');
                }
            }, 2000);
        }, 1500);
    };
};
