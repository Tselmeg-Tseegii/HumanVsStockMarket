import {
    CandlestickSeries,
    createChart,
    CrosshairMode,
    LastPriceAnimationMode
} from 'lightweight-charts'

const chartOptions = {
    CrosshairMode: CrosshairMode.Normal,
    LastPriceAnimationMode: LastPriceAnimationMode.OnDataUpdate
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

candleStickSeries.priceScale().applyOptions({
    autoScale: true,
    scaleMargins: {
        top: 0.2,
        bottom: 0.2
    }
})

async function getChartDataAndUpdate() {
    const response = await fetch('./chart_data.json')
    const candleStickData = await response.json()

    const initialCandleStickData = candleStickData.splice(0, 25)

    candleStickSeries.setData(initialCandleStickData)

    const numCandleSpaceOnRight = 5
    chart.timeScale().applyOptions({
        rightOffset: numCandleSpaceOnRight
    })
    chart.timeScale().fitContent()

    let previousCandle = initialCandleStickData.at(-1)

    const screenRadius = 50
    candleStickSeries.applyOptions({
        autoscaleInfoProvider: () => {
            return {
                priceRange: {
                    minValue: previousCandle.close - screenRadius,
                    maxValue: previousCandle.close + screenRadius
                }
            }
        }
    })

    for (let i = 0; i < candleStickData.length; i++) {
        const newCandle = candleStickData[i]
        candleStickSeries.update(newCandle)

        const delay = (ms) => new Promise(resolverFunc => setTimeout(resolverFunc, ms))
        await delay(1000)

        previousCandle = newCandle
    }
}

getChartDataAndUpdate()

