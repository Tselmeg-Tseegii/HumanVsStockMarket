import { candleStickDataArraySchema} from "../../data_schema.js"

export class PriceDataContainer {
    constructor() {
        this.initialCandles = []
        this.candlesData = []
        this.currentCandleIndex = 0
    }

    async initialiseItSelfWithData(dataPath) {
        const response = await fetch(dataPath)
        const candleStickData = await response.json()

        candleStickDataArraySchema.parse(candleStickData)

        this.initialCandles = candleStickData.splice(0, 25)
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
