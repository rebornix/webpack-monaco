import { ColorId } from 'vs/editor/common/modes';
/**
 * A token on a line.
 */
export declare class ViewLineToken {
    _viewLineTokenBrand: void;
    /**
     * last char index of this token (not inclusive).
     */
    readonly endIndex: number;
    private readonly _metadata;
    constructor(endIndex: number, metadata: number);
    getForeground(): ColorId;
    getType(): string;
    getInlineStyle(colorMap: string[]): string;
    private static _equals(a, b);
    static equalsArr(a: ViewLineToken[], b: ViewLineToken[]): boolean;
}
export declare class ViewLineTokenFactory {
    static inflateArr(tokens: Uint32Array, lineLength: number): ViewLineToken[];
    static sliceAndInflate(tokens: Uint32Array, startOffset: number, endOffset: number, deltaOffset: number, lineLength: number): ViewLineToken[];
    static findIndexInSegmentsArray(tokens: Uint32Array, desiredIndex: number): number;
}
