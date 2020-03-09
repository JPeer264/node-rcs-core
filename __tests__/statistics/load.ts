/* eslint-disable @typescript-eslint/no-explicit-any */
import rcs from '../../lib';
import { getStatistics, setStatistics } from '../../lib/statistics';

test('should load config | with alias', () => {
  expect(getStatistics()).toBe(null);

  rcs.statistics.load('query' as any);

  expect(getStatistics()).toBe('query');

  setStatistics('another-query' as any);

  expect(getStatistics()).toBe('another-query');
});
