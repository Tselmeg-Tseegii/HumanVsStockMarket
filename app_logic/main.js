import { Chart } from "./chart.js"
import { PriceDataContainer } from "./price_container.js"
import { EventBroadCaster } from "./event_broad_caster.js"
import { 
    TradeExecute,
    TRADE_EXED,
    UNREALISED_PROFIT_UPDATE,
    HISTORY_UPDATE,
    FULL_HISTORY
} from "./trade_execution.js"
import { RealisedProfitRender, UnrealisedProfitRender } from "./current_profit_render.js"
import { TradeHistoryRender } from "./trade_history.js"
import { EndingStat } from "./ending_stats.js"

export const INITIAL_DATA_EVENT = "INITIAL DATA"
export const NEW_CANDLE_EVENT = "NEW CANDLE"
export const END_OF_DATA = "NO MORE DATA"
export const SAFE_TO_REDIRECT_END_STATS = "NOW SAFE TO REDIRECT TO END STATISTICS PAGE"

const priceDataContainer = new PriceDataContainer()
await priceDataContainer.initialiseItSelfWithData()

const evenBroadCaster = new EventBroadCaster()
const mainChart = new Chart()
const tradeExecuter = new TradeExecute(evenBroadCaster)
const realisedProfitRender = new RealisedProfitRender()
const unrealisedProfitRender = new UnrealisedProfitRender()
const tradeHistoryRender = new TradeHistoryRender()
const endingStatManager = new EndingStat(evenBroadCaster)

evenBroadCaster.on(INITIAL_DATA_EVENT, (data) => {mainChart.initialiseChartWithData(data)})
evenBroadCaster.distribute(INITIAL_DATA_EVENT, priceDataContainer.getInitialData())

evenBroadCaster.on(NEW_CANDLE_EVENT, (candle) => {mainChart.updateChartWithCandle(candle)})
evenBroadCaster.on(NEW_CANDLE_EVENT, (candle) => {tradeExecuter.updateCurrCandle(candle)})

evenBroadCaster.on(END_OF_DATA, () => {tradeExecuter.saveAndBroadCastHistory()})
evenBroadCaster.on(END_OF_DATA, () => {console.log("called")})


evenBroadCaster.on(TRADE_EXED, (tradeInfo) => {mainChart.handleTradeExecution(tradeInfo)})
evenBroadCaster.on(TRADE_EXED, (tradeInfo) => {realisedProfitRender.updateBalance(tradeInfo)})
evenBroadCaster.on(UNREALISED_PROFIT_UPDATE, (unrealisedProfitInfo) => {unrealisedProfitRender.updateBalance(unrealisedProfitInfo)})
evenBroadCaster.on(HISTORY_UPDATE, (tradeInfo) => {tradeHistoryRender.updateHistory(tradeInfo)})

evenBroadCaster.on(FULL_HISTORY, (tradeHistory) => {endingStatManager.getTradeHistory(tradeHistory)})

evenBroadCaster.on(SAFE_TO_REDIRECT_END_STATS, () => {
    window.location.href = "ending_stats.html"
})

const intervalID = setInterval(() => {
    const newCandle = priceDataContainer.getNextCandle()
    if (!newCandle) {
        evenBroadCaster.distribute(END_OF_DATA)

        clearInterval(intervalID)
        return
    }

    evenBroadCaster.distribute(NEW_CANDLE_EVENT, newCandle)
}, 1000)

