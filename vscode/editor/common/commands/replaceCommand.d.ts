import { Selection } from 'vs/editor/common/core/selection';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { Range } from 'vs/editor/common/core/range';
export declare class ReplaceCommand implements editorCommon.ICommand {
    private readonly _range;
    private readonly _text;
    readonly insertsAutoWhitespace: boolean;
    constructor(range: Range, text: string, insertsAutoWhitespace?: boolean);
    getEditOperations(model: editorCommon.ITokenizedModel, builder: editorCommon.IEditOperationBuilder): void;
    computeCursorState(model: editorCommon.ITokenizedModel, helper: editorCommon.ICursorStateComputerData): Selection;
}
export declare class ReplaceCommandWithoutChangingPosition implements editorCommon.ICommand {
    private readonly _range;
    private readonly _text;
    readonly insertsAutoWhitespace: boolean;
    constructor(range: Range, text: string, insertsAutoWhitespace?: boolean);
    getEditOperations(model: editorCommon.ITokenizedModel, builder: editorCommon.IEditOperationBuilder): void;
    computeCursorState(model: editorCommon.ITokenizedModel, helper: editorCommon.ICursorStateComputerData): Selection;
}
export declare class ReplaceCommandWithOffsetCursorState implements editorCommon.ICommand {
    private readonly _range;
    private readonly _text;
    private readonly _columnDeltaOffset;
    private readonly _lineNumberDeltaOffset;
    readonly insertsAutoWhitespace: boolean;
    constructor(range: Range, text: string, lineNumberDeltaOffset: number, columnDeltaOffset: number, insertsAutoWhitespace?: boolean);
    getEditOperations(model: editorCommon.ITokenizedModel, builder: editorCommon.IEditOperationBuilder): void;
    computeCursorState(model: editorCommon.ITokenizedModel, helper: editorCommon.ICursorStateComputerData): Selection;
}
export declare class ReplaceCommandThatPreservesSelection implements editorCommon.ICommand {
    private _range;
    private _text;
    private _initialSelection;
    private _selectionId;
    constructor(editRange: Range, text: string, initialSelection: Selection);
    getEditOperations(model: editorCommon.ITokenizedModel, builder: editorCommon.IEditOperationBuilder): void;
    computeCursorState(model: editorCommon.ITokenizedModel, helper: editorCommon.ICursorStateComputerData): Selection;
}
