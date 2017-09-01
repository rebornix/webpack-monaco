import { IStorage } from 'vs/platform/storage/common/storageService';
import { IWorkspaceIdentifier } from 'vs/platform/workspaces/common/workspaces';
export declare type StorageObject = {
    [key: string]: string;
};
export interface IParsedStorage {
    global: Map<string, string>;
    multiRoot: Map<string, StorageObject>;
    folder: Map<string, StorageObject>;
    empty: Map<string, StorageObject>;
}
/**
 * Parses the local storage implementation into global, multi root, folder and empty storage.
 */
export declare function parseStorage(storage: IStorage): IParsedStorage;
export declare function migrateStorageToMultiRootWorkspace(fromWorkspaceId: string, toWorkspaceId: IWorkspaceIdentifier, storage: IStorage): void;
