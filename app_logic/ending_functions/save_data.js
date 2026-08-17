import { DATA_SAVED_DB_STATUS_KEY, DATA_SAVED_DB_SUCCESSFULLY_ADDED, LAST_PLAYED_DATA_ID } from "../constants.js";

export async function saveData(tradeHistoryData, currChartId) {
    const response = await fetch('/saveData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            tradeHistoryData: tradeHistoryData
        }) 
    });

    const result = await response.json();

    if (response.status === 200) {
        localStorage.setItem(DATA_SAVED_DB_STATUS_KEY, DATA_SAVED_DB_SUCCESSFULLY_ADDED)
        localStorage.setItem(LAST_PLAYED_DATA_ID, chartDataId)
    }

}