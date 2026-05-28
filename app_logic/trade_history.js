import { 
    TRADE_EXE_BOUGHT
} from "./trade_execution.js"

export class TradeHistoryRender {
    constructor() {
        this.tradeHistory = []
        this.list = document.querySelector('.trade-history .trade-history-rectangle .list')
    }

    updateHistory(tradeHistoryItem) {
        const newItem = document.createElement('li')

        let tradeType = ''
        if (tradeHistoryItem.type === TRADE_EXE_BOUGHT) {
            tradeType = 'Buy'
        } else {
            tradeType = 'Sell'
        }

        newItem.textContent = `${tradeType} - Outcome: $${tradeHistoryItem.outcome.toFixed(2)}`
        this.list.prepend(newItem)
        this.list.scrollTop = 0
    }

}