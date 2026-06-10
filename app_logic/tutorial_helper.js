import { PAUSE_GAME, SAVED_GAME_STATE_KEY, TUTORIAL_END_TEXT, TUTORIAL_FINISH_BUTTON_TEXT, TUTORIAL_FINISHED, UNPAUSE_GAME } from "./constants.js"


export class PerformTutorial {
    constructor(eventBroadcaster) {
        this.eventBroadcaster = eventBroadcaster
        this.tooltip = document.getElementById('tutorial-tooltip')
        this.overlay = document.getElementById('overlay')

        this.currentStep = 0
        this.tutorialStarted = false

        this.tutorialSteps = [
            {
                element: '.chart-rectangle',
                text: 'Here is the chart that shows the historical price movement of a certain asset',
                isButton: false,
                needPauseGame: false,
            },
            {
                element: '.buy-button', 
                text: 'Click here to BUY one asset at market price, if you predict the price will go UP',
                isButton: true,
                needPauseGame: true,
            },
            {
                element: '.chart-rectangle',
                text: 'You can see the effect of the BUY transaction on the chart',
                isButton: false,
                needPauseGame: false,
            },
            {
                element: '.unrealised-profit',
                text: 'You can see the live value of the open position here',
                isButton: false,
                needPauseGame: false,
            },
            {
                element: '.close-button', 
                text: 'Click here to CLOSE the current trade',
                isButton: true,
                needPauseGame: true,
            },
            {
                element: '.chart-rectangle',
                text: 'You can see the effect of the CLOSE transaction on the chart',
                isButton: false,
                needPauseGame: false,
            },
            {
                element: '.realised-profit',
                text: 'You can see that your unrealised profit has now been realised',
                isButton: false,
                needPauseGame: true,
            },
            {
                element: '.sell-button', 
                text: 'Click here to SELL one asset at market price, if you predict the price will go DOWN',
                isButton: true,
                needPauseGame: true,
            },
        ]
    }

    start() {
        if (this.tutorialStarted === true) {
            return
        }
        this.overlay.classList.add('active')
        this.tutorialStarted = true

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

        if (currStepData['needPauseGame'] === true) {
            this.eventBroadcaster.distribute(UNPAUSE_GAME)
        }

        currElement.classList.remove('tutorial-highlight')

        this.tooltip.classList.add('hidden')
        this.tooltip.innerHTML = ''

        this.currentStep++

        if (this.currentStep < this.tutorialSteps.length && !forceably) {
            this.showTutorialStep(this.currentStep);
        } else {
            this.finish()
        }
    }

    finish() {
        this.eventBroadcaster.distribute(PAUSE_GAME)
        const startText = document.getElementById('start-text')
        startText.textContent = TUTORIAL_END_TEXT
        const startButton = document.getElementById('start-button')
        startButton.textContent = TUTORIAL_FINISH_BUTTON_TEXT
        startButton.classList.remove('hidden')
        startText.classList.remove('hidden')

        startButton.addEventListener('click', () => {
            startButton.classList.add('hidden')
            startText.classList.add('hidden')
            this.overlay.classList.remove('active');
            this.eventBroadcaster.distribute(UNPAUSE_GAME)

        }, {once: true})

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

        if (currStepData['needPauseGame'] === true) {
            this.eventBroadcaster.distribute(PAUSE_GAME)
            console.log('attemted to pause game')
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