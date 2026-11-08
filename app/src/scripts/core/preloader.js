export function initPreloader() {
    const percentDisplay = document.getElementById("percent1");
    const progressBar = document.getElementById("bar1");
    const loader = document.querySelector(".preloader");

    if (!loader) return;

    const hideLoader = () => {
        if (!loader.classList.contains("preloader--hidden")) {
            loader.classList.add("preloader--hidden");
            document.body.classList.add('is-loaded');
            // Clean up DOM after transition finishes
            setTimeout(() => {
                loader.style.display = "none";
            }, 600);
        }
    };

    // --- GLOBAL FAIL-SAFE ---
    setTimeout(() => {
        if (!loader.classList.contains("preloader--hidden")) {
            hideLoader();
        }
    }, 4000);

    let current = 0;
    
    // Fast and smooth loading simulation
    const updateProgress = () => {
        // High-velocity increments for a snappy feel
        let increment = 0;
        if (current < 40) {
            increment = Math.floor(Math.random() * 15) + 10;
        } else if (current < 80) {
            increment = Math.floor(Math.random() * 10) + 5;
        } else {
            increment = Math.floor(Math.random() * 5) + 3;
        }

        current += increment;

        if (current >= 100) {
            current = 100;
            if (percentDisplay) percentDisplay.textContent = `100%`;
            if (progressBar) progressBar.style.width = `100%`;
            
            // Exit immediately for maximum snappiness
            hideLoader();
            return;
        }

        if (percentDisplay) percentDisplay.textContent = `${current}%`;
        if (progressBar) progressBar.style.width = `${current}%`;

        // Faster updates (20ms - 60ms range)
        const nextInterval = Math.floor(Math.random() * 40) + 20;
        setTimeout(updateProgress, nextInterval);
    };

    // Immediate start
    updateProgress();
}