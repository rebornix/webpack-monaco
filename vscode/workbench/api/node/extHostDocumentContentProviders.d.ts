import URI from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import * as vscode from 'vscode';
import { ExtHostDocumentContentProvidersShape, IMainContext } from './extHost.protocol';
import { ExtHostDocumentsAndEditors } from './extHostDocumentsAndEditors';
export declare class ExtHostDocumentContentProvider implements ExtHostDocumentContentProvidersShape {
    private static _handlePool;
    private readonly _documentContentProviders;
    private readonly _proxy;
    private readonly _documentsAndEditors;
    constructor(mainContext: IMainContext, documentsAndEditors: ExtHostDocumentsAndEditors);
    dispose(): void;
    registerTextDocumentContentProvider(scheme: string, provider: vscode.TextDocumentContentProvider): vscode.Disposable;
    $provideTextDocumentContent(handle: number, uri: URI): TPromise<string>;
}
