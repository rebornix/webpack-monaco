import { Selection } from 'vs/editor/common/core/selection';
import * as editorCommon from 'vs/editor/common/editorCommon';
export declare class CopyLinesCommand implements editorCommon.ICommand {
    private _selection;
    private _isCopyingDown;
    private _selectionDirection;
    private _selectionId;
    private _startLineNumberDelta;
    private _endLineNumberDelta;
    constructor(selection: Selection, isCopyingDown: boolean);
    getEditOperations(model: editorCommon.ITokenizedModel, builder: editorCommon.IEditOperationBuilder): void;
    computeCursorState(model: editorCommon.ITokenizedModel, helper: editorCommon.ICursorStateComputerData): Selection;
}
