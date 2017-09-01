define(["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Uint8Matrix = (function () {
        function Uint8Matrix(rows, cols, defaultValue) {
            var data = new Uint8Array(rows * cols);
            for (var i = 0, len = rows * cols; i < len; i++) {
                data[i] = defaultValue;
            }
            this._data = data;
            this._rows = rows;
            this._cols = cols;
        }
        Uint8Matrix.prototype.get = function (row, col) {
            return this._data[row * this._cols + col];
        };
        Uint8Matrix.prototype.set = function (row, col, value) {
            this._data[row * this._cols + col] = value;
        };
        return Uint8Matrix;
    }());
    exports.Uint8Matrix = Uint8Matrix;
    var Constants;
    (function (Constants) {
        /**
         * MAX SMI (SMall Integer) as defined in v8.
         * one bit is lost for boxing/unboxing flag.
         * one bit is lost for sign flag.
         * See https://thibaultlaurens.github.io/javascript/2013/04/29/how-the-v8-engine-works/#tagged-values
         */
        Constants[Constants["MAX_SAFE_SMALL_INTEGER"] = 1073741824] = "MAX_SAFE_SMALL_INTEGER";
        /**
         * MIN SMI (SMall Integer) as defined in v8.
         * one bit is lost for boxing/unboxing flag.
         * one bit is lost for sign flag.
         * See https://thibaultlaurens.github.io/javascript/2013/04/29/how-the-v8-engine-works/#tagged-values
         */
        Constants[Constants["MIN_SAFE_SMALL_INTEGER"] = -1073741824] = "MIN_SAFE_SMALL_INTEGER";
        /**
         * Max unsigned integer that fits on 8 bits.
         */
        Constants[Constants["MAX_UINT_8"] = 255] = "MAX_UINT_8";
        /**
         * Max unsigned integer that fits on 16 bits.
         */
        Constants[Constants["MAX_UINT_16"] = 65535] = "MAX_UINT_16";
        /**
         * Max unsigned integer that fits on 32 bits.
         */
        Constants[Constants["MAX_UINT_32"] = 4294967295] = "MAX_UINT_32";
    })(Constants = exports.Constants || (exports.Constants = {}));
    function toUint8(v) {
        if (v < 0) {
            return 0;
        }
        if (v > 255 /* MAX_UINT_8 */) {
            return 255 /* MAX_UINT_8 */;
        }
        return v | 0;
    }
    exports.toUint8 = toUint8;
    function toUint32(v) {
        if (v < 0) {
            return 0;
        }
        if (v > 4294967295 /* MAX_UINT_32 */) {
            return 4294967295 /* MAX_UINT_32 */;
        }
        return v | 0;
    }
    exports.toUint32 = toUint32;
    function toUint32Array(arr) {
        var len = arr.length;
        var r = new Uint32Array(len);
        for (var i = 0; i < len; i++) {
            r[i] = toUint32(arr[i]);
        }
        return r;
    }
    exports.toUint32Array = toUint32Array;
});
//# sourceMappingURL=uint.js.map