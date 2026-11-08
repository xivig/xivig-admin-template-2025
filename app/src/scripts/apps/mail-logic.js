/**
 * Xivig Mail Client Logic
 * Handles bulk selection and row highlighting
 */
export const initMailSelection = () => {
    const selectAllBox = document.getElementById('selectAll');
    const mailCheckboxes = document.querySelectorAll('.mail-item .form-check-input');
    const mailRows = document.querySelectorAll('.mail-item');

    if (!selectAllBox) return;

    // 1. Master Toggle Logic
    selectAllBox.addEventListener('change', function () {
        const isChecked = this.checked;

        mailCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
            // Update row background for Elite visual feedback
            updateRowState(checkbox);
        });
    });

    // 2. Individual Checkbox Logic
    mailCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            updateRowState(checkbox);
            updateMasterCheckbox();
        });

        // Elite Touch: Clicking the row (but not a link) toggles the checkbox
        const row = checkbox.closest('.mail-item');
        row.addEventListener('click', (e) => {
            if (e.target.tagName !== 'A' && e.target.tagName !== 'INPUT' && !e.target.classList.contains('bi-star')) {
                checkbox.checked = !checkbox.checked;
                updateRowState(checkbox);
                updateMasterCheckbox();
            }
        });
    });

    // --- Helpers ---

    function updateRowState(cb) {
        const row = cb.closest('.mail-item');
        if (cb.checked) {
            row.classList.add('is-selected');
        } else {
            row.classList.remove('is-selected');
        }
    }

    function updateMasterCheckbox() {
        const total = mailCheckboxes.length;
        const checkedCount = document.querySelectorAll('.mail-item .form-check-input:checked').length;

        selectAllBox.checked = (total === checkedCount);
        // Add indeterminate state if some but not all are selected
        selectAllBox.indeterminate = (checkedCount > 0 && checkedCount < total);
    }
};