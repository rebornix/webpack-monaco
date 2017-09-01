import URI from 'vs/base/common/uri';
import { PrefixSumComputer } from 'vs/editor/common/viewModel/prefixSumComputer';
import { IModelContentChange } from 'vs/editor/common/model/textModelEvents';
export interface IModelChangedEvent {
    /**
     * The actual changes.
     */
    readonly changes: IModelContentChange[];
    /**
     * The (new) end-of-line character.
     */
    readonly eol: string;
    /**
     * The new version id the model has transitioned to.
     */
    readonly versionId: number;
}
export declare class MirrorModel {
    protected _uri: URI;
    protected _lines: string[];
    protected _eol: string;
    protected _versionId: number;
    protected _lineStarts: PrefixSumComputer;
    constructor(uri: URI, lines: string[], eol: string, versionId: number);
    dispose(): void;
    readonly version: number;
    getText(): string;
    onEvents(e: IModelChangedEvent): void;
    protected _ensureLineStarts(): void;
    /**
     * All changes to a line's text go through this method
     */
    private _setLineText(lineIndex, newValue);
    private _acceptDeleteRange(range);
    private _acceptInsertText(position, insertText);
}
