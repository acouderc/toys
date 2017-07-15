'use strict'
/*eslint no-console: 0*/

const mocha         = require('mocha')
const assert        = require('assert')
const alias         = require('../app/alias.js')
const benchmark     = require('benchmark')
const fs            = require('fs')
const regression    = require('regression')

const describe      = mocha.describe
const it            = mocha.it

describe("Alias", () => {
    it("basic test : Within 1% of desired p", () => {
        const basicp = [0.1, 0.1, 0.5, 0.3]
        const n = 100000
        const preprocessing = alias.preprocessingAlias(basicp)
        const generator = alias.samplingAliasGenerator(preprocessing)(n)
        const probs = Array
            .from(generator)
            .reduce((acc, v) => {
                acc[v] += 1
                return acc
            }, Array.from({length: basicp.length}, () => 0))
            .map((k) => k / n)
        assert(probs.every((v, i) => Math.abs(v - basicp[i]) < 0.01)) 
    })

    it("basic benchmark", function (done) {
        this.timeout(0)
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
                    sum += 1 - Math.random() / n
                    return +(v / n)
                })
        })
        const suite = new benchmark.Suite()
        let res = [];
        probas.forEach((p, i) => suite.add(String(increment * (i + 1)), () =>  alias.preprocessingAlias(p), suiteOptions))
        suite
            .on('cycle', (e) => {
                const n = Number(e.target.name)
                res.push([n, 1 / e.target.hz])
                console.log(String(e.target))
            })
            .on('complete', () => {
                const benchmarkFile = './test/benchmark.html'
                
                const regData = regression('linear', res)
                const newData = [res, regData.points].reduce((acc, arr, i) => {
                    return acc.concat(arr.map(([x, y]) => ({"x":x,"y":y,"group":i})))
                }, [])
                fs.readFile(benchmarkFile, 'utf8', (err, d) => {
                    const res = d.replace(/items = [^\n]*;/, `items = ${JSON.stringify(newData)};`)
                    fs.writeFile(benchmarkFile, res, 'utf8', done)
                })
            })
            .run()
    })

})