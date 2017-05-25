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
        it.only('should get the values', () => {
            rcs.keyframesLibrary.keyframes = {
                move: 'a',
                animate: 'b',
                more: 'c',
            };

            expect(rcs.keyframesLibrary.get('move')).to.equal('a');
            expect(rcs.keyframesLibrary.get('animate')).to.equal('b');
            expect(rcs.keyframesLibrary.get('more')).to.equal('c');
            expect(rcs.keyframesLibrary.get('not-setted-value')).to.equal('not-setted-value');
        });

        it('should get the minified values', () => {
            rcs.keyframesLibrary.compressedKeyframes = {
                move: 'a',
                animate: 'b',
                more: 'c',
            };

            expect(rcs.keyframesLibrary.get('move', { origKeyframe: false })).to.equal('a');
            expect(rcs.keyframesLibrary.get('animate', { origKeyframe: false })).to.equal('b');
            expect(rcs.keyframesLibrary.get('more', { origKeyframe: false })).to.equal('c');
        });


        it('should not get excluded values but already set ones', () => {
            rcs.keyframesLibrary.excludes = ['move'];
            rcs.keyframesLibrary.keyframes = {
                move: 'a',
                animate: 'b',
                more: 'c',
            };

            expect(rcs.keyframesLibrary.get('move')).to.equal('move');
            expect(rcs.keyframesLibrary.get('animate')).to.equal('b');
            expect(rcs.keyframesLibrary.get('more')).to.equal('c');
        });
    });

    describe('set', () => {
        it('should do nothing', () => {
            rcs.keyframesLibrary.set();

            expect(rcs.keyframesLibrary.keyframes).to.be.empty;
        });

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

        it('should not set twice', () => {
            rcs.keyframesLibrary.set('move');
            rcs.keyframesLibrary.set('move');
            rcs.keyframesLibrary.set('animate');

            expect(Object.keys(rcs.keyframesLibrary.keyframes).length).to.equal(2);
            expect(rcs.keyframesLibrary.keyframes['move']).to.equal('a');
            expect(rcs.keyframesLibrary.keyframes['animate']).to.equal('b');
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

    describe('exclude', () => {
        it('should exclude variables', () => {
            rcs.keyframesLibrary.setExclude(['move', 'no']);

            expect(rcs.keyframesLibrary.excludes.length).to.equal(2);
        });

        it('should just exclude once', () => {
            rcs.keyframesLibrary.setExclude(['move', 'move']);

            expect(rcs.keyframesLibrary.excludes.length).to.equal(1);
            expect(rcs.keyframesLibrary.excludes[0]).to.equal('move');
        });

        it('should exclude nothing', () => {
            rcs.keyframesLibrary.setExclude();

            expect(rcs.keyframesLibrary.excludes.length).to.equal(0);
        });
    });
});
