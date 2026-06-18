import { LAST_SAVED_STAT_TIME_KEY, SAVED_STATS_KEY } from "../constants.js";


export async function getGlobalStats(profit) {
    let response = null
    if (profit !== null) {
        response = await fetch(`/globalStats?profit=${profit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' 
            },
        })
    } else {
        response = await fetch(`/globalStats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' 
            },
        })
    }

    const globalStats = await response.json();

    if (response.status === 200) {
        localStorage.setItem(SAVED_STATS_KEY, JSON.stringify(globalStats))
        localStorage.setItem(LAST_SAVED_STAT_TIME_KEY, JSON.stringify(Date.now()))
        return globalStats
    } else {
        return null
    }
}

export function renderGlobalStats(globalStats) {
    const numPlayersElem = document.querySelector('.num-players .amount')
    const maxTradeElem = document.querySelector('.max .amount')
    const minTradeElem = document.querySelector('.min .amount')
    const rankingElem = document.querySelector('.ranking .amount')

    numPlayersElem.textContent = `${globalStats['totalEntries']}`

    if (globalStats['maxOutcome'] > 0) {
        maxTradeElem.textContent = `$${globalStats['maxOutcome'].toFixed(2)}`
    } else {
        maxTradeElem.textContent = `-$${Math.abs(globalStats['maxOutcome']).toFixed(2)}`
    }

    if (globalStats['minOutcome'] > 0) {
        minTradeElem.textContent = `$${globalStats['minOutcome'].toFixed(2)}`
    } else {
        minTradeElem.textContent = `-$${Math.abs(globalStats['minOutcome']).toFixed(2)}`
    }

    const rank = globalStats['profitRank']
    const total = globalStats['totalEntries']
    if (rank !== -1) {
        rankingElem.textContent = `${(((total - rank) / total) * 100).toFixed(2)}%`
    } else {
        rankingElem.textContent = 'Error'
    }
}