/**
 * Advanced Components Module
 * Handles Tags Input and Number Stepper functionality
 */

export const initAdvancedComponents = () => {
    initTags();
    initStepper();
};

/**
 * Tags Input Logic
 */
const initTags = () => {
    const container = document.getElementById('tags-container');
    const input = document.getElementById('tag-input');
    const hiddenInput = document.getElementById('hidden-tags');

    if (!container || !input || !hiddenInput) return;

    let tags = hiddenInput.value
        ? hiddenInput.value.split(',').map(t => t.trim()).filter(t => t !== "")
        : [];

    const renderTags = () => {
        container.querySelectorAll('.badge').forEach(t => t.remove());

        tags.forEach((tag, index) => {
            const tagEl = document.createElement('span');
            // Using bootstrap utility classes for consistent spacing and rounded-pill for 'Elite' look
            tagEl.className = 'badge bg-primary text-white d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill fw-medium border-0 shadow-sm transition-all';
            tagEl.style.fontSize = '0.8rem';
            tagEl.style.marginBottom = '4px';
            tagEl.style.marginTop = '4px';

            tagEl.innerHTML = `
                ${tag}
                <i class="bi bi-x-circle-fill btn-close-tag opacity-75" data-index="${index}" style="cursor: pointer; font-size: 0.9rem; transition: opacity 0.2s;"></i>
            `;
            container.insertBefore(tagEl, input);
        });
    };

    const addTag = (val) => {
        if (val && !tags.includes(val)) {
            tags.push(val);
            updateHiddenInput();
            renderTags();
        }
        input.value = '';
    };

    const removeTag = (index) => {
        tags.splice(index, 1);
        updateHiddenInput();
        renderTags();
    };

    const updateHiddenInput = () => {
        hiddenInput.value = tags.join(',');
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag(input.value.trim().replace(/,/g, ''));
        } else if (e.key === 'Backspace' && !input.value && tags.length > 0) {
            removeTag(tags.length - 1);
        }
    });

    container.addEventListener('click', (e) => {
        const closeBtn = e.target.closest('.btn-close-tag');
        if (closeBtn) {
            const index = parseInt(closeBtn.dataset.index);
            removeTag(index);
        }
    });

    renderTags();
};

/**
 * Number Stepper Logic
 */
const initStepper = () => {
    const plusBtn = document.getElementById('btn-plus');
    const minusBtn = document.getElementById('btn-minus');
    const input = document.getElementById('stepper-input');

    if (!plusBtn || !minusBtn || !input) return;

    const updateValue = (increment) => {
        let currentValue = parseInt(input.value) || 0;
        let newValue = increment ? currentValue + 1 : currentValue - 1;
        
        // Clamp between 0 and 100 as per common percentage needs or design
        if (newValue < 0) newValue = 0;
        if (newValue > 100) newValue = 100;

        input.value = newValue;
        input.dispatchEvent(new Event('change'));
    };

    plusBtn.addEventListener('click', () => updateValue(true));
    minusBtn.addEventListener('click', () => updateValue(false));
    
    // Also handle manual input validation
    input.addEventListener('blur', () => {
        let val = parseInt(input.value);
        if (isNaN(val) || val < 0) input.value = 0;
        if (val > 100) input.value = 100;
    });
};
