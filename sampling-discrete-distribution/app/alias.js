'use strict'

// ******
// Sampling of discrete random variates using the Alias algorithm
// See details at http://www.keithschwarz.com/darts-dice-coins/
// *******

/**
 * Preprocessing, creating 2 Arrays of size N, 
 *  First contains the probability of picking their index,
 *  Second the alternative value in case ^ is wrong
 *  
 * @param {Array} p : distribution of probability
 * @return {Array} 
 */
var preprocessingAlias = function preprocessingAlias(p) {
    var res = [[], []]
    var sp = []
    var i,j
    var n = p.length|0
    var heaps = [[], []]
    for (i = 0; i < n; i++) {
        sp[i] = n * p[i]
    }
    for (i = 0; i < sp.length|0; i++) {
        if (sp[i] < 1)
            heaps[1].push(i)
        else
            heaps[0].push(i)
    }
    while (heaps[0].length && heaps[1].length) {
        var l = heaps[1].pop()
        var g = heaps[0].pop()
        res[0][l] = sp[l]
        res[1][l] = g|0
        sp[g] += sp[l] - 1
        if (sp[g] < 1 )
            heaps[1][heaps[1].length] = g|0
        else
            heaps[0][heaps[0].length] = g|0
    }
    for (j = 0; j < heaps.length; j++) {
        for (i = 0; i < heaps[j].length; i++) {
            res[0][heaps[j][i]] = 1
            res[1][heaps[j][i]] = 0
        }
    }
    return res
}

/**
 * Creates Generator for Alias method
 * @param {Array} preprocessing : result of preprocessingAlias
 * @returns {GeneratorFunction}
 */
const samplingAliasGenerator = function samplingAliasGenerator(preprocessing) {
    return function* samplingAlias(k) {
        for (let i = 0; i < k; i++) {
            const side = Math.floor(Math.random() * preprocessing[0].length)
            if (Math.random() < preprocessing[0][side])
                yield side
            else
                yield preprocessing[1][side]
        }
    }
}

module.exports = {
    'samplingAliasGenerator': samplingAliasGenerator,
    'preprocessingAlias'    : preprocessingAlias
}