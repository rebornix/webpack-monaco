import { TPromise } from 'vs/base/common/winjs.base';
import { EditorInput } from 'vs/workbench/common/editor';
import { IExtension } from 'vs/workbench/parts/extensions/common/extensions';
import URI from 'vs/base/common/uri';
export declare class ExtensionsInput extends EditorInput {
    private _extension;
    static readonly ID: string;
    readonly extension: IExtension;
    constructor(_extension: IExtension);
    getTypeId(): string;
    getName(): string;
    matches(other: any): boolean;
    resolve(refresh?: boolean): TPromise<any>;
    supportsSplitEditor(): boolean;
    getResource(): URI;
}
