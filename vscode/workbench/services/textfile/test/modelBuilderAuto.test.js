define(["require", "exports", "./modelBuilder.test"], function (require, exports, modelBuilder_test_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var GENERATE_TESTS = false;
    suite('ModelBuilder Auto Tests', function () {
        test('auto1', function () {
            modelBuilder_test_1.testModelBuilder(['sarjniow', '\r', '\nbpb', 'ofb', '\njzldgxx', '\r\nkzwfjysng']);
        });
        test('auto2', function () {
            modelBuilder_test_1.testModelBuilder(['i', 'yyernubi\r\niimgn\n', 'ut\r']);
        });
        test('auto3', function () {
            modelBuilder_test_1.testDifferentHash([''], ['', '', '']);
        });
    });
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function getRandomEOLSequence() {
        var rnd = getRandomInt(1, 3);
        if (rnd === 1) {
            return '\n';
        }
        if (rnd === 2) {
            return '\r';
        }
        return '\r\n';
    }
    function getRandomString(minLength, maxLength) {
        var length = getRandomInt(minLength, maxLength);
        var r = '';
        for (var i = 0; i < length; i++) {
            r += String.fromCharCode(getRandomInt(97 /* a */, 122 /* z */));
        }
        return r;
    }
    function generateRandomFile() {
        var lineCount = getRandomInt(1, 10);
        var mixedEOLSequence = getRandomInt(1, 2) === 1 ? true : false;
        var fixedEOL = getRandomEOLSequence();
        var lines = [];
        for (var i = 0; i < lineCount; i++) {
            if (i !== 0) {
                if (mixedEOLSequence) {
                    lines.push(getRandomEOLSequence());
                }
                else {
                    lines.push(fixedEOL);
                }
            }
            lines.push(getRandomString(0, 10));
        }
        return lines.join('');
    }
    function generateRandomChunks(file) {
        var result = [];
        var cnt = getRandomInt(1, 20);
        var maxOffset = file.length;
        while (cnt > 0 && maxOffset > 0) {
            var offset = getRandomInt(0, maxOffset);
            result.unshift(file.substring(offset, maxOffset));
            // let length = getRandomInt(0, maxOffset - offset);
            // let text = generateFile(true);
            // result.push({
            // 	offset: offset,
            // 	length: length,
            // 	text: text
            // });
            maxOffset = offset;
            cnt--;
        }
        if (maxOffset !== 0) {
            result.unshift(file.substring(0, maxOffset));
        }
        return result;
    }
    var HASH_TO_CONTENT = {};
    function testRandomFile(file) {
        var tests = getRandomInt(5, 10);
        for (var i = 0; i < tests; i++) {
            var chunks = generateRandomChunks(file);
            try {
                var hash = modelBuilder_test_1.testModelBuilder(chunks);
                var logicalContent = JSON.stringify(file.split(/\r\n|\r|\n/));
                if (HASH_TO_CONTENT.hasOwnProperty(hash)) {
                    var prevLogicalContent = HASH_TO_CONTENT[hash];
                    if (prevLogicalContent !== logicalContent) {
                        console.log('HASH COLLISION: ');
                        console.log(prevLogicalContent);
                        console.log(logicalContent);
                        return false;
                    }
                }
                else {
                    HASH_TO_CONTENT[hash] = logicalContent;
                }
            }
            catch (err) {
                console.log(err);
                console.log(JSON.stringify(chunks));
                return false;
            }
        }
        return true;
    }
    if (GENERATE_TESTS) {
        var number = 1;
        while (true) {
            console.log('------BEGIN NEW TEST: ' + number);
            if (!testRandomFile(generateRandomFile())) {
                break;
            }
            console.log('------END NEW TEST: ' + (number++));
        }
    }
});
//# sourceMappingURL=modelBuilderAuto.test.js.map