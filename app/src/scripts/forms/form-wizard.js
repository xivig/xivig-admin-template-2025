import NotificationService from '../components/sweet-alert.js';

/**
 * Form Wizard Module - Vanilla JS
 */
export const initFormWizard = () => {
    const wizardForm = document.getElementById("wizard-form");
    if (!wizardForm) return;

    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("prev-btn");
    const submitBtn = document.getElementById("submit-btn");
    // Correct ID from wizard-progress-bar to wizard-progress
    const progressBar = document.getElementById("wizard-progress");
    const navCircles = document.querySelectorAll(".wizard-circle");
    const steps = document.querySelectorAll(".wizard-step");

    let currentStep = 0;
    const totalSteps = steps.length;

    /**
     * Validate current step fields
     */
    const validateStep = (stepIndex) => {
        const currentStepEl = steps[stepIndex];
        const inputs = currentStepEl.querySelectorAll('input, select, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (input.required && !input.value.trim()) {
                input.classList.add('is-invalid');
                isValid = false;
            } else {
                input.classList.remove('is-invalid');
            }
        });

        return isValid;
    };

    const updateUI = () => {
        // Update Progress Bar
        if (progressBar) {
            const progressPercent = (currentStep / (totalSteps - 1)) * 100;
            progressBar.style.width = `${progressPercent}%`;
            
            if (currentStep === totalSteps - 1) {
                progressBar.classList.add('bg-success');
                progressBar.classList.remove('bg-primary');
            } else {
                progressBar.classList.add('bg-primary');
                progressBar.classList.remove('bg-success');
            }
        }

        // Update Nav Circles
        navCircles.forEach((circle, index) => {
            const label = circle.nextElementSibling;
            
            // CLEAR ALL POTENTIAL CLASSES
            circle.classList.remove(
                "active", "done", "disabled", 
                "bg-primary", "text-white", "bg-white", "border-primary", 
                "bg-success", "border-success", "text-muted", "shadow-sm"
            );
            
            if (label) {
                label.classList.remove("text-primary", "text-dark", "text-muted", "text-success");
                label.classList.add("fw-bold");
            }

            if (index < currentStep) {
                // DONE STATE (Green with white check)
                circle.classList.add("done", "bg-success", "text-white", "border-success", "shadow-sm");
                circle.innerHTML = '<i class="bi bi-check-lg"></i>';
                if (label) label.classList.add("text-success");
            } else if (index === currentStep) {
                // ACTIVE STATE (Primary blue)
                circle.classList.add("active", "bg-primary", "text-white", "border-primary", "shadow-sm");
                circle.innerHTML = index + 1;
                if (label) label.classList.add("text-dark");
            } else {
                // DISABLED/FUTURE STATE (Grey/Muted)
                circle.classList.add("disabled", "bg-white", "text-muted", "border");
                circle.innerHTML = index + 1;
                if (label) label.classList.add("text-muted");
            }
        });

        // Toggle Step Visibility
        steps.forEach((step, index) => {
            step.classList.toggle("d-none", index !== currentStep);
            if (index === currentStep) {
                step.classList.add("animate__animated", "animate__fadeIn");
            }
        });

        // Toggle Buttons
        if (nextBtn) nextBtn.classList.toggle("d-none", currentStep === totalSteps - 1);
        if (submitBtn) submitBtn.classList.toggle("d-none", currentStep !== totalSteps - 1);
        if (prevBtn) {
            prevBtn.classList.toggle("d-none", currentStep === 0);
        }
    };

    nextBtn?.addEventListener("click", () => {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps - 1) {
                currentStep++;
                updateUI();
            }
        }
    });
    
    prevBtn?.addEventListener("click", () => {
        if (currentStep > 0) {
            currentStep--;
            updateUI();
        }
    });

    wizardForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            // Success State
            if (progressBar) {
                progressBar.style.width = "100%";
                progressBar.classList.replace('bg-primary', 'bg-success');
            }
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Submitted <i class="bi bi-check-circle-fill ms-2"></i>';
                submitBtn.classList.replace('btn-primary', 'btn-success');
            }

            // Final checkmark on the last circle
            const lastCircle = navCircles[totalSteps - 1];
            if (lastCircle) {
                lastCircle.classList.add("done", "bg-success", "text-white", "border-success");
                lastCircle.innerHTML = '<i class="bi bi-check-lg"></i>';
            }

            NotificationService.success('Application Sent!', 'Your data has been processed securely.');
            console.log("Form Wizard Submitted Successfully");
        }
    });

    // Initial setup
    updateUI();
};


