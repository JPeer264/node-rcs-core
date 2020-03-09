import generate from './statistics/generate';

const stats: typeof generate = () => {
  console.warn('rcs.stats is deprecated. Use rcs.statistics.generate instead');

  return generate();
};

export default stats;
