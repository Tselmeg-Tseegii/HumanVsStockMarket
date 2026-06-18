import { SAVED_SURVEY_KEY, SAVED_SURVEY_STATE_KEY, SURVEY_COMPLETE } from "./constants.js";
import { showError } from "./error.js";

async function survey() {
    const surveyStatus = localStorage.getItem(SAVED_SURVEY_STATE_KEY);
    if (surveyStatus === SURVEY_COMPLETE) {
        window.location.href = '../errors/cant_do_survey_again.html';
        return;
    }

    function getRadioValue(name) {
        const element = document.querySelector(`input[name="${name}"]:checked`);
        return element ? Number(element.value) : null;
    }

    function getRadioString(name) {
        const element = document.querySelector(`input[name="${name}"]:checked`);
        return element ? element.value : null;
    }

    // Branching Logic
    const studentRadios = document.querySelectorAll('input[name="isStudent"]');
    const studentSection = document.getElementById('student-section');
    const professionSection = document.getElementById('profession-section');

    studentRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'yes') {
                studentSection.classList.remove('hidden');
                professionSection.classList.add('hidden');
            } else {
                studentSection.classList.add('hidden');
                professionSection.classList.remove('hidden');
            }
        });
    });

    const degreeInput = document.getElementById('degree');
    const degreeErrorEl = document.getElementById('degree-error');
    const degreeQuestionLabel = document.querySelector('label[for="degree"]');
    
    const professionInput = document.getElementById('profession');
    const professionErrorEl = document.getElementById('profession-error');
    const professionQuestionLabel = document.querySelector('label[for="profession"]');

    // Real-time degree validation
    degreeInput.addEventListener('input', (e) => {
        const currentValue = e.target.value;
        const invalidCharMatch = currentValue.match(/[^a-zA-Z0-9\s.,'-]/);

        if (invalidCharMatch) {
            degreeQuestionLabel.classList.add('error');
            degreeErrorEl.textContent = `You cannot add this. Invalid character detected: "${invalidCharMatch[0]}"`;
            degreeErrorEl.style.display = 'block';
        } else if (currentValue.length > 100) {
            degreeQuestionLabel.classList.add('error');
            degreeErrorEl.textContent = "Degree name too long (max 100 characters).";
            degreeErrorEl.style.display = 'block';
        } else {
            degreeQuestionLabel.classList.remove('error');
            degreeErrorEl.style.display = 'none';
            degreeErrorEl.textContent = '';
        }
    });

    // Real-time profession validation
    professionInput.addEventListener('input', (e) => {
        const currentValue = e.target.value;
        const invalidCharMatch = currentValue.match(/[^a-zA-Z0-9\s.,'-]/);

        if (invalidCharMatch) {
            professionQuestionLabel.classList.add('error');
            professionErrorEl.textContent = `You cannot add this. Invalid character detected: "${invalidCharMatch[0]}"`;
            professionErrorEl.style.display = 'block';
        } else if (currentValue.length > 100) {
            professionQuestionLabel.classList.add('error');
            professionErrorEl.textContent = "Profession name too long (max 100 characters).";
            professionErrorEl.style.display = 'block';
        } else {
            professionQuestionLabel.classList.remove('error');
            professionErrorEl.style.display = 'none';
            professionErrorEl.textContent = '';
        }
    });

    const submitButton = document.querySelector('.submit-btn');
    submitButton.addEventListener('click', () => {
        document.querySelectorAll('.question.error').forEach(el => el.classList.remove('error'));
        
        let isValid = true;

        const flagError = (inputName) => {
            const inputEl = document.querySelector(`input[name="${inputName}"]`);
            if (inputEl) {
                inputEl.closest('.form-group').querySelector('.question').classList.add('error');
            }
            isValid = false;
        };

        const isStudent = getRadioString('isStudent');
        if (!isStudent) flagError('isStudent');

        let finalDegree = "not applicable";
        let finalYear = "not applicable";
        let finalProfession = "not applicable";

        if (isStudent === 'yes') {
            const degreeValue = degreeInput.value.trim();
            const invalidCharMatch = degreeValue.match(/[^a-zA-Z0-9\s.,'-]/);

            if (!degreeValue) {
                degreeQuestionLabel.classList.add('error');
                degreeErrorEl.textContent = "This field is required.";
                degreeErrorEl.style.display = 'block';
                isValid = false;
            } else if (degreeValue.length > 100) {
                degreeQuestionLabel.classList.add('error');
                degreeErrorEl.textContent = "Degree name too long (max 100 characters).";
                degreeErrorEl.style.display = 'block';
                isValid = false;
            } else if (invalidCharMatch) {
                degreeQuestionLabel.classList.add('error');
                degreeErrorEl.textContent = `You cannot add this. Invalid character detected: "${invalidCharMatch[0]}"`;
                degreeErrorEl.style.display = 'block';
                isValid = false;
            } else {
                finalDegree = degreeValue;
            }

            if (!document.querySelector('input[name="year"]:checked')) {
                flagError('year');
            } else {
                // If value is "5+", parsefloat gets 5 which works fine, but be mindful if logic needs to distinguish
                finalYear = parseFloat(document.querySelector('input[name="year"]:checked').value);
            }
        } else if (isStudent === 'no') {
            const profValue = professionInput.value.trim();
            const invalidCharMatch = profValue.match(/[^a-zA-Z0-9\s.,'-]/);

            if (!profValue) {
                professionQuestionLabel.classList.add('error');
                professionErrorEl.textContent = "This field is required.";
                professionErrorEl.style.display = 'block';
                isValid = false;
            } else if (profValue.length > 100) {
                professionQuestionLabel.classList.add('error');
                professionErrorEl.textContent = "Profession name too long (max 100 characters).";
                professionErrorEl.style.display = 'block';
                isValid = false;
            } else if (invalidCharMatch) {
                professionQuestionLabel.classList.add('error');
                professionErrorEl.textContent = `You cannot add this. Invalid character detected: "${invalidCharMatch[0]}"`;
                professionErrorEl.style.display = 'block';
                isValid = false;
            } else {
                finalProfession = profValue;
            }
        }

        if (getRadioValue('betting') === null) flagError('betting');
        if (getRadioValue('trading') === null) flagError('trading');
        if (getRadioValue('familiarity') === null) flagError('familiarity');

        if (!isValid) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            showError('Error: some questions missing or misformatted')
            return; 
        }

        const surveyData = {
            isUniversityStudent: isStudent === 'yes',
            profession: finalProfession,
            degree: finalDegree,
            yearOfStudy: finalYear,
            bettingExperience: getRadioValue('betting'),
            tradingExperience: getRadioValue('trading'),
            familiarityScore: getRadioValue('familiarity'),
            maxAcceptedLoss: Number(document.getElementById('loss-input').value),
            riskyInvestmentAmount: Number(document.getElementById('invest-input').value)
        };

        localStorage.setItem(SAVED_SURVEY_KEY, JSON.stringify(surveyData));
        localStorage.setItem(SAVED_SURVEY_STATE_KEY, SURVEY_COMPLETE);

        window.location.href = '../game_loop/game_loop.html';
    });
}

try {
    survey()
} catch (error) {
    console.log('Error in survey:', error)
    showError('Error during survey')
}