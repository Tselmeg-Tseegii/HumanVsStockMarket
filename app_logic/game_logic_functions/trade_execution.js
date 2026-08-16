import { FULL_TRADE_HISTORY, GameStatus, LAST_PLAYED_DATA_ID, SAVED_TRADE_HISTORY } from "../constants.js"

export const TRADE_EXED = 'TRADE EXECUTED'
export const TRADE_EXE_BOUGHT = 'BUY'
export const TRADE_EXE_SOLD = 'SELL'
export const TRADE_CLOSED = 'CLOSED'
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

        this.buyButton = document.querySelector('.main-loop .panels-container .left-panel .button-row .buy-button')
        this.sellButton = document.querySelector('.main-loop .panels-container .left-panel .button-row .sell-button')
        this.closeButton = document.querySelector('.main-loop .panels-container .left-panel .button-row .close-button')

        this.buyButton.addEventListener('click', () => {
            if (this.openPosition('buy') === true) {
                this.sellButton.classList.add('ghost-hidden')
                this.buyButton.classList.add('ghost-hidden')

                this.closeButton.classList.remove('ghost-hidden')
            }
        })
        this.sellButton.addEventListener('click', () => {
            if (this.openPosition('sell') === true) {
                this.sellButton.classList.add('ghost-hidden')
                this.buyButton.classList.add('ghost-hidden')

                this.closeButton.classList.remove('ghost-hidden')
            }
        })
        this.closeButton.addEventListener('click', () => {
            if (this.closePosition() === true) {
                this.sellButton.classList.remove('ghost-hidden')
                this.buyButton.classList.remove('ghost-hidden')

                this.closeButton.classList.add('ghost-hidden')
            }
        })
    }

    updateCurrCandle(newCandle) {
        this.currCandle = newCandle
        if (this.numPositions !== 0) {
            this.broadCastUnrealisedProfit()
        }
    }

    broadCastUnrealisedProfit() {
        if (!this.currCandle || !this.lastExeCandle) {
            return
        }
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
        if (!this.currCandle) {
            console.log('No market data yet')
            return false
        }

        if (this.numPositions !== 0) {
            console.log('Cannot have more than one position')
            return false
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

        return true
    }

    closePosition() {
        if (this.numPositions === 0) {
            console.log('no trade to close')
            return false
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

        return true
    }

    prepTradeHistoryForDB() {
        const simpleTradeHistory = this.tradeHistory.map((item) => {
            return {
                type: item['type'],
                outcome: item['outcome'],
                startTime: item['start-time'],
                endTime: item['end-time']
            }
        })

        let max = -Infinity
        let min = Infinity
        let profit = 0
        simpleTradeHistory.forEach((item) => {
            if (item['outcome'] > max) {
                max = item['outcome']
            }

            if (item['outcome'] < min) {
                min = item['outcome']
            }

            profit += item['outcome']
        })

        this.finalTradeHistory = {
            maxOutcome: max,
            minOutcome: min,
            profit: profit,

            history: simpleTradeHistory
        }
    }

    saveAndBroadCastHistory(gameStatus, chartDataId) {
        if (this.numPositions !== 0) {
            this.closePosition()
        }

        if (gameStatus === GameStatus.forReal) {
            this.prepTradeHistoryForDB()
            localStorage.setItem(SAVED_TRADE_HISTORY, JSON.stringify(this.finalTradeHistory))
            localStorage.setItem(LAST_PLAYED_DATA_ID, chartDataId)
        }

        this.eventBroadCaster.distribute(FULL_TRADE_HISTORY, this.tradeHistory)
    }
}