import {
    Chart,
    registerables
} from 'chart.js';
Chart.register(...registerables);

export function initCharts() {
    const ctx = document.getElementById('xivigChart');
    new Chart(ctx, {
        /* config */
    });
}