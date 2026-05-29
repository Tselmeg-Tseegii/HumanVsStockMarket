import { SAFE_TO_REDIRECT_END_STATS } from "./main.js"


export class EndingStat {
    constructor(eventBroadCaster) {
        this.tradeHistory = []
        this.eventBroadCaster = eventBroadCaster
    }

    getTradeHistory(tradeHistory) {
        this.tradeHistory = tradeHistory

        console.log(tradeHistory)

        this.eventBroadCaster.distribute(SAFE_TO_REDIRECT_END_STATS)
    }
}