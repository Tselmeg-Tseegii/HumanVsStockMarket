import { LAST_SAVED_STAT_TIME_KEY, SAVED_STATS_KEY } from "../constants.js";


export async function getGlobalStats(profit) {
    const response = await fetch(`http://192.168.20.22:5050/globalStats/${profit}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json' 
        },
    });

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
    maxTradeElem.textContent = `$${globalStats['maxOutcome']}`
    minTradeElem.textContent = `$${globalStats['minOutcome']}`

    const rank = globalStats['profitRank']
    const total = globalStats['totalEntries']
    rankingElem.textContent = `${(((total - rank) / total) * 100).toFixed(2)}%`
}

