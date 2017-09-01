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
define(["require", "exports", "vs/editor/common/editorCommon", "vs/editor/browser/view/viewPart", "vs/editor/browser/viewParts/overviewRuler/overviewRulerImpl", "vs/editor/common/modes", "vs/editor/common/view/overviewZoneManager", "vs/editor/common/view/editorColorRegistry", "vs/base/common/color"], function (require, exports, editorCommon, viewPart_1, overviewRulerImpl_1, modes_1, overviewZoneManager_1, editorColorRegistry_1, color_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var DecorationsOverviewRuler = (function (_super) {
        __extends(DecorationsOverviewRuler, _super);
        function DecorationsOverviewRuler(context) {
            var _this = _super.call(this, context) || this;
            _this._overviewRuler = new overviewRulerImpl_1.OverviewRulerImpl(1, 'decorationsOverviewRuler', _this._context.viewLayout.getScrollHeight(), _this._context.configuration.editor.lineHeight, _this._context.configuration.editor.pixelRatio, DecorationsOverviewRuler.MIN_DECORATION_HEIGHT, DecorationsOverviewRuler.MAX_DECORATION_HEIGHT, function (lineNumber) { return _this._context.viewLayout.getVerticalOffsetForLineNumber(lineNumber); });
            _this._overviewRuler.setLanesCount(_this._context.configuration.editor.viewInfo.overviewRulerLanes, false);
            _this._overviewRuler.setLayout(_this._context.configuration.editor.layoutInfo.overviewRuler, false);
            _this._renderBorder = _this._context.configuration.editor.viewInfo.overviewRulerBorder;
            _this._updateColors();
            _this._updateBackground(false);
            _this._tokensColorTrackerListener = modes_1.TokenizationRegistry.onDidChange(function (e) {
                if (e.changedColorMap) {
                    _this._updateBackground(true);
                }
            });
            _this._shouldUpdateDecorations = true;
            _this._zonesFromDecorations = [];
            _this._shouldUpdateCursorPosition = true;
            _this._hideCursor = _this._context.configuration.editor.viewInfo.hideCursorInOverviewRuler;
            _this._zonesFromCursors = [];
            _this._cursorPositions = [];
            return _this;
        }
        DecorationsOverviewRuler.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this._overviewRuler.dispose();
            this._tokensColorTrackerListener.dispose();
        };
        DecorationsOverviewRuler.prototype._updateBackground = function (render) {
            var minimapEnabled = this._context.configuration.editor.viewInfo.minimap.enabled;
            this._overviewRuler.setUseBackground((minimapEnabled ? modes_1.TokenizationRegistry.getDefaultBackground() : null), render);
        };
        // ---- begin view event handlers
        DecorationsOverviewRuler.prototype.onConfigurationChanged = function (e) {
            var prevLanesCount = this._overviewRuler.getLanesCount();
            var newLanesCount = this._context.configuration.editor.viewInfo.overviewRulerLanes;
            if (prevLanesCount !== newLanesCount) {
                this._overviewRuler.setLanesCount(newLanesCount, false);
            }
            if (e.lineHeight) {
                this._overviewRuler.setLineHeight(this._context.configuration.editor.lineHeight, false);
            }
            if (e.pixelRatio) {
                this._overviewRuler.setPixelRatio(this._context.configuration.editor.pixelRatio, false);
            }
            if (e.viewInfo) {
                this._renderBorder = this._context.configuration.editor.viewInfo.overviewRulerBorder;
                this._hideCursor = this._context.configuration.editor.viewInfo.hideCursorInOverviewRuler;
                this._shouldUpdateCursorPosition = true;
                this._updateBackground(false);
            }
            if (e.layoutInfo) {
                this._overviewRuler.setLayout(this._context.configuration.editor.layoutInfo.overviewRuler, false);
            }
            return true;
        };
        DecorationsOverviewRuler.prototype.onCursorStateChanged = function (e) {
            this._shouldUpdateCursorPosition = true;
            this._cursorPositions = [];
            for (var i = 0, len = e.selections.length; i < len; i++) {
                this._cursorPositions[i] = e.selections[i].getPosition();
            }
            return true;
        };
        DecorationsOverviewRuler.prototype.onDecorationsChanged = function (e) {
            this._shouldUpdateDecorations = true;
            return true;
        };
        DecorationsOverviewRuler.prototype.onFlushed = function (e) {
            this._shouldUpdateCursorPosition = true;
            this._shouldUpdateDecorations = true;
            return true;
        };
        DecorationsOverviewRuler.prototype.onScrollChanged = function (e) {
            this._overviewRuler.setScrollHeight(e.scrollHeight, false);
            return _super.prototype.onScrollChanged.call(this, e) || e.scrollHeightChanged;
        };
        DecorationsOverviewRuler.prototype.onZonesChanged = function (e) {
            return true;
        };
        DecorationsOverviewRuler.prototype.onThemeChanged = function (e) {
            this._updateColors();
            this._shouldUpdateDecorations = true;
            this._shouldUpdateCursorPosition = true;
            return true;
        };
        // ---- end view event handlers
        DecorationsOverviewRuler.prototype.getDomNode = function () {
            return this._overviewRuler.getDomNode();
        };
        DecorationsOverviewRuler.prototype._updateColors = function () {
            var borderColor = this._context.theme.getColor(editorColorRegistry_1.editorOverviewRulerBorder);
            this._borderColor = borderColor ? borderColor.toString() : null;
            var cursorColor = this._context.theme.getColor(editorColorRegistry_1.editorCursorForeground);
            this._cursorColor = cursorColor ? cursorColor.transparent(0.7).toString() : null;
            this._overviewRuler.setThemeType(this._context.theme.type, false);
        };
        DecorationsOverviewRuler.prototype._createZonesFromDecorations = function () {
            var decorations = this._context.model.getAllOverviewRulerDecorations();
            var zones = [];
            for (var i = 0, len = decorations.length; i < len; i++) {
                var dec = decorations[i];
                var overviewRuler = dec.source.options.overviewRuler;
                zones[i] = new overviewZoneManager_1.OverviewRulerZone(dec.range.startLineNumber, dec.range.endLineNumber, overviewRuler.position, 0, this.resolveRulerColor(overviewRuler.color), this.resolveRulerColor(overviewRuler.darkColor), this.resolveRulerColor(overviewRuler.hcColor));
            }
            return zones;
        };
        DecorationsOverviewRuler.prototype.resolveRulerColor = function (color) {
            if (editorCommon.isThemeColor(color)) {
                var c = this._context.theme.getColor(color.id) || color_1.Color.transparent;
                return c.toString();
            }
            return color;
        };
        DecorationsOverviewRuler.prototype._createZonesFromCursors = function () {
            var zones = [];
            for (var i = 0, len = this._cursorPositions.length; i < len; i++) {
                var cursor = this._cursorPositions[i];
                zones[i] = new overviewZoneManager_1.OverviewRulerZone(cursor.lineNumber, cursor.lineNumber, editorCommon.OverviewRulerLane.Full, 2, this._cursorColor, this._cursorColor, this._cursorColor);
            }
            return zones;
        };
        DecorationsOverviewRuler.prototype.prepareRender = function (ctx) {
            // Nothing to read
        };
        DecorationsOverviewRuler.prototype.render = function (ctx) {
            if (this._shouldUpdateDecorations || this._shouldUpdateCursorPosition) {
                if (this._shouldUpdateDecorations) {
                    this._shouldUpdateDecorations = false;
                    this._zonesFromDecorations = this._createZonesFromDecorations();
                }
                if (this._shouldUpdateCursorPosition) {
                    this._shouldUpdateCursorPosition = false;
                    if (this._hideCursor) {
                        this._zonesFromCursors = [];
                    }
                    else {
                        this._zonesFromCursors = this._createZonesFromCursors();
                    }
                }
                var allZones = [];
                allZones = allZones.concat(this._zonesFromCursors);
                allZones = allZones.concat(this._zonesFromDecorations);
                this._overviewRuler.setZones(allZones, false);
            }
            var hasRendered = this._overviewRuler.render(false);
            if (hasRendered && this._renderBorder && this._borderColor && this._overviewRuler.getLanesCount() > 0 && (this._zonesFromDecorations.length > 0 || this._zonesFromCursors.length > 0)) {
                var ctx2 = this._overviewRuler.getDomNode().getContext('2d');
                ctx2.beginPath();
                ctx2.lineWidth = 1;
                ctx2.strokeStyle = this._borderColor;
                ctx2.moveTo(0, 0);
                ctx2.lineTo(0, this._overviewRuler.getPixelHeight());
                ctx2.stroke();
                ctx2.moveTo(0, 0);
                ctx2.lineTo(this._overviewRuler.getPixelWidth(), 0);
                ctx2.stroke();
            }
        };
        DecorationsOverviewRuler.MIN_DECORATION_HEIGHT = 6;
        DecorationsOverviewRuler.MAX_DECORATION_HEIGHT = 60;
        return DecorationsOverviewRuler;
    }(viewPart_1.ViewPart));
    exports.DecorationsOverviewRuler = DecorationsOverviewRuler;
});
//# sourceMappingURL=decorationsOverviewRuler.js.map