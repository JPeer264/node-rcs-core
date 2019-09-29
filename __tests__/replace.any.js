import path from 'path';
import fs from 'fs';

import rcs from '../lib';

const fixturesCwd = 'test/files/fixtures';
const resultsCwd = 'test/files/results';

function replaceAnyMacro(input, expected, fillLibrary = '') {
  rcs.selectorsLibrary.fillLibrary(fillLibrary);

  expect(rcs.replace.any(input)).toBe(expected);
  expect(rcs.replace.any(new Buffer(input))).toBe(expected);
}

beforeEach(() => {
  rcs.selectorsLibrary.setAlphabet('#abcdefghijklmnopqrstuvwxyz');
  rcs.selectorsLibrary.reset();
});

it('should stay empty', () => {
  replaceAnyMacro(
    '',
    '',
  );
});

it('should remove jp-selector', () => {
  replaceAnyMacro(
    'const a = \'jp-selector\';\n\tdocument.getElementById(\'nothing-to-see\');',
    'const a = \'a\';\n\tdocument.getElementById(\'nothing-to-see\');',
    '.jp-selector {}',
  );
});

it('should replace nothing', () => {
  replaceAnyMacro(
    'const a = \'jp-selector\';\n\tdocument.getElementById(\'nothing-to-see\');',
    'const a = \'jp-selector\';\n\tdocument.getElementById(\'nothing-to-see\');',
  );
});

it('replace multiline strings', () => {
  replaceAnyMacro(
    'const a = \'jp-selector\';\n\tdocument.getElementById(\'nothing-to-see\');',
    'const a = \'jp-selector\';\n\tdocument.getElementById(\'nothing-to-see\');',
  );
});

it('should return the modified html file', () => {
  replaceAnyMacro(
    fs.readFileSync(path.join(fixturesCwd, '/html/index.html'), 'utf8'),
    fs.readFileSync(path.join(resultsCwd, '/html/index.html'), 'utf8'),
    fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'),
  );
});

it('should return the modified js buffer', () => {
  replaceAnyMacro(
    fs.readFileSync(path.join(fixturesCwd, '/js/main.txt'), 'utf8'),
    fs.readFileSync(path.join(resultsCwd, '/js/main.txt'), 'utf8'),
    fs.readFileSync(path.join(fixturesCwd, '/css/style.css'), 'utf8'),
  );
});
