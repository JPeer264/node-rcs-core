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
const getAttributeSelector = (match) => {
  const re = new RegExp(replaceRegex.attributeSelectors);
  const exec = re.exec(match);
  const stringChar = exec[3].charAt(0);
  const stringWithoutStringChars = exec[3].slice(1, exec[3].length - 1);

  let result = match;
  let newString = exec[3];

  const suffix = selectorLibrary.suffix;
  const prefix = selectorLibrary.prefix;

  if (exec[2] === '$') {
    newString = stringChar + stringWithoutStringChars + suffix + stringChar;
  }

  if (exec[2] === '^') {
    newString = stringChar + prefix + stringWithoutStringChars + stringChar;
  }

  result = result.replace(replaceRegex.strings, newString);

  return result;
}; // /getCssSelector

const replaceCss = (code) => {
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
    regexCss: true,
    addSelectorType: true,
  });

  /* ***************** *
   * replace selectors *
   * ***************** */
  data = data.replace(regex, match => (
    selectorLibrary.get(match, {
      addSelectorType: true,
    })
  ));

  data = data.replace(replaceRegex.attributeSelectors, match => (
    getAttributeSelector(match)
  ));

  return data;
};

export default replaceCss;
