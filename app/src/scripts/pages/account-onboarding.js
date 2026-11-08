/**
 * Multi-step Account Onboarding Module
 */
export const initAccountOnboarding = () => {
    const container = document.querySelector('.onboarding-module');
    if (!container) return;

    const tabs = container.querySelectorAll('.tab-item');
    const panes = container.querySelectorAll('.tab-pane-step');
    const progressBar = container.querySelector('.progress-bar-elite');
    const progressText = container.querySelector('#progressPercent');
    const nextBtns = container.querySelectorAll('[data-action="next"]');
    const prevBtns = container.querySelectorAll('[data-action="prev"]');

    let currentStep = 1;
    const totalSteps = tabs.length;

    const updateUI = () => {
        // Update Tabs
        tabs.forEach(tab => {
            const step = parseInt(tab.dataset.step);
            tab.classList.toggle('active', step === currentStep);
        });

        // Update Panes
        panes.forEach(pane => {
            const step = parseInt(pane.dataset.step);
            pane.classList.toggle('active', step === currentStep);
        });

        // Update Progress
        const percent = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
        }
        if (progressText) {
            progressText.innerText = `${percent}%`;
        }

        // Special handling for summary step
        if (currentStep === 4) {
            updateSummary();
        }
    };

    const updateSummary = () => {
        const fields = {
            'username': 's-username',
            'email': 's-email',
            'firstName': 's-name-first',
            'lastName': 's-name-last',
            'org': 's-org',
            'location': 's-location',
            'phone': 's-phone',
            'birthday': 's-bday',
            'cardName': 's-card-name',
            'cardNumber': 's-card-num'
        };

        Object.entries(fields).forEach(([inputId, summaryId]) => {
            const input = document.getElementById(inputId);
            const summary = document.getElementById(summaryId);
            if (input && summary) {
                if (inputId === 'cardNumber') {
                    const val = input.value.trim();
                    summary.innerText = val ? `**** **** **** ${val.slice(-4)}` : 'N/A';
                } else if (inputId === 'firstName' || inputId === 'lastName') {
                    // Handled specially if you want a single name line
                } else {
                    summary.innerText = input.value || 'N/A';
                }
            }
        });

        // Combined Name
        const fName = document.getElementById('firstName')?.value || '';
        const lName = document.getElementById('lastName')?.value || '';
        const sName = document.getElementById('s-name');
        if (sName) sName.innerText = `${fName} ${lName}`.trim() || 'N/A';
    };

    // Navigation Events
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep < totalSteps) {
                currentStep++;
                updateUI();
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateUI();
            }
        });
    });

    // Tab Clicks
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            currentStep = parseInt(tab.dataset.step);
            updateUI();
        });
    });

    // Specific Action Buttons
    const skipBtn = document.getElementById('skipToBilling');
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            currentStep = 2;
            updateUI();
        });
    }

    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn && window.NotificationService) {
        submitBtn.addEventListener('click', () => {
            window.NotificationService.confirm('Complete Onboarding?', 'Your account settings will be applied immediately.')
                .then(res => {
                    if (res.isConfirmed) {
                        window.NotificationService.loader('Finalizing...', 'Synchronizing data with Xivig Cloud', () => {
                            return new Promise(resolve => setTimeout(resolve, 2000));
                        }).then(() => {
                            window.NotificationService.success('Success!', 'Account setup is complete.');
                        });
                    }
                });
        });
    }

    // Initial State
    updateUI();
};
