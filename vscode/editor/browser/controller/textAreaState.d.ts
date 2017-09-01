import { Range } from 'vs/editor/common/core/range';
import { Position } from 'vs/editor/common/core/position';
import { EndOfLinePreference } from 'vs/editor/common/editorCommon';
export interface ITextAreaWrapper {
    getValue(): string;
    setValue(reason: string, value: string): void;
    getSelectionStart(): number;
    getSelectionEnd(): number;
    setSelectionRange(reason: string, selectionStart: number, selectionEnd: number): void;
}
export interface ISimpleModel {
    getLineCount(): number;
    getLineMaxColumn(lineNumber: number): number;
    getValueInRange(range: Range, eol: EndOfLinePreference): string;
}
export interface ITypeData {
    text: string;
    replaceCharCnt: number;
}
export declare class TextAreaState {
    static EMPTY: TextAreaState;
    readonly value: string;
    readonly selectionStart: number;
    readonly selectionEnd: number;
    readonly selectionStartPosition: Position;
    readonly selectionEndPosition: Position;
    constructor(value: string, selectionStart: number, selectionEnd: number, selectionStartPosition: Position, selectionEndPosition: Position);
    equals(other: TextAreaState): boolean;
    toString(): string;
    readFromTextArea(textArea: ITextAreaWrapper): TextAreaState;
    collapseSelection(): TextAreaState;
    writeToTextArea(reason: string, textArea: ITextAreaWrapper, select: boolean): void;
    deduceEditorPosition(offset: number): [Position, number, number];
    private _finishDeduceEditorPosition(anchor, deltaText, signum);
    static selectedText(text: string): TextAreaState;
    static deduceInput(previousState: TextAreaState, currentState: TextAreaState, couldBeEmojiInput: boolean): ITypeData;
}
export declare class PagedScreenReaderStrategy {
    private static _LINES_PER_PAGE;
    private static _getPageOfLine(lineNumber);
    private static _getRangeForPage(page);
    static fromEditorSelection(previousState: TextAreaState, model: ISimpleModel, selection: Range): TextAreaState;
}
