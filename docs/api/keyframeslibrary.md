# rcs.keyframesLibrary

## Methods
- [fillLibrary](#filllibrary)
- [get](#get)

Plus methods of [BaseLibrary](./baselibrary.md):
- [set](#set)
- [setMultiple](#setmultiple)
- [setExclude](#setexclude)
- [isExcluded](#isexcluded)

### fillLibrary

> This will take your CSS file (as a string) and fills the library with all necessary information

** rcs.keyframesLibrary.fillLibrary(code)**

Parameters:
- code `<String>`

Example:

```js
const myCssFileWithKeyframes = '@keyframes move { from {} to {} }';

rcs.keyframesLibrary.fillLibrary(myCssFileWithKeyframes);
```

### get

> This will get a specific minified selector

**rcs.keyframesLibrary.get(selector[, options])**

Parameters:
- selector `<String>`
- options `<Object>` (optional):
  - origKeyframe `<Boolean>`: If true the input is the original keyframe so it will return the minified keyframe. Default: `true`


Example:

```js
const rcs = require('rcs-core');

rcs.keyframesLibrary.set('move'); // sets to 'a'

rcs.keyframesLibrary.get('move'); // a
rcs.keyframesLibrary.get('a', { origKeyframe: false }); // move
```
