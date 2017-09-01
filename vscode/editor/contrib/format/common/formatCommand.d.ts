import { Range } from 'vs/editor/common/core/range';
import { TextEdit } from 'vs/editor/common/modes';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { Selection } from 'vs/editor/common/core/selection';
export declare class EditOperationsCommand implements editorCommon.ICommand {
    static execute(editor: editorCommon.ICommonCodeEditor, edits: TextEdit[]): void;
    private _edits;
    private _newEol;
    private _initialSelection;
    private _selectionId;
    constructor(edits: TextEdit[], initialSelection: Selection);
    getEditOperations(model: editorCommon.ITokenizedModel, builder: editorCommon.IEditOperationBuilder): void;
    computeCursorState(model: editorCommon.ITokenizedModel, helper: editorCommon.ICursorStateComputerData): Selection;
    static fixLineTerminators(edit: editorCommon.ISingleEditOperation, model: editorCommon.ITokenizedModel): void;
    /**
     * This is used to minimize the edits by removing changes that appear on the edges of the range which are identical
     * to the current text.
     *
     * The reason this was introduced is to allow better selection tracking of the current cursor and solve
     * bug #15108. There the cursor was jumping since the tracked selection was in the middle of the range edit
     * and was lost.
     */
    static trimEdit(edit: editorCommon.ISingleEditOperation, model: editorCommon.ITokenizedModel): editorCommon.ISingleEditOperation;
    static _trimEdit(editRange: Range, editText: string, editForceMoveMarkers: boolean, model: editorCommon.ITokenizedModel): editorCommon.ISingleEditOperation;
}
