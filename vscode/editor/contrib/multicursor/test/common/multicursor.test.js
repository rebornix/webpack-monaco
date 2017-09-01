define(["require", "exports", "assert", "vs/editor/test/common/mocks/mockCodeEditor", "vs/editor/common/core/selection", "vs/editor/contrib/multicursor/common/multicursor", "vs/editor/common/editorCommon"], function (require, exports, assert, mockCodeEditor_1, selection_1, multicursor_1, editorCommon_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('Multicursor', function () {
        test('issue #2205: Multi-cursor pastes in reverse order', function () {
            mockCodeEditor_1.withMockCodeEditor([
                'abc',
                'def'
            ], {}, function (editor, cursor) {
                var addCursorUpAction = new multicursor_1.InsertCursorAbove();
                editor.setSelection(new selection_1.Selection(2, 1, 2, 1));
                addCursorUpAction.run(null, editor, {});
                assert.equal(cursor.getSelections().length, 2);
                editor.trigger('test', editorCommon_1.Handler.Paste, { text: '1\n2' });
                // cursorCommand(cursor, H.Paste, { text: '1\n2' });
                assert.equal(editor.getModel().getLineContent(1), '1abc');
                assert.equal(editor.getModel().getLineContent(2), '2def');
            });
        });
        test('issue #1336: Insert cursor below on last line adds a cursor to the end of the current line', function () {
            mockCodeEditor_1.withMockCodeEditor([
                'abc'
            ], {}, function (editor, cursor) {
                var addCursorDownAction = new multicursor_1.InsertCursorBelow();
                addCursorDownAction.run(null, editor, {});
                assert.equal(cursor.getSelections().length, 1);
            });
        });
    });
});
//# sourceMappingURL=multicursor.test.js.map