import { ICommandService } from 'vs/platform/commands/common/commands';
import { IMessageService } from 'vs/platform/message/common/message';
import * as editorCommon from 'vs/editor/common/editorCommon';
import * as editorBrowser from 'vs/editor/browser/editorBrowser';
export declare class CodeLensContribution implements editorCommon.IEditorContribution {
    private _editor;
    private _commandService;
    private _messageService;
    private static ID;
    private _isEnabled;
    private _globalToDispose;
    private _localToDispose;
    private _lenses;
    private _currentFindCodeLensSymbolsPromise;
    private _modelChangeCounter;
    private _currentFindOccPromise;
    private _detectVisibleLenses;
    constructor(_editor: editorBrowser.ICodeEditor, _commandService: ICommandService, _messageService: IMessageService);
    dispose(): void;
    private _localDispose();
    getId(): string;
    private _onModelChange();
    private _disposeAllLenses(decChangeAccessor, viewZoneChangeAccessor);
    private _renderCodeLensSymbols(symbols);
    private _onViewportChanged();
}
