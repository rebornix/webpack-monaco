import { IState, LanguageId } from 'vs/editor/common/modes';
import { LineTokens } from 'vs/editor/common/core/lineTokens';
import { Position } from 'vs/editor/common/core/position';
export interface ILineEdit {
    startColumn: number;
    endColumn: number;
    text: string;
    forceMoveMarkers: boolean;
}
export declare class LineMarker {
    _lineMarkerBrand: void;
    readonly id: string;
    readonly internalDecorationId: number;
    stickToPreviousCharacter: boolean;
    position: Position;
    constructor(id: string, internalDecorationId: number, position: Position, stickToPreviousCharacter: boolean);
    toString(): string;
    updateLineNumber(markersTracker: MarkersTracker, lineNumber: number): void;
    updateColumn(markersTracker: MarkersTracker, column: number): void;
    updatePosition(markersTracker: MarkersTracker, position: Position): void;
    setPosition(position: Position): void;
    static compareMarkers(a: LineMarker, b: LineMarker): number;
}
export declare class MarkersTracker {
    _changedDecorationsBrand: void;
    private _changedDecorations;
    private _changedDecorationsLen;
    constructor();
    addChangedMarker(marker: LineMarker): void;
    getDecorationIds(): number[];
}
export interface ITokensAdjuster {
    adjust(toColumn: number, delta: number, minimumAllowedColumn: number): void;
    finish(delta: number, lineTextLength: number): void;
}
export interface IModelLine {
    readonly text: string;
    addMarker(marker: LineMarker): void;
    addMarkers(markers: LineMarker[]): void;
    removeMarker(marker: LineMarker): void;
    removeMarkers(deleteMarkers: {
        [markerId: string]: boolean;
    }): void;
    getMarkers(): LineMarker[];
    resetTokenizationState(): void;
    isInvalid(): boolean;
    setIsInvalid(isInvalid: boolean): void;
    getState(): IState;
    setState(state: IState): void;
    getTokens(topLevelLanguageId: LanguageId): LineTokens;
    setTokens(topLevelLanguageId: LanguageId, tokens: Uint32Array): void;
    updateTabSize(tabSize: number): void;
    getIndentLevel(): number;
    updateLineNumber(markersTracker: MarkersTracker, newLineNumber: number): void;
    applyEdits(markersTracker: MarkersTracker, edits: ILineEdit[], tabSize: number): number;
    append(markersTracker: MarkersTracker, myLineNumber: number, other: IModelLine, tabSize: number): void;
    split(markersTracker: MarkersTracker, splitColumn: number, forceMoveMarkers: boolean, tabSize: number): IModelLine;
}
export declare abstract class AbstractModelLine {
    private _markers;
    constructor(initializeMarkers: boolean);
    readonly abstract text: string;
    protected abstract _setText(text: string, tabSize: number): any;
    protected abstract _createTokensAdjuster(): ITokensAdjuster;
    protected abstract _createModelLine(text: string, tabSize: number): IModelLine;
    private _createMarkersAdjuster(markersTracker);
    applyEdits(markersTracker: MarkersTracker, edits: ILineEdit[], tabSize: number): number;
    split(markersTracker: MarkersTracker, splitColumn: number, forceMoveMarkers: boolean, tabSize: number): IModelLine;
    append(markersTracker: MarkersTracker, myLineNumber: number, other: IModelLine, tabSize: number): void;
    addMarker(marker: LineMarker): void;
    addMarkers(markers: LineMarker[]): void;
    removeMarker(marker: LineMarker): void;
    removeMarkers(deleteMarkers: {
        [markerId: string]: boolean;
    }): void;
    getMarkers(): LineMarker[];
    updateLineNumber(markersTracker: MarkersTracker, newLineNumber: number): void;
    private _indexOfMarkerId(markerId);
}
export declare class ModelLine extends AbstractModelLine implements IModelLine {
    private _text;
    readonly text: string;
    /**
     * bits 31 - 1 => indentLevel
     * bit 0 => isInvalid
     */
    private _metadata;
    isInvalid(): boolean;
    setIsInvalid(isInvalid: boolean): void;
    /**
     * Returns:
     *  - -1 => the line consists of whitespace
     *  - otherwise => the indent level is returned value
     */
    getIndentLevel(): number;
    private _setPlusOneIndentLevel(value);
    updateTabSize(tabSize: number): void;
    private _state;
    private _lineTokens;
    constructor(text: string, tabSize: number);
    protected _createModelLine(text: string, tabSize: number): IModelLine;
    split(markersTracker: MarkersTracker, splitColumn: number, forceMoveMarkers: boolean, tabSize: number): IModelLine;
    append(markersTracker: MarkersTracker, myLineNumber: number, other: IModelLine, tabSize: number): void;
    resetTokenizationState(): void;
    setState(state: IState): void;
    getState(): IState;
    setTokens(topLevelLanguageId: LanguageId, tokens: Uint32Array): void;
    getTokens(topLevelLanguageId: LanguageId): LineTokens;
    protected _createTokensAdjuster(): ITokensAdjuster;
    private _markOverflowingTokensForDeletion(removeTokensCount, lineTextLength);
    private _deleteMarkedTokens(removeTokensCount);
    protected _setText(text: string, tabSize: number): void;
}
/**
 * A model line that cannot store any tokenization state, nor does it compute indentation levels.
 * It has no fields except the text.
 */
export declare class MinimalModelLine extends AbstractModelLine implements IModelLine {
    private _text;
    readonly text: string;
    isInvalid(): boolean;
    setIsInvalid(isInvalid: boolean): void;
    /**
     * Returns:
     *  - -1 => the line consists of whitespace
     *  - otherwise => the indent level is returned value
     */
    getIndentLevel(): number;
    updateTabSize(tabSize: number): void;
    constructor(text: string, tabSize: number);
    protected _createModelLine(text: string, tabSize: number): IModelLine;
    split(markersTracker: MarkersTracker, splitColumn: number, forceMoveMarkers: boolean, tabSize: number): IModelLine;
    append(markersTracker: MarkersTracker, myLineNumber: number, other: IModelLine, tabSize: number): void;
    resetTokenizationState(): void;
    setState(state: IState): void;
    getState(): IState;
    setTokens(topLevelLanguageId: LanguageId, tokens: Uint32Array): void;
    getTokens(topLevelLanguageId: LanguageId): LineTokens;
    protected _createTokensAdjuster(): ITokensAdjuster;
    protected _setText(text: string, tabSize: number): void;
}
