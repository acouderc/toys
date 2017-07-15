'use strict'

let $cache = {}

const add = (d) => {
    const [a, b] = d.map(Number)
    return a + b
}

function postMessagify(func) {
    const baseFunc = function (e) {
        const res = func(e.data)
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
    return new Worker(URL.createObjectURL(blob))
}

//------


function handleSubmit() {
    const a = $cache.a.value;
    const b = $cache.b.value;
    $cache.worker.postMessage([a, b])
}

function printMessage(d) {
    $cache.result.innerHTML = d
}

const handleWorkerMessage = new Proxy(printMessage, {
    apply: function trapApply(target, thisArg, argumentsList) {
        return target(argumentsList[0].data)
    }
})

//------

function initCache() {
    $cache.a = document.getElementById('a')
    $cache.b = document.getElementById('b')
    $cache.submit = document.getElementById('submit')
    $cache.result = document.getElementById('result')
    $cache.worker = workerify(add)
    $cache.feedbackListener = document.getElementById('worker-listener')
    $cache.workerListener = new Worker('workerListener.js')
}

function initEvents() {
    $cache.submit.addEventListener('click', handleSubmit)
    $cache.worker.onmessage = handleWorkerMessage
    $cache.workerListener.onmessage = (e) => {
        $cache.feedbackListener.innerHTML = $cache.feedbackListener.innerHTML + e.data
    }
}
function init() {
    initCache()
    initEvents()
}

window.onload = init