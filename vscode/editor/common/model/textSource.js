define(["require", "exports", "vs/base/common/strings", "vs/editor/common/editorCommon"], function (require, exports, strings, editorCommon_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var RawTextSource = (function () {
        function RawTextSource() {
        }
        RawTextSource.fromString = function (rawText) {
            // Count the number of lines that end with \r\n
            var carriageReturnCnt = 0;
            var lastCarriageReturnIndex = -1;
            while ((lastCarriageReturnIndex = rawText.indexOf('\r', lastCarriageReturnIndex + 1)) !== -1) {
                carriageReturnCnt++;
            }
            var containsRTL = strings.containsRTL(rawText);
            var isBasicASCII = (containsRTL ? false : strings.isBasicASCII(rawText));
            // Split the text into lines
            var lines = rawText.split(/\r\n|\r|\n/);
            // Remove the BOM (if present)
            var BOM = '';
            if (strings.startsWithUTF8BOM(lines[0])) {
                BOM = strings.UTF8_BOM_CHARACTER;
                lines[0] = lines[0].substr(1);
            }
            return {
                BOM: BOM,
                lines: lines,
                length: rawText.length,
                containsRTL: containsRTL,
                isBasicASCII: isBasicASCII,
                totalCRCount: carriageReturnCnt
            };
        };
        return RawTextSource;
    }());
    exports.RawTextSource = RawTextSource;
    var TextSource = (function () {
        function TextSource() {
        }
        /**
         * if text source is empty or with precisely one line, returns null. No end of line is detected.
         * if text source contains more lines ending with '\r\n', returns '\r\n'.
         * Otherwise returns '\n'. More lines end with '\n'.
         */
        TextSource._getEOL = function (rawTextSource, defaultEOL) {
            var lineFeedCnt = rawTextSource.lines.length - 1;
            if (lineFeedCnt === 0) {
                // This is an empty file or a file with precisely one line
                return (defaultEOL === editorCommon_1.DefaultEndOfLine.LF ? '\n' : '\r\n');
            }
            if (rawTextSource.totalCRCount > lineFeedCnt / 2) {
                // More than half of the file contains \r\n ending lines
                return '\r\n';
            }
            // At least one line more ends in \n
            return '\n';
        };
        TextSource.fromRawTextSource = function (rawTextSource, defaultEOL) {
            return {
                length: rawTextSource.length,
                lines: rawTextSource.lines,
                BOM: rawTextSource.BOM,
                EOL: this._getEOL(rawTextSource, defaultEOL),
                containsRTL: rawTextSource.containsRTL,
                isBasicASCII: rawTextSource.isBasicASCII,
            };
        };
        TextSource.fromString = function (text, defaultEOL) {
            return this.fromRawTextSource(RawTextSource.fromString(text), defaultEOL);
        };
        TextSource.create = function (source, defaultEOL) {
            if (typeof source === 'string') {
                return this.fromString(source, defaultEOL);
            }
            return this.fromRawTextSource(source, defaultEOL);
        };
        return TextSource;
    }());
    exports.TextSource = TextSource;
});
//# sourceMappingURL=textSource.js.map