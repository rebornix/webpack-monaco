/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MAX_HISTORY_ENTRIES = 50;
    /**
     * The repl history has the following characteristics:
     * - the history is stored in local storage up to N items
     * - every time a expression is evaluated, it is being added to the history
     * - when starting to navigate in history, the current expression is remembered to be able to go back
     * - when navigating in history and making changes to any expression, these changes are remembered until a expression is evaluated
     * - the navigation state is not remembered so that the user always ends up at the end of the history stack when evaluating a expression
     */
    var ReplHistory = (function () {
        function ReplHistory(history) {
            this.history = history;
            this.historyPointer = this.history.length;
            this.currentExpressionStoredMarkers = false;
            this.historyOverwrites = new Map();
        }
        ReplHistory.prototype.next = function () {
            return this.navigate(false);
        };
        ReplHistory.prototype.previous = function () {
            return this.navigate(true);
        };
        ReplHistory.prototype.navigate = function (previous) {
            // validate new pointer
            var newPointer = -1;
            if (previous && this.historyPointer > 0 && this.history.length > this.historyPointer - 1) {
                newPointer = this.historyPointer - 1;
            }
            else if (!previous && this.history.length > this.historyPointer + 1) {
                newPointer = this.historyPointer + 1;
            }
            if (newPointer >= 0) {
                // remember pointer for next navigation
                this.historyPointer = newPointer;
                // check for overwrite
                if (this.historyOverwrites.has(newPointer.toString())) {
                    return this.historyOverwrites.get(newPointer.toString());
                }
                return this.history[newPointer];
            }
            return null;
        };
        ReplHistory.prototype.remember = function (expression, fromPrevious) {
            var previousPointer;
            // this method is called after the user has navigated in the history. Therefor we need to
            // restore the value of the pointer from the point when the user started the navigation.
            if (fromPrevious) {
                previousPointer = this.historyPointer + 1;
            }
            else {
                previousPointer = this.historyPointer - 1;
            }
            // when the user starts to navigate in history, add the current expression to the history
            // once so that the user can always navigate back to it and does not loose its data.
            if (previousPointer === this.history.length && !this.currentExpressionStoredMarkers) {
                this.history.push(expression);
                this.currentExpressionStoredMarkers = true;
            }
            else {
                this.historyOverwrites.set(previousPointer.toString(), expression);
            }
        };
        ReplHistory.prototype.evaluated = function (expression) {
            // clear current expression that was stored previously to support history navigation now on evaluate
            if (this.currentExpressionStoredMarkers) {
                this.history.pop();
            }
            // keep in local history if expression provided and not equal to previous expression stored in history
            if (expression && (this.history.length === 0 || this.history[this.history.length - 1] !== expression)) {
                this.history.push(expression);
            }
            // advance History Pointer to the end
            this.historyPointer = this.history.length;
            // reset marker
            this.currentExpressionStoredMarkers = false;
            // reset overwrites
            this.historyOverwrites.clear();
        };
        ReplHistory.prototype.save = function () {
            // remove current expression from history since it was not evaluated
            if (this.currentExpressionStoredMarkers) {
                this.history.pop();
            }
            if (this.history.length > MAX_HISTORY_ENTRIES) {
                this.history = this.history.splice(this.history.length - MAX_HISTORY_ENTRIES, MAX_HISTORY_ENTRIES);
            }
            return this.history;
        };
        return ReplHistory;
    }());
    exports.ReplHistory = ReplHistory;
});
//# sourceMappingURL=replHistory.js.map