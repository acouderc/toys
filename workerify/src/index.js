'use strict'

import workerify from './workerify'

let $cache = {}

const add = (d) => {
    const [a, b] = d.map(Number)
    return a + b
}

//------

async function handleSubmit() {
    const a = $cache.a.value;
    const b = $cache.b.value;
    var message = await $cache.worker([a, b])
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
    $cache.worker = workerify(add)
}

function initEvents() {
    $cache.submit.addEventListener('click', handleSubmit)
}

function init() {
    initCache()
    initEvents()
}

window.onload = init