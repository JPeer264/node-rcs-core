import { Statistic } from '../statistics/generate';

/**
 * the main logic for the optimization
 *
 * returns a list of sorted selectors to rename
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const sortSelectors = (selectors: string[][], statistic: Statistic): string[] => {
  const sortedSelectors = selectors;

  return sortedSelectors.map(([selector]) => selector);
};

export default sortSelectors;
