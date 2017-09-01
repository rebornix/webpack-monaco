var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "assert", "vs/editor/browser/controller/textAreaState", "vs/editor/common/core/range", "vs/editor/common/core/position", "vs/editor/common/editorCommon", "vs/base/common/lifecycle", "vs/editor/common/model/model", "vs/editor/common/core/selection"], function (require, exports, assert, textAreaState_1, range_1, position_1, editorCommon_1, lifecycle_1, model_1, selection_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var MockTextAreaWrapper = (function (_super) {
        __extends(MockTextAreaWrapper, _super);
        function MockTextAreaWrapper() {
            var _this = _super.call(this) || this;
            _this._value = '';
            _this._selectionStart = 0;
            _this._selectionEnd = 0;
            return _this;
        }
        MockTextAreaWrapper.prototype.getValue = function () {
            return this._value;
        };
        MockTextAreaWrapper.prototype.setValue = function (reason, value) {
            this._value = value;
            this._selectionStart = this._value.length;
            this._selectionEnd = this._value.length;
        };
        MockTextAreaWrapper.prototype.getSelectionStart = function () {
            return this._selectionStart;
        };
        MockTextAreaWrapper.prototype.getSelectionEnd = function () {
            return this._selectionEnd;
        };
        MockTextAreaWrapper.prototype.setSelectionRange = function (reason, selectionStart, selectionEnd) {
            if (selectionStart < 0) {
                selectionStart = 0;
            }
            if (selectionStart > this._value.length) {
                selectionStart = this._value.length;
            }
            if (selectionEnd < 0) {
                selectionEnd = 0;
            }
            if (selectionEnd > this._value.length) {
                selectionEnd = this._value.length;
            }
            this._selectionStart = selectionStart;
            this._selectionEnd = selectionEnd;
        };
        return MockTextAreaWrapper;
    }(lifecycle_1.Disposable));
    exports.MockTextAreaWrapper = MockTextAreaWrapper;
    suite('TextAreaState', function () {
        function assertTextAreaState(actual, value, selectionStart, selectionEnd) {
            var desired = new textAreaState_1.TextAreaState(value, selectionStart, selectionEnd, null, null);
            assert.ok(desired.equals(actual), desired.toString() + ' == ' + actual.toString());
        }
        test('fromTextArea', function () {
            var textArea = new MockTextAreaWrapper();
            textArea._value = 'Hello world!';
            textArea._selectionStart = 1;
            textArea._selectionEnd = 12;
            var actual = textAreaState_1.TextAreaState.EMPTY.readFromTextArea(textArea);
            assertTextAreaState(actual, 'Hello world!', 1, 12);
            assert.equal(actual.value, 'Hello world!');
            assert.equal(actual.selectionStart, 1);
            actual = actual.collapseSelection();
            assertTextAreaState(actual, 'Hello world!', 12, 12);
            textArea.dispose();
        });
        test('applyToTextArea', function () {
            var textArea = new MockTextAreaWrapper();
            textArea._value = 'Hello world!';
            textArea._selectionStart = 1;
            textArea._selectionEnd = 12;
            var state = new textAreaState_1.TextAreaState('Hi world!', 2, 2, null, null);
            state.writeToTextArea('test', textArea, false);
            assert.equal(textArea._value, 'Hi world!');
            assert.equal(textArea._selectionStart, 9);
            assert.equal(textArea._selectionEnd, 9);
            state = new textAreaState_1.TextAreaState('Hi world!', 3, 3, null, null);
            state.writeToTextArea('test', textArea, false);
            assert.equal(textArea._value, 'Hi world!');
            assert.equal(textArea._selectionStart, 9);
            assert.equal(textArea._selectionEnd, 9);
            state = new textAreaState_1.TextAreaState('Hi world!', 0, 2, null, null);
            state.writeToTextArea('test', textArea, true);
            assert.equal(textArea._value, 'Hi world!');
            assert.equal(textArea._selectionStart, 0);
            assert.equal(textArea._selectionEnd, 2);
            textArea.dispose();
        });
        function testDeduceInput(prevState, value, selectionStart, selectionEnd, expected, expectedCharReplaceCnt) {
            prevState = prevState || textAreaState_1.TextAreaState.EMPTY;
            var textArea = new MockTextAreaWrapper();
            textArea._value = value;
            textArea._selectionStart = selectionStart;
            textArea._selectionEnd = selectionEnd;
            var newState = prevState.readFromTextArea(textArea);
            var actual = textAreaState_1.TextAreaState.deduceInput(prevState, newState, true);
            assert.equal(actual.text, expected);
            assert.equal(actual.replaceCharCnt, expectedCharReplaceCnt);
            textArea.dispose();
        }
        test('deduceInput - Japanese typing sennsei and accepting', function () {
            // manual test:
            // - choose keyboard layout: Japanese -> Hiragama
            // - type sennsei
            // - accept with Enter
            // - expected: せんせい
            // s
            // PREVIOUS STATE: [ <>, selectionStart: 0, selectionEnd: 0, selectionToken: 0]
            // CURRENT STATE: [ <ｓ>, selectionStart: 0, selectionEnd: 1, selectionToken: 0]
            testDeduceInput(textAreaState_1.TextAreaState.EMPTY, 'ｓ', 0, 1, 'ｓ', 0);
            // e
            // PREVIOUS STATE: [ <ｓ>, selectionStart: 0, selectionEnd: 1, selectionToken: 0]
            // CURRENT STATE: [ <せ>, selectionStart: 0, selectionEnd: 1, selectionToken: 0]
            testDeduceInput(new textAreaState_1.TextAreaState('ｓ', 0, 1, null, null), 'せ', 0, 1, 'せ', 1);
            // n
            // PREVIOUS STATE: [ <せ>, selectionStart: 0, selectionEnd: 1, selectionToken: 0]
            // CURRENT STATE: [ <せｎ>, selectionStart: 0, selectionEnd: 2, selectionToken: 0]
            testDeduceInput(new textAreaState_1.TextAreaState('せ', 0, 1, null, null), 'せｎ', 0, 2, 'せｎ', 1);
            // n
            // PREVIOUS STATE: [ <せｎ>, selectionStart: 0, selectionEnd: 2, selectionToken: 0]
            // CURRENT STATE: [ <せん>, selectionStart: 0, selectionEnd: 2, selectionToken: 0]
            testDeduceInput(new textAreaState_1.TextAreaState('せｎ', 0, 2, null, null), 'せん', 0, 2, 'せん', 2);
            // s
            // PREVIOUS STATE: [ <せん>, selectionStart: 0, selectionEnd: 2, selectionToken: 0]
            // CURRENT STATE: [ <せんｓ>, selectionStart: 0, selectionEnd: 3, selectionToken: 0]
            testDeduceInput(new textAreaState_1.TextAreaState('せん', 0, 2, null, null), 'せんｓ', 0, 3, 'せんｓ', 2);
            // e
            // PREVIOUS STATE: [ <せんｓ>, selectionStart: 0, selectionEnd: 3, selectionToken: 0]
            // CURRENT STATE: [ <せんせ>, selectionStart: 0, selectionEnd: 3, selectionToken: 0]
            testDeduceInput(new textAreaState_1.TextAreaState('せんｓ', 0, 3, null, null), 'せんせ', 0, 3, 'せんせ', 3);
            // no-op? [was recorded]
            // PREVIOUS STATE: [ <せんせ>, selectionStart: 0, selectionEnd: 3, selectionToken: 0]
            // CURRENT STATE: [ <せんせ>, selectionStart: 0, selectionEnd: 3, selectionToken: 0]
            testDeduceInput(new textAreaState_1.TextAreaState('せんせ', 0, 3, null, null), 'せんせ', 0, 3, 'せんせ', 3);
            // i
            // PREVIOUS STATE: [ <せんせ>, selectionStart: 0, selectionEnd: 3, selectionToken: 0]
            // CURRENT STATE: [ <せんせい>, selectionStart: 0, selectionEnd: 4, selectionToken: 0]
            testDeduceInput(new textAreaState_1.TextAreaState('せんせ', 0, 3, null, null), 'せんせい', 0, 4, 'せんせい', 3);
            // ENTER (accept)
            // PREVIOUS STATE: [ <せんせい>, selectionStart: 0, selectionEnd: 4, selectionToken: 0]
            // CURRENT STATE: [ <せんせい>, selectionStart: 4, selectionEnd: 4, selectionToken: 0]
            testDeduceInput(new textAreaState_1.TextAreaState('せんせい', 0, 4, null, null), 'せんせい', 4, 4, '', 0);
        });
        test('deduceInput - Japanese typing sennsei and choosing different suggestion', function () {
            // manual test:
            // - choose keyboard layout: Japanese -> Hiragama
            // - type sennsei
            // - arrow down (choose next suggestion)
            // - accept with Enter
            // - expected: せんせい
            // sennsei
            // PREVIOUS STATE: [ <せんせい>, selectionStart: 0, selectionEnd: 4, selectionToken: 0]
            // CURRENT STATE: [ <せんせい>, selectionStart: 0, selectionEnd: 4, selectionToken: 0]
            testDeduceInput(new textAreaState_1.TextAreaState('せんせい', 0, 4, null, null), 'せんせい', 0, 4, 'せんせい', 4);
            // arrow down
            // CURRENT STATE: [ <先生>, selectionStart: 0, selectionEnd: 2, selectionToken: 0]
            // PREVIOUS STATE: [ <せんせい>, selectionStart: 0, selectionEnd: 4, selectionToken: 0]
            testDeduceInput(new textAreaState_1.TextAreaState('せんせい', 0, 4, null, null), '先生', 0, 2, '先生', 4);
            // ENTER (accept)
            // PREVIOUS STATE: [ <先生>, selectionStart: 0, selectionEnd: 2, selectionToken: 0]
            // CURRENT STATE: [ <先生>, selectionStart: 2, selectionEnd: 2, selectionToken: 0]
            testDeduceInput(new textAreaState_1.TextAreaState('先生', 0, 2, null, null), '先生', 2, 2, '', 0);
        });
        test('extractNewText - no previous state with selection', function () {
            testDeduceInput(null, 'a', 0, 1, 'a', 0);
        });
        test('issue #2586: Replacing selected end-of-line with newline locks up the document', function () {
            testDeduceInput(new textAreaState_1.TextAreaState(']\n', 1, 2, null, null), ']\n', 2, 2, '\n', 0);
        });
        test('extractNewText - no previous state without selection', function () {
            testDeduceInput(null, 'a', 1, 1, 'a', 0);
        });
        test('extractNewText - typing does not cause a selection', function () {
            testDeduceInput(textAreaState_1.TextAreaState.EMPTY, 'a', 0, 1, 'a', 0);
        });
        test('extractNewText - had the textarea empty', function () {
            testDeduceInput(textAreaState_1.TextAreaState.EMPTY, 'a', 1, 1, 'a', 0);
        });
        test('extractNewText - had the entire line selected', function () {
            testDeduceInput(new textAreaState_1.TextAreaState('Hello world!', 0, 12, null, null), 'H', 1, 1, 'H', 0);
        });
        test('extractNewText - had previous text 1', function () {
            testDeduceInput(new textAreaState_1.TextAreaState('Hello world!', 12, 12, null, null), 'Hello world!a', 13, 13, 'a', 0);
        });
        test('extractNewText - had previous text 2', function () {
            testDeduceInput(new textAreaState_1.TextAreaState('Hello world!', 0, 0, null, null), 'aHello world!', 1, 1, 'a', 0);
        });
        test('extractNewText - had previous text 3', function () {
            testDeduceInput(new textAreaState_1.TextAreaState('Hello world!', 6, 11, null, null), 'Hello other!', 11, 11, 'other', 0);
        });
        test('extractNewText - IME', function () {
            testDeduceInput(textAreaState_1.TextAreaState.EMPTY, 'これは', 3, 3, 'これは', 0);
        });
        test('extractNewText - isInOverwriteMode', function () {
            testDeduceInput(new textAreaState_1.TextAreaState('Hello world!', 0, 0, null, null), 'Aello world!', 1, 1, 'A', 0);
        });
        test('extractMacReplacedText - does nothing if there is selection', function () {
            testDeduceInput(new textAreaState_1.TextAreaState('Hello world!', 5, 5, null, null), 'Hellö world!', 4, 5, 'ö', 0);
        });
        test('extractMacReplacedText - does nothing if there is more than one extra char', function () {
            testDeduceInput(new textAreaState_1.TextAreaState('Hello world!', 5, 5, null, null), 'Hellöö world!', 5, 5, 'öö', 1);
        });
        test('extractMacReplacedText - does nothing if there is more than one changed char', function () {
            testDeduceInput(new textAreaState_1.TextAreaState('Hello world!', 5, 5, null, null), 'Helöö world!', 5, 5, 'öö', 2);
        });
        test('extractMacReplacedText', function () {
            testDeduceInput(new textAreaState_1.TextAreaState('Hello world!', 5, 5, null, null), 'Hellö world!', 5, 5, 'ö', 1);
        });
        test('issue #25101 - First key press ignored', function () {
            testDeduceInput(new textAreaState_1.TextAreaState('a', 0, 1, null, null), 'a', 1, 1, 'a', 0);
        });
        test('issue #16520 - Cmd-d of single character followed by typing same character as has no effect', function () {
            testDeduceInput(new textAreaState_1.TextAreaState('x x', 0, 1, null, null), 'x x', 1, 1, 'x', 0);
        });
        test('issue #4271 (example 1) - When inserting an emoji on OSX, it is placed two spaces left of the cursor', function () {
            // The OSX emoji inserter inserts emojis at random positions in the text, unrelated to where the cursor is.
            testDeduceInput(new textAreaState_1.TextAreaState([
                'some1  text',
                'some2  text',
                'some3  text',
                'some4  text',
                'some5  text',
                'some6  text',
                'some7  text'
            ].join('\n'), 42, 42, null, null), [
                'so📅me1  text',
                'some2  text',
                'some3  text',
                'some4  text',
                'some5  text',
                'some6  text',
                'some7  text'
            ].join('\n'), 4, 4, '📅', 0);
        });
        test('issue #4271 (example 2) - When inserting an emoji on OSX, it is placed two spaces left of the cursor', function () {
            // The OSX emoji inserter inserts emojis at random positions in the text, unrelated to where the cursor is.
            testDeduceInput(new textAreaState_1.TextAreaState('some1  text', 6, 6, null, null), 'some💊1  text', 6, 6, '💊', 0);
        });
        test('issue #4271 (example 3) - When inserting an emoji on OSX, it is placed two spaces left of the cursor', function () {
            // The OSX emoji inserter inserts emojis at random positions in the text, unrelated to where the cursor is.
            testDeduceInput(new textAreaState_1.TextAreaState('qwertyu\nasdfghj\nzxcvbnm', 12, 12, null, null), 'qwertyu\nasdfghj\nzxcvbnm🎈', 25, 25, '🎈', 0);
        });
        // an example of an emoji missed by the regex but which has the FE0F variant 16 hint
        test('issue #4271 (example 4) - When inserting an emoji on OSX, it is placed two spaces left of the cursor', function () {
            // The OSX emoji inserter inserts emojis at random positions in the text, unrelated to where the cursor is.
            testDeduceInput(new textAreaState_1.TextAreaState('some1  text', 6, 6, null, null), 'some⌨️1  text', 6, 6, '⌨️', 0);
        });
        suite('PagedScreenReaderStrategy', function () {
            function testPagedScreenReaderStrategy(lines, selection, expected) {
                var model = model_1.Model.createFromString(lines.join('\n'));
                var actual = textAreaState_1.PagedScreenReaderStrategy.fromEditorSelection(textAreaState_1.TextAreaState.EMPTY, model, selection);
                assert.ok(actual.equals(expected));
                model.dispose();
            }
            test('simple', function () {
                testPagedScreenReaderStrategy([
                    'Hello world!'
                ], new selection_1.Selection(1, 13, 1, 13), new textAreaState_1.TextAreaState('Hello world!', 12, 12, new position_1.Position(1, 13), new position_1.Position(1, 13)));
                testPagedScreenReaderStrategy([
                    'Hello world!'
                ], new selection_1.Selection(1, 1, 1, 1), new textAreaState_1.TextAreaState('Hello world!', 0, 0, new position_1.Position(1, 1), new position_1.Position(1, 1)));
                testPagedScreenReaderStrategy([
                    'Hello world!'
                ], new selection_1.Selection(1, 1, 1, 6), new textAreaState_1.TextAreaState('Hello world!', 0, 5, new position_1.Position(1, 1), new position_1.Position(1, 6)));
            });
            test('multiline', function () {
                testPagedScreenReaderStrategy([
                    'Hello world!',
                    'How are you?'
                ], new selection_1.Selection(1, 1, 1, 1), new textAreaState_1.TextAreaState('Hello world!\nHow are you?', 0, 0, new position_1.Position(1, 1), new position_1.Position(1, 1)));
                testPagedScreenReaderStrategy([
                    'Hello world!',
                    'How are you?'
                ], new selection_1.Selection(2, 1, 2, 1), new textAreaState_1.TextAreaState('Hello world!\nHow are you?', 13, 13, new position_1.Position(2, 1), new position_1.Position(2, 1)));
            });
            test('page', function () {
                testPagedScreenReaderStrategy([
                    'L1\nL2\nL3\nL4\nL5\nL6\nL7\nL8\nL9\nL10\nL11\nL12\nL13\nL14\nL15\nL16\nL17\nL18\nL19\nL20\nL21'
                ], new selection_1.Selection(1, 1, 1, 1), new textAreaState_1.TextAreaState('L1\nL2\nL3\nL4\nL5\nL6\nL7\nL8\nL9\nL10\n', 0, 0, new position_1.Position(1, 1), new position_1.Position(1, 1)));
                testPagedScreenReaderStrategy([
                    'L1\nL2\nL3\nL4\nL5\nL6\nL7\nL8\nL9\nL10\nL11\nL12\nL13\nL14\nL15\nL16\nL17\nL18\nL19\nL20\nL21'
                ], new selection_1.Selection(11, 1, 11, 1), new textAreaState_1.TextAreaState('L11\nL12\nL13\nL14\nL15\nL16\nL17\nL18\nL19\nL20\n', 0, 0, new position_1.Position(11, 1), new position_1.Position(11, 1)));
                testPagedScreenReaderStrategy([
                    'L1\nL2\nL3\nL4\nL5\nL6\nL7\nL8\nL9\nL10\nL11\nL12\nL13\nL14\nL15\nL16\nL17\nL18\nL19\nL20\nL21'
                ], new selection_1.Selection(12, 1, 12, 1), new textAreaState_1.TextAreaState('L11\nL12\nL13\nL14\nL15\nL16\nL17\nL18\nL19\nL20\n', 4, 4, new position_1.Position(12, 1), new position_1.Position(12, 1)));
                testPagedScreenReaderStrategy([
                    'L1\nL2\nL3\nL4\nL5\nL6\nL7\nL8\nL9\nL10\nL11\nL12\nL13\nL14\nL15\nL16\nL17\nL18\nL19\nL20\nL21'
                ], new selection_1.Selection(21, 1, 21, 1), new textAreaState_1.TextAreaState('L21', 0, 0, new position_1.Position(21, 1), new position_1.Position(21, 1)));
            });
        });
    });
    var SimpleModel = (function () {
        function SimpleModel(lines, eol) {
            this._lines = lines;
            this._eol = eol;
        }
        SimpleModel.prototype.getLineMaxColumn = function (lineNumber) {
            return this._lines[lineNumber - 1].length + 1;
        };
        SimpleModel.prototype._getEndOfLine = function (eol) {
            switch (eol) {
                case editorCommon_1.EndOfLinePreference.LF:
                    return '\n';
                case editorCommon_1.EndOfLinePreference.CRLF:
                    return '\r\n';
                case editorCommon_1.EndOfLinePreference.TextDefined:
                    return this._eol;
            }
            throw new Error('Unknown EOL preference');
        };
        SimpleModel.prototype.getValueInRange = function (range, eol) {
            if (range_1.Range.isEmpty(range)) {
                return '';
            }
            if (range.startLineNumber === range.endLineNumber) {
                return this._lines[range.startLineNumber - 1].substring(range.startColumn - 1, range.endColumn - 1);
            }
            var lineEnding = this._getEndOfLine(eol), startLineIndex = range.startLineNumber - 1, endLineIndex = range.endLineNumber - 1, resultLines = [];
            resultLines.push(this._lines[startLineIndex].substring(range.startColumn - 1));
            for (var i = startLineIndex + 1; i < endLineIndex; i++) {
                resultLines.push(this._lines[i]);
            }
            resultLines.push(this._lines[endLineIndex].substring(0, range.endColumn - 1));
            return resultLines.join(lineEnding);
        };
        SimpleModel.prototype.getLineCount = function () {
            return this._lines.length;
        };
        return SimpleModel;
    }());
});
//# sourceMappingURL=textAreaState.test.js.map