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
    END_OF_DATA,
    SAVED_GAME_STATE_KEY,
    GAME_FINISHED,
    TUTORIAL_FINISHED,
    TUTORIAL_START_TEXT,
    GAME_START_TEXT,
    PAUSE_GAME,
    UNPAUSE_GAME,
    START_BUTTON_TEXT
} from "./constants.js"
import { TradeStats } from "./game_logic_functions/local_stats.js"
import { doConfettiInRectangle } from "./game_logic_functions/confetti.js"
import { PerformTutorial, tutorialSteps } from "./tutorial_helper.js"
import { startCountDown } from "./game_logic_functions/start_countdown.js"
import { RedirectNeeded } from "./error.js"

class GameLoop {
    constructor() {
        this.isTutorialMode = false
        this.gamePaused = false

        this.priceDataContainer = null
        this.evenBroadCaster = null

        this.mainChart = null
        this.tradeExecuter = null
        this.tradeStatsCalc = null
        this.doTutorial = null

        this.realisedProfitRender = null
        this.tradeHistoryRender = null
    }

    async start() {
        try {
            this.checkGameState()

            const startText = document.getElementById('start-text')
            if (this.isTutorialMode === true) {
                startText.textContent = TUTORIAL_START_TEXT
            } else {
                startText.textContent = GAME_START_TEXT
            }

            await this.initialiseGameData()

            this.initialiseFunctionObjects()

            this.bindGameLoopEventsToEventBroadcaster()
            this.bindGameEndEventsToEventBroadcaster()

            const startButton = document.getElementById('start-button')
            startButton.textContent = START_BUTTON_TEXT
            startButton.addEventListener('click', async () => {
                startButton.classList.add('hidden')
                startText.classList.add('hidden')

                await startCountDown(3)

                this.mainLoop()

            }, {once: true})

        } catch (error) {
            if (error instanceof RedirectNeeded) {
                window.location.href = error.redirectUrl
                return
            }

            console.log('Error:', error)
        }
    }

    checkGameState() {
        const gameStatus = localStorage.getItem(SAVED_GAME_STATE_KEY)
        if (gameStatus === GAME_FINISHED) {
            throw new RedirectNeeded('../errors/cant_play_again.html')
        } else if (gameStatus == null) {
            this.isTutorialMode = true
        }
    }

    async initialiseGameData() {
        this.priceDataContainer = new PriceDataContainer()

        let dataPath = ''
        if (this.isTutorialMode === true) {
            dataPath = '../tut_chart_data.json'
        } else {
            dataPath = '../chart_data.json'
        }

        try {
            await this.priceDataContainer.initialiseItSelfWithData(dataPath)
        } catch (error) {
            console.log('Could not initialise the chart with data:', error)

            throw new RedirectNeeded('../errors/something_wrong.html')
        }
    }

    initialiseFunctionObjects() {
        this.evenBroadCaster = new EventBroadCaster()
        this.mainChart = new Chart()
        this.tradeExecuter = new TradeExecute(this.evenBroadCaster)
        this.realisedProfitRender = new RealisedProfitRender()
        this.unrealisedProfitRender = new UnrealisedProfitRender()
        this.tradeHistoryRender = new TradeHistoryRender()
        this.tradeStatsCalc = new TradeStats(this.evenBroadCaster)
        this.doTutorial = new PerformTutorial(this.evenBroadCaster)
    }

    bindGameLoopEventsToEventBroadcaster() {
        this.evenBroadCaster.on(PAUSE_GAME, () => {this.gamePaused = true})
        this.evenBroadCaster.on(UNPAUSE_GAME, () => {this.gamePaused = false})

        this.evenBroadCaster.on(INITIAL_DATA_EVENT, (data) => {this.mainChart.initialiseChartWithData(data)})
        this.evenBroadCaster.distribute(INITIAL_DATA_EVENT, this.priceDataContainer.getInitialData())

        this.evenBroadCaster.on(NEW_CANDLE_EVENT, (candle) => {this.mainChart.updateChartWithCandle(candle)})
        this.evenBroadCaster.on(NEW_CANDLE_EVENT, (candle) => {this.tradeExecuter.updateCurrCandle(candle)})

        this.evenBroadCaster.on(TRADE_EXED, (tradeInfo) => {this.mainChart.handleTradeExecution(tradeInfo)})
        this.evenBroadCaster.on(TRADE_EXED, (tradeInfo) => {this.realisedProfitRender.updateBalance(tradeInfo)})
        this.evenBroadCaster.on(UNREALISED_PROFIT_UPDATE, (unrealisedProfitInfo) => {this.unrealisedProfitRender.updateBalance(unrealisedProfitInfo)})
        this.evenBroadCaster.on(HISTORY_UPDATE, (tradeInfo) => {this.tradeHistoryRender.updateHistory(tradeInfo)})
    }

