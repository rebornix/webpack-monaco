define(["require", "exports", "assert", "vs/editor/test/common/view/minimapCharRendererFactory", "vs/editor/common/view/runtimeMinimapCharRenderer", "vs/editor/common/core/rgba"], function (require, exports, assert, minimapCharRendererFactory_1, runtimeMinimapCharRenderer_1, rgba_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    suite('MinimapCharRenderer', function () {
        var sampleData = null;
        suiteSetup(function () {
            sampleData = new Uint8ClampedArray(16 /* SAMPLED_CHAR_HEIGHT */ * 10 /* SAMPLED_CHAR_WIDTH */ * 4 /* RGBA_CHANNELS_CNT */ * 95 /* CHAR_COUNT */);
        });
        suiteTeardown(function () {
            sampleData = null;
        });
        setup(function () {
            for (var i = 0; i < sampleData.length; i++) {
                sampleData[i] = 0;
            }
        });
        var sampleD = [
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xd0, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x78, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xd0, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x78, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xd0, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x78, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0x0d, 0xff, 0xff, 0xff, 0xa3, 0xff, 0xff, 0xff, 0xf3, 0xff, 0xff, 0xff, 0xe5, 0xff, 0xff, 0xff, 0x5e, 0xff, 0xff, 0xff, 0xd0, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x78, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xa4, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xf7, 0xff, 0xff, 0xff, 0xfc, 0xff, 0xff, 0xff, 0xf0, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x78, 0x00, 0x00, 0x00, 0x00,
            0xff, 0xff, 0xff, 0x10, 0xff, 0xff, 0xff, 0xfb, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x94, 0xff, 0xff, 0xff, 0x02, 0xff, 0xff, 0xff, 0x6a, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x78, 0x00, 0x00, 0x00, 0x00,
            0xff, 0xff, 0xff, 0x3b, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x22, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0x03, 0xff, 0xff, 0xff, 0xf0, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x78, 0x00, 0x00, 0x00, 0x00,
            0xff, 0xff, 0xff, 0x47, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x06, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xd6, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x78, 0x00, 0x00, 0x00, 0x00,
            0xff, 0xff, 0xff, 0x31, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x16, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0xe7, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x78, 0x00, 0x00, 0x00, 0x00,
            0xff, 0xff, 0xff, 0x0e, 0xff, 0xff, 0xff, 0xf7, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x69, 0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0x3d, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x78, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0x9b, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xf9, 0xff, 0xff, 0xff, 0xb9, 0xff, 0xff, 0xff, 0xf0, 0xff, 0xff, 0xff, 0xf7, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x78, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0xff, 0xff, 0xff, 0x0e, 0xff, 0xff, 0xff, 0xa7, 0xff, 0xff, 0xff, 0xf5, 0xff, 0xff, 0xff, 0xe8, 0xff, 0xff, 0xff, 0x71, 0xff, 0xff, 0xff, 0xd0, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x78, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        ];
        function setSampleData(charCode, data) {
            var rowWidth = 10 /* SAMPLED_CHAR_WIDTH */ * 4 /* RGBA_CHANNELS_CNT */ * 95 /* CHAR_COUNT */;
            var chIndex = charCode - 32 /* START_CH_CODE */;
            var globalOutputOffset = chIndex * 10 /* SAMPLED_CHAR_WIDTH */ * 4 /* RGBA_CHANNELS_CNT */;
            var inputOffset = 0;
            for (var i = 0; i < 16 /* SAMPLED_CHAR_HEIGHT */; i++) {
                var outputOffset = globalOutputOffset;
                for (var j = 0; j < 10 /* SAMPLED_CHAR_WIDTH */; j++) {
                    for (var channel = 0; channel < 4 /* RGBA_CHANNELS_CNT */; channel++) {
                        sampleData[outputOffset] = data[inputOffset];
                        inputOffset++;
                        outputOffset++;
                    }
                }
                globalOutputOffset += rowWidth;
            }
        }
        function createFakeImageData(width, height) {
            return {
                width: width,
                height: height,
                data: new Uint8ClampedArray(width * height * 4 /* RGBA_CHANNELS_CNT */)
            };
        }
        test('letter d @ 2x', function () {
            setSampleData('d'.charCodeAt(0), sampleD);
            var renderer = minimapCharRendererFactory_1.MinimapCharRendererFactory.create(sampleData);
            var background = new rgba_1.RGBA8(0, 0, 0, 255);
            var color = new rgba_1.RGBA8(255, 255, 255, 255);
            var imageData = createFakeImageData(2 /* x2_CHAR_WIDTH */, 4 /* x2_CHAR_HEIGHT */);
            // set the background color
            for (var i = 0, len = imageData.data.length / 4; i < len; i++) {
                imageData.data[4 * i + 0] = background.r;
                imageData.data[4 * i + 1] = background.g;
                imageData.data[4 * i + 2] = background.b;
                imageData.data[4 * i + 3] = 255;
            }
            renderer.x2RenderChar(imageData, 0, 0, 'd'.charCodeAt(0), color, background, false);
            var actual = [];
            for (var i = 0; i < imageData.data.length; i++) {
                actual[i] = imageData.data[i];
            }
            assert.deepEqual(actual, [
                0x00, 0x00, 0x00, 0xff, 0x6d, 0x6d, 0x6d, 0xff,
                0xbb, 0xbb, 0xbb, 0xff, 0xbe, 0xbe, 0xbe, 0xff,
                0x94, 0x94, 0x94, 0xff, 0x7e, 0x7e, 0x7e, 0xff,
                0xb1, 0xb1, 0xb1, 0xff, 0xbb, 0xbb, 0xbb, 0xff,
            ]);
        });
        test('letter d @ 2x at runtime', function () {
            var renderer = runtimeMinimapCharRenderer_1.getOrCreateMinimapCharRenderer();
            var background = new rgba_1.RGBA8(0, 0, 0, 255);
            var color = new rgba_1.RGBA8(255, 255, 255, 255);
            var imageData = createFakeImageData(2 /* x2_CHAR_WIDTH */, 4 /* x2_CHAR_HEIGHT */);
            // set the background color
            for (var i = 0, len = imageData.data.length / 4; i < len; i++) {
                imageData.data[4 * i + 0] = background.r;
                imageData.data[4 * i + 1] = background.g;
                imageData.data[4 * i + 2] = background.b;
                imageData.data[4 * i + 3] = 255;
            }
            renderer.x2RenderChar(imageData, 0, 0, 'd'.charCodeAt(0), color, background, false);
            var actual = [];
            for (var i = 0; i < imageData.data.length; i++) {
                actual[i] = imageData.data[i];
            }
            assert.deepEqual(actual, [
                0x00, 0x00, 0x00, 0xff, 0x6d, 0x6d, 0x6d, 0xff,
                0xbb, 0xbb, 0xbb, 0xff, 0xbe, 0xbe, 0xbe, 0xff,
                0x94, 0x94, 0x94, 0xff, 0x7e, 0x7e, 0x7e, 0xff,
                0xb1, 0xb1, 0xb1, 0xff, 0xbb, 0xbb, 0xbb, 0xff,
            ]);
        });
        test('letter d @ 1x', function () {
            setSampleData('d'.charCodeAt(0), sampleD);
            var renderer = minimapCharRendererFactory_1.MinimapCharRendererFactory.create(sampleData);
            var background = new rgba_1.RGBA8(0, 0, 0, 255);
            var color = new rgba_1.RGBA8(255, 255, 255, 255);
            var imageData = createFakeImageData(1 /* x1_CHAR_WIDTH */, 2 /* x1_CHAR_HEIGHT */);
            // set the background color
            for (var i = 0, len = imageData.data.length / 4; i < len; i++) {
                imageData.data[4 * i + 0] = background.r;
                imageData.data[4 * i + 1] = background.g;
                imageData.data[4 * i + 2] = background.b;
                imageData.data[4 * i + 3] = 255;
            }
            renderer.x1RenderChar(imageData, 0, 0, 'd'.charCodeAt(0), color, background, false);
            var actual = [];
            for (var i = 0; i < imageData.data.length; i++) {
                actual[i] = imageData.data[i];
            }
            assert.deepEqual(actual, [
                0x55, 0x55, 0x55, 0xff,
                0x93, 0x93, 0x93, 0xff,
            ]);
        });
        test('letter d @ 1x at runtime', function () {
            var renderer = runtimeMinimapCharRenderer_1.getOrCreateMinimapCharRenderer();
            var background = new rgba_1.RGBA8(0, 0, 0, 255);
            var color = new rgba_1.RGBA8(255, 255, 255, 255);
            var imageData = createFakeImageData(1 /* x1_CHAR_WIDTH */, 2 /* x1_CHAR_HEIGHT */);
            // set the background color
            for (var i = 0, len = imageData.data.length / 4; i < len; i++) {
                imageData.data[4 * i + 0] = background.r;
                imageData.data[4 * i + 1] = background.g;
                imageData.data[4 * i + 2] = background.b;
                imageData.data[4 * i + 3] = 255;
            }
            renderer.x1RenderChar(imageData, 0, 0, 'd'.charCodeAt(0), color, background, false);
            var actual = [];
            for (var i = 0; i < imageData.data.length; i++) {
                actual[i] = imageData.data[i];
            }
            assert.deepEqual(actual, [
                0x55, 0x55, 0x55, 0xff,
                0x93, 0x93, 0x93, 0xff,
            ]);
        });
    });
});
//# sourceMappingURL=minimapCharRenderer.test.js.map