const fs = require('fs');
const rcs = require('rcs-core');

// fill the libraries
// before starting with coding it might be useful
// to just prefix- and -suffix the selectors
// so later it is easier to detect the correct selectors
rcs.fillLibraries(fs.readFileSync('./before/bootstrap.css', 'utf8'), {
  preventRandomName: true,
  prefix: 'prefix-',
  suffix: '-suffix',
});

// replace the data
const cssData = rcs.replace.css(fs.readFileSync('./before/bootstrap.css', 'utf8'));

// write new files
fs.writeFileSync('./after/bootstrap.replaced.css', cssData);
