import { SAVED_GAME_STATE_KEY, TUTORIAL_FINISHED } from "./constants.js"


export class PerformTutorial {
    constructor() {
        this.tooltip = document.getElementById('tutorial-tooltip')
        this.overlay = document.getElementById('overlay')

        this.currentStep = 0

        this.tutorialSteps = [
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
    }

    start() {
        const tutorialStatus = localStorage.getItem(SAVED_GAME_STATE_KEY)
        if (tutorialStatus === TUTORIAL_FINISHED) {
            return
        }

        this.overlay.classList.add('active')

        this.showTutorialStep(this.currentStep)
    }

    finishTutorialStep(forceably = false) {
        if (this.currentStep >= this.tutorialSteps.length) {
            return;
        }

        const currStepData = this.tutorialSteps[this.currentStep]
        const currElement = document.querySelector(currStepData['element'])

        if (!currElement) {
            return
        }

        currElement.classList.remove('tutorial-highlight')

        this.tooltip.classList.add('hidden')
        this.tooltip.innerHTML = ''

        this.currentStep++

        if (this.currentStep < this.tutorialSteps.length && !forceably) {
            this.showTutorialStep(this.currentStep);
        } else {
            this.overlay.classList.remove('active');

            localStorage.setItem(SAVED_GAME_STATE_KEY, TUTORIAL_FINISHED)
        }
    }

    positionTooltip(targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const spacing = 15;
        
        const spaceBottom = window.innerHeight - rect.bottom;
        const spaceTop = rect.top;
        const spaceRight = window.innerWidth - rect.right;
        
        let top = 0;
        let left = 0;

        if (spaceBottom >= tooltipRect.height + spacing) {
            top = rect.bottom + spacing;
            left = rect.left;
        } else if (spaceTop >= tooltipRect.height + spacing) {
            top = rect.top - tooltipRect.height - spacing;
            left = rect.left;
        } else if (spaceRight >= tooltipRect.width + spacing) {
            top = rect.top;
            left = rect.right + spacing;
        } else {
            top = rect.top;
            left = rect.left - tooltipRect.width - spacing;
        }

        if (left + tooltipRect.width > window.innerWidth) {
            left = window.innerWidth - tooltipRect.width - spacing;
        }
        if (left < 0) {
            left = spacing;
        }
        
        this.tooltip.style.top = `${top + window.scrollY}px`;
        this.tooltip.style.left = `${left + window.scrollX}px`;
    }

    showTutorialStep(currStep) {
        const currStepData = this.tutorialSteps[currStep]
        const currElement = document.querySelector(currStepData['element'])

        if (!currElement) {
            return
        }

        currElement.classList.add('tutorial-highlight')

        const textContainer = document.createElement('div')
        textContainer.textContent = currStepData['text']
        this.tooltip.appendChild(textContainer)

        if (!currStepData['isButton']) {
            const doneButton = document.createElement('button')
            doneButton.textContent = 'Next'
            doneButton.className = 'tooltip-button'

            doneButton.addEventListener('click', () => {
                this.finishTutorialStep()
            })
            this.tooltip.appendChild(doneButton)
        } else {
            const finishUp = () => {
                currElement.removeEventListener('click', finishUp);
                this.finishTutorialStep();
            };
            currElement.addEventListener('click', finishUp);
        }

        this.tooltip.classList.remove('hidden')
        
        this.positionTooltip(currElement)

    }
}