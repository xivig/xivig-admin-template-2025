import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const ChartManager = (() => {
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } },
        animation: { duration: 1000 }
    };

    const createChart = (id, config) => {
        const canvas = document.getElementById(id);
        if (!canvas) return null;

        // Reset if already exists
        const existing = Chart.getChart(canvas);
        if (existing) existing.destroy();

        return new Chart(canvas, {
            type: config.type,
            data: config.data,
            options: { ...defaultOptions, ...config.options }
        });
    };

    return {
        initAll: () => {
            // 1. Vertical
            createChart('verticalBar', {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar'],
                    datasets: [{ label: 'Sales', data: [12, 19, 3], backgroundColor: '#0d6efd' }]
                }
            });

            // 2. Horizontal
            createChart('horizontalBar', {
                type: 'bar',
                options: { indexAxis: 'y' },
                data: {
                    labels: ['HR', 'Dev', 'Sales'],
                    datasets: [{ label: 'Budget', data: [80, 120, 90], backgroundColor: '#198754' }]
                }
            });

            // 3. Grouped Bar (Crucial: 2+ datasets)
            createChart('groupedBar', {
                type: 'bar',
                data: {
                    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                    datasets: [
                        { label: '2024', data: [40, 50, 45, 70], backgroundColor: '#6c757d' },
                        { label: '2025', data: [50, 70, 60, 90], backgroundColor: '#0d6efd' }
                    ]
                }
            });

            // 4. Stacked Bar
            createChart('stackedBar', {
                type: 'bar',
                options: { scales: { x: { stacked: true }, y: { stacked: true } } },
                data: {
                    labels: ['Mon', 'Tue', 'Wed'],
                    datasets: [
                        { label: 'Direct', data: [10, 15, 8], backgroundColor: '#0d6efd' },
                        { label: 'Referral', data: [5, 10, 12], backgroundColor: '#ffc107' }
                    ]
                }
            });

            // 5. Line Chart
            createChart('lineChart', {
                type: 'line',
                data: {
                    labels: ['W1', 'W2', 'W3', 'W4'],
                    datasets: [{
                        label: 'Users',
                        data: [10, 25, 20, 40],
                        borderColor: '#0dcaf0',
                        tension: 0.4 // Makes it a smooth line
                    }]
                }
            });

            // 6. Area Chart (Crucial: type line + fill: true)
            createChart('areaChart', {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
                    datasets: [{
                        label: 'Revenue',
                        data: [15, 30, 25, 55],
                        borderColor: '#6f42c1',
                        backgroundColor: 'rgba(111, 66, 193, 0.1)',
                        fill: true, // This is what makes it an area chart
                        tension: 0.4
                    }]
                }
            });
        }
    };
})();

export default ChartManager;
