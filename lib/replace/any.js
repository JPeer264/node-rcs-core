import selectorLibrary from '../options/selectorLibrary';
import replaceString from './string';
import replaceRegex from './regex';

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
};

export default replaceAny;
