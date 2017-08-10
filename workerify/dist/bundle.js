/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = workerify;


function postMessagify(func) {
    const baseFunc = async function (e) {
        const res = await func.apply(null, e.data)
        return this.postMessage(res)
    }
    return baseFunc
}

function workerify(func) {
    const PMd = postMessagify(func)
    const blob = new Blob(
        [`const func = ${func.toString()}
        onmessage = ${PMd.toString()}`],
        {type:"text/javascript"}
    )
    const worker = new Worker(URL.createObjectURL(blob))
    let promiseResolver = null
    worker.onmessage = (e) => {
        promiseResolver(e.data)
    }
    return function workerified() {
        return new Promise((resolve) => {
            promiseResolver = resolve
            worker.postMessage(Array.from(arguments))
        })
    }
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(2);
__webpack_require__(3);
(function webpackMissingModule() { throw new Error("Cannot find module \"test/bundle.js\""); }());


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__workerify__ = __webpack_require__(0);




let $cache = {}

const add = (a, b) => {
    [a, b] = [a, b].map(Number)
    return new Promise((r) => setTimeout(() => r(a + b), 1000))
}

//------

async function handleSubmit() {
    const a = $cache.a.value;
    const b = $cache.b.value;
    var message = await $cache.worker(a, b)
    printMessage(message)
}

function printMessage(d) {
    $cache.result.innerHTML = d
}

//------

function initCache() {
    $cache.a = document.getElementById('a')
    $cache.b = document.getElementById('b')
    $cache.submit = document.getElementById('submit')
    $cache.result = document.getElementById('result')
    $cache.worker = Object(__WEBPACK_IMPORTED_MODULE_0__workerify__["a" /* default */])(add)
}

function initEvents() {
    $cache.submit.addEventListener('click', handleSubmit)
}

function init() {
    initCache()
    initEvents()
}

window.onload = init

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_workerify__ = __webpack_require__(0);
/* eslint-env mocha */


const assert = __webpack_require__(4)


it('should handle the simplest case', async function () {
    const add = ([a, b]) => a + b
    const wAdd = Object(__WEBPACK_IMPORTED_MODULE_0__src_workerify__["a" /* default */])(add)
    const res = await wAdd([5, 7])
    assert.equal(12, res)
})

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ })
/******/ ]);