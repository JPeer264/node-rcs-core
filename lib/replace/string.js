import merge from 'lodash.merge';
import selectorsLibrary from '../selectorsLibrary';
import { AttributeLibrary } from '../attributeLibrary';
import regexp from './regex';

const replaceString = (string, regex, options) => {
  let result;
  let tempString = string;

  // save the string characters
  const beginChar = string.charAt(0);
  const endChar = string.charAt(string.length - 1);

  // remove the string characters
  tempString = tempString.slice(1, tempString.length - 1);

  // detect if it's a selector
  let surelySelector = tempString.match(regexp.likelySelector) !== null;
  if (options && options.isJSX) {
    // with JSX, you can have code in JS that contains HTML's attribute directly so we
    // can't say if it is a selector in case like 'if (something) return <div class="a b">;'
    surelySelector = false;
  }

  const bastardSplitChars = ' =,()"\'\\]';
  let stringArray = tempString.split(new RegExp(`(?=[#.${bastardSplitChars}])`));
  let previousEqual = false;
  let previousAttr = '';

  // replace every single entry
  stringArray = stringArray.map((element) => {
    // because we are using non-capturing split, the split char is kept as the first char
    const interestingValue = element.replace(new RegExp(bastardSplitChars, 'g'), '');
    if (interestingValue.length === 0) {
      return element;
    }
    // remember last iteration state before it's overwritten
    let prevEqual = previousEqual;
    previousEqual = element === '=';

    const startSplitChar = bastardSplitChars.indexOf(element.charAt(0))
                              === -1 ? '' : element.charAt(0);
    const tempElement = element.slice(startSplitChar.length, element.length);
    if (tempElement.length === 0) {
      // two comma can be merged in one
      return startSplitChar;
    }

    const startWithSelector = AttributeLibrary.isSelector(tempElement);
    prevEqual = prevEqual || startSplitChar === '=';

    // if we had "div[attr=something", react only if attr is a class, id or for
    // element will contain "div[attr" or " attr", we only care about the attribute name
    let previousAttributeName = (!startWithSelector && prevEqual) ?
                                    previousAttr.match(/[^a-zA-Z]+([a-zA-Z]+)/) : null;
    previousAttributeName = previousAttributeName !== null ? previousAttributeName[1] : null;
    const isAttributeInteresting = previousAttributeName === 'class'
                                || previousAttributeName === 'id'
                                || previousAttributeName === 'for';

    previousAttr = interestingValue;
    if (surelySelector && !startWithSelector && (!prevEqual || !isAttributeInteresting)) {
      // expecting a selector, but got a tag name, let's return it unmodified
      // except for "class=" or "id=" or "for="
      return startSplitChar + tempElement;
    }
    return startSplitChar + selectorsLibrary.get(tempElement,
              merge({ addSelectorType: startWithSelector }, options));
  });

  result = stringArray.join('');

  // add the string characters
  result = beginChar + result + endChar;

  return result;
}; // /replaceString

export default replaceString;
