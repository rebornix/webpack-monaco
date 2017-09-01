/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports"], function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var IndentRange = (function () {
        function IndentRange(startLineNumber, endLineNumber, indent) {
            this.startLineNumber = startLineNumber;
            this.endLineNumber = endLineNumber;
            this.indent = indent;
        }
        IndentRange.deepCloneArr = function (indentRanges) {
            var result = [];
            for (var i = 0, len = indentRanges.length; i < len; i++) {
                var r = indentRanges[i];
                result[i] = new IndentRange(r.startLineNumber, r.endLineNumber, r.indent);
            }
            return result;
        };
        return IndentRange;
    }());
    exports.IndentRange = IndentRange;
    function computeRanges(model, minimumRangeSize) {
        if (minimumRangeSize === void 0) { minimumRangeSize = 1; }
        var result = [];
        var previousRegions = [];
        previousRegions.push({ indent: -1, line: model.getLineCount() + 1 }); // sentinel, to make sure there's at least one entry
        for (var line = model.getLineCount(); line > 0; line--) {
            var indent = model.getIndentLevel(line);
            if (indent === -1) {
                continue; // only whitespace
            }
            var previous = previousRegions[previousRegions.length - 1];
            if (previous.indent > indent) {
                // discard all regions with larger indent
                do {
                    previousRegions.pop();
                    previous = previousRegions[previousRegions.length - 1];
                } while (previous.indent > indent);
                // new folding range
                var endLineNumber = previous.line - 1;
                if (endLineNumber - line >= minimumRangeSize) {
                    result.push(new IndentRange(line, endLineNumber, indent));
                }
            }
            if (previous.indent === indent) {
                previous.line = line;
            }
            else {
                // new region with a bigger indent
                previousRegions.push({ indent: indent, line: line });
            }
        }
        return result.reverse();
    }
    exports.computeRanges = computeRanges;
});
//# sourceMappingURL=indentRanges.js.map