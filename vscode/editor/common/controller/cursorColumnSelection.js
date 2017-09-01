define(["require", "exports", "vs/editor/common/core/position", "vs/editor/common/core/range", "vs/editor/common/controller/cursorCommon"], function (require, exports, position_1, range_1, cursorCommon_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ColumnSelection = (function () {
        function ColumnSelection() {
        }
        ColumnSelection._columnSelect = function (config, model, fromLineNumber, fromVisibleColumn, toLineNumber, toVisibleColumn) {
            var lineCount = Math.abs(toLineNumber - fromLineNumber) + 1;
            var reversed = (fromLineNumber > toLineNumber);
            var isRTL = (fromVisibleColumn > toVisibleColumn);
            var isLTR = (fromVisibleColumn < toVisibleColumn);
            var result = [];
            // console.log(`fromVisibleColumn: ${fromVisibleColumn}, toVisibleColumn: ${toVisibleColumn}`);
            for (var i = 0; i < lineCount; i++) {
                var lineNumber = fromLineNumber + (reversed ? -i : i);
                var startColumn = cursorCommon_1.CursorColumns.columnFromVisibleColumn2(config, model, lineNumber, fromVisibleColumn);
                var endColumn = cursorCommon_1.CursorColumns.columnFromVisibleColumn2(config, model, lineNumber, toVisibleColumn);
                var visibleStartColumn = cursorCommon_1.CursorColumns.visibleColumnFromColumn2(config, model, new position_1.Position(lineNumber, startColumn));
                var visibleEndColumn = cursorCommon_1.CursorColumns.visibleColumnFromColumn2(config, model, new position_1.Position(lineNumber, endColumn));
                // console.log(`lineNumber: ${lineNumber}: visibleStartColumn: ${visibleStartColumn}, visibleEndColumn: ${visibleEndColumn}`);
                if (isLTR) {
                    if (visibleStartColumn > toVisibleColumn) {
                        continue;
                    }
                    if (visibleEndColumn < fromVisibleColumn) {
                        continue;
                    }
                }
                if (isRTL) {
                    if (visibleEndColumn > fromVisibleColumn) {
                        continue;
                    }
                    if (visibleStartColumn < toVisibleColumn) {
                        continue;
                    }
                }
                result.push(new cursorCommon_1.SingleCursorState(new range_1.Range(lineNumber, startColumn, lineNumber, startColumn), 0, new position_1.Position(lineNumber, endColumn), 0));
            }
            return {
                viewStates: result,
                reversed: reversed,
                toLineNumber: toLineNumber,
                toVisualColumn: toVisibleColumn
            };
        };
        ColumnSelection.columnSelect = function (config, model, fromViewSelection, toViewLineNumber, toViewVisualColumn) {
            var fromViewPosition = new position_1.Position(fromViewSelection.selectionStartLineNumber, fromViewSelection.selectionStartColumn);
            var fromViewVisibleColumn = cursorCommon_1.CursorColumns.visibleColumnFromColumn2(config, model, fromViewPosition);
            return ColumnSelection._columnSelect(config, model, fromViewPosition.lineNumber, fromViewVisibleColumn, toViewLineNumber, toViewVisualColumn);
        };
        ColumnSelection.columnSelectLeft = function (config, model, cursor, toViewLineNumber, toViewVisualColumn) {
            if (toViewVisualColumn > 1) {
                toViewVisualColumn--;
            }
            return this.columnSelect(config, model, cursor.selection, toViewLineNumber, toViewVisualColumn);
        };
        ColumnSelection.columnSelectRight = function (config, model, cursor, toViewLineNumber, toViewVisualColumn) {
            var maxVisualViewColumn = 0;
            var minViewLineNumber = Math.min(cursor.position.lineNumber, toViewLineNumber);
            var maxViewLineNumber = Math.max(cursor.position.lineNumber, toViewLineNumber);
            for (var lineNumber = minViewLineNumber; lineNumber <= maxViewLineNumber; lineNumber++) {
                var lineMaxViewColumn = model.getLineMaxColumn(lineNumber);
                var lineMaxVisualViewColumn = cursorCommon_1.CursorColumns.visibleColumnFromColumn2(config, model, new position_1.Position(lineNumber, lineMaxViewColumn));
                maxVisualViewColumn = Math.max(maxVisualViewColumn, lineMaxVisualViewColumn);
            }
            if (toViewVisualColumn < maxVisualViewColumn) {
                toViewVisualColumn++;
            }
            return this.columnSelect(config, model, cursor.selection, toViewLineNumber, toViewVisualColumn);
        };
        ColumnSelection.columnSelectUp = function (config, model, cursor, isPaged, toViewLineNumber, toViewVisualColumn) {
            var linesCount = isPaged ? config.pageSize : 1;
            toViewLineNumber -= linesCount;
            if (toViewLineNumber < 1) {
                toViewLineNumber = 1;
            }
            return this.columnSelect(config, model, cursor.selection, toViewLineNumber, toViewVisualColumn);
        };
        ColumnSelection.columnSelectDown = function (config, model, cursor, isPaged, toViewLineNumber, toViewVisualColumn) {
            var linesCount = isPaged ? config.pageSize : 1;
            toViewLineNumber += linesCount;
            if (toViewLineNumber > model.getLineCount()) {
                toViewLineNumber = model.getLineCount();
            }
            return this.columnSelect(config, model, cursor.selection, toViewLineNumber, toViewVisualColumn);
        };
        return ColumnSelection;
    }());
    exports.ColumnSelection = ColumnSelection;
});
//# sourceMappingURL=cursorColumnSelection.js.map