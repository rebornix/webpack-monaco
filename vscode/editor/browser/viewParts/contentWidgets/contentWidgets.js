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
define(["require", "exports", "vs/base/browser/dom", "vs/base/browser/fastDomNode", "vs/editor/browser/editorBrowser", "vs/editor/browser/view/viewPart"], function (require, exports, dom, fastDomNode_1, editorBrowser_1, viewPart_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Coordinate = (function () {
        function Coordinate(top, left) {
            this.top = top;
            this.left = left;
        }
        return Coordinate;
    }());
    var ViewContentWidgets = (function (_super) {
        __extends(ViewContentWidgets, _super);
        function ViewContentWidgets(context, viewDomNode) {
            var _this = _super.call(this, context) || this;
            _this._viewDomNode = viewDomNode;
            _this._widgets = {};
            _this.domNode = fastDomNode_1.createFastDomNode(document.createElement('div'));
            viewPart_1.PartFingerprints.write(_this.domNode, 1 /* ContentWidgets */);
            _this.domNode.setClassName('contentWidgets');
            _this.domNode.setPosition('absolute');
            _this.domNode.setTop(0);
            _this.overflowingContentWidgetsDomNode = fastDomNode_1.createFastDomNode(document.createElement('div'));
            viewPart_1.PartFingerprints.write(_this.overflowingContentWidgetsDomNode, 2 /* OverflowingContentWidgets */);
            _this.overflowingContentWidgetsDomNode.setClassName('overflowingContentWidgets');
            return _this;
        }
        ViewContentWidgets.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this._widgets = null;
            this.domNode = null;
        };
        // --- begin event handlers
        ViewContentWidgets.prototype.onConfigurationChanged = function (e) {
            var keys = Object.keys(this._widgets);
            for (var i = 0, len = keys.length; i < len; i++) {
                var widgetId = keys[i];
                this._widgets[widgetId].onConfigurationChanged(e);
            }
            return true;
        };
        ViewContentWidgets.prototype.onDecorationsChanged = function (e) {
            // true for inline decorations that can end up relayouting text
            return true;
        };
        ViewContentWidgets.prototype.onFlushed = function (e) {
            return true;
        };
        ViewContentWidgets.prototype.onLinesChanged = function (e) {
            return true;
        };
        ViewContentWidgets.prototype.onLinesDeleted = function (e) {
            return true;
        };
        ViewContentWidgets.prototype.onLinesInserted = function (e) {
            return true;
        };
        ViewContentWidgets.prototype.onScrollChanged = function (e) {
            return true;
        };
        ViewContentWidgets.prototype.onZonesChanged = function (e) {
            return true;
        };
        // ---- end view event handlers
        ViewContentWidgets.prototype.addWidget = function (_widget) {
            var myWidget = new Widget(this._context, this._viewDomNode, _widget);
            this._widgets[myWidget.id] = myWidget;
            if (myWidget.allowEditorOverflow) {
                this.overflowingContentWidgetsDomNode.appendChild(myWidget.domNode);
            }
            else {
                this.domNode.appendChild(myWidget.domNode);
            }
            this.setShouldRender();
        };
        ViewContentWidgets.prototype.setWidgetPosition = function (widget, position, preference) {
            var myWidget = this._widgets[widget.getId()];
            myWidget.setPosition(position, preference);
            this.setShouldRender();
        };
        ViewContentWidgets.prototype.removeWidget = function (widget) {
            var widgetId = widget.getId();
            if (this._widgets.hasOwnProperty(widgetId)) {
                var myWidget = this._widgets[widgetId];
                delete this._widgets[widgetId];
                var domNode = myWidget.domNode.domNode;
                domNode.parentNode.removeChild(domNode);
                domNode.removeAttribute('monaco-visible-content-widget');
                this.setShouldRender();
            }
        };
        ViewContentWidgets.prototype.shouldSuppressMouseDownOnWidget = function (widgetId) {
            if (this._widgets.hasOwnProperty(widgetId)) {
                return this._widgets[widgetId].suppressMouseDown;
            }
            return false;
        };
        ViewContentWidgets.prototype.prepareRender = function (ctx) {
            var keys = Object.keys(this._widgets);
            for (var i = 0, len = keys.length; i < len; i++) {
                var widgetId = keys[i];
                this._widgets[widgetId].prepareRender(ctx);
            }
        };
        ViewContentWidgets.prototype.render = function (ctx) {
            var keys = Object.keys(this._widgets);
            for (var i = 0, len = keys.length; i < len; i++) {
                var widgetId = keys[i];
                this._widgets[widgetId].render(ctx);
            }
        };
        return ViewContentWidgets;
    }(viewPart_1.ViewPart));
    exports.ViewContentWidgets = ViewContentWidgets;
    var Widget = (function () {
        function Widget(context, viewDomNode, actual) {
            this._context = context;
            this._viewDomNode = viewDomNode;
            this._actual = actual;
            this.domNode = fastDomNode_1.createFastDomNode(this._actual.getDomNode());
            this.id = this._actual.getId();
            this.allowEditorOverflow = this._actual.allowEditorOverflow || false;
            this.suppressMouseDown = this._actual.suppressMouseDown || false;
            this._fixedOverflowWidgets = this._context.configuration.editor.viewInfo.fixedOverflowWidgets;
            this._contentWidth = this._context.configuration.editor.layoutInfo.contentWidth;
            this._contentLeft = this._context.configuration.editor.layoutInfo.contentLeft;
            this._lineHeight = this._context.configuration.editor.lineHeight;
            this._position = null;
            this._preference = null;
            this._isVisible = false;
            this._renderData = null;
            this.domNode.setPosition((this._fixedOverflowWidgets && this.allowEditorOverflow) ? 'fixed' : 'absolute');
            this._updateMaxWidth();
            this.domNode.setVisibility('hidden');
            this.domNode.setAttribute('widgetId', this.id);
        }
        Widget.prototype.onConfigurationChanged = function (e) {
            if (e.lineHeight) {
                this._lineHeight = this._context.configuration.editor.lineHeight;
            }
            if (e.layoutInfo) {
                this._contentLeft = this._context.configuration.editor.layoutInfo.contentLeft;
                this._contentWidth = this._context.configuration.editor.layoutInfo.contentWidth;
                this._updateMaxWidth();
            }
        };
        Widget.prototype._updateMaxWidth = function () {
            var maxWidth = this.allowEditorOverflow
                ? window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
                : this._contentWidth;
            this.domNode.setMaxWidth(maxWidth);
        };
        Widget.prototype.setPosition = function (position, preference) {
            this._position = position;
            this._preference = preference;
        };
        Widget.prototype._layoutBoxInViewport = function (topLeft, width, height, ctx) {
            // Our visible box is split horizontally by the current line => 2 boxes
            // a) the box above the line
            var aboveLineTop = topLeft.top;
            var heightAboveLine = aboveLineTop;
            // b) the box under the line
            var underLineTop = topLeft.top + this._lineHeight;
            var heightUnderLine = ctx.viewportHeight - underLineTop;
            var aboveTop = aboveLineTop - height;
            var fitsAbove = (heightAboveLine >= height);
            var belowTop = underLineTop;
            var fitsBelow = (heightUnderLine >= height);
            // And its left
            var actualLeft = topLeft.left;
            if (actualLeft + width > ctx.scrollLeft + ctx.viewportWidth) {
                actualLeft = ctx.scrollLeft + ctx.viewportWidth - width;
            }
            if (actualLeft < ctx.scrollLeft) {
                actualLeft = ctx.scrollLeft;
            }
            return {
                aboveTop: aboveTop,
                fitsAbove: fitsAbove,
                belowTop: belowTop,
                fitsBelow: fitsBelow,
                left: actualLeft
            };
        };
        Widget.prototype._layoutBoxInPage = function (topLeft, width, height, ctx) {
            var left0 = topLeft.left - ctx.scrollLeft;
            if (left0 + width < 0 || left0 > this._contentWidth) {
                return null;
            }
            var aboveTop = topLeft.top - height;
            var belowTop = topLeft.top + this._lineHeight;
            var left = left0 + this._contentLeft;
            var domNodePosition = dom.getDomNodePagePosition(this._viewDomNode.domNode);
            var absoluteAboveTop = domNodePosition.top + aboveTop - dom.StandardWindow.scrollY;
            var absoluteBelowTop = domNodePosition.top + belowTop - dom.StandardWindow.scrollY;
            var absoluteLeft = domNodePosition.left + left - dom.StandardWindow.scrollX;
            var INNER_WIDTH = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            var INNER_HEIGHT = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            // Leave some clearance to the bottom
            var TOP_PADDING = 22;
            var BOTTOM_PADDING = 22;
            var fitsAbove = (absoluteAboveTop >= TOP_PADDING), fitsBelow = (absoluteBelowTop + height <= INNER_HEIGHT - BOTTOM_PADDING);
            if (absoluteLeft + width + 20 > INNER_WIDTH) {
                var delta = absoluteLeft - (INNER_WIDTH - width - 20);
                absoluteLeft -= delta;
                left -= delta;
            }
            if (absoluteLeft < 0) {
                var delta = absoluteLeft;
                absoluteLeft -= delta;
                left -= delta;
            }
            if (this._fixedOverflowWidgets) {
                aboveTop = absoluteAboveTop;
                belowTop = absoluteBelowTop;
                left = absoluteLeft;
            }
            return { aboveTop: aboveTop, fitsAbove: fitsAbove, belowTop: belowTop, fitsBelow: fitsBelow, left: left };
        };
        Widget.prototype._prepareRenderWidgetAtExactPositionOverflowing = function (topLeft) {
            return new Coordinate(topLeft.top, topLeft.left + this._contentLeft);
        };
        Widget.prototype._getTopLeft = function (ctx, position) {
            var visibleRange = ctx.visibleRangeForPosition(position);
            if (!visibleRange) {
                return null;
            }
            var top = ctx.getVerticalOffsetForLineNumber(position.lineNumber) - ctx.scrollTop;
            return new Coordinate(top, visibleRange.left);
        };
        Widget.prototype._prepareRenderWidget = function (ctx) {
            var _this = this;
            if (!this._position || !this._preference) {
                return null;
            }
            // Do not trust that widgets have a valid position
            var validModelPosition = this._context.model.validateModelPosition(this._position);
            if (!this._context.model.coordinatesConverter.modelPositionIsVisible(validModelPosition)) {
                // this position is hidden by the view model
                return null;
            }
            var position = this._context.model.coordinatesConverter.convertModelPositionToViewPosition(validModelPosition);
            var placement = null;
            var fetchPlacement = function () {
                if (placement) {
                    return;
                }
                var topLeft = _this._getTopLeft(ctx, position);
                if (!topLeft) {
                    return;
                }
                var domNode = _this.domNode.domNode;
                var width = domNode.clientWidth;
                var height = domNode.clientHeight;
                if (_this.allowEditorOverflow) {
                    placement = _this._layoutBoxInPage(topLeft, width, height, ctx);
                }
                else {
                    placement = _this._layoutBoxInViewport(topLeft, width, height, ctx);
                }
            };
            // Do two passes, first for perfect fit, second picks first option
            for (var pass = 1; pass <= 2; pass++) {
                for (var i = 0; i < this._preference.length; i++) {
                    var pref = this._preference[i];
                    if (pref === editorBrowser_1.ContentWidgetPositionPreference.ABOVE) {
                        fetchPlacement();
                        if (!placement) {
                            // Widget outside of viewport
                            return null;
                        }
                        if (pass === 2 || placement.fitsAbove) {
                            return new Coordinate(placement.aboveTop, placement.left);
                        }
                    }
                    else if (pref === editorBrowser_1.ContentWidgetPositionPreference.BELOW) {
                        fetchPlacement();
                        if (!placement) {
                            // Widget outside of viewport
                            return null;
                        }
                        if (pass === 2 || placement.fitsBelow) {
                            return new Coordinate(placement.belowTop, placement.left);
                        }
                    }
                    else {
                        var topLeft = this._getTopLeft(ctx, position);
                        if (!topLeft) {
                            // Widget outside of viewport
                            return null;
                        }
                        if (this.allowEditorOverflow) {
                            return this._prepareRenderWidgetAtExactPositionOverflowing(topLeft);
                        }
                        else {
                            return topLeft;
                        }
                    }
                }
            }
            return null;
        };
        Widget.prototype.prepareRender = function (ctx) {
            this._renderData = this._prepareRenderWidget(ctx);
        };
        Widget.prototype.render = function (ctx) {
            if (!this._renderData) {
                // This widget should be invisible
                if (this._isVisible) {
                    this.domNode.removeAttribute('monaco-visible-content-widget');
                    this._isVisible = false;
                    this.domNode.setVisibility('hidden');
                }
                return;
            }
            // This widget should be visible
            if (this.allowEditorOverflow) {
                this.domNode.setTop(this._renderData.top);
                this.domNode.setLeft(this._renderData.left);
            }
            else {
                this.domNode.setTop(this._renderData.top + ctx.scrollTop - ctx.bigNumbersDelta);
                this.domNode.setLeft(this._renderData.left);
            }
            if (!this._isVisible) {
                this.domNode.setVisibility('inherit');
                this.domNode.setAttribute('monaco-visible-content-widget', 'true');
                this._isVisible = true;
            }
        };
        return Widget;
    }());
});
//# sourceMappingURL=contentWidgets.js.map