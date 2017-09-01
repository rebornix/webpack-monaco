import Event, { Emitter } from 'vs/base/common/event';
import { Disposable, IDisposable } from 'vs/base/common/lifecycle';
import { ServicesAccessor, IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IContextKeyServiceTarget, IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { CommonEditorConfiguration } from 'vs/editor/common/config/commonEditorConfig';
import { Cursor } from 'vs/editor/common/controller/cursor';
import { ICursors, CursorConfiguration } from 'vs/editor/common/controller/cursorCommon';
import { Position, IPosition } from 'vs/editor/common/core/position';
import { Range, IRange } from 'vs/editor/common/core/range';
import { Selection, ISelection } from 'vs/editor/common/core/selection';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { ViewModel } from 'vs/editor/common/viewModel/viewModelImpl';
import { IModelContentChangedEvent, IModelDecorationsChangedEvent, IModelLanguageChangedEvent, IModelOptionsChangedEvent } from 'vs/editor/common/model/textModelEvents';
import * as editorOptions from 'vs/editor/common/config/editorOptions';
import { ICursorPositionChangedEvent, ICursorSelectionChangedEvent } from 'vs/editor/common/controller/cursorEvents';
export declare abstract class CommonCodeEditor extends Disposable implements editorCommon.ICommonCodeEditor {
    private readonly _onDidDispose;
    readonly onDidDispose: Event<void>;
    private readonly _onDidChangeModelContent;
    readonly onDidChangeModelContent: Event<IModelContentChangedEvent>;
    private readonly _onDidChangeModelLanguage;
    readonly onDidChangeModelLanguage: Event<IModelLanguageChangedEvent>;
    private readonly _onDidChangeModelOptions;
    readonly onDidChangeModelOptions: Event<IModelOptionsChangedEvent>;
    private readonly _onDidChangeModelDecorations;
    readonly onDidChangeModelDecorations: Event<IModelDecorationsChangedEvent>;
    private readonly _onDidChangeConfiguration;
    readonly onDidChangeConfiguration: Event<editorOptions.IConfigurationChangedEvent>;
    protected readonly _onDidChangeModel: Emitter<editorCommon.IModelChangedEvent>;
    readonly onDidChangeModel: Event<editorCommon.IModelChangedEvent>;
    private readonly _onDidChangeCursorPosition;
    readonly onDidChangeCursorPosition: Event<ICursorPositionChangedEvent>;
    private readonly _onDidChangeCursorSelection;
    readonly onDidChangeCursorSelection: Event<ICursorSelectionChangedEvent>;
    private readonly _onDidLayoutChange;
    readonly onDidLayoutChange: Event<editorOptions.EditorLayoutInfo>;
    protected readonly _onDidFocusEditorText: Emitter<void>;
    readonly onDidFocusEditorText: Event<void>;
    protected readonly _onDidBlurEditorText: Emitter<void>;
    readonly onDidBlurEditorText: Event<void>;
    protected readonly _onDidFocusEditor: Emitter<void>;
    readonly onDidFocusEditor: Event<void>;
    protected readonly _onDidBlurEditor: Emitter<void>;
    readonly onDidBlurEditor: Event<void>;
    private readonly _onWillType;
    readonly onWillType: Event<string>;
    private readonly _onDidType;
    readonly onDidType: Event<string>;
    private readonly _onDidPaste;
    readonly onDidPaste: Event<Range>;
    protected readonly domElement: IContextKeyServiceTarget;
    protected readonly id: number;
    protected readonly _configuration: CommonEditorConfiguration;
    protected _contributions: {
        [key: string]: editorCommon.IEditorContribution;
    };
    protected _actions: {
        [key: string]: editorCommon.IEditorAction;
    };
    protected model: editorCommon.IModel;
    protected listenersToRemove: IDisposable[];
    protected hasView: boolean;
    protected viewModel: ViewModel;
    protected cursor: Cursor;
    protected readonly _instantiationService: IInstantiationService;
    protected readonly _contextKeyService: IContextKeyService;
    /**
     * map from "parent" decoration type to live decoration ids.
     */
    private _decorationTypeKeysToIds;
    private _decorationTypeSubtypes;
    constructor(domElement: IContextKeyServiceTarget, options: editorOptions.IEditorOptions, instantiationService: IInstantiationService, contextKeyService: IContextKeyService);
    protected abstract _createConfiguration(options: editorOptions.IEditorOptions): CommonEditorConfiguration;
    getId(): string;
    getEditorType(): string;
    destroy(): void;
    dispose(): void;
    invokeWithinContext<T>(fn: (accessor: ServicesAccessor) => T): T;
    updateOptions(newOptions: editorOptions.IEditorOptions): void;
    getConfiguration(): editorOptions.InternalEditorOptions;
    getRawConfiguration(): editorOptions.IEditorOptions;
    getValue(options?: {
        preserveBOM: boolean;
        lineEnding: string;
    }): string;
    setValue(newValue: string): void;
    getModel(): editorCommon.IModel;
    setModel(model?: editorCommon.IModel): void;
    getCenteredRangeInViewport(): Range;
    getVisibleColumnFromPosition(rawPosition: IPosition): number;
    getPosition(): Position;
    setPosition(position: IPosition, reveal?: boolean, revealVerticalInCenter?: boolean, revealHorizontal?: boolean): void;
    private _sendRevealRange(modelRange, verticalType, revealHorizontal);
    revealLine(lineNumber: number): void;
    revealLineInCenter(lineNumber: number): void;
    revealLineInCenterIfOutsideViewport(lineNumber: number): void;
    private _revealLine(lineNumber, revealType);
    revealPosition(position: IPosition, revealVerticalInCenter?: boolean, revealHorizontal?: boolean): void;
    revealPositionInCenter(position: IPosition): void;
    revealPositionInCenterIfOutsideViewport(position: IPosition): void;
    private _revealPosition(position, verticalType, revealHorizontal);
    getSelection(): Selection;
    getSelections(): Selection[];
    setSelection(range: IRange, reveal?: boolean, revealVerticalInCenter?: boolean, revealHorizontal?: boolean): void;
    setSelection(editorRange: Range, reveal?: boolean, revealVerticalInCenter?: boolean, revealHorizontal?: boolean): void;
    setSelection(selection: ISelection, reveal?: boolean, revealVerticalInCenter?: boolean, revealHorizontal?: boolean): void;
    setSelection(editorSelection: Selection, reveal?: boolean, revealVerticalInCenter?: boolean, revealHorizontal?: boolean): void;
    private _setSelectionImpl(sel, reveal, revealVerticalInCenter, revealHorizontal);
    revealLines(startLineNumber: number, endLineNumber: number): void;
    revealLinesInCenter(startLineNumber: number, endLineNumber: number): void;
    revealLinesInCenterIfOutsideViewport(startLineNumber: number, endLineNumber: number): void;
    private _revealLines(startLineNumber, endLineNumber, verticalType);
    revealRange(range: IRange, revealVerticalInCenter?: boolean, revealHorizontal?: boolean): void;
    revealRangeInCenter(range: IRange): void;
    revealRangeInCenterIfOutsideViewport(range: IRange): void;
    revealRangeAtTop(range: IRange): void;
    private _revealRange(range, verticalType, revealHorizontal);
    setSelections(ranges: ISelection[]): void;
    getScrollWidth(): number;
    getScrollLeft(): number;
    getScrollHeight(): number;
    getScrollTop(): number;
    setScrollLeft(newScrollLeft: number): void;
    setScrollTop(newScrollTop: number): void;
    setScrollPosition(position: editorCommon.INewScrollPosition): void;
    saveViewState(): editorCommon.ICodeEditorViewState;
    restoreViewState(s: editorCommon.ICodeEditorViewState): void;
    onVisible(): void;
    onHide(): void;
    abstract layout(dimension?: editorCommon.IDimension): void;
    abstract focus(): void;
    abstract isFocused(): boolean;
    abstract hasWidgetFocus(): boolean;
    getContribution<T extends editorCommon.IEditorContribution>(id: string): T;
    getActions(): editorCommon.IEditorAction[];
    getSupportedActions(): editorCommon.IEditorAction[];
    getAction(id: string): editorCommon.IEditorAction;
    trigger(source: string, handlerId: string, payload: any): void;
    _getCursors(): ICursors;
    _getCursorConfiguration(): CursorConfiguration;
    pushUndoStop(): boolean;
    executeEdits(source: string, edits: editorCommon.IIdentifiedSingleEditOperation[], endCursorState?: Selection[]): boolean;
    executeCommand(source: string, command: editorCommon.ICommand): void;
    executeCommands(source: string, commands: editorCommon.ICommand[]): void;
    changeDecorations(callback: (changeAccessor: editorCommon.IModelDecorationsChangeAccessor) => any): any;
    getLineDecorations(lineNumber: number): editorCommon.IModelDecoration[];
    deltaDecorations(oldDecorations: string[], newDecorations: editorCommon.IModelDeltaDecoration[]): string[];
    setDecorations(decorationTypeKey: string, decorationOptions: editorCommon.IDecorationOptions[]): void;
    removeDecorations(decorationTypeKey: string): void;
    getLayoutInfo(): editorOptions.EditorLayoutInfo;
    protected _attachModel(model: editorCommon.IModel): void;
    protected abstract _scheduleAtNextAnimationFrame(callback: () => void): IDisposable;
    protected abstract _createView(): void;
    protected _postDetachModelCleanup(detachedModel: editorCommon.IModel): void;
    protected _detachModel(): editorCommon.IModel;
    protected abstract _registerDecorationType(key: string, options: editorCommon.IDecorationRenderOptions, parentTypeKey?: string): void;
    protected abstract _removeDecorationType(key: string): void;
    protected abstract _resolveDecorationOptions(typeKey: string, writable: boolean): editorCommon.IModelDecorationOptions;
    getTelemetryData(): {
        [key: string]: any;
    };
}