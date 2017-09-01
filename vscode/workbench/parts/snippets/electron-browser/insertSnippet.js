var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "vs/nls", "vs/base/common/winjs.base", "vs/editor/common/editorCommonExtensions", "vs/platform/quickOpen/common/quickOpen", "vs/editor/common/services/modeService", "vs/platform/commands/common/commands", "vs/workbench/parts/snippets/electron-browser/snippetsService", "vs/editor/contrib/snippet/browser/snippetController2", "vs/editor/common/editorContextKeys"], function (require, exports, nls, winjs_base_1, editorCommonExtensions_1, quickOpen_1, modeService_1, commands_1, snippetsService_1, snippetController2_1, editorContextKeys_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Args = (function () {
        function Args(snippet, name, langId) {
            this.snippet = snippet;
            this.name = name;
            this.langId = langId;
        }
        Args.fromUser = function (arg) {
            if (!arg || typeof arg !== 'object') {
                return Args._empty;
            }
            var snippet = arg.snippet, name = arg.name, langId = arg.langId;
            if (typeof snippet !== 'string') {
                snippet = undefined;
            }
            if (typeof name !== 'string') {
                name = undefined;
            }
            if (typeof langId !== 'string') {
                langId = undefined;
            }
            return new Args(snippet, name, langId);
        };
        Args._empty = new Args(undefined, undefined, undefined);
        return Args;
    }());
    var InsertSnippetAction = (function (_super) {
        __extends(InsertSnippetAction, _super);
        function InsertSnippetAction() {
            return _super.call(this, {
                id: 'editor.action.insertSnippet',
                label: nls.localize('snippet.suggestions.label', "Insert Snippet"),
                alias: 'Insert Snippet',
                precondition: editorContextKeys_1.EditorContextKeys.writable
            }) || this;
        }
        InsertSnippetAction.prototype.run = function (accessor, editor, arg) {
            var modeService = accessor.get(modeService_1.IModeService);
            var snippetService = accessor.get(snippetsService_1.ISnippetsService);
            if (!editor.getModel()) {
                return undefined;
            }
            var quickOpenService = accessor.get(quickOpen_1.IQuickOpenService);
            var _a = editor.getPosition(), lineNumber = _a.lineNumber, column = _a.column;
            var _b = Args.fromUser(arg), snippet = _b.snippet, name = _b.name, langId = _b.langId;
            return new winjs_base_1.TPromise(function (resolve, reject) {
                if (snippet) {
                    return resolve({
                        codeSnippet: snippet,
                        description: undefined,
                        name: undefined,
                        extensionName: undefined,
                        prefix: undefined
                    });
                }
                var languageId;
                if (langId) {
                    languageId = modeService.getLanguageIdentifier(langId).id;
                }
                else {
                    editor.getModel().tokenizeIfCheap(lineNumber);
                    languageId = editor.getModel().getLanguageIdAtPosition(lineNumber, column);
                    // validate the `languageId` to ensure this is a user
                    // facing language with a name and the chance to have
                    // snippets, else fall back to the outer language
                    var language = modeService.getLanguageIdentifier(languageId).language;
                    if (!modeService.getLanguageName(language)) {
                        languageId = editor.getModel().getLanguageIdentifier().id;
                    }
                }
                if (name) {
                    // take selected snippet
                    snippetService.visitSnippets(languageId, function (snippet) {
                        if (snippet.name !== name) {
                            return true;
                        }
                        resolve(snippet);
                        return false;
                    });
                }
                else {
                    // let user pick a snippet
                    var picks_1 = [];
                    snippetService.visitSnippets(languageId, function (snippet) {
                        picks_1.push({
                            label: snippet.prefix,
                            detail: snippet.description,
                            snippet: snippet
                        });
                        return true;
                    });
                    return quickOpenService.pick(picks_1, { matchOnDetail: true }).then(function (pick) { return resolve(pick && pick.snippet); }, reject);
                }
            }).then(function (snippet) {
                if (snippet) {
                    snippetController2_1.SnippetController2.get(editor).insert(snippet.codeSnippet, 0, 0);
                }
            });
        };
        InsertSnippetAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], InsertSnippetAction);
        return InsertSnippetAction;
    }(editorCommonExtensions_1.EditorAction));
    // compatibility command to make sure old keybinding are still working
    commands_1.CommandsRegistry.registerCommand('editor.action.showSnippets', function (accessor) {
        return accessor.get(commands_1.ICommandService).executeCommand('editor.action.insertSnippet');
    });
});
//# sourceMappingURL=insertSnippet.js.map