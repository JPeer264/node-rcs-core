import stats from './stats';
import replace from './replace';
import baseLibrary from './baseLibrary';
import fillLibraries from './fillLibraries';
import * as nameGenerator from './nameGenerator';
import selectorsLibrary from './selectorsLibrary';
import keyframesLibrary from './keyframesLibrary';
import cssVariablesLibrary from './cssVariablesLibrary';

import generate from './mapping/generate';
import load from './mapping/load';

import generateStats from './statistics/generate';
import loadStats from './statistics/load';

import extractFromHtml from './helpers/extractFromHtml';
import htmlToAst from './helpers/htmlToAst';
import warnings from './allWarnings';

export default {
  stats,
  replace,
  baseLibrary,
  fillLibraries,
  nameGenerator,
  selectorsLibrary,
  keyframesLibrary,
  cssVariablesLibrary,
  helpers: {
    htmlToAst,
    extractFromHtml,
  },
  mapping: {
    generate,
    load,
  },
  statistics: {
    generate: generateStats,
    load: loadStats,
  },
  warnings,
};
