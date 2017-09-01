import { SingleCursorState, CursorConfiguration, ICursorSimpleModel } from 'vs/editor/common/controller/cursorCommon';
import { Position } from 'vs/editor/common/core/position';
import { WordCharacterClassifier } from 'vs/editor/common/controller/wordCharacterClassifier';
import { Range } from 'vs/editor/common/core/range';
import { Selection } from 'vs/editor/common/core/selection';
export declare const enum WordNavigationType {
    WordStart = 0,
    WordEnd = 1,
}
export declare class WordOperations {
    private static _createWord(lineContent, wordType, start, end);
    private static _findPreviousWordOnLine(wordSeparators, model, position);
    private static _doFindPreviousWordOnLine(lineContent, wordSeparators, position);
    private static _findEndOfWord(lineContent, wordSeparators, wordType, startIndex);
    private static _findNextWordOnLine(wordSeparators, model, position);
    private static _doFindNextWordOnLine(lineContent, wordSeparators, position);
    private static _findStartOfWord(lineContent, wordSeparators, wordType, startIndex);
    static moveWordLeft(wordSeparators: WordCharacterClassifier, model: ICursorSimpleModel, position: Position, wordNavigationType: WordNavigationType): Position;
    static moveWordRight(wordSeparators: WordCharacterClassifier, model: ICursorSimpleModel, position: Position, wordNavigationType: WordNavigationType): Position;
    private static _deleteWordLeftWhitespace(model, position);
    static deleteWordLeft(wordSeparators: WordCharacterClassifier, model: ICursorSimpleModel, selection: Selection, whitespaceHeuristics: boolean, wordNavigationType: WordNavigationType): Range;
    private static _findFirstNonWhitespaceChar(str, startIndex);
    private static _deleteWordRightWhitespace(model, position);
    static deleteWordRight(wordSeparators: WordCharacterClassifier, model: ICursorSimpleModel, selection: Selection, whitespaceHeuristics: boolean, wordNavigationType: WordNavigationType): Range;
    static word(config: CursorConfiguration, model: ICursorSimpleModel, cursor: SingleCursorState, inSelectionMode: boolean, position: Position): SingleCursorState;
}
