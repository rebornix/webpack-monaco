import { ICursorStateComputer, IEditableTextModel, IIdentifiedSingleEditOperation } from 'vs/editor/common/editorCommon';
import { Selection } from 'vs/editor/common/core/selection';
export interface IUndoRedoResult {
    selections: Selection[];
    recordedVersionId: number;
}
export declare class EditStack {
    private model;
    private currentOpenStackElement;
    private past;
    private future;
    constructor(model: IEditableTextModel);
    pushStackElement(): void;
    clear(): void;
    pushEditOperation(beforeCursorState: Selection[], editOperations: IIdentifiedSingleEditOperation[], cursorStateComputer: ICursorStateComputer): Selection[];
    undo(): IUndoRedoResult;
    redo(): IUndoRedoResult;
}
