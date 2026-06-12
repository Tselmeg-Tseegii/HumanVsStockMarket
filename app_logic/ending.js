import { DATA_SAVED_DB_STATUS_KEY, DATA_SAVED_DB_SUCCESSFULLY_ADDED, SAVED_STATS_KEY, SAVED_SURVEY_KEY, SAVED_TRADE_HISTORY } from "./constants.js";

const surveyData = JSON.parse(localStorage.getItem(SAVED_SURVEY_KEY))
const tradeHistoryData = JSON.parse(localStorage.getItem(SAVED_TRADE_HISTORY))

if (surveyData === null || tradeHistoryData === null) {
    window.location.href = '../errors/not_ended_yet.html'
} 

const dataSavedStatus = localStorage.getItem(DATA_SAVED_DB_STATUS_KEY)
if (dataSavedStatus !== DATA_SAVED_DB_SUCCESSFULLY_ADDED) {
    console.log('SAVING DATA')
    const response = await fetch('http://localhost:5050/saveData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            surveyData: surveyData,
            tradeHistoryData: tradeHistoryData
        }) 
    });

    const result = await response.json();

    if (response.status === 200) {
        localStorage.setItem(DATA_SAVED_DB_STATUS_KEY, DATA_SAVED_DB_SUCCESSFULLY_ADDED)
    }
}

let globalStats = JSON.parse(localStorage.getItem(SAVED_STATS_KEY))
if (globalStats === null) {
    const response = await fetch(`http://localhost:5050/globalStats/${tradeHistoryData['profit']}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json' 
        },
    });

    globalStats = await response.json();

    if (response.status === 200) {
        localStorage.setItem(SAVED_STATS_KEY, JSON.stringify(globalStats))
    }
}

const numPlayersElem = document.querySelector('.num-players .amount')
const maxTradeElem = document.querySelector('.max .amount')
const minTradeElem = document.querySelector('.min .amount')
const rankingElem = document.querySelector('.ranking .amount')

numPlayersElem.textContent = `${globalStats['totalEntries']}`
maxTradeElem.textContent = `$${globalStats['maxOutcome']}`
minTradeElem.textContent = `$${globalStats['minOutcome']}`
rankingElem.textContent = `${((globalStats['profitRank'] / globalStats['totalEntries']) * 100).toFixed(2)}%`


