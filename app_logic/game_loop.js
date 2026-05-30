import { Chart } from "./chart.js"
import { PriceDataContainer } from "./price_container.js"
import { EventBroadCaster } from "./event_broad_caster.js"
import { 
    TradeExecute,
    TRADE_EXED,
    UNREALISED_PROFIT_UPDATE,
    HISTORY_UPDATE
} from "./trade_execution.js"
import { RealisedProfitRender, UnrealisedProfitRender } from "./current_profit_render.js"
import { TradeHistoryRender } from "./trade_history.js"
import { FULL_TRADE_HISTORY } from "./constants.js"
import { TradeStats } from "./stats.js"
import { doConfettiInRectangle } from "./confetti.js"

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
const tradeStatsCalc = new TradeStats(evenBroadCaster)

evenBroadCaster.on(INITIAL_DATA_EVENT, (data) => {mainChart.initialiseChartWithData(data)})
evenBroadCaster.distribute(INITIAL_DATA_EVENT, priceDataContainer.getInitialData())

evenBroadCaster.on(NEW_CANDLE_EVENT, (candle) => {mainChart.updateChartWithCandle(candle)})
evenBroadCaster.on(NEW_CANDLE_EVENT, (candle) => {tradeExecuter.updateCurrCandle(candle)})

evenBroadCaster.on(END_OF_DATA, () => {tradeExecuter.saveAndBroadCastHistory()})
evenBroadCaster.on(FULL_TRADE_HISTORY, (tradeHist) => {tradeStatsCalc.recieveTradeHistory(tradeHist)})

evenBroadCaster.on(FULL_TRADE_HISTORY, (tradeHist) => {mainChart.displayTradeLines(tradeHist)})

evenBroadCaster.on(TRADE_EXED, (tradeInfo) => {mainChart.handleTradeExecution(tradeInfo)})
evenBroadCaster.on(TRADE_EXED, (tradeInfo) => {realisedProfitRender.updateBalance(tradeInfo)})
evenBroadCaster.on(UNREALISED_PROFIT_UPDATE, (unrealisedProfitInfo) => {unrealisedProfitRender.updateBalance(unrealisedProfitInfo)})
evenBroadCaster.on(HISTORY_UPDATE, (tradeInfo) => {tradeHistoryRender.updateHistory(tradeInfo)})

//ending stats sequence
evenBroadCaster.on(END_OF_DATA, () => {
    const unrealisedProfitPanel = document.querySelector('.main-loop .panels-container .right-panel .unrealised-profit')
    const realisedProfitPanel = document.querySelector('.main-loop .panels-container .right-panel .realised-profit')

    const statsPanel = document.querySelector('.main-loop .panels-container .right-panel .trade-stats-card')
    const finishedButton = document.querySelector('.main-loop .panels-container .right-panel .finished-looking-button')

    const finishedMessage = document.querySelector('.main-loop .end-of-data-texts')

    finishedMessage.classList.remove('hidden')

    unrealisedProfitPanel.classList.add('hidden')
    realisedProfitPanel.classList.add('hidden')

    statsPanel.classList.remove('hidden')
    tradeStatsCalc.displayStats()

    mainChart.enableNavigation()

    finishedButton.classList.remove('hidden')

    const buyButton = document.querySelector('.main-loop .panels-container .left-panel .button-row .buy-button')
    const sellButton = document.querySelector('.main-loop .panels-container .left-panel .button-row .sell-button')
    const closeButton = document.querySelector('.main-loop .panels-container .left-panel .button-row .close-button')

    buyButton.classList.add('hidden')
    sellButton.classList.add('hidden')
    closeButton.classList.add('hidden')

    doConfettiInRectangle('.main-loop .panels-container .left-panel .chart-rectangle', 60, 60, 45)
})

const finishedButton = document.querySelector('.main-loop .panels-container .right-panel .finished-looking-button')
finishedButton.addEventListener('click', () => {
    window.location.href = "ending.html"
})

const intervalID = setInterval(() => {
    const response = priceDataContainer.getNextCandle()
    if (response && !response['thereIsMore']) {
        evenBroadCaster.distribute(END_OF_DATA)

        clearInterval(intervalID)
        return
    }

    evenBroadCaster.distribute(NEW_CANDLE_EVENT, response['candle'])
}, 1000)

