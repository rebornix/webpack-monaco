import { Selection } from 'vs/editor/common/core/selection';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { Range } from 'vs/editor/common/core/range';
export declare class InPlaceReplaceCommand implements editorCommon.ICommand {
    private _editRange;
    private _originalSelection;
    private _text;
    constructor(editRange: Range, originalSelection: Selection, text: string);
    getEditOperations(model: editorCommon.ITokenizedModel, builder: editorCommon.IEditOperationBuilder): void;
    computeCursorState(model: editorCommon.ITokenizedModel, helper: editorCommon.ICursorStateComputerData): Selection;
}
