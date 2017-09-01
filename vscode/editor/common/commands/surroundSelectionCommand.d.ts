import { Selection } from 'vs/editor/common/core/selection';
import { ICommand, ICursorStateComputerData, IEditOperationBuilder, ITokenizedModel } from 'vs/editor/common/editorCommon';
export declare class SurroundSelectionCommand implements ICommand {
    private _range;
    private _charBeforeSelection;
    private _charAfterSelection;
    constructor(range: Selection, charBeforeSelection: string, charAfterSelection: string);
    getEditOperations(model: ITokenizedModel, builder: IEditOperationBuilder): void;
    computeCursorState(model: ITokenizedModel, helper: ICursorStateComputerData): Selection;
}
