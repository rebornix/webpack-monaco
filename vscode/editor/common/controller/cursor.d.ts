import { Position } from 'vs/editor/common/core/position';
import { Range } from 'vs/editor/common/core/range';
import { Selection, ISelection } from 'vs/editor/common/core/selection';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { CursorContext, CursorState, RevealTarget, IColumnSelectData, ICursors } from 'vs/editor/common/controller/cursorCommon';
import { CursorChangeReason } from 'vs/editor/common/controller/cursorEvents';
import { IViewModel } from 'vs/editor/common/viewModel/viewModel';
import * as viewEvents from 'vs/editor/common/view/viewEvents';
import Event from 'vs/base/common/event';
export declare class CursorStateChangedEvent {
    /**
     * The new selections.
     * The primary selection is always at index 0.
     */
    readonly selections: Selection[];
    /**
     * Source of the call that caused the event.
     */
    readonly source: string;
    /**
     * Reason.
     */
    readonly reason: CursorChangeReason;
    constructor(selections: Selection[], source: string, reason: CursorChangeReason);
}
/**
 * A snapshot of the cursor and the model state
 */
export declare class CursorModelState {
    readonly modelVersionId: number;
    readonly cursorState: CursorState[];
    constructor(model: editorCommon.IModel, cursor: Cursor);
    equals(other: CursorModelState): boolean;
}
export declare class Cursor extends viewEvents.ViewEventEmitter implements ICursors {
    private readonly _onDidChange;
    readonly onDidChange: Event<CursorStateChangedEvent>;
    private readonly _configuration;
    private readonly _model;
    private readonly _viewModel;
    context: CursorContext;
    private _cursors;
    private _isHandling;
    private _isDoingComposition;
    private _columnSelectData;
    constructor(configuration: editorCommon.IConfiguration, model: editorCommon.IModel, viewModel: IViewModel);
    dispose(): void;
    getPrimaryCursor(): CursorState;
    getLastAddedCursorIndex(): number;
    getAll(): CursorState[];
    setStates(source: string, reason: CursorChangeReason, states: CursorState[]): void;
    setColumnSelectData(columnSelectData: IColumnSelectData): void;
    reveal(horizontal: boolean, target: RevealTarget): void;
    revealRange(revealHorizontal: boolean, viewRange: Range, verticalType: viewEvents.VerticalRevealType): void;
    scrollTo(desiredScrollTop: number): void;
    saveState(): editorCommon.ICursorState[];
    restoreState(states: editorCommon.ICursorState[]): void;
    private _onModelContentChanged(hadFlushEvent);
    getSelection(): Selection;
    getColumnSelectData(): IColumnSelectData;
    getSelections(): Selection[];
    getViewSelections(): Selection[];
    getPosition(): Position;
    setSelections(source: string, selections: ISelection[]): void;
    private _executeEditOperation(opResult);
    private _interpretCommandResult(cursorState);
    private _emitStateChangedIfNecessary(source, reason, oldState);
    private _revealRange(revealTarget, verticalType, revealHorizontal);
    emitCursorRevealRange(viewRange: Range, verticalType: viewEvents.VerticalRevealType, revealHorizontal: boolean): void;
    trigger(source: string, handlerId: string, payload: any): void;
    private _type(source, text);
    private _replacePreviousChar(text, replaceCharCnt);
    private _paste(text, pasteOnNewLine);
    private _cut();
    private _externalExecuteCommand(command);
    private _externalExecuteCommands(commands);
}
