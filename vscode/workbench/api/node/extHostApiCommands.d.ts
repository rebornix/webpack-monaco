import { ExtHostCommands } from 'vs/workbench/api/node/extHostCommands';
export declare class ExtHostApiCommands {
    static register(commands: ExtHostCommands): void;
    private _commands;
    private _disposables;
    private constructor();
    registerCommands(): void;
    private _register(id, handler, description?);
    /**
     * Execute workspace symbol provider.
     *
     * @param query Search string to match query symbol names
     * @return A promise that resolves to an array of symbol information.
     */
    private _executeWorkspaceSymbolProvider(query);
    private _executeDefinitionProvider(resource, position);
    private _executeImplementationProvider(resource, position);
    private _executeHoverProvider(resource, position);
    private _executeDocumentHighlights(resource, position);
    private _executeReferenceProvider(resource, position);
    private _executeDocumentRenameProvider(resource, position, newName);
    private _executeSignatureHelpProvider(resource, position, triggerCharacter);
    private _executeCompletionItemProvider(resource, position, triggerCharacter);
    private _executeDocumentSymbolProvider(resource);
    private _executeCodeActionProvider(resource, range);
    private _executeCodeLensProvider(resource);
    private _executeFormatDocumentProvider(resource, options);
    private _executeFormatRangeProvider(resource, range, options);
    private _executeFormatOnTypeProvider(resource, position, ch, options);
    private _executeDocumentLinkProvider(resource);
}
