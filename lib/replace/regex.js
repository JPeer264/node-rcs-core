export default {
  selectors: /(#|\.)[^\s:.{)[>+,\s]+/g, // matches all selectors beginning with . or # - e.g. .matching#alsomatch .matchmetoo
  multiLineComments: /\/\*([\s\S]*?)\*\//g, // match /* */ from files
  doubleQuotes: /"[^"]*"/g, // match everything within " " (double quotes)
  singleQuotes: /'[^']*'/g, // match everything within " " (double quotes)
  sizesWithDots: /\.([0-9]+?)(em|rem|%|vh|vw|s|cm|ex|in|mm|pc|pt|px|vmin)([^a-zA-Z])/g, // match everything which starts with . and has numbers in it and ends with em, rem,... plus no letter comes after - necessary for .9em or .10s
  onlyNumbers: /\.([0-9]*?)[0-9](\s|;|}|\))/g, // match if there are just numbers between . and \s or ; or } or ) - otherwise it will be regogniced as class
  urlAttributes: /url\(([\s\S]*?)\)/g, // matches url() attributes from css - it can contain .woff or .html or similiar
  hexCodes: /#([a-zA-Z0-9]{3,6})(\s|;|}|!|,)/g, // matches hex colors with 3 or 6 values - unfortunately also matches also ids with 3 or 6 digits - e.g. matches #fff #header #0d0d0d
  strings: /"\s*[\S\s]*?\s*"|'\s*[\S\s]*?\s*'/g, // matches strings such as: 'hello' or "hello"
  attributeContent: /:.+?(;|}|\))/g, // matches everything between : and ; - in case everything is in one line, and `;` is missing it will go until `}` - good for: `filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);`
  attributeSelectors: /\[\s*(class|id)\s*([*^$])=\s*("[\s\S]*?"|'[\s\S]*?')[\s\S]*?\]/g, // matches attribute selectors of html just with class or id in it with `$=`, `^=` or `*=`, e.g.: [class*="selector"]. 3 group matches, first `class` or `id`, second regex operator, third the string
  keyframes: /@(-[a-z]*-)*keyframes\s+([a-zA-Z0-9_-]+)/g, // matches keyframes and just the first group the first matched non-whitespace characters - e.g. matches: `@keyframes    my-KeyFra_me`
  animationTrigger: /(animation-name|animation)(:\s*)([\s\S][^;}]+)/g, // matches `animation-name` or `animation`
  matchFirstWord: /[a-zA-Z0-9-_]+/, // just matches the first word which includes a-zA-Z0-9-_
};
