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
define(["require", "exports", "vs/base/common/lifecycle", "vs/base/browser/ui/widget", "vs/base/common/objects", "vs/base/browser/dom", "vs/base/browser/ui/sash/sash", "vs/editor/common/core/range", "vs/base/common/color", "vs/editor/common/model/textModelWithDecorations", "vs/base/common/idGenerator", "vs/css!./zoneWidget"], function (require, exports, lifecycle_1, widget_1, objects, dom, sash_1, range_1, color_1, textModelWithDecorations_1, idGenerator_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var defaultColor = new color_1.Color(new color_1.RGBA(0, 122, 204));
    var defaultOptions = {
        showArrow: true,
        showFrame: true,
        className: '',
        frameColor: defaultColor,
        arrowColor: defaultColor
    };
    var WIDGET_ID = 'vs.editor.contrib.zoneWidget';
    var ViewZoneDelegate = (function () {
        function ViewZoneDelegate(domNode, afterLineNumber, afterColumn, heightInLines, onDomNodeTop, onComputedHeight) {
            this.domNode = domNode;
            this.afterLineNumber = afterLineNumber;
            this.afterColumn = afterColumn;
            this.heightInLines = heightInLines;
            this._onDomNodeTop = onDomNodeTop;
            this._onComputedHeight = onComputedHeight;
        }
        ViewZoneDelegate.prototype.onDomNodeTop = function (top) {
            this._onDomNodeTop(top);
        };
        ViewZoneDelegate.prototype.onComputedHeight = function (height) {
            this._onComputedHeight(height);
        };
        return ViewZoneDelegate;
    }());
    exports.ViewZoneDelegate = ViewZoneDelegate;
    var OverlayWidgetDelegate = (function () {
        function OverlayWidgetDelegate(id, domNode) {
            this._id = id;
            this._domNode = domNode;
        }
        OverlayWidgetDelegate.prototype.getId = function () {
            return this._id;
        };
        OverlayWidgetDelegate.prototype.getDomNode = function () {
            return this._domNode;
        };
        OverlayWidgetDelegate.prototype.getPosition = function () {
            return null;
        };
        return OverlayWidgetDelegate;
    }());
    exports.OverlayWidgetDelegate = OverlayWidgetDelegate;
    var Arrow = (function () {
        function Arrow(_editor) {
            this._editor = _editor;
            this._ruleName = Arrow._IdGenerator.nextId();
            this._decorations = [];
            //
        }
        Arrow.prototype.dispose = function () {
            this.hide();
            dom.removeCSSRulesContainingSelector(this._ruleName);
        };
        Object.defineProperty(Arrow.prototype, "color", {
            set: function (value) {
                if (this._color !== value) {
                    this._color = value;
                    this._updateStyle();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Arrow.prototype, "height", {
            set: function (value) {
                if (this._height !== value) {
                    this._height = value;
                    this._updateStyle();
                }
            },
            enumerable: true,
            configurable: true
        });
        Arrow.prototype._updateStyle = function () {
            dom.removeCSSRulesContainingSelector(this._ruleName);
            dom.createCSSRule(".monaco-editor " + this._ruleName, "border-style: solid; border-color: transparent; border-bottom-color: " + this._color + "; border-width: " + this._height + "px; bottom: -" + this._height + "px; margin-left: -" + this._height + "px; ");
        };
        Arrow.prototype.show = function (where) {
            this._decorations = this._editor.deltaDecorations(this._decorations, [{ range: range_1.Range.fromPositions(where), options: { className: this._ruleName } }]);
        };
        Arrow.prototype.hide = function () {
            this._editor.deltaDecorations(this._decorations, []);
        };
        Arrow._IdGenerator = new idGenerator_1.IdGenerator('.arrow-decoration-');
        return Arrow;
    }());
    var ZoneWidget = (function (_super) {
        __extends(ZoneWidget, _super);
        function ZoneWidget(editor, options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this) || this;
            _this._positionMarkerId = [];
            _this._disposables = [];
            _this._isShowing = false;
            _this.editor = editor;
            _this.options = objects.clone(options);
            objects.mixin(_this.options, defaultOptions, false);
            _this.domNode = document.createElement('div');
            if (!_this.options.isAccessible) {
                _this.domNode.setAttribute('aria-hidden', 'true');
                _this.domNode.setAttribute('role', 'presentation');
            }
            _this._disposables.push(_this.editor.onDidLayoutChange(function (info) {
                var width = _this._getWidth(info);
                _this.domNode.style.width = width + 'px';
                _this._onWidth(width);
            }));
            return _this;
        }
        ZoneWidget.prototype.dispose = function () {
            var _this = this;
            lifecycle_1.dispose(this._disposables);
            if (this._overlayWidget) {
                this.editor.removeOverlayWidget(this._overlayWidget);
                this._overlayWidget = null;
            }
            if (this._viewZone) {
                this.editor.changeViewZones(function (accessor) {
                    accessor.removeZone(_this._viewZone.id);
                    _this._viewZone = null;
                });
            }
            this.editor.deltaDecorations(this._positionMarkerId, []);
        };
        ZoneWidget.prototype.create = function () {
            dom.addClass(this.domNode, 'zone-widget');
            dom.addClass(this.domNode, this.options.className);
            this.container = document.createElement('div');
            dom.addClass(this.container, 'zone-widget-container');
            this.domNode.appendChild(this.container);
            if (this.options.showArrow) {
                this._arrow = new Arrow(this.editor);
                this._disposables.push(this._arrow);
            }
            this._fillContainer(this.container);
            this._initSash();
            this._applyStyles();
        };
        ZoneWidget.prototype.style = function (styles) {
            if (styles.frameColor) {
                this.options.frameColor = styles.frameColor;
            }
            if (styles.arrowColor) {
                this.options.arrowColor = styles.arrowColor;
            }
            this._applyStyles();
        };
        ZoneWidget.prototype._applyStyles = function () {
            if (this.container) {
                var frameColor = this.options.frameColor.toString();
                this.container.style.borderTopColor = frameColor;
                this.container.style.borderBottomColor = frameColor;
            }
            if (this._arrow) {
                var arrowColor = this.options.arrowColor.toString();
                this._arrow.color = arrowColor;
            }
        };
        ZoneWidget.prototype._getWidth = function (info) {
            if (info === void 0) { info = this.editor.getLayoutInfo(); }
            return info.width - info.minimapWidth - info.verticalScrollbarWidth;
        };
        ZoneWidget.prototype._onViewZoneTop = function (top) {
            this.domNode.style.top = top + 'px';
        };
        ZoneWidget.prototype._onViewZoneHeight = function (height) {
            this.domNode.style.height = height + "px";
            var containerHeight = height - this._decoratingElementsHeight();
            this.container.style.height = containerHeight + "px";
            this._doLayout(containerHeight, this._getWidth());
            this._resizeSash.layout();
        };
        Object.defineProperty(ZoneWidget.prototype, "position", {
            get: function () {
                var id = this._positionMarkerId[0];
                if (id) {
                    return this.editor.getModel().getDecorationRange(id).getStartPosition();
                }
                return undefined;
            },
            enumerable: true,
            configurable: true
        });
        ZoneWidget.prototype.show = function (rangeOrPos, heightInLines) {
            var range = range_1.Range.isIRange(rangeOrPos)
                ? rangeOrPos
                : new range_1.Range(rangeOrPos.lineNumber, rangeOrPos.column, rangeOrPos.lineNumber, rangeOrPos.column);
            this._isShowing = true;
            this._showImpl(range, heightInLines);
            this._isShowing = false;
            this._positionMarkerId = this.editor.deltaDecorations(this._positionMarkerId, [{ range: range, options: textModelWithDecorations_1.ModelDecorationOptions.EMPTY }]);
        };
        ZoneWidget.prototype.hide = function () {
            var _this = this;
            if (this._viewZone) {
                this.editor.changeViewZones(function (accessor) {
                    accessor.removeZone(_this._viewZone.id);
                });
                this._viewZone = null;
            }
            if (this._overlayWidget) {
                this.editor.removeOverlayWidget(this._overlayWidget);
                this._overlayWidget = null;
            }
            if (this._arrow) {
                this._arrow.hide();
            }
        };
        ZoneWidget.prototype._decoratingElementsHeight = function () {
            var lineHeight = this.editor.getConfiguration().lineHeight;
            var result = 0;
            if (this.options.showArrow) {
                var arrowHeight = Math.round(lineHeight / 3);
                result += 2 * arrowHeight;
            }
            if (this.options.showFrame) {
                var frameThickness = Math.round(lineHeight / 9);
                result += 2 * frameThickness;
            }
            return result;
        };
        ZoneWidget.prototype._showImpl = function (where, heightInLines) {
            var _this = this;
            var position = {
                lineNumber: where.startLineNumber,
                column: where.startColumn
            };
            var width = this._getWidth();
            this.domNode.style.width = width + "px";
            // Render the widget as zone (rendering) and widget (lifecycle)
            var viewZoneDomNode = document.createElement('div');
            viewZoneDomNode.style.overflow = 'hidden';
            var lineHeight = this.editor.getConfiguration().lineHeight;
            // adjust heightInLines to viewport
            var maxHeightInLines = (this.editor.getLayoutInfo().height / lineHeight) * .8;
            if (heightInLines >= maxHeightInLines) {
                heightInLines = maxHeightInLines;
            }
            var arrowHeight = 0;
            var frameThickness = 0;
            // Render the arrow one 1/3 of an editor line height
            if (this.options.showArrow) {
                arrowHeight = Math.round(lineHeight / 3);
                this._arrow.height = arrowHeight;
                this._arrow.show(position);
            }
            // Render the frame as 1/9 of an editor line height
            if (this.options.showFrame) {
                frameThickness = Math.round(lineHeight / 9);
            }
            // insert zone widget
            this.editor.changeViewZones(function (accessor) {
                if (_this._viewZone) {
                    accessor.removeZone(_this._viewZone.id);
                }
                if (_this._overlayWidget) {
                    _this.editor.removeOverlayWidget(_this._overlayWidget);
                    _this._overlayWidget = null;
                }
                _this.domNode.style.top = '-1000px';
                _this._viewZone = new ViewZoneDelegate(viewZoneDomNode, position.lineNumber, position.column, heightInLines, function (top) { return _this._onViewZoneTop(top); }, function (height) { return _this._onViewZoneHeight(height); });
                _this._viewZone.id = accessor.addZone(_this._viewZone);
                _this._overlayWidget = new OverlayWidgetDelegate(WIDGET_ID + _this._viewZone.id, _this.domNode);
                _this.editor.addOverlayWidget(_this._overlayWidget);
            });
            if (this.options.showFrame) {
                var width_1 = this.options.frameWidth ? this.options.frameWidth : frameThickness;
                this.container.style.borderTopWidth = width_1 + 'px';
                this.container.style.borderBottomWidth = width_1 + 'px';
            }
            var containerHeight = heightInLines * lineHeight - this._decoratingElementsHeight();
            this.container.style.top = arrowHeight + 'px';
            this.container.style.height = containerHeight + 'px';
            this.container.style.overflow = 'hidden';
            this._doLayout(containerHeight, width);
            this.editor.setSelection(where);
            // Reveal the line above or below the zone widget, to get the zone widget in the viewport
            var revealLineNumber = Math.min(this.editor.getModel().getLineCount(), Math.max(1, where.endLineNumber + 1));
            this.editor.revealLine(revealLineNumber);
        };
        ZoneWidget.prototype.setCssClass = function (className, classToReplace) {
            if (classToReplace) {
                this.container.classList.remove(classToReplace);
            }
            dom.addClass(this.container, className);
        };
        ZoneWidget.prototype._onWidth = function (widthInPixel) {
            // implement in subclass
        };
        ZoneWidget.prototype._doLayout = function (heightInPixel, widthInPixel) {
            // implement in subclass
        };
        ZoneWidget.prototype._relayout = function (newHeightInLines) {
            var _this = this;
            if (this._viewZone.heightInLines !== newHeightInLines) {
                this.editor.changeViewZones(function (accessor) {
                    _this._viewZone.heightInLines = newHeightInLines;
                    accessor.layoutZone(_this._viewZone.id);
                });
            }
        };
        // --- sash
        ZoneWidget.prototype._initSash = function () {
            var _this = this;
            this._resizeSash = new sash_1.Sash(this.domNode, this, { orientation: sash_1.Orientation.HORIZONTAL });
            if (!this.options.isResizeable) {
                this._resizeSash.hide();
                this._resizeSash.disable();
            }
            var data;
            this._disposables.push(this._resizeSash.addListener('start', function (e) {
                if (_this._viewZone) {
                    data = {
                        startY: e.startY,
                        heightInLines: _this._viewZone.heightInLines,
                    };
                }
            }));
            this._disposables.push(this._resizeSash.addListener('end', function () {
                data = undefined;
            }));
            this._disposables.push(this._resizeSash.addListener('change', function (evt) {
                if (data) {
                    var lineDelta = (evt.currentY - data.startY) / _this.editor.getConfiguration().lineHeight;
                    var roundedLineDelta = lineDelta < 0 ? Math.ceil(lineDelta) : Math.floor(lineDelta);
                    var newHeightInLines = data.heightInLines + roundedLineDelta;
                    if (newHeightInLines > 5 && newHeightInLines < 35) {
                        _this._relayout(newHeightInLines);
                    }
                }
            }));
        };
        ZoneWidget.prototype.getHorizontalSashLeft = function () {
            return 0;
        };
        ZoneWidget.prototype.getHorizontalSashTop = function () {
            return parseInt(this.domNode.style.height) - (this._decoratingElementsHeight() / 2);
        };
        ZoneWidget.prototype.getHorizontalSashWidth = function () {
            var layoutInfo = this.editor.getLayoutInfo();
            return layoutInfo.width - layoutInfo.minimapWidth;
        };
        return ZoneWidget;
    }(widget_1.Widget));
    exports.ZoneWidget = ZoneWidget;
});
//# sourceMappingURL=zoneWidget.js.map