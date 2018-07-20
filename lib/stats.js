import selectorLibrary from './selectorLibrary';

const stats = () => {
  const unusedClasses = Object.values(selectorLibrary.selectors)
    .filter(v => v.typeChar === '.' && v.appearanceCount === 0)
    .map(v => v.modifiedSelector);

  const unusedIds = Object.values(selectorLibrary.selectors)
    .filter(v => v.typeChar === '#' && v.appearanceCount === 0)
    .map(v => v.modifiedSelector);

  return {
    unusedClasses,
    unusedIds,
  };
};

export default stats;
