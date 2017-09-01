import { TPromise } from 'vs/base/common/winjs.base';
import { IMainContext } from './extHost.protocol';
export declare class ExtHostStorage {
    private _proxy;
    constructor(mainContext: IMainContext);
    getValue<T>(shared: boolean, key: string, defaultValue?: T): TPromise<T>;
    setValue(shared: boolean, key: string, value: any): TPromise<void>;
}
