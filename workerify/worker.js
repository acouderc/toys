self.onmessage = function add(e) {
    const [a, b] = e.data
    return postMessage(a + b)
}