/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "assert", "vs/base/node/encoding"], function (require, exports, assert, encoding) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('Encoding', function () {
        test('detectBOM UTF-8', function (done) {
            var file = require.toUrl('./fixtures/some_utf8.css');
            encoding.detectEncodingByBOM(file).then(function (encoding) {
                assert.equal(encoding, 'utf8');
                done();
            }, done);
        });
        test('detectBOM UTF-16 LE', function (done) {
            var file = require.toUrl('./fixtures/some_utf16le.css');
            encoding.detectEncodingByBOM(file).then(function (encoding) {
                assert.equal(encoding, 'utf16le');
                done();
            }, done);
        });
        test('detectBOM UTF-16 BE', function (done) {
            var file = require.toUrl('./fixtures/some_utf16be.css');
            encoding.detectEncodingByBOM(file).then(function (encoding) {
                assert.equal(encoding, 'utf16be');
                done();
            }, done);
        });
        test('detectBOM ANSI', function (done) {
            var file = require.toUrl('./fixtures/some_ansi.css');
            encoding.detectEncodingByBOM(file).then(function (encoding) {
                assert.equal(encoding, null);
                done();
            }, done);
        });
        test('detectBOM ANSI', function (done) {
            var file = require.toUrl('./fixtures/empty.txt');
            encoding.detectEncodingByBOM(file).then(function (encoding) {
                assert.equal(encoding, null);
                done();
            }, done);
        });
    });
});
//# sourceMappingURL=encoding.test.js.map