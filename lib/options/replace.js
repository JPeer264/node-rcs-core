'use strict';

const _   = require('lodash');
const fs  = require('fs-extra');
const rcs = require('../rcs');
const StringDecoder = require('string_decoder').StringDecoder;

// matches from . or # every character until : or . or ) (for pseudo elements or dots or even in :not(.class))
const regex = {
    selectors: /(#|\.)[^\s:\.\{)[>+,\s]+/g, // matches all selectors beginning with . or # - e.g. .matching#alsomatch .matchmetoo
    multiLineComments: /\/\*([\s\S]*?)\*\//g, // match /* */ from files
    doubleQuotes: /"[^"]*"/g, // match everything within " " (double quotes)
    singleQuotes: /'[^']*'/g, // match everything within " " (double quotes)
    sizesWithDots: /\.([0-9]+?)(em|rem|%|vh|vw|s|cm|ex|in|mm|pc|pt|px|vmin)[^a-zA-Z]/g, // match everything which starts with . and has numbers in it and ends with em, rem,... plus no letter comes after - necessary for .9em or .10s
    onlyNumbers: /\.([0-9]*?)[0-9](\s|;|}|\))/g, // match if there are just numbers between . and \s or ; or } or ) - otherwise it will be regogniced as class
    urlAttributes: /url\(([\s\S]*?)\)/g, // matches url() attributes from css - it can contain .woff or .html or similiar
    hexCodes: /#([a-zA-Z0-9]{3,6})(\s|;|}|!|,)/g, // matches hex colors with 3 or 6 values - unfortunately also matches also ids with 3 or 6 digits - e.g. matches #fff #header #0d0d0d
    strings: /"\s*[\S\w\d ]*?\s*"|'\s*[\S\w\d ]*?\s*'/g, // matches strings such as: 'hello' or "hello"
    attributeContent: /:.+(;|})/g, // matches everything between : and ; - in case everything is in one line, and `;` is missing it will go until `}` - good for: `filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);`
    attributeSelectors: /\[\s*(class|id)\s*([*^$])=\s*("[\s\S]*?"|'[\s\S]*?')[\s\S]*?\]/g // matches attribute selectors of html just with class or id in it with `$=`, `^=` or `*=`, e.g.: [class*="selector"]. 3 group matches, first `class` or `id`, second regex operator, third the string
};

/**
 * parses through every single document and renames the names
 * (require(rcs-core)).replace
 *
 * @module replace
 */
const replace = module.exports = {};

/**
 * Parse a file and returns new selectors if the option 'isSelectors' is set to true
 * runs internally replace.buffer
 *
 * @param  {String} filepath    the file's path to change
 * @param  {Object} [options]   same as replace.buffer
 * @param  {Object} cb          the callback
 *
 * @return {Object}
 */
replace.file = (filepath, options, cb) => {
    const decoder = new StringDecoder('utf8');

    // set cb if options are not set
    if (typeof cb !== 'function') {
        cb      = options;
        options = {};
    }

    fs.readFile(filepath, (err, data) => {
        let bufferObject;
        let result;

        if (err || data.length === 0) {
            return cb({
                message: 'File does not exist or is empty',
                error: 'ENOENT'
            });
        };

        bufferObject = replace.buffer(data);

        result = {
            filepath: filepath,
            data: decoder.write(bufferObject)
        }

        return cb(null, result);
    });
}; // /file

/**
 * Parse a buffer and returns new selectors if the option 'isSelectors' is set to true
 *
 * @param  {String} bufferObject    the buffer's path to change
 * @param  {Object} [options]
 * @property {String}   regex               a regular expression to match. Default: selectorLibrary.getAll
 * @property {Boolean}  [isSelectors=false] a boolean to get new values for the selectorLibrary
 *
 * @return {Object}
 */
replace.buffer = (bufferObject, options) => {
    const decoder = new StringDecoder('utf8');
    const optionsDefault = {
        regex: rcs.selectorLibrary.getAll({
            origValue: true,
            regex: true,
            isSelectors: false
        })
    };

    let data = decoder.write(bufferObject);

    options = _.merge(optionsDefault, options);

    if (data.length === 0) {
        return bufferObject;
    }

    data = data.replace(regex.strings, match => {
        return replace.string(match, options.regex);
    });

    return new Buffer(data);
}; // /buffer

/**
 * gets a string, with stringcharacters, and replace all css matches to the minified one
 *
 * @param  {String} string the string where the css selectors could be in
 * @param  {RegExp} regex  the regex to check for the selectors
 *
 * @return {String}        the string with the minified selectors
 */
