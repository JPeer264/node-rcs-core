import generate from '../mapping/generate';
import generateStatistics from '../statistics/generate';

type Result = { [key in keyof ReturnType<typeof generateStatistics>]: string[][] };

const separateMappingSelectors = (mappingSelectors: ReturnType<typeof generate>['selectors'] = {}): Result => {
  const selectors = Object.entries(mappingSelectors);
  const result: Result = {
    ids: [],
    classes: [],
    keyframes: [],
    cssVariables: [],
  };

  selectors.forEach(([selector, renamedSelector]) => {
    const plainSelector = selector.slice(1);
    const toPush = [plainSelector, renamedSelector];

    switch (selector.charAt(0)) {
      case '-':
        result.cssVariables.push(toPush);

        break;

      case '@':
        result.keyframes.push(toPush);

        break;

      case '#':
        result.ids.push(toPush);

        break;

      case '.':
      default:
        result.classes.push(toPush);
    }
  });

  return result;
};

export default separateMappingSelectors;
