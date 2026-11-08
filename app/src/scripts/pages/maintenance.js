// Maintenance Page Logic

export function initMaintenance() {
    if (!document.getElementById('maintenance-card')) return;

    const urlParams = new URLSearchParams(window.location.search);
    // Determine a smart redirect URL: prefer root if in a subfolder
    const isSubfolder = window.location.pathname.includes('/pages/');
    const defaultRedirect = isSubfolder ? '../index.html' : 'index.html';
    const redirectUrl = urlParams.get("redirect") || defaultRedirect;

    // Configuration: 15 minutes total duration
    const durationInMinutes = 15;
    const totalDurationMs = durationInMinutes * 60 * 1000;
    
    // Persistence: Use localStorage so the timer doesn't reset on refresh
    let startTime = localStorage.getItem('xivig-maintenance-start');
    const now = new Date().getTime();

    if (!startTime || (now - parseInt(startTime)) > totalDurationMs) {
        startTime = now.toString();
        localStorage.setItem('xivig-maintenance-start', startTime);
    }
    
    const startTimestamp = parseInt(startTime);
    const targetTimestamp = startTimestamp + totalDurationMs;

    const updateCountdown = () => {
        const currentTime = new Date().getTime();
        const distance = targetTimestamp - currentTime;

        if (distance <= 0) {
            const pb = document.getElementById("progressBar");
            if (pb) pb.style.width = "100%";
            
            // Success state before redirect
            const statusBadge = document.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.innerHTML = '<span class="dot" style="background: var(--elite-success); box-shadow: 0 0 12px var(--elite-success)"></span> Deployment Complete';
                statusBadge.style.color = 'var(--elite-success)';
                statusBadge.style.borderColor = 'rgba(16, 185, 129, 0.2)';
            }

            setTimeout(() => {
                // Clear persistence and redirect
                localStorage.removeItem('xivig-maintenance-start');
                window.location.href = redirectUrl;
            }, 2000);
            
            return true; // Finished
        }

        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);

        // UI Updates
        const updateText = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = String(val).padStart(2, '0');
        };

        updateText("days", d);
        updateText("hours", h);
        updateText("minutes", m);
        updateText("seconds", s);

        // Progress Calculation: Based on elapsed time since persistent start
        const elapsed = currentTime - startTimestamp;
        const progressPercent = Math.min((elapsed / totalDurationMs) * 100, 100);
        const pb = document.getElementById("progressBar");
        if (pb) pb.style.width = `${progressPercent}%`;
        
        return false;
    };

    const timerInterval = setInterval(() => {
        if (updateCountdown()) clearInterval(timerInterval);
    }, 1000);
    
    updateCountdown();

    // Handle Subscription Form
    const form = document.querySelector('.subscribe-group');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const input = e.target.querySelector('input');
            
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
            
            setTimeout(() => {
                btn.innerHTML = '<i class="fa-solid fa-check"></i>';
                btn.style.background = 'var(--elite-success)'; // Success Green
                btn.style.borderColor = 'var(--elite-success)';
                input.disabled = true;
                input.value = "We'll notify you!";
                input.style.textAlign = "center";
                input.style.fontWeight = "600";
            }, 1500);
        });
    }
}
