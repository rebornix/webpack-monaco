define(["require", "exports", "assert", "vs/editor/common/model/model", "vs/editor/common/core/viewLineToken", "vs/editor/common/modes", "vs/editor/common/core/range", "vs/editor/common/core/position", "vs/editor/common/model/textModel", "vs/editor/common/model/textModelWithTokens", "vs/editor/common/modes/languageConfigurationRegistry", "vs/editor/common/modes/nullMode", "vs/editor/common/core/token", "vs/editor/common/model/textSource"], function (require, exports, assert, model_1, viewLineToken_1, modes_1, range_1, position_1, textModel_1, textModelWithTokens_1, languageConfigurationRegistry_1, nullMode_1, token_1, textSource_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('TextModelWithTokens', function () {
        function testBrackets(contents, brackets) {
            function toRelaxedFoundBracket(a) {
                if (!a) {
                    return null;
                }
                return {
                    range: a.range.toString(),
                    open: a.open,
                    close: a.close,
                    isOpen: a.isOpen
                };
            }
            var charIsBracket = {};
            var charIsOpenBracket = {};
            var openForChar = {};
            var closeForChar = {};
            brackets.forEach(function (b) {
                charIsBracket[b[0]] = true;
                charIsBracket[b[1]] = true;
                charIsOpenBracket[b[0]] = true;
                charIsOpenBracket[b[1]] = false;
                openForChar[b[0]] = b[0];
                closeForChar[b[0]] = b[1];
                openForChar[b[1]] = b[0];
                closeForChar[b[1]] = b[1];
            });
            var expectedBrackets = [];
            for (var lineIndex = 0; lineIndex < contents.length; lineIndex++) {
                var lineText = contents[lineIndex];
                for (var charIndex = 0; charIndex < lineText.length; charIndex++) {
                    var ch = lineText.charAt(charIndex);
                    if (charIsBracket[ch]) {
                        expectedBrackets.push({
                            open: openForChar[ch],
                            close: closeForChar[ch],
                            isOpen: charIsOpenBracket[ch],
                            range: new range_1.Range(lineIndex + 1, charIndex + 1, lineIndex + 1, charIndex + 2)
                        });
                    }
                }
            }
            var languageIdentifier = new modes_1.LanguageIdentifier('testMode', 1 /* PlainText */);
            var registration = languageConfigurationRegistry_1.LanguageConfigurationRegistry.register(languageIdentifier, {
                brackets: brackets
            });
            var model = new textModelWithTokens_1.TextModelWithTokens(textSource_1.RawTextSource.fromString(contents.join('\n')), textModel_1.TextModel.DEFAULT_CREATION_OPTIONS, languageIdentifier);
            // findPrevBracket
            {
                var expectedBracketIndex = expectedBrackets.length - 1;
                var currentExpectedBracket = expectedBracketIndex >= 0 ? expectedBrackets[expectedBracketIndex] : null;
                for (var lineNumber = contents.length; lineNumber >= 1; lineNumber--) {
                    var lineText = contents[lineNumber - 1];
                    for (var column = lineText.length + 1; column >= 1; column--) {
                        if (currentExpectedBracket) {
                            if (lineNumber === currentExpectedBracket.range.startLineNumber && column < currentExpectedBracket.range.endColumn) {
                                expectedBracketIndex--;
                                currentExpectedBracket = expectedBracketIndex >= 0 ? expectedBrackets[expectedBracketIndex] : null;
                            }
                        }
                        var actual = model.findPrevBracket({
                            lineNumber: lineNumber,
                            column: column
                        });
                        assert.deepEqual(toRelaxedFoundBracket(actual), toRelaxedFoundBracket(currentExpectedBracket), 'findPrevBracket of ' + lineNumber + ', ' + column);
                    }
                }
            }
            // findNextBracket
            {
                var expectedBracketIndex = 0;
                var currentExpectedBracket = expectedBracketIndex < expectedBrackets.length ? expectedBrackets[expectedBracketIndex] : null;
                for (var lineNumber = 1; lineNumber <= contents.length; lineNumber++) {
                    var lineText = contents[lineNumber - 1];
                    for (var column = 1; column <= lineText.length + 1; column++) {
                        if (currentExpectedBracket) {
                            if (lineNumber === currentExpectedBracket.range.startLineNumber && column > currentExpectedBracket.range.startColumn) {
                                expectedBracketIndex++;
                                currentExpectedBracket = expectedBracketIndex < expectedBrackets.length ? expectedBrackets[expectedBracketIndex] : null;
                            }
                        }
                        var actual = model.findNextBracket({
                            lineNumber: lineNumber,
                            column: column
                        });
                        assert.deepEqual(toRelaxedFoundBracket(actual), toRelaxedFoundBracket(currentExpectedBracket), 'findNextBracket of ' + lineNumber + ', ' + column);
                    }
                }
            }
            model.dispose();
            registration.dispose();
        }
        test('brackets', function () {
            testBrackets([
                'if (a == 3) { return (7 * (a + 5)); }'
            ], [
                ['{', '}'],
                ['[', ']'],
                ['(', ')']
            ]);
        });
    });
    suite('TextModelWithTokens - bracket matching', function () {
        function isNotABracket(model, lineNumber, column) {
            var match = model.matchBracket(new position_1.Position(lineNumber, column));
            assert.equal(match, null, 'is not matching brackets at ' + lineNumber + ', ' + column);
        }
        function isBracket2(model, testPosition, expected) {
            var actual = model.matchBracket(testPosition);
            assert.deepEqual(actual, expected, 'matches brackets at ' + testPosition);
        }
        var languageIdentifier = new modes_1.LanguageIdentifier('bracketMode1', 1 /* PlainText */);
        var registration = null;
        setup(function () {
            registration = languageConfigurationRegistry_1.LanguageConfigurationRegistry.register(languageIdentifier, {
                brackets: [
                    ['{', '}'],
                    ['[', ']'],
                    ['(', ')'],
                ]
            });
        });
        teardown(function () {
            registration.dispose();
            registration = null;
        });
        test('bracket matching 1', function () {
            var text = ')]}{[(' + '\n' +
                ')]}{[(';
            var model = model_1.Model.createFromString(text, undefined, languageIdentifier);
            isNotABracket(model, 1, 1);
            isNotABracket(model, 1, 2);
            isNotABracket(model, 1, 3);
            isBracket2(model, new position_1.Position(1, 4), [new range_1.Range(1, 4, 1, 5), new range_1.Range(2, 3, 2, 4)]);
            isBracket2(model, new position_1.Position(1, 5), [new range_1.Range(1, 5, 1, 6), new range_1.Range(2, 2, 2, 3)]);
            isBracket2(model, new position_1.Position(1, 6), [new range_1.Range(1, 6, 1, 7), new range_1.Range(2, 1, 2, 2)]);
            isBracket2(model, new position_1.Position(1, 7), [new range_1.Range(1, 6, 1, 7), new range_1.Range(2, 1, 2, 2)]);
            isBracket2(model, new position_1.Position(2, 1), [new range_1.Range(2, 1, 2, 2), new range_1.Range(1, 6, 1, 7)]);
            isBracket2(model, new position_1.Position(2, 2), [new range_1.Range(2, 2, 2, 3), new range_1.Range(1, 5, 1, 6)]);
            isBracket2(model, new position_1.Position(2, 3), [new range_1.Range(2, 3, 2, 4), new range_1.Range(1, 4, 1, 5)]);
            isBracket2(model, new position_1.Position(2, 4), [new range_1.Range(2, 3, 2, 4), new range_1.Range(1, 4, 1, 5)]);
            isNotABracket(model, 2, 5);
            isNotABracket(model, 2, 6);
            isNotABracket(model, 2, 7);
            model.dispose();
        });
        test('bracket matching 2', function () {
            var text = 'var bar = {' + '\n' +
                'foo: {' + '\n' +
                '}, bar: {hallo: [{' + '\n' +
                '}, {' + '\n' +
                '}]}}';
            var model = model_1.Model.createFromString(text, undefined, languageIdentifier);
            var brackets = [
                [new position_1.Position(1, 11), new range_1.Range(1, 11, 1, 12), new range_1.Range(5, 4, 5, 5)],
                [new position_1.Position(1, 12), new range_1.Range(1, 11, 1, 12), new range_1.Range(5, 4, 5, 5)],
                [new position_1.Position(2, 6), new range_1.Range(2, 6, 2, 7), new range_1.Range(3, 1, 3, 2)],
                [new position_1.Position(2, 7), new range_1.Range(2, 6, 2, 7), new range_1.Range(3, 1, 3, 2)],
                [new position_1.Position(3, 1), new range_1.Range(3, 1, 3, 2), new range_1.Range(2, 6, 2, 7)],
                [new position_1.Position(3, 2), new range_1.Range(3, 1, 3, 2), new range_1.Range(2, 6, 2, 7)],
                [new position_1.Position(3, 9), new range_1.Range(3, 9, 3, 10), new range_1.Range(5, 3, 5, 4)],
                [new position_1.Position(3, 10), new range_1.Range(3, 9, 3, 10), new range_1.Range(5, 3, 5, 4)],
                [new position_1.Position(3, 17), new range_1.Range(3, 17, 3, 18), new range_1.Range(5, 2, 5, 3)],
                [new position_1.Position(3, 18), new range_1.Range(3, 18, 3, 19), new range_1.Range(4, 1, 4, 2)],
                [new position_1.Position(3, 19), new range_1.Range(3, 18, 3, 19), new range_1.Range(4, 1, 4, 2)],
                [new position_1.Position(4, 1), new range_1.Range(4, 1, 4, 2), new range_1.Range(3, 18, 3, 19)],
                [new position_1.Position(4, 2), new range_1.Range(4, 1, 4, 2), new range_1.Range(3, 18, 3, 19)],
                [new position_1.Position(4, 4), new range_1.Range(4, 4, 4, 5), new range_1.Range(5, 1, 5, 2)],
                [new position_1.Position(4, 5), new range_1.Range(4, 4, 4, 5), new range_1.Range(5, 1, 5, 2)],
                [new position_1.Position(5, 1), new range_1.Range(5, 1, 5, 2), new range_1.Range(4, 4, 4, 5)],
                [new position_1.Position(5, 2), new range_1.Range(5, 2, 5, 3), new range_1.Range(3, 17, 3, 18)],
                [new position_1.Position(5, 3), new range_1.Range(5, 3, 5, 4), new range_1.Range(3, 9, 3, 10)],
                [new position_1.Position(5, 4), new range_1.Range(5, 4, 5, 5), new range_1.Range(1, 11, 1, 12)],
                [new position_1.Position(5, 5), new range_1.Range(5, 4, 5, 5), new range_1.Range(1, 11, 1, 12)],
            ];
            var isABracket = { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} };
            for (var i = 0, len = brackets.length; i < len; i++) {
                var _a = brackets[i], testPos = _a[0], b1 = _a[1], b2 = _a[2];
                isBracket2(model, testPos, [b1, b2]);
                isABracket[testPos.lineNumber][testPos.column] = true;
            }
            for (var i = 1, len = model.getLineCount(); i <= len; i++) {
                var line = model.getLineContent(i);
                for (var j = 1, lenJ = line.length + 1; j <= lenJ; j++) {
                    if (!isABracket[i].hasOwnProperty(j)) {
                        isNotABracket(model, i, j);
                    }
                }
            }
            model.dispose();
        });
    });
    suite('TextModelWithTokens regression tests', function () {
        test('Microsoft/monaco-editor#122: Unhandled Exception: TypeError: Unable to get property \'replace\' of undefined or null reference', function () {
            function assertViewLineTokens(model, lineNumber, forceTokenization, expected) {
                if (forceTokenization) {
                    model.forceTokenization(lineNumber);
                }
                var actual = model.getLineTokens(lineNumber).inflate();
                var decode = function (token) {
                    return {
                        endIndex: token.endIndex,
                        foreground: token.getForeground()
                    };
                };
                assert.deepEqual(actual.map(decode), expected.map(decode));
            }
            var _tokenId = 10;
            var LANG_ID1 = 'indicisiveMode1';
            var LANG_ID2 = 'indicisiveMode2';
            var languageIdentifier1 = new modes_1.LanguageIdentifier(LANG_ID1, 3);
            var languageIdentifier2 = new modes_1.LanguageIdentifier(LANG_ID2, 4);
            var tokenizationSupport = {
                getInitialState: function () { return nullMode_1.NULL_STATE; },
                tokenize: undefined,
                tokenize2: function (line, state) {
                    var myId = ++_tokenId;
                    var tokens = new Uint32Array(2);
                    tokens[0] = 0;
                    tokens[1] = (myId << 14 /* FOREGROUND_OFFSET */) >>> 0;
                    return new token_1.TokenizationResult2(tokens, state);
                }
            };
            var registration1 = modes_1.TokenizationRegistry.register(LANG_ID1, tokenizationSupport);
            var registration2 = modes_1.TokenizationRegistry.register(LANG_ID2, tokenizationSupport);
            var model = model_1.Model.createFromString('A model with\ntwo lines');
            assertViewLineTokens(model, 1, true, [createViewLineToken(12, 1)]);
            assertViewLineTokens(model, 2, true, [createViewLineToken(9, 1)]);
            model.setMode(languageIdentifier1);
            assertViewLineTokens(model, 1, true, [createViewLineToken(12, 11)]);
            assertViewLineTokens(model, 2, true, [createViewLineToken(9, 12)]);
            model.setMode(languageIdentifier2);
            assertViewLineTokens(model, 1, false, [createViewLineToken(12, 1)]);
            assertViewLineTokens(model, 2, false, [createViewLineToken(9, 1)]);
            model.dispose();
            registration1.dispose();
            registration2.dispose();
            function createViewLineToken(endIndex, foreground) {
                var metadata = ((foreground << 14 /* FOREGROUND_OFFSET */)) >>> 0;
                return new viewLineToken_1.ViewLineToken(endIndex, metadata);
            }
        });
        test('Microsoft/monaco-editor#133: Error: Cannot read property \'modeId\' of undefined', function () {
            var languageIdentifier = new modes_1.LanguageIdentifier('testMode', 1 /* PlainText */);
            var registration = languageConfigurationRegistry_1.LanguageConfigurationRegistry.register(languageIdentifier, {
                brackets: [
                    ['module', 'end module'],
                    ['sub', 'end sub']
                ]
            });
            var model = model_1.Model.createFromString([
                'Imports System',
                'Imports System.Collections.Generic',
                '',
                'Module m1',
                '',
                '\tSub Main()',
                '\tEnd Sub',
                '',
                'End Module',
            ].join('\n'), undefined, languageIdentifier);
            var actual = model.matchBracket(new position_1.Position(4, 1));
            assert.deepEqual(actual, [new range_1.Range(4, 1, 4, 7), new range_1.Range(9, 1, 9, 11)]);
            model.dispose();
            registration.dispose();
        });
    });
});
//# sourceMappingURL=textModelWithTokens.test.js.map