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

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DATA_SAVED_DB_CURR_ATTEMPT_NUM: () => (/* binding */ DATA_SAVED_DB_CURR_ATTEMPT_NUM),\n/* harmony export */   DATA_SAVED_DB_CURR_MAX_ATTEMPTS: () => (/* binding */ DATA_SAVED_DB_CURR_MAX_ATTEMPTS),\n/* harmony export */   DATA_SAVED_DB_STATUS_KEY: () => (/* binding */ DATA_SAVED_DB_STATUS_KEY),\n/* harmony export */   DATA_SAVED_DB_SUCCESSFULLY_ADDED: () => (/* binding */ DATA_SAVED_DB_SUCCESSFULLY_ADDED),\n/* harmony export */   END_OF_DATA: () => (/* binding */ END_OF_DATA),\n/* harmony export */   FULL_TRADE_HISTORY: () => (/* binding */ FULL_TRADE_HISTORY),\n/* harmony export */   GAME_FINISHED: () => (/* binding */ GAME_FINISHED),\n/* harmony export */   GAME_START_TEXT: () => (/* binding */ GAME_START_TEXT),\n/* harmony export */   INITIAL_DATA_EVENT: () => (/* binding */ INITIAL_DATA_EVENT),\n/* harmony export */   NEW_CANDLE_EVENT: () => (/* binding */ NEW_CANDLE_EVENT),\n/* harmony export */   SAVED_GAME_STATE_KEY: () => (/* binding */ SAVED_GAME_STATE_KEY),\n/* harmony export */   SAVED_STATS_KEY: () => (/* binding */ SAVED_STATS_KEY),\n/* harmony export */   SAVED_SURVEY_KEY: () => (/* binding */ SAVED_SURVEY_KEY),\n/* harmony export */   SAVED_SURVEY_STATE_KEY: () => (/* binding */ SAVED_SURVEY_STATE_KEY),\n/* harmony export */   SAVED_TRADE_HISTORY: () => (/* binding */ SAVED_TRADE_HISTORY),\n/* harmony export */   SURVEY_COMPLETE: () => (/* binding */ SURVEY_COMPLETE),\n/* harmony export */   TUTORIAL_FINISHED: () => (/* binding */ TUTORIAL_FINISHED),\n/* harmony export */   TUTORIAL_START_TEXT: () => (/* binding */ TUTORIAL_START_TEXT),\n/* harmony export */   blackColor: () => (/* binding */ blackColor),\n/* harmony export */   buyBlueColor: () => (/* binding */ buyBlueColor),\n/* harmony export */   closeGreyColor: () => (/* binding */ closeGreyColor),\n/* harmony export */   greenColor: () => (/* binding */ greenColor),\n/* harmony export */   sellRedColor: () => (/* binding */ sellRedColor)\n/* harmony export */ });\nconst buyBlueColor = '#2962ff'\r\nconst sellRedColor = '#f23645'\r\nconst closeGreyColor = '#afafaf'\r\nconst greenColor = '#25ae2a'\r\nconst blackColor = '#000000'\r\n\r\nconst SAVED_TRADE_HISTORY = 'trade history'\r\nconst FULL_TRADE_HISTORY = 'FULL TRADE HISTORY IS SENT'\r\n\r\nconst INITIAL_DATA_EVENT = \"INITIAL DATA\"\r\nconst NEW_CANDLE_EVENT = \"NEW CANDLE\"\r\nconst END_OF_DATA = \"NO MORE DATA\"\r\n\r\nconst SAVED_GAME_STATE_KEY = 'game_progress'\r\nconst GAME_FINISHED = 'finished playing the game'\r\nconst TUTORIAL_FINISHED = 'finished the tutorial only'\r\n\r\nconst SAVED_SURVEY_STATE_KEY = 'survey_progress'\r\nconst SURVEY_COMPLETE = 'survey is completed'\r\nconst SAVED_SURVEY_KEY = 'survey_key'\r\n\r\nconst TUTORIAL_START_TEXT = 'This section is the tutorial level. It is shorter than the main game but all mechanics are the same'\r\nconst GAME_START_TEXT = 'This section is the real game. You only get one try at this stage.'\r\n\r\nconst DATA_SAVED_DB_STATUS_KEY = 'data in db status'\r\nconst DATA_SAVED_DB_SUCCESSFULLY_ADDED = 'data in db safely'\r\nconst DATA_SAVED_DB_CURR_ATTEMPT_NUM = 'num attempts to save'\r\nconst DATA_SAVED_DB_CURR_MAX_ATTEMPTS = 3\r\n\r\nconst SAVED_STATS_KEY = 'SAVED_STATS'\r\n\n\n//# sourceURL=webpack:///./app_logic/constants.js?\n}");

