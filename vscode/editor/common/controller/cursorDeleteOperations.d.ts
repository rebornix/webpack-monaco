import { CursorConfiguration, ICursorSimpleModel, EditOperationResult } from 'vs/editor/common/controller/cursorCommon';
import { Selection } from 'vs/editor/common/core/selection';
import { ICommand } from 'vs/editor/common/editorCommon';
export declare class DeleteOperations {
    static deleteRight(config: CursorConfiguration, model: ICursorSimpleModel, selections: Selection[]): [boolean, ICommand[]];
    private static _isAutoClosingPairDelete(config, model, selections);
    private static _runAutoClosingPairDelete(config, model, selections);
    static deleteLeft(config: CursorConfiguration, model: ICursorSimpleModel, selections: Selection[]): [boolean, ICommand[]];
    static cut(config: CursorConfiguration, model: ICursorSimpleModel, selections: Selection[]): EditOperationResult;
}
