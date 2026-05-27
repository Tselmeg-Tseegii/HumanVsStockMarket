import {
    CandlestickSeries,
    createChart,
    createSeriesMarkers,
    CrosshairMode,
    LastPriceAnimationMode
} from 'lightweight-charts'

import { 
    TRADE_EXE_BOUGHT,
    TRADE_EXE_SOLD,
    TRADE_CLOSED
} from "./trade_execution.js"

import {
    buyBlueColor,
    sellRedColor,
    closeGreyColor
} from './constants.js'

export class Chart {
    constructor() {
        this.chartOptions = {
            crosshair: {
                mode: CrosshairMode.Normal,
            }
        }
        
        const chartRectangle = document.querySelector('.main-loop .chart-rectangle')
        
        this.chart = createChart(chartRectangle, this.chartOptions)
        
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
        }

        const line = {
            price: tradeInfo.price,
            lineWidth: 2,
            lineStyle: 1,
            axisLabelVisible: true,
            title: 'OPEN POSITION'
        }
        
        if (tradeInfo['type'] === TRADE_EXE_BOUGHT) {
            newMarker['color'] = buyBlueColor
            newMarker['shape'] = 'arrowUp'
            newMarker['text'] = `BUY @ $${tradeInfo.price}`

            line['color'] = buyBlueColor
        } else if (tradeInfo['type'] === TRADE_EXE_SOLD) {
            newMarker['color'] = sellRedColor
            newMarker['shape'] = 'arrowDown'
            newMarker['text'] = `SELL @ $${tradeInfo.price}`

            line['color'] = sellRedColor
        } else {
            newMarker['color'] = closeGreyColor
            newMarker['shape'] = 'circle'
            newMarker['text'] = `CLOSED @ $${tradeInfo.price}`

            this.candleStickSeries.removePriceLine(this.activePriceLine)
        }

        this.tradeMarkers.push(newMarker)
        createSeriesMarkers(this.candleStickSeries, this.tradeMarkers)

        if (tradeInfo['type'] !== TRADE_CLOSED) {
            this.activePriceLine = this.candleStickSeries.createPriceLine(line)
        } 
    }
    
}