const add = (a, b) => a + b

const handleMessage = new Proxy(add, {
    apply : function trapCall(target, thisArg, argumentsList) {
        const [a, b] = argumentsList[0].data.map(Number)
        const res = target(a, b)
        return postMessage(res)
    }
})

self.onmessage = handleMessage