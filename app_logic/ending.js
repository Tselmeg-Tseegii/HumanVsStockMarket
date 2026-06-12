import { SAVED_SURVEY_KEY, SAVED_TRADE_HISTORY } from "./constants.js";

const surveyData = JSON.parse(localStorage.getItem(SAVED_SURVEY_KEY))
const tradeHistoryData = JSON.parse(localStorage.getItem(SAVED_TRADE_HISTORY))

if (surveyData === null || tradeHistoryData === null) {

} else {
    
}

