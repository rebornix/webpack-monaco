define(["require", "exports", "vs/editor/common/model/tokensBinaryEncoding"], function (require, exports, tokensBinaryEncoding_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * A token on a line.
     */
    var ViewLineToken = (function () {
        function ViewLineToken(endIndex, metadata) {
            this.endIndex = endIndex;
            this._metadata = metadata;
        }
        ViewLineToken.prototype.getForeground = function () {
            return tokensBinaryEncoding_1.TokenMetadata.getForeground(this._metadata);
        };
        ViewLineToken.prototype.getType = function () {
            return tokensBinaryEncoding_1.TokenMetadata.getClassNameFromMetadata(this._metadata);
        };
        ViewLineToken.prototype.getInlineStyle = function (colorMap) {
            return tokensBinaryEncoding_1.TokenMetadata.getInlineStyleFromMetadata(this._metadata, colorMap);
        };
        ViewLineToken._equals = function (a, b) {
            return (a.endIndex === b.endIndex
                && a._metadata === b._metadata);
        };
        ViewLineToken.equalsArr = function (a, b) {
            var aLen = a.length;
            var bLen = b.length;
            if (aLen !== bLen) {
                return false;
            }
            for (var i = 0; i < aLen; i++) {
                if (!this._equals(a[i], b[i])) {
                    return false;
                }
            }
            return true;
        };
        return ViewLineToken;
    }());
    exports.ViewLineToken = ViewLineToken;
    var ViewLineTokenFactory = (function () {
        function ViewLineTokenFactory() {
        }
        ViewLineTokenFactory.inflateArr = function (tokens, lineLength) {
            var result = [];
            for (var i = 0, len = (tokens.length >>> 1); i < len; i++) {
                var endOffset = (i + 1 < len ? tokens[((i + 1) << 1)] : lineLength);
                var metadata = tokens[(i << 1) + 1];
                result[i] = new ViewLineToken(endOffset, metadata);
            }
            return result;
        };
        ViewLineTokenFactory.sliceAndInflate = function (tokens, startOffset, endOffset, deltaOffset, lineLength) {
            var tokenIndex = this.findIndexInSegmentsArray(tokens, startOffset);
            var maxEndOffset = (endOffset - startOffset + deltaOffset);
            var result = [], resultLen = 0;
            for (var i = tokenIndex, len = (tokens.length >>> 1); i < len; i++) {
                var tokenStartOffset = tokens[(i << 1)];
                if (tokenStartOffset >= endOffset) {
                    break;
                }
                var tokenEndOffset = (i + 1 < len ? tokens[((i + 1) << 1)] : lineLength);
                var newEndOffset = Math.min(maxEndOffset, tokenEndOffset - startOffset + deltaOffset);
                var metadata = tokens[(i << 1) + 1];
                result[resultLen++] = new ViewLineToken(newEndOffset, metadata);
            }
            return result;
        };
        ViewLineTokenFactory.findIndexInSegmentsArray = function (tokens, desiredIndex) {
            var low = 0;
            var high = (tokens.length >>> 1) - 1;
            while (low < high) {
                var mid = low + Math.ceil((high - low) / 2);
                var value = tokens[(mid << 1)];
                if (value > desiredIndex) {
                    high = mid - 1;
                }
                else {
                    low = mid;
                }
            }
            return low;
        };
        return ViewLineTokenFactory;
    }());
    exports.ViewLineTokenFactory = ViewLineTokenFactory;
});
//# sourceMappingURL=viewLineToken.js.map