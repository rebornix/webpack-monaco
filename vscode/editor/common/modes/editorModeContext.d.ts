import { Disposable } from 'vs/base/common/lifecycle';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { ICommonCodeEditor } from 'vs/editor/common/editorCommon';
export declare class EditorModeContext extends Disposable {
    private _editor;
    private _langId;
    private _hasCompletionItemProvider;
    private _hasCodeActionsProvider;
    private _hasCodeLensProvider;
    private _hasDefinitionProvider;
    private _hasImplementationProvider;
    private _hasTypeDefinitionProvider;
    private _hasHoverProvider;
    private _hasDocumentHighlightProvider;
    private _hasDocumentSymbolProvider;
    private _hasReferenceProvider;
    private _hasRenameProvider;
    private _hasDocumentFormattingProvider;
    private _hasDocumentSelectionFormattingProvider;
    private _hasSignatureHelpProvider;
    private _isInWalkThrough;
    constructor(editor: ICommonCodeEditor, contextKeyService: IContextKeyService);
    dispose(): void;
    reset(): void;
    private _update();
}
