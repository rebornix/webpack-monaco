define(["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DifferenceType = {
        Add: 0,
        Remove: 1,
        Change: 2
    };
    /**
     * Represents information about a specific difference between two sequences.
     */
    var DiffChange = (function () {
        /**
         * Constructs a new DiffChange with the given sequence information
         * and content.
         */
        function DiffChange(originalStart, originalLength, modifiedStart, modifiedLength) {
            //Debug.Assert(originalLength > 0 || modifiedLength > 0, "originalLength and modifiedLength cannot both be <= 0");
            this.originalStart = originalStart;
            this.originalLength = originalLength;
            this.modifiedStart = modifiedStart;
            this.modifiedLength = modifiedLength;
        }
        /**
         * The type of difference.
         */
        DiffChange.prototype.getChangeType = function () {
            if (this.originalLength === 0) {
                return exports.DifferenceType.Add;
            }
            else if (this.modifiedLength === 0) {
                return exports.DifferenceType.Remove;
            }
            else {
                return exports.DifferenceType.Change;
            }
        };
        /**
         * The end point (exclusive) of the change in the original sequence.
         */
        DiffChange.prototype.getOriginalEnd = function () {
            return this.originalStart + this.originalLength;
        };
        /**
         * The end point (exclusive) of the change in the modified sequence.
         */
        DiffChange.prototype.getModifiedEnd = function () {
            return this.modifiedStart + this.modifiedLength;
        };
        return DiffChange;
    }());
    exports.DiffChange = DiffChange;
});
//# sourceMappingURL=diffChange.js.map