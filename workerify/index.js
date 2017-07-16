'use strict'

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