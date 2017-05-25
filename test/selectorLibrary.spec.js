'use strict';

const rcs    = require('../lib/rcs');
const expect = require('chai').expect;

describe('rcs selector library', () => {
    beforeEach(() => {
        // reset counter and selectors for tests
        rcs.selectorLibrary.excludes            = [];
        rcs.selectorLibrary.selectors           = {};
        rcs.selectorLibrary.attributeSelectors  = {};
        rcs.selectorLibrary.compressedSelectors = {};

        rcs.nameGenerator.resetCountForTests();
    });

    describe('set new values', () => {
         it('should set nothing', done => {
            rcs.selectorLibrary.set();

            expect(rcs.selectorLibrary.selectors).to.be.empty;

            done();
        });

        it('should set a new value and get this value', done => {
            rcs.selectorLibrary.set('.test');

            expect(rcs.selectorLibrary.get('.test')).to.equal('a');
            expect(rcs.selectorLibrary.get('test')).to.equal('a');

            done();
        });

        it('should set a new custom value', done => {
            rcs.selectorLibrary.set('.test', 'random-name');

            expect(rcs.selectorLibrary.get('.test')).to.equal('random-name');
            expect(rcs.selectorLibrary.get('test')).to.equal('random-name');

            done();
        });

        it('should set a new custom value', done => {
            rcs.selectorLibrary.set('.test', 'random-name');
            rcs.selectorLibrary.set('.test2', 'random-name');
            rcs.selectorLibrary.set('.test3', 'random-name');

            expect(rcs.selectorLibrary.get('.test')).to.equal('random-name');
            expect(rcs.selectorLibrary.get('.test2')).to.equal('a');
            expect(rcs.selectorLibrary.get('.test3')).to.equal('b');

            done();
        });

        it('should set a new custom value with selector type', done => {
            rcs.selectorLibrary.set('.test', '.random-name');

            expect(rcs.selectorLibrary.get('.test')).to.equal('random-name');
            expect(rcs.selectorLibrary.get('test')).to.equal('random-name');

            done();
        });

        it('should set an object value', done => {
            const setValueObject = rcs.selectorLibrary.setValue('.test');

            expect(setValueObject.type).to.equal('class');
            expect(setValueObject.selector).to.equal('.test');
            expect(setValueObject.compressedSelector).to.equal('a');

            done();
        });

        it('should set multiple values', done => {
            rcs.selectorLibrary.setValues({
                '.test': 'a',
                '.class': '.b',
                '.selector': 'c'
            });

            expect(rcs.selectorLibrary.get('test')).to.equal('a');
            expect(rcs.selectorLibrary.get('.class')).to.equal('b');
            expect(rcs.selectorLibrary.get('.selector')).to.equal('c');

            done();
        });

        it('should set values out of an array', done => {
            rcs.selectorLibrary.set([
                '.test',
                '#id',
                '.jp-selector'
            ]);

            // should be set
            expect(rcs.selectorLibrary.get('.test')).to.equal('a');
            expect(rcs.selectorLibrary.get('test')).to.equal('a');
            expect(rcs.selectorLibrary.get('#id')).to.equal('b');
            expect(rcs.selectorLibrary.get('id')).to.equal('b');
            expect(rcs.selectorLibrary.get('.jp-selector')).to.equal('c');
            expect(rcs.selectorLibrary.get('jp-selector')).to.equal('c');

            // should not be set
            expect(rcs.selectorLibrary.get('.not-set')).to.equal('.not-set');
            expect(rcs.selectorLibrary.get('not-set')).to.equal('not-set');

            done();
        });

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

    describe('get values', () => {
        beforeEach(() => {
            rcs.selectorLibrary.set([
                '.test',
                '#id',
                '.jp-selector'
            ]);
        });

        it('should not get a unset value', done => {
            expect(rcs.selectorLibrary.get('.test1')).to.equal('.test1');
            expect(rcs.selectorLibrary.get('test1')).to.equal('test1');

            done();
        });

        it('should get all setted classes', done => {
            const array = rcs.selectorLibrary.getAll();

            expect(array).to.be.an('object');
            expect(array.test).to.equal('a');
            expect(array.id).to.equal('b');
            expect(array['jp-selector']).to.equal('c');

            done();
        });

        it('should get all setted compressed classes', done => {
            const array = rcs.selectorLibrary.getAll({
                origValues: false,
            });

            expect(array).to.be.an('object');
            expect(array.a).to.equal('test');
            expect(array.b).to.equal('id');
            expect(array.c).to.equal('jp-selector');

            done();
        });

        it('should get the right values with the option plainCompressed', done => {
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

            done();
        });

        it('should return a regex of compressed with classes', done => {
            const regex = rcs.selectorLibrary.getAll({
                origValues: false,
                regex: true,
                isSelectors: true
            });

            expect(regex).to.match(/\.a|#b|\.c/g);

            done();
        });

        it('should return an array with selectors', done => {
            const array = rcs.selectorLibrary.getAll({
                origValues: true,
                isSelectors: true
            });

            expect(array).to.have.any.keys('.test', '#id', '.jp-selector');
            expect(array).to.not.have.any.keys('.a', '#b', '.c');
            expect(array['.test']).to.equal('a');
            expect(array['#id']).to.equal('b');

            done();
        });

        it('should return an array with compressed selectors', done => {
            const array = rcs.selectorLibrary.getAll({
                origValues: false,
                isSelectors: true
            });

            expect(array).to.have.any.keys('.a', '#b', '.c');
            expect(array).to.not.have.any.keys('.test', '#id', '.jp-selector');
            expect(array['.a']).to.equal('test');
            expect(array['#b']).to.equal('id');

            done();
        });

        it('should return a regex of non compressed with classes', done => {
            const regex = rcs.selectorLibrary.getAll({
                origValues: true,
                regex: true,
                isSelectors: true
            });

            expect(regex).to.match(/\.test|#id|\.jp-selector/g);

            done();
        });

        it('should return a regex of non compressed selecotrs', done => {
            const regex = rcs.selectorLibrary.getAll({
                origValues: false,
                regex: true
            });

            expect(regex).to.match(/a|b|c/g);

            done();
        });

        it('should return a regex of compressed selectors', done => {
            const regex = rcs.selectorLibrary.getAll({
                origValues: true,
                regex: true
            });

            expect(regex).to.match(/test|id|jp-selector/g);

            done();
        });

        it('should get all extended', done => {
            const cssObject = rcs.selectorLibrary.getAll({
                extended: true
            });

            expect(cssObject['test']).to.be.an('object');
            expect(cssObject['test'].type).to.equal('class');
            expect(cssObject['test'].compressedSelector).to.equal('a');

            expect(cssObject['id']).to.be.an('object');
            expect(cssObject['id'].type).to.equal('id');
            expect(cssObject['id'].compressedSelector).to.equal('b');

            done();
        });

        it('should get all extended with selectors', done => {
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

            done();
        });

        it('should get all normal with selectors', done => {
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

            done();
        });
    });

    describe('setExclude', () => {
        beforeEach(() => {
            rcs.selectorLibrary.excludes = []
        });

        it('should avoid adding more of the same exludes | should enable array', done => {
            const excludes = [
                'one-value',
                'one-value',
                'another-value'
            ];

            rcs.selectorLibrary.setExclude(excludes);

            expect(rcs.selectorLibrary.excludes.length).to.equal(2);

            done();
        });

        it('should enable array', done => {
            const excludes = [
                'one-value',
                'another-value'
            ];

            rcs.selectorLibrary.setExclude(excludes);

            expect(rcs.selectorLibrary.excludes.length).to.equal(2);

            done();
        });

        it('should enable excludes', done => {
            rcs.selectorLibrary.setExclude('one-value');
            rcs.selectorLibrary.setExclude('second-value');

            expect(rcs.selectorLibrary.excludes.length).to.equal(2);

            done();
        });
    });
});
