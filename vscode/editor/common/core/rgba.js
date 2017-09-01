/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports"], function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A very VM friendly rgba datastructure.
     * Please don't touch unless you take a look at the IR.
     */
    var RGBA8 = (function () {
        function RGBA8(r, g, b, a) {
            this.r = RGBA8._clampInt_0_255(r);
            this.g = RGBA8._clampInt_0_255(g);
            this.b = RGBA8._clampInt_0_255(b);
            this.a = RGBA8._clampInt_0_255(a);
        }
        RGBA8.equals = function (a, b) {
            return (a.r === b.r
                && a.g === b.g
                && a.b === b.b
                && a.a === b.a);
        };
        RGBA8._clampInt_0_255 = function (c) {
            if (c < 0) {
                return 0;
            }
            if (c > 255) {
                return 255;
            }
            return c | 0;
        };
        return RGBA8;
    }());
    exports.RGBA8 = RGBA8;
});
//# sourceMappingURL=rgba.js.map