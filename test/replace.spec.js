'use strict';

const rcs    = require('../lib/rcs');
const fs     = require('fs');
const expect = require('chai').expect;
const StringDecoder = require('string_decoder').StringDecoder;

const fixturesCwd = 'test/files/fixtures';
const resultsCwd  = 'test/files/results';

describe('replace', () => {
    beforeEach(() => {
        // reset counter and selectors for tests
        rcs.selectorLibrary.selectors           = {};
        rcs.selectorLibrary.attributeSelectors  = {};
        rcs.selectorLibrary.compressedSelectors = {};
        rcs.selectorLibrary.excludes            = [];

        rcs.keyframesLibrary.excludes            = [];
        rcs.keyframesLibrary.keyframes           = {};
        rcs.keyframesLibrary.compressedKeyframes = {};

        rcs.nameGenerator.resetCountForTests();
    });

    describe('replace.buffer*', () => {
        describe('replace.css', () => {
            it('should return the modified css buffer', () => {
                const code = rcs.replace.css(fs.readFileSync(fixturesCwd + '/css/style.css', 'utf8'));

                expect(code).to.equal(fs.readFileSync(resultsCwd + '/css/style.css', 'utf8'));
            });

            it('should return the modified and minified css buffer', () => {
                const code = rcs.replace.css('.class{background-color:red}.class-two{color:rgb(0,0,0)}.class-three{color:rgb(1,1,1)}');

                expect(code).to.equal('.a{background-color:red}.b{color:rgb(0,0,0)}.c{color:rgb(1,1,1)}');
            });

            it('should modify the second one with the values from the first', () => {
                const code = rcs.replace.css(fs.readFileSync(fixturesCwd + '/css/style.css', 'utf8'));
                const code2 = rcs.replace.css(fs.readFileSync(fixturesCwd + '/css/style2.css', 'utf8'));

                expect(code).to.equal(fs.readFileSync(resultsCwd + '/css/style.css', 'utf8'));
                expect(code2).to.equal(fs.readFileSync(resultsCwd + '/css/style2.css', 'utf8'));
            });

            it('should modify the code properly | hex oneline', () => {
                const code = rcs.replace.css('.somediv{background:#616060}.anotherdiv{display:flex}');

                expect(code).to.equal('.a{background:#616060}.b{display:flex}');
            });

            it('should modify the code properly | number oneline', () => {
                const code = rcs.replace.css('.somediv{translation:.30}.anotherdiv{display:flex}');

                expect(code).to.equal('.a{translation:.30}.b{display:flex}');
            });

            it('should modify the code properly | filter oneline', () => {
                const code = rcs.replace.css('.somediv{filter: progid:DXImageTransform.Microsoft.gradient(enabled = false)}.anotherdiv{display:flex}');

                expect(code).to.equal('.a{filter: progid:DXImageTransform.Microsoft.gradient(enabled = false)}.b{display:flex}');
            });

            it('should replace keyframes properly', () => {
                const string = `
                    @keyframes  move {
                        from {} to {}
                    }

                    .selector {
                        animation:move 4s;
                    }

                    .another-selector {
                        animation:     move     4s    ;
                    }
                `;

                const expectedString = `
                    @keyframes  a {
                        from {} to {}
                    }

                    .b {
                        animation:a 4s;
                    }

                    .c {
                        animation:     a     4s    ;
                    }
                `;
                const data = rcs.replace.css(string, { replaceKeyframes: true });

                expect(data).to.equal(expectedString);
            });

            it('should replace keyframes properly in nested animations', () => {
                const string = `
                    @keyframes  moVe-It_1337 {
                        from {} to {}
                    }

                    @-webkit-keyframes  motion {
                        from {} to {}
                    }

                    @keyframes  motion {
                        from {} to {}
                    }

                    .selector {
                        animation-name: moVe-It_1337, motion;
                        animation:  moVe-It_1337 4s infinite,
                                    moVe-It_1337 10s,
                                    motion 2s,
                                    not-setted-keyframe 2s;
                    }

                    .another-selector {
                        animation:     moVe-It_1337     4s  , motion 10s  ;
                    }
                `;

                const expectedString = `
                    @keyframes  a {
                        from {} to {}
                    }

                    @-webkit-keyframes  b {
                        from {} to {}
                    }

                    @keyframes  b {
                        from {} to {}
                    }

                    .c {
                        animation-name: a, b;
                        animation:  a 4s infinite,
                                    a 10s,
                                    b 2s,
                                    not-setted-keyframe 2s;
                    }

                    .d {
                        animation:     a     4s  , b 10s  ;
                    }
                `;
                const data = rcs.replace.css(string, { replaceKeyframes: true });

                expect(data).to.equal(expectedString);
            });

            it('should not replace keyframes properly', () => {
                const string = `
                    @keyframes  move {
                        from {} to {}
                    }

                    .selector {
                        animation: move 4s;
                    }

                    .another-selector {
                        animation:     move     4s    ;
                    }
                `;

                const expectedString = `
                    @keyframes  move {
                        from {} to {}
                    }

                    .a {
                        animation: move 4s;
                    }

                    .b {
                        animation:     move     4s    ;
                    }
                `;
                const data = rcs.replace.css(string);

                expect(data).to.equal(expectedString);
            });

            it('should replace keyframes properly in a oneliner', () => {
                const string = '@keyframes  move {from {} to {}}.selector {animation: move 4s, move 4s infinite, do-not-trigger: 10s infinite}.another-selector {animation:     move     4s    }';
                const expectedString = '@keyframes  a {from {} to {}}.b {animation: a 4s, a 4s infinite, do-not-trigger: 10s infinite}.c {animation:     a     4s    }';
                const data = rcs.replace.css(string, { replaceKeyframes: true });

                expect(data).to.equal(expectedString);
            });

            it('should replace media queries properly in a oneliner', () => {
                const string = '@media(max-width:480px){.one{display:block}.two{display:table}}';
                const expectedString = '@media(max-width:480px){.a{display:block}.b{display:table}}';
                const data = rcs.replace.css(string);

                expect(data).to.equal(expectedString);
            });

            it('should replace sizes at the end w/o semicolon properly in a oneliner', () => {
                const string = '.one{padding:0 .357143rem}.two{color:#0f705d}';
                const expectedString = '.a{padding:0 .357143rem}.b{color:#0f705d}';
                const data = rcs.replace.css(string, { replaceKeyframes: true });

                expect(data).to.equal(expectedString);
            });

            it('should fail - empty buffer', () => {
                const data = rcs.replace.css('');

                expect(data).to.equal('');
            });
        });

        describe('replace.js', () => {
            beforeEach(() => rcs.selectorLibrary.fillLibrary(fs.readFileSync(fixturesCwd + '/css/style.css', 'utf8')));

            it('should buffer some js', () => {
                const bufferedJs = rcs.replace.js(new Buffer(`
                    var test = ' something ';
                    const myClass = "jp-block";
                `))
                const expectedOutput = `
                    var test = ' something ';
                    const myClass = "a";
                `;

                expect(bufferedJs.toString()).to.equal(expectedOutput);
            });

            it('should convert js by code', () => {
                const replacedJs = rcs.replace.js(`
                    var test = ' something ';
                    const myClass = "jp-block";
                `)
                const expectedOutput = `
                    var test = ' something ';
                    const myClass = "a";
                `;

                expect(replacedJs).to.equal(expectedOutput);
            });

            it('should replace everything', () => {
                const bufferedJs = rcs.replace.js(fs.readFileSync(fixturesCwd + '/js/complex.txt'));
                const expectedOutput = fs.readFileSync(resultsCwd + '/js/complex.txt', 'utf8');

                expect(bufferedJs.toString()).to.equal(expectedOutput);
            });

            it('should replace react components', () => {
                const bufferedJs = rcs.replace.js(fs.readFileSync(fixturesCwd + '/js/react.txt'), { jsx: true });
                const expectedOutput = fs.readFileSync(resultsCwd + '/js/react.txt', 'utf8');

                expect(bufferedJs.toString()).to.equal(expectedOutput);
            });
        });

        describe('replace.buffer', () => {
            it('should fail', () => {
                const data = rcs.replace.buffer(new Buffer(''));

                expect(data.toString()).to.equal('');
            });

            it('should return the modified html buffer', () => {
                rcs.selectorLibrary.fillLibrary(fs.readFileSync(fixturesCwd + '/css/style.css', 'utf8'));

                const buffer2 = rcs.replace.buffer(fs.readFileSync(fixturesCwd + '/html/index.html'));

                expect(buffer2.toString()).to.equal(fs.readFileSync(resultsCwd + '/html/index.html', 'utf8'));
            });

            it('should return the modified js buffer', () => {
                rcs.selectorLibrary.fillLibrary(fs.readFileSync(fixturesCwd + '/css/style.css', 'utf8'));

                const buffer2 = rcs.replace.buffer(fs.readFileSync(fixturesCwd + '/js/main.txt'));

                expect(buffer2.toString()).to.equal(fs.readFileSync(resultsCwd + '/js/main.txt', 'utf8'));
            });
        });
    });

    describe('replace.string', () => {

    });
});
