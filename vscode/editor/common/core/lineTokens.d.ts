import { ViewLineToken } from 'vs/editor/common/core/viewLineToken';
import { ColorId, FontStyle, StandardTokenType, LanguageId } from 'vs/editor/common/modes';
export declare class LineToken {
    _lineTokenBrand: void;
    private readonly _source;
    private readonly _tokenIndex;
    private readonly _metadata;
    readonly startOffset: number;
    readonly endOffset: number;
    readonly hasPrev: boolean;
    readonly hasNext: boolean;
    readonly languageId: LanguageId;
    readonly tokenType: StandardTokenType;
    readonly fontStyle: FontStyle;
    readonly foregroundId: ColorId;
    readonly backgroundId: ColorId;
    constructor(source: LineTokens, tokenIndex: number, tokenCount: number, startOffset: number, endOffset: number, metadata: number);
    prev(): LineToken;
    next(): LineToken;
}
export declare class LineTokens {
    _lineTokensBrand: void;
    private readonly _tokens;
    private readonly _tokensCount;
    private readonly _text;
    private readonly _textLength;
    constructor(tokens: Uint32Array, text: string);
    getTokenCount(): number;
    getLineContent(): string;
    getLineLength(): number;
    getTokenStartOffset(tokenIndex: number): number;
    getLanguageId(tokenIndex: number): LanguageId;
    getStandardTokenType(tokenIndex: number): StandardTokenType;
    getTokenEndOffset(tokenIndex: number): number;
    /**
     * Find the token containing offset `offset`.
     * ```
     *   For example, with the following tokens [0, 5), [5, 9), [9, infinity)
     *   Searching for 0, 1, 2, 3 or 4 will return 0.
     *   Searching for 5, 6, 7 or 8 will return 1.
     *   Searching for 9, 10, 11, ... will return 2.
     * ```
     * @param offset The search offset
     * @return The index of the token containing the offset.
     */
    findTokenIndexAtOffset(offset: number): number;
    findTokenAtOffset(offset: number): LineToken;
    tokenAt(tokenIndex: number): LineToken;
    firstToken(): LineToken;
    lastToken(): LineToken;
    inflate(): ViewLineToken[];
    sliceAndInflate(startOffset: number, endOffset: number, deltaOffset: number): ViewLineToken[];
}
