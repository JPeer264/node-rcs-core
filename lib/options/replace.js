'use strict';

const _ = require('lodash');
const rcs = require('../rcs');
const recast = require('recast');
const traverse = require('ast-traverse');
const StringDecoder = require('string_decoder').StringDecoder;

/**
 * parses through every single document and renames the names
 * (require(rcs-core)).replace
 *
 * @module replace
 */
const replace = {};

// matches from . or # every character until : or . or )
// (for pseudo elements or dots or even in :not(.class))
/**
 * a bunch of regex rules
 */
replace.regex = {
  selectors: /(#|\.)[^\s:.{)[>+,\s]+/g, // matches all selectors beginning with . or # - e.g. .matching#alsomatch .matchmetoo
  multiLineComments: /\/\*([\s\S]*?)\*\//g, // match /* */ from files
  doubleQuotes: /"[^"]*"/g, // match everything within " " (double quotes)
  singleQuotes: /'[^']*'/g, // match everything within " " (double quotes)
  sizesWithDots: /\.([0-9]+?)(em|rem|%|vh|vw|s|cm|ex|in|mm|pc|pt|px|vmin)([^a-zA-Z])/g, // match everything which starts with . and has numbers in it and ends with em, rem,... plus no letter comes after - necessary for .9em or .10s
  onlyNumbers: /\.([0-9]*?)[0-9](\s|;|}|\))/g, // match if there are just numbers between . and \s or ; or } or ) - otherwise it will be regogniced as class
  urlAttributes: /url\(([\s\S]*?)\)/g, // matches url() attributes from css - it can contain .woff or .html or similiar
  hexCodes: /#([a-zA-Z0-9]{3,6})(\s|;|}|!|,)/g, // matches hex colors with 3 or 6 values - unfortunately also matches also ids with 3 or 6 digits - e.g. matches #fff #header #0d0d0d
  strings: /"\s*[\S\s]*?\s*"|'\s*[\S\s]*?\s*'/g, // matches strings such as: 'hello' or "hello"
  attributeContent: /:.+?(;|}|\))/g, // matches everything between : and ; - in case everything is in one line, and `;` is missing it will go until `}` - good for: `filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);`
  attributeSelectors: /\[\s*(class|id)\s*([*^$])=\s*("[\s\S]*?"|'[\s\S]*?')[\s\S]*?\]/g, // matches attribute selectors of html just with class or id in it with `$=`, `^=` or `*=`, e.g.: [class*="selector"]. 3 group matches, first `class` or `id`, second regex operator, third the string
  keyframes: /@(-[a-z]*-)*keyframes\s+([a-zA-Z0-9_-]+)/g, // matches keyframes and just the first group the first matched non-whitespace characters - e.g. matches: `@keyframes    my-KeyFra_me`
  animationTrigger: /(animation-name|animation)(:\s*)([\s\S][^;}]+)/g, // matches `animation-name` or `animation`
  matchFirstWord: /[a-zA-Z0-9-_]+/, // just matches the first word which includes a-zA-Z0-9-_
}; // /regex

/**
 * Parse a buffer and returns new selectors if the option 'isSelectors' is set to true
 *
 * @param  {String} bufferObject    the buffer's path to change
 * @param  {Object} [options]
 * @property {String}   regex a regular expression to match. Default: selectorLibrary.getAll
 * @property {Boolean}  [isSelectors=false] a boolean to get new values for the selectorLibrary
 *
 * @return {Object}
 */
replace.buffer = (bufferObject, options) => {
  const decoder = new StringDecoder('utf8');
  const optionsDefault = {
    regex: rcs.selectorLibrary.getAll({
      origValue: true,
      regex: true,
      isSelectors: false,
    }),
  };

  let data = decoder.write(bufferObject);

  options = _.merge(optionsDefault, options);

  if (data.length === 0) {
    return bufferObject;
  }

  data = data.replace(replace.regex.strings, match => replace.string(match, options.regex));

  return new Buffer(data);
}; // /buffer

/**
 * Parse a javascript code or buffer and returns the modified file. But returns always a string
 *
 * @param  {String | Buffer} code
 *
 * @return {String}
 */
replace.js = (code) => {
  const regex = rcs.selectorLibrary.getAll({
    origValue: true,
    regex: true,
    isSelectors: false,
  });

  const ast = recast.parse(code);

  traverse(ast, {
    pre: (node) => {
      if (node.type === 'Literal' && typeof node.value === 'string') {
        node.raw = node.raw.replace(node.raw, match => replace.string(match, regex));
        node.value = node.raw.slice(1, node.raw.length - 1);
      }
    },
  });

  return recast.print(ast).code;
}; // /js

/**
 * special replacements for css files - needs to store selectors in the selectorLibrary
 *
 * @todo define options
 *
 * @param {String} bufferObject the path where the css files are located
 * @param {Object} [options]
 * @property {String}  prefix            the prefix for renaming
 * @property {String}  suffix            the suffix for renaming
 * @property {Boolean} preventRandomName prevent minify selectors (good for just prefix/suffix)
 *
 * @return {Function} the callback
 */
