import { chartDataSchema } from "../../data_schema"

export class PriceDataContainer {
    constructor() {
        this.initialCandles = []
        this.candlesData = []
        this.currentCandleIndex = 0
        this.chartDataId = 0;
    }

    async initialiseItSelfWithData(dataPath) {
        const response = await fetch(dataPath)
        const candleStickData = await response.json()

        chartDataSchema.parse(candleStickData)

        this.initialCandles = candleStickData['values'].splice(0, 25)
        this.candlesData = candleStickData

        this.chartDataId = candleStickData['id']
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
