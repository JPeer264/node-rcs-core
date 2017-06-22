import test from 'ava';
import fs from 'fs-extra';
import path from 'path';

import rcs from '../lib/rcs';

const testCwd = 'test/files/testCache';

test.afterEach(() => {
  fs.removeSync(testCwd);
});

test.cb('save | should create a file within a non existing dir', (t) => {
  const filePath = path.join(testCwd, '/a/non/existing/path/test.txt');

  rcs.helper.save(filePath, 'test content', (err) => {
    t.not(err, undefined);

    t.true(fs.existsSync(filePath));
    t.is(fs.readFileSync(filePath, 'utf8'), 'test content');

    t.end();
  });
});

test.cb('save | should not overwrite the same file', (t) => {
  const filePath = path.join(testCwd, '/../config.json');
  const oldFile = fs.readFileSync(filePath, 'utf8');

  rcs.helper.save(filePath, 'test content', (err) => {
    t.is(err.message, 'File exist and cannot be overwritten. Set the option overwrite to true to overwrite files.');
    t.is(fs.readFileSync(filePath, 'utf8'), oldFile);

    t.end();
  });
});

test('saveSync | should save', (t) => {
  const filePath = path.join(testCwd, '/config.txt');

  rcs.helper.saveSync(filePath, 'test content');

  t.is(fs.readFileSync(filePath, 'utf8'), 'test content');
});

test('saveSync | should not overwrite the same file', (t) => {
  t.plan(2);

  const filePath = path.join(testCwd, '/../config.json');
  const oldFile = fs.readFileSync(filePath, 'utf8');

  try {
    rcs.helper.saveSync(filePath, 'test content');

    // if no error is thrown before it should fail here
    t.fail();
  } catch (e) {
    t.is(e.message, 'File exist and cannot be overwritten. Set the option overwrite to true to overwrite files.');
  }

  t.is(fs.readFileSync(filePath, 'utf8'), oldFile);
});
