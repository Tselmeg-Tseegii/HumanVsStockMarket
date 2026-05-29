import { blackColor, closeGreyColor, greenColor, sellRedColor } from "./constants.js"
import { TRADE_CLOSED } from "./trade_execution.js"

export class RealisedProfitRender {
    constructor() {
        this.currentBalanceText = document.querySelector('.main-loop .panels-container .right-panel .realised-profit .amount-text')
        this.currentBalanceText.textContent = `$0.00`
    }

    updateBalance(currTradeInfo) {
        if (currTradeInfo.type === TRADE_CLOSED) {
            this.currentBalanceText.textContent = `$${currTradeInfo.realisedProfit.toFixed(2)}`
            if (currTradeInfo.realisedProfit > 0) {
                this.currentBalanceText.style.color = greenColor
            } else if (currTradeInfo.realisedProfit < 0) {
                this.currentBalanceText.style.color = sellRedColor
            } else {
                this.currentBalanceText.style.color = blackColor
            }
        }
    }
}

export class UnrealisedProfitRender {
    constructor() {
        this.currentBalanceText = document.querySelector('.main-loop .panels-container .right-panel .unrealised-profit .amount-text')
        this.currentBalanceText.textContent = `$0.00`
    }

    updateBalance(currUpdate) {
        this.currentBalanceText.textContent = `$${currUpdate.unrealisedProfit.toFixed(2)}`

        if (currUpdate.unrealisedProfit > 0) {
            this.currentBalanceText.style.color = greenColor
        } else if (currUpdate.unrealisedProfit < 0) {
            this.currentBalanceText.style.color = sellRedColor
        } else {
            this.currentBalanceText.style.color = blackColor
        }
    }
}