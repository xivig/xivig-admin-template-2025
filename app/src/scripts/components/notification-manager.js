/**
 * Notification Manager - Handles selection logic
 */
export const initNotificationSelect = () => {
    const selectAllEl = document.querySelector('#select-all-notifications');
    const container = document.querySelector('.notification-list'); // Container of notifications

    if (!selectAllEl || !container) return;

    // 1. SELECT ALL LOGIC
    selectAllEl.addEventListener('change', (e) => {
        const isChecked = e.target.checked;
        const checkboxes = container.querySelectorAll('.notification-item .form-check-input');

        checkboxes.forEach(cb => {
            cb.checked = isChecked;
            const row = cb.closest('.notification-item');
            if (row) {
                row.classList.toggle('bg-primary-subtle', isChecked);
            }
        });
    });

    // 2. INDIVIDUAL CHECKBOX LOGIC (Event Delegation)
    container.addEventListener('change', (e) => {
        if (e.target.classList.contains('form-check-input')) {
            const row = e.target.closest('.notification-item');
            if (row) {
                row.classList.toggle('bg-primary-subtle', e.target.checked);
            }

            // Sync Select All checkbox
            const allChecked = Array.from(container.querySelectorAll('.notification-item .form-check-input'))
                .every(cb => cb.checked);
            
            selectAllEl.checked = allChecked;
            // Handle intermediate state (optional but elite)
            const someChecked = Array.from(container.querySelectorAll('.notification-item .form-check-input'))
                .some(cb => cb.checked);
            selectAllEl.indeterminate = someChecked && !allChecked;
        }
    });
};