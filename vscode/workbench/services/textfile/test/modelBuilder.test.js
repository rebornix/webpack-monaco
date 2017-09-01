define(["require", "exports", "assert", "vs/workbench/services/textfile/electron-browser/modelBuilder", "vs/editor/common/model/textModel", "vs/base/common/strings", "vs/editor/common/model/textSource"], function (require, exports, assert, modelBuilder_1, textModel_1, strings, textSource_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function testModelBuilder(chunks, opts) {
        if (opts === void 0) { opts = textModel_1.TextModel.DEFAULT_CREATION_OPTIONS; }
        var expectedTextSource = textSource_1.RawTextSource.fromString(chunks.join(''));
        var expectedHash = modelBuilder_1.computeHash(expectedTextSource);
        var builder = new modelBuilder_1.ModelBuilder(true);
        for (var i = 0, len = chunks.length; i < len; i++) {
            builder.acceptChunk(chunks[i]);
        }
        var actual = builder.finish();
        var actualTextSource = actual.value;
        var actualHash = actual.hash;
        assert.equal(actualHash, expectedHash);
        assert.deepEqual(actualTextSource, expectedTextSource);
        return expectedHash;
    }
    exports.testModelBuilder = testModelBuilder;
    function toTextSource(lines) {
        return {
            BOM: '',
            lines: lines,
            totalCRCount: 0,
            length: 0,
            containsRTL: false,
            isBasicASCII: true
        };
    }
    function testDifferentHash(lines1, lines2) {
        var hash1 = modelBuilder_1.computeHash(toTextSource(lines1));
        var hash2 = modelBuilder_1.computeHash(toTextSource(lines2));
        assert.notEqual(hash1, hash2);
    }
    exports.testDifferentHash = testDifferentHash;
    suite('ModelBuilder', function () {
        test('uses sha1', function () {
            // These are the sha1s of the string + \n
            assert.equal(modelBuilder_1.computeHash(toTextSource([''])), 'adc83b19e793491b1c6ea0fd8b46cd9f32e592fc');
            assert.equal(modelBuilder_1.computeHash(toTextSource(['hello world'])), '22596363b3de40b06f981fb85d82312e8c0ed511');
        });
        test('no chunks', function () {
            testModelBuilder([]);
        });
        test('single empty chunk', function () {
            testModelBuilder(['']);
        });
        test('single line in one chunk', function () {
            testModelBuilder(['Hello world']);
        });
        test('single line in multiple chunks', function () {
            testModelBuilder(['Hello', ' ', 'world']);
        });
        test('two lines in single chunk', function () {
            testModelBuilder(['Hello world\nHow are you?']);
        });
        test('two lines in multiple chunks 1', function () {
            testModelBuilder(['Hello worl', 'd\nHow are you?']);
        });
        test('two lines in multiple chunks 2', function () {
            testModelBuilder(['Hello worl', 'd', '\n', 'H', 'ow are you?']);
        });
        test('two lines in multiple chunks 3', function () {
            testModelBuilder(['Hello worl', 'd', '\nHow are you?']);
        });
        test('multiple lines in single chunks', function () {
            testModelBuilder(['Hello world\nHow are you?\nIs everything good today?\nDo you enjoy the weather?']);
        });
        test('multiple lines in multiple chunks 1', function () {
            testModelBuilder(['Hello world\nHow are you', '?\nIs everything good today?\nDo you enjoy the weather?']);
        });
        test('multiple lines in multiple chunks 1', function () {
            testModelBuilder(['Hello world', '\nHow are you', '?\nIs everything good today?', '\nDo you enjoy the weather?']);
        });
        test('multiple lines in multiple chunks 1', function () {
            testModelBuilder(['Hello world\n', 'How are you', '?\nIs everything good today?', '\nDo you enjoy the weather?']);
        });
        test('carriage return detection (1 \\r\\n 2 \\n)', function () {
            testModelBuilder(['Hello world\r\n', 'How are you', '?\nIs everything good today?', '\nDo you enjoy the weather?']);
        });
        test('carriage return detection (2 \\r\\n 1 \\n)', function () {
            testModelBuilder(['Hello world\r\n', 'How are you', '?\r\nIs everything good today?', '\nDo you enjoy the weather?']);
        });
        test('carriage return detection (3 \\r\\n 0 \\n)', function () {
            testModelBuilder(['Hello world\r\n', 'How are you', '?\r\nIs everything good today?', '\r\nDo you enjoy the weather?']);
        });
        test('carriage return detection (isolated \\r)', function () {
            testModelBuilder(['Hello world', '\r', '\n', 'How are you', '?', '\r', '\n', 'Is everything good today?', '\r', '\n', 'Do you enjoy the weather?']);
        });
        test('BOM handling', function () {
            testModelBuilder([strings.UTF8_BOM_CHARACTER + 'Hello world!']);
        });
        test('BOM handling', function () {
            testModelBuilder([strings.UTF8_BOM_CHARACTER, 'Hello world!']);
        });
        test('RTL handling 1', function () {
            testModelBuilder(['Hello world!', 'זוהי עובדה מבוססת שדעתו']);
        });
        test('RTL handling 2', function () {
            testModelBuilder(['Hello world!זוהי עובדה מבוססת שדעתו']);
        });
        test('RTL handling 3', function () {
            testModelBuilder(['Hello world!זוהי \nעובדה מבוססת שדעתו']);
        });
        test('ASCII handling 1', function () {
            testModelBuilder(['Hello world!!\nHow do you do?']);
        });
        test('ASCII handling 1', function () {
            testModelBuilder(['Hello world!!\nHow do you do?Züricha📚📚b']);
        });
        test('issue #32819: some special string cannot be displayed completely', function () {
            testModelBuilder(['ＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡＡ123']);
        });
    });
});
//# sourceMappingURL=modelBuilder.test.js.map