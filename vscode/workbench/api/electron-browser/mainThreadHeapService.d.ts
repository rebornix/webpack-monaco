import { TPromise } from 'vs/base/common/winjs.base';
import { IExtHostContext } from '../node/extHost.protocol';
import Event from 'vs/base/common/event';
export declare const IHeapService: {
    (...args: any[]): void;
    type: IHeapService;
};
export interface IHeapService {
    _serviceBrand: any;
    readonly onGarbageCollection: Event<number[]>;
    /**
     * Track gc-collection for all new objects that
     * have the $ident-value set.
     */
    trackRecursive<T>(p: TPromise<T>): TPromise<T>;
    /**
     * Track gc-collection for all new objects that
     * have the $ident-value set.
     */
    trackRecursive<T>(obj: T): T;
}
export declare class HeapService implements IHeapService {
    _serviceBrand: any;
    private _onGarbageCollection;
    readonly onGarbageCollection: Event<number[]>;
    private _activeSignals;
    private _activeIds;
    private _consumeHandle;
    constructor();
    dispose(): void;
    trackRecursive<T>(p: TPromise<T>): TPromise<T>;
    trackRecursive<T>(obj: T): T;
    private _doTrackRecursive(obj);
}
export declare class MainThreadHeapService {
    private _toDispose;
    constructor(extHostContext: IExtHostContext, heapService: IHeapService);
    dispose(): void;
}
