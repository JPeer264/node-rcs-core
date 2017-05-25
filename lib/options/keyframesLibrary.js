'use strict';

const _        = require('lodash');
const rcs      = require('../rcs');
const includes = require('array-includes');

/**
 * a library holding all information about the keyframes including its old states
 */
class KeyframesLibrary {
    constructor() {
        this.excludes            = [];
        this.keyframes           = {};
        this.compressedKeyframes = {};
    }

    /**
     * @typedef {Object} getOptions
     * @property {Boolean} [origKeyframes=true] check if the original keyframes should get returned
     */
    /**
     * gets a specific keyframe
     *
     * @param {String} the keyframe
     * @param {getOptions} [options]
     * @return {String}
     */
    get(selector, options) {
        let result = this.keyframes[selector] || selector;

        const optionsDefault = {
            origKeyframe: true,
        }

        options = _.merge(optionsDefault, options);

        // fail on setted exludes
        if (includes(this.excludes, selector)) {
            return selector;
        }

        // change the objects if origKeyframe are set to false - to get information about the compressed keyframes
        if (!options.origKeyframe) {
            result = this.compressedKeyframes[selector] || result;
        }

        return result;
    } // /get

    /**
     * sets new values in the selector library
     *
     * @param {String | Array} value this could be either a css selector or an array of css selectors
     */
    set(keyframe, renamedKeyframe, options) {
        if (!keyframe) {
            return;
        }

        // call recursive if it is an array
        if (Object.prototype.toString.call(keyframe) === '[object Array]') {
            for (let key of keyframe) {
                this.set(key, renamedKeyframe, options);
            }

            return;
        }

        if (typeof renamedKeyframe !== 'string') {
            options         = renamedKeyframe;
            renamedKeyframe = undefined;
        }

        options = options || {};

        // skip excludes
        if (includes(this.excludes, keyframe)) {
            return;
        }

        // checks if this keyframe was already set
        if (!!this.keyframes[keyframe]) {
            return;
        }

        const randomName = renamedKeyframe || rcs.nameGenerator.generate();

        // save css selector into this.selectors and this.compressedSelectors
        this.keyframes[keyframe] = randomName;
        this.compressedKeyframes[randomName] = keyframe;

        return;
    } // /set

    /**
     * excludes keyframes and stores it into this.excludes
     *
     * @param {String | Array} toExclude a string or array with string to exclude specific keyframe
     */
    setExclude(toExclude) {
        if (!toExclude) return;

        // call recursive if it is an array
        if (Object.prototype.toString.call(toExclude) === '[object Array]') {
            for (let key of toExclude) {
                this.setExclude(key);
            }

            return;
        }

        if (includes(this.excludes, toExclude)) {
            return;
        }

        (this.excludes).push(toExclude);

        return;
    } // /setExclude
};

/**
 * creates a new keyframesLibrary
 * (require(rcs-core)).keyframesLibrary
 *
 * @module keyframesLibrary
 */
exports = module.exports = new KeyframesLibrary();
