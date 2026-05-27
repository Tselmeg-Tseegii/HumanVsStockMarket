import {
    CandlestickSeries,
    createChart,
    CrosshairMode,
    LastPriceAnimationMode
} from 'lightweight-charts'

const INITIAL_DATA_EVENT = "INITIAL DATA"
const NEW_CANDLE_EVENT = "NEW CANDLE"

class PriceDataContainer {
    constructor() {
        this.initialCandles = []
        this.candlesData = []
        this.currentCandleIndex = 0
    }

    async initialiseItSelfWithData() {
        const response = await fetch('./chart_data.json')
        const candleStickData = await response.json()

        this.initialCandles = candleStickData.splice(0, 25)
        this.candlesData = candleStickData
    }

    getNextCandle() {
        if (this.currentCandleIndex >= this.candlesData.length) {
            return null
        }
        const newCandle = this.candlesData[this.currentCandleIndex]
        this.currentCandleIndex++
        return newCandle
    }

    getInitialData() {
        return this.initialCandles
    }
    
}

class PriceDataDistrbuter {
    constructor() {
        this.events = {}
    }

    on(event, callbackFunc) {
        if (!this.events[event]) {
            this.events[event] = []
        }
        this.events[event].push(callbackFunc)
    }

    distrbute(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callBackFunc => {
                callBackFunc(data)
            })
        }
    }
}

class Chart {
    constructor() {
        this.chartOptions = {
            CrosshairMode: CrosshairMode.Normal,
            LastPriceAnimationMode: LastPriceAnimationMode.OnDataUpdate
        }
        
        const chartRectangle = document.querySelector('.main-loop .chart-rectangle')
        
        this.chart = createChart(chartRectangle, this.chartOptions)
        
        this.candleStickSeries = this.chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350', 
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350'
        })
        
        this.candleStickSeries.priceScale().applyOptions({
            autoScale: true,
            scaleMargins: {
                top: 0.2,
                bottom: 0.2
            }
        })

        this.previousCandle = {}
    }

    initialiseChartWithData(initialCandleData) {
        this.candleStickSeries.setData(initialCandleData)

        const numCandleSpaceOnRight = 5
        this.chart.timeScale().applyOptions({
            rightOffset: numCandleSpaceOnRight
        })
        this.chart.timeScale().fitContent()

        this.previousCandle = initialCandleData.at(-1)

        const screenRadius = 50
        this.candleStickSeries.applyOptions({
            autoscaleInfoProvider: () => {
                return {
                    priceRange: {
                        minValue: this.previousCandle.close - screenRadius,
                        maxValue: this.previousCandle.close + screenRadius
                    }
                }
            }
        })
    }

    updateChartWithCandle(newCandle) {
        this.candleStickSeries.update(newCandle)
        this.previousCandle = newCandle
    }
    
}

const priceDataContainer = new PriceDataContainer()
await priceDataContainer.initialiseItSelfWithData()

const priceDistrbuter = new PriceDataDistrbuter()
const mainChart = new Chart()

priceDistrbuter.on(INITIAL_DATA_EVENT, (data) => {mainChart.initialiseChartWithData(data)})
priceDistrbuter.distrbute(INITIAL_DATA_EVENT, priceDataContainer.getInitialData())

priceDistrbuter.on(NEW_CANDLE_EVENT, (candle) => {mainChart.updateChartWithCandle(candle)})

const intervalID = setInterval(() => {
    const newCandle = priceDataContainer.getNextCandle()
    if (!newCandle) {
        clearInterval(intervalID)
        return
    }

    priceDistrbuter.distrbute(NEW_CANDLE_EVENT, newCandle)
}, 1000)

