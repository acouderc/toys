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
    const worker = new Worker(URL.createObjectURL(blob))
    worker.onmessage = (e) => {
        worker.promiseResolver(e.data)
    }
    const proxy = new Proxy(worker, {
        getPrototypeOf: () => Function.prototype,
        apply: function (t, thisArg, args) {
            return new Promise((resolve) => {
                worker.promiseResolver = resolve
                worker.postMessage(args[0])
            })  
        }      
    })
    return proxy
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