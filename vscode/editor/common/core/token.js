define(["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Token = (function () {
        function Token(offset, type, language) {
            this.offset = offset | 0; // @perf
            this.type = type;
            this.language = language;
        }
        Token.prototype.toString = function () {
            return '(' + this.offset + ', ' + this.type + ')';
        };
        return Token;
    }());
    exports.Token = Token;
    var TokenizationResult = (function () {
        function TokenizationResult(tokens, endState) {
            this.tokens = tokens;
            this.endState = endState;
        }
        return TokenizationResult;
    }());
    exports.TokenizationResult = TokenizationResult;
    var TokenizationResult2 = (function () {
        function TokenizationResult2(tokens, endState) {
            this.tokens = tokens;
            this.endState = endState;
        }
        return TokenizationResult2;
    }());
    exports.TokenizationResult2 = TokenizationResult2;
});
//# sourceMappingURL=token.js.map