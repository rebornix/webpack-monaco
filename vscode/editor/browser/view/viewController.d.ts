import { IKeyboardEvent } from 'vs/base/browser/keyboardEvent';
import { Position } from 'vs/editor/common/core/position';
import { Selection } from 'vs/editor/common/core/selection';
import { IEditorMouseEvent } from 'vs/editor/browser/editorBrowser';
import { ICommandService } from 'vs/platform/commands/common/commands';
import { IViewModel } from 'vs/editor/common/viewModel/viewModel';
import { ViewOutgoingEvents } from 'vs/editor/browser/view/viewOutgoingEvents';
import { CoreEditorCommand } from 'vs/editor/common/controller/coreCommands';
import { Configuration } from 'vs/editor/browser/config/configuration';
export interface ExecCoreEditorCommandFunc {
    (editorCommand: CoreEditorCommand, args: any): void;
}
export interface IMouseDispatchData {
    position: Position;
    /**
     * Desired mouse column (e.g. when position.column gets clamped to text length -- clicking after text on a line).
     */
    mouseColumn: number;
    startedOnLineNumbers: boolean;
    inSelectionMode: boolean;
    mouseDownCount: number;
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
}
export declare class ViewController {
    private readonly configuration;
    private readonly viewModel;
    private readonly _execCoreEditorCommandFunc;
    private readonly outgoingEvents;
    private readonly commandService;
    constructor(configuration: Configuration, viewModel: IViewModel, execCommandFunc: ExecCoreEditorCommandFunc, outgoingEvents: ViewOutgoingEvents, commandService: ICommandService);
    private _execMouseCommand(editorCommand, args);
    paste(source: string, text: string, pasteOnNewLine: boolean): void;
    type(source: string, text: string): void;
    replacePreviousChar(source: string, text: string, replaceCharCnt: number): void;
    compositionStart(source: string): void;
    compositionEnd(source: string): void;
    cut(source: string): void;
    setSelection(source: string, modelSelection: Selection): void;
    private _validateViewColumn(viewPosition);
    private _hasMulticursorModifier(data);
    private _hasNonMulticursorModifier(data);
    dispatchMouse(data: IMouseDispatchData): void;
    private _usualArgs(viewPosition);
    moveTo(viewPosition: Position): void;
    private moveToSelect(viewPosition);
    private columnSelect(viewPosition, mouseColumn);
    private createCursor(viewPosition, wholeLine);
    private lastCursorMoveToSelect(viewPosition);
    private wordSelect(viewPosition);
    private wordSelectDrag(viewPosition);
    private lastCursorWordSelect(viewPosition);
    private lineSelect(viewPosition);
    private lineSelectDrag(viewPosition);
    private lastCursorLineSelect(viewPosition);
    private lastCursorLineSelectDrag(viewPosition);
    private selectAll();
    private convertViewToModelPosition(viewPosition);
    emitKeyDown(e: IKeyboardEvent): void;
    emitKeyUp(e: IKeyboardEvent): void;
    emitContextMenu(e: IEditorMouseEvent): void;
    emitMouseMove(e: IEditorMouseEvent): void;
    emitMouseLeave(e: IEditorMouseEvent): void;
    emitMouseUp(e: IEditorMouseEvent): void;
    emitMouseDown(e: IEditorMouseEvent): void;
    emitMouseDrag(e: IEditorMouseEvent): void;
    emitMouseDrop(e: IEditorMouseEvent): void;
}
