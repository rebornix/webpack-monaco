import { IStorageService, StorageScope } from 'vs/platform/storage/common/storage';
export interface IStorage {
    length: number;
    key(index: number): string;
    clear(): void;
    setItem(key: string, value: any): void;
    getItem(key: string): string;
    removeItem(key: string): void;
}
export declare class StorageService implements IStorageService {
    private workspaceId;
    _serviceBrand: any;
    static COMMON_PREFIX: string;
    static GLOBAL_PREFIX: string;
    static WORKSPACE_PREFIX: string;
    static WORKSPACE_IDENTIFIER: string;
    static NO_WORKSPACE_IDENTIFIER: string;
    private _workspaceStorage;
    private _globalStorage;
    private workspaceKey;
    constructor(globalStorage: IStorage, workspaceStorage: IStorage, workspaceId?: string, legacyWorkspaceId?: number);
    readonly storageId: string;
    readonly globalStorage: IStorage;
    readonly workspaceStorage: IStorage;
    private getWorkspaceKey(id?);
    private cleanupWorkspaceScope(workspaceUid);
    clear(): void;
    store(key: string, value: any, scope?: StorageScope): void;
    get(key: string, scope?: StorageScope, defaultValue?: any): string;
    getInteger(key: string, scope?: StorageScope, defaultValue?: number): number;
    getBoolean(key: string, scope?: StorageScope, defaultValue?: boolean): boolean;
    remove(key: string, scope?: StorageScope): void;
    private toStorageKey(key, scope);
}
export declare class InMemoryLocalStorage implements IStorage {
    private store;
    constructor();
    readonly length: number;
    key(index: number): string;
    clear(): void;
    setItem(key: string, value: any): void;
    getItem(key: string): string;
    removeItem(key: string): void;
}
export declare const inMemoryLocalStorageInstance: InMemoryLocalStorage;
