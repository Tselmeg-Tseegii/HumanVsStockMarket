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

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   SAVED_TRADE_HISTORY: () => (/* binding */ SAVED_TRADE_HISTORY),\n/* harmony export */   blackColor: () => (/* binding */ blackColor),\n/* harmony export */   buyBlueColor: () => (/* binding */ buyBlueColor),\n/* harmony export */   closeGreyColor: () => (/* binding */ closeGreyColor),\n/* harmony export */   greenColor: () => (/* binding */ greenColor),\n/* harmony export */   sellRedColor: () => (/* binding */ sellRedColor)\n/* harmony export */ });\nconst buyBlueColor = '#2962ff'\nconst sellRedColor = '#f23645'\nconst closeGreyColor = '#afafaf'\nconst greenColor = '#25ae2a'\nconst blackColor = '#000000'\n\nconst SAVED_TRADE_HISTORY = 'trade history'\n\n\n//# sourceURL=webpack:///./app_logic/constants.js?\n}");

/***/ },

/***/ "./app_logic/ending.js"
/*!*****************************!*\
  !*** ./app_logic/ending.js ***!
  \*****************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _stats_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./stats.js */ \"./app_logic/stats.js\");\n\n\nconst tradeStats = new _stats_js__WEBPACK_IMPORTED_MODULE_0__.TradeStats()\n\n\n\n//# sourceURL=webpack:///./app_logic/ending.js?\n}");

/***/ },

/***/ "./app_logic/stats.js"
/*!****************************!*\
  !*** ./app_logic/stats.js ***!
  \****************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   TradeStats: () => (/* binding */ TradeStats)\n/* harmony export */ });\n/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ \"./app_logic/constants.js\");\n\n\n\nclass TradeStats {\n    constructor(eventBroadCaster) {\n        this.eventBroadCaster = eventBroadCaster\n        this.tradeHistory = sessionStorage.getItem(_constants_js__WEBPACK_IMPORTED_MODULE_0__.SAVED_TRADE_HISTORY)\n\n        console.log(this.tradeHistory)\n    }\n\n}\n\n//# sourceURL=webpack:///./app_logic/stats.js?\n}");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./app_logic/ending.js");
/******/ 	
/******/ })()
;