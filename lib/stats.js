import values from 'object.values';
import entries from 'object.entries';

import selectorLibrary from './selectorLibrary';
import cssVariablesLibrary from './cssVariablesLibrary';
import keyframesLibrary from './keyframesLibrary';

const stats = () => {
  const selectors = values(selectorLibrary.selectors);
  const cssVariables = entries(cssVariablesLibrary.meta);
  const keyframes = entries(keyframesLibrary.meta);

  const unusedCssVariables = cssVariables
    .filter(entry => entry[1].appearanceCount === 0)
    .map(([name]) => name);

  const unusedKeyframes = keyframes
    .filter(entry => entry[1].appearanceCount === 0)
    .map(([name]) => name);

  const unusedClasses = selectors
    .filter(v => v.typeChar === '.' && v.appearanceCount === 0)
    .map(v => v.modifiedSelector);

  const unusedIds = selectors
    .filter(v => v.typeChar === '#' && v.appearanceCount === 0)
    .map(v => v.modifiedSelector);

  const classUsageCount = {};
  const idUsageCount = {};
  const cssVariablesUsageCount = {};
  const keyframesUsageCount = {};

  selectors.forEach((v) => {
    const object = v.typeChar === '.'
      ? classUsageCount
      : idUsageCount;

    object[v.modifiedSelector] = v.appearanceCount;
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
