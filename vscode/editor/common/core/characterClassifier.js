define(["require", "exports", "vs/editor/common/core/uint"], function (require, exports, uint_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A fast character classifier that uses a compact array for ASCII values.
     */
    var CharacterClassifier = (function () {
        function CharacterClassifier(_defaultValue) {
            var defaultValue = uint_1.toUint8(_defaultValue);
            this._defaultValue = defaultValue;
            this._asciiMap = CharacterClassifier._createAsciiMap(defaultValue);
            this._map = new Map();
        }
        CharacterClassifier._createAsciiMap = function (defaultValue) {
            var asciiMap = new Uint8Array(256);
            for (var i = 0; i < 256; i++) {
                asciiMap[i] = defaultValue;
            }
            return asciiMap;
        };
        CharacterClassifier.prototype.set = function (charCode, _value) {
            var value = uint_1.toUint8(_value);
            if (charCode >= 0 && charCode < 256) {
                this._asciiMap[charCode] = value;
            }
            else {
                this._map.set(charCode, value);
            }
        };
        CharacterClassifier.prototype.get = function (charCode) {
            if (charCode >= 0 && charCode < 256) {
                return this._asciiMap[charCode];
            }
            else {
                return (this._map.get(charCode) || this._defaultValue);
            }
        };
        return CharacterClassifier;
    }());
    exports.CharacterClassifier = CharacterClassifier;
    var Boolean;
    (function (Boolean) {
        Boolean[Boolean["False"] = 0] = "False";
        Boolean[Boolean["True"] = 1] = "True";
    })(Boolean || (Boolean = {}));
    var CharacterSet = (function () {
        function CharacterSet() {
            this._actual = new CharacterClassifier(0 /* False */);
        }
        CharacterSet.prototype.add = function (charCode) {
            this._actual.set(charCode, 1 /* True */);
        };
        CharacterSet.prototype.has = function (charCode) {
            return (this._actual.get(charCode) === 1 /* True */);
        };
        return CharacterSet;
    }());
    exports.CharacterSet = CharacterSet;
});
//# sourceMappingURL=characterClassifier.js.map