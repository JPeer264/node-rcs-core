import { Statistic } from '../statistics/generate';

/**
 * the main logic for the optimization
 *
 * returns a list of sorted selectors to rename
 *
 * weight selectors and sort them based on their weight
 * the weight (W) is length of the selector (L)
 * muliplied by the appearences of the selector (C)
 *
 * Formular: L * C = W
 *
 * Example with two selectors 'a-very-long-selector' and 'short-selector':
 *
 * Apperiances:
 *   'short-selector': 10 times
 *   'a-very-long-selector': 2 times
 *
 * Length:
 *   'short-selector': 14
 *   'a-very-long-selector': 20
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const sortSelectors = (selectors: string[][], statistic: Statistic): string[] => {
  const { unused, usageCount } = statistic;

  const weightedSelectors = Object.entries(usageCount)
    // generate weights
    .reduce<[string, number][]>((prev, [selector, count]) => [
      ...prev,
      [selector, selector.length * count],
    ], [])
    // sort based on weights
    .sort((a, b) => (
      b[1] - a[1]
    ))
    .map(([selector]) => selector);

  // put unsuded to the end
  return [...weightedSelectors, ...unused];
};

export default sortSelectors;
