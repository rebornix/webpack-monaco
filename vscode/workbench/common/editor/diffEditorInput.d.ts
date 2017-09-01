import { TPromise } from 'vs/base/common/winjs.base';
import { EditorModel, EditorInput, SideBySideEditorInput } from 'vs/workbench/common/editor';
/**
 * The base editor input for the diff editor. It is made up of two editor inputs, the original version
 * and the modified version.
 */
export declare class DiffEditorInput extends SideBySideEditorInput {
    private forceOpenAsBinary;
    static ID: string;
    private cachedModel;
    constructor(name: string, description: string, original: EditorInput, modified: EditorInput, forceOpenAsBinary?: boolean);
    getTypeId(): string;
    readonly originalInput: EditorInput;
    readonly modifiedInput: EditorInput;
    resolve(refresh?: boolean): TPromise<EditorModel>;
    getPreferredEditorId(candidates: string[]): string;
    private createModel(refresh?);
    dispose(): void;
}
