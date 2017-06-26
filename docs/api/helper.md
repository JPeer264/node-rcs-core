# rcs.helper

## Methods
- [save](#save)
- [saveSync](#save)

### save

> Saves a file into any path

**rcs.helper.save(destinationPath, data[, options] cb)**

Sync: `saveSync`

Parameters:
- destinationPath `<String>`
- data `<String>`
- options `<Object>`:
    - overwrite `<Boolean>`: If it should overwrite an existing file. Default `false`.
- cb `<Function>`: The callback which is called if it was successfull (just on async)

Example:

```js
const rcs = require('rcs-core');

rcs.helper.save('/my/path/file.txt', 'My data', err => {
    if (err) return console.log(err);

    console.log('The file has been successfully created!');
});
```
