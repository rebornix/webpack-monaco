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
define(["require", "exports", "vs/base/browser/ui/scrollbar/abstractScrollbar", "vs/base/browser/mouseEvent", "vs/base/common/scrollable", "vs/base/browser/ui/scrollbar/scrollbarState", "vs/base/browser/ui/scrollbar/scrollbarArrow"], function (require, exports, abstractScrollbar_1, mouseEvent_1, scrollable_1, scrollbarState_1, scrollbarArrow_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var VerticalScrollbar = (function (_super) {
        __extends(VerticalScrollbar, _super);
        function VerticalScrollbar(scrollable, options, host) {
            var _this = _super.call(this, {
                lazyRender: options.lazyRender,
                host: host,
                scrollbarState: new scrollbarState_1.ScrollbarState((options.verticalHasArrows ? options.arrowSize : 0), (options.vertical === scrollable_1.ScrollbarVisibility.Hidden ? 0 : options.verticalScrollbarSize), 
                // give priority to vertical scroll bar over horizontal and let it scroll all the way to the bottom
                0),
                visibility: options.vertical,
                extraScrollbarClassName: 'vertical',
                scrollable: scrollable
            }) || this;
            if (options.verticalHasArrows) {
                var arrowDelta = (options.arrowSize - scrollbarArrow_1.ARROW_IMG_SIZE) / 2;
                var scrollbarDelta = (options.verticalScrollbarSize - scrollbarArrow_1.ARROW_IMG_SIZE) / 2;
                _this._createArrow({
                    className: 'up-arrow',
                    top: arrowDelta,
                    left: scrollbarDelta,
                    bottom: void 0,
                    right: void 0,
                    bgWidth: options.verticalScrollbarSize,
                    bgHeight: options.arrowSize,
                    onActivate: function () { return _this._host.onMouseWheel(new mouseEvent_1.StandardMouseWheelEvent(null, 0, 1)); },
                });
                _this._createArrow({
                    className: 'down-arrow',
                    top: void 0,
                    left: scrollbarDelta,
                    bottom: arrowDelta,
                    right: void 0,
                    bgWidth: options.verticalScrollbarSize,
                    bgHeight: options.arrowSize,
                    onActivate: function () { return _this._host.onMouseWheel(new mouseEvent_1.StandardMouseWheelEvent(null, 0, -1)); },
                });
            }
            _this._createSlider(0, Math.floor((options.verticalScrollbarSize - options.verticalSliderSize) / 2), options.verticalSliderSize, null);
            return _this;
        }
        VerticalScrollbar.prototype._updateSlider = function (sliderSize, sliderPosition) {
            this.slider.setHeight(sliderSize);
            this.slider.setTop(sliderPosition);
        };
        VerticalScrollbar.prototype._renderDomNode = function (largeSize, smallSize) {
            this.domNode.setWidth(smallSize);
            this.domNode.setHeight(largeSize);
            this.domNode.setRight(0);
            this.domNode.setTop(0);
        };
        VerticalScrollbar.prototype.onDidScroll = function (e) {
            this._shouldRender = this._onElementScrollSize(e.scrollHeight) || this._shouldRender;
            this._shouldRender = this._onElementScrollPosition(e.scrollTop) || this._shouldRender;
            this._shouldRender = this._onElementSize(e.height) || this._shouldRender;
            return this._shouldRender;
        };
        VerticalScrollbar.prototype._mouseDownRelativePosition = function (offsetX, offsetY) {
            return offsetY;
        };
        VerticalScrollbar.prototype._sliderMousePosition = function (e) {
            return e.posy;
        };
        VerticalScrollbar.prototype._sliderOrthogonalMousePosition = function (e) {
            return e.posx;
        };
        VerticalScrollbar.prototype.writeScrollPosition = function (target, scrollPosition) {
            target.scrollTop = scrollPosition;
        };
        return VerticalScrollbar;
    }(abstractScrollbar_1.AbstractScrollbar));
    exports.VerticalScrollbar = VerticalScrollbar;
});
//# sourceMappingURL=verticalScrollbar.js.map