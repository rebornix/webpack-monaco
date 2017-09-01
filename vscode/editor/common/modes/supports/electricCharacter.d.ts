import { ScopedLineTokens } from 'vs/editor/common/modes/supports';
import { RichEditBrackets } from 'vs/editor/common/modes/supports/richEditBrackets';
import { IAutoClosingPairConditional, IBracketElectricCharacterContribution } from 'vs/editor/common/modes/languageConfiguration';
/**
 * Interface used to support electric characters
 * @internal
 */
export interface IElectricAction {
    matchOpenBracket?: string;
    appendText?: string;
}
export declare class BracketElectricCharacterSupport {
    private readonly _richEditBrackets;
    private readonly _complexAutoClosePairs;
    constructor(richEditBrackets: RichEditBrackets, autoClosePairs: IAutoClosingPairConditional[], contribution: IBracketElectricCharacterContribution);
    getElectricCharacters(): string[];
    onElectricCharacter(character: string, context: ScopedLineTokens, column: number): IElectricAction;
    private _onElectricAutoIndent(character, context, column);
    private _onElectricAutoClose(character, context, column);
}
