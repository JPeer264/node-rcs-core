import test from 'ava';

import rcs from '../lib';

function replaceCssMacro(t, input, expected, options = {}) {
  rcs.fillLibraries(input, options);

  t.is(rcs.replace.css(input), expected);
  t.is(rcs.replace.css(new Buffer(input)), expected);
}


test.beforeEach(() => {
  rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.nameGenerator.reset();
  rcs.cssVariablesLibrary.reset();
});
