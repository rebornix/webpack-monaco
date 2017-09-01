import { Selection } from 'vs/editor/common/core/selection';
import { ICommand, ICursorStateComputerData, IEditOperationBuilder, ITokenizedModel } from 'vs/editor/common/editorCommon';
export interface IShiftCommandOpts {
    isUnshift: boolean;
    tabSize: number;
    oneIndent: string;
    useTabStops: boolean;
}
export declare class ShiftCommand implements ICommand {
    static unshiftIndentCount(line: string, column: number, tabSize: number): number;
    static shiftIndentCount(line: string, column: number, tabSize: number): number;
    private _opts;
    private _selection;
    private _selectionId;
    private _useLastEditRangeForCursorEndPosition;
    private _selectionStartColumnStaysPut;
    constructor(range: Selection, opts: IShiftCommandOpts);
    private _addEditOperation(builder, range, text);
    getEditOperations(model: ITokenizedModel, builder: IEditOperationBuilder): void;
    computeCursorState(model: ITokenizedModel, helper: ICursorStateComputerData): Selection;
}
