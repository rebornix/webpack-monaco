import { TPromise, PPromise, TValueCallback, TProgressCallback } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
export declare class DeferredTPromise<T> extends TPromise<T> {
    canceled: boolean;
    private completeCallback;
    private errorCallback;
    private progressCallback;
    constructor();
    complete(value: T): void;
    error(err: any): void;
    progress(p: any): void;
    private oncancel();
}
export declare class DeferredPPromise<C, P> extends PPromise<C, P> {
    private completeCallback;
    private errorCallback;
    private progressCallback;
    constructor(init?: (complete: TValueCallback<C>, error: (err: any) => void, progress: TProgressCallback<P>) => void, oncancel?: any);
    private oncancel();
    complete(c: C): void;
    progress(p: P): void;
    error(e: any): void;
}
export declare function onError(error: Error, done: () => void): void;
export declare function toResource(path: any): URI;
