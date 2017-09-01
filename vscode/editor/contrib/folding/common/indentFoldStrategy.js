/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports"], function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function computeRanges(model) {
        // we get here a clone of the model's indent ranges
        return model.getIndentRanges();
    }
    exports.computeRanges = computeRanges;
    /**
     * Limits the number of folding ranges by removing ranges with larger indent levels
     */
    function limitByIndent(ranges, maxEntries) {
        if (ranges.length <= maxEntries) {
            return ranges;
        }
        var indentOccurrences = [];
        ranges.forEach(function (r) {
            if (r.indent < 1000) {
                indentOccurrences[r.indent] = (indentOccurrences[r.indent] || 0) + 1;
            }
        });
        var maxIndent = indentOccurrences.length;
        for (var i = 0; i < indentOccurrences.length; i++) {
            if (indentOccurrences[i]) {
                maxEntries -= indentOccurrences[i];
                if (maxEntries < 0) {
                    maxIndent = i;
                    break;
                }
            }
        }
        return ranges.filter(function (r) { return r.indent < maxIndent; });
    }
    exports.limitByIndent = limitByIndent;
});
//# sourceMappingURL=indentFoldStrategy.js.map