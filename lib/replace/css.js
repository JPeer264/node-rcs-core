import keyframesLibrary from '../keyframesLibrary';
import selectorLibrary from '../selectorLibrary';
import replaceRegex from './regex';

const replaceKeyframes = (match) => {
  const splittedMatch = match.split(' ');
  const toReplace = splittedMatch.pop();
  const replacedMatch = keyframesLibrary.get(toReplace);

  splittedMatch.push(replacedMatch);

  const result = splittedMatch.join(' ');

  return result;
}; // /replaceKeyframes

// calls the selectorLibrary.getAttributeSelector internally
// String.replace will call this function and
// get call selectorLibrary.getAttributeSelector directly
const getAttributeSelector = (match, options) => {
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
}; // /getCssSelector

const replaceCss = (code, options = {}) => {
  let data = code.toString();

  /* ***************** *
   * replace keyframes *
   * ***************** */
  data = data.replace(replaceRegex.keyframes, replaceKeyframes);

  /* ****************** *
   * replace animations *
   * ****************** */
  data = data.replace(replaceRegex.animationTrigger, (match) => {
    const re = new RegExp(replaceRegex.animationTrigger);
    const exec = re.exec(match);
    const splittedGroup = exec[3].split(',');

    const result = splittedGroup.map(group => (
      group.replace(replaceRegex.matchFirstWord, replaceKeyframes)
    ));

    return exec[1] + exec[2] + result.join(',');
  });

  const regex = selectorLibrary.getAll({
    origValues: true,
    regexCss: true,
    isSelectors: true,
  });

  /* ***************** *
   * replace selectors *
   * ***************** */
  data = data.replace(regex, match => (
    selectorLibrary.get(match, {
      isSelectors: true,
    })
  ));

  data = data.replace(replaceRegex.attributeSelectors, match => (
    getAttributeSelector(match, options)
  ));

  return data;
};

export default replaceCss;