/***/ },

/***/ "./app_logic/ending.js"
/*!*****************************!*\
  !*** ./app_logic/ending.js ***!
  \*****************************/
(__webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.a(__webpack_module__, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ \"./app_logic/constants.js\");\n\r\n\r\nconst surveyData = JSON.parse(localStorage.getItem(_constants_js__WEBPACK_IMPORTED_MODULE_0__.SAVED_SURVEY_KEY))\r\nconst tradeHistoryData = JSON.parse(localStorage.getItem(_constants_js__WEBPACK_IMPORTED_MODULE_0__.SAVED_TRADE_HISTORY))\r\n\r\nif (surveyData === null || tradeHistoryData === null) {\r\n    window.location.href = '../errors/not_ended_yet.html'\r\n} \r\n\r\nconst dataSavedStatus = localStorage.getItem(_constants_js__WEBPACK_IMPORTED_MODULE_0__.DATA_SAVED_DB_STATUS_KEY)\r\nif (dataSavedStatus !== _constants_js__WEBPACK_IMPORTED_MODULE_0__.DATA_SAVED_DB_SUCCESSFULLY_ADDED) {\r\n    console.log('SAVING DATA')\r\n    const response = await fetch('http://localhost:5050/saveData', {\r\n        method: 'POST',\r\n        headers: {\r\n            'Content-Type': 'application/json' \r\n        },\r\n        body: JSON.stringify({\r\n            surveyData: surveyData,\r\n            tradeHistoryData: tradeHistoryData\r\n        }) \r\n    });\r\n\r\n    const result = await response.json();\r\n\r\n    if (response.status === 200) {\r\n        localStorage.setItem(_constants_js__WEBPACK_IMPORTED_MODULE_0__.DATA_SAVED_DB_STATUS_KEY, _constants_js__WEBPACK_IMPORTED_MODULE_0__.DATA_SAVED_DB_SUCCESSFULLY_ADDED)\r\n    }\r\n}\r\n\r\nlet globalStats = JSON.parse(localStorage.getItem(_constants_js__WEBPACK_IMPORTED_MODULE_0__.SAVED_STATS_KEY))\r\nif (globalStats === null) {\r\n    const response = await fetch(`http://localhost:5050/globalStats/${tradeHistoryData['profit']}`, {\r\n        method: 'GET',\r\n        headers: {\r\n            'Content-Type': 'application/json' \r\n        },\r\n    });\r\n\r\n    globalStats = await response.json();\r\n\r\n    if (response.status === 200) {\r\n        localStorage.setItem(_constants_js__WEBPACK_IMPORTED_MODULE_0__.SAVED_STATS_KEY, JSON.stringify(globalStats))\r\n    }\r\n}\r\n\r\nconst numPlayersElem = document.querySelector('.num-players .amount')\r\nconst maxTradeElem = document.querySelector('.max .amount')\r\nconst minTradeElem = document.querySelector('.min .amount')\r\nconst rankingElem = document.querySelector('.ranking .amount')\r\n\r\nnumPlayersElem.textContent = `${globalStats['totalEntries']}`\r\nmaxTradeElem.textContent = `$${globalStats['maxOutcome']}`\r\nminTradeElem.textContent = `$${globalStats['minOutcome']}`\r\nrankingElem.textContent = `${((globalStats['profitRank'] / globalStats['totalEntries']) * 100).toFixed(2)}%`\r\n\r\n\r\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } }, 1);\n\n//# sourceURL=webpack:///./app_logic/ending.js?\n}");

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
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var hasSymbol = typeof Symbol === "function";
/******/ 		var webpackQueues = hasSymbol ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = hasSymbol ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = hasSymbol ? Symbol("webpack error") : "__webpack_error__";
/******/ 		
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && queue.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 		
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 		
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			var handle = (deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 		
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}
/******/ 			var done = (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue))
/******/ 			body(handle, done);
/******/ 			queue && queue.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	var __webpack_exports__ = __webpack_require__("./app_logic/ending.js");
/******/ 	
/******/ })()
;