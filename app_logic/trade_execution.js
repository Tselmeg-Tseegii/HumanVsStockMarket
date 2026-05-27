

export const TRADE_EXED = 'TRADE EXECUTED'
export const TRADE_EXE_BOUGHT = 'BUY EXECUTED'
export const TRADE_EXE_SOLD = 'SELL EXECUTED'
export const TRADE_CLOSED = 'POSITION CLOSED'

export class TradeExecute {
    constructor(eventBroadCaster) {
        this.eventBroadCaster = eventBroadCaster
        this.currProfit = 0
        this.currCandle
        this.numPositions = 0
        this.isBuy = false
        this.lastExecutionPrice = 0

        this.buyButton = document.querySelector('.buy-button')
        this.sellButton = document.querySelector('.sell-button')
        this.closeButton = document.querySelector('.close-button')

        this.buyButton.addEventListener('click', () => {this.openPosition('buy')})
        this.sellButton.addEventListener('click', () => {this.openPosition('sell')})
        this.closeButton.addEventListener('click', () => {this.closePosition()})
    }

    updateCurrCandle(newCandle) {
        this.currCandle = newCandle
    }

    openPosition(tradeType) {
        if (this.numPositions !== 0) {
            console.log('Cannot have more than one position')
            return
        }
        if (tradeType === 'buy') {
            this.isBuy = true

            this.eventBroadCaster.distribute(TRADE_EXED, {
                type: TRADE_EXE_BOUGHT,
                price: this.currCandle.close,
                time: this.currCandle.time,
                currProfit: this.currProfit
            })
        } else if (tradeType === 'sell') {
            this.isBuy = false

            this.eventBroadCaster.distribute(TRADE_EXED, {
                type: TRADE_EXE_SOLD,
                price: this.currCandle.close,
                time: this.currCandle.time,
                currProfit: this.currProfit
            })
        }
        this.lastExecutionPrice = this.currCandle.close
        this.numPositions++
    }

    closePosition() {
        if (this.numPositions === 0) {
            console.log('no trade to close')
            return
        }

        const difference = this.currCandle.close - this.lastExecutionPrice
        if (this.isBuy === true) {
            this.currProfit += difference
        } else {
            this.currProfit -= difference
        }
        this.numPositions--

        this.eventBroadCaster.distribute(TRADE_EXED, {
            type: TRADE_CLOSED,
            time: this.currCandle.time,
            price: this.currCandle.close,
            currProfit: this.currProfit
        })
    }
}