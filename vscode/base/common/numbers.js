/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/types"], function (require, exports, types) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function count(fromOrTo, toOrCallback, callback) {
        var from, to;
        if (types.isNumber(toOrCallback)) {
            from = fromOrTo;
            to = toOrCallback;
        }
        else {
            from = 0;
            to = fromOrTo;
            callback = toOrCallback;
        }
        var op = from <= to ? function (i) { return i + 1; } : function (i) { return i - 1; };
        var cmp = from <= to ? function (a, b) { return a < b; } : function (a, b) { return a > b; };
        for (var i = from; cmp(i, to); i = op(i)) {
            callback(i);
        }
    }
    exports.count = count;
    function countToArray(fromOrTo, to) {
        var result = [];
        var fn = function (i) { return result.push(i); };
        if (types.isUndefined(to)) {
            count(fromOrTo, fn);
        }
        else {
            count(fromOrTo, to, fn);
        }
        return result;
    }
    exports.countToArray = countToArray;
});
//# sourceMappingURL=numbers.js.map