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
define(["require", "exports", "vs/base/common/platform", "vs/editor/common/config/editorZoom", "vs/editor/common/config/editorOptions"], function (require, exports, platform, editorZoom_1, editorOptions_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Determined from empirical observations.
     * @internal
     */
    var GOLDEN_LINE_HEIGHT_RATIO = platform.isMacintosh ? 1.5 : 1.35;
    function safeParseFloat(n, defaultValue) {
        if (typeof n === 'number') {
            return n;
        }
        var r = parseFloat(n);
        if (isNaN(r)) {
            return defaultValue;
        }
        return r;
    }
    function safeParseInt(n, defaultValue) {
        if (typeof n === 'number') {
            return Math.round(n);
        }
        var r = parseInt(n);
        if (isNaN(r)) {
            return defaultValue;
        }
        return r;
    }
    function clamp(n, min, max) {
        if (n < min) {
            return min;
        }
        if (n > max) {
            return max;
        }
        return n;
    }
    function _string(value, defaultValue) {
        if (typeof value !== 'string') {
            return defaultValue;
        }
        return value;
    }
    var BareFontInfo = (function () {
        /**
         * @internal
         */
        function BareFontInfo(opts) {
            this.zoomLevel = opts.zoomLevel;
            this.fontFamily = String(opts.fontFamily);
            this.fontWeight = String(opts.fontWeight);
            this.fontSize = opts.fontSize;
            this.lineHeight = opts.lineHeight | 0;
            this.letterSpacing = opts.letterSpacing;
        }
        /**
         * @internal
         */
        BareFontInfo.createFromRawSettings = function (opts, zoomLevel) {
            var fontFamily = _string(opts.fontFamily, editorOptions_1.EDITOR_FONT_DEFAULTS.fontFamily);
            var fontWeight = _string(opts.fontWeight, editorOptions_1.EDITOR_FONT_DEFAULTS.fontWeight);
            var fontSize = safeParseFloat(opts.fontSize, editorOptions_1.EDITOR_FONT_DEFAULTS.fontSize);
            fontSize = clamp(fontSize, 0, 100);
            if (fontSize === 0) {
                fontSize = editorOptions_1.EDITOR_FONT_DEFAULTS.fontSize;
            }
            else if (fontSize < 8) {
                fontSize = 8;
            }
            var lineHeight = safeParseInt(opts.lineHeight, 0);
            lineHeight = clamp(lineHeight, 0, 150);
            if (lineHeight === 0) {
                lineHeight = Math.round(GOLDEN_LINE_HEIGHT_RATIO * fontSize);
            }
            else if (lineHeight < 8) {
                lineHeight = 8;
            }
            var letterSpacing = safeParseFloat(opts.letterSpacing, 0);
            letterSpacing = clamp(letterSpacing, -20, 20);
            var editorZoomLevelMultiplier = 1 + (editorZoom_1.EditorZoom.getZoomLevel() * 0.1);
            fontSize *= editorZoomLevelMultiplier;
            lineHeight *= editorZoomLevelMultiplier;
            return new BareFontInfo({
                zoomLevel: zoomLevel,
                fontFamily: fontFamily,
                fontWeight: fontWeight,
                fontSize: fontSize,
                lineHeight: lineHeight,
                letterSpacing: letterSpacing
            });
        };
        /**
         * @internal
         */
        BareFontInfo.prototype.getId = function () {
            return this.zoomLevel + '-' + this.fontFamily + '-' + this.fontWeight + '-' + this.fontSize + '-' + this.lineHeight + '-' + this.letterSpacing;
        };
        return BareFontInfo;
    }());
    exports.BareFontInfo = BareFontInfo;
    var FontInfo = (function (_super) {
        __extends(FontInfo, _super);
        /**
         * @internal
         */
        function FontInfo(opts, isTrusted) {
            var _this = _super.call(this, opts) || this;
            _this.isTrusted = isTrusted;
            _this.isMonospace = opts.isMonospace;
            _this.typicalHalfwidthCharacterWidth = opts.typicalHalfwidthCharacterWidth;
            _this.typicalFullwidthCharacterWidth = opts.typicalFullwidthCharacterWidth;
            _this.spaceWidth = opts.spaceWidth;
            _this.maxDigitWidth = opts.maxDigitWidth;
            return _this;
        }
        /**
         * @internal
         */
        FontInfo.prototype.equals = function (other) {
            return (this.fontFamily === other.fontFamily
                && this.fontWeight === other.fontWeight
                && this.fontSize === other.fontSize
                && this.lineHeight === other.lineHeight
                && this.letterSpacing === other.letterSpacing
                && this.typicalHalfwidthCharacterWidth === other.typicalHalfwidthCharacterWidth
                && this.typicalFullwidthCharacterWidth === other.typicalFullwidthCharacterWidth
                && this.spaceWidth === other.spaceWidth
                && this.maxDigitWidth === other.maxDigitWidth);
        };
        return FontInfo;
    }(BareFontInfo));
    exports.FontInfo = FontInfo;
});
//# sourceMappingURL=fontInfo.js.map