import { Chart } from "./game_logic_functions/chart.js"
import { PriceDataContainer } from "./game_logic_functions/price_container.js"
import { EventBroadCaster } from "./game_logic_functions/event_broad_caster.js"
import { 
    TradeExecute,
    TRADE_EXED,
    UNREALISED_PROFIT_UPDATE,
    HISTORY_UPDATE
} from "./game_logic_functions/trade_execution.js"
import { RealisedProfitRender, UnrealisedProfitRender } from "./game_logic_functions/current_profit_render.js"
import { TradeHistoryRender } from "./game_logic_functions/trade_history.js"
import { 
    FULL_TRADE_HISTORY,
    INITIAL_DATA_EVENT,
    NEW_CANDLE_EVENT,
    END_OF_DATA
} from "./constants.js"
import { TradeStats } from "./game_logic_functions/local_stats.js"
import { doConfettiInRectangle } from "./game_logic_functions/confetti.js"
import { PerformTutorial, tutorialSteps } from "./tutorial_helper.js"

const priceDataContainer = new PriceDataContainer()
await priceDataContainer.initialiseItSelfWithData('../chart_data.json')

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
    window.location.href = "../ending/ending.html"
})

const doTutorial = new PerformTutorial(tutorialSteps)

doTutorial.start()

const intervalID = setInterval(() => {
    const response = priceDataContainer.getNextCandle()
    if (response && !response['thereIsMore'] || response === null) {
        clearInterval(intervalID)

        evenBroadCaster.distribute(END_OF_DATA)

        return
    }
    if (response) {
        evenBroadCaster.distribute(NEW_CANDLE_EVENT, response['candle'])
    }
    
}, 1000)

