define(["require", "exports", "assert", "vs/editor/common/core/editOperation", "vs/editor/common/core/position", "vs/editor/common/core/range", "vs/editor/common/core/selection", "vs/editor/common/model/modelLine", "vs/editor/test/common/mocks/mockCodeEditor"], function (require, exports, assert, editOperation_1, position_1, range_1, selection_1, modelLine_1, mockCodeEditor_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var NO_TAB_SIZE = 0;
    function testCommand(lines, selections, edits, expectedLines, expectedSelections) {
        mockCodeEditor_1.withMockCodeEditor(lines, {}, function (editor, cursor) {
            var model = editor.getModel();
            cursor.setSelections('tests', selections);
            model.applyEdits(edits);
            assert.deepEqual(model.getLinesContent(), expectedLines);
            var actualSelections = cursor.getSelections();
            assert.deepEqual(actualSelections.map(function (s) { return s.toString(); }), expectedSelections.map(function (s) { return s.toString(); }));
        });
    }
    function testLineEditMarker(text, column, stickToPreviousCharacter, edit, expectedColumn) {
        var line = new modelLine_1.ModelLine(text, NO_TAB_SIZE);
        line.addMarker(new modelLine_1.LineMarker('1', 0, new position_1.Position(0, column), stickToPreviousCharacter));
        line.applyEdits(new modelLine_1.MarkersTracker(), [edit], NO_TAB_SIZE);
        assert.equal(line.getMarkers()[0].position.column, expectedColumn);
    }
    suite('Editor Side Editing - collapsed selection', function () {
        test('replace at selection', function () {
            testCommand([
                'first',
                'second line',
                'third line',
                'fourth'
            ], [new selection_1.Selection(1, 1, 1, 1)], [
                editOperation_1.EditOperation.replace(new selection_1.Selection(1, 1, 1, 1), 'something ')
            ], [
                'something first',
                'second line',
                'third line',
                'fourth'
            ], [new selection_1.Selection(1, 1, 1, 11)]);
        });
        test('replace at selection 2', function () {
            testCommand([
                'first',
                'second line',
                'third line',
                'fourth'
            ], [new selection_1.Selection(1, 1, 1, 6)], [
                editOperation_1.EditOperation.replace(new selection_1.Selection(1, 1, 1, 6), 'something')
            ], [
                'something',
                'second line',
                'third line',
                'fourth'
            ], [new selection_1.Selection(1, 1, 1, 10)]);
        });
        test('ModelLine.applyEdits uses `isReplace`', function () {
            testLineEditMarker('something', 1, true, { startColumn: 1, endColumn: 1, text: 'asd', forceMoveMarkers: false }, 1);
            testLineEditMarker('something', 1, true, { startColumn: 1, endColumn: 1, text: 'asd', forceMoveMarkers: true }, 4);
            testLineEditMarker('something', 1, false, { startColumn: 1, endColumn: 1, text: 'asd', forceMoveMarkers: false }, 4);
            testLineEditMarker('something', 1, false, { startColumn: 1, endColumn: 1, text: 'asd', forceMoveMarkers: true }, 4);
        });
        test('insert at selection', function () {
            testCommand([
                'first',
                'second line',
                'third line',
                'fourth'
            ], [new selection_1.Selection(1, 1, 1, 1)], [
                editOperation_1.EditOperation.insert(new position_1.Position(1, 1), 'something ')
            ], [
                'something first',
                'second line',
                'third line',
                'fourth'
            ], [new selection_1.Selection(1, 11, 1, 11)]);
        });
        test('insert at selection sitting on max column', function () {
            testCommand([
                'first',
                'second line',
                'third line',
                'fourth'
            ], [new selection_1.Selection(1, 6, 1, 6)], [
                editOperation_1.EditOperation.insert(new position_1.Position(1, 6), ' something\nnew ')
            ], [
                'first something',
                'new ',
                'second line',
                'third line',
                'fourth'
            ], [new selection_1.Selection(2, 5, 2, 5)]);
        });
        test('issue #3994: replace on top of selection', function () {
            testCommand([
                '$obj = New-Object "system.col"'
            ], [new selection_1.Selection(1, 30, 1, 30)], [
                editOperation_1.EditOperation.replaceMove(new range_1.Range(1, 19, 1, 31), '"System.Collections"')
            ], [
                '$obj = New-Object "System.Collections"'
            ], [new selection_1.Selection(1, 39, 1, 39)]);
        });
        test('issue #15267: Suggestion that adds a line - cursor goes to the wrong line ', function () {
            testCommand([
                'package main',
                '',
                'import (',
                '	"fmt"',
                ')',
                '',
                'func main(',
                '	fmt.Println(strings.Con)',
                '}'
            ], [new selection_1.Selection(8, 25, 8, 25)], [
                editOperation_1.EditOperation.replaceMove(new range_1.Range(5, 1, 5, 1), '\t\"strings\"\n')
            ], [
                'package main',
                '',
                'import (',
                '	"fmt"',
                '	"strings"',
                ')',
                '',
                'func main(',
                '	fmt.Println(strings.Con)',
                '}'
            ], [new selection_1.Selection(9, 25, 9, 25)]);
        });
        test('issue #15236: Selections broke after deleting text using vscode.TextEditor.edit ', function () {
            testCommand([
                'foofoofoo, foofoofoo, bar'
            ], [new selection_1.Selection(1, 1, 1, 10), new selection_1.Selection(1, 12, 1, 21)], [
                editOperation_1.EditOperation.replace(new range_1.Range(1, 1, 1, 10), ''),
                editOperation_1.EditOperation.replace(new range_1.Range(1, 12, 1, 21), ''),
            ], [
                ', , bar'
            ], [new selection_1.Selection(1, 1, 1, 1), new selection_1.Selection(1, 3, 1, 3)]);
        });
    });
});
//# sourceMappingURL=sideEditing.test.js.map