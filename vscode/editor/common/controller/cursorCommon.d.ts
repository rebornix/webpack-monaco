import { Position } from 'vs/editor/common/core/position';
import { ICommand, TextModelResolvedOptions, IConfiguration, IModel } from 'vs/editor/common/editorCommon';
import { Selection, ISelection } from 'vs/editor/common/core/selection';
import { Range } from 'vs/editor/common/core/range';
import { LanguageIdentifier } from 'vs/editor/common/modes';
import { IConfigurationChangedEvent } from 'vs/editor/common/config/editorOptions';
import { IViewModel } from 'vs/editor/common/viewModel/viewModel';
import { CursorChangeReason } from 'vs/editor/common/controller/cursorEvents';
import { VerticalRevealType } from 'vs/editor/common/view/viewEvents';
export interface IColumnSelectData {
    toViewLineNumber: number;
    toViewVisualColumn: number;
}
export declare const enum RevealTarget {
    Primary = 0,
    TopMost = 1,
    BottomMost = 2,
}
export interface ICursors {
    readonly context: CursorContext;
    getPrimaryCursor(): CursorState;
    getLastAddedCursorIndex(): number;
    getAll(): CursorState[];
    getColumnSelectData(): IColumnSelectData;
    setColumnSelectData(columnSelectData: IColumnSelectData): void;
    setStates(source: string, reason: CursorChangeReason, states: CursorState[]): void;
    reveal(horizontal: boolean, target: RevealTarget): void;
    revealRange(revealHorizontal: boolean, viewRange: Range, verticalType: VerticalRevealType): void;
    scrollTo(desiredScrollTop: number): void;
}
export interface CharacterMap {
    [char: string]: string;
}
export declare class CursorConfiguration {
    _cursorMoveConfigurationBrand: void;
    readonly readOnly: boolean;
    readonly tabSize: number;
    readonly insertSpaces: boolean;
    readonly oneIndent: string;
    readonly pageSize: number;
    readonly lineHeight: number;
    readonly useTabStops: boolean;
    readonly wordSeparators: string;
    readonly emptySelectionClipboard: boolean;
    readonly autoClosingBrackets: boolean;
    readonly autoIndent: boolean;
    readonly autoClosingPairsOpen: CharacterMap;
    readonly autoClosingPairsClose: CharacterMap;
    readonly surroundingPairs: CharacterMap;
    readonly electricChars: {
        [key: string]: boolean;
    };
    static shouldRecreate(e: IConfigurationChangedEvent): boolean;
    constructor(languageIdentifier: LanguageIdentifier, oneIndent: string, modelOptions: TextModelResolvedOptions, configuration: IConfiguration);
    normalizeIndentation(str: string): string;
    private static _getElectricCharacters(languageIdentifier);
    private static _getAutoClosingPairs(languageIdentifier);
    private static _getSurroundingPairs(languageIdentifier);
}
/**
 * Represents a simple model (either the model or the view model).
 */
export interface ICursorSimpleModel {
    getLineCount(): number;
    getLineContent(lineNumber: number): string;
    getLineMinColumn(lineNumber: number): number;
    getLineMaxColumn(lineNumber: number): number;
    getLineFirstNonWhitespaceColumn(lineNumber: number): number;
    getLineLastNonWhitespaceColumn(lineNumber: number): number;
}
/**
 * Represents the cursor state on either the model or on the view model.
 */
export declare class SingleCursorState {
    _singleCursorStateBrand: void;
    readonly selectionStart: Range;
    readonly selectionStartLeftoverVisibleColumns: number;
    readonly position: Position;
    readonly leftoverVisibleColumns: number;
    readonly selection: Selection;
    constructor(selectionStart: Range, selectionStartLeftoverVisibleColumns: number, position: Position, leftoverVisibleColumns: number);
    equals(other: SingleCursorState): boolean;
    hasSelection(): boolean;
    move(inSelectionMode: boolean, lineNumber: number, column: number, leftoverVisibleColumns: number): SingleCursorState;
    private static _computeSelection(selectionStart, position);
}
export declare class CursorContext {
    _cursorContextBrand: void;
    readonly model: IModel;
    readonly viewModel: IViewModel;
    readonly config: CursorConfiguration;
    constructor(configuration: IConfiguration, model: IModel, viewModel: IViewModel);
    validateViewPosition(viewPosition: Position, modelPosition: Position): Position;
    validateViewRange(viewRange: Range, expectedModelRange: Range): Range;
    convertViewRangeToModelRange(viewRange: Range): Range;
    convertViewPositionToModelPosition(lineNumber: number, column: number): Position;
    convertModelPositionToViewPosition(modelPosition: Position): Position;
    convertModelRangeToViewRange(modelRange: Range): Range;
    getCurrentScrollTop(): number;
    getCompletelyVisibleViewRange(): Range;
    getCompletelyVisibleModelRange(): Range;
    getCompletelyVisibleViewRangeAtScrollTop(scrollTop: number): Range;
    getCompletelyVisibleModelRangeAtScrollTop(scrollTop: number): Range;
    getVerticalOffsetForViewLine(viewLineNumber: number): number;
}
export declare class CursorState {
    _cursorStateBrand: void;
    static fromModelState(modelState: SingleCursorState): CursorState;
    static fromViewState(viewState: SingleCursorState): CursorState;
    static fromModelSelection(modelSelection: ISelection): CursorState;
    static fromModelSelections(modelSelections: ISelection[]): CursorState[];
    static ensureInEditableRange(context: CursorContext, states: CursorState[]): CursorState[];
    private static _ensureInEditableRange(state, editableRange);
    readonly modelState: SingleCursorState;
    readonly viewState: SingleCursorState;
    constructor(modelState: SingleCursorState, viewState: SingleCursorState);
    equals(other: CursorState): boolean;
}
export declare class EditOperationResult {
    _editOperationResultBrand: void;
    readonly commands: ICommand[];
    readonly shouldPushStackElementBefore: boolean;
    readonly shouldPushStackElementAfter: boolean;
    constructor(commands: ICommand[], opts: {
        shouldPushStackElementBefore: boolean;
        shouldPushStackElementAfter: boolean;
    });
}
/**
 * Common operations that work and make sense both on the model and on the view model.
 */
export declare class CursorColumns {
    static isLowSurrogate(model: ICursorSimpleModel, lineNumber: number, charOffset: number): boolean;
    static isHighSurrogate(model: ICursorSimpleModel, lineNumber: number, charOffset: number): boolean;
    static isInsideSurrogatePair(model: ICursorSimpleModel, lineNumber: number, column: number): boolean;
    static visibleColumnFromColumn(lineContent: string, column: number, tabSize: number): number;
    static visibleColumnFromColumn2(config: CursorConfiguration, model: ICursorSimpleModel, position: Position): number;
    static columnFromVisibleColumn(lineContent: string, visibleColumn: number, tabSize: number): number;
    static columnFromVisibleColumn2(config: CursorConfiguration, model: ICursorSimpleModel, lineNumber: number, visibleColumn: number): number;
    /**
     * ATTENTION: This works with 0-based columns (as oposed to the regular 1-based columns)
     */
    static nextTabStop(visibleColumn: number, tabSize: number): number;
    /**
     * ATTENTION: This works with 0-based columns (as oposed to the regular 1-based columns)
     */
    static prevTabStop(column: number, tabSize: number): number;
}
