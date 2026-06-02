
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

    console.log(surveyData)

    window.location.href = '../game_loop/game_loop.html'
})

