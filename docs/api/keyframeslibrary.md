# rcs.keyframesLibrary

## Methods
- [fillLibrary](#filllibrary)
- [get](#get)
- [set](#set)
- [setExclude](#setexclude)

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

### set

> Sets a specific keyframe into the keyframesLibrary

**rcs.keyframesLibrary.set(selector[, renamedKeyframe])**

Parameters:
- selector `<String>`
- renamedKeyframe `<String>` (optional). Any name how the keyframe should be named

Example:

```js
const rcs = require('rcs-core');

rcs.keyframesLibrary.set('move'); // sets to 'a'
rcs.keyframesLibrary.set('animate', 'anim'); // sets to 'anim'

rcs.keyframesLibrary.get('move'); // a
rcs.keyframesLibrary.get('animate'); // anim
```

### setExclude

> To exclude some keyframes

**rcs.keyframesLibrary.setExclude(keyframe)**

Parameters:
- toExclude `<String>`. This given keyframe will not be set or get anymore

Example:

```js
const rcs = require('rcs-core');

rcs.keyframesLibrary.setExclude('motion');

// keyframes named `motion` will not be added to the library
rcs.keyframesLibrary.set('motion'); // will not set the minified one
rcs.keyframesLibrary.get('motion'); // motion
