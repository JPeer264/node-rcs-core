import generate from './generate';

let statistics: null | ReturnType<typeof generate> = null;

export const setStatistics = (statisticsMap: ReturnType<typeof generate>): void => {
  statistics = statisticsMap;
};

export const getStatistics = (): typeof statistics => statistics;
