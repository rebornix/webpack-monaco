import { TPromise } from 'vs/base/common/winjs.base';
import { EditorModel } from 'vs/workbench/common/editor';
import { IEditorModel } from 'vs/platform/editor/common/editor';
/**
 * The base editor model for the diff editor. It is made up of two editor models, the original version
 * and the modified version.
 */
export declare class DiffEditorModel extends EditorModel {
    protected _originalModel: IEditorModel;
    protected _modifiedModel: IEditorModel;
    constructor(originalModel: IEditorModel, modifiedModel: IEditorModel);
    readonly originalModel: EditorModel;
    readonly modifiedModel: EditorModel;
    load(): TPromise<EditorModel>;
    isResolved(): boolean;
    dispose(): void;
}
