import stats from './stats';
import replace from './replace';
import baseLibrary from './baseLibrary';
import fillLibraries from './fillLibraries';
import nameGenerator from './nameGenerator';
import selectorLibrary from './selectorLibrary';
import keyframesLibrary from './keyframesLibrary';
import cssVariablesLibrary from './cssVariablesLibrary';

import extractFromHtml from './helpers/extractFromHtml';
import htmlToAst from './helpers/htmlToAst';

export default {
  stats,
  replace,
  baseLibrary,
  fillLibraries,
  nameGenerator,
  selectorLibrary,
  keyframesLibrary,
  cssVariablesLibrary,
  helpers: {
    htmlToAst,
    extractFromHtml,
  },
};
