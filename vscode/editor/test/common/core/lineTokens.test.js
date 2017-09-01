/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "assert", "vs/editor/common/core/lineTokens"], function (require, exports, assert, lineTokens_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('LineTokens', function () {
        function createLineTokens(text, tokens) {
            var binTokens = new Uint32Array(tokens.length << 1);
            for (var i = 0, len = tokens.length; i < len; i++) {
                var token = tokens[i];
                binTokens[(i << 1)] = token.startIndex;
                binTokens[(i << 1) + 1] = (token.foreground << 14 /* FOREGROUND_OFFSET */) >>> 0;
            }
            return new lineTokens_1.LineTokens(binTokens, text);
        }
        function createTestLineTokens() {
            return createLineTokens('Hello world, this is a lovely day', [
                { startIndex: 0, foreground: 1 },
                { startIndex: 6, foreground: 2 },
                { startIndex: 13, foreground: 3 },
                { startIndex: 18, foreground: 4 },
                { startIndex: 21, foreground: 5 },
                { startIndex: 23, foreground: 6 },
                { startIndex: 30, foreground: 7 },
            ]);
        }
        test('basics', function () {
            var lineTokens = createTestLineTokens();
            assert.equal(lineTokens.getLineContent(), 'Hello world, this is a lovely day');
            assert.equal(lineTokens.getLineLength(), 33);
            assert.equal(lineTokens.getTokenCount(), 7);
            assert.equal(lineTokens.getTokenStartOffset(0), 0);
            assert.equal(lineTokens.getTokenEndOffset(0), 6);
            assert.equal(lineTokens.getTokenStartOffset(1), 6);
            assert.equal(lineTokens.getTokenEndOffset(1), 13);
            assert.equal(lineTokens.getTokenStartOffset(2), 13);
            assert.equal(lineTokens.getTokenEndOffset(2), 18);
            assert.equal(lineTokens.getTokenStartOffset(3), 18);
            assert.equal(lineTokens.getTokenEndOffset(3), 21);
            assert.equal(lineTokens.getTokenStartOffset(4), 21);
            assert.equal(lineTokens.getTokenEndOffset(4), 23);
            assert.equal(lineTokens.getTokenStartOffset(5), 23);
            assert.equal(lineTokens.getTokenEndOffset(5), 30);
            assert.equal(lineTokens.getTokenStartOffset(6), 30);
            assert.equal(lineTokens.getTokenEndOffset(6), 33);
        });
        test('findToken', function () {
            var lineTokens = createTestLineTokens();
            assert.equal(lineTokens.findTokenIndexAtOffset(0), 0);
            assert.equal(lineTokens.findTokenIndexAtOffset(1), 0);
            assert.equal(lineTokens.findTokenIndexAtOffset(2), 0);
            assert.equal(lineTokens.findTokenIndexAtOffset(3), 0);
            assert.equal(lineTokens.findTokenIndexAtOffset(4), 0);
            assert.equal(lineTokens.findTokenIndexAtOffset(5), 0);
            assert.equal(lineTokens.findTokenIndexAtOffset(6), 1);
            assert.equal(lineTokens.findTokenIndexAtOffset(7), 1);
            assert.equal(lineTokens.findTokenIndexAtOffset(8), 1);
            assert.equal(lineTokens.findTokenIndexAtOffset(9), 1);
            assert.equal(lineTokens.findTokenIndexAtOffset(10), 1);
            assert.equal(lineTokens.findTokenIndexAtOffset(11), 1);
            assert.equal(lineTokens.findTokenIndexAtOffset(12), 1);
            assert.equal(lineTokens.findTokenIndexAtOffset(13), 2);
            assert.equal(lineTokens.findTokenIndexAtOffset(14), 2);
            assert.equal(lineTokens.findTokenIndexAtOffset(15), 2);
            assert.equal(lineTokens.findTokenIndexAtOffset(16), 2);
            assert.equal(lineTokens.findTokenIndexAtOffset(17), 2);
            assert.equal(lineTokens.findTokenIndexAtOffset(18), 3);
            assert.equal(lineTokens.findTokenIndexAtOffset(19), 3);
            assert.equal(lineTokens.findTokenIndexAtOffset(20), 3);
            assert.equal(lineTokens.findTokenIndexAtOffset(21), 4);
            assert.equal(lineTokens.findTokenIndexAtOffset(22), 4);
            assert.equal(lineTokens.findTokenIndexAtOffset(23), 5);
            assert.equal(lineTokens.findTokenIndexAtOffset(24), 5);
            assert.equal(lineTokens.findTokenIndexAtOffset(25), 5);
            assert.equal(lineTokens.findTokenIndexAtOffset(26), 5);
            assert.equal(lineTokens.findTokenIndexAtOffset(27), 5);
            assert.equal(lineTokens.findTokenIndexAtOffset(28), 5);
            assert.equal(lineTokens.findTokenIndexAtOffset(29), 5);
            assert.equal(lineTokens.findTokenIndexAtOffset(30), 6);
            assert.equal(lineTokens.findTokenIndexAtOffset(31), 6);
            assert.equal(lineTokens.findTokenIndexAtOffset(32), 6);
            assert.equal(lineTokens.findTokenIndexAtOffset(33), 6);
            assert.equal(lineTokens.findTokenIndexAtOffset(34), 6);
            assert.equal(lineTokens.findTokenAtOffset(7).startOffset, 6);
            assert.equal(lineTokens.findTokenAtOffset(7).endOffset, 13);
            assert.equal(lineTokens.findTokenAtOffset(7).foregroundId, 2);
            assert.equal(lineTokens.findTokenAtOffset(30).startOffset, 30);
            assert.equal(lineTokens.findTokenAtOffset(30).endOffset, 33);
            assert.equal(lineTokens.findTokenAtOffset(30).foregroundId, 7);
        });
        test('iterate forward', function () {
            var lineTokens = createTestLineTokens();
            var token = lineTokens.firstToken();
            assert.equal(token.startOffset, 0);
            assert.equal(token.endOffset, 6);
            assert.equal(token.foregroundId, 1);
            token = token.next();
            assert.equal(token.startOffset, 6);
            assert.equal(token.endOffset, 13);
            assert.equal(token.foregroundId, 2);
            token = token.next();
            assert.equal(token.startOffset, 13);
            assert.equal(token.endOffset, 18);
            assert.equal(token.foregroundId, 3);
            token = token.next();
            assert.equal(token.startOffset, 18);
            assert.equal(token.endOffset, 21);
            assert.equal(token.foregroundId, 4);
            token = token.next();
            assert.equal(token.startOffset, 21);
            assert.equal(token.endOffset, 23);
            assert.equal(token.foregroundId, 5);
            token = token.next();
            assert.equal(token.startOffset, 23);
            assert.equal(token.endOffset, 30);
            assert.equal(token.foregroundId, 6);
            token = token.next();
            assert.equal(token.startOffset, 30);
            assert.equal(token.endOffset, 33);
            assert.equal(token.foregroundId, 7);
            token = token.next();
            assert.equal(token, null);
        });
        test('iterate backward', function () {
            var lineTokens = createTestLineTokens();
            var token = lineTokens.lastToken();
            assert.equal(token.startOffset, 30);
            assert.equal(token.endOffset, 33);
            assert.equal(token.foregroundId, 7);
            token = token.prev();
            assert.equal(token.startOffset, 23);
            assert.equal(token.endOffset, 30);
            assert.equal(token.foregroundId, 6);
            token = token.prev();
            assert.equal(token.startOffset, 21);
            assert.equal(token.endOffset, 23);
            assert.equal(token.foregroundId, 5);
            token = token.prev();
            assert.equal(token.startOffset, 18);
            assert.equal(token.endOffset, 21);
            assert.equal(token.foregroundId, 4);
            token = token.prev();
            assert.equal(token.startOffset, 13);
            assert.equal(token.endOffset, 18);
            assert.equal(token.foregroundId, 3);
            token = token.prev();
            assert.equal(token.startOffset, 6);
            assert.equal(token.endOffset, 13);
            assert.equal(token.foregroundId, 2);
            token = token.prev();
            assert.equal(token.startOffset, 0);
            assert.equal(token.endOffset, 6);
            assert.equal(token.foregroundId, 1);
            token = token.prev();
            assert.equal(token, null);
        });
        function assertViewLineTokens(actual, expected) {
            assert.deepEqual(actual.map(function (token) {
                return {
                    endIndex: token.endIndex,
                    foreground: token.getForeground()
                };
            }), expected);
        }
        test('inflate', function () {
            var lineTokens = createTestLineTokens();
            assertViewLineTokens(lineTokens.inflate(), [
                { endIndex: 6, foreground: 1 },
                { endIndex: 13, foreground: 2 },
                { endIndex: 18, foreground: 3 },
                { endIndex: 21, foreground: 4 },
                { endIndex: 23, foreground: 5 },
                { endIndex: 30, foreground: 6 },
                { endIndex: 33, foreground: 7 },
            ]);
        });
        test('sliceAndInflate', function () {
            var lineTokens = createTestLineTokens();
            assertViewLineTokens(lineTokens.sliceAndInflate(0, 33, 0), [
                { endIndex: 6, foreground: 1 },
                { endIndex: 13, foreground: 2 },
                { endIndex: 18, foreground: 3 },
                { endIndex: 21, foreground: 4 },
                { endIndex: 23, foreground: 5 },
                { endIndex: 30, foreground: 6 },
                { endIndex: 33, foreground: 7 },
            ]);
            assertViewLineTokens(lineTokens.sliceAndInflate(0, 32, 0), [
                { endIndex: 6, foreground: 1 },
                { endIndex: 13, foreground: 2 },
                { endIndex: 18, foreground: 3 },
                { endIndex: 21, foreground: 4 },
                { endIndex: 23, foreground: 5 },
                { endIndex: 30, foreground: 6 },
                { endIndex: 32, foreground: 7 },
            ]);
            assertViewLineTokens(lineTokens.sliceAndInflate(0, 30, 0), [
                { endIndex: 6, foreground: 1 },
                { endIndex: 13, foreground: 2 },
                { endIndex: 18, foreground: 3 },
                { endIndex: 21, foreground: 4 },
                { endIndex: 23, foreground: 5 },
                { endIndex: 30, foreground: 6 }
            ]);
            assertViewLineTokens(lineTokens.sliceAndInflate(0, 30, 1), [
                { endIndex: 7, foreground: 1 },
                { endIndex: 14, foreground: 2 },
                { endIndex: 19, foreground: 3 },
                { endIndex: 22, foreground: 4 },
                { endIndex: 24, foreground: 5 },
                { endIndex: 31, foreground: 6 }
            ]);
            assertViewLineTokens(lineTokens.sliceAndInflate(6, 18, 0), [
                { endIndex: 7, foreground: 2 },
                { endIndex: 12, foreground: 3 }
            ]);
            assertViewLineTokens(lineTokens.sliceAndInflate(7, 18, 0), [
                { endIndex: 6, foreground: 2 },
                { endIndex: 11, foreground: 3 }
            ]);
            assertViewLineTokens(lineTokens.sliceAndInflate(6, 17, 0), [
                { endIndex: 7, foreground: 2 },
                { endIndex: 11, foreground: 3 }
            ]);
            assertViewLineTokens(lineTokens.sliceAndInflate(6, 19, 0), [
                { endIndex: 7, foreground: 2 },
                { endIndex: 12, foreground: 3 },
                { endIndex: 13, foreground: 4 },
            ]);
        });
    });
});
//# sourceMappingURL=lineTokens.test.js.map