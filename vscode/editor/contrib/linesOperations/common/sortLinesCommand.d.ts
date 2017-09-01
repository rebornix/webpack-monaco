import * as editorCommon from 'vs/editor/common/editorCommon';
import { Selection } from 'vs/editor/common/core/selection';
export declare class SortLinesCommand implements editorCommon.ICommand {
    private selection;
    private selectionId;
    private descending;
    constructor(selection: Selection, descending: boolean);
    getEditOperations(model: editorCommon.ITokenizedModel, builder: editorCommon.IEditOperationBuilder): void;
    computeCursorState(model: editorCommon.ITokenizedModel, helper: editorCommon.ICursorStateComputerData): Selection;
    static canRun(model: editorCommon.ITextModel, selection: Selection, descending: boolean): boolean;
}
