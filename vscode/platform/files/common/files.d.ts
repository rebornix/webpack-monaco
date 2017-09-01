import { TPromise } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
import glob = require('vs/base/common/glob');
import events = require('vs/base/common/events');
import Event from 'vs/base/common/event';
export declare const IFileService: {
    (...args: any[]): void;
    type: IFileService;
};
export interface IFileService {
    _serviceBrand: any;
    /**
     * Allows to listen for file changes. The event will fire for every file within the opened workspace
     * (if any) as well as all files that have been watched explicitly using the #watchFileChanges() API.
     */
    onFileChanges: Event<FileChangesEvent>;
    /**
     * An event that is fired upon successful completion of a certain file operation.
     */
    onAfterOperation: Event<FileOperationEvent>;
    /**
     * Resolve the properties of a file identified by the resource.
     *
     * If the optional parameter "resolveTo" is specified in options, the stat service is asked
     * to provide a stat object that should contain the full graph of folders up to all of the
     * target resources.
     *
     * If the optional parameter "resolveSingleChildDescendants" is specified in options,
     * the stat service is asked to automatically resolve child folders that only
     * contain a single element.
     */
    resolveFile(resource: URI, options?: IResolveFileOptions): TPromise<IFileStat>;
    /**
     * Same as resolveFile but supports resolving mulitple resources in parallel.
     * If one of the resolve targets fails to resolve returns a fake IFileStat instead of making the whole call fail.
     */
    resolveFiles(toResolve: {
        resource: URI;
        options?: IResolveFileOptions;
    }[]): TPromise<IResolveFileResult[]>;
    /**
     *Finds out if a file identified by the resource exists.
     */
    existsFile(resource: URI): TPromise<boolean>;
    /**
     * Resolve the contents of a file identified by the resource.
     *
     * The returned object contains properties of the file and the full value as string.
     */
    resolveContent(resource: URI, options?: IResolveContentOptions): TPromise<IContent>;
    /**
     * Resolve the contents of a file identified by the resource.
     *
     * The returned object contains properties of the file and the value as a readable stream.
     */
    resolveStreamContent(resource: URI, options?: IResolveContentOptions): TPromise<IStreamContent>;
    /**
     * Updates the content replacing its previous value.
     */
    updateContent(resource: URI, value: string, options?: IUpdateContentOptions): TPromise<IFileStat>;
    /**
     * Moves the file to a new path identified by the resource.
     *
     * The optional parameter overwrite can be set to replace an existing file at the location.
     */
    moveFile(source: URI, target: URI, overwrite?: boolean): TPromise<IFileStat>;
    /**
     * Copies the file to a path identified by the resource.
     *
     * The optional parameter overwrite can be set to replace an existing file at the location.
     */
    copyFile(source: URI, target: URI, overwrite?: boolean): TPromise<IFileStat>;
    /**
     * Creates a new file with the given path. The returned promise
     * will have the stat model object as a result.
     *
     * The optional parameter content can be used as value to fill into the new file.
     */
    createFile(resource: URI, content?: string): TPromise<IFileStat>;
    /**
     * Creates a new folder with the given path. The returned promise
     * will have the stat model object as a result.
     */
    createFolder(resource: URI): TPromise<IFileStat>;
    /**
     * Renames the provided file to use the new name. The returned promise
     * will have the stat model object as a result.
     */
    rename(resource: URI, newName: string): TPromise<IFileStat>;
    /**
     * Creates a new empty file if the given path does not exist and otherwise
     * will set the mtime and atime of the file to the current date.
     */
    touchFile(resource: URI): TPromise<IFileStat>;
    /**
     * Deletes the provided file.  The optional useTrash parameter allows to
     * move the file to trash.
     */
    del(resource: URI, useTrash?: boolean): TPromise<void>;
    /**
     * Imports the file to the parent identified by the resource.
     */
    importFile(source: URI, targetFolder: URI): TPromise<IImportResult>;
    /**
     * Allows to start a watcher that reports file change events on the provided resource.
     */
    watchFileChanges(resource: URI): void;
    /**
     * Allows to stop a watcher on the provided resource or absolute fs path.
     */
    unwatchFileChanges(resource: URI): void;
    /**
     * Configures the file service with the provided options.
     */
    updateOptions(options: object): void;
    /**
     * Returns the preferred encoding to use for a given resource.
     */
    getEncoding(resource: URI, preferredEncoding?: string): string;
    /**
     * Frees up any resources occupied by this service.
     */
    dispose(): void;
}
export declare enum FileOperation {
    CREATE = 0,
    DELETE = 1,
    MOVE = 2,
    COPY = 3,
    IMPORT = 4,
}
export declare class FileOperationEvent {
    private _resource;
    private _operation;
    private _target;
    constructor(_resource: URI, _operation: FileOperation, _target?: IFileStat);
    readonly resource: URI;
    readonly target: IFileStat;
    readonly operation: FileOperation;
}
/**
 * Possible changes that can occur to a file.
 */
