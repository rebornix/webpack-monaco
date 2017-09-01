define(["require", "exports", "vs/base/common/diff/diffChange"], function (require, exports, diffChange_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * An implementation of the difference algorithm described by Hirschberg
     */
    var LcsDiff2 = (function () {
        function LcsDiff2(originalSequence, newSequence, continueProcessingPredicate, hashFunc) {
            this.x = originalSequence;
            this.y = newSequence;
            this.ids_for_x = [];
            this.ids_for_y = [];
            if (hashFunc) {
                this.hashFunc = hashFunc;
            }
            else {
                this.hashFunc = function (sequence, index) {
                    return sequence[index];
                };
            }
            this.resultX = [];
            this.resultY = [];
            this.forwardPrev = [];
            this.forwardCurr = [];
            this.backwardPrev = [];
            this.backwardCurr = [];
            for (var i = 0, length_1 = this.x.getLength(); i < length_1; i++) {
                this.resultX[i] = false;
            }
            for (var i = 0, length_2 = this.y.getLength(); i <= length_2; i++) {
                this.resultY[i] = false;
            }
            this.ComputeUniqueIdentifiers();
        }
        LcsDiff2.prototype.ComputeUniqueIdentifiers = function () {
            var xLength = this.x.getLength();
            var yLength = this.y.getLength();
            this.ids_for_x = new Array(xLength);
            this.ids_for_y = new Array(yLength);
            // Create a new hash table for unique elements from the original
            // sequence.
            var hashTable = {};
            var currentUniqueId = 1;
            var i;
            // Fill up the hash table for unique elements
            for (i = 0; i < xLength; i++) {
                var xElementHash = this.x.getElementHash(i);
                if (!hashTable.hasOwnProperty(xElementHash)) {
                    // No entry in the hashtable so this is a new unique element.
                    // Assign the element a new unique identifier and add it to the
                    // hash table
                    this.ids_for_x[i] = currentUniqueId++;
                    hashTable[xElementHash] = this.ids_for_x[i];
                }
                else {
                    this.ids_for_x[i] = hashTable[xElementHash];
                }
            }
            // Now match up modified elements
            for (i = 0; i < yLength; i++) {
                var yElementHash = this.y.getElementHash(i);
                if (!hashTable.hasOwnProperty(yElementHash)) {
                    this.ids_for_y[i] = currentUniqueId++;
                    hashTable[yElementHash] = this.ids_for_y[i];
                }
                else {
                    this.ids_for_y[i] = hashTable[yElementHash];
                }
            }
        };
        LcsDiff2.prototype.ElementsAreEqual = function (xIndex, yIndex) {
            return this.ids_for_x[xIndex] === this.ids_for_y[yIndex];
        };
        LcsDiff2.prototype.ComputeDiff = function () {
            var xLength = this.x.getLength();
            var yLength = this.y.getLength();
            this.execute(0, xLength - 1, 0, yLength - 1);
            // Construct the changes
            var i = 0;
            var j = 0;
            var xChangeStart, yChangeStart;
            var changes = [];
            while (i < xLength && j < yLength) {
                if (this.resultX[i] && this.resultY[j]) {
                    // No change
                    i++;
                    j++;
                }
                else {
                    xChangeStart = i;
                    yChangeStart = j;
                    while (i < xLength && !this.resultX[i]) {
                        i++;
                    }
                    while (j < yLength && !this.resultY[j]) {
                        j++;
                    }
                    changes.push(new diffChange_1.DiffChange(xChangeStart, i - xChangeStart, yChangeStart, j - yChangeStart));
                }
            }
            if (i < xLength) {
                changes.push(new diffChange_1.DiffChange(i, xLength - i, yLength, 0));
            }
            if (j < yLength) {
                changes.push(new diffChange_1.DiffChange(xLength, 0, j, yLength - j));
            }
            return changes;
        };
        LcsDiff2.prototype.forward = function (xStart, xStop, yStart, yStop) {
            var prev = this.forwardPrev, curr = this.forwardCurr, tmp, i, j;
            // First line
            prev[yStart] = this.ElementsAreEqual(xStart, yStart) ? 1 : 0;
            for (j = yStart + 1; j <= yStop; j++) {
                prev[j] = this.ElementsAreEqual(xStart, j) ? 1 : prev[j - 1];
            }
            for (i = xStart + 1; i <= xStop; i++) {
                // First column
                curr[yStart] = this.ElementsAreEqual(i, yStart) ? 1 : prev[yStart];
                for (j = yStart + 1; j <= yStop; j++) {
                    if (this.ElementsAreEqual(i, j)) {
                        curr[j] = prev[j - 1] + 1;
                    }
                    else {
                        curr[j] = prev[j] > curr[j - 1] ? prev[j] : curr[j - 1];
                    }
                }
                // Swap prev & curr
                tmp = curr;
                curr = prev;
                prev = tmp;
            }
            // Result is always in prev
            return prev;
        };
        LcsDiff2.prototype.backward = function (xStart, xStop, yStart, yStop) {
            var prev = this.backwardPrev, curr = this.backwardCurr, tmp, i, j;
            // Last line
            prev[yStop] = this.ElementsAreEqual(xStop, yStop) ? 1 : 0;
            for (j = yStop - 1; j >= yStart; j--) {
                prev[j] = this.ElementsAreEqual(xStop, j) ? 1 : prev[j + 1];
            }
            for (i = xStop - 1; i >= xStart; i--) {
                // Last column
                curr[yStop] = this.ElementsAreEqual(i, yStop) ? 1 : prev[yStop];
                for (j = yStop - 1; j >= yStart; j--) {
                    if (this.ElementsAreEqual(i, j)) {
                        curr[j] = prev[j + 1] + 1;
                    }
                    else {
                        curr[j] = prev[j] > curr[j + 1] ? prev[j] : curr[j + 1];
                    }
                }
                // Swap prev & curr
                tmp = curr;
                curr = prev;
                prev = tmp;
            }
            // Result is always in prev
            return prev;
        };
        LcsDiff2.prototype.findCut = function (xStart, xStop, yStart, yStop, middle) {
            var L1 = this.forward(xStart, middle, yStart, yStop);
            var L2 = this.backward(middle + 1, xStop, yStart, yStop);
            // First cut
            var max = L2[yStart], cut = yStart - 1;
            // Middle cut
            for (var j = yStart; j < yStop; j++) {
                if (L1[j] + L2[j + 1] > max) {
                    max = L1[j] + L2[j + 1];
                    cut = j;
                }
            }
            // Last cut
            if (L1[yStop] > max) {
                max = L1[yStop];
                cut = yStop;
            }
            return cut;
        };
        LcsDiff2.prototype.execute = function (xStart, xStop, yStart, yStop) {
            // Do some prefix trimming
            while (xStart <= xStop && yStart <= yStop && this.ElementsAreEqual(xStart, yStart)) {
                this.resultX[xStart] = true;
                xStart++;
                this.resultY[yStart] = true;
                yStart++;
            }
            // Do some suffix trimming
            while (xStart <= xStop && yStart <= yStop && this.ElementsAreEqual(xStop, yStop)) {
                this.resultX[xStop] = true;
                xStop--;
                this.resultY[yStop] = true;
                yStop--;
            }
            if (xStart > xStop || yStart > yStop) {
                return;
            }
            var found, i;
            if (xStart === xStop) {
                found = -1;
                for (i = yStart; i <= yStop; i++) {
                    if (this.ElementsAreEqual(xStart, i)) {
                        found = i;
                        break;
                    }
                }
                if (found >= 0) {
                    this.resultX[xStart] = true;
                    this.resultY[found] = true;
                }
            }
            else if (yStart === yStop) {
                found = -1;
                for (i = xStart; i <= xStop; i++) {
                    if (this.ElementsAreEqual(i, yStart)) {
                        found = i;
                        break;
                    }
                }
                if (found >= 0) {
                    this.resultX[found] = true;
                    this.resultY[yStart] = true;
                }
            }
            else {
                var middle = Math.floor((xStart + xStop) / 2);
                var cut = this.findCut(xStart, xStop, yStart, yStop, middle);
                if (yStart <= cut) {
                    this.execute(xStart, middle, yStart, cut);
                }
                if (cut + 1 <= yStop) {
                    this.execute(middle + 1, xStop, cut + 1, yStop);
                }
            }
        };
        return LcsDiff2;
    }());
    exports.LcsDiff2 = LcsDiff2;
});
//# sourceMappingURL=diff2.js.map