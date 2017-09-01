import { ContextKeyExpr, RawContextKey } from 'vs/platform/contextkey/common/contextkey';
export declare namespace EditorContextKeys {
    /**
     * A context key that is set when the editor's text has focus (cursor is blinking).
     */
    const textFocus: RawContextKey<boolean>;
    /**
     * A context key that is set when the editor's text or an editor's widget has focus.
     */
    const focus: RawContextKey<boolean>;
    const readOnly: RawContextKey<boolean>;
    const writable: ContextKeyExpr;
    const hasNonEmptySelection: RawContextKey<boolean>;
    const hasOnlyEmptySelection: ContextKeyExpr;
    const hasMultipleSelections: RawContextKey<boolean>;
    const hasSingleSelection: ContextKeyExpr;
    const tabMovesFocus: RawContextKey<boolean>;
    const tabDoesNotMoveFocus: ContextKeyExpr;
    const isInEmbeddedEditor: RawContextKey<boolean>;
    const languageId: RawContextKey<string>;
    const hasCompletionItemProvider: RawContextKey<boolean>;
    const hasCodeActionsProvider: RawContextKey<boolean>;
    const hasCodeLensProvider: RawContextKey<boolean>;
    const hasDefinitionProvider: RawContextKey<boolean>;
    const hasImplementationProvider: RawContextKey<boolean>;
    const hasTypeDefinitionProvider: RawContextKey<boolean>;
    const hasHoverProvider: RawContextKey<boolean>;
    const hasDocumentHighlightProvider: RawContextKey<boolean>;
    const hasDocumentSymbolProvider: RawContextKey<boolean>;
    const hasReferenceProvider: RawContextKey<boolean>;
    const hasRenameProvider: RawContextKey<boolean>;
    const hasDocumentFormattingProvider: RawContextKey<boolean>;
    const hasDocumentSelectionFormattingProvider: RawContextKey<boolean>;
    const hasSignatureHelpProvider: RawContextKey<boolean>;
}
