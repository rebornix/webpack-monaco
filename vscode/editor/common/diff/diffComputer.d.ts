import { ILineChange } from 'vs/editor/common/editorCommon';
export interface IDiffComputerOpts {
    shouldPostProcessCharChanges: boolean;
    shouldIgnoreTrimWhitespace: boolean;
    shouldConsiderTrimWhitespaceInEmptyCase: boolean;
    shouldMakePrettyDiff: boolean;
}
export declare class DiffComputer {
    private readonly shouldPostProcessCharChanges;
    private readonly shouldIgnoreTrimWhitespace;
    private readonly shouldMakePrettyDiff;
    private readonly maximumRunTimeMs;
    private readonly originalLines;
    private readonly modifiedLines;
    private readonly original;
    private readonly modified;
    private computationStartTime;
    constructor(originalLines: string[], modifiedLines: string[], opts: IDiffComputerOpts);
    computeDiff(): ILineChange[];
    private _pushTrimWhitespaceCharChange(result, originalLineNumber, originalStartColumn, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedEndColumn);
    private _mergeTrimWhitespaceCharChange(result, originalLineNumber, originalStartColumn, originalEndColumn, modifiedLineNumber, modifiedStartColumn, modifiedEndColumn);
    private _continueProcessingPredicate();
}
