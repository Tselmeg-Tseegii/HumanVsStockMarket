export class PriceDataContainer {
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

    getInitialData() {
        return this.initialCandles
    }
    
}
