import { ScopedLineTokens } from 'vs/editor/common/modes/supports';
import { CharacterPair, IAutoClosingPair, IAutoClosingPairConditional } from 'vs/editor/common/modes/languageConfiguration';
export declare class CharacterPairSupport {
    private readonly _autoClosingPairs;
    private readonly _surroundingPairs;
    constructor(config: {
        brackets?: CharacterPair[];
        autoClosingPairs?: IAutoClosingPairConditional[];
        surroundingPairs?: IAutoClosingPair[];
    });
    getAutoClosingPairs(): IAutoClosingPair[];
    shouldAutoClosePair(character: string, context: ScopedLineTokens, column: number): boolean;
    getSurroundingPairs(): IAutoClosingPair[];
}
