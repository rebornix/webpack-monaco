import URI from 'vs/base/common/uri';
import { IModelService } from 'vs/editor/common/services/modelService';
import { IReference } from 'vs/base/common/lifecycle';
import { ITextFileService } from 'vs/workbench/services/textfile/common/textfiles';
import { TPromise } from 'vs/base/common/winjs.base';
import { IFileService } from 'vs/platform/files/common/files';
import { IModeService } from 'vs/editor/common/services/modeService';
import { IUntitledEditorService } from 'vs/workbench/services/untitled/common/untitledEditorService';
import { MainThreadDocumentsShape, IExtHostContext } from '../node/extHost.protocol';
import { ITextModelService } from 'vs/editor/common/services/resolverService';
import { MainThreadDocumentsAndEditors } from './mainThreadDocumentsAndEditors';
import { ITextEditorModel } from 'vs/workbench/common/editor';
export declare class BoundModelReferenceCollection {
    private _maxAge;
    private _maxLength;
    private _data;
    private _length;
    constructor(_maxAge?: number, _maxLength?: number);
    dispose(): void;
    add(ref: IReference<ITextEditorModel>): void;
    private _cleanup();
}
export declare class MainThreadDocuments implements MainThreadDocumentsShape {
    private _modelService;
    private _modeService;
    private _textModelResolverService;
    private _textFileService;
    private _fileService;
    private _untitledEditorService;
    private _toDispose;
    private _modelToDisposeMap;
    private _proxy;
    private _modelIsSynced;
    private _modelReferenceCollection;
    constructor(documentsAndEditors: MainThreadDocumentsAndEditors, extHostContext: IExtHostContext, modelService: IModelService, modeService: IModeService, textFileService: ITextFileService, fileService: IFileService, textModelResolverService: ITextModelService, untitledEditorService: IUntitledEditorService);
    dispose(): void;
    private _shouldHandleFileEvent(e);
    private _onModelAdded(model);
    private _onModelModeChanged(event);
    private _onModelRemoved(modelUrl);
    $trySaveDocument(uri: URI): TPromise<boolean>;
    $tryOpenDocument(uri: URI): TPromise<any>;
    $tryCreateDocument(options?: {
        language?: string;
        content?: string;
    }): TPromise<URI>;
    private _handleAsResourceInput(uri);
    private _handleUnititledScheme(uri);
    private _doCreateUntitled(resource?, modeId?, initialValue?);
}
