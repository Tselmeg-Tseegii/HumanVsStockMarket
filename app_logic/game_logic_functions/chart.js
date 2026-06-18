import {
    CandlestickSeries,
    createChart,
    createSeriesMarkers,
    CrosshairMode,
    LastPriceAnimationMode,
    LineSeries
} from 'lightweight-charts'

import { 
    TRADE_EXE_BOUGHT,
    TRADE_EXE_SOLD,
    TRADE_CLOSED
} from "./trade_execution.js"

import {
    buyBlueColor,
    sellRedColor,
    closeGreyColor,
    greenColor,
    yellowCol,
    tealCol
} from '../constants.js'

export class Chart {
    constructor() {
        this.chartOptions = {
            crosshair: {
                mode: CrosshairMode.Normal,
            },
            handleScroll: false,
            handleScale: false
        }
        
        this.chartRectangle = document.querySelector('.main-loop .panels-container .left-panel .chart-rectangle')
        
        this.chart = createChart(this.chartRectangle, this.chartOptions)
        
        this.candleStickSeries = this.chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350', 
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
            lastPriceAnimation: LastPriceAnimationMode.OnDataUpdate
        })
        
        this.candleStickSeries.priceScale().applyOptions({
            autoScale: true,
            scaleMargins: {
                top: 0.2,
                bottom: 0.2
            }
        })

        this.previousCandle = {}
        this.activePriceLine = null
        this.tradeMarkers = []

        this.resizeObserver = new ResizeObserver(entries => {
            if (entries.length === 0 | entries[0].target !== this.chartRectangle) {
                return
            }
            const newRect = entries[0].contentRect

            this.chart.applyOptions({
                width: newRect.width,
                height: newRect.height
            })
        })

        this.resizeObserver.observe(this.chartRectangle)
    }

    enableNavigation() {
        this.chart.applyOptions({
            handleScale: true,
            handleScroll: true
        })
        this.chart.priceScale('right').applyOptions({
            autoScale: false
        })
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

    handleTradeExecution(tradeInfo) {
        const newMarker = {
            time: tradeInfo.time,
            position: 'belowBar',
            size: 0.5
        }

        const line = {
            price: tradeInfo.price,
            lineWidth: 2,
            lineStyle: 1,
            axisLabelVisible: true,
            title: 'OPEN POSITION'
        }
        
        if (tradeInfo['type'] === TRADE_EXE_BOUGHT) {
            newMarker['color'] = tealCol
            newMarker['shape'] = 'arrowUp'
            newMarker['text'] = `BUY`

            line['color'] = buyBlueColor
        } else if (tradeInfo['type'] === TRADE_EXE_SOLD) {
            newMarker['color'] = sellRedColor
            newMarker['shape'] = 'arrowDown'
            newMarker['text'] = `SELL`

            line['color'] = sellRedColor
        } else {
            newMarker['color'] = yellowCol
            newMarker['shape'] = 'circle'
            newMarker['text'] = `CLOSED`

            this.candleStickSeries.removePriceLine(this.activePriceLine)
        }

        this.tradeMarkers.push(newMarker)
        createSeriesMarkers(this.candleStickSeries, this.tradeMarkers)

        if (tradeInfo['type'] !== TRADE_CLOSED) {
            this.activePriceLine = this.candleStickSeries.createPriceLine(line)
        } 
    }

    displayTradeLines(tradeHistory) {
        this.tradeHistoryLineSeries = tradeHistory.map((trade) => {
            if (trade['start-time'] === trade['end-time']) {
                return null
            }
            const tradeLineSeries = this.chart.addSeries(LineSeries, {
                color: (trade['outcome'] > 0) ? greenColor : sellRedColor,
                lineWidth: 2,
                lineStyle: 2,
                priceLineVisible: false,
                lastValueVisible: false,
                crosshairMarkerVisible: false
            })

            tradeLineSeries.setData([
                { time: trade['start-time'], value: trade['start-price']},
                { time: trade['end-time'], value: trade['end-price']},
            ])
            return tradeLineSeries
        })
    }
    
}