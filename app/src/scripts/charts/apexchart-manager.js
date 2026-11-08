import ApexCharts from 'apexcharts';

const ApexchartManager = {
    init(elementId, options) {
        const el = document.getElementById(elementId);
        if (!el) return null;
        const chart = new ApexCharts(el, options);
        chart.render();
        return chart;
    },

    initAll() {
        const instances = {};

        // Spline Chart
        instances.spline = this.init('apexSpline', {
            chart: { type: 'area', height: 350 },
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth' },
            series: [{
                name: 'Series 1',
                data: [31, 40, 28, 51, 42, 109, 100]
            }],
            xaxis: {
                categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]
            }
        });

        // Column Chart
        instances.column = this.init('apexColumn', {
            chart: { type: 'bar', height: 350 },
            plotOptions: { bar: { horizontal: false, columnWidth: '55%' } },
            series: [{
                name: 'Net Profit',
                data: [44, 55, 57, 56, 61, 58, 63]
            }]
        });

        return instances;
    }
};

export default ApexchartManager;