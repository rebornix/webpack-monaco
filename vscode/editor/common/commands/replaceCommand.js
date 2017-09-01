define(["require", "exports", "vs/editor/common/core/selection"], function (require, exports, selection_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ReplaceCommand = (function () {
        function ReplaceCommand(range, text, insertsAutoWhitespace) {
            if (insertsAutoWhitespace === void 0) { insertsAutoWhitespace = false; }
            this._range = range;
            this._text = text;
            this.insertsAutoWhitespace = insertsAutoWhitespace;
        }
        ReplaceCommand.prototype.getEditOperations = function (model, builder) {
            builder.addTrackedEditOperation(this._range, this._text);
        };
        ReplaceCommand.prototype.computeCursorState = function (model, helper) {
            var inverseEditOperations = helper.getInverseEditOperations();
            var srcRange = inverseEditOperations[0].range;
            return new selection_1.Selection(srcRange.endLineNumber, srcRange.endColumn, srcRange.endLineNumber, srcRange.endColumn);
        };
        return ReplaceCommand;
    }());
    exports.ReplaceCommand = ReplaceCommand;
    var ReplaceCommandWithoutChangingPosition = (function () {
        function ReplaceCommandWithoutChangingPosition(range, text, insertsAutoWhitespace) {
            if (insertsAutoWhitespace === void 0) { insertsAutoWhitespace = false; }
            this._range = range;
            this._text = text;
            this.insertsAutoWhitespace = insertsAutoWhitespace;
        }
        ReplaceCommandWithoutChangingPosition.prototype.getEditOperations = function (model, builder) {
            builder.addTrackedEditOperation(this._range, this._text);
        };
        ReplaceCommandWithoutChangingPosition.prototype.computeCursorState = function (model, helper) {
            var inverseEditOperations = helper.getInverseEditOperations();
            var srcRange = inverseEditOperations[0].range;
            return new selection_1.Selection(srcRange.startLineNumber, srcRange.startColumn, srcRange.startLineNumber, srcRange.startColumn);
        };
        return ReplaceCommandWithoutChangingPosition;
    }());
    exports.ReplaceCommandWithoutChangingPosition = ReplaceCommandWithoutChangingPosition;
    var ReplaceCommandWithOffsetCursorState = (function () {
        function ReplaceCommandWithOffsetCursorState(range, text, lineNumberDeltaOffset, columnDeltaOffset, insertsAutoWhitespace) {
            if (insertsAutoWhitespace === void 0) { insertsAutoWhitespace = false; }
            this._range = range;
            this._text = text;
            this._columnDeltaOffset = columnDeltaOffset;
            this._lineNumberDeltaOffset = lineNumberDeltaOffset;
            this.insertsAutoWhitespace = insertsAutoWhitespace;
        }
        ReplaceCommandWithOffsetCursorState.prototype.getEditOperations = function (model, builder) {
            builder.addTrackedEditOperation(this._range, this._text);
        };
        ReplaceCommandWithOffsetCursorState.prototype.computeCursorState = function (model, helper) {
            var inverseEditOperations = helper.getInverseEditOperations();
            var srcRange = inverseEditOperations[0].range;
            return new selection_1.Selection(srcRange.endLineNumber + this._lineNumberDeltaOffset, srcRange.endColumn + this._columnDeltaOffset, srcRange.endLineNumber + this._lineNumberDeltaOffset, srcRange.endColumn + this._columnDeltaOffset);
        };
        return ReplaceCommandWithOffsetCursorState;
    }());
    exports.ReplaceCommandWithOffsetCursorState = ReplaceCommandWithOffsetCursorState;
    var ReplaceCommandThatPreservesSelection = (function () {
        function ReplaceCommandThatPreservesSelection(editRange, text, initialSelection) {
            this._range = editRange;
            this._text = text;
            this._initialSelection = initialSelection;
        }
        ReplaceCommandThatPreservesSelection.prototype.getEditOperations = function (model, builder) {
            builder.addEditOperation(this._range, this._text);
            this._selectionId = builder.trackSelection(this._initialSelection);
        };
        ReplaceCommandThatPreservesSelection.prototype.computeCursorState = function (model, helper) {
            return helper.getTrackedSelection(this._selectionId);
        };
        return ReplaceCommandThatPreservesSelection;
    }());
    exports.ReplaceCommandThatPreservesSelection = ReplaceCommandThatPreservesSelection;
});
//# sourceMappingURL=replaceCommand.js.map