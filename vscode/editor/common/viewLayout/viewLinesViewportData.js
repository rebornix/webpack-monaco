define(["require", "exports", "vs/editor/common/core/range"], function (require, exports, range_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Contains all data needed to render at a specific viewport.
     */
    var ViewportData = (function () {
        function ViewportData(selections, partialData, whitespaceViewportData, model) {
            this.selections = selections;
            this.startLineNumber = partialData.startLineNumber | 0;
            this.endLineNumber = partialData.endLineNumber | 0;
            this.relativeVerticalOffset = partialData.relativeVerticalOffset;
            this.bigNumbersDelta = partialData.bigNumbersDelta | 0;
            this.whitespaceViewportData = whitespaceViewportData;
            this._model = model;
            this.visibleRange = new range_1.Range(partialData.startLineNumber, this._model.getLineMinColumn(partialData.startLineNumber), partialData.endLineNumber, this._model.getLineMaxColumn(partialData.endLineNumber));
        }
        ViewportData.prototype.getViewLineRenderingData = function (lineNumber) {
            return this._model.getViewLineRenderingData(this.visibleRange, lineNumber);
        };
        ViewportData.prototype.getDecorationsInViewport = function () {
            return this._model.getDecorationsInViewport(this.visibleRange);
        };
        return ViewportData;
    }());
    exports.ViewportData = ViewportData;
});
//# sourceMappingURL=viewLinesViewportData.js.map