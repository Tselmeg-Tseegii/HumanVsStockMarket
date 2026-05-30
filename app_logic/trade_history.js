import { greenColor, sellRedColor } from "./constants.js"
import { 
    TRADE_EXE_BOUGHT
} from "./trade_execution.js"

export class TradeHistoryRender {
    constructor() {
        this.list = document.querySelector('.main-loop .panels-container .right-panel .trade-history .trade-history-content .list')
        this.numTrades = 0
    }

    updateHistory(tradeHistoryItem) {
        this.numTrades++
        const newItem = document.createElement('li')

        const numCol = document.createElement('div')
        numCol.classList.add('col-num')
        numCol.textContent = `${this.numTrades}`

        const typeCol = document.createElement('div')
        typeCol.classList.add('col-type')
        if (tradeHistoryItem.type === TRADE_EXE_BOUGHT) {
            typeCol.textContent = 'Buy'
        } else {
            typeCol.textContent = 'Sell'
        }

        const outcomeCol = document.createElement('div')
        outcomeCol.classList.add('col-outcome')
        outcomeCol.textContent = `$${tradeHistoryItem.outcome.toFixed(2)}`
        if (tradeHistoryItem.outcome > 0) {
            outcomeCol.style.color = greenColor
        } else if (tradeHistoryItem.outcome < 0) {
            outcomeCol.style.color = sellRedColor
        }

        newItem.appendChild(numCol)
        newItem.appendChild(typeCol)
        newItem.appendChild(outcomeCol)

        this.list.prepend(newItem)
        this.list.scrollTop = 0
    }

}