import { TPromise } from 'vs/base/common/winjs.base';
import { IThreadService, ProxyIdentifier } from 'vs/workbench/services/thread/common/threadService';
export declare function OneGetThreadService(thing: any): IThreadService;
export declare abstract class AbstractTestThreadService {
    private _isMain;
    protected _locals: {
        [id: string]: any;
    };
    private _proxies;
    constructor(isMain: boolean);
    handle(rpcId: string, methodName: string, args: any[]): any;
    get<T>(identifier: ProxyIdentifier<T>): T;
    private _createProxy<T>(id);
    set<T, R extends T>(identifier: ProxyIdentifier<T>, value: R): R;
    protected abstract _callOnRemote(proxyId: string, path: string, args: any[]): TPromise<any>;
}
export declare class TestThreadService extends AbstractTestThreadService implements IThreadService {
    constructor();
    private _callCountValue;
    private _idle;
    private _completeIdle;
    private _callCount;
    sync(): TPromise<any>;
    private _testInstances;
    setTestInstance<T>(identifier: ProxyIdentifier<T>, value: T): T;
    get<T>(identifier: ProxyIdentifier<T>): T;
    protected _callOnRemote(proxyId: string, path: string, args: any[]): TPromise<any>;
    assertRegistered(identifiers: ProxyIdentifier<any>[]): void;
}
