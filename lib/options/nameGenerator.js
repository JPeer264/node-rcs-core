'use strict';

let nameCounter = 1;
let decToAnyOptions = {
    alphabet: 'etnrisouaflchpdvmgybwESxTNCkLAOM_DPHBjFIqRUzWXVJKQGYZ'
};

const _               = require('lodash');
const decToAny        = require('decimal-to-any');
const ALPHABET_TEST   = '#abcdefghijklmnopqrstuvwxyz';



/**
 * nameGenerator will create new and unique names
 * (require(rcs-core)).nameGenerator
 *
 * @module nameGenerator
 */
const nameGenerator = module.exports = {};

/**
 * generates a new unique name
 *
 * @return {String}
 */
nameGenerator.generate = () => {
    let generatedName = decToAny(nameCounter, decToAnyOptions.alphabet.length, decToAnyOptions);

    nameCounter++;

    return generatedName;
}; // /generate

/**
 * set test environment
 */
nameGenerator.resetCountForTests = () => {
    nameCounter = 1;
    decToAnyOptions = {
        alphabet: ALPHABET_TEST
    };
}; // /resetCountForTests
