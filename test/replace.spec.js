'use strict';

const rcs    = require('../lib/rcs');
const fs     = require('fs');
const expect = require('chai').expect;
const StringDecoder = require('string_decoder').StringDecoder;

const fixturesCwd = 'test/files/fixtures';
const resultsCwd  = 'test/files/results';

describe('rcs file replace', () => {
    beforeEach(() => {
        // reset counter and selectors for tests
        rcs.selectorLibrary.selectors           = {};
        rcs.selectorLibrary.compressedSelectors = {};
        rcs.selectorLibrary.excludes            = [];

        rcs.nameGenerator.resetCountForTests();
    });

    describe('replaceCss', () => {
        describe('buffer', () => {
            let decoder;

            beforeEach(() => {
                decoder = new StringDecoder('utf8');
            });

            it('should return the modified css buffer', () => {
                const data = rcs.replace.bufferCss(fs.readFileSync(fixturesCwd + '/style.css'));

                expect(decoder.write(data)).to.equal(fs.readFileSync(resultsCwd + '/style.css', 'utf8'));
            });

            it('should modify the second one with the values from the first', () => {
                const buffer1 = rcs.replace.bufferCss(fs.readFileSync(fixturesCwd + '/style.css'));
                const buffer2 = rcs.replace.bufferCss(fs.readFileSync(fixturesCwd + '/style2.css'));

                expect(decoder.write(buffer1)).to.equal(fs.readFileSync(resultsCwd + '/style.css', 'utf8'));
                expect(decoder.write(buffer2)).to.equal(fs.readFileSync(resultsCwd + '/style2.css', 'utf8'));
            });

            it('should fail - empty buffer', () => {
                const data = rcs.replace.bufferCss(new Buffer(''));

                expect(decoder.write(data)).to.equal('');
            });
        });

        describe('file', () => {
            it('should return the modified css file', done => {
                rcs.replace.fileCss(fixturesCwd + '/style.css', (err, data) => {
                    expect(data.data).to.equal(fs.readFileSync(resultsCwd + '/style.css', 'utf8'));

                    done();
                });
            });

            it('should prefix all selectors', done => {
                rcs.replace.fileCss(fixturesCwd + '/style.css', {
                    prefix: 'prefixed-'
                }, (err, data) => {
                    expect(data.data).to.equal(fs.readFileSync(resultsCwd + '/style-prefix.css', 'utf8'));

                    done();
                });
            });

            it('should prefix all selectors with no random name', done => {
                rcs.replace.fileCss(fixturesCwd + '/style.css', {
                    prefix: 'prefixed-',
                    preventRandomName: true
                }, (err, data) => {
                    expect(data.data).to.equal(fs.readFileSync(resultsCwd + '/style-prefix-preventrandomname.css', 'utf8'));

                    done();
                });
            });

            it('should modify the second one with the values from the first', done => {
                rcs.replace.fileCss(fixturesCwd + '/style.css', (err, data) => {
                    rcs.replace.fileCss(fixturesCwd + '/style2.css', (err, data) => {
                        expect(data.data).to.equal(fs.readFileSync(resultsCwd + '/style2.css', 'utf8'));

                        done();
                    });
                });
            });


            it('should fail', done => {
                rcs.replace.fileCss('non/exisiting/path.css', (err, data) => {
                    expect(err).to.be.an('object');
                    expect(err.error).to.equal('ENOENT');

                    done();
                });
            });
        });
    });

    describe('replace any file', () => {
        describe('buffer', () => {
            let decoder;

            beforeEach(() => {
                decoder = new StringDecoder('utf8');
            });

            it('should fail', () => {
                const data = rcs.replace.buffer(new Buffer(''));

                expect(decoder.write(data)).to.equal('');
            });

            it('should return the modified html buffer', () => {
                const buffer1 = rcs.replace.bufferCss(fs.readFileSync(fixturesCwd + '/style.css'));
                const buffer2 = rcs.replace.buffer(fs.readFileSync(fixturesCwd + '/index.html'));

                expect(decoder.write(buffer1)).to.equal(fs.readFileSync(resultsCwd + '/style.css', 'utf8'));
                expect(decoder.write(buffer2)).to.equal(fs.readFileSync(resultsCwd + '/index.html', 'utf8'));
            });

            it('should return the modified js buffer', () => {
                // `js` file imported as `txt` to avoid having mocha-phantomjs
                const buffer1 = rcs.replace.bufferCss(fs.readFileSync(fixturesCwd + '/style.css'));
                const buffer2 = rcs.replace.buffer(fs.readFileSync(fixturesCwd + '/main.txt'));

                expect(decoder.write(buffer1)).to.equal(fs.readFileSync(resultsCwd + '/style.css', 'utf8'));
                expect(decoder.write(buffer2)).to.equal(fs.readFileSync(resultsCwd + '/main.txt', 'utf8'));
            });
        });

        describe('file', () => {
            it('should fail', done => {
                rcs.replace.file('non/exisiting/path.css', (err, data) => {
                    expect(err).to.be.an('object');
                    expect(err.error).to.equal('ENOENT');

                    done();
                });
            });

            it('should return the modified html file', done => {
                rcs.replace.fileCss(fixturesCwd + '/style.css', (err, data) => {
                    rcs.replace.file(fixturesCwd + '/index.html', (err, data) => {
                        expect(data.data).to.equal(fs.readFileSync(resultsCwd + '/index.html', 'utf8'));

                        done();
                    });
                });
            });

            it('should return the modified js file', done => {
                // `js` file imported as `txt` to avoid having mocha-phantomjs
                rcs.replace.fileCss(fixturesCwd + '/style.css', (err, data) => {
                    rcs.replace.file(fixturesCwd + '/main.txt', (err, data) => {
                        expect(data.data).to.equal(fs.readFileSync(resultsCwd + '/main.txt', 'utf8'));

                        done();
                    });
                });
            });
        });
    });
});
