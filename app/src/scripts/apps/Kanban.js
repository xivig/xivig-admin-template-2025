// Import the core Sortable logic
import Sortable from 'sortablejs';

/**
 * Xivig Kanban Module
 * Using SortableJS for Elite drag-and-drop performance
 */
export const initKanban = () => {
    const columns = ['todo', 'inprogress', 'review', 'completed'];

    columns.forEach(columnId => {
        const el = document.getElementById(columnId);
        if (!el) return;

        new Sortable(el, {
            group: 'kanban', // Allows moving between columns
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',

            // Triggered when an item is dropped
            onEnd: (evt) => {
                const itemEl = evt.item;
                const targetColumn = evt.to.id;

                console.log(`Task moved to ${targetColumn}`);

                // Elite UI Touch: Update card border color based on column
                updateCardVisuals(itemEl, targetColumn);
            }
        });
    });
};

const updateCardVisuals = (card, columnId) => {
    // Remove existing border classes
    card.classList.remove('border-primary', 'border-info', 'border-warning', 'border-success', 'opacity-75');

    const body = card.querySelector('.card-body');
    body.classList.remove('text-decoration-line-through');

    switch (columnId) {
        case 'todo':
            card.classList.add('border-primary');
            break;
        case 'inprogress':
            card.classList.add('border-info');
            break;
        case 'review':
            card.classList.add('border-warning');
            break;
        case 'completed':
            card.classList.add('border-success', 'opacity-75');
            body.classList.add('text-decoration-line-through');
            break;
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initKanban);