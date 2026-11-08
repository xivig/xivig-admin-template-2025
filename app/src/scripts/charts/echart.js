import * as echarts from 'echarts';

export const EChartModule = (() => {
    // Private helper to initialize a chart
    const initChart = (elementId, option) => {
        const chartDom = document.getElementById(elementId);
        if (!chartDom) return null; // Silently skip if element doesn't exist

        const chart = echarts.init(chartDom);
        chart.setOption(option);
        return chart;
    };

    const configs = {
        bar: {
            tooltip: {},
            legend: { data: ['Sales', 'Revenue', 'Profit'], bottom: 0 },
            xAxis: { data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
            yAxis: {},
            series: [
                { name: 'Sales', type: 'bar', data: [5, 20, 36, 10, 10, 20, 30, 25, 15, 40, 22, 18], itemStyle: { color: '#0d6efd' } },
                { name: 'Revenue', type: 'bar', data: [15, 30, 46, 20, 20, 30, 40, 35, 25, 50, 32, 28], itemStyle: { color: '#198754' } },
                { name: 'Profit', type: 'bar', data: [8, 25, 40, 15, 15, 25, 35, 30, 20, 45, 28, 24], itemStyle: { color: '#ffc107' } }
            ]
        },
        traffic: (radius = '70%') => ({
            series: [{
                type: 'pie',
                radius: radius,
                data: [
                    { value: 1048, name: 'Direct', itemStyle: { color: '#0d6efd' } },
                    { value: 735, name: 'Email', itemStyle: { color: '#198754' } },
                    { value: 580, name: 'Affiliate', itemStyle: { color: '#6c757d' } },
                    { value: 484, name: 'Video', itemStyle: { color: '#fd7e14' } },
                    { value: 300, name: 'Search', itemStyle: { color: '#20c997' } }
                ]
            }]
        }),
        device: {
            series: [{
                type: 'pie',
                radius: ['40%', '70%'],
                roseType: 'area',
                data: [
                    { value: 1048, name: 'Mobile', itemStyle: { color: '#0d6efd' } },
                    { value: 735, name: 'Tablets', itemStyle: { color: '#198754' } },
                    { value: 580, name: 'Laptops', itemStyle: { color: '#ffc107' } },
                    { value: 484, name: 'Desktops', itemStyle: { color: '#dc3545' } }
                ]
            }]
        },
        age: {
            series: [{
                type: 'pie',
                radius: ['50%', '70%'],
                data: [
                    { value: 1048, name: '18-24', itemStyle: { color: '#0d6efd' } },
                    { value: 735, name: '25-34', itemStyle: { color: '#198754' } },
                    { value: 580, name: '35-44', itemStyle: { color: '#6c757d' } },
                    { value: 484, name: '45+', itemStyle: { color: '#fd7e14' } }
                ]
            }]
        }
    };

    return {
        initAll: () => {
            const chartIds = {
                bar: { id: 'barChart', config: configs.bar },
                miniPie: { id: 'miniPie', config: configs.traffic('60%') },
                trafficPie: { id: 'trafficPie', config: configs.traffic('70%') },
                deviceArea: { id: 'deviceArea', config: configs.device },
                donutChart: { id: 'donutChart', config: configs.age }
            };

            const instances = {};

            // Initialize only what exists in the current HTML
            Object.keys(chartIds).forEach(key => {
                const item = chartIds[key];
                const instance = initChart(item.id, item.config);
                if (instance) instances[key] = instance;
            });

            window.addEventListener('resize', () => {
                Object.values(instances).forEach(chart => chart && chart.resize());
            });

            return instances;
        }
    };
})();
