import { Range } from 'vs/editor/common/core/range';
import { Selection } from 'vs/editor/common/core/selection';
import * as editorCommon from 'vs/editor/common/editorCommon';
export declare class BlockCommentCommand implements editorCommon.ICommand {
    private _selection;
    private _usedEndToken;
    constructor(selection: Selection);
    static _haystackHasNeedleAtOffset(haystack: string, needle: string, offset: number): boolean;
    private _createOperationsForBlockComment(selection, config, model, builder);
    static _createRemoveBlockCommentOperations(r: Range, startToken: string, endToken: string): editorCommon.IIdentifiedSingleEditOperation[];
    static _createAddBlockCommentOperations(r: Range, startToken: string, endToken: string): editorCommon.IIdentifiedSingleEditOperation[];
    getEditOperations(model: editorCommon.ITokenizedModel, builder: editorCommon.IEditOperationBuilder): void;
    computeCursorState(model: editorCommon.ITokenizedModel, helper: editorCommon.ICursorStateComputerData): Selection;
}
