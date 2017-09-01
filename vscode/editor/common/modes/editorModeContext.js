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
define(["require", "exports", "vs/base/common/lifecycle", "vs/editor/common/modes", "vs/editor/common/editorContextKeys", "vs/base/common/network"], function (require, exports, lifecycle_1, modes, editorContextKeys_1, network_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var EditorModeContext = (function (_super) {
        __extends(EditorModeContext, _super);
        function EditorModeContext(editor, contextKeyService) {
            var _this = _super.call(this) || this;
            _this._editor = editor;
            _this._langId = editorContextKeys_1.EditorContextKeys.languageId.bindTo(contextKeyService);
            _this._hasCompletionItemProvider = editorContextKeys_1.EditorContextKeys.hasCompletionItemProvider.bindTo(contextKeyService);
            _this._hasCodeActionsProvider = editorContextKeys_1.EditorContextKeys.hasCodeActionsProvider.bindTo(contextKeyService);
            _this._hasCodeLensProvider = editorContextKeys_1.EditorContextKeys.hasCodeLensProvider.bindTo(contextKeyService);
            _this._hasDefinitionProvider = editorContextKeys_1.EditorContextKeys.hasDefinitionProvider.bindTo(contextKeyService);
            _this._hasImplementationProvider = editorContextKeys_1.EditorContextKeys.hasImplementationProvider.bindTo(contextKeyService);
            _this._hasTypeDefinitionProvider = editorContextKeys_1.EditorContextKeys.hasTypeDefinitionProvider.bindTo(contextKeyService);
            _this._hasHoverProvider = editorContextKeys_1.EditorContextKeys.hasHoverProvider.bindTo(contextKeyService);
            _this._hasDocumentHighlightProvider = editorContextKeys_1.EditorContextKeys.hasDocumentHighlightProvider.bindTo(contextKeyService);
            _this._hasDocumentSymbolProvider = editorContextKeys_1.EditorContextKeys.hasDocumentSymbolProvider.bindTo(contextKeyService);
            _this._hasReferenceProvider = editorContextKeys_1.EditorContextKeys.hasReferenceProvider.bindTo(contextKeyService);
            _this._hasRenameProvider = editorContextKeys_1.EditorContextKeys.hasRenameProvider.bindTo(contextKeyService);
            _this._hasDocumentFormattingProvider = editorContextKeys_1.EditorContextKeys.hasDocumentFormattingProvider.bindTo(contextKeyService);
            _this._hasDocumentSelectionFormattingProvider = editorContextKeys_1.EditorContextKeys.hasDocumentSelectionFormattingProvider.bindTo(contextKeyService);
            _this._hasSignatureHelpProvider = editorContextKeys_1.EditorContextKeys.hasSignatureHelpProvider.bindTo(contextKeyService);
            _this._isInWalkThrough = editorContextKeys_1.EditorContextKeys.isInEmbeddedEditor.bindTo(contextKeyService);
            var update = function () { return _this._update(); };
            // update when model/mode changes
            _this._register(editor.onDidChangeModel(update));
            _this._register(editor.onDidChangeModelLanguage(update));
            // update when registries change
            _this._register(modes.SuggestRegistry.onDidChange(update));
            _this._register(modes.CodeActionProviderRegistry.onDidChange(update));
            _this._register(modes.CodeLensProviderRegistry.onDidChange(update));
            _this._register(modes.DefinitionProviderRegistry.onDidChange(update));
            _this._register(modes.ImplementationProviderRegistry.onDidChange(update));
            _this._register(modes.TypeDefinitionProviderRegistry.onDidChange(update));
            _this._register(modes.HoverProviderRegistry.onDidChange(update));
            _this._register(modes.DocumentHighlightProviderRegistry.onDidChange(update));
            _this._register(modes.DocumentSymbolProviderRegistry.onDidChange(update));
            _this._register(modes.ReferenceProviderRegistry.onDidChange(update));
            _this._register(modes.RenameProviderRegistry.onDidChange(update));
            _this._register(modes.DocumentFormattingEditProviderRegistry.onDidChange(update));
            _this._register(modes.DocumentRangeFormattingEditProviderRegistry.onDidChange(update));
            _this._register(modes.SignatureHelpProviderRegistry.onDidChange(update));
            update();
            return _this;
        }
        EditorModeContext.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
        };
        EditorModeContext.prototype.reset = function () {
            this._langId.reset();
            this._hasCompletionItemProvider.reset();
            this._hasCodeActionsProvider.reset();
            this._hasCodeLensProvider.reset();
            this._hasDefinitionProvider.reset();
            this._hasImplementationProvider.reset();
            this._hasTypeDefinitionProvider.reset();
            this._hasHoverProvider.reset();
            this._hasDocumentHighlightProvider.reset();
            this._hasDocumentSymbolProvider.reset();
            this._hasReferenceProvider.reset();
            this._hasRenameProvider.reset();
            this._hasDocumentFormattingProvider.reset();
            this._hasDocumentSelectionFormattingProvider.reset();
            this._hasSignatureHelpProvider.reset();
            this._isInWalkThrough.reset();
        };
        EditorModeContext.prototype._update = function () {
            var model = this._editor.getModel();
            if (!model) {
                this.reset();
                return;
            }
            this._langId.set(model.getLanguageIdentifier().language);
            this._hasCompletionItemProvider.set(modes.SuggestRegistry.has(model));
            this._hasCodeActionsProvider.set(modes.CodeActionProviderRegistry.has(model));
            this._hasCodeLensProvider.set(modes.CodeLensProviderRegistry.has(model));
            this._hasDefinitionProvider.set(modes.DefinitionProviderRegistry.has(model));
            this._hasImplementationProvider.set(modes.ImplementationProviderRegistry.has(model));
            this._hasTypeDefinitionProvider.set(modes.TypeDefinitionProviderRegistry.has(model));
            this._hasHoverProvider.set(modes.HoverProviderRegistry.has(model));
            this._hasDocumentHighlightProvider.set(modes.DocumentHighlightProviderRegistry.has(model));
            this._hasDocumentSymbolProvider.set(modes.DocumentSymbolProviderRegistry.has(model));
            this._hasReferenceProvider.set(modes.ReferenceProviderRegistry.has(model));
            this._hasRenameProvider.set(modes.RenameProviderRegistry.has(model));
            this._hasSignatureHelpProvider.set(modes.SignatureHelpProviderRegistry.has(model));
            this._hasDocumentFormattingProvider.set(modes.DocumentFormattingEditProviderRegistry.has(model) || modes.DocumentRangeFormattingEditProviderRegistry.has(model));
            this._hasDocumentSelectionFormattingProvider.set(modes.DocumentRangeFormattingEditProviderRegistry.has(model));
            this._isInWalkThrough.set(model.uri.scheme === network_1.Schemas.walkThroughSnippet);
        };
        return EditorModeContext;
    }(lifecycle_1.Disposable));
    exports.EditorModeContext = EditorModeContext;
});
//# sourceMappingURL=editorModeContext.js.map