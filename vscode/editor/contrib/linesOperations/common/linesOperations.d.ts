import { ICommonCodeEditor } from 'vs/editor/common/editorCommon';
import { Range } from 'vs/editor/common/core/range';
import { Selection } from 'vs/editor/common/core/selection';
import { ServicesAccessor, EditorAction } from 'vs/editor/common/editorCommonExtensions';
export declare class TrimTrailingWhitespaceAction extends EditorAction {
    static ID: string;
    constructor();
    run(accessor: ServicesAccessor, editor: ICommonCodeEditor): void;
}
export declare class IndentLinesAction extends EditorAction {
    constructor();
    run(accessor: ServicesAccessor, editor: ICommonCodeEditor): void;
}
export declare class InsertLineBeforeAction extends EditorAction {
    constructor();
    run(accessor: ServicesAccessor, editor: ICommonCodeEditor): void;
}
export declare class InsertLineAfterAction extends EditorAction {
    constructor();
    run(accessor: ServicesAccessor, editor: ICommonCodeEditor): void;
}
export declare abstract class AbstractDeleteAllToBoundaryAction extends EditorAction {
    run(accessor: ServicesAccessor, editor: ICommonCodeEditor): void;
    /**
     * Compute the cursor state after the edit operations were applied.
     */
    protected abstract _getEndCursorState(primaryCursor: Range, rangesToDelete: Range[]): Selection[];
    protected abstract _getRangesToDelete(editor: ICommonCodeEditor): Range[];
}
export declare class DeleteAllLeftAction extends AbstractDeleteAllToBoundaryAction {
    constructor();
    _getEndCursorState(primaryCursor: Range, rangesToDelete: Range[]): Selection[];
    _getRangesToDelete(editor: ICommonCodeEditor): Range[];
}
export declare class DeleteAllRightAction extends AbstractDeleteAllToBoundaryAction {
    constructor();
    _getEndCursorState(primaryCursor: Range, rangesToDelete: Range[]): Selection[];
    _getRangesToDelete(editor: ICommonCodeEditor): Range[];
}
export declare class JoinLinesAction extends EditorAction {
    constructor();
    run(accessor: ServicesAccessor, editor: ICommonCodeEditor): void;
}
export declare class TransposeAction extends EditorAction {
    constructor();
    run(accessor: ServicesAccessor, editor: ICommonCodeEditor): void;
}
export declare abstract class AbstractCaseAction extends EditorAction {
    run(accessor: ServicesAccessor, editor: ICommonCodeEditor): void;
    protected abstract _modifyText(text: string): string;
}
export declare class UpperCaseAction extends AbstractCaseAction {
    constructor();
    protected _modifyText(text: string): string;
}
export declare class LowerCaseAction extends AbstractCaseAction {
    constructor();
    protected _modifyText(text: string): string;
}
