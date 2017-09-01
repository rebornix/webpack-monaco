define(["require", "exports", "vs/base/common/errors", "vs/base/common/arrays", "vs/base/common/async", "vs/base/common/event", "vs/base/common/lifecycle", "vs/base/common/winjs.base", "vs/editor/common/modes", "vs/editor/common/core/position", "./suggest", "./completionModel", "vs/editor/common/controller/cursorEvents"], function (require, exports, errors_1, arrays_1, async_1, event_1, lifecycle_1, winjs_base_1, modes_1, position_1, suggest_1, completionModel_1, cursorEvents_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var LineContext = (function () {
        function LineContext(model, position, auto) {
            this.leadingLineContent = model.getLineContent(position.lineNumber).substr(0, position.column - 1);
            this.leadingWord = model.getWordUntilPosition(position);
            this.lineNumber = position.lineNumber;
            this.column = position.column;
            this.auto = auto;
        }
        LineContext.shouldAutoTrigger = function (editor) {
            var model = editor.getModel();
            if (!model) {
                return false;
            }
            var pos = editor.getPosition();
            model.tokenizeIfCheap(pos.lineNumber);
            var word = model.getWordAtPosition(pos);
            if (!word) {
                return false;
            }
            if (word.endColumn !== pos.column) {
                return false;
            }
            if (!isNaN(Number(word.word))) {
                return false;
            }
            return true;
        };
        LineContext.isInEditableRange = function (editor) {
            var model = editor.getModel();
            var position = editor.getPosition();
            if (model.hasEditableRange()) {
                var editableRange = model.getEditableRange();
                if (!editableRange.containsPosition(position)) {
                    return false;
                }
            }
            return true;
        };
        return LineContext;
    }());
    exports.LineContext = LineContext;
    var State;
    (function (State) {
        State[State["Idle"] = 0] = "Idle";
        State[State["Manual"] = 1] = "Manual";
        State[State["Auto"] = 2] = "Auto";
    })(State = exports.State || (exports.State = {}));
    var SuggestModel = (function () {
        function SuggestModel(editor) {
            var _this = this;
            this.editor = editor;
            this.toDispose = [];
            this.triggerRefilter = new async_1.TimeoutTimer();
            this._onDidCancel = new event_1.Emitter();
            this._onDidTrigger = new event_1.Emitter();
            this._onDidSuggest = new event_1.Emitter();
            this._state = 0 /* Idle */;
            this.triggerAutoSuggestPromise = null;
            this.requestPromise = null;
            this.completionModel = null;
            this.context = null;
            this.currentPosition = editor.getPosition() || new position_1.Position(1, 1);
            // wire up various listeners
            this.toDispose.push(this.editor.onDidChangeModel(function () {
                _this.updateTriggerCharacters();
                _this.cancel();
            }));
            this.toDispose.push(editor.onDidChangeModelLanguage(function () {
                _this.updateTriggerCharacters();
                _this.cancel();
            }));
            this.toDispose.push(this.editor.onDidChangeConfiguration(function () {
                _this.updateTriggerCharacters();
                _this.updateQuickSuggest();
            }));
            this.toDispose.push(modes_1.SuggestRegistry.onDidChange(function () {
                _this.updateTriggerCharacters();
                _this.updateActiveSuggestSession();
            }));
            this.toDispose.push(this.editor.onDidChangeCursorSelection(function (e) {
                _this.onCursorChange(e);
            }));
            this.updateTriggerCharacters();
            this.updateQuickSuggest();
        }
        Object.defineProperty(SuggestModel.prototype, "onDidCancel", {
            get: function () { return this._onDidCancel.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SuggestModel.prototype, "onDidTrigger", {
            get: function () { return this._onDidTrigger.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SuggestModel.prototype, "onDidSuggest", {
            get: function () { return this._onDidSuggest.event; },
            enumerable: true,
            configurable: true
        });
        SuggestModel.prototype.dispose = function () {
            lifecycle_1.dispose([this._onDidCancel, this._onDidSuggest, this._onDidTrigger, this.triggerCharacterListener, this.triggerRefilter]);
            this.toDispose = lifecycle_1.dispose(this.toDispose);
            this.cancel();
        };
        // --- handle configuration & precondition changes
        SuggestModel.prototype.updateQuickSuggest = function () {
            this.quickSuggestDelay = this.editor.getConfiguration().contribInfo.quickSuggestionsDelay;
            if (isNaN(this.quickSuggestDelay) || (!this.quickSuggestDelay && this.quickSuggestDelay !== 0) || this.quickSuggestDelay < 0) {
                this.quickSuggestDelay = 10;
            }
        };
        SuggestModel.prototype.updateTriggerCharacters = function () {
            var _this = this;
            lifecycle_1.dispose(this.triggerCharacterListener);
            if (this.editor.getConfiguration().readOnly
                || !this.editor.getModel()
                || !this.editor.getConfiguration().contribInfo.suggestOnTriggerCharacters) {
                return;
            }
            var supportsByTriggerCharacter = Object.create(null);
            for (var _i = 0, _a = modes_1.SuggestRegistry.all(this.editor.getModel()); _i < _a.length; _i++) {
                var support = _a[_i];
                if (arrays_1.isFalsyOrEmpty(support.triggerCharacters)) {
                    continue;
                }
                for (var _b = 0, _c = support.triggerCharacters; _b < _c.length; _b++) {
                    var ch = _c[_b];
                    var array = supportsByTriggerCharacter[ch];
                    if (!array) {
                        supportsByTriggerCharacter[ch] = [support];
                    }
                    else {
                        array.push(support);
                    }
                }
            }
            this.triggerCharacterListener = this.editor.onDidType(function (text) {
                var lastChar = text.charAt(text.length - 1);
                var supports = supportsByTriggerCharacter[lastChar];
                if (supports) {
                    // keep existing items that where not computed by the
                    // supports/providers that want to trigger now
                    var items = [];
                    if (_this.completionModel) {
                        for (var _i = 0, _a = _this.completionModel.items; _i < _a.length; _i++) {
                            var item = _a[_i];
                            if (supports.indexOf(item.support) < 0) {
                                items.push(item);
                            }
                        }
                    }
                    _this.trigger(true, Boolean(_this.completionModel), supports, items);
                }
            });
        };
        Object.defineProperty(SuggestModel.prototype, "state", {
            // --- trigger/retrigger/cancel suggest
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        SuggestModel.prototype.cancel = function (retrigger) {
            if (retrigger === void 0) { retrigger = false; }
            if (this.triggerAutoSuggestPromise) {
                this.triggerAutoSuggestPromise.cancel();
                this.triggerAutoSuggestPromise = null;
            }
            if (this.requestPromise) {
                this.requestPromise.cancel();
                this.requestPromise = null;
            }
            this._state = 0 /* Idle */;
            this.completionModel = null;
            this.context = null;
            this._onDidCancel.fire({ retrigger: retrigger });
        };
        SuggestModel.prototype.updateActiveSuggestSession = function () {
            if (this._state !== 0 /* Idle */) {
                if (!modes_1.SuggestRegistry.has(this.editor.getModel())) {
                    this.cancel();
                }
                else {
                    this.trigger(this._state === 2 /* Auto */, true);
                }
            }
        };
        SuggestModel.prototype.onCursorChange = function (e) {
            var _this = this;
            var prevPosition = this.currentPosition;
            this.currentPosition = this.editor.getPosition();
            if (!e.selection.isEmpty()
                || e.source !== 'keyboard'
                || e.reason !== cursorEvents_1.CursorChangeReason.NotSet) {
                if (this._state === 0 /* Idle */) {
                    // Early exit if nothing needs to be done!
                    // Leave some form of early exit check here if you wish to continue being a cursor position change listener ;)
                    return;
                }
                this.cancel();
                return;
            }
            if (!modes_1.SuggestRegistry.has(this.editor.getModel())) {
                return;
            }
            var model = this.editor.getModel();
            if (!model) {
                return;
            }
            if (this._state === 0 /* Idle */) {
                // trigger 24x7 IntelliSense when idle, enabled, when cursor
                // moved RIGHT, and when at a good position
                if (this.editor.getConfiguration().contribInfo.quickSuggestions !== false
                    && prevPosition.isBefore(this.currentPosition)) {
                    this.cancel();
                    if (LineContext.shouldAutoTrigger(this.editor)) {
                        this.triggerAutoSuggestPromise = winjs_base_1.TPromise.timeout(this.quickSuggestDelay);
                        this.triggerAutoSuggestPromise.then(function () {
                            var model = _this.editor.getModel();
                            var pos = _this.editor.getPosition();
                            if (!model) {
                                return;
                            }
                            // validate enabled now
                            var quickSuggestions = _this.editor.getConfiguration().contribInfo.quickSuggestions;
                            if (quickSuggestions === false) {
                                return;
                            }
                            else if (quickSuggestions === true) {
                                // all good
                            }
                            else {
                                model.tokenizeIfCheap(pos.lineNumber);
                                var tokenType = model
                                    .getLineTokens(pos.lineNumber)
                                    .findTokenAtOffset(pos.column - 1).tokenType;
                                var inValidScope = quickSuggestions.other && tokenType === 0 /* Other */
                                    || quickSuggestions.comments && tokenType === 1 /* Comment */
                                    || quickSuggestions.strings && tokenType === 2 /* String */;
                                if (!inValidScope) {
                                    return;
                                }
                            }
                            _this.triggerAutoSuggestPromise = null;
                            _this.trigger(true);
                        });
                    }
                }
            }
            else {
                // refine active suggestion
                this.triggerRefilter.cancelAndSet(function () {
                    var position = _this.editor.getPosition();
                    var ctx = new LineContext(model, position, _this._state === 2 /* Auto */);
                    _this.onNewContext(ctx);
                }, 25);
            }
        };
        SuggestModel.prototype.trigger = function (auto, retrigger, onlyFrom, existingItems) {
            var _this = this;
            if (retrigger === void 0) { retrigger = false; }
            var model = this.editor.getModel();
            if (!model) {
                return;
            }
            var ctx = new LineContext(model, this.editor.getPosition(), auto);
            if (!LineContext.isInEditableRange(this.editor)) {
                return;
            }
            // Cancel previous requests, change state & update UI
            this.cancel(retrigger);
            this._state = auto ? 2 /* Auto */ : 1 /* Manual */;
            this._onDidTrigger.fire({ auto: auto });
            // Capture context when request was sent
            this.context = ctx;
            this.requestPromise = suggest_1.provideSuggestionItems(model, this.editor.getPosition(), this.editor.getConfiguration().contribInfo.snippetSuggestions, onlyFrom).then(function (items) {
                _this.requestPromise = null;
                if (_this._state === 0 /* Idle */) {
                    return;
                }
                var model = _this.editor.getModel();
                if (!model) {
                    return;
                }
                if (!arrays_1.isFalsyOrEmpty(existingItems)) {
                    var cmpFn = suggest_1.getSuggestionComparator(_this.editor.getConfiguration().contribInfo.snippetSuggestions);
                    items = items.concat(existingItems).sort(cmpFn);
                }
                var ctx = new LineContext(model, _this.editor.getPosition(), auto);
                _this.completionModel = new completionModel_1.CompletionModel(items, _this.context.column, {
                    leadingLineContent: ctx.leadingLineContent,
                    characterCountDelta: _this.context ? ctx.column - _this.context.column : 0
                }, _this.editor.getConfiguration().contribInfo.snippetSuggestions);
                _this.onNewContext(ctx);
            }).then(null, errors_1.onUnexpectedError);
        };
        SuggestModel.prototype.onNewContext = function (ctx) {
            if (!this.context) {
                // happens when 24x7 IntelliSense is enabled and still in its delay
                return;
            }
            if (ctx.lineNumber !== this.context.lineNumber) {
                // e.g. happens when pressing Enter while IntelliSense is computed
                this.cancel();
                return;
            }
            if (ctx.column < this.context.column) {
                // typed -> moved cursor LEFT -> retrigger if still on a word
                if (ctx.leadingWord.word) {
                    this.trigger(this.context.auto, true);
                }
                else {
                    this.cancel();
                }
                return;
            }
            if (!this.completionModel) {
                // happens when IntelliSense is not yet computed
                return;
            }
            if (ctx.column > this.context.column && this.completionModel.incomplete && ctx.leadingWord.word.length !== 0) {
                // typed -> moved cursor RIGHT & incomple model & still on a word -> retrigger
                var _a = this.completionModel.resolveIncompleteInfo(), complete = _a.complete, incomplete = _a.incomplete;
                this.trigger(this._state === 2 /* Auto */, true, incomplete, complete);
            }
            else {
                // typed -> moved cursor RIGHT -> update UI
                var oldLineContext = this.completionModel.lineContext;
                var isFrozen = false;
                this.completionModel.lineContext = {
                    leadingLineContent: ctx.leadingLineContent,
                    characterCountDelta: ctx.column - this.context.column
                };
                if (this.completionModel.items.length === 0) {
                    if (LineContext.shouldAutoTrigger(this.editor) && this.context.leadingWord.endColumn < ctx.leadingWord.startColumn) {
                        // retrigger when heading into a new word
                        this.trigger(this.context.auto, true);
                        return;
                    }
                    if (!this.context.auto) {
                        // freeze when IntelliSense was manually requested
                        this.completionModel.lineContext = oldLineContext;
                        isFrozen = this.completionModel.items.length > 0;
                        if (isFrozen && ctx.leadingWord.word.length === 0) {
                            // there were results before but now there aren't
                            // and also we are not on a word anymore -> cancel
                            this.cancel();
                            return;
                        }
                    }
                    else {
                        // nothing left
                        this.cancel();
                        return;
                    }
                }
                this._onDidSuggest.fire({
                    completionModel: this.completionModel,
                    auto: this.context.auto,
                    isFrozen: isFrozen,
                });
            }
        };
        return SuggestModel;
    }());
    exports.SuggestModel = SuggestModel;
});
//# sourceMappingURL=suggestModel.js.map