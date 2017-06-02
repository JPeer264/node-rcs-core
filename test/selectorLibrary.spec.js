'use strict';

const rcs    = require('../lib/rcs');
const expect = require('chai').expect;

describe('selectorLibrary', () => {
    beforeEach(() => {
        // reset counter and selectors for tests
        rcs.selectorLibrary.excludes            = [];
        rcs.selectorLibrary.selectors           = {};
        rcs.selectorLibrary.attributeSelectors  = {};
        rcs.selectorLibrary.compressedSelectors = {};

        rcs.nameGenerator.resetCountForTests();
    });

    describe('fillLibrary', () => {

    });

    describe('get', () => {
        beforeEach(() => {
            rcs.selectorLibrary.set([
                '.test',
                '#id',
                '.jp-selector'
            ]);
        });

        it('should not get any', () => {
            const selector = rcs.selectorLibrary.get('.nothing-to-get');

            expect(selector).to.equal('.nothing-to-get');
        });

        it('should get every single selectors', () => {
            const dotTestSelector = rcs.selectorLibrary.get('.test');
            const testSelector = rcs.selectorLibrary.get('test');

            expect(dotTestSelector).to.equal('a');
            expect(testSelector).to.equal('a');
        });

        it('should not get excluded selector', () => {
            rcs.selectorLibrary.excludes = ['test'];

            const dotTestSelector = rcs.selectorLibrary.get('.test');
            const testSelector = rcs.selectorLibrary.get('test');

            expect(dotTestSelector).to.equal('.test');
            expect(testSelector).to.equal('test');
        });
    });

    describe('getAll', () => {
        beforeEach(() => {
            rcs.selectorLibrary.set([
                '.test',
                '#id',
                '.jp-selector'
            ]);
        });

        it('should return a regex of compressed with classes', () => {
            const regex = rcs.selectorLibrary.getAll({
                origValues: false,
                regex: true,
                isSelectors: true
            });

            expect(regex).to.match(/\.a|#b|\.c/g);
        });

        it('should return an array with selectors', () => {
            const array = rcs.selectorLibrary.getAll({
                origValues: true,
                isSelectors: true
            });

            expect(array).to.have.any.keys('.test', '#id', '.jp-selector');
            expect(array).to.not.have.any.keys('.a', '#b', '.c');
            expect(array['.test']).to.equal('a');
            expect(array['#id']).to.equal('b');
        });

        it('should return an array with compressed selectors', () => {
            const array = rcs.selectorLibrary.getAll({
                origValues: false,
                isSelectors: true
            });

            expect(array).to.have.any.keys('.a', '#b', '.c');
            expect(array).to.not.have.any.keys('.test', '#id', '.jp-selector');
            expect(array['.a']).to.equal('test');
            expect(array['#b']).to.equal('id');
        });

        it('should return a regex of non compressed with classes', () => {
            const regex = rcs.selectorLibrary.getAll({
                origValues: true,
                regex: true,
                isSelectors: true
            });

            expect(regex).to.match(/\.test|#id|\.jp-selector/g);
        });

        it('should return a regex of non compressed selecotrs', () => {
            const regex = rcs.selectorLibrary.getAll({
                origValues: false,
                regex: true
            });

            expect(regex).to.match(/a|b|c/g);
        });

        it('should return a regex of compressed selectors', () => {
            const regex = rcs.selectorLibrary.getAll({
                origValues: true,
                regex: true
            });

            expect(regex).to.match(/test|id|jp-selector/g);
        });

        it('should get all extended', () => {
            const cssObject = rcs.selectorLibrary.getAll({
                extended: true
            });

            expect(cssObject['test']).to.be.an('object');
            expect(cssObject['test'].type).to.equal('class');
            expect(cssObject['test'].compressedSelector).to.equal('a');

            expect(cssObject['id']).to.be.an('object');
            expect(cssObject['id'].type).to.equal('id');
            expect(cssObject['id'].compressedSelector).to.equal('b');
        });

        it('should get all extended with selectors', () => {
            const cssObject = rcs.selectorLibrary.getAll({
                isSelectors: true,
                extended: true
            });

            expect(cssObject['.test']).to.be.an('object');
            expect(cssObject['.test'].type).to.equal('class');
            expect(cssObject['.test'].compressedSelector).to.equal('a');

            expect(cssObject['#id']).to.be.an('object');
            expect(cssObject['#id'].type).to.equal('id');
            expect(cssObject['#id'].compressedSelector).to.equal('b');
        });

        it('should get all normal with selectors', () => {
            const cssObject = rcs.selectorLibrary.getAll({
                origValues: false,
                isSelectors: true,
                extended: true
            });

            expect(cssObject['.a']).to.be.an('object');
            expect(cssObject['.a'].type).to.equal('class');
            expect(cssObject['.a'].modifiedSelector).to.equal('test');

            expect(cssObject['#b']).to.be.an('object');
            expect(cssObject['#b'].type).to.equal('id');
            expect(cssObject['#b'].modifiedSelector).to.equal('id');
        });

        it('should get all setted classes', () => {
            const array = rcs.selectorLibrary.getAll();

            expect(array).to.be.an('object');
            expect(array.test).to.equal('a');
            expect(array.id).to.equal('b');
            expect(array['jp-selector']).to.equal('c');
        });

        it('should get all setted compressed classes', () => {
            const array = rcs.selectorLibrary.getAll({
                origValues: false,
            });

            expect(array).to.be.an('object');
            expect(array.a).to.equal('test');
            expect(array.b).to.equal('id');
            expect(array.c).to.equal('jp-selector');
        });

        it('should get the right values with the option plainCompressed', () => {
            rcs.selectorLibrary.set([
                '.testme'
            ], {
                prefix: 'prefix-'
            });

            const plainArray = rcs.selectorLibrary.getAll({
                plainCompressed: true
            });

            const array = rcs.selectorLibrary.getAll();

            expect(plainArray).to.be.an('object');
            expect(array).to.be.an('object');
            expect(plainArray.test).to.equal('a');
            expect(plainArray.testme).to.equal('d');
            expect(array.test).to.equal('a');
            expect(array.testme).to.equal('prefix-d');
        });
    });

    describe('set', () => {
        it('should set nothing', () => {
            rcs.selectorLibrary.set();

            expect(rcs.selectorLibrary.selectors).to.be.empty;
        });

        it('should set a new value and get this value', () => {
            rcs.selectorLibrary.set('.test');

            expect(rcs.selectorLibrary.selectors['test'].compressedSelector).to.equal('a');
        });

        it('should set a new custom value', () => {
            rcs.selectorLibrary.set('.test', 'random-name');

            expect(rcs.selectorLibrary.selectors['test'].compressedSelector).to.equal('random-name');
        });

        it('should set a new custom value', () => {
            rcs.selectorLibrary.set('.test', 'random-name');
            rcs.selectorLibrary.set('.test2', 'random-name');
            rcs.selectorLibrary.set('.test3', 'random-name');

            expect(rcs.selectorLibrary.selectors['test'].compressedSelector).to.equal('random-name');
            expect(rcs.selectorLibrary.selectors['test2'].compressedSelector).to.equal('a');
            expect(rcs.selectorLibrary.selectors['test3'].compressedSelector).to.equal('b');
        });

        it('should set a new custom value with selector type', () => {
            rcs.selectorLibrary.set('.test', '.random-name');

            expect(rcs.selectorLibrary.selectors['test'].compressedSelector).to.equal('random-name');
        });

        it('should set values out of an array', () => {
            rcs.selectorLibrary.set([
                '.test',
                '#id',
                '.jp-selector'
            ]);

            // should be set
            expect(rcs.selectorLibrary.selectors['test'].compressedSelector).to.equal('a');
            expect(rcs.selectorLibrary.selectors['id'].compressedSelector).to.equal('b');
            expect(rcs.selectorLibrary.selectors['jp-selector'].compressedSelector).to.equal('c');

            // should not be set
            expect(rcs.selectorLibrary.selectors['not-set']).to.not.exist;
        });
    });

    describe('setExclude', () => {
        it('should avoid adding more of the same exludes | should enable array', () => {
            const excludes = [
                'one-value',
                'one-value',
                'another-value'
            ];

            rcs.selectorLibrary.setExclude(excludes);

            expect(rcs.selectorLibrary.excludes.length).to.equal(2);
        });

        it('should enable array', () => {
            const excludes = [
                'one-value',
                'another-value'
            ];

            rcs.selectorLibrary.setExclude(excludes);

            expect(rcs.selectorLibrary.excludes.length).to.equal(2);
        });

        it('should enable excludes', () => {
            rcs.selectorLibrary.setExclude('one-value');
            rcs.selectorLibrary.setExclude('second-value');

            expect(rcs.selectorLibrary.excludes.length).to.equal(2);
        });
    });

    describe('setValue', () => {
        it('should set an object value', () => {
            const setValueObject = rcs.selectorLibrary.setValue('.test');

            expect(setValueObject.type).to.equal('class');
            expect(setValueObject.selector).to.equal('.test');
            expect(setValueObject.compressedSelector).to.equal('a');
        });
    });

    describe('setValues', () => {
        it('should set multiple values', () => {
            rcs.selectorLibrary.setValues({
                '.test': 'a',
                '.class': '.b',
                '.selector': 'c'
            });

            expect(rcs.selectorLibrary.selectors['test'].compressedSelector).to.equal('a');
            expect(rcs.selectorLibrary.selectors['class'].compressedSelector).to.equal('b');
            expect(rcs.selectorLibrary.selectors['selector'].compressedSelector).to.equal('c');
        });
    });

    describe('setAttributeSelector', () => {
        it('should set attribute selectors correctly', () => {
            rcs.selectorLibrary.setAttributeSelector('[class*="test"]');
            rcs.selectorLibrary.setAttributeSelector([
                '[id^="header"]',
            ]);

            expect(rcs.selectorLibrary.attributeSelectors['.*test']).to.be.an('object');
            expect(rcs.selectorLibrary.attributeSelectors['.*test'].originalString).to.equal('[class*="test"]');
            expect(rcs.selectorLibrary.attributeSelectors['#^header']).to.be.an('object');
            expect(rcs.selectorLibrary.attributeSelectors['#^header'].originalString).to.equal('[id^="header"]');
        });
    });

    describe('isInAttributeSelector', () => {

    });
});
