/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/color"], function (require, exports, color_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function roundFloat(number, decimalPoints) {
        var decimal = Math.pow(10, decimalPoints);
        return Math.round(number * decimal) / decimal;
    }
    function createLiteralNode(value) {
        return function () { return value; };
    }
    function normalize(value, min, max) {
        return value * (max - min) + min;
    }
    function getPropertyValue(color, variable) {
        switch (variable) {
            case 'red':
                return color.rgba.r / 255;
            case 'green':
                return color.rgba.g / 255;
            case 'blue':
                return color.rgba.b / 255;
            case 'alpha':
                return color.rgba.a;
            case 'hue':
                return color.hsla.h / 360;
            case 'saturation':
                return color.hsla.s;
            case 'luminance':
                return color.hsla.l;
            default:
                return undefined;
        }
    }
    function createPropertyNode(variable, fractionDigits, type, min, max) {
        return function (color) {
            var value = getPropertyValue(color, variable);
            if (value === undefined) {
                return '';
            }
            if (type === 'd') {
                min = typeof min === 'number' ? min : 0;
                max = typeof max === 'number' ? max : 255;
                return (normalize(value, min, max).toFixed(0)).toString();
            }
            else if (type === 'x' || type === 'X') {
                min = typeof min === 'number' ? min : 0;
                max = typeof max === 'number' ? max : 255;
                var result = normalize(value, min, max).toString(16);
                if (type === 'X') {
                    result = result.toUpperCase();
                }
                return result.length < 2 ? "0" + result : result;
            }
            min = typeof min === 'number' ? min : 0;
            max = typeof max === 'number' ? max : 1;
            return roundFloat(normalize(value, min, max), 2).toString();
        };
    }
    var ColorFormatter = (function () {
        function ColorFormatter(format) {
            this.supportsTransparency = false;
            this.tree = [];
            var match = ColorFormatter.PATTERN.exec(format);
            var startIndex = 0;
            // if no match -> erroor	throw new Error(`${format} is not consistent with color format syntax.`);
            while (match !== null) {
                var index = match.index;
                if (startIndex < index) {
                    this.tree.push(createLiteralNode(format.substring(startIndex, index)));
                }
                // add more parser catches
                var variable = match[1];
                if (!variable) {
                    throw new Error(variable + " is not defined.");
                }
                this.supportsTransparency = this.supportsTransparency || (variable === 'alpha');
                var decimals = match[2] && parseInt(match[2]);
                var type = match[3];
                var startRange = match[4] && parseInt(match[4]);
                var endRange = match[5] && parseInt(match[5]);
                this.tree.push(createPropertyNode(variable, decimals, type, startRange, endRange));
                startIndex = index + match[0].length;
                match = ColorFormatter.PATTERN.exec(format);
            }
            this.tree.push(createLiteralNode(format.substring(startIndex, format.length)));
        }
        ColorFormatter.prototype.format = function (color) {
            var richColor = new color_1.Color(new color_1.RGBA(Math.round(color.red * 255), Math.round(color.green * 255), Math.round(color.blue * 255), color.alpha));
            return this.tree.map(function (node) { return node(richColor); }).join('');
        };
        // Group 0: variable
        // Group 1: decimal digits
        // Group 2: floating/integer/hex
        // Group 3: range begin
        // Group 4: range end
        ColorFormatter.PATTERN = /{(\w+)(?::(\d*)(\w)+(?:\[(\d+)-(\d+)\])?)?}/g;
        return ColorFormatter;
    }());
    exports.ColorFormatter = ColorFormatter;
    var CombinedColorFormatter = (function () {
        function CombinedColorFormatter(opaqueFormatter, transparentFormatter) {
            this.opaqueFormatter = opaqueFormatter;
            this.transparentFormatter = transparentFormatter;
            this.supportsTransparency = true;
            if (!transparentFormatter.supportsTransparency) {
                throw new Error('Invalid transparent formatter');
            }
        }
        CombinedColorFormatter.prototype.format = function (color) {
            return color.alpha === 1 ? this.opaqueFormatter.format(color) : this.transparentFormatter.format(color);
        };
        return CombinedColorFormatter;
    }());
    exports.CombinedColorFormatter = CombinedColorFormatter;
});
//# sourceMappingURL=colorFormatter.js.map