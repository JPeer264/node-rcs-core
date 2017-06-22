import recast from 'recast';
import traverse from 'ast-traverse';

import selectorLibrary from './selectorLibrary';
import keyframesLibrary from './keyframesLibrary';

// matches from . or # every character until : or . or )
// (for pseudo elements or dots or even in :not(.class))
/**
 * a bunch of regex rules
 */
const replaceRegex = {
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
 * gets a string, with stringcharacters, and replace all css matches to the minified one
 *
 * @param  {String} string the string where the css selectors could be in
 * @param  {RegExp} regex  the regex to check for the selectors
 *
 * @return {String}        the string with the minified selectors
 */
const replaceString = (string, regex) => {
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

      return ` ${selectorChar}${selectorLibrary.get(tempMatch)} `;
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
const replaceAny = (code) => {
  const regex = selectorLibrary.getAll({
    origValue: true,
    regex: true,
    isSelectors: false,
  });

  let data = code.toString();

  if (data.length === 0) {
    return data;
  }

  data = data.replace(replaceRegex.strings, match => replaceString(match, regex));

  return data;
}; // /buffer

/**
 * Parse a javascript code or buffer and returns the modified file. But returns always a string
 *
 * @param  {String | Buffer} code
 *
 * @return {String}
 */
const replaceJs = (code) => {
  const regex = selectorLibrary.getAll({
    origValue: true,
    regex: true,
    isSelectors: false,
  });

  const ast = recast.parse(code);

  traverse(ast, {
    pre: (node) => {
      if (node.type === 'Literal' && typeof node.value === 'string') {
        node.raw = node.raw.replace(node.raw, match => replaceString(match, regex));
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
const replaceCss = (code, options) => {
  /**
   * calls the selectorLibrary.getAttributeSelector internally
   * String.replace will call this function and
   * get call selectorLibrary.getAttributeSelector directly
   *
   * @param  {String} match
   *
   * @return {String} selectorLibrary.getAttributeSelector()
   */
  function getAttributeSelector(match) {
    const re = new RegExp(replaceRegex.attributeSelectors);
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

    result = result.replace(replaceRegex.strings, newString);

    return result;
  } // /getCssSelector in bufferCss

  function replaceKeyframes(match) {
    const splittedMatch = match.split(' ');
    const toReplace = splittedMatch.pop();
    const replacedMatch = keyframesLibrary.get(toReplace);

    splittedMatch.push(replacedMatch);

    const result = splittedMatch.join(' ');

    return result;
  } // /replaceKeyframes in bufferCSS

  function replaceAnimations(match) {
    const re = new RegExp(replaceRegex.animationTrigger);
    const exec = re.exec(match);
    const splittedGroup = exec[3].split(',');

    const result = splittedGroup.map(group => (
      group.replace(replaceRegex.matchFirstWord, replaceKeyframes)
    ));

    return exec[1] + exec[2] + result.join(',');
  } // /replaceAnimations in bufferCSS

  /**
   * calls the selectorLibrary.get internally
   * String.replace will call this function and get call selectorLibrary.get directly
   *
   * @param  {String} match
   *
   * @return {String} selectorLibrary.get()
   */
  function getCssSelector(match) {
    const result = selectorLibrary.get(match, {
      isSelectors: true,
    });

    return result;
  } // /getCssSelector in bufferCss

  options = options || {};

  if (!options.ignoreAttributeSelector) {
    selectorLibrary.setAttributeSelector(code.match(replaceRegex.attributeSelectors));
  }

  if (options.replaceKeyframes) {
    keyframesLibrary.fillLibrary(code);
  }

  selectorLibrary.fillLibrary(code, options);

  options.regex = selectorLibrary.getAll({
    origValues: true,
    regexCss: true,
    isSelectors: true,
  });

  if (options.replaceKeyframes) {
        // replace the keyframes here
    code = code.replace(replaceRegex.keyframes, replaceKeyframes);
    code = code.replace(replaceRegex.animationTrigger, replaceAnimations);
  }

  code = code.replace(options.regex, getCssSelector);

  if (!options.ignoreAttributeSelector) {
    code = code.replace(replaceRegex.attributeSelectors, getAttributeSelector);
  }

  return code;
}; // /css

export default {
  css: replaceCss,
  js: replaceJs,
  any: replaceAny,
  regex: replaceRegex,
  string: replaceString,
};
