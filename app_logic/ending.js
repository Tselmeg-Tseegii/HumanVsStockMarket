import { SAVED_SURVEY_KEY, SAVED_TRADE_HISTORY } from "./constants.js";

const surveyData = JSON.parse(localStorage.getItem(SAVED_SURVEY_KEY))
const tradeHistoryData = JSON.parse(localStorage.getItem(SAVED_TRADE_HISTORY))

if (surveyData === null || tradeHistoryData === null) {

} else {
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
    console.log('Success:', result.message)
}

