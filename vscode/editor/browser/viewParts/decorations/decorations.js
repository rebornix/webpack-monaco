/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "vs/editor/browser/view/dynamicViewOverlay", "vs/editor/common/core/range", "vs/editor/common/view/renderingContext", "vs/css!./decorations"], function (require, exports, dynamicViewOverlay_1, range_1, renderingContext_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var DecorationsOverlay = (function (_super) {
        __extends(DecorationsOverlay, _super);
        function DecorationsOverlay(context) {
            var _this = _super.call(this) || this;
            _this._context = context;
            _this._lineHeight = _this._context.configuration.editor.lineHeight;
            _this._typicalHalfwidthCharacterWidth = _this._context.configuration.editor.fontInfo.typicalHalfwidthCharacterWidth;
            _this._renderResult = null;
            _this._context.addEventHandler(_this);
            return _this;
        }
        DecorationsOverlay.prototype.dispose = function () {
            this._context.removeEventHandler(this);
            this._context = null;
            this._renderResult = null;
            _super.prototype.dispose.call(this);
        };
        // --- begin event handlers
        DecorationsOverlay.prototype.onConfigurationChanged = function (e) {
            if (e.lineHeight) {
                this._lineHeight = this._context.configuration.editor.lineHeight;
            }
            if (e.fontInfo) {
                this._typicalHalfwidthCharacterWidth = this._context.configuration.editor.fontInfo.typicalHalfwidthCharacterWidth;
            }
            return true;
        };
        DecorationsOverlay.prototype.onDecorationsChanged = function (e) {
            return true;
        };
        DecorationsOverlay.prototype.onFlushed = function (e) {
            return true;
        };
        DecorationsOverlay.prototype.onLinesChanged = function (e) {
            return true;
        };
        DecorationsOverlay.prototype.onLinesDeleted = function (e) {
            return true;
        };
        DecorationsOverlay.prototype.onLinesInserted = function (e) {
            return true;
        };
        DecorationsOverlay.prototype.onScrollChanged = function (e) {
            return e.scrollTopChanged || e.scrollWidthChanged;
        };
        DecorationsOverlay.prototype.onZonesChanged = function (e) {
            return true;
        };
        // --- end event handlers
        DecorationsOverlay.prototype.prepareRender = function (ctx) {
            var _decorations = ctx.getDecorationsInViewport();
            // Keep only decorations with `className`
            var decorations = [], decorationsLen = 0;
            for (var i = 0, len = _decorations.length; i < len; i++) {
                var d = _decorations[i];
                if (d.source.options.className) {
                    decorations[decorationsLen++] = d;
                }
            }
            // Sort decorations for consistent render output
            decorations = decorations.sort(function (a, b) {
                var aClassName = a.source.options.className;
                var bClassName = b.source.options.className;
                if (aClassName < bClassName) {
                    return -1;
                }
                if (aClassName > bClassName) {
                    return 1;
                }
                return range_1.Range.compareRangesUsingStarts(a.range, b.range);
            });
            var visibleStartLineNumber = ctx.visibleRange.startLineNumber;
            var visibleEndLineNumber = ctx.visibleRange.endLineNumber;
            var output = [];
            for (var lineNumber = visibleStartLineNumber; lineNumber <= visibleEndLineNumber; lineNumber++) {
                var lineIndex = lineNumber - visibleStartLineNumber;
                output[lineIndex] = '';
            }
            // Render first whole line decorations and then regular decorations
            this._renderWholeLineDecorations(ctx, decorations, output);
            this._renderNormalDecorations(ctx, decorations, output);
            this._renderResult = output;
        };
        DecorationsOverlay.prototype._renderWholeLineDecorations = function (ctx, decorations, output) {
            var lineHeight = String(this._lineHeight);
            var visibleStartLineNumber = ctx.visibleRange.startLineNumber;
            var visibleEndLineNumber = ctx.visibleRange.endLineNumber;
            for (var i = 0, lenI = decorations.length; i < lenI; i++) {
                var d = decorations[i];
                if (!d.source.options.isWholeLine) {
                    continue;
                }
                var decorationOutput = ('<div class="cdr '
                    + d.source.options.className
                    + '" style="left:0;width:100%;height:'
                    + lineHeight
                    + 'px;"></div>');
                var startLineNumber = Math.max(d.range.startLineNumber, visibleStartLineNumber);
                var endLineNumber = Math.min(d.range.endLineNumber, visibleEndLineNumber);
                for (var j = startLineNumber; j <= endLineNumber; j++) {
                    var lineIndex = j - visibleStartLineNumber;
                    output[lineIndex] += decorationOutput;
                }
            }
        };
        DecorationsOverlay.prototype._renderNormalDecorations = function (ctx, decorations, output) {
            var lineHeight = String(this._lineHeight);
            var visibleStartLineNumber = ctx.visibleRange.startLineNumber;
            for (var i = 0, lenI = decorations.length; i < lenI; i++) {
                var d = decorations[i];
                if (d.source.options.isWholeLine) {
                    continue;
                }
                var className = d.source.options.className;
                var showIfCollapsed = d.source.options.showIfCollapsed;
                var range = d.range;
                if (showIfCollapsed && range.endColumn === 1 && range.endLineNumber !== range.startLineNumber) {
                    range = new range_1.Range(range.startLineNumber, range.startColumn, range.endLineNumber - 1, this._context.model.getLineMaxColumn(range.endLineNumber - 1));
                }
                var linesVisibleRanges = ctx.linesVisibleRangesForRange(range, /*TODO@Alex*/ className === 'findMatch');
                if (!linesVisibleRanges) {
                    continue;
                }
                for (var j = 0, lenJ = linesVisibleRanges.length; j < lenJ; j++) {
                    var lineVisibleRanges = linesVisibleRanges[j];
                    var lineIndex = lineVisibleRanges.lineNumber - visibleStartLineNumber;
                    if (showIfCollapsed && lineVisibleRanges.ranges.length === 1) {
                        var singleVisibleRange = lineVisibleRanges.ranges[0];
                        if (singleVisibleRange.width === 0) {
                            // collapsed range case => make the decoration visible by faking its width
                            lineVisibleRanges.ranges[0] = new renderingContext_1.HorizontalRange(singleVisibleRange.left, this._typicalHalfwidthCharacterWidth);
                        }
                    }
                    for (var k = 0, lenK = lineVisibleRanges.ranges.length; k < lenK; k++) {
                        var visibleRange = lineVisibleRanges.ranges[k];
                        var decorationOutput = ('<div class="cdr '
                            + className
                            + '" style="left:'
                            + String(visibleRange.left)
                            + 'px;width:'
                            + String(visibleRange.width)
                            + 'px;height:'
                            + lineHeight
                            + 'px;"></div>');
                        output[lineIndex] += decorationOutput;
                    }
                }
            }
        };
        DecorationsOverlay.prototype.render = function (startLineNumber, lineNumber) {
            if (!this._renderResult) {
                return '';
            }
            var lineIndex = lineNumber - startLineNumber;
            if (lineIndex < 0 || lineIndex >= this._renderResult.length) {
                throw new Error('Unexpected render request');
            }
            return this._renderResult[lineIndex];
        };
        return DecorationsOverlay;
    }(dynamicViewOverlay_1.DynamicViewOverlay));
    exports.DecorationsOverlay = DecorationsOverlay;
});
//# sourceMappingURL=decorations.js.map