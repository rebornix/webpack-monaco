import { HistoryNavigator } from 'vs/base/common/history';
import { Disposable } from 'vs/base/common/lifecycle';
import { ContextKeyExpr, RawContextKey, IContextKeyService } from 'vs/platform/contextkey/common/contextkey';
import { Selection } from 'vs/editor/common/core/selection';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { ServicesAccessor, EditorAction } from 'vs/editor/common/editorCommonExtensions';
import { FindReplaceState } from 'vs/editor/contrib/find/common/findState';
import { Delayer } from 'vs/base/common/async';
import { IStorageService } from 'vs/platform/storage/common/storage';
export declare const enum FindStartFocusAction {
    NoFocusChange = 0,
    FocusFindInput = 1,
    FocusReplaceInput = 2,
}
export interface IFindStartOptions {
    forceRevealReplace: boolean;
    seedSearchStringFromSelection: boolean;
    shouldFocus: FindStartFocusAction;
    shouldAnimate: boolean;
}
export declare const CONTEXT_FIND_WIDGET_VISIBLE: RawContextKey<boolean>;
export declare const CONTEXT_FIND_WIDGET_NOT_VISIBLE: ContextKeyExpr;
export declare const CONTEXT_FIND_INPUT_FOCUSED: RawContextKey<boolean>;
export declare class CommonFindController extends Disposable implements editorCommon.IEditorContribution {
    private static ID;
    private _editor;
    private _findWidgetVisible;
    protected _state: FindReplaceState;
    private _currentHistoryNavigator;
    protected _updateHistoryDelayer: Delayer<void>;
    private _model;
    private _storageService;
    static get(editor: editorCommon.ICommonCodeEditor): CommonFindController;
    constructor(editor: editorCommon.ICommonCodeEditor, contextKeyService: IContextKeyService, storageService: IStorageService);
    dispose(): void;
    private disposeModel();
    getId(): string;
    private _onStateChanged(e);
    private saveQueryState(e);
    private loadQueryState();
    protected _delayedUpdateHistory(): void;
    protected _updateHistory(): void;
    getState(): FindReplaceState;
    getHistory(): HistoryNavigator<string>;
    closeFindWidget(): void;
    toggleCaseSensitive(): void;
    toggleWholeWords(): void;
    toggleRegex(): void;
    toggleSearchScope(): void;
    setSearchString(searchString: string): void;
    highlightFindOptions(): void;
    protected _start(opts: IFindStartOptions): void;
    start(opts: IFindStartOptions): void;
    moveToNextMatch(): boolean;
    moveToPrevMatch(): boolean;
    replace(): boolean;
    replaceAll(): boolean;
    selectAllMatches(): boolean;
    showPreviousFindTerm(): boolean;
    showNextFindTerm(): boolean;
}
export declare class StartFindAction extends EditorAction {
    constructor();
    run(accessor: ServicesAccessor, editor: editorCommon.ICommonCodeEditor): void;
}
export declare abstract class MatchFindAction extends EditorAction {
    run(accessor: ServicesAccessor, editor: editorCommon.ICommonCodeEditor): void;
    protected abstract _run(controller: CommonFindController): boolean;
}
export declare class NextMatchFindAction extends MatchFindAction {
    constructor();
    protected _run(controller: CommonFindController): boolean;
}
export declare class PreviousMatchFindAction extends MatchFindAction {
    constructor();
    protected _run(controller: CommonFindController): boolean;
}
export declare abstract class SelectionMatchFindAction extends EditorAction {
    run(accessor: ServicesAccessor, editor: editorCommon.ICommonCodeEditor): void;
    protected abstract _run(controller: CommonFindController): boolean;
}
export declare class NextSelectionMatchFindAction extends SelectionMatchFindAction {
    constructor();
    protected _run(controller: CommonFindController): boolean;
}
export declare class PreviousSelectionMatchFindAction extends SelectionMatchFindAction {
    constructor();
    protected _run(controller: CommonFindController): boolean;
}
export declare class StartFindReplaceAction extends EditorAction {
    constructor();
    run(accessor: ServicesAccessor, editor: editorCommon.ICommonCodeEditor): void;
}
export interface IMultiCursorFindInput {
    changeFindSearchString: boolean;
    allowMultiline: boolean;
    highlightFindOptions: boolean;
}
export interface IMultiCursorFindResult {
    searchText: string;
    matchCase: boolean;
    wholeWord: boolean;
    currentMatch: Selection;
}
export declare abstract class SelectNextFindMatchAction extends EditorAction {
    protected _getNextMatch(editor: editorCommon.ICommonCodeEditor): Selection;
}
export declare abstract class SelectPreviousFindMatchAction extends EditorAction {
    protected _getPreviousMatch(editor: editorCommon.ICommonCodeEditor): Selection;
}
export declare class AddSelectionToNextFindMatchAction extends SelectNextFindMatchAction {
    constructor();
    run(accessor: ServicesAccessor, editor: editorCommon.ICommonCodeEditor): void;
}
export declare class AddSelectionToPreviousFindMatchAction extends SelectPreviousFindMatchAction {
    constructor();
    run(accessor: ServicesAccessor, editor: editorCommon.ICommonCodeEditor): void;
}
export declare class MoveSelectionToNextFindMatchAction extends SelectNextFindMatchAction {
    constructor();
    run(accessor: ServicesAccessor, editor: editorCommon.ICommonCodeEditor): void;
}
export declare class MoveSelectionToPreviousFindMatchAction extends SelectPreviousFindMatchAction {
    constructor();
    run(accessor: ServicesAccessor, editor: editorCommon.ICommonCodeEditor): void;
}
export declare abstract class AbstractSelectHighlightsAction extends EditorAction {
    run(accessor: ServicesAccessor, editor: editorCommon.ICommonCodeEditor): void;
}
export declare class SelectHighlightsAction extends AbstractSelectHighlightsAction {
    constructor();
}
export declare class CompatChangeAll extends AbstractSelectHighlightsAction {
    constructor();
}
export declare class SelectionHighlighter extends Disposable implements editorCommon.IEditorContribution {
    private static ID;
    private editor;
    private _isEnabled;
    private decorations;
    private updateSoon;
    private state;
    constructor(editor: editorCommon.ICommonCodeEditor);
    getId(): string;
    private _update();
    private static _createState(isEnabled, editor);
    private _setState(state);
    private static _SELECTION_HIGHLIGHT_OVERVIEW;
    private static _SELECTION_HIGHLIGHT;
    dispose(): void;
}
export declare class ShowNextFindTermAction extends MatchFindAction {
    constructor();
    protected _run(controller: CommonFindController): boolean;
}
export declare class ShpwPreviousFindTermAction extends MatchFindAction {
    constructor();
    protected _run(controller: CommonFindController): boolean;
}
