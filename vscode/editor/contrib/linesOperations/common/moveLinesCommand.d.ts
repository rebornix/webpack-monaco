import { Selection } from 'vs/editor/common/core/selection';
import { ICommand, ICursorStateComputerData, IEditOperationBuilder, ITokenizedModel } from 'vs/editor/common/editorCommon';
export declare class MoveLinesCommand implements ICommand {
    private _selection;
    private _isMovingDown;
    private _autoIndent;
    private _selectionId;
    private _moveEndPositionDown;
    private _moveEndLineSelectionShrink;
    constructor(selection: Selection, isMovingDown: boolean, autoIndent: boolean);
    getEditOperations(model: ITokenizedModel, builder: IEditOperationBuilder): void;
    private buildIndentConverter(tabSize);
    private matchEnterRule(model, indentConverter, tabSize, line, oneLineAbove, oneLineAboveText?);
    private trimLeft(str);
    private shouldAutoIndent(model, selection);
    private getIndentEditsOfMovingBlock(model, builder, s, tabSize, insertSpaces, offset);
    computeCursorState(model: ITokenizedModel, helper: ICursorStateComputerData): Selection;
}
