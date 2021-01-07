import { parse } from 'postcss';

import replaceRegex from './replace/regex';
import excludeList from './helpers/excludeList';
import { NameGenerator } from './nameGenerator';
import { BaseLibrary, BaseLibraryOptions } from './baseLibrary';

export interface AttributeSelector {
  type: string;
  originalString: string;
  regexType: string;
  nameGeneratorCounter: NameGenerator;
}

export interface AttributeLibraryOptions extends BaseLibraryOptions {
  regex?: boolean;
  getRenamedValues?: boolean;
}

export interface GetAllOptions {
  getRenamedValues?: boolean;
  regex?: boolean;
  addSelectorType?: boolean;
}

// This abstract class implements the attribute parsing and replacing logic
// It has to be specialized for each type (likely class or id), and thus
// any logic of selection (like . or #) is defined in the child class, not this one.
export class AttributeLibrary extends BaseLibrary {
  attributeSelectors: { [s: string]: AttributeSelector } = {};

  // used at many place, let make a single function for this
  static isSelector(selector: string): boolean {
    return selector.charAt(0) === '.' || selector.charAt(0) === '#';
  }

  static removePseudoElements(value: string): string {
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

  static replaceAnAttributeSelector(
    result: string | false,
    attributeSelector: string,
    value: AttributeSelector,
    slicedSelector: string,
  ): string | false {
    if (result !== false) return result;

    const attributeString = attributeSelector.slice(1, attributeSelector.length);

    if (attributeSelector.charAt(0) === '|') {
      const match = slicedSelector.match(`^${attributeString}-`);

      if (match) {
        const newMatch = match[0].replace(/-$/, '');

        return `${newMatch}-${value.nameGeneratorCounter.generate(slicedSelector)}`;
      }
    }

    if (attributeSelector.charAt(0).match(/^[=~|]/)) {
      const match = slicedSelector.match(attributeString);

      if (match && slicedSelector === match[0]) {
        return match[0];
      }
    }

    switch (attributeSelector.charAt(0)) {
      case '*': {
        const match = slicedSelector.match(attributeString);

        if (match) {
          return value.nameGeneratorCounter.generate(slicedSelector)
            + match[0]
            + value.nameGeneratorCounter.generate(slicedSelector);
        }
        break;
      }
      case '^': {
        const match = slicedSelector.match(`^${attributeString}`);

        if (match) {
          return match[0] + value.nameGeneratorCounter.generate(slicedSelector);
        }

        break;
      }
      case '$': {
        const match = slicedSelector.match(`${attributeString}$`);

        if (match) {
          return value.nameGeneratorCounter.generate(slicedSelector) + match[0];
        }

        break;
      }

      default: break;
    }

    return false;
  }

  constructor() {
    super();

    this.setExclude(excludeList);
  }

  // Get the selector char for this child class
  selectorFirstChar = (): string => '#';

  prefetchValue = (selector: string): string => selector.replace(/(\.|#)/, '').replace(/\\/g, '');

  // Child class will override this to whatever regex that best fit their need
  // For example: form[class*=selector]
  // The regex should have 3 group matches:
  // First: The attribute name ('class' in previous example),
  // Second: The regular expression operator (* in previous example, '' when none)
  // Third: The term used ('selector' in the previous example)
  getAttributeSelectorRegex = (): RegExp => replaceRegex.idAttributeSelectors;

  reset(): ReturnType<BaseLibrary['reset']> {
    super.reset();

    this.attributeSelectors = {};
    this.setExclude(excludeList);
  }

  fillLibrary(data: string | Buffer, options = {}): ReturnType<BaseLibrary['fillLibrary']> {
    const code = data.toString();
    const result = parse(code);

    // todo jpeer: check postcss types
    result.walk((root: any) => {
      const parentName = (root.parent as any).name || '';

      if (root.selector && !parentName.match(/keyframes/)) {
        const matchedSelectors = root.selector.match(replaceRegex.selectors) || [];

        this.set(matchedSelectors, options);
      }
    });
  }

  isValidSelector(selector: string): boolean {
    return selector.charAt(0) === this.selectorFirstChar();
  }

  // Prepare the value to store in the mapping
  prepareValue(
    repObj: Parameters<BaseLibrary['prepareValue']>[0],
    options: AttributeLibraryOptions = {},
  ): ReturnType<BaseLibrary['prepareValue']> {
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

    if (repObj.renamedValue !== undefined && AttributeLibrary.isSelector(repObj.renamedValue)) {
      // eslint-disable-next-line no-param-reassign
      repObj.renamedValue = repObj.renamedValue.slice(1, repObj.renamedValue.length);
    }
    // eslint-disable-next-line no-param-reassign
    repObj.value = realSelector;
    return true;
  }

  // todo jpeer: #104 remove any
  postfetchValue(result: string, opts: AttributeLibraryOptions): string | any {
    const options: AttributeLibraryOptions = {
      addSelectorType: false,
      ...opts,
    };

    return (
      (options.addSelectorType ? this.selectorFirstChar() : '')
      + this.prefix
      + result
      + this.suffix
    );
  }

  getAll(opts?: Omit<GetAllOptions, 'regex'> & { regex: true }): RegExp | undefined;

  getAll(opts?: Omit<GetAllOptions, 'regex'> & { regex?: false }): { [s: string]: string };

  getAll(opts: GetAllOptions = {}): { [s: string]: string } | RegExp | undefined {
    let originalSelector;
    let compressedSelector;

    let resultArray: string[] = [];
    let result: { [s: string]: string } = {};

    const selectors = this.values;
    const options: Required<GetAllOptions> = {
      getRenamedValues: false,
      regex: false,
      addSelectorType: false,
      ...opts,
    };

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
      resultArray = resultArray.map((value) => `${this.selectorFirstChar()}${value}`);
    }

    if (options.regex) {
      const regex = options.addSelectorType
        ? new RegExp(resultArray.map((v) => `\\${v}`).join('|'), 'g')
        // the next MUST be options.regex === true
        : new RegExp(`(\\s|\\${this.selectorFirstChar()})(${resultArray.join('|')})[\\s)]`, 'g');

      const regexResult = resultArray.length === 0 ? undefined : regex;

      return regexResult;
    }

    if (options.addSelectorType) {
      const tempResult: { [s: string]: string } = {};

      resultArray.forEach((value) => {
        const modValue = value.slice(1, value.length);

        tempResult[value] = result[modValue];
      });

      result = tempResult;
    }

    return result;
  }

  setAttributeSelector(attributeSelector: string | string[]): void {
    if (!attributeSelector) {
      return;
    }

    if (Array.isArray(attributeSelector)) {
      attributeSelector.forEach((value) => this.setAttributeSelector(value));

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
      nameGeneratorCounter: new NameGenerator('attribute'),
    };

    // then, we need to replace any original selector that would be matching this rule with a
    // rename that still match the replacement
    Object.keys(this.values).forEach((key) => {
      const r = AttributeLibrary.replaceAnAttributeSelector(
        false,
        attributeSelectorKey,
        this.attributeSelectors[attributeSelectorKey],
        key,
      );

      if (r !== false) {
        const prev = this.values[key];

        this.values[key] = r;
        delete this.compressedValues[prev];
        this.compressedValues[r] = key;
      }
    });
  }

  replaceAttributeSelector(selector: string): string | false {
    if (!this.isValidSelector(selector)) {
      return false;
    }

    const slicedSelector = selector.replace(/^[.#]/, '');

    return (
      Object.entries(this.attributeSelectors)
        .reduce<string | false>(
          (a, entry) => (
            AttributeLibrary.replaceAnAttributeSelector(a, entry[0], entry[1], slicedSelector)
          ),
          false,
        )
    );
  }
}

export default new AttributeLibrary();
