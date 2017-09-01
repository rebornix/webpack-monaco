import { Selection } from 'vs/editor/common/core/selection';
import { ICommand, ICursorStateComputerData, IEditOperationBuilder, ITokenizedModel } from 'vs/editor/common/editorCommon';
export declare class MoveCaretCommand implements ICommand {
    private _selection;
    private _isMovingLeft;
    private _cutStartIndex;
    private _cutEndIndex;
    private _moved;
    private _selectionId;
    constructor(selection: Selection, isMovingLeft: boolean);
    getEditOperations(model: ITokenizedModel, builder: IEditOperationBuilder): void;
    computeCursorState(model: ITokenizedModel, helper: ICursorStateComputerData): Selection;
}
