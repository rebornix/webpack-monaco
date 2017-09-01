import { Disposable } from 'vs/base/common/lifecycle';
import { TPromise } from 'vs/base/common/winjs.base';
export interface IWorker {
    getId(): number;
    postMessage(message: string): void;
    dispose(): void;
}
export interface IWorkerCallback {
    (message: string): void;
}
export interface IWorkerFactory {
    create(moduleId: string, callback: IWorkerCallback, onErrorCallback: (err: any) => void): IWorker;
}
export declare function logOnceWebWorkerWarning(err: any): void;
/**
 * Main thread side
 */
export declare class SimpleWorkerClient<T> extends Disposable {
    private _worker;
    private _onModuleLoaded;
    private _protocol;
    private _lazyProxy;
    private _lastRequestTimestamp;
    constructor(workerFactory: IWorkerFactory, moduleId: string);
    getProxyObject(): TPromise<T>;
    getLastRequestTimestamp(): number;
    private _request(method, args);
    private _onError(message, error?);
}
export interface IRequestHandler {
    _requestHandlerTrait: any;
}
/**
 * Worker side
 */
export declare class SimpleWorkerServer {
    private _protocol;
    private _requestHandler;
    constructor(postSerializedMessage: (msg: string) => void);
    onmessage(msg: string): void;
    private _handleMessage(method, args);
    private initialize(workerId, moduleId, loaderConfig);
}
/**
 * Called on the worker side
 */
export declare function create(postMessage: (msg: string) => void): SimpleWorkerServer;
