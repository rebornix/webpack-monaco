/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/event"], function (require, exports, event_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function canFormat(formatter, color) {
        return color.isOpaque() || formatter.supportsTransparency;
    }
    var ColorPickerModel = (function () {
        function ColorPickerModel(color, availableFormatters, formatterIndex) {
            this.formatterIndex = formatterIndex;
            this._onColorFlushed = new event_1.Emitter();
            this.onColorFlushed = this._onColorFlushed.event;
            this._onDidChangeColor = new event_1.Emitter();
            this.onDidChangeColor = this._onDidChangeColor.event;
            this._onDidChangeFormatter = new event_1.Emitter();
            this.onDidChangeFormatter = this._onDidChangeFormatter.event;
            if (availableFormatters.length === 0) {
                throw new Error('Color picker needs formats');
            }
            if (formatterIndex < 0 || formatterIndex >= availableFormatters.length) {
                throw new Error('Formatter index out of bounds');
            }
            this.originalColor = color;
            this.formatters = availableFormatters;
            this._color = color;
        }
        Object.defineProperty(ColorPickerModel.prototype, "color", {
            get: function () {
                return this._color;
            },
            set: function (color) {
                if (this._color.equals(color)) {
                    return;
                }
                this._color = color;
                this._checkFormat();
                this._onDidChangeColor.fire(color);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ColorPickerModel.prototype, "formatter", {
            get: function () { return this.formatters[this.formatterIndex]; },
            enumerable: true,
            configurable: true
        });
        ColorPickerModel.prototype.selectNextColorFormat = function () {
            var oldFomatterIndex = this.formatterIndex;
            this._checkFormat((this.formatterIndex + 1) % this.formatters.length);
            if (oldFomatterIndex !== this.formatterIndex) {
                this.flushColor();
            }
        };
        ColorPickerModel.prototype.flushColor = function () {
            this._onColorFlushed.fire(this._color);
        };
        ColorPickerModel.prototype._checkFormat = function (start) {
            if (start === void 0) { start = this.formatterIndex; }
            var isNewFormat = this.formatterIndex !== start;
            this.formatterIndex = start;
            while (!canFormat(this.formatter, this._color)) {
                this.formatterIndex = (this.formatterIndex + 1) % this.formatters.length;
                if (this.formatterIndex === start) {
                    return;
                }
            }
            if (isNewFormat) {
                this._onDidChangeFormatter.fire(this.formatter);
            }
        };
        return ColorPickerModel;
    }());
    exports.ColorPickerModel = ColorPickerModel;
});
//# sourceMappingURL=colorPickerModel.js.map