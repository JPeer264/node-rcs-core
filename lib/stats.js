import selectorLibrary from './selectorLibrary';

const stats = () => {
  const selectors = Object.values(selectorLibrary.selectors);

  const unusedClasses = selectors
    .filter(v => v.typeChar === '.' && v.appearanceCount === 0)
    .map(v => v.modifiedSelector);

  const unusedIds = selectors
    .filter(v => v.typeChar === '#' && v.appearanceCount === 0)
    .map(v => v.modifiedSelector);

  const classUsageCount = {};
  const idUsageCount = {};

  selectors.forEach((v) => {
    const object = v.typeChar === '.'
      ? classUsageCount
      : idUsageCount;

    object[v.modifiedSelector] = v.appearanceCount;
  });

  return {
    classUsageCount,
    idUsageCount,
    unusedClasses,
    unusedIds,
  };
};

export default stats;
