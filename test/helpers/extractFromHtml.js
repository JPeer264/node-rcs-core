import test from 'ava';

import extractFromHtml from '../../lib/helpers/extractFromHtml';

test('should extract nothing', (t) => {
  const extracted = extractFromHtml('<!DOCTYPE html><html><head></head><body>Hi there!</body></html>');
  const extractedSecond = extractFromHtml('');

  t.is(extracted.length, 0);
  t.is(extractedSecond.length, 0);
});

test('should extract style tags', (t) => {
  const extractedStyle = extractFromHtml('<!DOCTYPE html><html><head></head><body>Hi there!<style>.test{} .css{}</style></body></html>');

  t.is(extractedStyle.length, 1);
  t.is(extractedStyle[0], '.test{} .css{}');
});

test('should extract script tags', (t) => {
  const extractedScript = extractFromHtml('<!DOCTYPE html><html><head></head><body>Hi there!<script type="text/javascript">var test = 123;</script></body></html>', 'script');
  const extractedStyle = extractFromHtml('<!DOCTYPE html><html><head></head><body>Hi there!<script type="text/javascript">var test = 123;</script></body></html>');

  t.is(extractedScript.length, 1);
  t.is(extractedStyle.length, 0);
  t.is(extractedScript[0], 'var test = 123;');
});
