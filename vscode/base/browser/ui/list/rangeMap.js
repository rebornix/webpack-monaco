/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Returns the intersection between two ranges as a range itself.
     * Returns `null` if the intersection is empty.
     */
    function intersect(one, other) {
        if (one.start >= other.end || other.start >= one.end) {
            return null;
        }
        var start = Math.max(one.start, other.start);
        var end = Math.min(one.end, other.end);
        if (end - start <= 0) {
            return null;
        }
        return { start: start, end: end };
    }
    exports.intersect = intersect;
    function isEmpty(range) {
        return range.end - range.start <= 0;
    }
    exports.isEmpty = isEmpty;
    function relativeComplement(one, other) {
        var result = [];
        var first = { start: one.start, end: Math.min(other.start, one.end) };
        var second = { start: Math.max(other.end, one.start), end: one.end };
        if (!isEmpty(first)) {
            result.push(first);
        }
        if (!isEmpty(second)) {
            result.push(second);
        }
        return result;
    }
    exports.relativeComplement = relativeComplement;
    function each(range, fn) {
        for (var i = range.start; i < range.end; i++) {
            fn(i);
        }
    }
    exports.each = each;
    /**
     * Returns the intersection between a ranged group and a range.
     * Returns `[]` if the intersection is empty.
     */
    function groupIntersect(range, groups) {
        var result = [];
        for (var _i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
            var r = groups_1[_i];
            if (range.start >= r.range.end) {
                continue;
            }
            if (range.end < r.range.start) {
                break;
            }
            var intersection = intersect(range, r.range);
            if (!intersection) {
                continue;
            }
            result.push({
                range: intersection,
                size: r.size
            });
        }
        return result;
    }
    exports.groupIntersect = groupIntersect;
    /**
     * Shifts a range by that `much`.
     */
    function shift(_a, much) {
        var start = _a.start, end = _a.end;
        return { start: start + much, end: end + much };
    }
    /**
     * Consolidates a collection of ranged groups.
     *
     * Consolidation is the process of merging consecutive ranged groups
     * that share the same `size`.
     */
    function consolidate(groups) {
        var result = [];
        var previousGroup = null;
        for (var _i = 0, groups_2 = groups; _i < groups_2.length; _i++) {
            var group = groups_2[_i];
            var start = group.range.start;
            var end = group.range.end;
            var size = group.size;
            if (previousGroup && size === previousGroup.size) {
                previousGroup.range.end = end;
                continue;
            }
            previousGroup = { range: { start: start, end: end }, size: size };
            result.push(previousGroup);
        }
        return result;
    }
    exports.consolidate = consolidate;
    /**
     * Concatenates several collections of ranged groups into a single
     * collection.
     */
    function concat() {
        var groups = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            groups[_i] = arguments[_i];
        }
        return consolidate(groups.reduce(function (r, g) { return r.concat(g); }, []));
    }
    var RangeMap = (function () {
        function RangeMap() {
            this.groups = [];
            this._size = 0;
        }
        RangeMap.prototype.splice = function (index, deleteCount) {
            var items = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                items[_i - 2] = arguments[_i];
            }
            var diff = items.length - deleteCount;
            var before = groupIntersect({ start: 0, end: index }, this.groups);
            var after = groupIntersect({ start: index + deleteCount, end: Number.POSITIVE_INFINITY }, this.groups)
                .map(function (g) { return ({ range: shift(g.range, diff), size: g.size }); });
            var middle = items.map(function (item, i) { return ({
                range: { start: index + i, end: index + i + 1 },
                size: item.size
            }); });
            this.groups = concat(before, middle, after);
            this._size = this.groups.reduce(function (t, g) { return t + (g.size * (g.range.end - g.range.start)); }, 0);
        };
        Object.defineProperty(RangeMap.prototype, "count", {
            /**
             * Returns the number of items in the range map.
             */
            get: function () {
                var len = this.groups.length;
                if (!len) {
                    return 0;
                }
                return this.groups[len - 1].range.end;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RangeMap.prototype, "size", {
            /**
             * Returns the sum of the sizes of all items in the range map.
             */
            get: function () {
                return this._size;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns the index of the item at the given position.
         */
        RangeMap.prototype.indexAt = function (position) {
            if (position < 0) {
                return -1;
            }
            var index = 0;
            var size = 0;
            for (var _i = 0, _a = this.groups; _i < _a.length; _i++) {
                var group = _a[_i];
                var count = group.range.end - group.range.start;
                var newSize = size + (count * group.size);
                if (position < newSize) {
                    return index + Math.floor((position - size) / group.size);
                }
                index += count;
                size = newSize;
            }
            return index;
        };
        /**
         * Returns the index of the item right after the item at the
         * index of the given position.
         */
        RangeMap.prototype.indexAfter = function (position) {
            return Math.min(this.indexAt(position) + 1, this.count);
        };
        /**
         * Returns the start position of the item at the given index.
         */
        RangeMap.prototype.positionAt = function (index) {
            if (index < 0) {
                return -1;
            }
            var position = 0;
            var count = 0;
            for (var _i = 0, _a = this.groups; _i < _a.length; _i++) {
                var group = _a[_i];
                var groupCount = group.range.end - group.range.start;
                var newCount = count + groupCount;
                if (index < newCount) {
                    return position + ((index - count) * group.size);
                }
                position += groupCount * group.size;
                count = newCount;
            }
            return -1;
        };
        RangeMap.prototype.dispose = function () {
            this.groups = null;
        };
        return RangeMap;
    }());
    exports.RangeMap = RangeMap;
});
//# sourceMappingURL=rangeMap.js.map