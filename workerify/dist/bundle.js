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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__workerify__ = __webpack_require__(1);




const operations = {
    concat: {func: (a, b) => a + b, labels:['String to add']},
    prepend: {func: (a, b) => b + a, labels:['String to append']},
    slice : {func: (a, b, c) => {
        if (c !== "")
            return a.slice(Number(b), Number(c))
        return a.slice(Number(b))
    }, labels:['beginIndex', 'endIndex (optional)']},
    replace: {func: (a, b, c) => a.replace(new RegExp(b, 'g'), c), labels: ['replace each ', 'with ']},
    insertEvery: {func: (a, b, c) => a.replace(new RegExp(`(.{${Number(c)}})`, 'g'), `$1${b}`), labels: ['insert :', 'every :']}
}

let $cache = {}

//----

/**
 * Create new element
 * 
 * @param {String} type 
 * @param {String} className
 */
function ne(type, className) {
    let element = document.createElement(type)
    if (typeof className !== 'undefined')
        element.className = className
    return element
}

/**
 * Create new simple element
 * @param {String} type 
 * @param {String} className 
 * @param {String} textContent 
 */
function nse(type, className, textContent) {
    let simpleElement = ne(type, className)
    simpleElement.appendChild(document.createTextNode(textContent))
    return simpleElement
}

//------

function handleStringSubmit() {
    const stringValue = $cache.stringInput.value
    const res = [].reduce.call($cache.steps.children, (res, child) => {
        const args = [res].concat([].map.call(child.querySelectorAll('.step-input__input'), (input) => input.value))
        return operations[child.dataset.operation].func.apply(null, args)
    }, stringValue)
    $cache.result.innerHTML = res
}

function handleStepSubmit() {
    const stepName = $cache.stepSelect.value
    let li = ne('li', 'step')
    li.dataset.id= $cache.stepsNumber
    li.dataset.operation = stepName
    li.appendChild(nse('h3', 'step__title', stepName))
    let removeButton = nse('button', 'step__button', "Remove")
    removeButton.addEventListener('click', () => $cache.steps.removeChild(li))
    let inputContainer = ne('ul', 'step__inputs')
    operations[stepName].labels.forEach((labelContent) => {
        let operationli = ne('li', 'step-input')
        let input = ne('input', 'step-input__input')
        input.type = "text"
        operationli.appendChild(nse('label', 'step-input__label', labelContent))
        operationli.appendChild(input)
        inputContainer.appendChild(operationli)
    })
    
    li.appendChild(inputContainer)
    li.appendChild(removeButton)
    $cache.steps.appendChild(li)
    $cache.stepsNumber++
}

//------

function initDOM() {
    let docFrag = document.createDocumentFragment()
    for (let op in operations) {
        let option = document.createElement('option')
        option.appendChild(document.createTextNode(op))
        docFrag.appendChild(option)
    }
    $cache.stepSelect.appendChild(docFrag)
}

function initCache() {
    $cache.stringInput = document.getElementById('string-form__input')
    $cache.stringSubmit = document.getElementById('string-form__submit')
    $cache.stepSelect = document.getElementById('step__select')
    $cache.stepSubmit = document.getElementById('step__submit')
    $cache.steps = document.getElementById('steps')
    $cache.result = document.getElementById('result')
    $cache.stepsNumber = 0
    $cache.sortedSteps = Sortable.create($cache.steps)
}

function initEvents() {
    $cache.stepSubmit.addEventListener('click', handleStepSubmit)
    $cache.stringSubmit.addEventListener('click', handleStringSubmit)
}
function init() {
    initCache()
    initEvents()
    initDOM()
}

window.onload = init

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */


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

/***/ })
/******/ ]);