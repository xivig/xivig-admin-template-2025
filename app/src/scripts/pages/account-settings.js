/**
 * Account Settings Module
 */
export const initAccountSettings = () => {
    const accountSettingsContainer = document.querySelector('.account-settings');
    if (!accountSettingsContainer) return;

    const navLinks = accountSettingsContainer.querySelectorAll('.nav-link');
    const headerTitle = document.querySelector('.page-header__title'); // Standard template title

    navLinks.forEach(link => {
        link.addEventListener('shown.bs.tab', (e) => {
            if (headerTitle) {
                headerTitle.innerText = `Account Settings - ${e.target.innerText}`;
            }
        });
    });
};
