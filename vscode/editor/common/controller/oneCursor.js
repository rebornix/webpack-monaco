define(["require", "exports", "vs/editor/common/controller/cursorCommon", "vs/editor/common/core/position", "vs/editor/common/core/range", "vs/editor/common/core/selection"], function (require, exports, cursorCommon_1, position_1, range_1, selection_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var OneCursor = (function () {
        function OneCursor(context) {
            this._setState(context, new cursorCommon_1.SingleCursorState(new range_1.Range(1, 1, 1, 1), 0, new position_1.Position(1, 1), 0), new cursorCommon_1.SingleCursorState(new range_1.Range(1, 1, 1, 1), 0, new position_1.Position(1, 1), 0));
        }
        OneCursor.prototype.dispose = function (context) {
            context.model._removeMarker(this._selStartMarker);
            context.model._removeMarker(this._selEndMarker);
        };
        OneCursor.prototype.asCursorState = function () {
            return new cursorCommon_1.CursorState(this.modelState, this.viewState);
        };
        OneCursor.prototype.readSelectionFromMarkers = function (context) {
            var start = context.model._getMarker(this._selStartMarker);
            var end = context.model._getMarker(this._selEndMarker);
            if (this.modelState.selection.getDirection() === selection_1.SelectionDirection.LTR) {
                return new selection_1.Selection(start.lineNumber, start.column, end.lineNumber, end.column);
            }
            return new selection_1.Selection(end.lineNumber, end.column, start.lineNumber, start.column);
        };
        OneCursor.prototype.ensureValidState = function (context) {
            this._setState(context, this.modelState, this.viewState);
        };
        OneCursor.prototype.setState = function (context, modelState, viewState) {
            this._setState(context, modelState, viewState);
        };
        OneCursor.prototype._setState = function (context, modelState, viewState) {
            if (!modelState) {
                // We only have the view state => compute the model state
                var selectionStart = context.model.validateRange(context.convertViewRangeToModelRange(viewState.selectionStart));
                var position = context.model.validatePosition(context.convertViewPositionToModelPosition(viewState.position.lineNumber, viewState.position.column));
                modelState = new cursorCommon_1.SingleCursorState(selectionStart, viewState.selectionStartLeftoverVisibleColumns, position, viewState.leftoverVisibleColumns);
            }
            else {
                // Validate new model state
                var selectionStart = context.model.validateRange(modelState.selectionStart);
                var selectionStartLeftoverVisibleColumns = modelState.selectionStart.equalsRange(selectionStart) ? modelState.selectionStartLeftoverVisibleColumns : 0;
                var position = context.model.validatePosition(modelState.position);
                var leftoverVisibleColumns = modelState.position.equals(position) ? modelState.leftoverVisibleColumns : 0;
                modelState = new cursorCommon_1.SingleCursorState(selectionStart, selectionStartLeftoverVisibleColumns, position, leftoverVisibleColumns);
            }
            if (!viewState) {
                // We only have the model state => compute the view state
                var viewSelectionStart1 = context.convertModelPositionToViewPosition(new position_1.Position(modelState.selectionStart.startLineNumber, modelState.selectionStart.startColumn));
                var viewSelectionStart2 = context.convertModelPositionToViewPosition(new position_1.Position(modelState.selectionStart.endLineNumber, modelState.selectionStart.endColumn));
                var viewSelectionStart = new range_1.Range(viewSelectionStart1.lineNumber, viewSelectionStart1.column, viewSelectionStart2.lineNumber, viewSelectionStart2.column);
                var viewPosition = context.convertModelPositionToViewPosition(modelState.position);
                viewState = new cursorCommon_1.SingleCursorState(viewSelectionStart, modelState.selectionStartLeftoverVisibleColumns, viewPosition, modelState.leftoverVisibleColumns);
            }
            else {
                // Validate new view state
                var viewSelectionStart = context.validateViewRange(viewState.selectionStart, modelState.selectionStart);
                var viewPosition = context.validateViewPosition(viewState.position, modelState.position);
                viewState = new cursorCommon_1.SingleCursorState(viewSelectionStart, modelState.selectionStartLeftoverVisibleColumns, viewPosition, modelState.leftoverVisibleColumns);
            }
            if (this.modelState && this.viewState && this.modelState.equals(modelState) && this.viewState.equals(viewState)) {
                // No-op, early return
                return;
            }
            this.modelState = modelState;
            this.viewState = viewState;
            this._selStartMarker = this._ensureMarker(context, this._selStartMarker, this.modelState.selection.startLineNumber, this.modelState.selection.startColumn, true);
            this._selEndMarker = this._ensureMarker(context, this._selEndMarker, this.modelState.selection.endLineNumber, this.modelState.selection.endColumn, false);
        };
        OneCursor.prototype._ensureMarker = function (context, markerId, lineNumber, column, stickToPreviousCharacter) {
            if (!markerId) {
                return context.model._addMarker(0, lineNumber, column, stickToPreviousCharacter);
            }
            else {
                context.model._changeMarker(markerId, lineNumber, column);
                context.model._changeMarkerStickiness(markerId, stickToPreviousCharacter);
                return markerId;
            }
        };
        return OneCursor;
    }());
    exports.OneCursor = OneCursor;
});
//# sourceMappingURL=oneCursor.js.map