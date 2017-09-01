import { Position } from 'vs/editor/common/core/position';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { Selection } from 'vs/editor/common/core/selection';
export declare class TrimTrailingWhitespaceCommand implements editorCommon.ICommand {
    private selection;
    private selectionId;
    constructor(selection: Selection);
    getEditOperations(model: editorCommon.ITokenizedModel, builder: editorCommon.IEditOperationBuilder): void;
    computeCursorState(model: editorCommon.ITokenizedModel, helper: editorCommon.ICursorStateComputerData): Selection;
}
/**
 * Generate commands for trimming trailing whitespace on a model and ignore lines on which cursors are sitting.
 */
export declare function trimTrailingWhitespace(model: editorCommon.ITextModel, cursors: Position[]): editorCommon.IIdentifiedSingleEditOperation[];
