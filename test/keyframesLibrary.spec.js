'use strict';

const rcs    = require('../lib/rcs');
const expect = require('chai').expect;

describe('rcs keyframes library', () => {
    beforeEach(() => {
        // reset counter and keyframes for tests
        rcs.keyframesLibrary.excludes            = [];
        rcs.keyframesLibrary.keyframes           = {};
        rcs.keyframesLibrary.compressedKeyframes = {};

        rcs.nameGenerator.resetCountForTests();
    });

    describe('get', () => {
        it('should get the values', () => {
            rcs.keyframesLibrary.keyframes = {
                move: 'a',
                animate: 'b',
                more: 'c',
            };

            expect(rcs.keyframesLibrary.get('move')).to.equal('a');
            expect(rcs.keyframesLibrary.get('animate')).to.equal('b');
            expect(rcs.keyframesLibrary.get('more')).to.equal('c');
        });
    });

    describe('set', () => {
        it('should set the correct values', () => {
            rcs.keyframesLibrary.set('move');
            rcs.keyframesLibrary.set('animate');
            rcs.keyframesLibrary.set('more');

            expect(rcs.keyframesLibrary.keyframes['move']).to.equal('a');
            expect(rcs.keyframesLibrary.keyframes['animate']).to.equal('b');
            expect(rcs.keyframesLibrary.keyframes['more']).to.equal('c');
        });

        it('should set own keyframes', () => {
            rcs.keyframesLibrary.set('move', 'mo');
            rcs.keyframesLibrary.set('animate', 'an');
            rcs.keyframesLibrary.set('more', 'm');

            expect(rcs.keyframesLibrary.keyframes['move']).to.equal('mo');
            expect(rcs.keyframesLibrary.keyframes['animate']).to.equal('an');
            expect(rcs.keyframesLibrary.keyframes['more']).to.equal('m');
        });

        it('should not set excluded keyframe', () => {
            rcs.keyframesLibrary.setExclude('move');
            rcs.keyframesLibrary.set('move');
            rcs.keyframesLibrary.set('shouldexist');

            expect(rcs.keyframesLibrary.keyframes['move']).to.not.exist;
            expect(rcs.keyframesLibrary.keyframes['shouldexist']).to.equal('a');
        });

        it('should not set multiple keyframes', () => {
            rcs.keyframesLibrary.set([
                'move',
                'animate',
                'more',
            ]);

            expect(rcs.keyframesLibrary.keyframes['move']).to.equal('a');
            expect(rcs.keyframesLibrary.keyframes['animate']).to.equal('b');
            expect(rcs.keyframesLibrary.keyframes['more']).to.equal('c');
        });

        it('should not set multiple excluded of multiple setted keyframes', () => {
            rcs.keyframesLibrary.setExclude(['move', 'animate']);
            rcs.keyframesLibrary.set([
                'move',
                'animate',
                'more',
            ]);

            expect(rcs.keyframesLibrary.keyframes['move']).to.not.exist;
            expect(rcs.keyframesLibrary.keyframes['animate']).to.not.exist;
            expect(rcs.keyframesLibrary.keyframes['more']).to.equal('a');
        });

        it('should not set multiple excluded keyframes', () => {
            rcs.keyframesLibrary.setExclude(['move', 'no']);
            rcs.keyframesLibrary.set('move');
            rcs.keyframesLibrary.set('no');
            rcs.keyframesLibrary.set('shouldexist');

            expect(rcs.keyframesLibrary.keyframes['move']).to.not.exist;
            expect(rcs.keyframesLibrary.keyframes['no']).to.not.exist;
            expect(rcs.keyframesLibrary.keyframes['shouldexist']).to.equal('a');
        });
    });

    describe('getAll', () => {
        beforeEach(() => {
            rcs.keyframesLibrary.keyframes = {
                move: 'a',
                animate: 'b',
                more: 'c',
            };

            rcs.keyframesLibrary.compressedKeyframes = {
                a: 'move',
                b: 'animate',
                c: 'more',
            };
        });

        it('should return set keyframes', () => {
            const expectedObject = {
                move: 'a',
                animate: 'b',
                more: 'c',
            }

            expect(rcs.keyframesLibrary.getAll()).to.deep.equal(expectedObject);
        });

        it('should return set keyframes', () => {
            const expectedObject = {
                a: 'move',
                b: 'animate',
                c: 'more',
            }

            expect(rcs.keyframesLibrary.getAll({ origKeyframes: false })).to.deep.equal(expectedObject);
        });

        it('should return an regex with origKeyframes', () => {
            const expectedObject = /animate|move|more/g;

            expect(rcs.keyframesLibrary.getAll({ origKeyframes: true, regex: true })).to.deep.equal(expectedObject);
        });
    });
});
