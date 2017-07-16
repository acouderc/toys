function postMessagify(func) {
    const baseFunc = function (e) {
        const res = func(e.data)
        return this.postMessage(res)
    }
    return baseFunc
}

export function workerify(func) {
    const PMd = postMessagify(func)
    const blob = new Blob(
        [`const func = ${func.toString()}
        onmessage = ${PMd.toString()}`],
        {type:"text/javascript"}
    )
    const worker = new Worker(URL.createObjectURL(blob))
    worker.call = (d) => new Promise((resolve) => {
        worker.postMessage(d)
        worker.onmessage = (e) => {
            resolve(e.data)
        }
    })  
    return worker
}
