import { SAVED_SURVEY_KEY, SAVED_SURVEY_STATE_KEY, SURVEY_COMPLETE } from "./constants.js";

const surveyStatus = localStorage.getItem(SAVED_SURVEY_STATE_KEY)
if (surveyStatus === SURVEY_COMPLETE) {
    window.location.href = '../errors/cant_do_survey_again.html'
}


const submitButton = document.querySelector('.submit-btn')
submitButton.addEventListener('click', () => {
    const surveyData = {
        degree: document.getElementById('degree').value,
        yearOfStudy: document.querySelector('input[name="year"]:checked')?.value || "None selected",
        bettingExperience: document.querySelector('input[name="betting"]:checked')?.value,
        tradingExperience: document.querySelector('input[name="trading"]:checked')?.value,
        familiarityScore: document.querySelector('input[name="familiarity"]:checked')?.value,
        maxAcceptedLoss: Number(document.getElementById('loss-input').value),
        riskyInvestmentAmount: Number(document.getElementById('invest-input').value)
      };

    localStorage.setItem(SAVED_SURVEY_KEY, JSON.stringify(surveyData))

    localStorage.setItem(SAVED_SURVEY_STATE_KEY, SURVEY_COMPLETE)

    window.location.href = '../game_loop/game_loop.html'
})

