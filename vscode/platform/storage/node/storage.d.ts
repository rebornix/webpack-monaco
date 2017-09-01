import { IEnvironmentService } from 'vs/platform/environment/common/environment';
export declare const IStorageService: {
    (...args: any[]): void;
    type: IStorageService;
};
export interface IStorageService {
    _serviceBrand: any;
    getItem<T>(key: string, defaultValue?: T): T;
    setItem(key: string, data: any): void;
    removeItem(key: string): void;
}
export declare class StorageService implements IStorageService {
    private environmentService;
    _serviceBrand: any;
    private dbPath;
    private database;
    constructor(environmentService: IEnvironmentService);
    getItem<T>(key: string, defaultValue?: T): T;
    setItem(key: string, data: any): void;
    removeItem(key: string): void;
    private load();
    private save();
}
