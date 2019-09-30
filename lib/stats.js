import entries from 'object.entries';

import selectorsLibrary from './selectorsLibrary';
import cssVariablesLibrary from './cssVariablesLibrary';
import keyframesLibrary from './keyframesLibrary';


const stats = () => {
  const classSelector = selectorsLibrary.getClassSelector();
  const idSelector = selectorsLibrary.getIdSelector();
  const cssVariables = entries(cssVariablesLibrary.meta);
  const keyframes = entries(keyframesLibrary.meta);

  const getUnused = (obj) => obj.filter((entry) => entry[1].appearanceCount === 0)
    .map(([name]) => name);

  const unusedCssVariables = getUnused(cssVariables);
  const unusedKeyframes = getUnused(keyframes);
  const unusedClasses = getUnused(entries(classSelector.meta));
  const unusedIds = getUnused(entries(idSelector.meta));

  const classUsageCount = {};
  const idUsageCount = {};
  const cssVariablesUsageCount = {};
  const keyframesUsageCount = {};

  Object.keys(classSelector.values).forEach((v) => {
    classUsageCount[v] = classSelector.meta[v].appearanceCount;
  });
  Object.keys(idSelector.values).forEach((v) => {
    idUsageCount[v] = idSelector.meta[v].appearanceCount;
  });


  cssVariables.forEach(([name, meta]) => {
    cssVariablesUsageCount[name] = meta.appearanceCount;
  });

  keyframes.forEach(([name, meta]) => {
    keyframesUsageCount[name] = meta.appearanceCount;
  });

  // todo jpeer: refactor in next major release
  // { unused: { [s: string]: string[] } }
  // { usageCount: { [s: string]: { [s: string]: number } } }
  // or
  // { classes: { usageCount: { [s: string]: number }; unused: string[] } }
  // { cssVariables: { usageCount: { [s: string]: number }; unused: string[] } }
  return {
    cssVariablesUsageCount,
    unusedCssVariables,
    unusedKeyframes,
    keyframesUsageCount,
    classUsageCount,
    idUsageCount,
    unusedClasses,
    unusedIds,
  };
};

export default stats;
