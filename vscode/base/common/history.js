/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/iterator"], function (require, exports, iterator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HistoryNavigator = (function () {
        function HistoryNavigator(history, limit) {
            if (history === void 0) { history = []; }
            if (limit === void 0) { limit = 10; }
            this._initialize(history);
            this._limit = limit;
            this._onChange();
        }
        HistoryNavigator.prototype.getHistory = function () {
            return this._elements;
        };
        HistoryNavigator.prototype.add = function (t) {
            this._history.delete(t);
            this._history.add(t);
            this._onChange();
        };
        HistoryNavigator.prototype.addIfNotPresent = function (t) {
            if (!this._history.has(t)) {
                this.add(t);
            }
        };
        HistoryNavigator.prototype.next = function () {
            if (this._navigator.next()) {
                return this._navigator.current();
            }
            this.last();
            return null;
        };
        HistoryNavigator.prototype.previous = function () {
            if (this._navigator.previous()) {
                return this._navigator.current();
            }
            this.first();
            return null;
        };
        HistoryNavigator.prototype.current = function () {
            return this._navigator.current();
        };
        HistoryNavigator.prototype.parent = function () {
            return null;
        };
        HistoryNavigator.prototype.first = function () {
            return this._navigator.first();
        };
        HistoryNavigator.prototype.last = function () {
            return this._navigator.last();
        };
        HistoryNavigator.prototype._onChange = function () {
            this._reduceToLimit();
            this._navigator = new iterator_1.ArrayNavigator(this._elements);
            this._navigator.last();
        };
        HistoryNavigator.prototype._reduceToLimit = function () {
            var data = this._elements;
            if (data.length > this._limit) {
                this._initialize(data.slice(data.length - this._limit));
            }
        };
        HistoryNavigator.prototype._initialize = function (history) {
            this._history = new Set();
            for (var _i = 0, history_1 = history; _i < history_1.length; _i++) {
                var entry = history_1[_i];
                this._history.add(entry);
            }
        };
        Object.defineProperty(HistoryNavigator.prototype, "_elements", {
            get: function () {
                var elements = [];
                this._history.forEach(function (e) { return elements.push(e); });
                return elements;
            },
            enumerable: true,
            configurable: true
        });
        return HistoryNavigator;
    }());
    exports.HistoryNavigator = HistoryNavigator;
});
//# sourceMappingURL=history.js.map