import * as modes from 'vs/editor/common/modes';
import { LineTokens } from 'vs/editor/common/core/lineTokens';
export declare function createScopedLineTokens(context: LineTokens, offset: number): ScopedLineTokens;
export declare class ScopedLineTokens {
    _scopedLineTokensBrand: void;
    readonly languageId: modes.LanguageId;
    private readonly _actual;
    private readonly _firstTokenIndex;
    private readonly _lastTokenIndex;
    readonly firstCharOffset: number;
    private readonly _lastCharOffset;
    constructor(actual: LineTokens, languageId: modes.LanguageId, firstTokenIndex: number, lastTokenIndex: number, firstCharOffset: number, lastCharOffset: number);
    getLineContent(): string;
    getTokenCount(): number;
    findTokenIndexAtOffset(offset: number): number;
    getTokenStartOffset(tokenIndex: number): number;
    getStandardTokenType(tokenIndex: number): modes.StandardTokenType;
}
export declare function ignoreBracketsInToken(standardTokenType: modes.StandardTokenType): boolean;
