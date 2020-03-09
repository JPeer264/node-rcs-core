import selectorsLibrary from '../selectorsLibrary';
import keyframesLibrary from '../keyframesLibrary';

export interface LoadMappingOptions {
  origValues?: boolean;
}

export interface Mapping {
  attributeSelectors?: string[];
  selectors?: { [s: string]: string };
}

const load = (mapping: Mapping, options: LoadMappingOptions = {}): void => {
  if (Object.prototype.toString.call(mapping) !== '[object Object]') {
    console.warn(`Could not load mapping. Invalid type found ${options} instead of object`);

    return;
  }

  let sortedSelectors = mapping.selectors || {};
  const attributeSelectors = mapping.attributeSelectors || [];

  const { origValues = true } = options;

  // swap values if it's not the original values first
  if (!origValues) {
    const tempMapping: { [s: string]: string } = {};

    Object.keys(sortedSelectors).forEach((key) => {
      const value = sortedSelectors[key];
      const modKey = key.slice(1, key.length);

      tempMapping[key.charAt(0) + value] = modKey;
    });

    sortedSelectors = tempMapping;
  }

  attributeSelectors.forEach((key) => {
    const attributeSelector = key.slice(2);
    const firstChar = key.charAt(0);
    let secondChar = key.charAt(1);

    if (secondChar === '=') {
      // if the second char is just a comparison it should not get added
      // as a '=' is already added when setting the attributeSelector
      secondChar = '';
    }

    if (firstChar === '.') {
      selectorsLibrary.getClassSelector().setAttributeSelector(`[class${secondChar}=${attributeSelector}]`);
    } else if (firstChar === '#') {
      selectorsLibrary.getIdSelector().setAttributeSelector(`[id${secondChar}=${attributeSelector}]`);
    }
  });

  Object.entries(sortedSelectors).forEach(([key, value]) => {
    switch (key.charAt(0)) {
      case '@':
        keyframesLibrary.set(key, value);
        break;

      case '.':
      case '#':
      default:
        selectorsLibrary.set(key, value);
    }
  });
};

export default load;
