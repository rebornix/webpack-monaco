import { Position } from 'vs/editor/common/core/position';
import { Range } from 'vs/editor/common/core/range';
import { FindMatch } from 'vs/editor/common/editorCommon';
import { TextModel } from 'vs/editor/common/model/textModel';
import { WordCharacterClassifier } from 'vs/editor/common/controller/wordCharacterClassifier';
export declare class SearchParams {
    readonly searchString: string;
    readonly isRegex: boolean;
    readonly matchCase: boolean;
    readonly wordSeparators: string;
    constructor(searchString: string, isRegex: boolean, matchCase: boolean, wordSeparators: string);
    private static _isMultilineRegexSource(searchString);
    parseSearchRequest(): SearchData;
}
export declare class SearchData {
    /**
     * The regex to search for. Always defined.
     */
    readonly regex: RegExp;
    /**
     * The word separator classifier.
     */
    readonly wordSeparators: WordCharacterClassifier;
    /**
     * The simple string to search for (if possible).
     */
    readonly simpleSearch: string;
    constructor(regex: RegExp, wordSeparators: WordCharacterClassifier, simpleSearch: string);
}
export declare class TextModelSearch {
    static findMatches(model: TextModel, searchParams: SearchParams, searchRange: Range, captureMatches: boolean, limitResultCount: number): FindMatch[];
    /**
     * Multiline search always executes on the lines concatenated with \n.
     * We must therefore compensate for the count of \n in case the model is CRLF
     */
    private static _getMultilineMatchRange(model, deltaOffset, text, matchIndex, match0);
    private static _doFindMatchesMultiline(model, searchRange, searcher, captureMatches, limitResultCount);
    private static _doFindMatchesLineByLine(model, searchRange, searchData, captureMatches, limitResultCount);
    private static _findMatchesInLine(searchData, text, lineNumber, deltaOffset, resultLen, result, captureMatches, limitResultCount);
    static findNextMatch(model: TextModel, searchParams: SearchParams, searchStart: Position, captureMatches: boolean): FindMatch;
    private static _doFindNextMatchMultiline(model, searchStart, searcher, captureMatches);
    private static _doFindNextMatchLineByLine(model, searchStart, searcher, captureMatches);
    private static _findFirstMatchInLine(searcher, text, lineNumber, fromColumn, captureMatches);
    static findPreviousMatch(model: TextModel, searchParams: SearchParams, searchStart: Position, captureMatches: boolean): FindMatch;
    private static _doFindPreviousMatchMultiline(model, searchStart, searcher, captureMatches);
    private static _doFindPreviousMatchLineByLine(model, searchStart, searcher, captureMatches);
    private static _findLastMatchInLine(searcher, text, lineNumber, captureMatches);
}
