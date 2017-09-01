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
define(["require", "exports", "vs/nls", "vs/base/browser/ui/aria/aria", "vs/base/common/keyCodes", "vs/base/common/platform", "vs/base/common/severity", "vs/base/common/winjs.base", "vs/platform/editor/common/editor", "vs/platform/message/common/message", "vs/editor/common/core/range", "vs/editor/common/editorCommonExtensions", "./goToDeclaration", "vs/editor/contrib/referenceSearch/browser/referencesController", "vs/editor/contrib/referenceSearch/browser/referencesModel", "vs/editor/contrib/zoneWidget/browser/peekViewWidget", "vs/platform/contextkey/common/contextkey", "./messageController", "vs/editor/common/editorContextKeys", "vs/platform/progress/common/progress"], function (require, exports, nls, aria_1, keyCodes_1, platform, severity_1, winjs_base_1, editor_1, message_1, range_1, editorCommonExtensions_1, goToDeclaration_1, referencesController_1, referencesModel_1, peekViewWidget_1, contextkey_1, messageController_1, editorContextKeys_1, progress_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var DefinitionActionConfig = (function () {
        function DefinitionActionConfig(openToSide, openInPeek, filterCurrent, showMessage) {
            if (openToSide === void 0) { openToSide = false; }
            if (openInPeek === void 0) { openInPeek = false; }
            if (filterCurrent === void 0) { filterCurrent = true; }
            if (showMessage === void 0) { showMessage = true; }
            this.openToSide = openToSide;
            this.openInPeek = openInPeek;
            this.filterCurrent = filterCurrent;
            this.showMessage = showMessage;
            //
        }
        return DefinitionActionConfig;
    }());
    exports.DefinitionActionConfig = DefinitionActionConfig;
    var DefinitionAction = (function (_super) {
        __extends(DefinitionAction, _super);
        function DefinitionAction(configuration, opts) {
            var _this = _super.call(this, opts) || this;
            _this._configuration = configuration;
            return _this;
        }
        DefinitionAction.prototype.run = function (accessor, editor) {
            var _this = this;
            var messageService = accessor.get(message_1.IMessageService);
            var editorService = accessor.get(editor_1.IEditorService);
            var progressService = accessor.get(progress_1.IProgressService);
            var model = editor.getModel();
            var pos = editor.getPosition();
            var definitionPromise = this._getDeclarationsAtPosition(model, pos).then(function (references) {
                if (model.isDisposed() || editor.getModel() !== model) {
                    // new model, no more model
                    return;
                }
                // * remove falsy references
                // * find reference at the current pos
                var idxOfCurrent = -1;
                var result = [];
                for (var i = 0; i < references.length; i++) {
                    var reference = references[i];
                    if (!reference || !reference.range) {
                        continue;
                    }
                    var uri = reference.uri, range = reference.range;
                    var newLen = result.push({
                        uri: uri,
                        range: range
                    });
                    if (_this._configuration.filterCurrent
                        && uri.toString() === model.uri.toString()
                        && range_1.Range.containsPosition(range, pos)
                        && idxOfCurrent === -1) {
                        idxOfCurrent = newLen - 1;
                    }
                }
                if (result.length === 0) {
                    // no result -> show message
                    if (_this._configuration.showMessage) {
                        var info = model.getWordAtPosition(pos);
                        messageController_1.MessageController.get(editor).showMessage(_this._getNoResultFoundMessage(info), pos);
                    }
                }
                else if (result.length === 1 && idxOfCurrent !== -1) {
                    // only the position at which we are -> adjust selection
                    var current = result[0];
                    _this._openReference(editorService, current, false);
                }
                else {
                    // handle multile results
                    _this._onResult(editorService, editor, new referencesModel_1.ReferencesModel(result));
                }
            }, function (err) {
                // report an error
                messageService.show(severity_1.default.Error, err);
            });
            progressService.showWhile(definitionPromise, 250);
            return definitionPromise;
        };
        DefinitionAction.prototype._getDeclarationsAtPosition = function (model, position) {
            return goToDeclaration_1.getDefinitionsAtPosition(model, position);
        };
        DefinitionAction.prototype._getNoResultFoundMessage = function (info) {
            return info && info.word
                ? nls.localize('noResultWord', "No definition found for '{0}'", info.word)
                : nls.localize('generic.noResults', "No definition found");
        };
        DefinitionAction.prototype._getMetaTitle = function (model) {
            return model.references.length > 1 && nls.localize('meta.title', " – {0} definitions", model.references.length);
        };
        DefinitionAction.prototype._onResult = function (editorService, editor, model) {
            var _this = this;
            var msg = model.getAriaMessage();
            aria_1.alert(msg);
            if (this._configuration.openInPeek) {
                this._openInPeek(editorService, editor, model);
            }
            else {
                var next = model.nearestReference(editor.getModel().uri, editor.getPosition());
                this._openReference(editorService, next, this._configuration.openToSide).then(function (editor) {
                    if (editor && model.references.length > 1) {
                        _this._openInPeek(editorService, editor, model);
                    }
                    else {
                        model.dispose();
                    }
                });
            }
        };
        DefinitionAction.prototype._openReference = function (editorService, reference, sideBySide) {
            var uri = reference.uri, range = reference.range;
            return editorService.openEditor({
                resource: uri,
                options: {
                    selection: range_1.Range.collapseToStart(range),
                    revealIfVisible: !sideBySide
                }
            }, sideBySide).then(function (editor) {
                return editor && editor.getControl();
            });
        };
        DefinitionAction.prototype._openInPeek = function (editorService, target, model) {
            var _this = this;
            var controller = referencesController_1.ReferencesController.get(target);
            if (controller) {
                controller.toggleWidget(target.getSelection(), winjs_base_1.TPromise.as(model), {
                    getMetaTitle: function (model) {
                        return _this._getMetaTitle(model);
                    },
                    onGoto: function (reference) {
                        controller.closeWidget();
                        return _this._openReference(editorService, reference, false);
                    }
                });
            }
            else {
                model.dispose();
            }
        };
        return DefinitionAction;
    }(editorCommonExtensions_1.EditorAction));
    exports.DefinitionAction = DefinitionAction;
    var goToDeclarationKb = platform.isWeb
        ? 2048 /* CtrlCmd */ | 70 /* F12 */
        : 70 /* F12 */;
    var GoToDefinitionAction = (function (_super) {
        __extends(GoToDefinitionAction, _super);
        function GoToDefinitionAction() {
            return _super.call(this, new DefinitionActionConfig(), {
                id: GoToDefinitionAction_1.ID,
                label: nls.localize('actions.goToDecl.label', "Go to Definition"),
                alias: 'Go to Definition',
                precondition: contextkey_1.ContextKeyExpr.and(editorContextKeys_1.EditorContextKeys.hasDefinitionProvider, editorContextKeys_1.EditorContextKeys.isInEmbeddedEditor.toNegated()),
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: goToDeclarationKb
                },
                menuOpts: {
                    group: 'navigation',
                    order: 1.1
                }
            }) || this;
        }
        GoToDefinitionAction_1 = GoToDefinitionAction;
        GoToDefinitionAction.ID = 'editor.action.goToDeclaration';
        GoToDefinitionAction = GoToDefinitionAction_1 = __decorate([
            editorCommonExtensions_1.editorAction
        ], GoToDefinitionAction);
        return GoToDefinitionAction;
        var GoToDefinitionAction_1;
    }(DefinitionAction));
    exports.GoToDefinitionAction = GoToDefinitionAction;
    var OpenDefinitionToSideAction = (function (_super) {
        __extends(OpenDefinitionToSideAction, _super);
        function OpenDefinitionToSideAction() {
            return _super.call(this, new DefinitionActionConfig(true), {
                id: OpenDefinitionToSideAction_1.ID,
                label: nls.localize('actions.goToDeclToSide.label', "Open Definition to the Side"),
                alias: 'Open Definition to the Side',
                precondition: contextkey_1.ContextKeyExpr.and(editorContextKeys_1.EditorContextKeys.hasDefinitionProvider, editorContextKeys_1.EditorContextKeys.isInEmbeddedEditor.toNegated()),
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: keyCodes_1.KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, goToDeclarationKb)
                }
            }) || this;
        }
        OpenDefinitionToSideAction_1 = OpenDefinitionToSideAction;
        OpenDefinitionToSideAction.ID = 'editor.action.openDeclarationToTheSide';
        OpenDefinitionToSideAction = OpenDefinitionToSideAction_1 = __decorate([
            editorCommonExtensions_1.editorAction
        ], OpenDefinitionToSideAction);
        return OpenDefinitionToSideAction;
        var OpenDefinitionToSideAction_1;
    }(DefinitionAction));
    exports.OpenDefinitionToSideAction = OpenDefinitionToSideAction;
    var PeekDefinitionAction = (function (_super) {
        __extends(PeekDefinitionAction, _super);
        function PeekDefinitionAction() {
            return _super.call(this, new DefinitionActionConfig(void 0, true, false), {
                id: 'editor.action.previewDeclaration',
                label: nls.localize('actions.previewDecl.label', "Peek Definition"),
                alias: 'Peek Definition',
                precondition: contextkey_1.ContextKeyExpr.and(editorContextKeys_1.EditorContextKeys.hasDefinitionProvider, peekViewWidget_1.PeekContext.notInPeekEditor, editorContextKeys_1.EditorContextKeys.isInEmbeddedEditor.toNegated()),
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 512 /* Alt */ | 70 /* F12 */,
                    linux: { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 68 /* F10 */ }
                },
                menuOpts: {
                    group: 'navigation',
                    order: 1.2
                }
            }) || this;
        }
        PeekDefinitionAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], PeekDefinitionAction);
        return PeekDefinitionAction;
    }(DefinitionAction));
    exports.PeekDefinitionAction = PeekDefinitionAction;
    var ImplementationAction = (function (_super) {
        __extends(ImplementationAction, _super);
        function ImplementationAction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ImplementationAction.prototype._getDeclarationsAtPosition = function (model, position) {
            return goToDeclaration_1.getImplementationsAtPosition(model, position);
        };
        ImplementationAction.prototype._getNoResultFoundMessage = function (info) {
            return info && info.word
                ? nls.localize('goToImplementation.noResultWord', "No implementation found for '{0}'", info.word)
                : nls.localize('goToImplementation.generic.noResults', "No implementation found");
        };
        ImplementationAction.prototype._getMetaTitle = function (model) {
            return model.references.length > 1 && nls.localize('meta.implementations.title', " – {0} implementations", model.references.length);
        };
        return ImplementationAction;
    }(DefinitionAction));
    exports.ImplementationAction = ImplementationAction;
    var GoToImplementationAction = (function (_super) {
        __extends(GoToImplementationAction, _super);
        function GoToImplementationAction() {
            return _super.call(this, new DefinitionActionConfig(), {
                id: GoToImplementationAction_1.ID,
                label: nls.localize('actions.goToImplementation.label', "Go to Implementation"),
                alias: 'Go to Implementation',
                precondition: contextkey_1.ContextKeyExpr.and(editorContextKeys_1.EditorContextKeys.hasImplementationProvider, editorContextKeys_1.EditorContextKeys.isInEmbeddedEditor.toNegated()),
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 2048 /* CtrlCmd */ | 70 /* F12 */
                }
            }) || this;
        }
        GoToImplementationAction_1 = GoToImplementationAction;
        GoToImplementationAction.ID = 'editor.action.goToImplementation';
        GoToImplementationAction = GoToImplementationAction_1 = __decorate([
            editorCommonExtensions_1.editorAction
        ], GoToImplementationAction);
        return GoToImplementationAction;
        var GoToImplementationAction_1;
    }(ImplementationAction));
    exports.GoToImplementationAction = GoToImplementationAction;
    var PeekImplementationAction = (function (_super) {
        __extends(PeekImplementationAction, _super);
        function PeekImplementationAction() {
            return _super.call(this, new DefinitionActionConfig(false, true, false), {
                id: PeekImplementationAction_1.ID,
                label: nls.localize('actions.peekImplementation.label', "Peek Implementation"),
                alias: 'Peek Implementation',
                precondition: contextkey_1.ContextKeyExpr.and(editorContextKeys_1.EditorContextKeys.hasImplementationProvider, editorContextKeys_1.EditorContextKeys.isInEmbeddedEditor.toNegated()),
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 70 /* F12 */
                }
            }) || this;
        }
        PeekImplementationAction_1 = PeekImplementationAction;
        PeekImplementationAction.ID = 'editor.action.peekImplementation';
        PeekImplementationAction = PeekImplementationAction_1 = __decorate([
            editorCommonExtensions_1.editorAction
        ], PeekImplementationAction);
        return PeekImplementationAction;
        var PeekImplementationAction_1;
    }(ImplementationAction));
    exports.PeekImplementationAction = PeekImplementationAction;
    var TypeDefinitionAction = (function (_super) {
        __extends(TypeDefinitionAction, _super);
        function TypeDefinitionAction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TypeDefinitionAction.prototype._getDeclarationsAtPosition = function (model, position) {
            return goToDeclaration_1.getTypeDefinitionsAtPosition(model, position);
        };
        TypeDefinitionAction.prototype._getNoResultFoundMessage = function (info) {
            return info && info.word
                ? nls.localize('goToTypeDefinition.noResultWord', "No type definition found for '{0}'", info.word)
                : nls.localize('goToTypeDefinition.generic.noResults', "No type definition found");
        };
        TypeDefinitionAction.prototype._getMetaTitle = function (model) {
            return model.references.length > 1 && nls.localize('meta.typeDefinitions.title', " – {0} type definitions", model.references.length);
        };
        return TypeDefinitionAction;
    }(DefinitionAction));
    exports.TypeDefinitionAction = TypeDefinitionAction;
    var GoToTypeDefintionAction = (function (_super) {
        __extends(GoToTypeDefintionAction, _super);
        function GoToTypeDefintionAction() {
            return _super.call(this, new DefinitionActionConfig(), {
                id: GoToTypeDefintionAction_1.ID,
                label: nls.localize('actions.goToTypeDefinition.label', "Go to Type Definition"),
                alias: 'Go to Type Definition',
                precondition: contextkey_1.ContextKeyExpr.and(editorContextKeys_1.EditorContextKeys.hasTypeDefinitionProvider, editorContextKeys_1.EditorContextKeys.isInEmbeddedEditor.toNegated()),
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 0
                },
                menuOpts: {
                    group: 'navigation',
                    order: 1.4
                }
            }) || this;
        }
        GoToTypeDefintionAction_1 = GoToTypeDefintionAction;
        GoToTypeDefintionAction.ID = 'editor.action.goToTypeDefinition';
        GoToTypeDefintionAction = GoToTypeDefintionAction_1 = __decorate([
            editorCommonExtensions_1.editorAction
        ], GoToTypeDefintionAction);
        return GoToTypeDefintionAction;
        var GoToTypeDefintionAction_1;
    }(TypeDefinitionAction));
    exports.GoToTypeDefintionAction = GoToTypeDefintionAction;
    var PeekTypeDefinitionAction = (function (_super) {
        __extends(PeekTypeDefinitionAction, _super);
        function PeekTypeDefinitionAction() {
            return _super.call(this, new DefinitionActionConfig(false, true, false), {
                id: PeekTypeDefinitionAction_1.ID,
                label: nls.localize('actions.peekTypeDefinition.label', "Peek Type Definition"),
                alias: 'Peek Type Definition',
                precondition: contextkey_1.ContextKeyExpr.and(editorContextKeys_1.EditorContextKeys.hasTypeDefinitionProvider, editorContextKeys_1.EditorContextKeys.isInEmbeddedEditor.toNegated()),
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 0
                }
            }) || this;
        }
        PeekTypeDefinitionAction_1 = PeekTypeDefinitionAction;
        PeekTypeDefinitionAction.ID = 'editor.action.peekTypeDefinition';
        PeekTypeDefinitionAction = PeekTypeDefinitionAction_1 = __decorate([
            editorCommonExtensions_1.editorAction
        ], PeekTypeDefinitionAction);
        return PeekTypeDefinitionAction;
        var PeekTypeDefinitionAction_1;
    }(TypeDefinitionAction));
    exports.PeekTypeDefinitionAction = PeekTypeDefinitionAction;
});
//# sourceMappingURL=goToDeclarationCommands.js.map