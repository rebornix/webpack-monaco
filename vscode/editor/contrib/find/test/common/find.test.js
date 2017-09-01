define(["require", "exports", "assert", "vs/editor/common/core/position", "vs/editor/common/core/range", "vs/editor/contrib/find/common/find", "vs/editor/test/common/mocks/mockCodeEditor"], function (require, exports, assert, position_1, range_1, find_1, mockCodeEditor_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('Find', function () {
        test('search string at position', function () {
            mockCodeEditor_1.withMockCodeEditor([
                'ABC DEF',
                '0123 456'
            ], {}, function (editor, cursor) {
                // The cursor is at the very top, of the file, at the first ABC
                var searchStringAtTop = find_1.getSelectionSearchString(editor);
                assert.equal(searchStringAtTop, 'ABC');
                // Move cursor to the end of ABC
                editor.setPosition(new position_1.Position(1, 3));
                var searchStringAfterABC = find_1.getSelectionSearchString(editor);
                assert.equal(searchStringAfterABC, 'ABC');
                // Move cursor to DEF
                editor.setPosition(new position_1.Position(1, 5));
                var searchStringInsideDEF = find_1.getSelectionSearchString(editor);
                assert.equal(searchStringInsideDEF, 'DEF');
            });
        });
        test('search string with selection', function () {
            mockCodeEditor_1.withMockCodeEditor([
                'ABC DEF',
                '0123 456'
            ], {}, function (editor, cursor) {
                // Select A of ABC
                editor.setSelection(new range_1.Range(1, 1, 1, 2));
                var searchStringSelectionA = find_1.getSelectionSearchString(editor);
                assert.equal(searchStringSelectionA, 'A');
                // Select BC of ABC
                editor.setSelection(new range_1.Range(1, 2, 1, 4));
                var searchStringSelectionBC = find_1.getSelectionSearchString(editor);
                assert.equal(searchStringSelectionBC, 'BC');
                // Select BC DE
                editor.setSelection(new range_1.Range(1, 2, 1, 7));
                var searchStringSelectionBCDE = find_1.getSelectionSearchString(editor);
                assert.equal(searchStringSelectionBCDE, 'BC DE');
            });
        });
        test('search string with multiline selection', function () {
            mockCodeEditor_1.withMockCodeEditor([
                'ABC DEF',
                '0123 456'
            ], {}, function (editor, cursor) {
                // Select first line and newline
                editor.setSelection(new range_1.Range(1, 1, 2, 1));
                var searchStringSelectionWholeLine = find_1.getSelectionSearchString(editor);
                assert.equal(searchStringSelectionWholeLine, null);
                // Select first line and chunk of second
                editor.setSelection(new range_1.Range(1, 1, 2, 4));
                var searchStringSelectionTwoLines = find_1.getSelectionSearchString(editor);
                assert.equal(searchStringSelectionTwoLines, null);
                // Select end of first line newline and and chunk of second
                editor.setSelection(new range_1.Range(1, 7, 2, 4));
                var searchStringSelectionSpanLines = find_1.getSelectionSearchString(editor);
                assert.equal(searchStringSelectionSpanLines, null);
            });
        });
    });
});
//# sourceMappingURL=find.test.js.map