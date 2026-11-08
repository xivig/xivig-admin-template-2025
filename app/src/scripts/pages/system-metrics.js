/**
 * System Metrics Module
 * Handles real-time system monitoring charts.
 */

import ApexCharts from 'apexcharts';

const getColor = (token) => getComputedStyle(document.documentElement).getPropertyValue(token).trim();

export const initSystemMetrics = () => {
    const cpuEl = document.querySelector("#cpuChart");
    const ramEl = document.querySelector("#ramChart");
    const netEl = document.querySelector("#netChart");
    const realtimeEl = document.querySelector("#realtimeChart");

    if (cpuEl) {
        new ApexCharts(cpuEl, {
            series: [24.5], chart: { height: 180, type: 'radialBar' },
            colors: [getColor('--elite-primary')], plotOptions: { radialBar: { hollow: { size: '60%' }, dataLabels: { show: false } } }
        }).render();
    }

    if (ramEl) {
        new ApexCharts(ramEl, {
            series: [26], chart: { height: 180, type: 'radialBar' },
            colors: [getColor('--elite-warning')], plotOptions: { radialBar: { hollow: { size: '60%' }, dataLabels: { show: false } } }
        }).render();
    }

    if (netEl) {
        new ApexCharts(netEl, {
            series: [12], chart: { height: 180, type: 'radialBar' },
            colors: [getColor('--elite-success')], plotOptions: { radialBar: { hollow: { size: '60%' }, dataLabels: { show: false } } }
        }).render();
    }

    if (realtimeEl) {
        let lastDate = 0;
        let data = [];
        
        const getDayWiseTimeSeries = (baseval, count, yrange) => {
            let i = 0;
            while (i < count) {
                let x = baseval;
                let y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
                data.push({ x, y });
                lastDate = baseval;
                baseval += 86400000;
                i++;
            }
        };

        const getNewSeries = (baseval, yrange) => {
            let newDate = baseval + 86400000;
            lastDate = newDate;
            for(let i = 0; i< data.length - 10; i++) {
                data[i].x = newDate - 20 * 86400000 + i * 86400000;
                data[i].y = 0;
            }
            data.push({ x: newDate, y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min });
        };

        getDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 10, { min: 10, max: 90 });

        const realtimeOptions = {
            series: [{ data: data.slice() }],
            chart: { id: 'realtime', height: 400, type: 'line', animations: { enabled: true, easing: 'linear', dynamicAnimation: { speed: 1000 } }, toolbar: { show: false }, zoom: { enabled: false } },
            dataLabels: { enabled: false }, stroke: { curve: 'smooth' },
            colors: [getColor('--elite-primary')], markers: { size: 0 },
            xaxis: { type: 'datetime', range: 777600000 },
            yaxis: { max: 100 },
            legend: { show: false }
        };
        const chart = new ApexCharts(realtimeEl, realtimeOptions);
        chart.render();

        window.setInterval(() => {
            getNewSeries(lastDate, { min: 10, max: 90 });
            chart.updateSeries([{ data: data }]);
        }, 1000);
    }
};
