import { FileOperationEvent, IContent, IFileService, IResolveFileOptions, IResolveFileResult, IResolveContentOptions, IFileStat, IStreamContent, IUpdateContentOptions, IImportResult, FileChangesEvent } from 'vs/platform/files/common/files';
import { TPromise } from 'vs/base/common/winjs.base';
import uri from 'vs/base/common/uri';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import Event from 'vs/base/common/event';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
export interface IEncodingOverride {
    resource: uri;
    encoding: string;
}
export interface IFileServiceOptions {
    tmpDir?: string;
    errorLogger?: (msg: string) => void;
    encodingOverride?: IEncodingOverride[];
    watcherIgnoredPatterns?: string[];
    disableWatcher?: boolean;
    verboseLogging?: boolean;
    useExperimentalFileWatcher?: boolean;
}
export declare class FileService implements IFileService {
    private contextService;
    private configurationService;
    _serviceBrand: any;
    private static FS_EVENT_DELAY;
    private static FS_REWATCH_DELAY;
    private tmpPath;
    private options;
    private _onFileChanges;
    private _onAfterOperation;
    private toDispose;
    private activeFileChangesWatchers;
    private fileChangesWatchDelayer;
    private undeliveredRawFileChangesEvents;
    private activeWorkspaceChangeWatcher;
    private currentWorkspaceRootsCount;
    constructor(contextService: IWorkspaceContextService, configurationService: IConfigurationService, options: IFileServiceOptions);
    private registerListeners();
    private onDidChangeWorkspaceRoots();
    readonly onFileChanges: Event<FileChangesEvent>;
    readonly onAfterOperation: Event<FileOperationEvent>;
    updateOptions(options: IFileServiceOptions): void;
    private setupWorkspaceWatching();
    private setupWin32WorkspaceWatching();
    private setupUnixWorkspaceWatching();
    private setupNsfwWorkspaceWatching();
    resolveFile(resource: uri, options?: IResolveFileOptions): TPromise<IFileStat>;
    resolveFiles(toResolve: {
        resource: uri;
        options?: IResolveFileOptions;
    }[]): TPromise<IResolveFileResult[]>;
    existsFile(resource: uri): TPromise<boolean>;
    resolveContent(resource: uri, options?: IResolveContentOptions): TPromise<IContent>;
    resolveStreamContent(resource: uri, options?: IResolveContentOptions): TPromise<IStreamContent>;
    private doResolveContent<IStreamContent>(resource, options, contentResolver);
    updateContent(resource: uri, value: string, options?: IUpdateContentOptions): TPromise<IFileStat>;
    private doSetContentsAndResolve(resource, absolutePath, value, addBOM, encodingToWrite, options);
    createFile(resource: uri, content?: string): TPromise<IFileStat>;
    createFolder(resource: uri): TPromise<IFileStat>;
    touchFile(resource: uri): TPromise<IFileStat>;
    rename(resource: uri, newName: string): TPromise<IFileStat>;
    moveFile(source: uri, target: uri, overwrite?: boolean): TPromise<IFileStat>;
    copyFile(source: uri, target: uri, overwrite?: boolean): TPromise<IFileStat>;
    private moveOrCopyFile(source, target, keepCopy, overwrite);
    private doMoveOrCopyFile(sourcePath, targetPath, keepCopy, overwrite);
    importFile(source: uri, targetFolder: uri): TPromise<IImportResult>;
    del(resource: uri): TPromise<void>;
    private toAbsolutePath(arg1);
    private resolve(resource, options?);
    private toStatResolver(resource);
    private resolveFileStreamContent(model, enc?);
    private resolveFileContent(model, enc?);
    getEncoding(resource: uri, preferredEncoding?: string): string;
    private configuredAutoGuessEncoding(resource);
    private configuredEncoding(resource);
    private getEncodingOverride(resource);
    private checkFile(absolutePath, options?);
    watchFileChanges(resource: uri): void;
    private onRawFileChange(event);
    unwatchFileChanges(resource: uri): void;
    dispose(): void;
}
export declare class StatResolver {
    private resource;
    private isDirectory;
    private mtime;
    private name;
    private etag;
    private size;
    private verboseLogging;
    constructor(resource: uri, isDirectory: boolean, mtime: number, size: number, verboseLogging: boolean);
    resolve(options: IResolveFileOptions): TPromise<IFileStat>;
    private resolveChildren(absolutePath, absoluteTargetPaths, resolveSingleChildDescendants, callback);
}
