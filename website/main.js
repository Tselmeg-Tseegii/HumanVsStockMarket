import { Chart } from "./chart.js"
import { PriceDataContainer } from "./price_container.js"
import { EventBroadCaster } from "./event_broad_caster.js"
import { 
    TradeExecute,
    TRADE_EXED,
} from "./trade_execution.js"

const INITIAL_DATA_EVENT = "INITIAL DATA"
const NEW_CANDLE_EVENT = "NEW CANDLE"

const priceDataContainer = new PriceDataContainer()
await priceDataContainer.initialiseItSelfWithData()

const evenBroadCaster = new EventBroadCaster()
const mainChart = new Chart()
const tradeExecuter = new TradeExecute(evenBroadCaster)

evenBroadCaster.on(INITIAL_DATA_EVENT, (data) => {mainChart.initialiseChartWithData(data)})
evenBroadCaster.distribute(INITIAL_DATA_EVENT, priceDataContainer.getInitialData())

evenBroadCaster.on(NEW_CANDLE_EVENT, (candle) => {mainChart.updateChartWithCandle(candle)})
evenBroadCaster.on(NEW_CANDLE_EVENT, (candle) => {tradeExecuter.updateCurrCandle(candle)})

evenBroadCaster.on(TRADE_EXED, (tradeInfo) => {mainChart.handleTradeExecution(tradeInfo)})

const intervalID = setInterval(() => {
    const newCandle = priceDataContainer.getNextCandle()
    if (!newCandle) {
        clearInterval(intervalID)
        return
    }

    evenBroadCaster.distribute(NEW_CANDLE_EVENT, newCandle)
}, 1000)

