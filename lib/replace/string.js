import selectorLibrary from '../selectorLibrary';

const replaceString = (string, regex) => {
  let result;
  let tempString = string;

  // save the string characters
  const beginChar = string.charAt(0);
  const endChar = string.charAt(string.length - 1);

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
