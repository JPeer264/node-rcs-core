import keyframesLibrary from '../options/keyframesLibrary';
import selectorLibrary from '../options/selectorLibrary';
import replaceRegex from './regex';

const replaceCss = (code, options = {}) => {
  // calls the selectorLibrary.getAttributeSelector internally
  // String.replace will call this function and
  // get call selectorLibrary.getAttributeSelector directly
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
  } // /getCssSelector

  function replaceKeyframes(match) {
    const splittedMatch = match.split(' ');
    const toReplace = splittedMatch.pop();
    const replacedMatch = keyframesLibrary.get(toReplace);

    splittedMatch.push(replacedMatch);

    const result = splittedMatch.join(' ');

    return result;
  } // /replaceKeyframes

  function replaceAnimations(match) {
    const re = new RegExp(replaceRegex.animationTrigger);
    const exec = re.exec(match);
    const splittedGroup = exec[3].split(',');

    const result = splittedGroup.map(group => (
      group.replace(replaceRegex.matchFirstWord, replaceKeyframes)
    ));

    return exec[1] + exec[2] + result.join(',');
  } // /replaceAnimations

  function getCssSelector(match) {
    const result = selectorLibrary.get(match, {
      isSelectors: true,
    });

    return result;
  } // /getCssSelector in bufferCss

  let data = code.toString();

  if (!options.ignoreAttributeSelector) {
    selectorLibrary.setAttributeSelector(data.match(replaceRegex.attributeSelectors));
  }

  if (options.replaceKeyframes) {
    keyframesLibrary.fillLibrary(data);
  }

  selectorLibrary.fillLibrary(data, options);

  const regex = selectorLibrary.getAll({
    origValues: true,
    regexCss: true,
    isSelectors: true,
  });

  if (options.replaceKeyframes) {
        // replace the keyframes here
    data = data.replace(replaceRegex.keyframes, replaceKeyframes);
    data = data.replace(replaceRegex.animationTrigger, replaceAnimations);
  }

  data = data.replace(regex, getCssSelector);

  if (!options.ignoreAttributeSelector) {
    data = data.replace(replaceRegex.attributeSelectors, getAttributeSelector);
  }

  return data;
};

export default replaceCss;
