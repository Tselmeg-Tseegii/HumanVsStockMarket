import {
    CandlestickSeries,
    createChart
} from 'lightweight-charts'

import {
    candleStickData
} from './chart_data.js'

const chartOptions = {
    crosshair: {
        mode: 0
    }
}

const chartRectangle = document.querySelector('.main-loop .chart-rectangle')

const chart = createChart(chartRectangle, chartOptions)

const candleStickSeries = chart.addSeries(CandlestickSeries, {
    upColor: '#26a69a',
    downColor: '#ef5350', 
    borderVisible: false,
    wickUpColor: '#26a69a',
    wickDownColor: '#ef5350'
})

candleStickSeries.setData(candleStickData);

chart.timeScale().fitContent();

