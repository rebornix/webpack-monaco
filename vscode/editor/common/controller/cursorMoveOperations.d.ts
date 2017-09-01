import { SingleCursorState, CursorConfiguration, ICursorSimpleModel } from 'vs/editor/common/controller/cursorCommon';
export declare class CursorPosition {
    _cursorPositionBrand: void;
    readonly lineNumber: number;
    readonly column: number;
    readonly leftoverVisibleColumns: number;
    constructor(lineNumber: number, column: number, leftoverVisibleColumns: number);
}
export declare class MoveOperations {
    static left(config: CursorConfiguration, model: ICursorSimpleModel, lineNumber: number, column: number): CursorPosition;
    static moveLeft(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState, inSelectionMode: boolean, noOfColumns: number): SingleCursorState;
    static right(config: CursorConfiguration, model: ICursorSimpleModel, lineNumber: number, column: number): CursorPosition;
    static moveRight(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState, inSelectionMode: boolean, noOfColumns: number): SingleCursorState;
    static down(config: CursorConfiguration, model: ICursorSimpleModel, lineNumber: number, column: number, leftoverVisibleColumns: number, count: number, allowMoveOnLastLine: boolean): CursorPosition;
    static moveDown(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState, inSelectionMode: boolean, linesCount: number): SingleCursorState;
    static translateDown(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState): SingleCursorState;
    static up(config: CursorConfiguration, model: ICursorSimpleModel, lineNumber: number, column: number, leftoverVisibleColumns: number, count: number, allowMoveOnFirstLine: boolean): CursorPosition;
    static moveUp(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState, inSelectionMode: boolean, linesCount: number): SingleCursorState;
    static translateUp(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState): SingleCursorState;
    static moveToBeginningOfLine(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState, inSelectionMode: boolean): SingleCursorState;
    static moveToEndOfLine(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState, inSelectionMode: boolean): SingleCursorState;
    static moveToBeginningOfBuffer(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState, inSelectionMode: boolean): SingleCursorState;
    static moveToEndOfBuffer(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState, inSelectionMode: boolean): SingleCursorState;
}
