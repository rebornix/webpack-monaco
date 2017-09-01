import * as editorCommon from 'vs/editor/common/editorCommon';
import { Selection } from 'vs/editor/common/core/selection';
import { Position } from 'vs/editor/common/core/position';
export declare class DragAndDropCommand implements editorCommon.ICommand {
    private selection;
    private targetPosition;
    private targetSelection;
    private copy;
    constructor(selection: Selection, targetPosition: Position, copy: boolean);
    getEditOperations(model: editorCommon.ITokenizedModel, builder: editorCommon.IEditOperationBuilder): void;
    computeCursorState(model: editorCommon.ITokenizedModel, helper: editorCommon.ICursorStateComputerData): Selection;
}
