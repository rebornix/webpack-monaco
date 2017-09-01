import { OrderGuaranteeEventEmitter, BulkListenerCallback } from 'vs/base/common/eventEmitter';
import { Position, IPosition } from 'vs/editor/common/core/position';
import { Range, IRange } from 'vs/editor/common/core/range';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { IModelLine } from 'vs/editor/common/model/modelLine';
import { PrefixSumComputer } from 'vs/editor/common/viewModel/prefixSumComputer';
import { IndentRange } from 'vs/editor/common/model/indentRanges';
import { ITextSource, IRawTextSource } from 'vs/editor/common/model/textSource';
import { IDisposable } from 'vs/base/common/lifecycle';
import * as textModelEvents from 'vs/editor/common/model/textModelEvents';
export declare const LONG_LINE_BOUNDARY = 10000;
export interface ITextModelCreationData {
    readonly text: ITextSource;
    readonly options: editorCommon.TextModelResolvedOptions;
}
export declare class TextModel implements editorCommon.ITextModel {
    private static MODEL_SYNC_LIMIT;
    private static MODEL_TOKENIZATION_LIMIT;
    private static MANY_MANY_LINES;
    static DEFAULT_CREATION_OPTIONS: editorCommon.ITextModelCreationOptions;
    static createFromString(text: string, options?: editorCommon.ITextModelCreationOptions): TextModel;
    static resolveCreationData(rawTextSource: IRawTextSource, options: editorCommon.ITextModelCreationOptions): ITextModelCreationData;
    addBulkListener(listener: BulkListenerCallback): IDisposable;
    protected readonly _eventEmitter: OrderGuaranteeEventEmitter;
    _lines: IModelLine[];
    protected _EOL: string;
    protected _isDisposed: boolean;
    protected _isDisposing: boolean;
    protected _options: editorCommon.TextModelResolvedOptions;
    protected _lineStarts: PrefixSumComputer;
    private _indentRanges;
    private _versionId;
    /**
     * Unlike, versionId, this can go down (via undo) or go to previous values (via redo)
     */
    private _alternativeVersionId;
    private _BOM;
    protected _mightContainRTL: boolean;
    protected _mightContainNonBasicASCII: boolean;
    private readonly _shouldSimplifyMode;
    protected readonly _isTooLargeForTokenization: boolean;
    constructor(rawTextSource: IRawTextSource, creationOptions: editorCommon.ITextModelCreationOptions);
    protected _createModelLine(text: string, tabSize: number): IModelLine;
    protected _assertNotDisposed(): void;
    isTooLargeForHavingARichMode(): boolean;
    isTooLargeForTokenization(): boolean;
    getOptions(): editorCommon.TextModelResolvedOptions;
    updateOptions(_newOpts: editorCommon.ITextModelUpdateOptions): void;
    detectIndentation(defaultInsertSpaces: boolean, defaultTabSize: number): void;
    private static _normalizeIndentationFromWhitespace(str, tabSize, insertSpaces);
    static normalizeIndentation(str: string, tabSize: number, insertSpaces: boolean): string;
    normalizeIndentation(str: string): string;
    getOneIndent(): string;
    getVersionId(): number;
    mightContainRTL(): boolean;
    mightContainNonBasicASCII(): boolean;
    getAlternativeVersionId(): number;
    private _ensureLineStarts();
    getOffsetAt(rawPosition: IPosition): number;
    getPositionAt(offset: number): Position;
    protected _increaseVersionId(): void;
    private _setVersionId(newVersionId);
    protected _overwriteAlternativeVersionId(newAlternativeVersionId: number): void;
    isDisposed(): boolean;
    dispose(): void;
    private _emitContentChanged2(startLineNumber, startColumn, endLineNumber, endColumn, rangeLength, text, isUndoing, isRedoing, isFlush);
    protected _resetValue(newValue: ITextSource): void;
    equals(other: ITextSource): boolean;
    setValue(value: string): void;
    setValueFromTextSource(newValue: ITextSource): void;
    getValue(eol?: editorCommon.EndOfLinePreference, preserveBOM?: boolean): string;
    getValueLength(eol?: editorCommon.EndOfLinePreference, preserveBOM?: boolean): number;
    getValueInRange(rawRange: IRange, eol?: editorCommon.EndOfLinePreference): string;
    getValueLengthInRange(rawRange: IRange, eol?: editorCommon.EndOfLinePreference): number;
    isDominatedByLongLines(): boolean;
    getLineCount(): number;
    getLineContent(lineNumber: number): string;
    getIndentLevel(lineNumber: number): number;
    protected _resetIndentRanges(): void;
    private _getIndentRanges();
    getIndentRanges(): IndentRange[];
    private _toValidLineIndentGuide(lineNumber, indentGuide);
    getLineIndentGuide(lineNumber: number): number;
    getLinesContent(): string[];
    getEOL(): string;
    setEOL(eol: editorCommon.EndOfLineSequence): void;
    getLineMinColumn(lineNumber: number): number;
    getLineMaxColumn(lineNumber: number): number;
    getLineFirstNonWhitespaceColumn(lineNumber: number): number;
    getLineLastNonWhitespaceColumn(lineNumber: number): number;
    validateLineNumber(lineNumber: number): number;
    /**
     * @param strict Do NOT allow a position inside a high-low surrogate pair
     */
    private _validatePosition(_lineNumber, _column, strict);
    validatePosition(position: IPosition): Position;
    validateRange(_range: IRange): Range;
    modifyPosition(rawPosition: IPosition, offset: number): Position;
    getFullModelRange(): Range;
    protected _emitModelRawContentChangedEvent(e: textModelEvents.ModelRawContentChangedEvent): void;
    private _constructLines(textSource);
    private _getEndOfLine(eol);
    findMatches(searchString: string, rawSearchScope: any, isRegex: boolean, matchCase: boolean, wordSeparators: string, captureMatches: boolean, limitResultCount?: number): editorCommon.FindMatch[];
    findNextMatch(searchString: string, rawSearchStart: IPosition, isRegex: boolean, matchCase: boolean, wordSeparators: string, captureMatches: boolean): editorCommon.FindMatch;
    findPreviousMatch(searchString: string, rawSearchStart: IPosition, isRegex: boolean, matchCase: boolean, wordSeparators: string, captureMatches: boolean): editorCommon.FindMatch;
}