replace.css = (code, options) => {
  /**
   * calls the rcs.selectorLibrary.getAttributeSelector internally
   * String.replace will call this function and
   * get call rcs.selectorLibrary.getAttributeSelector directly
   *
   * @param  {String} match
   *
   * @return {String} rcs.selectorLibrary.getAttributeSelector()
   */
  function getAttributeSelector(match) {
    const re = new RegExp(replace.regex.attributeSelectors);
    const exec = re.exec(match);
    const stringChar = exec[3].charAt(0);
    const stringWithoutStringChars = exec[3].slice(1, exec[3].length - 1);

    let result = match;
    let newString = exec[3];

    if (exec[2] === '$' && typeof options.suffix === 'string') {
      newString = stringChar + stringWithoutStringChars + options.suffix + stringChar;
    }

    if (exec[2] === '^' && typeof options.suffix === 'string') {
      newString = stringChar + options.prefix + stringWithoutStringChars + stringChar;
    }

    result = result.replace(replace.regex.strings, newString);

    return result;
  } // /getCssSelector in bufferCss

  function replaceKeyframes(match) {
    const splittedMatch = match.split(' ');
    const toReplace = splittedMatch.pop();
    const replacedMatch = rcs.keyframesLibrary.get(toReplace);

    splittedMatch.push(replacedMatch);

    const result = splittedMatch.join(' ');

    return result;
  } // /replaceKeyframes in bufferCSS

  function replaceAnimations(match) {
    const re = new RegExp(replace.regex.animationTrigger);
    const exec = re.exec(match);
    const splittedGroup = exec[3].split(',');

    const result = splittedGroup.map(group => (
      group.replace(replace.regex.matchFirstWord, replaceKeyframes)
    ));

    return exec[1] + exec[2] + result.join(',');
  } // /replaceAnimations in bufferCSS

  /**
   * calls the rcs.selectorLibrary.get internally
   * String.replace will call this function and get call rcs.selectorLibrary.get directly
   *
   * @param  {String} match
   *
   * @return {String} rcs.selectorLibrary.get()
   */
  function getCssSelector(match) {
    const result = rcs.selectorLibrary.get(match, {
      isSelectors: true,
    });

    return result;
  } // /getCssSelector in bufferCss

  options = options || {};

  if (!options.ignoreAttributeSelector) {
    rcs.selectorLibrary.setAttributeSelector(code.match(replace.regex.attributeSelectors));
  }

  if (options.replaceKeyframes) {
    rcs.keyframesLibrary.fillLibrary(code);
  }

  rcs.selectorLibrary.fillLibrary(code, options);

  options.regex = rcs.selectorLibrary.getAll({
    origValues: true,
    regexCss: true,
    isSelectors: true,
  });

  if (options.replaceKeyframes) {
        // replace the keyframes here
    code = code.replace(replace.regex.keyframes, replaceKeyframes);
    code = code.replace(replace.regex.animationTrigger, replaceAnimations);
  }

  code = code.replace(options.regex, getCssSelector);

  if (!options.ignoreAttributeSelector) {
    code = code.replace(replace.regex.attributeSelectors, getAttributeSelector);
  }

  return code;
}; // /css

/**
 * gets a string, with stringcharacters, and replace all css matches to the minified one
 *
 * @param  {String} string the string where the css selectors could be in
 * @param  {RegExp} regex  the regex to check for the selectors
 *
 * @return {String}        the string with the minified selectors
 */
replace.string = (string, regex) => {
  let result;
  let tempString = string;

  // save the string characters
  const beginChar = tempString.charAt(0);
  const endChar = tempString.charAt(tempString.length - 1);

  // remove the string characters
  tempString = tempString.slice(1, tempString.length);
  tempString = tempString.slice(0, tempString.length - 1);

  let stringArray = tempString.split(' ');

  // replace every single entry
  stringArray = stringArray.map((element) => {
    let tempElement = element;
    // add whitespace at the beginning and the end
    tempElement = ` ${tempElement} `;

    tempElement = tempElement.replace(regex, (match) => {
      let tempMatch = match;

      tempMatch = tempMatch.replace(/\s+/g, '');
      const selectorChar = tempMatch.charAt(0) === '.' || tempMatch.charAt(0) === '#' ? tempMatch.charAt(0) : '';

      return ` ${selectorChar}${rcs.selectorLibrary.get(tempMatch)} `;
    });

    // remove the string characters
    tempElement = tempElement.slice(1, tempElement.length);
    tempElement = tempElement.slice(0, tempElement.length - 1);

    return tempElement;
  });

  result = stringArray.join(' ');

  // add the string characters
  result = beginChar + result + endChar;

  return result;
}; // /string

module.exports = replace;
