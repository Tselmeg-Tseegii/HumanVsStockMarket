

export const TRADE_EXED = 'TRADE EXECUTED'
export const TRADE_EXE_BOUGHT = 'BUY EXECUTED'
export const TRADE_EXE_SOLD = 'SELL EXECUTED'
export const TRADE_CLOSED = 'POSITION CLOSED'
export const UNREALISED_PROFIT_UPDATE = 'UNREALISED PROFIT UPDATE'

export class TradeExecute {
    constructor(eventBroadCaster) {
        this.eventBroadCaster = eventBroadCaster
        this.realisedProfit = 0
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
        if (this.numPositions !== 0) {
            this.broadCastUnrealisedProfit()
        }
    }

    broadCastUnrealisedProfit() {
        const message = {
            unrealisedProfit: 0
        }

        const difference = this.currCandle.close - this.lastExecutionPrice
        if (this.numPositions !== 0) {
            if (this.isBuy === true) {
                message.unrealisedProfit += difference
            } else {
                message.unrealisedProfit -= difference
            }
        }
        
        this.eventBroadCaster.distribute(UNREALISED_PROFIT_UPDATE, message)
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
                realisedProfit: this.realisedProfit
            })
        } else if (tradeType === 'sell') {
            this.isBuy = false

            this.eventBroadCaster.distribute(TRADE_EXED, {
                type: TRADE_EXE_SOLD,
                price: this.currCandle.close,
                time: this.currCandle.time,
                realisedProfit: this.realisedProfit
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
            this.realisedProfit += difference
        } else {
            this.realisedProfit -= difference
        }
        this.numPositions--

        this.eventBroadCaster.distribute(TRADE_EXED, {
            type: TRADE_CLOSED,
            time: this.currCandle.time,
            price: this.currCandle.close,
            realisedProfit: this.realisedProfit
        })

        this.eventBroadCaster.distribute(UNREALISED_PROFIT_UPDATE, {
            unrealisedProfit: 0
        })
    }
}