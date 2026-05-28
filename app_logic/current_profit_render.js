import { TRADE_CLOSED } from "./trade_execution.js"

export class RealisedProfitRender {
    constructor() {
        this.currentBalanceText = document.querySelector('.main-loop .right-panel .realised-profit .amount-text')
        this.currentBalanceText.textContent = `$${0}`
    }

    updateBalance(currTradeInfo) {
        if (currTradeInfo.type === TRADE_CLOSED) {
            this.currentBalanceText.textContent = `$${currTradeInfo.realisedProfit.toFixed(2)}`
        }
    }
}

export class UnrealisedProfitRender {
    constructor() {
        this.currentBalanceText = document.querySelector('.main-loop .right-panel .unrealised-profit .amount-text')
        this.currentBalanceText.textContent = `$${0}`
    }

    updateBalance(currUpdate) {
        this.currentBalanceText.textContent = `$${currUpdate.unrealisedProfit.toFixed(2)}`
    }
}