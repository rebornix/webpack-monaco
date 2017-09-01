import Uri from 'vs/base/common/uri';
import { IBackupFileService } from 'vs/workbench/services/backup/common/backup';
import { IFileService } from 'vs/platform/files/common/files';
import { TPromise } from 'vs/base/common/winjs.base';
import { IRawTextSource } from 'vs/editor/common/model/textSource';
export interface IBackupFilesModel {
    resolve(backupRoot: string): TPromise<IBackupFilesModel>;
    add(resource: Uri, versionId?: number): void;
    has(resource: Uri, versionId?: number): boolean;
    get(): Uri[];
    remove(resource: Uri): void;
    count(): number;
    clear(): void;
}
export declare class BackupFilesModel implements IBackupFilesModel {
    private cache;
    resolve(backupRoot: string): TPromise<IBackupFilesModel>;
    add(resource: Uri, versionId?: number): void;
    count(): number;
    has(resource: Uri, versionId?: number): boolean;
    get(): Uri[];
    remove(resource: Uri): void;
    clear(): void;
}
export declare class BackupFileService implements IBackupFileService {
    private backupWorkspacePath;
    private fileService;
    _serviceBrand: any;
    private static readonly META_MARKER;
    private isShuttingDown;
    private ready;
    /**
     * Ensure IO operations on individual files are performed in order, this could otherwise lead
     * to unexpected behavior when backups are persisted and discarded in the wrong order.
     */
    private ioOperationQueues;
    constructor(backupWorkspacePath: string, fileService: IFileService);
    readonly backupEnabled: boolean;
    private init();
    hasBackups(): TPromise<boolean>;
    loadBackupResource(resource: Uri): TPromise<Uri>;
    backupResource(resource: Uri, content: string, versionId?: number): TPromise<void>;
    discardResourceBackup(resource: Uri): TPromise<void>;
    private getResourceIOQueue(resource);
    discardAllWorkspaceBackups(): TPromise<void>;
    getWorkspaceFileBackups(): TPromise<Uri[]>;
    parseBackupContent(rawTextSource: IRawTextSource): string;
    protected getBackupResource(resource: Uri, legacyMacWindowsFormat?: boolean): Uri;
    private hashPath(resource, legacyMacWindowsFormat?);
}
