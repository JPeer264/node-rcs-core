import extractFromHtml from '../../lib/helpers/extractFromHtml';

it('should extract nothing', () => {
  const extracted = extractFromHtml('<!DOCTYPE html><html><head></head><body>Hi there!</body></html>');
  const extractedSecond = extractFromHtml('');

  expect(extracted.length).toBe(0);
  expect(extractedSecond.length).toBe(0);
});

it('should extract style tags', () => {
  const extractedStyle = extractFromHtml('<!DOCTYPE html><html><head></head><body>Hi there!<style>.test{} .css{}</style></body></html>');

  expect(extractedStyle.length).toBe(1);
  expect(extractedStyle[0]).toBe('.test{} .css{}');
});

it('should extract script tags', () => {
  const extractedScript = extractFromHtml('<!DOCTYPE html><html><head></head><body>Hi there!<script type="text/javascript">var test = 123;</script></body></html>', 'script');
  const extractedStyle = extractFromHtml('<!DOCTYPE html><html><head></head><body>Hi there!<script type="text/javascript">var test = 123;</script></body></html>');

  expect(extractedScript.length).toBe(1);
  expect(extractedStyle.length).toBe(0);
  expect(extractedScript[0]).toBe('var test = 123;');
});
