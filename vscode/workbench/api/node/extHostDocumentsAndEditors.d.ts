import Event from 'vs/base/common/event';
import { ExtHostDocumentsAndEditorsShape, IDocumentsAndEditorsDelta, IMainContext } from './extHost.protocol';
import { ExtHostDocumentData } from './extHostDocumentData';
import { ExtHostTextEditor } from './extHostTextEditor';
import { ExtHostExtensionService } from 'vs/workbench/api/node/extHostExtensionService';
export declare class ExtHostDocumentsAndEditors implements ExtHostDocumentsAndEditorsShape {
    private readonly _mainContext;
    private readonly _extHostExtensions;
    private _activeEditorId;
    private readonly _editors;
    private readonly _documents;
    private readonly _onDidAddDocuments;
    private readonly _onDidRemoveDocuments;
    private readonly _onDidChangeVisibleTextEditors;
    private readonly _onDidChangeActiveTextEditor;
    readonly onDidAddDocuments: Event<ExtHostDocumentData[]>;
    readonly onDidRemoveDocuments: Event<ExtHostDocumentData[]>;
    readonly onDidChangeVisibleTextEditors: Event<ExtHostTextEditor[]>;
    readonly onDidChangeActiveTextEditor: Event<ExtHostTextEditor>;
    constructor(_mainContext: IMainContext, _extHostExtensions?: ExtHostExtensionService);
    $acceptDocumentsAndEditorsDelta(delta: IDocumentsAndEditorsDelta): void;
    getDocument(strUrl: string): ExtHostDocumentData;
    allDocuments(): ExtHostDocumentData[];
    getEditor(id: string): ExtHostTextEditor;
    activeEditor(): ExtHostTextEditor | undefined;
    allEditors(): ExtHostTextEditor[];
}
