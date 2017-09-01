import { IWorkerContext } from 'vs/editor/common/services/editorSimpleWorker';
import { ILink } from 'vs/editor/common/modes';
import { TPromise } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
export interface ICreateData {
    workspaceFolders: string[];
}
export interface IResourceCreator {
    toResource: (folderRelativePath: string) => URI;
}
export declare class OutputLinkComputer {
    private ctx;
    private patterns;
    constructor(ctx: IWorkerContext, createData: ICreateData);
    private computePatterns(createData);
    private getModel(uri);
    computeLinks(uri: string): TPromise<ILink[]>;
    static createPatterns(workspaceFolder: URI): RegExp[];
    /**
     * Detect links. Made public static to allow for tests.
     */
    static detectLinks(line: string, lineIndex: number, patterns: RegExp[], resourceCreator: IResourceCreator): ILink[];
}
export declare function create(ctx: IWorkerContext, createData: ICreateData): OutputLinkComputer;
