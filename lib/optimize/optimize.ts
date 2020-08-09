import generateMapping from '../mapping/generate';
import generateStatistics from '../statistics/generate';
import { getStatistics } from '../statistics';
import loadMapping from '../mapping/load';
import selectorsLibrary from '../selectorsLibrary';
import keyframesLibrary from '../keyframesLibrary';
import cssVariablesLibrary from '../cssVariablesLibrary';
import separateMappingSelectors from './separateMappingSelectors';
import sortSelectors from './sortSelectors';

const optimize = (): void => {
  const mapping = generateMapping();
  const statistics = getStatistics();

  if (!statistics) {
    return;
  }

  // sorting
  // renaming into new mapping
  const separateMapping = separateMappingSelectors(mapping.selectors);
  const optimizedMapping: { [key in keyof ReturnType<typeof generateStatistics>]?: string[] } = {};

  // optimize each library
  Object.entries(separateMapping).forEach(([key, selectors]) => {
    const statisticsData = statistics[key as 'ids'];
    const newSortedSelectors = sortSelectors(selectors.map(([s]) => s), statisticsData);

    optimizedMapping[key as 'ids'] = newSortedSelectors;
  });

  // could be a cold start but
  // reset everything just in case
  selectorsLibrary.reset();
  keyframesLibrary.reset();
  cssVariablesLibrary.reset();

  // fill libraries with optimized mapping
  Object.entries(optimizedMapping).forEach(([key, selectors]) => {
    if (!selectors) {
      return;
    }

    switch (key) {
      case 'ids':
        selectors.forEach((selector) => selectorsLibrary.set(`#${selector}`));

        break;

      case 'keyframes':
        selectors.forEach((selector) => keyframesLibrary.set(`@${selector}`));

        break;

      case 'cssVariables':
        selectors.forEach((selector) => cssVariablesLibrary.set(`--${selector}`));

        break;

      case 'classes':
      default:
        selectors.forEach((selector) => selectorsLibrary.set(`.${selector}`));
    }
  });

  // load with the same attribute selectors
  // these cannot be optimized yet
  loadMapping({ attributeSelectors: mapping.attributeSelectors });
};

export default optimize;
