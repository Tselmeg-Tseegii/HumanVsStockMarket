import { SAVED_TRADE_HISTORY } from "./constants.js"


export class TradeStats {
    constructor(eventBroadCaster) {
        this.eventBroadCaster = eventBroadCaster
        this.tradeHistory = sessionStorage.getItem(SAVED_TRADE_HISTORY)

        console.log(this.tradeHistory)
    }

}