'use strict';

const _   = require('lodash');
const fs  = require('fs-extra');
const rcs = require('../rcs');

/**
 * parses through every single document and renames the names
 * (require(rcs-core)).replace
 *
 * @module replace
 */
const replace = module.exports = {};

/**
 * Parse a file and returns new selectors if the option 'isSelectors' is set to true
 *
 * @param  {String} filepath    the file's path to change
 * @param  {Object} [options]
 * @property {String}   regex               a regular expression
 * @property {String}   prefix              the prefix for renaming
 * @property {Boolean}  [isSelectors=false] a boolean to get new values for the selectorLibrary
 * @param  {Object} cb          the callback
 *
 * @return {Object}
 */
replace.file = (filepath, options, cb) => {
    let result;
    let regex;
    const optionsDefault = {
        prefix: '',
        regex: rcs.selectorLibrary.getAll({
            origValue: true,
            regex: true,
            isSelectors: false
        })
    };

    // set cb if options are not set
    if (typeof cb !== 'function') {
        cb      = options;
        options = {};
    }

    options = _.merge(optionsDefault, options);

    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err || data.length === 0) {
            return cb({
                message: 'File does not exist or is empty',
                error: 'ENOENT'
            });
        };

        data = data.replace(/('|")\s*[\s\S]*?\s*('|")/g, match => {
            return replace.string(match, options.regex);
        });

        result = {
            filepath: filepath,
            data: data
        }

        return cb(null, result);
    });
}; // /file

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
 * @todo define options
 *
 * @param {String} filepath the path where the css files are located
 * @param {Object} [options]
 *
 * @return {Function} the callback
 */
replace.fileCss = (filepath, options, cb) => {
    let result;
    // matches from . or # every character until : or . or ) (for pseudo elements or dots or even in :not(.class))
    // todo update regex
    const regex                   = /(#|\.)[^\s:\.\{)[>+,\s]+/g; // matches all selectors beginning with . or # - e.g. .matching#alsomatch .matchmetoo
    const matchMultiLineComments = /\/\*([\s\S]*?)\*\//g; // match /* */ from files
    const matchDoubleQuotes      = /"[^"]*"/g; // match everything within " " (double quotes)
    const matchSingleQuotes      = /'[^']*'/g; // match everything within " " (double quotes)
    const matchSizesWithDots     = /\.([0-9]*?)(em|rem|%|vh|vw|s|cm|ex|in|mm|pc|pt|px|vmin)/g; // match everything which starts with . and has numbers in it and ends with em, rem,... - necessary for .9em or .10s
    const matchOnlyNumbers       = /\.([0-9]*?)[0-9](\s|;|}|\))/g; // match if there are just numbers between . and \s or ; or } or ) - otherwise it will be regogniced as class
    const matchUrlAttributes     = /url\(([\s\S]*?)\)/g; // matches url() attributes from css - it can contain .woff or .html or similiar
    const matchHexCodes          = /#([a-zA-Z0-9]{3,6})(\s|;|}|!|,)/g; // matches hex colors with 3 or 6 values - unfortunately also matches also ids with 3 or 6 digits - e.g. matches #fff #header #0d0d0d

    // set cb if options are not set
    if (typeof cb !== 'function') {
        cb      = options;
        options = {};
    }

    fs.readFile (filepath, 'utf8', (err, data) => {
        if (err || data.length === 0) {
            return cb ({
                message: 'File does not exist or is empty',
                error: 'ENOENT'
            });
        }

        rcs.selectorLibrary.set(
            data
                .replace(matchMultiLineComments, ' ')
                .replace(matchUrlAttributes, ' ')
                .replace(matchHexCodes, ' ')
                .replace(matchDoubleQuotes, ' ')
                .replace(matchSingleQuotes, ' ')
                .replace(matchSizesWithDots, ' ')
                .replace(matchOnlyNumbers, ' ')
                .match(regex)
        );

        options.regex = rcs.selectorLibrary.getAll({
            origValues: true,
            regexCss: true,
            isSelectors: true
        });

        data = data.replace(options.regex, getCssSelector);

        result = {
            filepath: filepath,
            data: data
        }

        return cb(null, result);
    });

    /**
     * calls the rcs.selectorLibrary.get internally
     * String.replace will call this function and get call rcs.selectorLibrary.get directly
     *
     * @param  {String} match
     * @return {String} rcs.selectorLibrary.get()
     */
    function getCssSelector(match) {
        let result = rcs.selectorLibrary.get(match, {
            isSelectors: true
        });

        return result;
    } // /getCssSelector in fileCss
}; // /fileCss
