import { TPromise } from 'vs/base/common/winjs.base';
import { IStorageService } from 'vs/platform/storage/common/storage';
export declare function resolveWorkbenchCommonProperties(storageService: IStorageService, commit: string, version: string): TPromise<{
    [name: string]: string;
}>;
export declare function getOrCreateMachineId(storageService: IStorageService): TPromise<string>;
