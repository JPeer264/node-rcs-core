import { Statistic } from '../statistics/generate';

/**
 * the main logic for the optimization
 *
 * Example with two selectors 'a-very-long-selector' and 'short-selector':
 *
 * Apperiances:
 *   'short-selector': 10 times
 *   'a-very-long-selector': 2 times
 *
 * Sort them by occorrunce count
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const sortSelectors = (selectors: string[], statistic: Statistic): string[] => {
  const { unused, usageCount } = statistic;

  const weightedSelectors = selectors
    .map((selector) => [selector, usageCount[selector] || 0] as const)
    // sort based on weights
    .sort((a, b) => (
      b[1] - a[1]
    ))
    .map(([selector]) => selector);

  // put unsuded to the end
  return [...weightedSelectors, ...unused];
};

export default sortSelectors;
