define(["require", "exports", "assert", "vs/editor/common/core/range", "vs/editor/common/editorCommon", "vs/editor/common/model/model", "vs/editor/test/common/mocks/mockCodeEditor"], function (require, exports, assert, range_1, editorCommon, model_1, mockCodeEditor_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function testCommand(lines, languageIdentifier, selection, commandFactory, expectedLines, expectedSelection) {
        var model = model_1.Model.createFromString(lines.join('\n'), undefined, languageIdentifier);
        mockCodeEditor_1.withMockCodeEditor(null, { model: model }, function (editor, cursor) {
            cursor.setSelections('tests', [selection]);
            cursor.trigger('tests', editorCommon.Handler.ExecuteCommand, commandFactory(cursor.getSelection()));
            assert.deepEqual(model.getLinesContent(), expectedLines);
            var actualSelection = cursor.getSelection();
            assert.deepEqual(actualSelection.toString(), expectedSelection.toString());
        });
        model.dispose();
    }
    exports.testCommand = testCommand;
    /**
     * Extract edit operations if command `command` were to execute on model `model`
     */
    function getEditOperation(model, command) {
        var operations = [];
        var editOperationBuilder = {
            addEditOperation: function (range, text) {
                operations.push({
                    identifier: null,
                    range: range,
                    text: text,
                    forceMoveMarkers: false
                });
            },
            addTrackedEditOperation: function (range, text) {
                operations.push({
                    identifier: null,
                    range: range,
                    text: text,
                    forceMoveMarkers: false
                });
            },
            trackSelection: function (selection) {
                return null;
            }
        };
        command.getEditOperations(model, editOperationBuilder);
        return operations;
    }
    exports.getEditOperation = getEditOperation;
    /**
     * Create single edit operation
     */
    function createSingleEditOp(text, positionLineNumber, positionColumn, selectionLineNumber, selectionColumn) {
        if (selectionLineNumber === void 0) { selectionLineNumber = positionLineNumber; }
        if (selectionColumn === void 0) { selectionColumn = positionColumn; }
        return {
            identifier: null,
            range: new range_1.Range(selectionLineNumber, selectionColumn, positionLineNumber, positionColumn),
            text: text,
            forceMoveMarkers: false
        };
    }
    exports.createSingleEditOp = createSingleEditOp;
    /**
     * Create single edit operation
     */
    function createInsertDeleteSingleEditOp(text, positionLineNumber, positionColumn, selectionLineNumber, selectionColumn) {
        if (selectionLineNumber === void 0) { selectionLineNumber = positionLineNumber; }
        if (selectionColumn === void 0) { selectionColumn = positionColumn; }
        return {
            identifier: null,
            range: new range_1.Range(selectionLineNumber, selectionColumn, positionLineNumber, positionColumn),
            text: text,
            forceMoveMarkers: true
        };
    }
    exports.createInsertDeleteSingleEditOp = createInsertDeleteSingleEditOp;
});
//# sourceMappingURL=commandTestUtils.js.map