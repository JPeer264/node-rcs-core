import selectorsLibrary from '../selectorsLibrary';
import { Mapping } from './load';
import { AttributeSelector } from '../attributeLibrary';
import keyframesLibrary from '../keyframesLibrary';
import cssVariablesLibrary from '../cssVariablesLibrary';

export interface GenerateMappingOptions {
  origValues?: boolean;
}

const getAttributesMapping = (attributeSelectors: { [s: string]: AttributeSelector }): string[] => (
  Object.entries(attributeSelectors).reduce<string[]>((prev, [key, value]) => {
    const type = value.type === 'class' ? '.' : '#';

    return [
      ...prev,
      type + key,
    ];
  }, [])
);

const generate = (opts: GenerateMappingOptions = {}): Mapping => {
  if (Object.prototype.toString.call(opts) !== '[object Object]') {
    console.warn(`Mapping input is not an valid object. Found ${opts} instead`);

    return {};
  }

  const { origValues = true }: GenerateMappingOptions = opts;

  // selectors
  const cssClassMapping = selectorsLibrary.getClassSelector().getAll({
    getRenamedValues: !origValues,
    addSelectorType: true,
  });

  const cssIdMapping = selectorsLibrary.getIdSelector().getAll({
    getRenamedValues: !origValues,
    addSelectorType: true,
  });

  // keyframes
  let { keyframes } = keyframesLibrary;

  if (!origValues) {
    keyframes = Object.entries(keyframes).reduce((prev, [key, value]) => ({
      ...prev,
      // swap values
      [key.charAt(0) + value]: key.slice(1),
    }), {});
  }

  // css variables
  let cssVariables = origValues
    ? cssVariablesLibrary.values
    : cssVariablesLibrary.compressedCssVariables;

  cssVariables = Object.entries(cssVariables).reduce((prev, [key, value]) => ({
    ...prev,
    [`-${key}`]: value,
  }), {});

  // attributeSelectors
  const cssClassAttributesMapping = getAttributesMapping((
    selectorsLibrary.getClassSelector().attributeSelectors
  ));

  const cssIdAttributesMapping = getAttributesMapping((
    selectorsLibrary.getIdSelector().attributeSelectors
  ));

  const result: Mapping = {};
  const allSelectors = {
    ...cssClassMapping,
    ...cssIdMapping,
    ...keyframes,
    ...cssVariables,
  };
  const allAttributeSelectors = [...cssClassAttributesMapping, ...cssIdAttributesMapping];

  if (Object.keys(allSelectors).length > 0) {
    result.selectors = allSelectors;
  }

  if (allAttributeSelectors.length > 0) {
    result.attributeSelectors = allAttributeSelectors;
  }

  return result;
};

export default generate;
