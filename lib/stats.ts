import selectorsLibrary from './selectorsLibrary';
import cssVariablesLibrary from './cssVariablesLibrary';
import keyframesLibrary from './keyframesLibrary';

interface Stat {
  appearanceCount: number;
}

interface UsageCount {
  [s: string]: number;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const stats = () => {
  const classSelector = selectorsLibrary.getClassSelector();
  const idSelector = selectorsLibrary.getIdSelector();
  const cssVariables = Object.entries(cssVariablesLibrary.meta);
  const keyframes = Object.entries(keyframesLibrary.meta);

  const getUnused = (obj: [string, Stat][]): string[] => (
    obj.filter((entry) => entry[1].appearanceCount === 0)
      .map(([name]) => name)
  );

  const unusedCssVariables = getUnused(cssVariables);
  const unusedKeyframes = getUnused(keyframes);
  const unusedClasses = getUnused(Object.entries(classSelector.meta));
  const unusedIds = getUnused(Object.entries(idSelector.meta));

  const classUsageCount: UsageCount = {};
  const idUsageCount: UsageCount = {};
  const cssVariablesUsageCount: UsageCount = {};
  const keyframesUsageCount: UsageCount = {};

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

  return {
    ids: {
      unused: unusedIds,
      usageCount: idUsageCount,
    },
    classes: {
      unsused: unusedClasses,
      usageCount: classUsageCount,
    },
    cssVariables: {
      unused: unusedCssVariables,
      usageCount: cssVariablesUsageCount,
    },
    keyframes: {
      unused: unusedKeyframes,
      usageCount: keyframesUsageCount,
    },
  };
};

export default stats;
