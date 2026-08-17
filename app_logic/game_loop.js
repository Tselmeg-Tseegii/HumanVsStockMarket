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
    PAUSE_GAME_AFTER_A_PERIOD,
    READY_FOR_REAL,
    GameStatus,
    LAST_PLAYED_DATA_ID,
    PLAYER_GAME_INTENT,
    PLAYER_WANT_GAME,
    CURR_PLAYING_DATA_ID,
    TUTORIAL_CHART_TYPE,
    REAL_GAME_CHART_TYPE,

} from "./constants.js"
import { TradeStats } from "./game_logic_functions/local_stats.js"
import { doConfettiInRectangle } from "./game_logic_functions/confetti.js"
import { PerformTutorial, tutorialSteps } from "./tutorial_helper.js"
import { startCountDown } from "./game_logic_functions/start_countdown.js"
import { RedirectNeeded, showError } from "./error.js"
import { chartDataIdSchema } from "../data_schema.js"
import { getLatestChartId } from "./game_logic_functions/get_from_db.js"

class GameLoop {
    constructor() {
        this.gameStatus = GameStatus.firstTutorial

        this.gamePaused = false
        this.numCandlesToPauseAfter = 0
        this.pauseGameLater = false

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
            await this.checkGameState()

            await this.initialiseGameData()

            this.initialiseFunctionObjects()

            this.bindGameLoopEventsToEventBroadcaster()
            this.bindGameEndEventsToEventBroadcaster()

            this.setupMenu()

        } catch (error) {
            if (error instanceof RedirectNeeded) {
                window.location.href = error.redirectUrl
                return
            }

            showError('Error starting game')
        }
    }

    async checkGameState() {
        const gameStatus = localStorage.getItem(SAVED_GAME_STATE_KEY)
        const lastCompletedChartId = localStorage.getItem(LAST_PLAYED_DATA_ID)

        const currentChartDataId = await getLatestChartId()
        if (currentChartDataId === null) {
            throw new RedirectNeeded('../errors/something_wrong.html')
        }

        localStorage.setItem(CURR_PLAYING_DATA_ID, currentChartDataId)

        const playerIntent = localStorage.getItem(PLAYER_GAME_INTENT)

        if (playerIntent === PLAYER_WANT_GAME) {
            if (gameStatus === GAME_FINISHED && lastCompletedChartId !== null && lastCompletedChartId === currentChartDataId) {
                throw new RedirectNeeded('../errors/cant_play_again.html')
            } else {
                this.gameStatus = GameStatus.forReal
            }
        } else {
            if (gameStatus === null) {
                this.gameStatus = GameStatus.firstTutorial
            } else if (gameStatus === READY_FOR_REAL){
                this.gameStatus = GameStatus.forReal
            } else {
                this.gameStatus = GameStatus.doneTutorial
            }
        }
    }

    async initialiseGameData() {
        this.priceDataContainer = new PriceDataContainer()

        let dataPath = ''
        if (this.gameStatus !== GameStatus.forReal) {
            dataPath = TUTORIAL_CHART_TYPE
        } else {
            dataPath = REAL_GAME_CHART_TYPE
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
        this.evenBroadCaster.on(UNPAUSE_GAME, () => {
            this.gamePaused = false
            this.numCandlesToPauseAfter = 0
            this.pauseGameLater = false
        })
        this.evenBroadCaster.on(PAUSE_GAME_AFTER_A_PERIOD, (numCandlesToPauseAfter) => {
            this.numCandlesToPauseAfter = numCandlesToPauseAfter
            this.pauseGameLater = true
        })

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
        this.evenBroadCaster.on(END_OF_DATA, () => {
            this.tradeExecuter.saveAndBroadCastHistory(this.gameStatus)
        })
        this.evenBroadCaster.on(FULL_TRADE_HISTORY, (tradeHist) => {this.tradeStatsCalc.recieveTradeHistory(tradeHist)})

        this.evenBroadCaster.on(FULL_TRADE_HISTORY, (tradeHist) => {this.mainChart.displayTradeLines(tradeHist)})

        this.evenBroadCaster.on(END_OF_DATA, () => {
            if (this.gameStatus !== GameStatus.forReal) {
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
            if (this.gameStatus !== GameStatus.forReal) {
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

    setupMenu() {
        const startText = document.getElementById('start-text')
        if (this.gameStatus !== GameStatus.forReal) {
            startText.textContent = TUTORIAL_START_TEXT
        } else {
            startText.textContent = GAME_START_TEXT
        }

        const startButton = document.getElementById('start-button')
        const redoTutButton = document.getElementById('redo-tut-button')
        const fastForwardButton = document.getElementById('fastforward-button')

        startButton.classList.remove('hidden')
        startButton.addEventListener('click', async () => {
            startButton.classList.add('hidden')
            redoTutButton.classList.add('hidden')
            fastForwardButton.classList.add('hidden')

            startText.classList.add('hidden')

            await startCountDown(3)

            this.mainLoop()

        }, {once: true})

        if (this.gameStatus === GameStatus.forReal) {
            redoTutButton.classList.remove('hidden')
            redoTutButton.addEventListener('click', async () => {
                startButton.classList.add('hidden')
                redoTutButton.classList.add('hidden')
                fastForwardButton.classList.add('hidden')

                localStorage.setItem(SAVED_GAME_STATE_KEY, TUTORIAL_FINISHED)

                window.location.reload()

            }, {once: true})
        }

        if (this.gameStatus === GameStatus.doneTutorial) {
            fastForwardButton.classList.remove('hidden')
            fastForwardButton.addEventListener('click', async () => {
                startButton.classList.add('hidden')
                redoTutButton.classList.add('hidden')
                fastForwardButton.classList.add('hidden')

                localStorage.setItem(SAVED_GAME_STATE_KEY, READY_FOR_REAL)

                window.location.reload()

            }, {once: true})
        }
    }

    mainLoop() {
        const gameLoopId = setInterval(() => {

            try {
                if (this.gamePaused === true) {
                    return
                }

                if (this.numCandlesToPauseAfter === 0 && this.pauseGameLater === true) {
                    this.gamePaused = true
                    return
                }

                if (this.numCandlesToPauseAfter > 0 && this.pauseGameLater === true) {
                    this.numCandlesToPauseAfter--
                }

                if (this.gameStatus !== GameStatus.forReal) {
                    this.doTutorial.start()
                }

                const response = this.priceDataContainer.getNextCandle()
                if (response === null || response === undefined || response['thereIsMore'] === false) {
                    clearInterval(gameLoopId)

                    this.evenBroadCaster.distribute(END_OF_DATA)

                    if (this.gameStatus === GameStatus.forReal) {
                        localStorage.setItem(SAVED_GAME_STATE_KEY, GAME_FINISHED)
                    } else {
                        localStorage.setItem(SAVED_GAME_STATE_KEY, READY_FOR_REAL)
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