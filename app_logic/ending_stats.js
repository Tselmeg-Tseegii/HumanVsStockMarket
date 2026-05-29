

export class EndingStat {
    constructor() {
        this.tradeHistory = []
    }

    getTradeHistory(tradeHistory) {
        this.tradeHistory = tradeHistory

        console.log(tradeHistory)
    }
}