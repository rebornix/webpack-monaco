import { ViewLineToken } from 'vs/editor/common/core/viewLineToken';
import { LineDecoration } from 'vs/editor/common/viewLayout/lineDecorations';
import { IStringBuilder } from 'vs/editor/common/core/stringBuilder';
export declare const enum RenderWhitespace {
    None = 0,
    Boundary = 1,
    All = 2,
}
export declare class RenderLineInput {
    readonly useMonospaceOptimizations: boolean;
    readonly lineContent: string;
    readonly mightContainRTL: boolean;
    readonly fauxIndentLength: number;
    readonly lineTokens: ViewLineToken[];
    readonly lineDecorations: LineDecoration[];
    readonly tabSize: number;
    readonly spaceWidth: number;
    readonly stopRenderingLineAfter: number;
    readonly renderWhitespace: RenderWhitespace;
    readonly renderControlCharacters: boolean;
    readonly fontLigatures: boolean;
    constructor(useMonospaceOptimizations: boolean, lineContent: string, mightContainRTL: boolean, fauxIndentLength: number, lineTokens: ViewLineToken[], lineDecorations: LineDecoration[], tabSize: number, spaceWidth: number, stopRenderingLineAfter: number, renderWhitespace: 'none' | 'boundary' | 'all', renderControlCharacters: boolean, fontLigatures: boolean);
    equals(other: RenderLineInput): boolean;
}
export declare const enum CharacterMappingConstants {
    PART_INDEX_MASK = 4294901760,
    CHAR_INDEX_MASK = 65535,
    CHAR_INDEX_OFFSET = 0,
    PART_INDEX_OFFSET = 16,
}
/**
 * Provides a both direction mapping between a line's character and its rendered position.
 */
export declare class CharacterMapping {
    static getPartIndex(partData: number): number;
    static getCharIndex(partData: number): number;
    readonly length: number;
    private readonly _data;
    private readonly _absoluteOffsets;
    constructor(length: number, partCount: number);
    setPartData(charOffset: number, partIndex: number, charIndex: number, partAbsoluteOffset: number): void;
    getAbsoluteOffsets(): Uint32Array;
    charOffsetToPartData(charOffset: number): number;
    partDataToCharOffset(partIndex: number, partLength: number, charIndex: number): number;
}
export declare class RenderLineOutput {
    _renderLineOutputBrand: void;
    readonly characterMapping: CharacterMapping;
    readonly containsRTL: boolean;
    readonly containsForeignElements: boolean;
    constructor(characterMapping: CharacterMapping, containsRTL: boolean, containsForeignElements: boolean);
}
export declare function renderViewLine(input: RenderLineInput, sb: IStringBuilder): RenderLineOutput;
export declare class RenderLineOutput2 {
    readonly characterMapping: CharacterMapping;
    readonly html: string;
    readonly containsRTL: boolean;
    readonly containsForeignElements: boolean;
    constructor(characterMapping: CharacterMapping, html: string, containsRTL: boolean, containsForeignElements: boolean);
}
export declare function renderViewLine2(input: RenderLineInput): RenderLineOutput2;
