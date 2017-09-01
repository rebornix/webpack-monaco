import { InlineDecoration } from 'vs/editor/common/viewModel/viewModel';
export declare class LineDecoration {
    _lineDecorationBrand: void;
    readonly startColumn: number;
    readonly endColumn: number;
    readonly className: string;
    readonly insertsBeforeOrAfter: boolean;
    constructor(startColumn: number, endColumn: number, className: string, insertsBeforeOrAfter: boolean);
    private static _equals(a, b);
    static equalsArr(a: LineDecoration[], b: LineDecoration[]): boolean;
    static filter(lineDecorations: InlineDecoration[], lineNumber: number, minLineColumn: number, maxLineColumn: number): LineDecoration[];
    static compare(a: LineDecoration, b: LineDecoration): number;
}
export declare class DecorationSegment {
    startOffset: number;
    endOffset: number;
    className: string;
    constructor(startOffset: number, endOffset: number, className: string);
}
export declare class LineDecorationsNormalizer {
    /**
     * Normalize line decorations. Overlapping decorations will generate multiple segments
     */
    static normalize(lineDecorations: LineDecoration[]): DecorationSegment[];
}
