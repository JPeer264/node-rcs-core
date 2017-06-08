const rcs = {};

module.exports = rcs;

// eslint-disable-next-line
const doRequire = name => rcs[name] = require(`./options/${name}`);

doRequire('helper');
doRequire('nameGenerator');
doRequire('selectorLibrary');
doRequire('keyframesLibrary');
doRequire('replace');
