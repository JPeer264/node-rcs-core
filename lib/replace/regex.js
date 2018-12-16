export default {
  selectors: /(#|\.)[^\s.{)[>+,]+/g, // matches all selectors beginning with . or # - e.g. .matching#alsomatch .matchmetoo
  escapedSelectors: /\\.+/, // matches escaped selectors such as .hello\:something
  escapedAndDots: /[\\:].+/, // matches escaped and normal : in selectors
  strings: /"\s*[\S\s]*?\s*"|'\s*[\S\s]*?\s*'/g, // matches strings such as: 'hello' or "hello"
  attributeSelectors: /\[\s*(class|id)\s*([*^$|~]?)=\s*("[^\]]*?"|'[^\]]*?'|[^\]]*)[^\]]*?\]/g, // matches attribute selectors of html just with class or id in it with `$=`, `^=` or `*=`, e.g.: [class*="selector"]. 3 group matches, first `class` or `id`, second regex operator, third the string
  keyframes: /@(-[a-z]*-)*keyframes\s+([a-zA-Z0-9_-]+)/g, // matches keyframes and just the first group the first matched non-whitespace characters - e.g. matches: `@keyframes    my-KeyFra_me`
};
