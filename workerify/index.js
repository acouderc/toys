'use strict'

let $cache = {}

function handleSubmit() {
    const a = $cache.a.value;
    const b = $cache.b.value;
    $cache.worker.postMessage([a, b])
}

function handleWorkerMessage(e) {
    $cache.result.innerHTML = e.data
}

//------

function initCache() {
    $cache.a = document.getElementById('a')
    $cache.b = document.getElementById('b')
    $cache.submit = document.getElementById('submit')
    $cache.result = document.getElementById('result')
    $cache.worker = new Worker("worker.js")
}

function initEvents() {
    $cache.submit.addEventListener('click', handleSubmit)
    $cache.worker.onmessage = handleWorkerMessage
}
function init() {
    initCache()
    initEvents()
}

window.onload = init