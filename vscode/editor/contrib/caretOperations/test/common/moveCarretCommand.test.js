define(["require", "exports", "vs/editor/common/core/selection", "vs/editor/contrib/caretOperations/common/moveCaretCommand", "vs/editor/test/common/commands/commandTestUtils"], function (require, exports, selection_1, moveCaretCommand_1, commandTestUtils_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function testMoveCaretLeftCommand(lines, selection, expectedLines, expectedSelection) {
        commandTestUtils_1.testCommand(lines, null, selection, function (sel) { return new moveCaretCommand_1.MoveCaretCommand(sel, true); }, expectedLines, expectedSelection);
    }
    function testMoveCaretRightCommand(lines, selection, expectedLines, expectedSelection) {
        commandTestUtils_1.testCommand(lines, null, selection, function (sel) { return new moveCaretCommand_1.MoveCaretCommand(sel, false); }, expectedLines, expectedSelection);
    }
    suite('Editor Contrib - Move Caret Command', function () {
        test('move selection to left', function () {
            testMoveCaretLeftCommand([
                '012345'
            ], new selection_1.Selection(1, 3, 1, 5), [
                '023145'
            ], new selection_1.Selection(1, 2, 1, 4));
        });
        test('move selection to right', function () {
            testMoveCaretRightCommand([
                '012345'
            ], new selection_1.Selection(1, 3, 1, 5), [
                '014235'
            ], new selection_1.Selection(1, 4, 1, 6));
        });
        test('move selection to left - from first column - no change', function () {
            testMoveCaretLeftCommand([
                '012345'
            ], new selection_1.Selection(1, 1, 1, 1), [
                '012345'
            ], new selection_1.Selection(1, 1, 1, 1));
        });
        test('move selection to right - from last column - no change', function () {
            testMoveCaretRightCommand([
                '012345'
            ], new selection_1.Selection(1, 5, 1, 7), [
                '012345'
            ], new selection_1.Selection(1, 5, 1, 7));
        });
    });
});
//# sourceMappingURL=moveCarretCommand.test.js.map