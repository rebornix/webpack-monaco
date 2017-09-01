define(["require", "exports", "assert", "vs/base/common/color", "vs/editor/contrib/colorPicker/common/colorFormatter"], function (require, exports, assert, color_1, colorFormatter_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function convert2IColor(color) {
        return {
            red: color.rgba.r / 255,
            green: color.rgba.g / 255,
            blue: color.rgba.b / 255,
            alpha: color.rgba.a
        };
    }
    suite('ColorFormatter', function () {
        test('empty formatter', function () {
            var formatter = new colorFormatter_1.ColorFormatter('');
            assert.equal(formatter.supportsTransparency, false);
            assert.equal(formatter.format(convert2IColor(color_1.Color.white)), '');
            assert.equal(formatter.format(convert2IColor(color_1.Color.transparent)), '');
        });
        test('no placeholder', function () {
            var formatter = new colorFormatter_1.ColorFormatter('hello');
            assert.equal(formatter.supportsTransparency, false);
            assert.equal(formatter.format(convert2IColor(color_1.Color.white)), 'hello');
            assert.equal(formatter.format(convert2IColor(color_1.Color.transparent)), 'hello');
        });
        test('supportsTransparency', function () {
            var formatter = new colorFormatter_1.ColorFormatter('hello');
            assert.equal(formatter.supportsTransparency, false);
            var transparentFormatter = new colorFormatter_1.ColorFormatter('{alpha}');
            assert.equal(transparentFormatter.supportsTransparency, true);
        });
        test('default number format is float', function () {
            var formatter = new colorFormatter_1.ColorFormatter('{red}');
            assert.equal(formatter.format(convert2IColor(color_1.Color.red)), '1');
        });
        test('default decimal range is [0-255]', function () {
            var formatter = new colorFormatter_1.ColorFormatter('{red:d}');
            assert.equal(formatter.format(convert2IColor(color_1.Color.red)), '255');
        });
        test('default hex range is [0-FF]', function () {
            var formatter = new colorFormatter_1.ColorFormatter('{red:X}');
            assert.equal(formatter.format(convert2IColor(color_1.Color.red)), 'FF');
        });
        test('documentation', function () {
            var color = new color_1.Color(new color_1.RGBA(255, 127, 0));
            var rgb = new colorFormatter_1.ColorFormatter('rgb({red:d[0-255]}, {green:d[0-255]}, {blue:d[0-255]})');
            assert.equal(rgb.format(convert2IColor(color)), 'rgb(255, 127, 0)');
            var rgba = new colorFormatter_1.ColorFormatter('rgba({red:d[0-255]}, {green:d[0-255]}, {blue:d[0-255]}, {alpha})');
            assert.equal(rgba.format(convert2IColor(color)), 'rgba(255, 127, 0, 1)');
            var hex = new colorFormatter_1.ColorFormatter('#{red:X}{green:X}{blue:X}');
            assert.equal(hex.format(convert2IColor(color)), '#FF7F00');
            var hsla = new colorFormatter_1.ColorFormatter('hsla({hue:d[0-360]}, {saturation:d[0-100]}%, {luminance:d[0-100]}%, {alpha})');
            assert.equal(hsla.format(convert2IColor(color)), 'hsla(30, 100%, 50%, 1)');
        });
        test('bug#32323', function () {
            var color = new color_1.Color(new color_1.HSLA(121, 0.45, 0.29, 0.61));
            var rgba = color.rgba;
            var color2 = new color_1.Color(new color_1.RGBA(rgba.r, rgba.g, rgba.b, rgba.a));
            var hsla = new colorFormatter_1.ColorFormatter('hsla({hue:d[0-360]}, {saturation:d[0-100]}%, {luminance:d[0-100]}%, {alpha})');
            assert.equal(hsla.format(convert2IColor(color2)), 'hsla(121, 45%, 29%, 0.61)');
        });
    });
});
//# sourceMappingURL=colorFormatter.test.js.map