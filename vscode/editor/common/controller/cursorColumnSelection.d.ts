import { Selection } from 'vs/editor/common/core/selection';
import { SingleCursorState, CursorConfiguration, ICursorSimpleModel } from 'vs/editor/common/controller/cursorCommon';
export interface IColumnSelectResult {
    viewStates: SingleCursorState[];
    reversed: boolean;
    toLineNumber: number;
    toVisualColumn: number;
}
export declare class ColumnSelection {
    private static _columnSelect(config, model, fromLineNumber, fromVisibleColumn, toLineNumber, toVisibleColumn);
    static columnSelect(config: CursorConfiguration, model: ICursorSimpleModel, fromViewSelection: Selection, toViewLineNumber: number, toViewVisualColumn: number): IColumnSelectResult;
    static columnSelectLeft(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState, toViewLineNumber: number, toViewVisualColumn: number): IColumnSelectResult;
    static columnSelectRight(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState, toViewLineNumber: number, toViewVisualColumn: number): IColumnSelectResult;
    static columnSelectUp(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState, isPaged: boolean, toViewLineNumber: number, toViewVisualColumn: number): IColumnSelectResult;
    static columnSelectDown(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState, isPaged: boolean, toViewLineNumber: number, toViewVisualColumn: number): IColumnSelectResult;
}
