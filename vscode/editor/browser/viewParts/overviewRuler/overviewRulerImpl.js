define(["require", "exports", "vs/base/browser/fastDomNode", "vs/editor/common/editorCommon", "vs/editor/common/view/overviewZoneManager", "vs/base/common/color", "vs/platform/theme/common/themeService"], function (require, exports, fastDomNode_1, editorCommon_1, overviewZoneManager_1, color_1, themeService_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var OverviewRulerImpl = (function () {
        function OverviewRulerImpl(canvasLeftOffset, cssClassName, scrollHeight, lineHeight, pixelRatio, minimumHeight, maximumHeight, getVerticalOffsetForLine) {
            this._canvasLeftOffset = canvasLeftOffset;
            this._domNode = fastDomNode_1.createFastDomNode(document.createElement('canvas'));
            this._domNode.setClassName(cssClassName);
            this._domNode.setPosition('absolute');
            this._domNode.setLayerHinting(true);
            this._lanesCount = 3;
            this._background = null;
            this._zoneManager = new overviewZoneManager_1.OverviewZoneManager(getVerticalOffsetForLine);
            this._zoneManager.setMinimumHeight(minimumHeight);
            this._zoneManager.setMaximumHeight(maximumHeight);
            this._zoneManager.setThemeType(themeService_1.LIGHT);
            this._zoneManager.setDOMWidth(0);
            this._zoneManager.setDOMHeight(0);
            this._zoneManager.setOuterHeight(scrollHeight);
            this._zoneManager.setLineHeight(lineHeight);
            this._zoneManager.setPixelRatio(pixelRatio);
        }
        OverviewRulerImpl.prototype.dispose = function () {
            this._zoneManager = null;
        };
        OverviewRulerImpl.prototype.setLayout = function (position, render) {
            this._domNode.setTop(position.top);
            this._domNode.setRight(position.right);
            var hasChanged = false;
            hasChanged = this._zoneManager.setDOMWidth(position.width) || hasChanged;
            hasChanged = this._zoneManager.setDOMHeight(position.height) || hasChanged;
            if (hasChanged) {
                this._domNode.setWidth(this._zoneManager.getDOMWidth());
                this._domNode.setHeight(this._zoneManager.getDOMHeight());
                this._domNode.domNode.width = this._zoneManager.getCanvasWidth();
                this._domNode.domNode.height = this._zoneManager.getCanvasHeight();
                if (render) {
                    this.render(true);
                }
            }
        };
        OverviewRulerImpl.prototype.getLanesCount = function () {
            return this._lanesCount;
        };
        OverviewRulerImpl.prototype.setLanesCount = function (newLanesCount, render) {
            this._lanesCount = newLanesCount;
            if (render) {
                this.render(true);
            }
        };
        OverviewRulerImpl.prototype.setThemeType = function (themeType, render) {
            this._zoneManager.setThemeType(themeType);
            if (render) {
                this.render(true);
            }
        };
        OverviewRulerImpl.prototype.setUseBackground = function (background, render) {
            this._background = background;
            if (render) {
                this.render(true);
            }
        };
        OverviewRulerImpl.prototype.getDomNode = function () {
            return this._domNode.domNode;
        };
        OverviewRulerImpl.prototype.getPixelWidth = function () {
            return this._zoneManager.getCanvasWidth();
        };
        OverviewRulerImpl.prototype.getPixelHeight = function () {
            return this._zoneManager.getCanvasHeight();
        };
        OverviewRulerImpl.prototype.setScrollHeight = function (scrollHeight, render) {
            this._zoneManager.setOuterHeight(scrollHeight);
            if (render) {
                this.render(true);
            }
        };
        OverviewRulerImpl.prototype.setLineHeight = function (lineHeight, render) {
            this._zoneManager.setLineHeight(lineHeight);
            if (render) {
                this.render(true);
            }
        };
        OverviewRulerImpl.prototype.setPixelRatio = function (pixelRatio, render) {
            this._zoneManager.setPixelRatio(pixelRatio);
            this._domNode.setWidth(this._zoneManager.getDOMWidth());
            this._domNode.setHeight(this._zoneManager.getDOMHeight());
            this._domNode.domNode.width = this._zoneManager.getCanvasWidth();
            this._domNode.domNode.height = this._zoneManager.getCanvasHeight();
            if (render) {
                this.render(true);
            }
        };
        OverviewRulerImpl.prototype.setZones = function (zones, render) {
            this._zoneManager.setZones(zones);
            if (render) {
                this.render(false);
            }
        };
        OverviewRulerImpl.prototype.render = function (forceRender) {
            if (this._zoneManager.getOuterHeight() === 0) {
                return false;
            }
            var width = this._zoneManager.getCanvasWidth();
            var height = this._zoneManager.getCanvasHeight();
            var colorZones = this._zoneManager.resolveColorZones();
            var id2Color = this._zoneManager.getId2Color();
            var ctx = this._domNode.domNode.getContext('2d');
            if (this._background === null) {
                ctx.clearRect(0, 0, width, height);
            }
            else {
                ctx.fillStyle = color_1.Color.Format.CSS.formatHex(this._background);
                ctx.fillRect(0, 0, width, height);
            }
            if (colorZones.length > 0) {
                var remainingWidth = width - this._canvasLeftOffset;
                if (this._lanesCount >= 3) {
                    this._renderThreeLanes(ctx, colorZones, id2Color, remainingWidth);
                }
                else if (this._lanesCount === 2) {
                    this._renderTwoLanes(ctx, colorZones, id2Color, remainingWidth);
                }
                else if (this._lanesCount === 1) {
                    this._renderOneLane(ctx, colorZones, id2Color, remainingWidth);
                }
            }
            return true;
        };
        OverviewRulerImpl.prototype._renderOneLane = function (ctx, colorZones, id2Color, w) {
            this._renderVerticalPatch(ctx, colorZones, id2Color, editorCommon_1.OverviewRulerLane.Left | editorCommon_1.OverviewRulerLane.Center | editorCommon_1.OverviewRulerLane.Right, this._canvasLeftOffset, w);
        };
        OverviewRulerImpl.prototype._renderTwoLanes = function (ctx, colorZones, id2Color, w) {
            var leftWidth = Math.floor(w / 2);
            var rightWidth = w - leftWidth;
            var leftOffset = this._canvasLeftOffset;
            var rightOffset = this._canvasLeftOffset + leftWidth;
            this._renderVerticalPatch(ctx, colorZones, id2Color, editorCommon_1.OverviewRulerLane.Left | editorCommon_1.OverviewRulerLane.Center, leftOffset, leftWidth);
            this._renderVerticalPatch(ctx, colorZones, id2Color, editorCommon_1.OverviewRulerLane.Right, rightOffset, rightWidth);
        };
        OverviewRulerImpl.prototype._renderThreeLanes = function (ctx, colorZones, id2Color, w) {
            var leftWidth = Math.floor(w / 3);
            var rightWidth = Math.floor(w / 3);
            var centerWidth = w - leftWidth - rightWidth;
            var leftOffset = this._canvasLeftOffset;
            var centerOffset = this._canvasLeftOffset + leftWidth;
            var rightOffset = this._canvasLeftOffset + leftWidth + centerWidth;
            this._renderVerticalPatch(ctx, colorZones, id2Color, editorCommon_1.OverviewRulerLane.Left, leftOffset, leftWidth);
            this._renderVerticalPatch(ctx, colorZones, id2Color, editorCommon_1.OverviewRulerLane.Center, centerOffset, centerWidth);
            this._renderVerticalPatch(ctx, colorZones, id2Color, editorCommon_1.OverviewRulerLane.Right, rightOffset, rightWidth);
        };
        OverviewRulerImpl.prototype._renderVerticalPatch = function (ctx, colorZones, id2Color, laneMask, xpos, width) {
            var currentColorId = 0;
            var currentFrom = 0;
            var currentTo = 0;
            for (var i = 0, len = colorZones.length; i < len; i++) {
                var zone = colorZones[i];
                if (!(zone.position & laneMask)) {
                    continue;
                }
                var zoneColorId = zone.colorId;
                var zoneFrom = zone.from;
                var zoneTo = zone.to;
                if (zoneColorId !== currentColorId) {
                    ctx.fillRect(xpos, currentFrom, width, currentTo - currentFrom);
                    currentColorId = zoneColorId;
                    ctx.fillStyle = id2Color[currentColorId];
                    currentFrom = zoneFrom;
                    currentTo = zoneTo;
                }
                else {
                    if (currentTo >= zoneFrom) {
                        currentTo = Math.max(currentTo, zoneTo);
                    }
                    else {
                        ctx.fillRect(xpos, currentFrom, width, currentTo - currentFrom);
                        currentFrom = zoneFrom;
                        currentTo = zoneTo;
                    }
                }
            }
            ctx.fillRect(xpos, currentFrom, width, currentTo - currentFrom);
        };
        return OverviewRulerImpl;
    }());
    exports.OverviewRulerImpl = OverviewRulerImpl;
});
//# sourceMappingURL=overviewRulerImpl.js.map