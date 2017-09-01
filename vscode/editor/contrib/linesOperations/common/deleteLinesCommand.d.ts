import { Selection } from 'vs/editor/common/core/selection';
import { ICommand, ICursorStateComputerData, IEditOperationBuilder, ITokenizedModel } from 'vs/editor/common/editorCommon';
export declare class DeleteLinesCommand implements ICommand {
    static createFromSelection(selection: Selection): DeleteLinesCommand;
    private startLineNumber;
    private endLineNumber;
    private restoreCursorToColumn;
    constructor(startLineNumber: number, endLineNumber: number, restoreCursorToColumn: number);
    getEditOperations(model: ITokenizedModel, builder: IEditOperationBuilder): void;
    computeCursorState(model: ITokenizedModel, helper: ICursorStateComputerData): Selection;
}
