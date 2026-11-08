import ApexCharts from 'apexcharts';
import Highcharts from 'highcharts';

const getColor = (token) => getComputedStyle(document.documentElement).getPropertyValue(token).trim();

export const initDashboard = () => {
    if (!document.getElementById('activities-chart')) return;

    // 1. System Activity Overview (Polished Line Chart)
    const activitiesOptions = {
        series: [{
            name: 'Users',
            data: [15, 12, 14, 18, 22, 25, 24, 25, 22, 20, 25, 30]
        }, {
            name: 'Developers',
            data: [18, 14, 13, 16, 18, 21, 28, 21, 25, 21, 27, 25]
        }],
        chart: {
            height: 330,
            type: 'line',
            toolbar: {
                show: false
            },
            dropShadow: {
                enabled: true,
                top: 8,
                left: 0,
                blur: 3,
                color: '#000',
                opacity: 0.1
            },
            zoom: {
                enabled: false
            }
        },
        colors: [getColor('--elite-chart-red'), getColor('--elite-chart-blue')],
        stroke: {
            curve: 'smooth',
            width: 3
        },
        markers: {
            size: 0,
            strokeColors: '#fff',
            strokeWidth: 2,
            hover: {
                size: 6
            }
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            labels: {
                style: {
                    colors: getColor('--elite-secondary'),
                    fontSize: '12px'
                }
            }
        },
        yaxis: {
            min: 0,
            max: 35,
            labels: {
                style: {
                    colors: getColor('--elite-secondary'),
                    fontSize: '12px'
                }
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            offsetY: -5,
            fontSize: '13px',
            markers: {
                radius: 12,
                width: 10,
                height: 10
            }
        },
        grid: {
            borderColor: getColor('--bg-subtle'),
            strokeDashArray: 4,
            padding: {
                right: 20,
                left: 10,
                top: 0,
                bottom: 0
            },
            xaxis: {
                lines: {
                    show: true
                }
            }
        },
        tooltip: {
            shared: true,
            intersect: false,
            y: {
                formatter: (y) => y + " numbers"
            }
        }
    };
    new ApexCharts(document.querySelector("#activities-chart"), activitiesOptions).render();

    // 2. Deployment Mini Chart
    const DeploymentOptions = {
        series: [{
            data: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54]
        }],
        chart: {
            type: 'bar',
            width: 100,
            height: 60,
            sparkline: {
                enabled: true
            }
        },
        plotOptions: {
            bar: {
                columnWidth: '80%',
                borderRadius: 2,
                colors: {
                    ranges: [{
                        from: 0,
                        to: 100,
                        color: getColor('--elite-chart-red')
                    }]
                }
            }
        },
        colors: ['#ffffff'],
        tooltip: {
            enabled: false
        }
    };
    new ApexCharts(document.querySelector("#deployment-chart"), DeploymentOptions).render();

    // 3. Surgery Mini Chart
    const surgeryOptions = {
        series: [{
            data: [12, 14, 2, 47, 42, 15, 47, 75, 65, 19, 14]
        }],
        chart: {
            type: 'bar',
            width: 100,
            height: 60,
            sparkline: {
                enabled: true
            }
        },
        plotOptions: {
            bar: {
                columnWidth: '80%',
                borderRadius: 2
            }
        },
        colors: ['#ffffff'],
        tooltip: {
            enabled: false
        }
    };
    new ApexCharts(document.querySelector("#surgery-chart"), surgeryOptions).render();



};


// 4. System Health Report (Enhanced Radial Bar)
let healthChart;

function renderHealthChart() {
    const healthChartEl = document.querySelector("#health-chart");
    if (!healthChartEl) return;

    const healthOptions = {
        series: [44, 55, 67, 83],
        chart: {
            type: 'radialBar',
            height: 320, // ✅ number, not '320px'
            width: '100%',
            parentHeightOffset: 0,
            redrawOnParentResize: true,
            redrawOnWindowResize: true,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            radialBar: {
                customScale: 0.85,
                offsetX: 0,
                offsetY: 0,
                hollow: {
                    size: '45%'
                },
                track: {
                    margin: 10,
                    background: getColor('--bg-subtle'),
                    strokeWidth: '97%'
                },
                dataLabels: {
                    name: {
                        show: true,
                        fontSize: '14px',
                        fontWeight: 600,
                        color: getColor('--elite-secondary'),
                        offsetY: -10
                    },
                    value: {
                        show: true,
                        fontSize: '24px',
                        fontWeight: 700,
                        color: getColor('--elite-dark'),
                        offsetY: 5,
                        formatter: (val) => val + '%'
                    },
                    total: {
                        show: true,
                        label: 'Total',
                        fontSize: '14px',
                        color: getColor('--elite-secondary'),
                        formatter: () => '260'
                    }
                }
            }
        },
        colors: [getColor('--elite-chart-blue'), getColor('--elite-warning'), getColor('--elite-chart-red'), getColor('--elite-dark')],
        labels: ['CPU Load', 'API Latency', 'Error Rate', 'Uptime %'],
        stroke: {
            lineCap: 'round'
        }
    };

    if (healthChart) healthChart.destroy();
    healthChart = new ApexCharts(document.querySelector("#health-chart"), healthOptions);
    healthChart.render();

    // 🔥 force correct sizing after paint
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 200);
}

// wait for layout to be ready
window.addEventListener('load', () => {
    requestAnimationFrame(() => {
        setTimeout(renderHealthChart, 100);
    });
});