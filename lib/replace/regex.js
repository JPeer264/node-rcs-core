export default {
  selectors: /(#|\.)[^\s.{)[>+,]+/g, // matches all selectors beginning with . or # - e.g. .matching#alsomatch .matchmetoo
  strings: /"\s*[\S\s]*?\s*"|'\s*[\S\s]*?\s*'/g, // matches strings such as: 'hello' or "hello"
  classAttributeSelectors: /\[\s*class\s*([*^$|~]?)=\s*("[^\]]*?"|'[^\]]*?'|[^\]]*)[^\]]*?\]/g, // matches attribute selectors of html just with class in it with `$=`, `^=` or `*=`, e.g.: [class*="selector"]. 3 group matches, first `class`, second regex operator, third the string
  idAttributeSelectors: /\[\s*(id|for)\s*([*^$|~]?)=\s*("[^\]]*?"|'[^\]]*?'|[^\]]*)[^\]]*?\]/g, // matches attribute selectors of html just with 'for' or 'id' in it with `$=`, `^=` or `*=`, e.g.: [id*="selector"]. 3 group matches, first `for` or `id`, second regex operator, third the string
  keyframes: /@(-[a-z]*-)*keyframes\s+([a-zA-Z0-9_-]+)/g, // matches keyframes and just the first group the first matched non-whitespace characters - e.g. matches: `@keyframes    my-KeyFra_me`
  cssVariables: /var\(\s*(--[^,\s]+?)(?:\s*,\s*(.+))?\s*\)/g, // matches everything inside `var(match)` - e.g. var(my-variable)
  templateSelectors: /(class|for|id)+\s*=\s*(['"])((?:.(?!\2))*.?)\2/g, // matches class="xyz", for="xyz" and id='xyz' in template node, first is "class" or "for" or "id", second is the quote type and last is the class names or id
};
