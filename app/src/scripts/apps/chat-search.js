/**
 * Xivig Chat Search Module
 * Implements real-time filtering for the contact sidebar
 */
export const initChatSearch = () => {
    const searchInput = document.querySelector('.chat__search input');
    const contacts = document.querySelectorAll('.chat__contact');

    // Safety check to prevent errors on pages without a chat sidebar
    if (!searchInput || !contacts.length) return;

    searchInput.addEventListener('keyup', (e) => {
        const term = e.target.value.toLowerCase().trim();

        contacts.forEach(contact => {
            const nameElement = contact.querySelector('h6');

            if (nameElement) {
                const name = nameElement.innerText.toLowerCase();

                // Elite UI: Use a 'd-none' toggle for Bootstrap compatibility
                if (name.includes(term)) {
                    contact.classList.remove('d-none');
                    // Add a tiny fade-in effect via CSS classes if desired
                    contact.style.animation = 'fadeIn 0.2s ease forwards';
                } else {
                    contact.classList.add('d-none');
                }
            }
        });
    });

    // Clear search on 'Escape' key
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            contacts.forEach(c => c.classList.remove('d-none'));
        }
    });
};