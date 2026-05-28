

export const TRADE_EXED = 'TRADE EXECUTED'
export const TRADE_EXE_BOUGHT = 'BUY EXECUTED'
export const TRADE_EXE_SOLD = 'SELL EXECUTED'
export const TRADE_CLOSED = 'POSITION CLOSED'
export const UNREALISED_PROFIT_UPDATE = 'UNREALISED PROFIT UPDATE'
export const HISTORY_UPDATE = 'NEW HISTORY ITEM'

export class TradeExecute {
    constructor(eventBroadCaster) {
        this.eventBroadCaster = eventBroadCaster
        this.realisedProfit = 0
        this.currCandle
        this.numPositions = 0
        this.isBuy = false
        this.lastExeCandle = null
        this.tradeHistory = []

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

        const difference = this.currCandle.close - this.lastExeCandle.close
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
        this.lastExeCandle = this.currCandle
        this.numPositions++
    }

    closePosition() {
        if (this.numPositions === 0) {
            console.log('no trade to close')
            return
        }

        const tradeHistoryItem = {}
        tradeHistoryItem['outcome'] = 0

        const difference = this.currCandle.close - this.lastExeCandle.close
        if (this.isBuy === true) {
            this.realisedProfit += difference
            tradeHistoryItem['type'] = TRADE_EXE_BOUGHT
            tradeHistoryItem['outcome'] += difference
        } else {
            this.realisedProfit -= difference
            tradeHistoryItem['type'] = TRADE_EXE_SOLD
            tradeHistoryItem['outcome'] -= difference
        }
        this.numPositions--

        tradeHistoryItem['start-time'] = this.lastExeCandle.time
        tradeHistoryItem['end-time'] = this.currCandle.time
        tradeHistoryItem['start-price'] = this.lastExeCandle.close
        tradeHistoryItem['end-price'] = this.currCandle.close

        this.tradeHistory.push(tradeHistoryItem)

        this.eventBroadCaster.distribute(TRADE_EXED, {
            type: TRADE_CLOSED,
            time: this.currCandle.time,
            price: this.currCandle.close,
            realisedProfit: this.realisedProfit
        })

        this.eventBroadCaster.distribute(UNREALISED_PROFIT_UPDATE, {
            unrealisedProfit: 0
        })

        this.eventBroadCaster.distribute(HISTORY_UPDATE, tradeHistoryItem)
    }
}