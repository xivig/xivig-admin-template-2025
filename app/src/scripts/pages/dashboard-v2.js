import Chart from 'chart.js/auto';
import ApexCharts from 'apexcharts';

const getColor = (token) => getComputedStyle(document.documentElement).getPropertyValue(token).trim();

/**
 * Dashboard v2 Module
 * Handles chart initialization for the Dashboard v2 page.
 */
export const initDashboardV2 = () => {
    // 1. Chart.js Initializations
    const initChartJs = () => {
        // Scatter
        const scatterEl = document.getElementById('scatterChart');
        if (scatterEl) {
            new Chart(scatterEl, {
                type: 'bubble',
                data: {
                    datasets: [{
                        label: 'Customers', data: [
                            { x: 5, y: 200, r: 10 }, { x: 10, y: 400, r: 15 }, { x: 15, y: 600, r: 20 }, { x: 20, y: 800, r: 25 }
                        ], backgroundColor: getColor('--elite-success')
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { title: { display: true, text: 'Purchase Frequency' } },
                        y: { title: { display: true, text: 'Avg Order Value' } }
                    }
                }
            });
        }

        // Line
        const lineEl = document.getElementById('lineAnalytics');
        if (lineEl) {
            new Chart(lineEl, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                        {
                            label: 'Page Views',
                            data: [200, 400, 600, 800, 900, 1000, 1200, 1300, 1400, 1500, 1600, 1700],
                            borderColor: getColor('--elite-success'),
                            fill: false
                        },
                        {
                            label: 'Unique Visitors',
                            data: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
                            borderColor: getColor('--elite-info'),
                            fill: false
                        }
                    ]
                },
                options: { 
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: { duration: 1200, easing: 'easeOutQuart' } 
                }
            });
        }

        // Horizontal Bar
        const langBarEl = document.getElementById('langBar');
        if (langBarEl) {
            new Chart(langBarEl, {
                type: 'bar',
                data: {
                    labels: ['Swift', 'Rust', 'Go', 'C#', 'TypeScript', 'Java', 'Python', 'JavaScript'],
                    datasets: [{
                        label: 'Popularity %', data: [20, 30, 40, 50, 60, 70, 80, 90],
                        backgroundColor: [
                            getColor('--elite-info'), 
                            getColor('--elite-success'), 
                            getColor('--elite-warning'), 
                            '#6f42c1', 
                            '#6610f2', 
                            getColor('--elite-warning'), 
                            getColor('--elite-success'), 
                            getColor('--elite-chart-red')
                        ]
                    }]
                },
                options: { 
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y' 
                }
            });
        }

        // Vertical Bar
        const userBarEl = document.getElementById('userBar');
        if (userBarEl) {
            new Chart(userBarEl, {
                type: 'bar',
                data: {
                    labels: ['USA', 'China', 'Japan', 'Germany', 'UK', 'France', 'Canada', 'Australia'],
                    datasets: [{
                        label: 'Users (K)', data: [2300, 1800, 1200, 1000, 800, 650, 500, 400],
                        backgroundColor: [
                            getColor('--elite-info'), 
                            getColor('--elite-success'), 
                            getColor('--elite-warning'), 
                            getColor('--elite-chart-red'), 
                            getColor('--elite-warning'), 
                            '#6f42c1', 
                            getColor('--elite-success'), 
                            getColor('--elite-secondary')
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

        // Pie
        const pieEl = document.getElementById('pieChart');
        if (pieEl) {
            new Chart(pieEl, {
                type: 'pie',
                data: {
                    labels: ['Desktop', 'Mobile', 'Tablet', 'Other'],
                    datasets: [{ 
                        data: [45, 30, 15, 10], 
                        backgroundColor: [
                            getColor('--elite-info'), 
                            getColor('--elite-success'), 
                            '#6f42c1', 
                            getColor('--elite-chart-red')
                        ] 
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

        // Doughnut
        const doughnutEl = document.getElementById('doughnutChart');
        if (doughnutEl) {
            new Chart(doughnutEl, {
                type: 'doughnut',
                data: {
                    labels: ['Direct', 'Organic', 'Referral', 'Social'],
                    datasets: [{ 
                        data: [25, 35, 20, 20], 
                        backgroundColor: [
                            getColor('--elite-info'), 
                            getColor('--elite-success'), 
                            getColor('--elite-chart-red'), 
                            getColor('--elite-warning')
                        ] 
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

        // Polar Area
        const polarEl = document.getElementById('polarChart');
        if (polarEl) {
            new Chart(polarEl, {
                type: 'polarArea',
                data: {
                    labels: ['North', 'East', 'South', 'West', 'Central'],
                    datasets: [{
                        data: [12, 16, 10, 14, 8],
                        backgroundColor: [
                            getColor('--elite-info'), 
                            getColor('--elite-warning'), 
                            getColor('--elite-warning'), 
                            '#6f42c1', 
                            getColor('--elite-success')
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }

        // Radar
        const radarEl = document.getElementById('radarChart');
        if (radarEl) {
            new Chart(radarEl, {
                type: 'radar',
                data: {
                    labels: ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency', 'Design'],
                    datasets: [
                        {
                            label: 'Model A',
                            data: [80, 70, 60, 90, 75, 85],
                            borderColor: getColor('--elite-info'),
                            backgroundColor: getColor('--elite-info')
                        },
                        {
                            label: 'Model B',
                            data: [70, 65, 75, 80, 70, 60],
                            borderColor: getColor('--elite-chart-red'),
                            backgroundColor: getColor('--elite-chart-red')
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    };

    // 2. ApexCharts Initializations
    const initApexCharts = () => {
        const baseOptions = {
            chart: {
                height: 220,
                type: 'radialBar',
                sparkline: { enabled: true }
            },
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    endAngle: 135,
                    hollow: { size: '70%' },
                    track: {
                        background: getColor('--bg-subtle'),
                        strokeWidth: '97%',
                        margin: 5,
                    },
                    dataLabels: {
                        name: { show: false },
                        value: {
                            offsetY: 10,
                            fontSize: '28px',
                            fontWeight: '800',
                            fontFamily: 'Sora',
                            color: getColor('--elite-dark'),
                            formatter: function (val) {
                                return val;
                            }
                        }
                    }
                }
            },
            stroke: { lineCap: 'round' },
            labels: ['Progress']
        };

        const chartEarnings = document.querySelector("#chartEarnings");
        if (chartEarnings) {
            new ApexCharts(chartEarnings, { ...baseOptions, series: [66], colors: [getColor('--elite-chart-blue')] }).render();
        }

        const chartBusiness = document.querySelector("#chartBusiness");
        if (chartBusiness) {
            new ApexCharts(chartBusiness, { ...baseOptions, series: [75], colors: [getColor('--elite-success')] }).render();
        }

        const chartSpeed = document.querySelector("#chartSpeed");
        if (chartSpeed) {
            new ApexCharts(chartSpeed, { ...baseOptions, series: [90], colors: [getColor('--elite-chart-red')] }).render();
        }

        const chartPending = document.querySelector("#chartPending");
        if (chartPending) {
            new ApexCharts(chartPending, { ...baseOptions, series: [35], colors: [getColor('--elite-primary')] }).render();
        }

        // Row 2
        const chartEarnings1 = document.querySelector("#chartEarnings1");
        if (chartEarnings1) {
            new ApexCharts(chartEarnings1, { ...baseOptions, series: [31], colors: [getColor('--elite-chart-blue')] }).render();
        }

        const chartBusiness1 = document.querySelector("#chartBusiness1");
        if (chartBusiness1) {
            new ApexCharts(chartBusiness1, { ...baseOptions, series: [60], colors: [getColor('--elite-success')] }).render();
        }

        const chartSpeed1 = document.querySelector("#chartSpeed1");
        if (chartSpeed1) {
            new ApexCharts(chartSpeed1, { ...baseOptions, series: [46], colors: [getColor('--elite-chart-red')] }).render();
        }

        const chartPending1 = document.querySelector("#chartPending1");
        if (chartPending1) {
            new ApexCharts(chartPending1, { ...baseOptions, series: [90], colors: [getColor('--elite-primary')] }).render();
        }
    };

    initChartJs();
    initApexCharts();
};
