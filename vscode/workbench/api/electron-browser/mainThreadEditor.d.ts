import EditorCommon = require('vs/editor/common/editorCommon');
import Event from 'vs/base/common/event';
import { IEditor } from 'vs/platform/editor/common/editor';
import { IModelService } from 'vs/editor/common/services/modelService';
import { IRange } from 'vs/editor/common/core/range';
import { Selection, ISelection } from 'vs/editor/common/core/selection';
import { IResolvedTextEditorConfiguration, ISelectionChangeEvent, ITextEditorConfigurationUpdate, TextEditorRevealType, IApplyEditsOptions, IUndoStopOptions } from 'vs/workbench/api/node/extHost.protocol';
export interface IFocusTracker {
    onGainedFocus(): void;
    onLostFocus(): void;
}
/**
 * Text Editor that is permanently bound to the same model.
 * It can be bound or not to a CodeEditor.
 */
export declare class MainThreadTextEditor {
    private _id;
    private _model;
    private _modelService;
    private _modelListeners;
    private _codeEditor;
    private _focusTracker;
    private _codeEditorListeners;
    private _lastSelection;
    private _configuration;
    private _onSelectionChanged;
    private _onConfigurationChanged;
    constructor(id: string, model: EditorCommon.IModel, codeEditor: EditorCommon.ICommonCodeEditor, focusTracker: IFocusTracker, modelService: IModelService);
    dispose(): void;
    getId(): string;
    getModel(): EditorCommon.IModel;
    getCodeEditor(): EditorCommon.ICommonCodeEditor;
    hasCodeEditor(codeEditor: EditorCommon.ICommonCodeEditor): boolean;
    setCodeEditor(codeEditor: EditorCommon.ICommonCodeEditor): void;
    isVisible(): boolean;
    readonly onSelectionChanged: Event<ISelectionChangeEvent>;
    readonly onConfigurationChanged: Event<IResolvedTextEditorConfiguration>;
    getSelections(): Selection[];
    setSelections(selections: ISelection[]): void;
    getConfiguration(): IResolvedTextEditorConfiguration;
    private _setIndentConfiguration(newConfiguration);
    setConfiguration(newConfiguration: ITextEditorConfigurationUpdate): void;
    setDecorations(key: string, ranges: EditorCommon.IDecorationOptions[]): void;
    revealRange(range: IRange, revealType: TextEditorRevealType): void;
    private _readConfiguration(model, codeEditor);
    private _setConfiguration(newConfiguration);
    isFocused(): boolean;
    matches(editor: IEditor): boolean;
    applyEdits(versionIdCheck: number, edits: EditorCommon.ISingleEditOperation[], opts: IApplyEditsOptions): boolean;
    insertSnippet(template: string, ranges: IRange[], opts: IUndoStopOptions): boolean;
}
