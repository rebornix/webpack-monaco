import { ScopedLineTokens } from 'vs/editor/common/modes/supports';
import { StandardTokenType } from 'vs/editor/common/modes';
export interface TokenText {
    text: string;
    type: StandardTokenType;
}
export declare function createFakeScopedLineTokens(rawTokens: TokenText[]): ScopedLineTokens;
