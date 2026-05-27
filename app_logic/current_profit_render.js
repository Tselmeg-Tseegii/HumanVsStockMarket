import { TRADE_CLOSED } from "./trade_execution.js"

export class CurrentProfitRender {
    constructor() {
        this.currentBalanceText = document.querySelector('.current-balance-amount-text')
        this.currentBalanceText.textContent = 0
    }

    updateBalance(currTradeInfo) {
        this.currentBalanceText.textContent = currTradeInfo.currProfit
    }
}