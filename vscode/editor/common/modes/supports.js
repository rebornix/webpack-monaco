define(["require", "exports", "vs/editor/common/modes"], function (require, exports, modes) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function createScopedLineTokens(context, offset) {
        var tokenCount = context.getTokenCount();
        var tokenIndex = context.findTokenIndexAtOffset(offset);
        var desiredLanguageId = context.getLanguageId(tokenIndex);
        var lastTokenIndex = tokenIndex;
        while (lastTokenIndex + 1 < tokenCount && context.getLanguageId(lastTokenIndex + 1) === desiredLanguageId) {
            lastTokenIndex++;
        }
        var firstTokenIndex = tokenIndex;
        while (firstTokenIndex > 0 && context.getLanguageId(firstTokenIndex - 1) === desiredLanguageId) {
            firstTokenIndex--;
        }
        return new ScopedLineTokens(context, desiredLanguageId, firstTokenIndex, lastTokenIndex + 1, context.getTokenStartOffset(firstTokenIndex), context.getTokenEndOffset(lastTokenIndex));
    }
    exports.createScopedLineTokens = createScopedLineTokens;
    var ScopedLineTokens = (function () {
        function ScopedLineTokens(actual, languageId, firstTokenIndex, lastTokenIndex, firstCharOffset, lastCharOffset) {
            this._actual = actual;
            this.languageId = languageId;
            this._firstTokenIndex = firstTokenIndex;
            this._lastTokenIndex = lastTokenIndex;
            this.firstCharOffset = firstCharOffset;
            this._lastCharOffset = lastCharOffset;
        }
        ScopedLineTokens.prototype.getLineContent = function () {
            var actualLineContent = this._actual.getLineContent();
            return actualLineContent.substring(this.firstCharOffset, this._lastCharOffset);
        };
        ScopedLineTokens.prototype.getTokenCount = function () {
            return this._lastTokenIndex - this._firstTokenIndex;
        };
        ScopedLineTokens.prototype.findTokenIndexAtOffset = function (offset) {
            return this._actual.findTokenIndexAtOffset(offset + this.firstCharOffset) - this._firstTokenIndex;
        };
        ScopedLineTokens.prototype.getTokenStartOffset = function (tokenIndex) {
            return this._actual.getTokenStartOffset(tokenIndex + this._firstTokenIndex) - this.firstCharOffset;
        };
        ScopedLineTokens.prototype.getStandardTokenType = function (tokenIndex) {
            return this._actual.getStandardTokenType(tokenIndex + this._firstTokenIndex);
        };
        return ScopedLineTokens;
    }());
    exports.ScopedLineTokens = ScopedLineTokens;
    var IgnoreBracketsInTokens;
    (function (IgnoreBracketsInTokens) {
        IgnoreBracketsInTokens[IgnoreBracketsInTokens["value"] = 7] = "value";
    })(IgnoreBracketsInTokens || (IgnoreBracketsInTokens = {}));
    function ignoreBracketsInToken(standardTokenType) {
        return (standardTokenType & 7 /* value */) !== 0;
    }
    exports.ignoreBracketsInToken = ignoreBracketsInToken;
});
//# sourceMappingURL=supports.js.map