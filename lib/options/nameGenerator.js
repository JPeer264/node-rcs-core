'use strict';

const decToAny = require('decimal-to-any');

let nameCounter = 1;
let decToAnyOptions = {
  alphabet: 'etnrisouaflchpdvmgybwESxTNCkLAOM_DPHBjFIqRUzWXVJKQGYZ',
};

const ALPHABET_TEST = '#abcdefghijklmnopqrstuvwxyz';

/**
 * nameGenerator will create new and unique names
 * (require(rcs-core)).nameGenerator
 *
 * @module nameGenerator
 */
const nameGenerator = {};

/**
 * generates a new unique name
 *
 * @return {String}
 */
nameGenerator.generate = () => {
  const generatedName = decToAny(nameCounter, decToAnyOptions.alphabet.length, decToAnyOptions);

  nameCounter += 1;

  return generatedName;
}; // /generate

/**
 * set test environment
 */
nameGenerator.resetCountForTests = () => {
  nameCounter = 1;
  decToAnyOptions = {
    alphabet: ALPHABET_TEST,
  };
}; // /resetCountForTests

export default nameGenerator;
