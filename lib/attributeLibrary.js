import { parse } from 'postcss';
import entries from 'object.entries';
import merge from 'lodash.merge';

import replace from './replace';
import { NameGenerator } from './nameGenerator';
import { BaseLibrary } from './baseLibrary';

// This abstract class implements the attribute parsing and replacing logic
// It has to be specialized for each type (likely class or id), and thus
// any logic of selection (like . or #) is defined in the child class, not this one.
export class AttributeLibrary extends BaseLibrary {
  constructor() {
    super();
    this.attributeSelectors = {};
  }

  static removePseudoElements(value) {
    const splits = value.split(/\\/g);
    const splittedEscapes = splits.map((split, i) => {
      if (splits.length - 1 > i) {
        // returns the normal split
        // as pseudo elements are just at the end
        return split;
      }


      // remove the first char
      // in case it is a :
      const firstChar = split.charAt(0) || '';
      const modifiedString = split.slice(1);
      // replace everything with a :
      // this should be a pseudo element
      const removedPseudoElements = modifiedString.replace(/:.+/g, '');

      return firstChar + removedPseudoElements;
    });

    return splittedEscapes.join('');
  }

  reset() {
    super.reset();

    this.attributeSelectors = {};
  } // /reset

  fillLibrary(data, options = {}) {
    const { regex } = replace;
    const code = data.toString();
    const result = parse(code);

    result.walk((root) => {
      const parentName = root.parent.name || '';

      if (root.selector && !parentName.match(/keyframes/)) {
        const matchedSelectors = root.selector.match(regex.selectors) || [];
        this.set(matchedSelectors, options);
      }
    });
  } // /fillLibrary


  // Child class will override this to whatever regex that best fit their need
  // For example: form[class*=selector]
  // The regex should have 3 group matches:
  // First: The attribute name ('class' in previous example),
  // Second: The regular expression operator (* in previous example, '' when none)
  // Third: The term used ('selector' in the previous example)
  // eslint-disable-next-line class-methods-use-this
  getAttributeSelectorRegex() {
    return replace.regex.idAttributeSelectors;
  }

  // Get the selector char for this child class
  // eslint-disable-next-line class-methods-use-this
  selectorFirstChar() {
    return '#';
  }

  isValidSelector(selector) {
    return selector.charAt(0) === this.selectorFirstChar();
  }

