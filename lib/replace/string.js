import selectorsLibrary from '../selectorsLibrary';

const replaceString = (string, regex, splitter = ' ', options) => {
  let result;
  let tempString = string;

  // save the string characters
  const beginChar = string.charAt(0);
  const endChar = string.charAt(string.length - 1);

  // remove the string characters
  tempString = tempString.slice(1, tempString.length - 1);

  let stringArray = tempString.split(splitter);

  // replace every single entry
  stringArray = stringArray.map((element) => {
    if (element.length === 0) {
      return element;
    }

    let tempElement = element;

    // eslint-disable-next-line consistent-return
    ['.', '#', ','].forEach((toSplit) => {
      if (element.indexOf(toSplit) > '-1') {
        tempElement = replaceString(`'${tempElement}'`, regex, toSplit);
        tempElement = tempElement.slice(1, tempElement.length - 1);

        return tempElement;
      }
    });

    // add whitespace at the beginning and the end
    tempElement = ` ${tempElement} `;

    tempElement = tempElement.replace(regex, (match) => {
      const matchBeginChar = match.charAt(0);
      const matchEndChar = match.charAt(match.length - 1);

      const toGet = match.slice(1, match.length - 1);

      return matchBeginChar + selectorsLibrary.get(toGet, options) + matchEndChar;
    });

    // remove the string characters
    tempElement = tempElement.slice(1, tempElement.length - 1);

    return tempElement;
  });

  result = stringArray.join(splitter);

  // add the string characters
  result = beginChar + result + endChar;

  return result;
}; // /replaceString

export default replaceString;
