/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/filters"], function (require, exports, filters_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var LineContext = (function () {
        function LineContext() {
        }
        return LineContext;
    }());
    exports.LineContext = LineContext;
    var CompletionModel = (function () {
        function CompletionModel(items, column, lineContext, snippetConfig) {
            this._snippetCompareFn = CompletionModel._compareCompletionItems;
            this._items = items;
            this._column = column;
            this._lineContext = lineContext;
            if (snippetConfig === 'top') {
                this._snippetCompareFn = CompletionModel._compareCompletionItemsSnippetsUp;
            }
            else if (snippetConfig === 'bottom') {
                this._snippetCompareFn = CompletionModel._compareCompletionItemsSnippetsDown;
            }
        }
        Object.defineProperty(CompletionModel.prototype, "lineContext", {
            get: function () {
                return this._lineContext;
            },
            set: function (value) {
                if (this._lineContext.leadingLineContent !== value.leadingLineContent
                    || this._lineContext.characterCountDelta !== value.characterCountDelta) {
                    this._lineContext = value;
                    this._filteredItems = undefined;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompletionModel.prototype, "items", {
            get: function () {
                this._ensureCachedState();
                return this._filteredItems;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompletionModel.prototype, "incomplete", {
            get: function () {
                this._ensureCachedState();
                return this._isIncomplete;
            },
            enumerable: true,
            configurable: true
        });
        CompletionModel.prototype.resolveIncompleteInfo = function () {
            var incomplete = [];
            var complete = [];
            for (var _i = 0, _a = this._items; _i < _a.length; _i++) {
                var item = _a[_i];
                if (!item.container.incomplete) {
                    complete.push(item);
                }
                else if (incomplete.indexOf(item.support) < 0) {
                    incomplete.push(item.support);
                }
            }
            return { incomplete: incomplete, complete: complete };
        };
        Object.defineProperty(CompletionModel.prototype, "stats", {
            get: function () {
                this._ensureCachedState();
                return this._stats;
            },
            enumerable: true,
            configurable: true
        });
        CompletionModel.prototype._ensureCachedState = function () {
            if (!this._filteredItems) {
                this._createCachedState();
            }
        };
        CompletionModel.prototype._createCachedState = function () {
            this._filteredItems = [];
            this._isIncomplete = false;
            this._stats = { suggestionCount: 0, snippetCount: 0, textCount: 0 };
            var _a = this._lineContext, leadingLineContent = _a.leadingLineContent, characterCountDelta = _a.characterCountDelta;
            var word = '';
            for (var i = 0; i < this._items.length; i++) {
                var item = this._items[i];
                var suggestion = item.suggestion, container = item.container;
                // collect those supports that signaled having
                // an incomplete result
                this._isIncomplete = this._isIncomplete || container.incomplete;
                // 'word' is that remainder of the current line that we
                // filter and score against. In theory each suggestion uses a
                // differnet word, but in practice not - that's why we cache
                var wordLen = suggestion.overwriteBefore + characterCountDelta - (item.position.column - this._column);
                if (word.length !== wordLen) {
                    word = wordLen === 0 ? '' : leadingLineContent.slice(-wordLen);
                }
                if (wordLen === 0) {
                    // when there is nothing to score against, don't
                    // event try to do. Use a const rank and rely on
                    // the fallback-sort using the initial sort order.
                    // use a score of `-100` because that is out of the
                    // bound of values `fuzzyScore` will return
                    item.score = -100;
                }
                else if (typeof suggestion.filterText === 'string') {
                    // when there is a `filterText` it must match the `word`.
                    // if it matches we check with the label to compute highlights
                    // and if that doesn't yield a result we have no highlights,
                    // despite having the match
                    var match = filters_1.fuzzyScore(word, suggestion.filterText, suggestion.overwriteBefore);
                    if (!match) {
                        continue;
                    }
                    item.score = match[0];
                    item.matches = [];
                    match = filters_1.fuzzyScore(word, suggestion.label, suggestion.overwriteBefore);
                    if (match) {
                        item.matches = match[1];
                    }
                }
                else {
                    // by default match `word` against the `label`
                    var match = filters_1.fuzzyScore(word, suggestion.label, suggestion.overwriteBefore);
                    if (match) {
                        item.score = match[0];
                        item.matches = match[1];
                    }
                    else {
                        continue;
                    }
                }
                item.idx = i;
                this._filteredItems.push(item);
                // update stats
                this._stats.suggestionCount++;
                switch (suggestion.type) {
                    case 'snippet':
                        this._stats.snippetCount++;
                        break;
                    case 'text':
                        this._stats.textCount++;
                        break;
                }
            }
            this._filteredItems.sort(this._snippetCompareFn);
        };
        CompletionModel._compareCompletionItems = function (a, b) {
            if (a.score > b.score) {
                return -1;
            }
            else if (a.score < b.score) {
                return 1;
            }
            else if (a.idx < b.idx) {
                return -1;
            }
            else if (a.idx > b.idx) {
                return 1;
            }
            else {
                return 0;
            }
        };
        CompletionModel._compareCompletionItemsSnippetsDown = function (a, b) {
            if (a.suggestion.type !== b.suggestion.type) {
                if (a.suggestion.type === 'snippet') {
                    return 1;
                }
                else if (b.suggestion.type === 'snippet') {
                    return -1;
                }
            }
            return CompletionModel._compareCompletionItems(a, b);
        };
        CompletionModel._compareCompletionItemsSnippetsUp = function (a, b) {
            if (a.suggestion.type !== b.suggestion.type) {
                if (a.suggestion.type === 'snippet') {
                    return -1;
                }
                else if (b.suggestion.type === 'snippet') {
                    return 1;
                }
            }
            return CompletionModel._compareCompletionItems(a, b);
        };
        return CompletionModel;
    }());
    exports.CompletionModel = CompletionModel;
});
//# sourceMappingURL=completionModel.js.map