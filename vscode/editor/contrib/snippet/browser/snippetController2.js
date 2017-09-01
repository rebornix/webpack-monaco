/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/platform/contextkey/common/contextkey", "vs/editor/common/editorCommonExtensions", "vs/base/common/lifecycle", "./snippetSession", "vs/editor/common/editorContextKeys", "vs/editor/contrib/suggest/browser/suggest", "vs/editor/common/core/selection"], function (require, exports, contextkey_1, editorCommonExtensions_1, lifecycle_1, snippetSession_1, editorContextKeys_1, suggest_1, selection_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var SnippetController2 = (function () {
        function SnippetController2(_editor, contextKeyService) {
            this._editor = _editor;
            this._snippetListener = [];
            this._inSnippet = SnippetController2_1.InSnippetMode.bindTo(contextKeyService);
            this._hasNextTabstop = SnippetController2_1.HasNextTabstop.bindTo(contextKeyService);
            this._hasPrevTabstop = SnippetController2_1.HasPrevTabstop.bindTo(contextKeyService);
        }
        SnippetController2_1 = SnippetController2;
        SnippetController2.get = function (editor) {
            return editor.getContribution('snippetController2');
        };
        SnippetController2.prototype.dispose = function () {
            this._inSnippet.reset();
            this._hasPrevTabstop.reset();
            this._hasNextTabstop.reset();
            lifecycle_1.dispose(this._session);
        };
        SnippetController2.prototype.getId = function () {
            return 'snippetController2';
        };
        SnippetController2.prototype.insert = function (template, overwriteBefore, overwriteAfter, undoStopBefore, undoStopAfter) {
            var _this = this;
            if (overwriteBefore === void 0) { overwriteBefore = 0; }
            if (overwriteAfter === void 0) { overwriteAfter = 0; }
            if (undoStopBefore === void 0) { undoStopBefore = true; }
            if (undoStopAfter === void 0) { undoStopAfter = true; }
            // don't listen while inserting the snippet
            // as that is the inflight state causing cancelation
            this._snippetListener = lifecycle_1.dispose(this._snippetListener);
            if (undoStopBefore) {
                this._editor.getModel().pushStackElement();
            }
            if (!this._session) {
                this._modelVersionId = this._editor.getModel().getAlternativeVersionId();
                this._session = new snippetSession_1.SnippetSession(this._editor, template, overwriteBefore, overwriteAfter);
                this._session.insert();
            }
            else {
                this._session.merge(template, overwriteBefore, overwriteAfter);
            }
            if (undoStopAfter) {
                this._editor.getModel().pushStackElement();
            }
            this._updateState();
            this._snippetListener = [
                this._editor.onDidChangeModel(function () { return _this.cancel(); }),
                this._editor.onDidChangeCursorSelection(function () { return _this._updateState(); })
            ];
        };
        SnippetController2.prototype._updateState = function () {
            if (!this._session) {
                // canceled in the meanwhile
                return;
            }
            if (this._modelVersionId === this._editor.getModel().getAlternativeVersionId()) {
                // undo until the 'before' state happened
                // and makes use cancel snippet mode
                return this.cancel();
            }
            if (!this._session.hasPlaceholder) {
                // don't listen for selection changes and don't
                // update context keys when the snippet is plain text
                return this.cancel();
            }
            if (this._session.isAtLastPlaceholder || !this._session.isSelectionWithinPlaceholders()) {
                return this.cancel();
            }
            this._inSnippet.set(true);
            this._hasPrevTabstop.set(!this._session.isAtFirstPlaceholder);
            this._hasNextTabstop.set(!this._session.isAtLastPlaceholder);
            this._handleChoice();
        };
        SnippetController2.prototype._handleChoice = function () {
            var choice = this._session.choice;
            if (!choice) {
                this._currentChoice = undefined;
                return;
            }
            if (this._currentChoice !== choice) {
                this._currentChoice = choice;
                this._editor.setSelections(this._editor.getSelections()
                    .map(function (s) { return selection_1.Selection.fromPositions(s.getStartPosition()); }));
                var first_1 = choice.options[0];
                suggest_1.showSimpleSuggestions(this._editor, choice.options.map(function (option, i) {
                    // let before = choice.options.slice(0, i);
                    // let after = choice.options.slice(i);
                    return {
                        type: 'value',
                        label: option.value,
                        insertText: option.value,
                        // insertText: `\${1|${after.concat(before).join(',')}|}$0`,
                        // snippetType: 'textmate',
                        sortText: String(i),
                        overwriteAfter: first_1.value.length
                    };
                }));
            }
        };
        SnippetController2.prototype.finish = function () {
            while (this._inSnippet.get()) {
                this.next();
            }
        };
        SnippetController2.prototype.cancel = function () {
            this._inSnippet.reset();
            this._hasPrevTabstop.reset();
            this._hasNextTabstop.reset();
            lifecycle_1.dispose(this._snippetListener);
            lifecycle_1.dispose(this._session);
            this._session = undefined;
            this._modelVersionId = -1;
        };
        SnippetController2.prototype.prev = function () {
            this._session.prev();
            this._updateState();
        };
        SnippetController2.prototype.next = function () {
            this._session.next();
            this._updateState();
        };
        SnippetController2.InSnippetMode = new contextkey_1.RawContextKey('inSnippetMode', false);
        SnippetController2.HasNextTabstop = new contextkey_1.RawContextKey('hasNextTabstop', false);
        SnippetController2.HasPrevTabstop = new contextkey_1.RawContextKey('hasPrevTabstop', false);
        SnippetController2 = SnippetController2_1 = __decorate([
            editorCommonExtensions_1.commonEditorContribution,
            __param(1, contextkey_1.IContextKeyService)
        ], SnippetController2);
        return SnippetController2;
        var SnippetController2_1;
    }());
    exports.SnippetController2 = SnippetController2;
    var CommandCtor = editorCommonExtensions_1.EditorCommand.bindToContribution(SnippetController2.get);
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand(new CommandCtor({
        id: 'jumpToNextSnippetPlaceholder',
        precondition: contextkey_1.ContextKeyExpr.and(SnippetController2.InSnippetMode, SnippetController2.HasNextTabstop),
        handler: function (ctrl) { return ctrl.next(); },
        kbOpts: {
            weight: editorCommonExtensions_1.CommonEditorRegistry.commandWeight(30),
            kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
            primary: 2 /* Tab */
        }
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand(new CommandCtor({
        id: 'jumpToPrevSnippetPlaceholder',
        precondition: contextkey_1.ContextKeyExpr.and(SnippetController2.InSnippetMode, SnippetController2.HasPrevTabstop),
        handler: function (ctrl) { return ctrl.prev(); },
        kbOpts: {
            weight: editorCommonExtensions_1.CommonEditorRegistry.commandWeight(30),
            kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
            primary: 1024 /* Shift */ | 2 /* Tab */
        }
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand(new CommandCtor({
        id: 'leaveSnippet',
        precondition: SnippetController2.InSnippetMode,
        handler: function (ctrl) { return ctrl.cancel(); },
        kbOpts: {
            weight: editorCommonExtensions_1.CommonEditorRegistry.commandWeight(30),
            kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
            primary: 9 /* Escape */,
            secondary: [1024 /* Shift */ | 9 /* Escape */]
        }
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand(new CommandCtor({
        id: 'acceptSnippet',
        precondition: SnippetController2.InSnippetMode,
        handler: function (ctrl) { return ctrl.finish(); },
    }));
});
//# sourceMappingURL=snippetController2.js.map