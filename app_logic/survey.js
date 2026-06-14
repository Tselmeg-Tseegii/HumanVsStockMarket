import { SAVED_SURVEY_KEY, SAVED_SURVEY_STATE_KEY, SURVEY_COMPLETE } from "./constants.js";

async function survey() {
    const surveyStatus = localStorage.getItem(SAVED_SURVEY_STATE_KEY)
    if (surveyStatus === SURVEY_COMPLETE) {
        window.location.href = '../errors/cant_do_survey_again.html'
        return
    }

    function getRadioValue(name) {
        const element = document.querySelector(`input[name="${name}"]:checked`);
        return element ? Number(element.value) : null;
    }

    const submitButton = document.querySelector('.submit-btn')
    submitButton.addEventListener('click', () => {
        const surveyData = {
            degree: document.getElementById('degree').value,
            yearOfStudy: document.querySelector('input[name="year"]:checked') ? parseFloat(document.querySelector('input[name="year"]:checked').value) : null,
            bettingExperience: getRadioValue('betting'),
            tradingExperience: getRadioValue('trading'),
            familiarityScore: getRadioValue('familiarity'),
            maxAcceptedLoss: Number(document.getElementById('loss-input').value),
            riskyInvestmentAmount: Number(document.getElementById('invest-input').value)
        };

        localStorage.setItem(SAVED_SURVEY_KEY, JSON.stringify(surveyData))

        localStorage.setItem(SAVED_SURVEY_STATE_KEY, SURVEY_COMPLETE)

        window.location.href = '../game_loop/game_loop.html'
    })
}

survey()