'use strict';

const benchmark = require('benchmark')
const alias     = require('../app/alias')

const suite = new benchmark.Suite()
const sampleSize    = 10
const increment     = 100
const suiteOptions  = {maxTime : 2}

const probas = Array.from({length:sampleSize}, (_, i) => {
    const n = increment * (i + 1)
    let sum = 0
    return Array
        .from({length: n}, (_, k) => {
            if (n - 1 === k)
                return +(sum / n)
            const v = Math.random()
            sum += 1 - Math.random()
            return +(v / n)
        })
})

let res = [];
probas.forEach((p, i) => suite.add(String(increment * (i + 1)), () =>  alias.preprocessingAlias(p), suiteOptions))
suite
    .on('cycle', (e) => {
        const n = Number(e.target.name)
        res.push([n, 1 / e.target.hz])
        console.log(String(e.target))
    })
    .run()