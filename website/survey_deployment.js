/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app_logic/constants.js"
/*!********************************!*\
  !*** ./app_logic/constants.js ***!
  \********************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   END_OF_DATA: () => (/* binding */ END_OF_DATA),\n/* harmony export */   FULL_TRADE_HISTORY: () => (/* binding */ FULL_TRADE_HISTORY),\n/* harmony export */   GAME_FINISHED: () => (/* binding */ GAME_FINISHED),\n/* harmony export */   GAME_START_TEXT: () => (/* binding */ GAME_START_TEXT),\n/* harmony export */   INITIAL_DATA_EVENT: () => (/* binding */ INITIAL_DATA_EVENT),\n/* harmony export */   NEW_CANDLE_EVENT: () => (/* binding */ NEW_CANDLE_EVENT),\n/* harmony export */   SAVED_GAME_STATE_KEY: () => (/* binding */ SAVED_GAME_STATE_KEY),\n/* harmony export */   SAVED_SURVEY_STATE_KEY: () => (/* binding */ SAVED_SURVEY_STATE_KEY),\n/* harmony export */   SAVED_TRADE_HISTORY: () => (/* binding */ SAVED_TRADE_HISTORY),\n/* harmony export */   SURVEY_COMPLETE: () => (/* binding */ SURVEY_COMPLETE),\n/* harmony export */   TUTORIAL_FINISHED: () => (/* binding */ TUTORIAL_FINISHED),\n/* harmony export */   TUTORIAL_START_TEXT: () => (/* binding */ TUTORIAL_START_TEXT),\n/* harmony export */   blackColor: () => (/* binding */ blackColor),\n/* harmony export */   buyBlueColor: () => (/* binding */ buyBlueColor),\n/* harmony export */   closeGreyColor: () => (/* binding */ closeGreyColor),\n/* harmony export */   greenColor: () => (/* binding */ greenColor),\n/* harmony export */   sellRedColor: () => (/* binding */ sellRedColor)\n/* harmony export */ });\nconst buyBlueColor = '#2962ff'\nconst sellRedColor = '#f23645'\nconst closeGreyColor = '#afafaf'\nconst greenColor = '#25ae2a'\nconst blackColor = '#000000'\n\nconst SAVED_TRADE_HISTORY = 'trade history'\nconst FULL_TRADE_HISTORY = 'FULL TRADE HISTORY IS SENT'\n\nconst INITIAL_DATA_EVENT = \"INITIAL DATA\"\nconst NEW_CANDLE_EVENT = \"NEW CANDLE\"\nconst END_OF_DATA = \"NO MORE DATA\"\n\nconst SAVED_GAME_STATE_KEY = 'game_progress'\nconst GAME_FINISHED = 'finished playing the game'\nconst TUTORIAL_FINISHED = 'finished the tutorial only'\n\nconst SAVED_SURVEY_STATE_KEY = 'survey_progress'\nconst SURVEY_COMPLETE = 'survey is completed'\n\nconst TUTORIAL_START_TEXT = 'This section is the tutorial level. It is shorter than the main game but all mechanics are the same'\nconst GAME_START_TEXT = 'This section is the real game. You only get one try at this stage.'\n\n\n//# sourceURL=webpack:///./app_logic/constants.js?\n}");

/***/ },

/***/ "./app_logic/survey.js"
/*!*****************************!*\
  !*** ./app_logic/survey.js ***!
  \*****************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ \"./app_logic/constants.js\");\n\n\nconst surveyStatus = localStorage.getItem(_constants_js__WEBPACK_IMPORTED_MODULE_0__.SAVED_SURVEY_STATE_KEY)\nif (surveyStatus === _constants_js__WEBPACK_IMPORTED_MODULE_0__.SURVEY_COMPLETE) {\n    window.location.href = '../errors/cant_do_survey_again.html'\n}\n\n\nconst submitButton = document.querySelector('.submit-btn')\nsubmitButton.addEventListener('click', () => {\n    const surveyData = {\n        degree: document.getElementById('degree').value,\n        yearOfStudy: document.querySelector('input[name=\"year\"]:checked')?.value || \"None selected\",\n        bettingExperience: document.querySelector('input[name=\"betting\"]:checked')?.value,\n        tradingExperience: document.querySelector('input[name=\"trading\"]:checked')?.value,\n        familiarityScore: document.querySelector('input[name=\"familiarity\"]:checked')?.value,\n        maxAcceptedLoss: Number(document.getElementById('loss-input').value),\n        riskyInvestmentAmount: Number(document.getElementById('invest-input').value)\n      };\n\n    console.log(surveyData)\n\n    localStorage.setItem(_constants_js__WEBPACK_IMPORTED_MODULE_0__.SAVED_SURVEY_STATE_KEY, _constants_js__WEBPACK_IMPORTED_MODULE_0__.SURVEY_COMPLETE)\n\n    window.location.href = '../game_loop/game_loop.html'\n})\n\n\n\n//# sourceURL=webpack:///./app_logic/survey.js?\n}");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./app_logic/survey.js");
/******/ 	
/******/ })()
;