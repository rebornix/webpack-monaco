import Event from 'vs/base/common/event';
import URI from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import * as vscode from 'vscode';
import { ExtHostDocumentsShape, IMainContext } from './extHost.protocol';
import { ExtHostDocumentData } from './extHostDocumentData';
import { ExtHostDocumentsAndEditors } from './extHostDocumentsAndEditors';
import { IModelChangedEvent } from 'vs/editor/common/model/mirrorModel';
export declare class ExtHostDocuments implements ExtHostDocumentsShape {
    private _onDidAddDocument;
    private _onDidRemoveDocument;
    private _onDidChangeDocument;
    private _onDidSaveDocument;
    readonly onDidAddDocument: Event<vscode.TextDocument>;
    readonly onDidRemoveDocument: Event<vscode.TextDocument>;
    readonly onDidChangeDocument: Event<vscode.TextDocumentChangeEvent>;
    readonly onDidSaveDocument: Event<vscode.TextDocument>;
    private _toDispose;
    private _proxy;
    private _documentsAndEditors;
    private _documentLoader;
    constructor(mainContext: IMainContext, documentsAndEditors: ExtHostDocumentsAndEditors);
    dispose(): void;
    getAllDocumentData(): ExtHostDocumentData[];
    getDocumentData(resource: vscode.Uri): ExtHostDocumentData;
    ensureDocumentData(uri: URI): TPromise<ExtHostDocumentData>;
    createDocumentData(options?: {
        language?: string;
        content?: string;
    }): TPromise<URI>;
    $acceptModelModeChanged(strURL: string, oldModeId: string, newModeId: string): void;
    $acceptModelSaved(strURL: string): void;
    $acceptDirtyStateChanged(strURL: string, isDirty: boolean): void;
    $acceptModelChanged(strURL: string, events: IModelChangedEvent, isDirty: boolean): void;
    setWordDefinitionFor(modeId: string, wordDefinition: RegExp): void;
}
