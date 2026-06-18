import { DATA_SAVED_DB_STATUS_KEY, DATA_SAVED_DB_SUCCESSFULLY_ADDED } from "../constants.js";

export async function saveData(surveyData, tradeHistoryData) {
    const response = await fetch('/saveData', {
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