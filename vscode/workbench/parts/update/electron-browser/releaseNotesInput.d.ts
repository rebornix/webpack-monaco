import { TPromise } from 'vs/base/common/winjs.base';
import { EditorInput } from 'vs/workbench/common/editor';
export declare class ReleaseNotesInput extends EditorInput {
    private _version;
    private _text;
    static readonly ID: string;
    readonly version: string;
    readonly text: string;
    constructor(_version: string, _text: string);
    getTypeId(): string;
    getName(): string;
    matches(other: any): boolean;
    resolve(refresh?: boolean): TPromise<any>;
    supportsSplitEditor(): boolean;
}