export declare enum FileChangeType {
    UPDATED = 0,
    ADDED = 1,
    DELETED = 2,
}
/**
 * Identifies a single change in a file.
 */
export interface IFileChange {
    /**
     * The type of change that occurred to the file.
     */
    type: FileChangeType;
    /**
     * The unified resource identifier of the file that changed.
     */
    resource: URI;
}
export declare class FileChangesEvent extends events.Event {
    private _changes;
    constructor(changes: IFileChange[]);
    readonly changes: IFileChange[];
    /**
     * Returns true if this change event contains the provided file with the given change type. In case of
     * type DELETED, this method will also return true if a folder got deleted that is the parent of the
     * provided file path.
     */
    contains(resource: URI, type: FileChangeType): boolean;
    /**
     * Returns the changes that describe added files.
     */
    getAdded(): IFileChange[];
    /**
     * Returns if this event contains added files.
     */
    gotAdded(): boolean;
    /**
     * Returns the changes that describe deleted files.
     */
    getDeleted(): IFileChange[];
    /**
     * Returns if this event contains deleted files.
     */
    gotDeleted(): boolean;
    /**
     * Returns the changes that describe updated files.
     */
    getUpdated(): IFileChange[];
    /**
     * Returns if this event contains updated files.
     */
    gotUpdated(): boolean;
    private getOfType(type);
    private hasType(type);
}
export declare function isParent(path: string, candidate: string, ignoreCase?: boolean): boolean;
export declare function indexOf(path: string, candidate: string, ignoreCase?: boolean): number;
export interface IBaseStat {
    /**
     * The unified resource identifier of this file or folder.
     */
    resource: URI;
    /**
     * The name which is the last segement
     * of the {{path}}.
     */
    name: string;
    /**
     * The last modifictaion date represented
     * as millis from unix epoch.
     */
    mtime: number;
    /**
     * A unique identifier thet represents the
     * current state of the file or directory.
     */
    etag: string;
}
/**
 * A file resource with meta information.
 */
export interface IFileStat extends IBaseStat {
    /**
     * The resource is a directory. if {{true}}
     * {{encoding}} has no meaning.
     */
    isDirectory: boolean;
    /**
     * Return {{true}} when this is a directory
     * that is not empty.
     */
    hasChildren: boolean;
    /**
     * The children of the file stat or undefined if none.
     */
    children?: IFileStat[];
    /**
     * The size of the file if known.
     */
    size?: number;
}
export interface IResolveFileResult {
    stat: IFileStat;
    success: boolean;
}
/**
 * Content and meta information of a file.
 */
export interface IContent extends IBaseStat {
    /**
     * The content of a text file.
     */
    value: string;
    /**
     * The encoding of the content if known.
     */
    encoding: string;
}
/**
 * A Stream emitting strings.
 */
