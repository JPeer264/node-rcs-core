import selectorsLibrary from '../selectorsLibrary';

export interface LoadMappingOptions {
  origValues?: boolean;
}

const load = (mapping: { [s: string]: string }, options: LoadMappingOptions = {}): void => {
  if (Object.prototype.toString.call(mapping) !== '[object Object]') {
    console.warn(`Could not load mapping. Invalid type found ${options} instead of object`);

    return;
  }

  let selectors: { [s: string]: string } = mapping;

  const { origValues = true } = options;

  // swap values if it's not the original values first
  if (!origValues) {
    const tempSelectors: { [s: string]: string } = {};

    Object.keys(selectors).forEach((key) => {
      const value = selectors[key];
      const modKey = key.slice(1, key.length);

      tempSelectors[key.charAt(0) + value] = modKey;
    });

    selectors = tempSelectors;
  }

  selectorsLibrary.setMultiple(selectors);
};

export default load;
