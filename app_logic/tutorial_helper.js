
export const tutorialSteps = [
    {
        element: '.chart-rectangle',
        text: 'Here is the chart that shows the historical price movement of a certain asset',
        isButton: false
    },
    {
        element: '.buy-button', 
        text: 'Click here to BUY one asset at market price, if you predict the price will go UP',
        isButton: true
    },
    {
        element: '.chart-rectangle',
        text: 'You can see the effect of the BUY transaction on the chart',
        isButton: false
    },
    {
        element: '.unrealised-profit',
        text: 'You can see the live value of the open position here',
        isButton: false
    },
    {
        element: '.close-button', 
        text: 'Click here to CLOSE the current trade',
        isButton: true
    },
    {
        element: '.chart-rectangle',
        text: 'You can see the effect of the CLOSE transaction on the chart',
        isButton: false
    },
    {
        element: '.realised-profit',
        text: 'You can see that your unrealised profit has now been realised',
        isButton: false
    },
    {
        element: '.sell-button', 
        text: 'Click here to SELL one asset at market price, if you predict the price will go DOWN',
        isButton: true
    },
]

export class PerformTutorial {
    constructor(tutorialSteps) {
        this.tutorialSteps = tutorialSteps
        this.tooltip = document.getElementById('tutorial-tooltip')
        this.overlay = document.getElementById('tutorial-overlay')
    }

    start() {
        this.overlay.classList.add('active')
        this.overlay.classList.remove('hidden')

        for (let i = 0; i < this.tutorialSteps.length; i++) {
            this.showTutorialStep(i)
        }
    }

    finishTutorialStep(currStep) {
        const currStepData = this.tutorialSteps[currStep]
        const currElement = document.querySelector(currStepData['element'])

        if (!currElement) {
            return
        }

        currElement.classList.remove('tutorial-highlight')

        this.tooltip.classList.add('hidden')
        this.tooltip.innerHTML = ''
    }

    showTutorialStep(currStep) {
        const currStepData = this.tutorialSteps[currStep]
        const currElement = document.querySelector(currStep['element'])

        if (!currElement) {
            return
        }

        currElement.classList.add('tutorial-highlight')

        const textContainer = document.createElement('div')
        textContainer.textContent = currStepData['text']

        if (currStepData['isButton']) {
            const doneButton = document.createElement('button')
            doneButton.textContent = 'Next'
            doneButton.className = 'tooltip-button'

            doneButton.addEventListener('click', () => {
                this.finishTutorialStep(currStep)
            })
            this.tooltip.appendChild(doneButton)
        } else {
            currElement.addEventListener('click', function finishUp() {
                currElement.removeEventListener('click', finishUp)
                this.finishTutorialStep(currStep)
            })
        }
        this.tooltip.appendChild(textContainer)

        this.tooltip.classList.remove('hidden')
        
        const rect = currElement.getBoundingClientRect()
        this.tooltip.style.top = `${rect.bottom + window.scrollY + 15}px`
        this.tooltip.style.left = `${rect.left + window.scrollX}px`

    }
}