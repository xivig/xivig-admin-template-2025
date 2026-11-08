/**
 * Help & Support Module
 */
export const initHelpSupport = () => {
    const container = document.querySelector('.help-support-module');
    if (!container) return;

    const menuLinks = container.querySelectorAll('.menu-link');
    const faqTitle = container.querySelector('.faq-title');
    const faqDescription = container.querySelector('.faq-description');
    const accordionContainer = document.getElementById('faqAccordion');

    const contentMap = {
        'payment': {
            title: 'Payment Solutions',
            desc: 'Everything you need to know about managing your transactions and billing history.',
            faqs: [
                { q: "When will I be charged for my purchase?", a: "Standard protocol involves a temporary authorization hold at the moment of checkout, but the final charge is typically finalized once the order is dispatched." },
                { q: "Which payment methods are accepted?", a: "We support Visa, Mastercard, AMEX, and PayPal. Digital wallets like Apple Pay and Google Pay are also integrated." },
                { q: "Is my financial data encrypted?", a: "Security is our priority. All transactions are processed through a PCI-DSS Level 1 compliant gateway using 256-bit SSL encryption." }
            ]
        },
        'shipping': {
            title: 'Shipping Logistics',
            desc: 'Track your deliveries and understand our global distribution network.',
            faqs: [
                { q: "How long does standard shipping take?", a: "Domestic orders typically arrive within 3-5 business days. International shipping can take 7-14 business days depending on the region." },
                { q: "Do you offer express delivery?", a: "Yes, we offer overnight and 2-day express shipping options for most metropolitan areas." },
                { q: "How can I track my order?", a: "Once your order ships, you will receive an email with a tracking number and a link to our logistics portal." }
            ]
        },
        'returns': {
            title: 'Returns & Refunds',
            desc: 'Hassle-free returns and automated refund processing protocols.',
            faqs: [
                { q: "What is your return policy?", a: "We offer a 30-day window for returns on all unused items in their original packaging." },
                { q: "How do I start a return?", a: "Navigate to your Order History and click the 'Return Item' button next to the relevant order." },
                { q: "When will I receive my refund?", a: "Refunds are processed within 48 hours of receiving the returned item at our warehouse." }
            ]
        },
        'fulfillment': {
            title: 'Order Fulfillment',
            desc: 'Insight into how we process, pack, and ship your premium orders.',
            faqs: [
                { q: "Where are orders shipped from?", a: "We operate from three major fulfillment centers: San Francisco, London, and Tokyo." },
                { q: "Can I change my shipping address?", a: "Address changes can be made within 2 hours of placing an order via the dashboard." }
            ]
        },
        'privacy': {
            title: 'Privacy & Terms',
            desc: 'Our commitment to data security and the legal framework of our services.',
            faqs: [
                { q: "How is my data used?", a: "Your data is strictly used to improve your user experience and facilitate transactions. We never sell data to third parties." },
                { q: "Where can I read the full terms?", a: "Our full Terms of Service are available at elitepro.com/legal/terms." }
            ]
        }
    };

    const renderFaqs = (faqs) => {
        if (!accordionContainer) return;
        accordionContainer.innerHTML = faqs.map((faq, index) => `
            <div class="accordion-item shadow-sm animate__animated animate__fadeInUp" style="animation-delay: ${index * 0.1}s">
                <h2 class="accordion-header">
                    <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#q${index}">
                        ${faq.q}
                    </button>
                </h2>
                <div id="q${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" data-bs-parent="#faqAccordion">
                    <div class="accordion-body">
                        ${faq.a}
                    </div>
                </div>
            </div>
        `).join('');
    };

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const type = link.dataset.type;
            if (!contentMap[type]) return;

            // Update Active State
            menuLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Update Header
            if (faqTitle) faqTitle.innerText = contentMap[type].title;
            if (faqDescription) faqDescription.innerText = contentMap[type].desc;

            // Update Accordion
            renderFaqs(contentMap[type].faqs);
        });
    });

    // --- Search & Ticket Functionality ---
    const searchBtn = container.querySelector('.header-search-box .btn-white');
    const searchInput = container.querySelector('.header-search-box input');
    const ticketBtn = container.querySelector('.btn-glass');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query && window.NotificationService) {
                window.NotificationService.loader('Searching...', `Looking for "${query}" in knowledge base`, () => {
                    return new Promise(resolve => setTimeout(resolve, 1500));
                }).then(() => {
                    window.NotificationService.success('Search Complete', `Found 12 articles related to "${query}"`);
                });
            }
        });
    }

    if (ticketBtn) {
        ticketBtn.addEventListener('click', () => {
            if (window.NotificationService) {
                window.NotificationService.confirm('Open Support Ticket?', 'Our team will respond within 2 hours.')
                    .then(res => {
                        if (res.isConfirmed) {
                            window.NotificationService.success('Ticket Created', 'Your support request #9928 has been logged.');
                        }
                    });
            }
        });
    }
};
