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
define(["require", "exports", "vs/editor/common/core/range"], function (require, exports, range_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var RestrictedRenderingContext = (function () {
        function RestrictedRenderingContext(viewLayout, viewportData) {
            this._viewLayout = viewLayout;
            this.viewportData = viewportData;
            this.scrollWidth = this._viewLayout.getScrollWidth();
            this.scrollHeight = this._viewLayout.getScrollHeight();
            this.visibleRange = this.viewportData.visibleRange;
            this.bigNumbersDelta = this.viewportData.bigNumbersDelta;
            var vInfo = this._viewLayout.getCurrentViewport();
            this.scrollTop = vInfo.top;
            this.scrollLeft = vInfo.left;
            this.viewportWidth = vInfo.width;
            this.viewportHeight = vInfo.height;
        }
        RestrictedRenderingContext.prototype.getScrolledTopFromAbsoluteTop = function (absoluteTop) {
            return absoluteTop - this.scrollTop;
        };
        RestrictedRenderingContext.prototype.getVerticalOffsetForLineNumber = function (lineNumber) {
            return this._viewLayout.getVerticalOffsetForLineNumber(lineNumber);
        };
        RestrictedRenderingContext.prototype.lineIsVisible = function (lineNumber) {
            return (this.visibleRange.startLineNumber <= lineNumber
                && lineNumber <= this.visibleRange.endLineNumber);
        };
        RestrictedRenderingContext.prototype.getDecorationsInViewport = function () {
            return this.viewportData.getDecorationsInViewport();
        };
        return RestrictedRenderingContext;
    }());
    exports.RestrictedRenderingContext = RestrictedRenderingContext;
    var RenderingContext = (function (_super) {
        __extends(RenderingContext, _super);
        function RenderingContext(viewLayout, viewportData, viewLines) {
            var _this = _super.call(this, viewLayout, viewportData) || this;
            _this._viewLines = viewLines;
            return _this;
        }
        RenderingContext.prototype.linesVisibleRangesForRange = function (range, includeNewLines) {
            return this._viewLines.linesVisibleRangesForRange(range, includeNewLines);
        };
        RenderingContext.prototype.visibleRangeForPosition = function (position) {
            var visibleRanges = this._viewLines.visibleRangesForRange2(new range_1.Range(position.lineNumber, position.column, position.lineNumber, position.column));
            if (!visibleRanges) {
                return null;
            }
            return visibleRanges[0];
        };
        return RenderingContext;
    }(RestrictedRenderingContext));
    exports.RenderingContext = RenderingContext;
    var LineVisibleRanges = (function () {
        function LineVisibleRanges(lineNumber, ranges) {
            this.lineNumber = lineNumber;
            this.ranges = ranges;
        }
        return LineVisibleRanges;
    }());
    exports.LineVisibleRanges = LineVisibleRanges;
    var HorizontalRange = (function () {
        function HorizontalRange(left, width) {
            this.left = Math.round(left);
            this.width = Math.round(width);
        }
        HorizontalRange.prototype.toString = function () {
            return "[" + this.left + "," + this.width + "]";
        };
        return HorizontalRange;
    }());
    exports.HorizontalRange = HorizontalRange;
});
//# sourceMappingURL=renderingContext.js.map