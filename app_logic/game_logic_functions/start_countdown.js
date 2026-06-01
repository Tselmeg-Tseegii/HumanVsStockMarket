

export function startCountDown(startingNum) {
    return new Promise((resolve) => {
        let countDownStart = startingNum
        const countDownNumberElem = document.getElementById('countdown-number')
        const tutorialOverlay = document.getElementById('tutorial-overlay')
        tutorialOverlay.classList.add('active')
        countDownNumberElem.classList.remove('hidden')
        countDownNumberElem.textContent = ''
        const countDownId = setInterval(() => {

            if (countDownStart < 0) {
                tutorialOverlay.classList.remove('active')
                countDownNumberElem.classList.add('hidden')
                clearInterval(countDownId)

                resolve('Finished')
                return
            }

            if (countDownStart === 0) {
                countDownNumberElem.textContent = 'START'
            } else {
                countDownNumberElem.textContent = countDownStart
            }

            countDownStart-- 
        }, 1000)
    })
}