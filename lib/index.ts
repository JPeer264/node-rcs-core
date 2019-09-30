import stats from './stats';
import replace from './replace';
import baseLibrary from './baseLibrary';
import fillLibraries from './fillLibraries';
import * as nameGenerator from './nameGenerator';
import selectorsLibrary from './selectorsLibrary';
import keyframesLibrary from './keyframesLibrary';
import cssVariablesLibrary from './cssVariablesLibrary';

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
  warnings,
};
