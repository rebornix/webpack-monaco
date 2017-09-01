import { Range } from 'vs/editor/common/core/range';
import { CharacterPair } from 'vs/editor/common/modes/languageConfiguration';
import { LanguageIdentifier } from 'vs/editor/common/modes';
export declare class RichEditBracket {
    _richEditBracketBrand: void;
    readonly languageIdentifier: LanguageIdentifier;
    readonly open: string;
    readonly close: string;
    readonly forwardRegex: RegExp;
    readonly reversedRegex: RegExp;
    constructor(languageIdentifier: LanguageIdentifier, open: string, close: string, forwardRegex: RegExp, reversedRegex: RegExp);
}
export declare class RichEditBrackets {
    _richEditBracketsBrand: void;
    readonly brackets: RichEditBracket[];
    readonly forwardRegex: RegExp;
    readonly reversedRegex: RegExp;
    readonly maxBracketLength: number;
    readonly textIsBracket: {
        [text: string]: RichEditBracket;
    };
    readonly textIsOpenBracket: {
        [text: string]: boolean;
    };
    constructor(languageIdentifier: LanguageIdentifier, brackets: CharacterPair[]);
}
export declare class BracketsUtils {
    private static _findPrevBracketInText(reversedBracketRegex, lineNumber, reversedText, offset);
    static findPrevBracketInToken(reversedBracketRegex: RegExp, lineNumber: number, lineText: string, currentTokenStart: number, currentTokenEnd: number): Range;
    static findNextBracketInText(bracketRegex: RegExp, lineNumber: number, text: string, offset: number): Range;
    static findNextBracketInToken(bracketRegex: RegExp, lineNumber: number, lineText: string, currentTokenStart: number, currentTokenEnd: number): Range;
}
