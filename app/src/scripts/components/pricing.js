/**
 * Pricing Toggle Module
 * Handles switching between monthly and annual billing with smooth transitions
 * Optimized for Xivig Architect OS
 */
export const initPricingToggle = () => {
    const prices = {
        monthly: [0, 29, 99],
        annual: [0, 22, 79]
    };

    // Use querySelector for more flexible selection if IDs change
    const priceElements = {
        starter: document.getElementById('price-starter'),
        pro: document.getElementById('price-pro'),
        enterprise: document.getElementById('price-enterprise')
    };

    const toggleBtns = document.querySelectorAll('.pricing-toggle-btn');

    // Safety: Ensure we have buttons and at least the Pro price element
    if (!toggleBtns.length || !priceElements.pro) return;

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Prevent redundant clicks on already active button
            if (this.classList.contains('active')) return;

            const type = this.getAttribute('data-type'); // 'monthly' or 'annual'

            // 1. Update Button UI
            toggleBtns.forEach(b => {
                b.classList.remove('active', 'btn-primary');
                b.classList.add('btn-outline-primary');
            });
            this.classList.replace('btn-outline-primary', 'btn-primary');
            this.classList.add('active');

            // 2. Animate Out
            Object.values(priceElements).forEach(el => {
                if (el) {
                    el.style.transform = 'translateY(-8px)';
                    el.style.opacity = '0';
                    el.style.transition = 'all 0.2s ease-in';
                }
            });

            // 3. Swap Values & Animate In
            setTimeout(() => {
                // Update text only if element exists
                if (priceElements.starter) priceElements.starter.innerText = prices[type][0];
                if (priceElements.pro) priceElements.pro.innerText = prices[type][1];
                if (priceElements.enterprise) priceElements.enterprise.innerText = prices[type][2];

                Object.values(priceElements).forEach(el => {
                    if (el) {
                        el.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'; // Slight bounce
                        el.style.transform = 'translateY(0)';
                        el.style.opacity = '1';
                    }
                });
            }, 200);
        });
    });
};