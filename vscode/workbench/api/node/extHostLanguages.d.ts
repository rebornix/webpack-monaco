import { TPromise } from 'vs/base/common/winjs.base';
import { IMainContext } from './extHost.protocol';
export declare class ExtHostLanguages {
    private _proxy;
    constructor(mainContext: IMainContext);
    getLanguages(): TPromise<string[]>;
}
