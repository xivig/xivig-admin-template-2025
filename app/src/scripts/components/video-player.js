// 1. Define your brand overrides first
// $plyr-color-main: #6366f1;
// $plyr-video-border-radius: 12px;

// 2. Import the compiled CSS instead of the raw SASS 
// Vite handles .css imports inside .scss perfectly
import Plyr from 'plyr'; // Distilled import


/**
 * Xivig Media Player Module
 * Powered by Plyr.io
 */
export const initMediaPlayers = () => {
    const playerElements = document.querySelectorAll('.js-player');

    if (!playerElements.length) return;

    // Initialize all players and store them in a constant
    const players = Array.from(playerElements).map(p => new Plyr(p, {
        tooltips: {
            controls: true,
            seek: true
        },
        keyboard: {
            focused: true,
            global: true
        },
        settings: ['quality', 'speed', 'loop']
    }));

    // Optional: Pause other players when one starts (Pro UX)
    players.forEach(instance => {
        instance.on('play', () => {
            players.forEach(other => {
                if (other !== instance) other.pause();
            });
        });
    });

    console.log(`[Xivig OS] Media Gallery: ${players.length} instances active.`);
};

// Auto-init for non-modular environments
document.addEventListener('DOMContentLoaded', initMediaPlayers);