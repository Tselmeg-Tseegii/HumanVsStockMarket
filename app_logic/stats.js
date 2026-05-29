import { SAVED_TRADE_HISTORY } from "./constants.js"


export class TradeStats {
    constructor(eventBroadCaster) {
        this.eventBroadCaster = eventBroadCaster
        this.tradeHistory = []
    }

    recieveTradeHistory(tradeHistoryMsg) {
        this.tradeHistory = tradeHistoryMsg
    }

}