replace.string = (string, regex) => {
    // save the string characters
    const beginChar = string.charAt(0);
    const endChar   = string.charAt(string.length - 1);

    // remove the string characters
    string = string.slice(1, string.length);
    string = string.slice(0, string.length - 1);
    // set whitespaces all whitespaces in string from 1 to 3
    string = string.replace(/\s+/g, '   ');
    // add whitespace at the beginning and the end
    string = ' ' + string + ' ';

    string = string.replace(regex, match => {
        let selectorChar;

        match        = match.replace(/\s+/g, '');
        selectorChar = match.charAt(0) === '.' || match.charAt(0) === '#' ? match.charAt(0) : '';

        return ' ' + selectorChar + rcs.selectorLibrary.get(match) + ' ';
    });

    // remove whitespaces at beginning and end of string
    string = string.replace(/^\s+|\s+$/g, '');
    // set all whitespaces from before set 3 to one now
    string = string.replace(/\s+/g, ' ');
    // add the string characters
    string = beginChar + string + endChar;

    return string
}; // /string

/**
 * special replacements for css files - needs to store selectors in the selectorLibrary
 *
 * @param {String} filepath the path where the css files are located
 * @param {Object} [options] same as replace.buffer
 * @property {String}  prefix            the prefix for renaming
 * @property {String}  suffix            the suffix for renaming
 * @property {Boolean} preventRandomName prevent minify selectors (good for just prefix/suffix)
 *
 * @return {Function} the callback
 */
replace.fileCss = (filepath, options, cb) => {
    const decoder = new StringDecoder('utf8');

    // set cb if options are not set
    if (typeof cb !== 'function') {
        cb      = options;
        options = {};
    }

    fs.readFile (filepath, (err, data) => {
        let bufferObject;
        let result;

        if (err || data.length === 0) {
            return cb ({
                message: 'File does not exist or is empty',
                error: 'ENOENT'
            });
        }

        bufferObject = replace.bufferCss(data, options);

        result = {
            filepath,
            data: decoder.write(bufferObject)
        }

        return cb(null, result);
    });
}; // /fileCss

/**
 * special replacements for css files - needs to store selectors in the selectorLibrary
 *
 * @todo define options
 *
 * @param {String} bufferObject the path where the css files are located
 * @param {Object} [options]
 * @property {String}  prefix            the prefix for renaming
 * @property {String}  suffix            the suffix for renaming
 * @property {Boolean} preventRandomName prevent minify selectors (good for just prefix/suffix)
 *
 * @return {Function} the callback
 */
replace.bufferCss = (bufferObject, options) => {
    const decoder = new StringDecoder('utf8');

    let result;
    let data = decoder.write(bufferObject);

    options = options || {};

    if (data.length === 0) {
        return bufferObject;
    }

    if (!options.ignoreAttributeSelector) {
        rcs.selectorLibrary.setAttributeSelector(data.match(regex.attributeSelectors));
    }

    // set the selectors
    // first removing everything which can match with 'regex.selectors'
    rcs.selectorLibrary.set(
        data
            .replace(regex.multiLineComments, ' ')
            .replace(regex.urlAttributes, ' ')
            .replace(regex.hexCodes, ' ')
            .replace(regex.doubleQuotes, ' ')
            .replace(regex.singleQuotes, ' ')
            .replace(regex.sizesWithDots, ' ')
            .replace(regex.onlyNumbers, ' ')
            .replace(regex.attributeContent, ' ')
            .match(regex.selectors),
        options
    );

    options.regex = rcs.selectorLibrary.getAll({
        origValues: true,
        regexCss: true,
        isSelectors: true
    });

    data = data.replace(options.regex, getCssSelector);

    if (!options.ignoreAttributeSelector) {
        data = data.replace(regex.attributeSelectors, getAttributeSelector);
    }

    return new Buffer(data);

    /**
     * calls the rcs.selectorLibrary.getAttributeSelector internally
     * String.replace will call this function and get call rcs.selectorLibrary.getAttributeSelector directly
     *
     * @param  {String} match
     *
     * @return {String} rcs.selectorLibrary.getAttributeSelector()
     */
    function getAttributeSelector(match) {
        const re         = new RegExp(regex.attributeSelectors);
        const exec       = re.exec(match);
        const stringChar = exec[3].charAt(0);
        const stringWithoutStringChars = exec[3].slice(1, exec[3].length - 1);

        let result = match;
        let newString = exec[3];

        if (exec[2] === '$' && typeof options.suffix === 'string') {
            newString = stringChar + stringWithoutStringChars + options.suffix + stringChar
        }

        if (exec[2] === '^' && typeof options.suffix === 'string') {
            newString = stringChar + options.prefix + stringWithoutStringChars + stringChar
        }

        result = result.replace(regex.strings, newString);

        return result;
    } // /getCssSelector in bufferCss

    /**
     * calls the rcs.selectorLibrary.get internally
     * String.replace will call this function and get call rcs.selectorLibrary.get directly
     *
     * @param  {String} match
     *
     * @return {String} rcs.selectorLibrary.get()
     */
    function getCssSelector(match) {
        let result = rcs.selectorLibrary.get(match, {
            isSelectors: true
        });

        return result;
    } // /getCssSelector in bufferCss
}; // /bufferCss
