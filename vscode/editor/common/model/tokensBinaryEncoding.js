define(["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var TokenMetadata = (function () {
        function TokenMetadata() {
        }
        TokenMetadata.getLanguageId = function (metadata) {
            return (metadata & 255 /* LANGUAGEID_MASK */) >>> 0 /* LANGUAGEID_OFFSET */;
        };
        TokenMetadata.getTokenType = function (metadata) {
            return (metadata & 1792 /* TOKEN_TYPE_MASK */) >>> 8 /* TOKEN_TYPE_OFFSET */;
        };
        TokenMetadata.getFontStyle = function (metadata) {
            return (metadata & 14336 /* FONT_STYLE_MASK */) >>> 11 /* FONT_STYLE_OFFSET */;
        };
        TokenMetadata.getForeground = function (metadata) {
            return (metadata & 8372224 /* FOREGROUND_MASK */) >>> 14 /* FOREGROUND_OFFSET */;
        };
        TokenMetadata.getBackground = function (metadata) {
            return (metadata & 4286578688 /* BACKGROUND_MASK */) >>> 23 /* BACKGROUND_OFFSET */;
        };
        TokenMetadata.getClassNameFromMetadata = function (metadata) {
            var foreground = this.getForeground(metadata);
            var className = 'mtk' + foreground;
            var fontStyle = this.getFontStyle(metadata);
            if (fontStyle & 1 /* Italic */) {
                className += ' mtki';
            }
            if (fontStyle & 2 /* Bold */) {
                className += ' mtkb';
            }
            if (fontStyle & 4 /* Underline */) {
                className += ' mtku';
            }
            return className;
        };
        TokenMetadata.getInlineStyleFromMetadata = function (metadata, colorMap) {
            var foreground = this.getForeground(metadata);
            var fontStyle = this.getFontStyle(metadata);
            var result = "color: " + colorMap[foreground] + ";";
            if (fontStyle & 1 /* Italic */) {
                result += 'font-style: italic;';
            }
            if (fontStyle & 2 /* Bold */) {
                result += 'font-weight: bold;';
            }
            if (fontStyle & 4 /* Underline */) {
                result += 'text-decoration: underline;';
            }
            return result;
        };
        return TokenMetadata;
    }());
    exports.TokenMetadata = TokenMetadata;
});
//# sourceMappingURL=tokensBinaryEncoding.js.map