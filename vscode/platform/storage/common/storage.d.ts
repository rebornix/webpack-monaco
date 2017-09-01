export declare const ID = "storageService";
export declare const IStorageService: {
    (...args: any[]): void;
    type: IStorageService;
};
export interface IStorageService {
    _serviceBrand: any;
    /**
     * Store a string value under the given key to local storage.
     *
     * The optional scope argument allows to define the scope of the operation.
     */
    store(key: string, value: any, scope?: StorageScope): void;
    /**
     * Delete an element stored under the provided key from local storage.
     *
     * The optional scope argument allows to define the scope of the operation.
     */
    remove(key: string, scope?: StorageScope): void;
    /**
     * Retrieve an element stored with the given key from local storage. Use
     * the provided defaultValue if the element is null or undefined.
     *
     * The optional scope argument allows to define the scope of the operation.
     */
    get(key: string, scope?: StorageScope, defaultValue?: string): string;
    /**
     * Retrieve an element stored with the given key from local storage. Use
     * the provided defaultValue if the element is null or undefined. The element
     * will be converted to a number using parseInt with a base of 10.
     *
     * The optional scope argument allows to define the scope of the operation.
     */
    getInteger(key: string, scope?: StorageScope, defaultValue?: number): number;
    /**
     * Retrieve an element stored with the given key from local storage. Use
     * the provided defaultValue if the element is null or undefined. The element
     * will be converted to a boolean.
     *
     * The optional scope argument allows to define the scope of the operation.
     */
    getBoolean(key: string, scope?: StorageScope, defaultValue?: boolean): boolean;
}
export declare enum StorageScope {
    /**
     * The stored data will be scoped to all workspaces of this domain.
     */
    GLOBAL = 0,
    /**
     * The stored data will be scoped to the current workspace.
     */
    WORKSPACE = 1,
}
export declare const NullStorageService: IStorageService;
