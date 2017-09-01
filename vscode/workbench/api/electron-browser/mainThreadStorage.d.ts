import { TPromise } from 'vs/base/common/winjs.base';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { MainThreadStorageShape, IExtHostContext } from '../node/extHost.protocol';
export declare class MainThreadStorage implements MainThreadStorageShape {
    private _storageService;
    constructor(extHostContext: IExtHostContext, storageService: IStorageService);
    dispose(): void;
    $getValue<T>(shared: boolean, key: string): TPromise<T>;
    $setValue(shared: boolean, key: string, value: any): TPromise<any>;
}
