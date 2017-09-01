import { TPromise } from 'vs/base/common/winjs.base';
import { IDiffEditorModel } from 'vs/editor/common/editorCommon';
import { EditorModel } from 'vs/workbench/common/editor';
import { BaseTextEditorModel } from 'vs/workbench/common/editor/textEditorModel';
import { DiffEditorModel } from 'vs/workbench/common/editor/diffEditorModel';
/**
 * The base text editor model for the diff editor. It is made up of two text editor models, the original version
 * and the modified version.
 */
export declare class TextDiffEditorModel extends DiffEditorModel {
    private _textDiffEditorModel;
    constructor(originalModel: BaseTextEditorModel, modifiedModel: BaseTextEditorModel);
    readonly originalModel: BaseTextEditorModel;
    readonly modifiedModel: BaseTextEditorModel;
    load(): TPromise<EditorModel>;
    private updateTextDiffEditorModel();
    readonly textDiffEditorModel: IDiffEditorModel;
    isResolved(): boolean;
    dispose(): void;
}
