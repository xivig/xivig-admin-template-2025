import Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';

// Initialize exporting module
if (typeof HighchartsExporting === 'function') {
    HighchartsExporting(Highcharts);
} else if (HighchartsExporting && typeof HighchartsExporting.default === 'function') {
    HighchartsExporting.default(Highcharts);
}

const HighchartManager = {
    init(elementId, options) {
        const el = document.getElementById(elementId);
        if (!el) return null;
        return Highcharts.chart(elementId, options);
    },

    initAll() {
        const instances = {};

        // Line Chart
        instances.line = this.init('highchartLine', {
            title: { text: 'Monthly Average Temperature' },
            xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
            series: [{
                name: 'Tokyo',
                data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5]
            }, {
                name: 'London',
                data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2]
            }]
        });

        // Area Chart
        instances.area = this.init('highchartArea', {
            chart: { type: 'area' },
            title: { text: 'Area Chart' },
            series: [{
                name: 'Sales',
                data: [1, 3, 5, 2, 3, 9]
            }]
        });

        return instances;
    }
};

export default HighchartManager;