import { MirrorModel } from 'vs/editor/common/model/mirrorModel';
import URI from 'vs/base/common/uri';
import * as vscode from 'vscode';
import { MainThreadDocumentsShape } from './extHost.protocol';
import { ITextSource } from 'vs/editor/common/model/textSource';
export declare function setWordDefinitionFor(modeId: string, wordDefinition: RegExp): void;
export declare function getWordDefinitionFor(modeId: string): RegExp;
export declare class ExtHostDocumentData extends MirrorModel {
    private _proxy;
    private _languageId;
    private _isDirty;
    private _document;
    private _textLines;
    private _isDisposed;
    constructor(proxy: MainThreadDocumentsShape, uri: URI, lines: string[], eol: string, languageId: string, versionId: number, isDirty: boolean);
    dispose(): void;
    equalLines({lines}: ITextSource): boolean;
    readonly document: vscode.TextDocument;
    _acceptLanguageId(newLanguageId: string): void;
    _acceptIsDirty(isDirty: boolean): void;
    private _save();
    private _getTextInRange(_range);
    private _lineAt(lineOrPosition);
    private _offsetAt(position);
    private _positionAt(offset);
    private _validateRange(range);
    private _validatePosition(position);
    private _getWordRangeAtPosition(_position, regexp?);
}
