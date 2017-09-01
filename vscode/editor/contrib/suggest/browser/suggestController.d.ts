import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { ICommandService } from 'vs/platform/commands/common/commands';
import { ICommonCodeEditor, IEditorContribution } from 'vs/editor/common/editorCommon';
import { ServicesAccessor, EditorAction } from 'vs/editor/common/editorCommonExtensions';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { ISuggestSupport } from 'vs/editor/common/modes';
export declare class SuggestController implements IEditorContribution {
    private _editor;
    private _commandService;
    private _telemetryService;
    private static ID;
    static get(editor: ICommonCodeEditor): SuggestController;
    private _model;
    private _widget;
    private _toDispose;
    constructor(_editor: ICodeEditor, _commandService: ICommandService, _telemetryService: ITelemetryService, _contextKeyService: IContextKeyService, _instantiationService: IInstantiationService);
    getId(): string;
    dispose(): void;
    private _onDidSelectItem(item);
    private _alertCompletionItem({suggestion});
    triggerSuggest(onlyFrom?: ISuggestSupport[]): void;
    acceptSelectedSuggestion(): void;
    cancelSuggestWidget(): void;
    selectNextSuggestion(): void;
    selectNextPageSuggestion(): void;
    selectLastSuggestion(): void;
    selectPrevSuggestion(): void;
    selectPrevPageSuggestion(): void;
    selectFirstSuggestion(): void;
    toggleSuggestionDetails(): void;
    toggleSuggestionFocus(): void;
}
export declare class TriggerSuggestAction extends EditorAction {
    constructor();
    run(accessor: ServicesAccessor, editor: ICommonCodeEditor): void;
}
