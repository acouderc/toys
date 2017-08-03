'use strict'

function postMessagify(func) {
    const baseFunc = function (e) {
        const res = func.apply(null, e.data)
        return this.postMessage(res)
    }
    return baseFunc
}

export default function workerify(func) {
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