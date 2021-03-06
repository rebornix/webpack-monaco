import { TPromise } from 'vs/base/common/winjs.base';
import uri from 'vs/base/common/uri';
import { FileOperationEvent, IFileService, IResolveFileOptions, IFileStat, IResolveFileResult, IContent, IStreamContent, IImportResult, IResolveContentOptions, IUpdateContentOptions, FileChangesEvent } from 'vs/platform/files/common/files';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IMessageService } from 'vs/platform/message/common/message';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { IEditorGroupService } from 'vs/workbench/services/group/common/groupService';
import { ILifecycleService } from 'vs/platform/lifecycle/common/lifecycle';
import { IStorageService } from 'vs/platform/storage/common/storage';
import Event, { Emitter } from 'vs/base/common/event';
export declare class FileService implements IFileService {
    private configurationService;
    private contextService;
    private editorService;
    private environmentService;
    private editorGroupService;
    private lifecycleService;
    private messageService;
    private storageService;
    _serviceBrand: any;
    private static NET_VERSION_ERROR;
    private static NET_VERSION_ERROR_IGNORE_KEY;
    private raw;
    private toUnbind;
    private activeOutOfWorkspaceWatchers;
    protected _onFileChanges: Emitter<FileChangesEvent>;
    private _onAfterOperation;
    constructor(configurationService: IConfigurationService, contextService: IWorkspaceContextService, editorService: IWorkbenchEditorService, environmentService: IEnvironmentService, editorGroupService: IEditorGroupService, lifecycleService: ILifecycleService, messageService: IMessageService, storageService: IStorageService);
    readonly onFileChanges: Event<FileChangesEvent>;
    readonly onAfterOperation: Event<FileOperationEvent>;
    private onFileServiceError(msg);
    private registerListeners();
    private onDidChangeWorkspaceRoots();
    private getEncodingOverrides();
    private onEditorsChanged();
    private handleOutOfWorkspaceWatchers();
    private onConfigurationChange(configuration);
    updateOptions(options: object): void;
    resolveFile(resource: uri, options?: IResolveFileOptions): TPromise<IFileStat>;
    resolveFiles(toResolve: {
        resource: uri;
        options?: IResolveFileOptions;
    }[]): TPromise<IResolveFileResult[]>;
    existsFile(resource: uri): TPromise<boolean>;
    resolveContent(resource: uri, options?: IResolveContentOptions): TPromise<IContent>;
    resolveStreamContent(resource: uri, options?: IResolveContentOptions): TPromise<IStreamContent>;
    updateContent(resource: uri, value: string, options?: IUpdateContentOptions): TPromise<IFileStat>;
    moveFile(source: uri, target: uri, overwrite?: boolean): TPromise<IFileStat>;
    copyFile(source: uri, target: uri, overwrite?: boolean): TPromise<IFileStat>;
    createFile(resource: uri, content?: string): TPromise<IFileStat>;
    createFolder(resource: uri): TPromise<IFileStat>;
    touchFile(resource: uri): TPromise<IFileStat>;
    rename(resource: uri, newName: string): TPromise<IFileStat>;
    del(resource: uri, useTrash?: boolean): TPromise<void>;
    private doMoveItemToTrash(resource);
    importFile(source: uri, targetFolder: uri): TPromise<IImportResult>;
    watchFileChanges(resource: uri): void;
    unwatchFileChanges(resource: uri): void;
    getEncoding(resource: uri, preferredEncoding?: string): string;
    dispose(): void;
}
