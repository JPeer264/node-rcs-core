import selectorLibrary from '../options/selectorLibrary';

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
}; // /replaceString

export default replaceString;
