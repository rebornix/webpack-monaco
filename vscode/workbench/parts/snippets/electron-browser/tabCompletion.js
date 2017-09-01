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
define(["require", "exports", "vs/nls", "vs/platform/contextkey/common/contextkey", "vs/platform/keybinding/common/keybindingsRegistry", "vs/workbench/parts/snippets/electron-browser/snippetsService", "vs/platform/registry/common/platform", "vs/base/common/strings", "vs/base/common/lifecycle", "vs/editor/common/editorCommonExtensions", "vs/editor/contrib/snippet/browser/snippetController2", "vs/editor/contrib/suggest/browser/suggest", "vs/platform/configuration/common/configurationRegistry", "vs/editor/common/editorContextKeys"], function (require, exports, nls_1, contextkey_1, keybindingsRegistry_1, snippetsService_1, platform_1, strings_1, lifecycle_1, editorCommonExtensions_1, snippetController2_1, suggest_1, configurationRegistry_1, editorContextKeys_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var TabCompletionController = (function () {
        function TabCompletionController(editor, contextKeyService, snippetService) {
            var _this = this;
            this._dispoables = [];
            this._snippets = [];
            this._editor = editor;
            this._snippetController = snippetController2_1.SnippetController2.get(editor);
            var hasSnippets = TabCompletionController_1.ContextKey.bindTo(contextKeyService);
            this._dispoables.push(editor.onDidChangeCursorSelection(function (e) {
                _this._snippets.length = 0;
                var selectFn;
                if (e.selection.isEmpty()) {
                    // empty selection -> real text (no whitespace) left of cursor
                    var prefix_1 = snippetsService_1.getNonWhitespacePrefix(editor.getModel(), editor.getPosition());
                    selectFn = prefix_1 && (function (snippet) { return strings_1.endsWith(prefix_1, snippet.prefix); });
                }
                else {
                    // actual selection -> snippet must be a full match
                    var selected_1 = editor.getModel().getValueInRange(e.selection);
                    selectFn = function (snippet) { return selected_1 === snippet.prefix; };
                }
                if (selectFn) {
                    snippetService.visitSnippets(editor.getModel().getLanguageIdentifier().id, function (s) {
                        if (selectFn(s)) {
                            _this._snippets.push(s);
                        }
                        return true;
                    });
                }
                hasSnippets.set(_this._snippets.length > 0);
            }));
        }
        TabCompletionController_1 = TabCompletionController;
        TabCompletionController.get = function (editor) {
            return editor.getContribution(TabCompletionController_1.ID);
        };
        TabCompletionController.prototype.getId = function () {
            return TabCompletionController_1.ID;
        };
        TabCompletionController.prototype.dispose = function () {
            lifecycle_1.dispose(this._dispoables);
        };
        TabCompletionController.prototype.performSnippetCompletions = function () {
            if (this._snippets.length === 1) {
                // one -> just insert
                var snippet = this._snippets[0];
                this._snippetController.insert(snippet.codeSnippet, snippet.prefix.length, 0);
            }
            else if (this._snippets.length > 1) {
                // two or more -> show IntelliSense box
                suggest_1.showSimpleSuggestions(this._editor, this._snippets.map(function (snippet) { return new snippetsService_1.SnippetSuggestion(snippet, snippet.prefix.length); }));
            }
        };
        TabCompletionController.ID = 'editor.tabCompletionController';
        TabCompletionController.ContextKey = new contextkey_1.RawContextKey('hasSnippetCompletions', undefined);
        TabCompletionController = TabCompletionController_1 = __decorate([
            editorCommonExtensions_1.commonEditorContribution,
            __param(1, contextkey_1.IContextKeyService),
            __param(2, snippetsService_1.ISnippetsService)
        ], TabCompletionController);
        return TabCompletionController;
        var TabCompletionController_1;
    }());
    exports.TabCompletionController = TabCompletionController;
    var TabCompletionCommand = editorCommonExtensions_1.EditorCommand.bindToContribution(TabCompletionController.get);
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand(new TabCompletionCommand({
        id: 'insertSnippet',
        precondition: TabCompletionController.ContextKey,
        handler: function (x) { return x.performSnippetCompletions(); },
        kbOpts: {
            weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.editorContrib(),
            kbExpr: contextkey_1.ContextKeyExpr.and(editorContextKeys_1.EditorContextKeys.textFocus, editorContextKeys_1.EditorContextKeys.tabDoesNotMoveFocus, snippetController2_1.SnippetController2.InSnippetMode.toNegated(), contextkey_1.ContextKeyExpr.has('config.editor.tabCompletion')),
            primary: 2 /* Tab */
        }
    }));
    platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).registerConfiguration({
        id: 'editor',
        order: 5,
        type: 'object',
        properties: {
            'editor.tabCompletion': {
                'type': 'boolean',
                'default': false,
                'description': nls_1.localize('tabCompletion', "Insert snippets when their prefix matches. Works best when 'quickSuggestions' aren't enabled.")
            },
        }
    });
});
//# sourceMappingURL=tabCompletion.js.map