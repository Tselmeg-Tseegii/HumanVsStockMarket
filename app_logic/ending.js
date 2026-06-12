import { 
    DATA_SAVED_DB_STATUS_KEY, 
    DATA_SAVED_DB_SUCCESSFULLY_ADDED, 
    LAST_SAVED_HIST_TIME_KEY, 
    LAST_SAVED_STAT_TIME_KEY,
    SAVED_HIST_KEY, SAVED_STATS_KEY, 
    SAVED_SURVEY_KEY, 
    SAVED_TRADE_HISTORY 
} from "./constants.js";

import { saveData } from "./ending_functions/save_data.js";
import { getGlobalStats, renderGlobalStats } from "./ending_functions/global_stats.js";
import { getHistData, renderHist } from "./ending_functions/hist.js";
import { savedStatsExpired } from "./ending_functions/saved_stat_expired.js";


const surveyData = JSON.parse(localStorage.getItem(SAVED_SURVEY_KEY))
const tradeHistoryData = JSON.parse(localStorage.getItem(SAVED_TRADE_HISTORY))

if (surveyData === null || tradeHistoryData === null) {
    window.location.href = '../errors/not_ended_yet.html'
} 

const dataSavedStatus = localStorage.getItem(DATA_SAVED_DB_STATUS_KEY)
if (dataSavedStatus !== DATA_SAVED_DB_SUCCESSFULLY_ADDED) {
    saveData(surveyData, tradeHistoryData)
}

let globalStats = JSON.parse(localStorage.getItem(SAVED_STATS_KEY))
const lastTimeSavedStatStr = localStorage.getItem(LAST_SAVED_STAT_TIME_KEY)
if (globalStats === null || savedStatsExpired(lastTimeSavedStatStr)) {
    globalStats = await getGlobalStats(tradeHistoryData['profit'])
}

renderGlobalStats(globalStats)

let histogramData = JSON.parse(localStorage.getItem(SAVED_HIST_KEY))
const lastTimeSavedHistStr = localStorage.getItem(LAST_SAVED_HIST_TIME_KEY)
if (histogramData === null || savedStatsExpired(lastTimeSavedHistStr)) {
    histogramData = await getHistData()
}

console.log(tradeHistoryData['profit'])
console.log(histogramData)
renderHist(histogramData, tradeHistoryData['profit'])
