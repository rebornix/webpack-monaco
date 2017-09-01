import { Position } from 'vs/editor/common/core/position';
import { Selection } from 'vs/editor/common/core/selection';
import { Range } from 'vs/editor/common/core/range';
import * as editorCommon from 'vs/editor/common/editorCommon';
import { LineTokens } from 'vs/editor/common/core/lineTokens';
import { ViewLineData, ICoordinatesConverter } from 'vs/editor/common/viewModel/viewModel';
import * as viewEvents from 'vs/editor/common/view/viewEvents';
import { WrappingIndent } from 'vs/editor/common/config/editorOptions';
export declare class OutputPosition {
    _outputPositionBrand: void;
    outputLineIndex: number;
    outputOffset: number;
    constructor(outputLineIndex: number, outputOffset: number);
}
export interface ILineMapping {
    getOutputLineCount(): number;
    getWrappedLinesIndent(): string;
    getInputOffsetOfOutputPosition(outputLineIndex: number, outputOffset: number): number;
    getOutputPositionOfInputOffset(inputOffset: number): OutputPosition;
}
export interface ILineMapperFactory {
    createLineMapping(lineText: string, tabSize: number, wrappingColumn: number, columnsForFullWidthChar: number, wrappingIndent: WrappingIndent): ILineMapping;
}
export interface IModel {
    getLineTokens(lineNumber: number): LineTokens;
    getLineContent(lineNumber: number): string;
    getLineMinColumn(lineNumber: number): number;
    getLineMaxColumn(lineNumber: number): number;
}
export interface ISplitLine {
    isVisible(): boolean;
    setVisible(isVisible: boolean): ISplitLine;
    getViewLineCount(): number;
    getViewLineContent(model: IModel, modelLineNumber: number, outputLineIndex: number): string;
    getViewLineMinColumn(model: IModel, modelLineNumber: number, outputLineIndex: number): number;
    getViewLineMaxColumn(model: IModel, modelLineNumber: number, outputLineIndex: number): number;
    getViewLineData(model: IModel, modelLineNumber: number, outputLineIndex: number): ViewLineData;
    getViewLinesData(model: IModel, modelLineNumber: number, fromOuputLineIndex: number, toOutputLineIndex: number, globalStartIndex: number, needed: boolean[], result: ViewLineData[]): void;
    getModelColumnOfViewPosition(outputLineIndex: number, outputColumn: number): number;
    getViewPositionOfModelPosition(deltaLineNumber: number, inputColumn: number): Position;
}
export interface IViewModelLinesCollection {
    createCoordinatesConverter(): ICoordinatesConverter;
    dispose(): void;
    setWrappingSettings(wrappingIndent: WrappingIndent, wrappingColumn: number, columnsForFullWidthChar: number): boolean;
    setTabSize(newTabSize: number): boolean;
    setHiddenAreas(_ranges: Range[]): boolean;
    onModelFlushed(): void;
    onModelLinesDeleted(versionId: number, fromLineNumber: number, toLineNumber: number): viewEvents.ViewLinesDeletedEvent;
    onModelLinesInserted(versionId: number, fromLineNumber: number, toLineNumber: number, text: string[]): viewEvents.ViewLinesInsertedEvent;
    onModelLineChanged(versionId: number, lineNumber: number, newText: string): [boolean, viewEvents.ViewLinesChangedEvent, viewEvents.ViewLinesInsertedEvent, viewEvents.ViewLinesDeletedEvent];
    acceptVersionId(versionId: number): void;
    getViewLineCount(): number;
    warmUpLookupCache(viewStartLineNumber: number, viewEndLineNumber: number): void;
    getViewLineIndentGuide(viewLineNumber: number): number;
    getViewLineContent(viewLineNumber: number): string;
    getViewLineMinColumn(viewLineNumber: number): number;
    getViewLineMaxColumn(viewLineNumber: number): number;
    getViewLineData(viewLineNumber: number): ViewLineData;
    getViewLinesData(viewStartLineNumber: number, viewEndLineNumber: number, needed: boolean[]): ViewLineData[];
}
export declare class CoordinatesConverter implements ICoordinatesConverter {
    private readonly _lines;
    constructor(lines: SplitLinesCollection);
    convertViewPositionToModelPosition(viewPosition: Position): Position;
    convertViewRangeToModelRange(viewRange: Range): Range;
    convertViewSelectionToModelSelection(viewSelection: Selection): Selection;
    validateViewPosition(viewPosition: Position, expectedModelPosition: Position): Position;
    validateViewRange(viewRange: Range, expectedModelRange: Range): Range;
    convertModelPositionToViewPosition(modelPosition: Position): Position;
    convertModelRangeToViewRange(modelRange: Range): Range;
    convertModelSelectionToViewSelection(modelSelection: Selection): Selection;
    modelPositionIsVisible(modelPosition: Position): boolean;
}
export declare class SplitLinesCollection implements IViewModelLinesCollection {
    private model;
    private _validModelVersionId;
    private wrappingColumn;
    private columnsForFullWidthChar;
    private wrappingIndent;
    private tabSize;
    private lines;
    private prefixSumComputer;
    private linePositionMapperFactory;
    private hiddenAreasIds;
    constructor(model: editorCommon.IModel, linePositionMapperFactory: ILineMapperFactory, tabSize: number, wrappingColumn: number, columnsForFullWidthChar: number, wrappingIndent: WrappingIndent);
    dispose(): void;
    createCoordinatesConverter(): ICoordinatesConverter;
    private _ensureValidState();
    private _constructLines(resetHiddenAreas);
    private getHiddenAreas();
    private _reduceRanges(_ranges);
    setHiddenAreas(_ranges: Range[]): boolean;
    modelPositionIsVisible(modelLineNumber: number, modelColumn: number): boolean;
    setTabSize(newTabSize: number): boolean;
    setWrappingSettings(wrappingIndent: WrappingIndent, wrappingColumn: number, columnsForFullWidthChar: number): boolean;
    onModelFlushed(): void;
    onModelLinesDeleted(versionId: number, fromLineNumber: number, toLineNumber: number): viewEvents.ViewLinesDeletedEvent;
    onModelLinesInserted(versionId: number, fromLineNumber: number, toLineNumber: number, text: string[]): viewEvents.ViewLinesInsertedEvent;
    onModelLineChanged(versionId: number, lineNumber: number, newText: string): [boolean, viewEvents.ViewLinesChangedEvent, viewEvents.ViewLinesInsertedEvent, viewEvents.ViewLinesDeletedEvent];
    acceptVersionId(versionId: number): void;
    getViewLineCount(): number;
    private _toValidViewLineNumber(viewLineNumber);
    /**
     * Gives a hint that a lot of requests are about to come in for these line numbers.
     */
    warmUpLookupCache(viewStartLineNumber: number, viewEndLineNumber: number): void;
    getViewLineIndentGuide(viewLineNumber: number): number;
    getViewLineContent(viewLineNumber: number): string;
    getViewLineMinColumn(viewLineNumber: number): number;
    getViewLineMaxColumn(viewLineNumber: number): number;
    getViewLineData(viewLineNumber: number): ViewLineData;
    getViewLinesData(viewStartLineNumber: number, viewEndLineNumber: number, needed: boolean[]): ViewLineData[];
    validateViewPosition(viewLineNumber: number, viewColumn: number, expectedModelPosition: Position): Position;
    convertViewPositionToModelPosition(viewLineNumber: number, viewColumn: number): Position;
    convertModelPositionToViewPosition(_modelLineNumber: number, _modelColumn: number): Position;
}
export declare class SplitLine implements ISplitLine {
    private positionMapper;
    private outputLineCount;
    private wrappedIndent;
    private wrappedIndentLength;
    private _isVisible;
    constructor(positionMapper: ILineMapping, isVisible: boolean);
    isVisible(): boolean;
    setVisible(isVisible: boolean): ISplitLine;
    getViewLineCount(): number;
    private getInputStartOffsetOfOutputLineIndex(outputLineIndex);
    private getInputEndOffsetOfOutputLineIndex(model, modelLineNumber, outputLineIndex);
    getViewLineContent(model: IModel, modelLineNumber: number, outputLineIndex: number): string;
    getViewLineMinColumn(model: IModel, modelLineNumber: number, outputLineIndex: number): number;
    getViewLineMaxColumn(model: IModel, modelLineNumber: number, outputLineIndex: number): number;
    getViewLineData(model: IModel, modelLineNumber: number, outputLineIndex: number): ViewLineData;
    getViewLinesData(model: IModel, modelLineNumber: number, fromOuputLineIndex: number, toOutputLineIndex: number, globalStartIndex: number, needed: boolean[], result: ViewLineData[]): void;
    getModelColumnOfViewPosition(outputLineIndex: number, outputColumn: number): number;
    getViewPositionOfModelPosition(deltaLineNumber: number, inputColumn: number): Position;
}
export declare class IdentityCoordinatesConverter implements ICoordinatesConverter {
    private readonly _lines;
    constructor(lines: IdentityLinesCollection);
    private _validPosition(pos);
    private _validRange(range);
    private _validSelection(selection);
    convertViewPositionToModelPosition(viewPosition: Position): Position;
    convertViewRangeToModelRange(viewRange: Range): Range;
    convertViewSelectionToModelSelection(viewSelection: Selection): Selection;
    validateViewPosition(viewPosition: Position, expectedModelPosition: Position): Position;
    validateViewRange(viewRange: Range, expectedModelRange: Range): Range;
    convertModelPositionToViewPosition(modelPosition: Position): Position;
    convertModelRangeToViewRange(modelRange: Range): Range;
    convertModelSelectionToViewSelection(modelSelection: Selection): Selection;
    modelPositionIsVisible(modelPosition: Position): boolean;
}
export declare class IdentityLinesCollection implements IViewModelLinesCollection {
    readonly model: editorCommon.IModel;
    constructor(model: editorCommon.IModel);
    dispose(): void;
    createCoordinatesConverter(): ICoordinatesConverter;
    setHiddenAreas(_ranges: Range[]): boolean;
    setTabSize(newTabSize: number): boolean;
    setWrappingSettings(wrappingIndent: WrappingIndent, wrappingColumn: number, columnsForFullWidthChar: number): boolean;
    onModelFlushed(): void;
    onModelLinesDeleted(versionId: number, fromLineNumber: number, toLineNumber: number): viewEvents.ViewLinesDeletedEvent;
    onModelLinesInserted(versionId: number, fromLineNumber: number, toLineNumber: number, text: string[]): viewEvents.ViewLinesInsertedEvent;
    onModelLineChanged(versionId: number, lineNumber: number, newText: string): [boolean, viewEvents.ViewLinesChangedEvent, viewEvents.ViewLinesInsertedEvent, viewEvents.ViewLinesDeletedEvent];
    acceptVersionId(versionId: number): void;
    getViewLineCount(): number;
    warmUpLookupCache(viewStartLineNumber: number, viewEndLineNumber: number): void;
    getViewLineIndentGuide(viewLineNumber: number): number;
    getViewLineContent(viewLineNumber: number): string;
    getViewLineMinColumn(viewLineNumber: number): number;
    getViewLineMaxColumn(viewLineNumber: number): number;
    getViewLineData(viewLineNumber: number): ViewLineData;
    getViewLinesData(viewStartLineNumber: number, viewEndLineNumber: number, needed: boolean[]): ViewLineData[];
}
