import { ILineChange } from 'vs/editor/common/editorCommon';
export declare class DiffComputer {
    constructor(originalLines: string[], modifiedLines: string[], shouldPostProcessCharChanges: boolean, shouldIgnoreTrimWhitespace: boolean);
    computeDiff(): ILineChange[];
}
