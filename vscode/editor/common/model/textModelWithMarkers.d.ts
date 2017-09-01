import { Position } from 'vs/editor/common/core/position';
import { ITextModelWithMarkers, ITextModelCreationOptions } from 'vs/editor/common/editorCommon';
import { LineMarker } from 'vs/editor/common/model/modelLine';
import { TextModelWithTokens } from 'vs/editor/common/model/textModelWithTokens';
import { LanguageIdentifier } from 'vs/editor/common/modes';
import { ITextSource, IRawTextSource } from 'vs/editor/common/model/textSource';
export interface IMarkerIdToMarkerMap {
    [key: string]: LineMarker;
}
export interface INewMarker {
    internalDecorationId: number;
    position: Position;
    stickToPreviousCharacter: boolean;
}
export declare class TextModelWithMarkers extends TextModelWithTokens implements ITextModelWithMarkers {
    private _markerIdGenerator;
    protected _markerIdToMarker: IMarkerIdToMarkerMap;
    constructor(rawTextSource: IRawTextSource, creationOptions: ITextModelCreationOptions, languageIdentifier: LanguageIdentifier);
    dispose(): void;
    protected _resetValue(newValue: ITextSource): void;
    _addMarker(internalDecorationId: number, lineNumber: number, column: number, stickToPreviousCharacter: boolean): string;
    protected _addMarkers(newMarkers: INewMarker[]): LineMarker[];
    _changeMarker(id: string, lineNumber: number, column: number): void;
    _changeMarkerStickiness(id: string, newStickToPreviousCharacter: boolean): void;
    _getMarker(id: string): Position;
    _getMarkersCount(): number;
    _removeMarker(id: string): void;
    protected _removeMarkers(markers: LineMarker[]): void;
}
