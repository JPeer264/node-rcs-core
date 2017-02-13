'use strict';

const fs   = require('fs-extra');
const path = require('path');

/**
 * helper will create new and unique names
 * (require(rcs-core)).helper
 *
 * @module helper
 */
const helper = module.exports = {};

helper.saveSync = (destinationPath, data, options) => {
    options = options || {};

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

/**
 * saves any file and creates the folder if it does not exist
 *
 * @param  {String}   destinationPath   the destination path including the filename
 * @param  {String}   data              the data to write into the file
 * @param  {Function} cb
 *
 * @return {Function} cb
 */
helper.save = (destinationPath, data, options, cb) => {
    // @todo check if the filepath has an .ext

    // set cb if options are not set
    if (typeof cb !== 'function') {
        cb      = options;
        options = {};
    }

    if (!options.overwrite && fs.existsSync(destinationPath)) {
        return cb({
            message: 'File exist and cannot be overwritten. Set the option overwrite to true to overwrite files.'
        });
    }

    fs.mkdirs(path.dirname(destinationPath), (err) => {
        fs.writeFile(destinationPath, data, (err, data) => {
            if (err) return cb(err);

            return cb(null, `Successfully wrote ${ destinationPath }`);
        });
    });
}; // /save

/**
 * gets a json object and compiles it into a readable json string
 *
 * @param  {Object} object              the json object
 * @param  {String} [indentation='\t']  the indentation of the json string
 *
 * @return {String} the readable json string
 */
helper.objectToJson = (object, indentation) => {
    let beautifiedString;

    indentation      = indentation || '\t';
    beautifiedString = JSON.stringify(object, null, indentation);

    return beautifiedString;
}; // /objectToJson