export interface IStringStream {
    on(event: 'data', callback: (chunk: string) => void): void;
    on(event: 'error', callback: (err: any) => void): void;
    on(event: 'end', callback: () => void): void;
    on(event: string, callback: any): void;
}
/**
 * Streamable content and meta information of a file.
 */
export interface IStreamContent extends IBaseStat {
    /**
     * The streamable content of a text file.
     */
    value: IStringStream;
    /**
     * The encoding of the content if known.
     */
    encoding: string;
}
export interface IResolveContentOptions {
    /**
     * The optional acceptTextOnly parameter allows to fail this request early if the file
     * contents are not textual.
     */
    acceptTextOnly?: boolean;
    /**
     * The optional etag parameter allows to return a 304 (Not Modified) if the etag matches
     * with the remote resource. It is the task of the caller to makes sure to handle this
     * error case from the promise.
     */
    etag?: string;
    /**
     * The optional encoding parameter allows to specify the desired encoding when resolving
     * the contents of the file.
     */
    encoding?: string;
    /**
     * The optional guessEncoding parameter allows to guess encoding from content of the file.
     */
    autoGuessEncoding?: boolean;
}
export interface IUpdateContentOptions {
    /**
     * The encoding to use when updating a file.
     */
    encoding?: string;
    /**
     * If set to true, will enforce the selected encoding and not perform any detection using BOMs.
     */
    overwriteEncoding?: boolean;
    /**
     * Whether to overwrite a file even if it is readonly.
     */
    overwriteReadonly?: boolean;
    /**
     * The last known modification time of the file. This can be used to prevent dirty writes.
     */
    mtime?: number;
    /**
     * The etag of the file. This can be used to prevent dirty writes.
     */
    etag?: string;
}
export interface IResolveFileOptions {
    resolveTo?: URI[];
    resolveSingleChildDescendants?: boolean;
}
export interface IImportResult {
    stat: IFileStat;
    isNew: boolean;
}
export declare class FileOperationError extends Error {
    fileOperationResult: FileOperationResult;
    constructor(message: string, fileOperationResult: FileOperationResult);
}
export declare enum FileOperationResult {
    FILE_IS_BINARY = 0,
    FILE_IS_DIRECTORY = 1,
    FILE_NOT_FOUND = 2,
    FILE_NOT_MODIFIED_SINCE = 3,
    FILE_MODIFIED_SINCE = 4,
    FILE_MOVE_CONFLICT = 5,
    FILE_READ_ONLY = 6,
    FILE_TOO_LARGE = 7,
    FILE_INVALID_PATH = 8,
}
export declare const MAX_FILE_SIZE: number;
export declare const AutoSaveConfiguration: {
    OFF: string;
    AFTER_DELAY: string;
    ON_FOCUS_CHANGE: string;
    ON_WINDOW_CHANGE: string;
};
export declare const HotExitConfiguration: {
    OFF: string;
    ON_EXIT: string;
    ON_EXIT_AND_WINDOW_CLOSE: string;
};
export declare const CONTENT_CHANGE_EVENT_BUFFER_DELAY = 1000;
export interface IFilesConfiguration {
    files: {
        associations: {
            [filepattern: string]: string;
        };
        exclude: glob.IExpression;
        watcherExclude: {
            [filepattern: string]: boolean;
        };
        encoding: string;
        autoGuessEncoding: boolean;
        defaultLanguage: string;
        trimTrailingWhitespace: boolean;
        autoSave: string;
        autoSaveDelay: number;
        eol: string;
        hotExit: string;
        useExperimentalFileWatcher: boolean;
    };
}
export declare const SUPPORTED_ENCODINGS: {
    [encoding: string]: {
        labelLong: string;
        labelShort: string;
        order: number;
        encodeOnly?: boolean;
        alias?: string;
    };
};
export declare enum FileKind {
    FILE = 0,
    FOLDER = 1,
    ROOT_FOLDER = 2,
}