  // Prepare the value to store in the mapping
  prepareValue(repObj, options = {}) {
    if (!this.isValidSelector(repObj.value)) {
      return false;
    }

    const escapeFreeSelector = AttributeLibrary.removePseudoElements(repObj.value);

    // checks if this value was already set
    const realSelector = escapeFreeSelector.slice(1, escapeFreeSelector.length);

    if (!options.ignoreAttributeSelectors) {
      const newName = this.replaceAttributeSelector(escapeFreeSelector);

      if (newName) {
        // eslint-disable-next-line no-param-reassign
        repObj.renamedValue = newName;
      }
    }

    if (repObj.renamedValue !== undefined && (repObj.renamedValue.charAt(0) === '.' || repObj.renamedValue.charAt(0) === '#')) {
      // eslint-disable-next-line no-param-reassign
      repObj.renamedValue = repObj.renamedValue.slice(1, repObj.renamedValue.length);
    }
    // eslint-disable-next-line no-param-reassign
    repObj.value = realSelector;
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  prefetchValue(selector) {
    return selector.replace(/(\.|#)/, '').replace(/\\/g, '');
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  postfetchValue(result, opts) {
    const optionsDefault = {
      addSelectorType: false,
      extend: false,
    };
    const options = merge({}, optionsDefault, opts);

    if (options.extend) {
      // emulate previous behavior to avoid breaking existing code
      // should be better to deprecate this ?
      return { selector: this.compressedValues[result], compressedSelector: result, type: this.selectorFirstChar() === '#' ? 'id' : 'class' };
    }

    return (options.addSelectorType ? this.selectorFirstChar() : '') +
                  this.prefix + result + this.suffix;
  }

  getAll(opts = {}) {
    let originalSelector;
    let compressedSelector;

    let resultArray = [];
    let result = {};

    const selectors = this.values;
    const optionsDefault = {
      getRenamedValues: false,
      regex: false,
      addSelectorType: false,
      extend: false,
    };

    const options = merge({}, optionsDefault, opts);

    if (options.extend) {
      if (options.getRenamedValues) {
        // simulate previous behavior to avoid breaking existing code
        // should probably deprecate this case if useless (it's not being called anywhere)
        Object.keys(this.compressedValues).forEach((key) => {
          result[key] = { selector: key, modifiedSelector: this.compressedValues[key], type: this.selectorFirstChar() === '#' ? 'id' : 'class' };
        });
      } else {
        // simulate previous behavior to avoid breaking existing code
        // should probably deprecate this case if useless (it's not being called anywhere)
        Object.keys(this.values).forEach((key) => {
          result[key] = { selector: key, compressedSelector: this.values[key], type: this.selectorFirstChar() === '#' ? 'id' : 'class' };
        });
      }

      if (options.addSelectorType) {
        const modifiedResult = {};

        Object.keys(result).forEach((value) => {
          modifiedResult[this.selectorFirstChar() + value] = result[value];
        });

        result = modifiedResult;
      }

      return result;
    } // options.extend

    Object.keys(selectors).forEach((selector) => {
      compressedSelector = selectors[selector];
      originalSelector = selector;

      if (options.getRenamedValues) {
        // save compressedSelectors
        result[compressedSelector] = originalSelector;
        resultArray.push(compressedSelector);
      } else {
        // save originalSelectors
        result[selector] = compressedSelector;
        resultArray.push(originalSelector);
      }
    });

    // sort array by it's length to avoid e.g. BEM syntax
    if (options.regex) {
      resultArray = resultArray.sort((a, b) => b.length - a.length);
    }

    if (options.addSelectorType) {
      resultArray = resultArray.map(value => `${this.selectorFirstChar()}${value}`);
    }

    if (options.regex) {
      const regex = options.addSelectorType
        ? new RegExp(resultArray.map(v => `\\${v}`).join('|'), 'g')
        // the next MUST be options.regex === true
        : new RegExp(`(\\s|\\${this.selectorFirstChar()})(${resultArray.join('|')})[\\s)]`, 'g');

      const regexResult = resultArray.length === 0 ? undefined : regex;

      return regexResult;
    }

    if (options.addSelectorType) {
      const tempResult = {};

      resultArray.forEach((value) => {
        const modValue = value.slice(1, value.length);

        tempResult[value] = result[modValue];
      });

      result = tempResult;
    }

    return result;
  } // /getAll

  setAttributeSelector(attributeSelector) {
    if (!attributeSelector) {
      return;
    }

    if (typeof attributeSelector === 'object') {
      attributeSelector.forEach(value => this.setAttributeSelector(value));

      return;
    }

    const re = new RegExp(this.getAttributeSelectorRegex());
    const exec = re.exec(attributeSelector);

    if (!exec) {
      return;
    }

    const term = exec[3];

    let attributeSelectorType = exec[2];
    let selector = term;

    // it is empty if the attribute selector is following: [class=test]
    if (attributeSelectorType === '') {
      attributeSelectorType = '=';
    }

    if (term.charAt(0).match(/"|'/)) {
      selector = term.slice(1, exec[3].length - 1);
    }

    const attributeSelectorKey = attributeSelectorType + selector;

    this.attributeSelectors[attributeSelectorKey] = {
      type: exec[1],
      originalString: attributeSelector,
      regexType: attributeSelectorType,
      nameGeneratorCounter: new NameGenerator(),
    };
  } // /setAttributeSelector

  replaceAttributeSelector(selector) {
    let result = false;

    if (!this.isValidSelector(selector)) {
      return result;
    }

    // const firstChar = selector.match(/^[.#]/) ? selector.charAt(0) : '';
    const slicedSelector = selector.replace(/^[.#]/, '');

    entries(this.attributeSelectors).forEach((entry) => {
      const attributeSelector = entry[0];
      const value = entry[1];
      const attributeString = attributeSelector.slice(1, attributeSelector.length);

      if (attributeSelector.charAt(0) === '|') {
        let match = slicedSelector.match(`^${attributeString}-`);

        if (match) {
          match = match[0].replace(/-$/, '');
          result = `${match}-${value.nameGeneratorCounter.generate()}`;
        }
      }

      if (attributeSelector.charAt(0).match(/^[=~|]/)) {
        const match = slicedSelector.match(attributeString);

        if (match && slicedSelector === match[0]) {
          result = match[0];
        }
      }

      switch (attributeSelector.charAt(0)) {
        case '*': {
          const match = slicedSelector.match(attributeString);

          if (match) {
            result = value.nameGeneratorCounter.generate() +
                     match[0] +
                     value.nameGeneratorCounter.generate();
          }
          break;
        }
        case '^': {
          const match = slicedSelector.match(`^${attributeString}`);

          if (match) {
            result = match[0] + value.nameGeneratorCounter.generate();
          }
          break;
        }
        case '$': {
          const match = slicedSelector.match(`${attributeString}$`);

          if (match) {
            result = value.nameGeneratorCounter.generate() + match[0];
          }
          break;
        }
        default: break;
      }
    });

    return result;
  } // /replaceAttributeSelector
}

export default new AttributeLibrary();
