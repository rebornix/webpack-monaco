define(["require", "exports", "vs/editor/common/core/range"], function (require, exports, range_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ReplaceAllCommand = (function () {
        function ReplaceAllCommand(editorSelection, ranges, replaceStrings) {
            this._editorSelection = editorSelection;
            this._ranges = ranges;
            this._replaceStrings = replaceStrings;
        }
        ReplaceAllCommand.prototype.getEditOperations = function (model, builder) {
            if (this._ranges.length > 0) {
                // Collect all edit operations
                var ops = [];
                for (var i = 0; i < this._ranges.length; i++) {
                    ops.push({
                        range: this._ranges[i],
                        text: this._replaceStrings[i]
                    });
                }
                // Sort them in ascending order by range starts
                ops.sort(function (o1, o2) {
                    return range_1.Range.compareRangesUsingStarts(o1.range, o2.range);
                });
                // Merge operations that touch each other
                var resultOps = [];
                var previousOp = ops[0];
                for (var i = 1; i < ops.length; i++) {
                    if (previousOp.range.endLineNumber === ops[i].range.startLineNumber && previousOp.range.endColumn === ops[i].range.startColumn) {
                        // These operations are one after another and can be merged
                        previousOp.range = previousOp.range.plusRange(ops[i].range);
                        previousOp.text = previousOp.text + ops[i].text;
                    }
                    else {
                        resultOps.push(previousOp);
                        previousOp = ops[i];
                    }
                }
                resultOps.push(previousOp);
                for (var i = 0; i < resultOps.length; i++) {
                    builder.addEditOperation(resultOps[i].range, resultOps[i].text);
                }
            }
            this._trackedEditorSelectionId = builder.trackSelection(this._editorSelection);
        };
        ReplaceAllCommand.prototype.computeCursorState = function (model, helper) {
            return helper.getTrackedSelection(this._trackedEditorSelectionId);
        };
        return ReplaceAllCommand;
    }());
    exports.ReplaceAllCommand = ReplaceAllCommand;
});
//# sourceMappingURL=replaceAllCommand.js.map