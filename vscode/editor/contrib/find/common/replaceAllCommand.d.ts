import { Range } from 'vs/editor/common/core/range';
import { Selection } from 'vs/editor/common/core/selection';
import * as editorCommon from 'vs/editor/common/editorCommon';
export declare class ReplaceAllCommand implements editorCommon.ICommand {
    private _editorSelection;
    private _trackedEditorSelectionId;
    private _ranges;
    private _replaceStrings;
    constructor(editorSelection: Selection, ranges: Range[], replaceStrings: string[]);
    getEditOperations(model: editorCommon.ITokenizedModel, builder: editorCommon.IEditOperationBuilder): void;
    computeCursorState(model: editorCommon.ITokenizedModel, helper: editorCommon.ICursorStateComputerData): Selection;
}
