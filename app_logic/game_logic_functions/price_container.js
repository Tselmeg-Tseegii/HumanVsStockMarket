
import { getLatestChartData } from "./get_from_db.js";

export class PriceDataContainer {
    constructor() {
        this.initialCandles = []
        this.candlesData = []
        this.currentCandleIndex = 0
    }

    async initialiseItSelfWithData(dataPath) {
        const candleStickData = getLatestChartData(dataPath)

        this.initialCandles = candleStickData['values'].splice(0, 25)
        this.candlesData = candleStickData
    }

    getNextCandle() {
        if (this.currentCandleIndex >= this.candlesData.length) {
            return null
        }
        const newCandle = this.candlesData[this.currentCandleIndex]
        this.currentCandleIndex++

        if (this.currentCandleIndex === this.candlesData.length) {
            return {
                candle: newCandle,
                thereIsMore: false
            }
        } else {
            return {
                candle: newCandle,
                thereIsMore: true
            }
        }
    }

    resetToPreviousCandle() {
        this.currentCandleIndex--
    }

    getInitialData() {
        return this.initialCandles
    }
    
}
