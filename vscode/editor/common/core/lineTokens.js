define(["require", "exports", "vs/editor/common/model/tokensBinaryEncoding", "vs/editor/common/core/viewLineToken"], function (require, exports, tokensBinaryEncoding_1, viewLineToken_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var LineToken = (function () {
        function LineToken(source, tokenIndex, tokenCount, startOffset, endOffset, metadata) {
            this._source = source;
            this._tokenIndex = tokenIndex;
            this._metadata = metadata;
            this.startOffset = startOffset;
            this.endOffset = endOffset;
            this.hasPrev = (this._tokenIndex > 0);
            this.hasNext = (this._tokenIndex + 1 < tokenCount);
        }
        Object.defineProperty(LineToken.prototype, "languageId", {
            get: function () {
                return tokensBinaryEncoding_1.TokenMetadata.getLanguageId(this._metadata);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LineToken.prototype, "tokenType", {
            get: function () {
                return tokensBinaryEncoding_1.TokenMetadata.getTokenType(this._metadata);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LineToken.prototype, "fontStyle", {
            get: function () {
                return tokensBinaryEncoding_1.TokenMetadata.getFontStyle(this._metadata);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LineToken.prototype, "foregroundId", {
            get: function () {
                return tokensBinaryEncoding_1.TokenMetadata.getForeground(this._metadata);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LineToken.prototype, "backgroundId", {
            get: function () {
                return tokensBinaryEncoding_1.TokenMetadata.getBackground(this._metadata);
            },
            enumerable: true,
            configurable: true
        });
        LineToken.prototype.prev = function () {
            if (!this.hasPrev) {
                return null;
            }
            return this._source.tokenAt(this._tokenIndex - 1);
        };
        LineToken.prototype.next = function () {
            if (!this.hasNext) {
                return null;
            }
            return this._source.tokenAt(this._tokenIndex + 1);
        };
        return LineToken;
    }());
    exports.LineToken = LineToken;
    var LineTokens = (function () {
        function LineTokens(tokens, text) {
            this._tokens = tokens;
            this._tokensCount = (this._tokens.length >>> 1);
            this._text = text;
            this._textLength = this._text.length;
        }
        LineTokens.prototype.getTokenCount = function () {
            return this._tokensCount;
        };
        LineTokens.prototype.getLineContent = function () {
            return this._text;
        };
        LineTokens.prototype.getLineLength = function () {
            return this._textLength;
        };
        LineTokens.prototype.getTokenStartOffset = function (tokenIndex) {
            return this._tokens[(tokenIndex << 1)];
        };
        LineTokens.prototype.getLanguageId = function (tokenIndex) {
            var metadata = this._tokens[(tokenIndex << 1) + 1];
            return tokensBinaryEncoding_1.TokenMetadata.getLanguageId(metadata);
        };
        LineTokens.prototype.getStandardTokenType = function (tokenIndex) {
            var metadata = this._tokens[(tokenIndex << 1) + 1];
            return tokensBinaryEncoding_1.TokenMetadata.getTokenType(metadata);
        };
        LineTokens.prototype.getTokenEndOffset = function (tokenIndex) {
            if (tokenIndex + 1 < this._tokensCount) {
                return this._tokens[(tokenIndex + 1) << 1];
            }
            return this._textLength;
        };
        /**
         * Find the token containing offset `offset`.
         * ```
         *   For example, with the following tokens [0, 5), [5, 9), [9, infinity)
         *   Searching for 0, 1, 2, 3 or 4 will return 0.
         *   Searching for 5, 6, 7 or 8 will return 1.
         *   Searching for 9, 10, 11, ... will return 2.
         * ```
         * @param offset The search offset
         * @return The index of the token containing the offset.
         */
        LineTokens.prototype.findTokenIndexAtOffset = function (offset) {
            return viewLineToken_1.ViewLineTokenFactory.findIndexInSegmentsArray(this._tokens, offset);
        };
        LineTokens.prototype.findTokenAtOffset = function (offset) {
            var tokenIndex = this.findTokenIndexAtOffset(offset);
            return this.tokenAt(tokenIndex);
        };
        LineTokens.prototype.tokenAt = function (tokenIndex) {
            var startOffset = this._tokens[(tokenIndex << 1)];
            var endOffset;
            if (tokenIndex + 1 < this._tokensCount) {
                endOffset = this._tokens[(tokenIndex + 1) << 1];
            }
            else {
                endOffset = this._textLength;
            }
            var metadata = this._tokens[(tokenIndex << 1) + 1];
            return new LineToken(this, tokenIndex, this._tokensCount, startOffset, endOffset, metadata);
        };
        LineTokens.prototype.firstToken = function () {
            if (this._textLength === 0) {
                return null;
            }
            return this.tokenAt(0);
        };
        LineTokens.prototype.lastToken = function () {
            if (this._textLength === 0) {
                return null;
            }
            return this.tokenAt(this._tokensCount - 1);
        };
        LineTokens.prototype.inflate = function () {
            return viewLineToken_1.ViewLineTokenFactory.inflateArr(this._tokens, this._textLength);
        };
        LineTokens.prototype.sliceAndInflate = function (startOffset, endOffset, deltaOffset) {
            return viewLineToken_1.ViewLineTokenFactory.sliceAndInflate(this._tokens, startOffset, endOffset, deltaOffset, this._textLength);
        };
        return LineTokens;
    }());
    exports.LineTokens = LineTokens;
});
//# sourceMappingURL=lineTokens.js.map