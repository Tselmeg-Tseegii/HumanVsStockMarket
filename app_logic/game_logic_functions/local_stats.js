import { blackColor, greenColor, sellRedColor } from "../constants.js"
import { TRADE_EXE_BOUGHT } from "./trade_execution.js"


export class TradeStats {
    recieveTradeHistory(tradeHistoryMsg) {
        this.tradeHistory = tradeHistoryMsg

        this.calculateStats()
    }

    calculateStats() {
        this.netProfit = 0
        this.numTrades = this.tradeHistory.length

        this.winrate = 0

        this.buyWinRate = 0
        this.numBuy = 0
        this.sellWinRate = 0
        this.numSell = 0

        this.tradeHistory.forEach((trade) => {
            this.netProfit += trade['outcome']

            if (trade['outcome'] > 0) {
                this.winrate++

                if (trade['type'] === TRADE_EXE_BOUGHT) {
                    this.buyWinRate++
                } else {
                    this.sellWinRate++
                }
            }

            if (trade['type'] === TRADE_EXE_BOUGHT) {
                this.numBuy++
            } else {
                this.numSell++
            }

        })
        this.winrate = (this.winrate / this.numTrades) * 100
        this.buyWinRate = (this.buyWinRate / this.numBuy) * 100
        this.sellWinRate = (this.sellWinRate / this.numSell) * 100
    }

    displayStats() {
        const netProfitText = document.getElementById('stats-net-profit')
        const numTradesText = document.getElementById('stats-num-trades')
        const winRateText = document.getElementById('stats-win-rate')
        const buyWinRateText = document.getElementById('stats-buy-win-rate')
        const sellWinRateText = document.getElementById('stats-sell-win-rate')

        netProfitText.textContent = `$${this.netProfit.toFixed(2)}`
        if (this.netProfit > 0) {
            netProfitText.style.color = greenColor
        } else if (this.netProfit < 0) {
            netProfitText.style.color = sellRedColor
        } else {
            netProfitText.style.color = blackColor
        }
        
        numTradesText.textContent = `${this.numTrades}`
        winRateText.textContent = `${this.winrate.toFixed(2)}%`
        buyWinRateText.textContent = `${this.buyWinRate.toFixed(2)}%`
        sellWinRateText.textContent = `${this.sellWinRate.toFixed(2)}%`
    }


}