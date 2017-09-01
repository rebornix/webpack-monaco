/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/nls", "vs/base/common/errors", "vs/base/common/severity", "vs/base/common/winjs.base", "vs/platform/files/common/files", "vs/platform/contextkey/common/contextkey", "vs/platform/message/common/message", "vs/platform/progress/common/progress", "vs/editor/common/editorCommonExtensions", "vs/editor/browser/editorBrowserExtensions", "vs/editor/common/editorContextKeys", "vs/editor/common/services/bulkEdit", "./renameInputField", "vs/editor/common/services/resolverService", "vs/platform/instantiation/common/instantiation", "vs/platform/theme/common/themeService", "vs/base/common/async", "vs/editor/common/modes", "vs/base/browser/ui/aria/aria", "vs/editor/common/core/range"], function (require, exports, nls, errors_1, severity_1, winjs_base_1, files_1, contextkey_1, message_1, progress_1, editorCommonExtensions_1, editorBrowserExtensions_1, editorContextKeys_1, bulkEdit_1, renameInputField_1, resolverService_1, instantiation_1, themeService_1, async_1, modes_1, aria_1, range_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function rename(model, position, newName) {
        var supports = modes_1.RenameProviderRegistry.ordered(model);
        var rejects = [];
        var hasResult = false;
        var factory = supports.map(function (support) {
            return function () {
                if (!hasResult) {
                    return async_1.asWinJsPromise(function (token) {
                        return support.provideRenameEdits(model, position, newName, token);
                    }).then(function (result) {
                        if (!result) {
                            // ignore
                        }
                        else if (!result.rejectReason) {
                            hasResult = true;
                            return result;
                        }
                        else {
                            rejects.push(result.rejectReason);
                        }
                        return undefined;
                    }, function (err) {
                        errors_1.onUnexpectedExternalError(err);
                        return winjs_base_1.TPromise.wrapError(new Error('provider failed'));
                    });
                }
                return undefined;
            };
        });
        return async_1.sequence(factory).then(function (values) {
            var result = values[0];
            if (rejects.length > 0) {
                return {
                    edits: undefined,
                    rejectReason: rejects.join('\n')
                };
            }
            else if (!result) {
                return {
                    edits: undefined,
                    rejectReason: nls.localize('no result', "No result.")
                };
            }
            else {
                return result;
            }
        });
    }
    exports.rename = rename;
    // ---  register actions and commands
    var CONTEXT_RENAME_INPUT_VISIBLE = new contextkey_1.RawContextKey('renameInputVisible', false);
    var RenameController = (function () {
        function RenameController(editor, _messageService, _textModelResolverService, _progressService, contextKeyService, themeService, _fileService) {
            this.editor = editor;
            this._messageService = _messageService;
            this._textModelResolverService = _textModelResolverService;
            this._progressService = _progressService;
            this._fileService = _fileService;
            this._renameInputField = new renameInputField_1.default(editor, themeService);
            this._renameInputVisible = CONTEXT_RENAME_INPUT_VISIBLE.bindTo(contextKeyService);
        }
        RenameController_1 = RenameController;
        RenameController.get = function (editor) {
            return editor.getContribution(RenameController_1.ID);
        };
        RenameController.prototype.dispose = function () {
            this._renameInputField.dispose();
        };
        RenameController.prototype.getId = function () {
            return RenameController_1.ID;
        };
        RenameController.prototype.run = function () {
            var _this = this;
            var selection = this.editor.getSelection(), word = this.editor.getModel().getWordAtPosition(selection.getStartPosition());
            if (!word) {
                return undefined;
            }
            var lineNumber = selection.startLineNumber, selectionStart = 0, selectionEnd = word.word.length, wordRange;
            wordRange = new range_1.Range(lineNumber, word.startColumn, lineNumber, word.endColumn);
            if (!selection.isEmpty() && selection.startLineNumber === selection.endLineNumber) {
                selectionStart = Math.max(0, selection.startColumn - word.startColumn);
                selectionEnd = Math.min(word.endColumn, selection.endColumn) - word.startColumn;
            }
            this._renameInputVisible.set(true);
            return this._renameInputField.getInput(wordRange, word.word, selectionStart, selectionEnd).then(function (newName) {
                _this._renameInputVisible.reset();
                _this.editor.focus();
                var renameOperation = _this._prepareRename(newName).then(function (edit) {
                    return edit.finish().then(function (selection) {
                        if (selection) {
                            _this.editor.setSelection(selection);
                        }
                        // alert
                        aria_1.alert(nls.localize('aria', "Successfully renamed '{0}' to '{1}'. Summary: {2}", word.word, newName, edit.ariaMessage()));
                    });
                }, function (err) {
                    if (typeof err === 'string') {
                        _this._messageService.show(severity_1.default.Info, err);
                        return undefined;
                    }
                    else {
                        _this._messageService.show(severity_1.default.Error, nls.localize('rename.failed', "Sorry, rename failed to execute."));
                        return winjs_base_1.TPromise.wrapError(err);
                    }
                });
                _this._progressService.showWhile(renameOperation, 250);
                return renameOperation;
            }, function (err) {
                _this._renameInputVisible.reset();
                _this.editor.focus();
                if (!errors_1.isPromiseCanceledError(err)) {
                    return winjs_base_1.TPromise.wrapError(err);
                }
                return undefined;
            });
        };
        RenameController.prototype.acceptRenameInput = function () {
            this._renameInputField.acceptInput();
        };
        RenameController.prototype.cancelRenameInput = function () {
            this._renameInputField.cancelInput();
        };
        RenameController.prototype._prepareRename = function (newName) {
            // start recording of file changes so that we can figure out if a file that
            // is to be renamed conflicts with another (concurrent) modification
            var edit = bulkEdit_1.createBulkEdit(this._textModelResolverService, this.editor, this._fileService);
            return rename(this.editor.getModel(), this.editor.getPosition(), newName).then(function (result) {
                if (result.rejectReason) {
                    return winjs_base_1.TPromise.wrapError(new Error(result.rejectReason));
                }
                edit.add(result.edits);
                return edit;
            });
        };
        RenameController.ID = 'editor.contrib.renameController';
        RenameController = RenameController_1 = __decorate([
            editorBrowserExtensions_1.editorContribution,
            __param(1, message_1.IMessageService),
            __param(2, resolverService_1.ITextModelService),
            __param(3, progress_1.IProgressService),
            __param(4, contextkey_1.IContextKeyService),
            __param(5, themeService_1.IThemeService),
            __param(6, instantiation_1.optional(files_1.IFileService))
        ], RenameController);
        return RenameController;
        var RenameController_1;
    }());
    // ---- action implementation
    var RenameAction = (function (_super) {
        __extends(RenameAction, _super);
        function RenameAction() {
            return _super.call(this, {
                id: 'editor.action.rename',
                label: nls.localize('rename.label', "Rename Symbol"),
                alias: 'Rename Symbol',
                precondition: contextkey_1.ContextKeyExpr.and(editorContextKeys_1.EditorContextKeys.writable, editorContextKeys_1.EditorContextKeys.hasRenameProvider),
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 60 /* F2 */
                },
                menuOpts: {
                    group: '1_modification',
                    order: 1.1
                }
            }) || this;
        }
        RenameAction.prototype.run = function (accessor, editor) {
            var controller = RenameController.get(editor);
            if (controller) {
                return controller.run();
            }
            return undefined;
        };
        RenameAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], RenameAction);
        return RenameAction;
    }(editorCommonExtensions_1.EditorAction));
    exports.RenameAction = RenameAction;
    var RenameCommand = editorCommonExtensions_1.EditorCommand.bindToContribution(RenameController.get);
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand(new RenameCommand({
        id: 'acceptRenameInput',
        precondition: CONTEXT_RENAME_INPUT_VISIBLE,
        handler: function (x) { return x.acceptRenameInput(); },
        kbOpts: {
            weight: editorCommonExtensions_1.CommonEditorRegistry.commandWeight(99),
            kbExpr: editorContextKeys_1.EditorContextKeys.focus,
            primary: 3 /* Enter */
        }
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand(new RenameCommand({
        id: 'cancelRenameInput',
        precondition: CONTEXT_RENAME_INPUT_VISIBLE,
        handler: function (x) { return x.cancelRenameInput(); },
        kbOpts: {
            weight: editorCommonExtensions_1.CommonEditorRegistry.commandWeight(99),
            kbExpr: editorContextKeys_1.EditorContextKeys.focus,
            primary: 9 /* Escape */,
            secondary: [1024 /* Shift */ | 9 /* Escape */]
        }
    }));
    // ---- api bridge command
    editorCommonExtensions_1.CommonEditorRegistry.registerDefaultLanguageCommand('_executeDocumentRenameProvider', function (model, position, args) {
        var newName = args.newName;
        if (typeof newName !== 'string') {
            throw errors_1.illegalArgument('newName');
        }
        return rename(model, position, newName);
    });
});
//# sourceMappingURL=rename.js.map