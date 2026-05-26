import {
    CandlestickSeries,
    createChart
} from 'lightweight-charts'

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

async function getChartDataAndSet() {
    const response = await fetch('./chart_data.json')
    const candleStickData = await response.json()

    candleStickSeries.setData(candleStickData);

    chart.timeScale().fitContent();
}

getChartDataAndSet()

