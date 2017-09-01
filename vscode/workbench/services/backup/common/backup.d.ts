import Uri from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import { IResolveContentOptions, IUpdateContentOptions } from 'vs/platform/files/common/files';
import { IRawTextSource } from 'vs/editor/common/model/textSource';
export declare const IBackupFileService: {
    (...args: any[]): void;
    type: IBackupFileService;
};
export declare const BACKUP_FILE_RESOLVE_OPTIONS: IResolveContentOptions;
export declare const BACKUP_FILE_UPDATE_OPTIONS: IUpdateContentOptions;
/**
 * A service that handles any I/O and state associated with the backup system.
 */
export interface IBackupFileService {
    _serviceBrand: any;
    /**
     * If backups are enabled.
     */
    backupEnabled: boolean;
    /**
     * Finds out if there are any backups stored.
     */
    hasBackups(): TPromise<boolean>;
    /**
     * Loads the backup resource for a particular resource within the current workspace.
     *
     * @param resource The resource that is backed up.
     * @return The backup resource if any.
     */
    loadBackupResource(resource: Uri): TPromise<Uri>;
    /**
     * Backs up a resource.
     *
     * @param resource The resource to back up.
     * @param content The content of the resource.
     * @param versionId The version id of the resource to backup.
     */
    backupResource(resource: Uri, content: string, versionId?: number): TPromise<void>;
    /**
     * Gets a list of file backups for the current workspace.
     *
     * @return The list of backups.
     */
    getWorkspaceFileBackups(): TPromise<Uri[]>;
    /**
     * Parses backup raw text content into the content, removing the metadata that is also stored
     * in the file.
     *
     * @param rawText The IRawTextProvider from a backup resource.
     * @return The backup file's backed up content.
     */
    parseBackupContent(textSource: IRawTextSource): string;
    /**
     * Discards the backup associated with a resource if it exists..
     *
     * @param resource The resource whose backup is being discarded discard to back up.
     */
    discardResourceBackup(resource: Uri): TPromise<void>;
    /**
     * Discards all backups associated with the current workspace and prevents further backups from
     * being made.
     */
    discardAllWorkspaceBackups(): TPromise<void>;
}
