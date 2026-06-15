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
import { globalStatsSchema, histogramDataSchema, surveyDataSchema, tradeHistoryDataSchema } from "../data_schema.js";

function getAndValidateData(key, schema) {
    try {
        const item = localStorage.getItem(key)
        if (!item) {
            return null
        }

        const parsedItem = JSON.parse(item)
        const validated = schema.parse(parsedItem)

        return validated
        
    } catch (error) {
        console.log('Error on trying to read from local storate:', error)
        return null
    }
}

async function ending() {
    const surveyData = getAndValidateData(SAVED_SURVEY_KEY, surveyDataSchema)
    const tradeHistoryData = getAndValidateData(SAVED_TRADE_HISTORY, tradeHistoryDataSchema)

    if (surveyData === null || tradeHistoryData === null) {
        window.location.href = '../errors/not_ended_yet.html'
        return
    } 

    const dataSavedStatus = localStorage.getItem(DATA_SAVED_DB_STATUS_KEY)
    if (dataSavedStatus !== DATA_SAVED_DB_SUCCESSFULLY_ADDED) {
        try {
            await saveData(surveyData, tradeHistoryData)
        } catch (error) {
            console.log('Failed to save data:', error)
        }
    }

    let globalStats = getAndValidateData(SAVED_STATS_KEY, globalStatsSchema)
    const lastTimeSavedStatStr = localStorage.getItem(LAST_SAVED_STAT_TIME_KEY)
    if (globalStats === null || savedStatsExpired(lastTimeSavedStatStr)) {
        try {
            globalStats = await getGlobalStats(tradeHistoryData['profit'])
        } catch (error) {
            console.log('Failed to retrive stats:', error)
        }
    }

    try {
        renderGlobalStats(globalStats)
    } catch (error) {
        console.log('Failed to render stats:', error)
    }

    let histogramData = getAndValidateData(SAVED_HIST_KEY, histogramDataSchema)
    const lastTimeSavedHistStr = localStorage.getItem(LAST_SAVED_HIST_TIME_KEY)
    if (histogramData === null || savedStatsExpired(lastTimeSavedHistStr)) {
        try {
            histogramData = await getHistData()
        } catch (error) {
            console.log('Failed to get histogram data:', error)
        }

    }

    try {
        renderHist(histogramData, tradeHistoryData['profit'])
    } catch (error) {
        console.log('Failed to render histogram:', error)
    }
}

ending()