    bindGameEndEventsToEventBroadcaster() {
        this.evenBroadCaster.on(END_OF_DATA, () => {this.tradeExecuter.saveAndBroadCastHistory(this.isTutorialMode)})
        this.evenBroadCaster.on(FULL_TRADE_HISTORY, (tradeHist) => {this.tradeStatsCalc.recieveTradeHistory(tradeHist)})

        this.evenBroadCaster.on(FULL_TRADE_HISTORY, (tradeHist) => {this.mainChart.displayTradeLines(tradeHist)})

        this.evenBroadCaster.on(END_OF_DATA, () => {
            if (this.isTutorialMode) {
                this.doTutorial.finishTutorialStep(true)
            }
        })

        this.evenBroadCaster.on(END_OF_DATA, () => {
            this.endingSequence()
        })
    }

    endingSequence() {
        const unrealisedProfitPanel = document.querySelector('.main-loop .panels-container .right-panel .unrealised-profit')
        const realisedProfitPanel = document.querySelector('.main-loop .panels-container .right-panel .realised-profit')

        const statsPanel = document.querySelector('.main-loop .panels-container .right-panel .trade-stats-card')
        const finishedButton = document.querySelector('.main-loop .panels-container .right-panel .finished-looking-button')

        finishedButton.addEventListener('click', () => {
            if (this.isTutorialMode === true) {
                window.location.href = 'game_loop.html'
            } else {
                window.location.href = '../ending/ending.html'
            }
        })

        const finishedMessage = document.querySelector('.main-loop .end-of-data-texts')

        finishedMessage.classList.remove('hidden')

        unrealisedProfitPanel.classList.add('hidden')
        realisedProfitPanel.classList.add('hidden')

        statsPanel.classList.remove('hidden')
        this.tradeStatsCalc.displayStats()

        this.mainChart.enableNavigation()

        finishedButton.classList.remove('hidden')

        const buyButton = document.querySelector('.main-loop .panels-container .left-panel .button-row .buy-button')
        const sellButton = document.querySelector('.main-loop .panels-container .left-panel .button-row .sell-button')
        const closeButton = document.querySelector('.main-loop .panels-container .left-panel .button-row .close-button')

        buyButton.classList.add('hidden')
        sellButton.classList.add('hidden')
        closeButton.classList.add('hidden')

        doConfettiInRectangle('.main-loop .panels-container .left-panel .chart-rectangle', 60, 60, 45)
    }

    mainLoop() {
        const gameLoopId = setInterval(() => {

            try {
                if (this.gamePaused === true) {
                    return
                }

                if (this.isTutorialMode) {
                    this.doTutorial.start()
                }

                const response = this.priceDataContainer.getNextCandle()
                if (response === null || response['thereIsMore'] === false) {
                    clearInterval(gameLoopId)

                    this.evenBroadCaster.distribute(END_OF_DATA)

                    if (this.isTutorialMode === true) {
                        localStorage.setItem(SAVED_GAME_STATE_KEY, TUTORIAL_FINISHED)
                    } else {
                        localStorage.setItem(SAVED_GAME_STATE_KEY, GAME_FINISHED)
                    }

                    return
                }
                if (response) {
                    this.evenBroadCaster.distribute(NEW_CANDLE_EVENT, response['candle'])
                }

            } catch (error) {
                console.log('Failed to progress to next data:', error)
                this.priceDataContainer.resetToPreviousCandle()
            }
        }, 1000)
    }
}

const game = new GameLoop()

game.start()