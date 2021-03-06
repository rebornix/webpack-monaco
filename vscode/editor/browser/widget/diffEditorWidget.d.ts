import 'vs/css!./media/diffEditor';
import { Disposable } from 'vs/base/common/lifecycle';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { ICodeEditorService } from 'vs/editor/common/services/codeEditorService';
import { Range, IRange } from 'vs/editor/common/core/range';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { IEditorWorkerService } from 'vs/editor/common/services/editorWorkerService';
import * as editorBrowser from 'vs/editor/browser/editorBrowser';
import { CodeEditor } from 'vs/editor/browser/codeEditor';
import { Position, IPosition } from 'vs/editor/common/core/position';
import { Selection, ISelection } from 'vs/editor/common/core/selection';
import Event from 'vs/base/common/event';
import * as editorOptions from 'vs/editor/common/config/editorOptions';
import { IThemeService } from 'vs/platform/theme/common/themeService';
import { IMessageService } from 'vs/platform/message/common/message';
export declare class DiffEditorWidget extends Disposable implements editorBrowser.IDiffEditor {
    private static ONE_OVERVIEW_WIDTH;
    static ENTIRE_DIFF_OVERVIEW_WIDTH: number;
    private static UPDATE_DIFF_DECORATIONS_DELAY;
    private readonly _onDidDispose;
    readonly onDidDispose: Event<void>;
    private readonly _onDidUpdateDiff;
    readonly onDidUpdateDiff: Event<void>;
    private readonly id;
    private _domElement;
    protected readonly _containerDomElement: HTMLElement;
    private readonly _overviewDomElement;
    private readonly _overviewViewportDomElement;
    private _width;
    private _height;
    private _reviewHeight;
    private readonly _measureDomElementToken;
    private originalEditor;
    private _originalDomNode;
    private _originalEditorState;
    private _originalOverviewRuler;
    private modifiedEditor;
    private _modifiedDomNode;
    private _modifiedEditorState;
    private _modifiedOverviewRuler;
    private _currentlyChangingViewZones;
    private _beginUpdateDecorationsTimeout;
    private _diffComputationToken;
    private _lineChanges;
    private _isVisible;
    private _isHandlingScrollEvent;
    private _ignoreTrimWhitespace;
    private _originalIsEditable;
    private _renderSideBySide;
    private _renderIndicators;
    private _enableSplitViewResizing;
    private _strategy;
    private _updateDecorationsRunner;
    private _editorWorkerService;
    protected _contextKeyService: IContextKeyService;
    private _codeEditorService;
    private _themeService;
    private readonly _messageService;
    private _reviewPane;
    constructor(domElement: HTMLElement, options: editorOptions.IDiffEditorOptions, editorWorkerService: IEditorWorkerService, contextKeyService: IContextKeyService, instantiationService: IInstantiationService, codeEditorService: ICodeEditorService, themeService: IThemeService, messageService: IMessageService);
    readonly ignoreTrimWhitespace: boolean;
    readonly renderSideBySide: boolean;
    readonly renderIndicators: boolean;
    hasWidgetFocus(): boolean;
    diffReviewNext(): void;
    diffReviewPrev(): void;
    private static _getClassName(theme, renderSideBySide);
    private _recreateOverviewRulers();
    private _createLeftHandSide();
    private _createRightHandSide();
    private _createLeftHandSideEditor(options, instantiationService);
    private _createRightHandSideEditor(options, instantiationService);
    protected _createInnerEditor(instantiationService: IInstantiationService, container: HTMLElement, options: editorOptions.IEditorOptions): CodeEditor;
    destroy(): void;
    dispose(): void;
    getId(): string;
    getEditorType(): string;
    getLineChanges(): editorCommon.ILineChange[];
    getOriginalEditor(): editorBrowser.ICodeEditor;
    getModifiedEditor(): editorBrowser.ICodeEditor;
    updateOptions(newOptions: editorOptions.IDiffEditorOptions): void;
    getValue(options?: {
        preserveBOM: boolean;
        lineEnding: string;
    }): string;
    getModel(): editorCommon.IDiffEditorModel;
    setModel(model: editorCommon.IDiffEditorModel): void;
    getDomNode(): HTMLElement;
    getVisibleColumnFromPosition(position: IPosition): number;
    getPosition(): Position;
    setPosition(position: IPosition, reveal?: boolean, revealVerticalInCenter?: boolean, revealHorizontal?: boolean): void;
    revealLine(lineNumber: number): void;
    revealLineInCenter(lineNumber: number): void;
    revealLineInCenterIfOutsideViewport(lineNumber: number): void;
    revealPosition(position: IPosition, revealVerticalInCenter?: boolean, revealHorizontal?: boolean): void;
    revealPositionInCenter(position: IPosition): void;
    revealPositionInCenterIfOutsideViewport(position: IPosition): void;
    getSelection(): Selection;
    getSelections(): Selection[];
    setSelection(range: IRange, reveal?: boolean, revealVerticalInCenter?: boolean, revealHorizontal?: boolean): void;
    setSelection(editorRange: Range, reveal?: boolean, revealVerticalInCenter?: boolean, revealHorizontal?: boolean): void;
    setSelection(selection: ISelection, reveal?: boolean, revealVerticalInCenter?: boolean, revealHorizontal?: boolean): void;
    setSelection(editorSelection: Selection, reveal?: boolean, revealVerticalInCenter?: boolean, revealHorizontal?: boolean): void;
    setSelections(ranges: ISelection[]): void;
    revealLines(startLineNumber: number, endLineNumber: number): void;
    revealLinesInCenter(startLineNumber: number, endLineNumber: number): void;
    revealLinesInCenterIfOutsideViewport(startLineNumber: number, endLineNumber: number): void;
    revealRange(range: IRange, revealVerticalInCenter?: boolean, revealHorizontal?: boolean): void;
    revealRangeInCenter(range: IRange): void;
    revealRangeInCenterIfOutsideViewport(range: IRange): void;
    revealRangeAtTop(range: IRange): void;
    getActions(): editorCommon.IEditorAction[];
    getSupportedActions(): editorCommon.IEditorAction[];
    getAction(id: string): editorCommon.IEditorAction;
    saveViewState(): editorCommon.IDiffEditorViewState;
    restoreViewState(s: editorCommon.IDiffEditorViewState): void;
    layout(dimension?: editorCommon.IDimension): void;
    focus(): void;
    isFocused(): boolean;
    onVisible(): void;
    onHide(): void;
    trigger(source: string, handlerId: string, payload: any): void;
    changeDecorations(callback: (changeAccessor: editorCommon.IModelDecorationsChangeAccessor) => any): any;
    private _measureDomElement(forceDoLayoutCall, dimensions?);
    private _layoutOverviewRulers();
    private _onViewZonesChanged();
    private _beginUpdateDecorationsSoon();
    private _lastOriginalWarning;
    private _lastModifiedWarning;
    private static _equals(a, b);
    private _beginUpdateDecorations();
    private _cleanViewZonesAndDecorations();
    private _updateDecorations();
    private _adjustOptionsForSubEditor(options);
    private _adjustOptionsForLeftHandSide(options, isEditable);
    private _adjustOptionsForRightHandSide(options);
    doLayout(): void;
    private _doLayout();
    private _layoutOverviewViewport();
    private _computeOverviewViewport();
    private _createDataSource();
    private _setStrategy(newStrategy);
    private _getLineChangeAtOrBeforeLineNumber(lineNumber, startLineNumberExtractor);
    private _getEquivalentLineForOriginalLineNumber(lineNumber);
    private _getEquivalentLineForModifiedLineNumber(lineNumber);
    getDiffLineInformationForOriginal(lineNumber: number): editorCommon.IDiffLineInformation;
    getDiffLineInformationForModified(lineNumber: number): editorCommon.IDiffLineInformation;
}
