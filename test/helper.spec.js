'use strict';

const rcs    = require('../lib/rcs');
const fs     = require('fs-extra');
const path   = require('path');
const json   = require('json-extra');
const expect = require('chai').expect;

const testCwd = 'test/files/testCache';

describe('helper.js', () => {
    afterEach(() => {
        fs.removeSync(testCwd);
    });

    describe('save', () => {
        it('should create a file within a non existing dir', done => {
            const filePath = path.join(testCwd, '/a/non/existing/path/test.txt');

            rcs.helper.save(filePath, 'test content', (err, data) => {
                expect(err).to.not.exist;

                expect(fs.existsSync(filePath)).to.be.true;
                expect(fs.readFileSync(filePath, 'utf8')).to.equal('test content');

                done();
            });
        });

        it('should not overwrite the same file', done => {
            const filePath = path.join(testCwd, '/../config.json');
            const oldFile = fs.readFileSync(filePath, 'utf8');

            rcs.helper.save(filePath, 'test content', err => {
                expect(err.message).to.equal('File exist and cannot be overwritten. Set the option overwrite to true to overwrite files.');
                expect(fs.readFileSync(filePath, 'utf8')).to.equal(oldFile);

                done();
            });
        });
    });

    describe('saveSync', () => {
        it('should save SYNC', () => {
            const filePath = path.join(testCwd, '/config.txt');

            rcs.helper.saveSync(filePath, 'test content');

            expect(fs.readFileSync(filePath, 'utf8')).to.equal('test content');
        });

        it('should not overwrite the same file SYNC', () => {
            const filePath = path.join(testCwd, '/../config.json');
            const oldFile = fs.readFileSync(filePath, 'utf8');

            try {
                rcs.helper.saveSync(filePath, 'test content');

                // if no error is thrown before it should fail here
                expect(false).to.be.true;
            } catch (e) {
                expect(e.message).to.equal('File exist and cannot be overwritten. Set the option overwrite to true to overwrite files.');
            }

            expect(fs.readFileSync(filePath, 'utf8')).to.equal(oldFile);
        });
    });

    describe('objectToJson', () => {
        it('should generatea readable json string from a json object', done => {
            const object = { a: 1, b:2, c:3 };
            const jsonString = rcs.helper.objectToJson(object);

            expect(object).to.be.a('object');
            expect(jsonString).to.be.a('string');

            done();
        });
    });
});
