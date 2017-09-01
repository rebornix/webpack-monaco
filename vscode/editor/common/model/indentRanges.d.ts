import { ITextModel } from 'vs/editor/common/editorCommon';
export declare class IndentRange {
    _indentRangeBrand: void;
    startLineNumber: number;
    endLineNumber: number;
    indent: number;
    constructor(startLineNumber: number, endLineNumber: number, indent: number);
    static deepCloneArr(indentRanges: IndentRange[]): IndentRange[];
}
export declare function computeRanges(model: ITextModel, minimumRangeSize?: number): IndentRange[];
