'use strict'

let $cache = {}

const add = (d) => {
    const [a, b] = d.map(Number)
    return a + b
}

const hey = (d) => `hey ${d}`

const mockEvent = (d) => ({data:d})

const workerify = (func) => {
    const baseFunc = function (e) {
        const res = func(e.data)
        return this.postMessage(res)
    }

    return baseFunc
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

//------

function initCache() {
    $cache.a = document.getElementById('a')
    $cache.b = document.getElementById('b')
    $cache.submit = document.getElementById('submit')
    $cache.result = document.getElementById('result')
    $cache.feedbackListener = document.getElementById('worker-listener')
    $cache.workerListener = new Worker('workerListener.js')
}

function initEvents() {
    $cache.submit.addEventListener('click', handleSubmit)
    $cache.workerListener.onmessage = handleWorkerMessage
}
function init() {
    initCache()
    initEvents()
    var workifiedHey = workerify(hey).bind($cache.workerListener)
    workifiedHey(mockEvent("blob"))
}

window.onload = init