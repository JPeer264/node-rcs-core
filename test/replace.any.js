import test from 'ava';
import path from 'path';
import fs from 'fs';

import rcs from '../lib';

const fixturesCwd = 'test/files/fixtures';
const resultsCwd = 'test/files/results';

function replaceAnyMacro(t, input, expected, fillLibrary = '') {
  rcs.selectorsLibrary.fillLibrary(fillLibrary);

  t.is(rcs.replace.any(input), expected);
  t.is(rcs.replace.any(new Buffer(input)), expected);
}

replaceAnyMacro.title = (providedTitle, input) => (!providedTitle ? input.trim() : providedTitle);

test.beforeEach(() => {
  rcs.nameGenerator.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.nameGenerator.reset();
  rcs.selectorsLibrary.reset();
});

test('should stay empty',
  replaceAnyMacro,
  '',
  '',
);

test(replaceAnyMacro,
  'const a = \'jp-selector\';\n\tdocument.getElementById(\'nothing-to-see\');',
  'const a = \'a\';\n\tdocument.getElementById(\'nothing-to-see\');',
  '.jp-selector {}',
);

test(replaceAnyMacro,
  'const a = \'jp-selector\';\n\tdocument.getElementById(\'nothing-to-see\');',
  'const a = \'jp-selector\';\n\tdocument.getElementById(\'nothing-to-see\');',
);

test('replace multiline strings',
  replaceAnyMacro,
  'const a = \'jp-selector\';\n\tdocument.getElementById(\'nothing-to-see\');',
  'const a = \'jp-selector\';\n\tdocument.getElementById(\'nothing-to-see\');',
);

test('should return the modified html file',
  replaceAnyMacro,
  fs.readFileSync(path.join(fixturesCwd, '/html/index.html'), 'utf8'),
  fs.readFileSync(path.join(resultsCwd, '/html/index.html'), 'utf8'),
  fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'),
);

test('should return the modified js buffer',
  replaceAnyMacro,
  fs.readFileSync(path.join(fixturesCwd, '/js/main.txt'), 'utf8'),
  fs.readFileSync(path.join(resultsCwd, '/js/main.txt'), 'utf8'),
  fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'),
);
