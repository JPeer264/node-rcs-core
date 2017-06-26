import fs from 'fs-extra';
import path from 'path';

const saveSync = (destinationPath, data, options = {}) => {
  if (!options.overwrite && fs.existsSync(destinationPath)) {
    throw new Error('File exist and cannot be overwritten. Set the option overwrite to true to overwrite files.');
  }

  try {
    fs.mkdirsSync(path.dirname(destinationPath));
    fs.writeFileSync(destinationPath, data);
  } catch (err) {
    throw err;
  }
};

const save = (destinationPath, data, options, cb) => {
  // @todo check if the filepath has an .ext

  // set cb if options are not set
  if (typeof options === 'function') {
    cb = options;
    options = {};
  }

  if (!options.overwrite && fs.existsSync(destinationPath)) {
    return cb({
      message: 'File exist and cannot be overwritten. Set the option overwrite to true to overwrite files.',
    });
  }

  return fs.mkdirs(path.dirname(destinationPath), () => {
    fs.writeFile(destinationPath, data, (err) => {
      if (err) {
        return cb(err);
      }

      return cb(null, `Successfully wrote ${destinationPath}`);
    });
  });
}; // /save

export default {
  saveSync,
  save,
};
