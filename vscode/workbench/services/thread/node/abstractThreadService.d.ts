import { IDispatcher, RPCProtocol } from 'vs/workbench/services/extensions/node/rpcProtocol';
import { ProxyIdentifier } from 'vs/workbench/services/thread/common/threadService';
export declare abstract class AbstractThreadService implements IDispatcher {
    private readonly _rpcProtocol;
    private readonly _isMain;
    protected readonly _locals: {
        [id: string]: any;
    };
    private readonly _proxies;
    constructor(rpcProtocol: RPCProtocol, isMain: boolean);
    dispose(): void;
    invoke(proxyId: string, methodName: string, args: any[]): any;
    get<T>(identifier: ProxyIdentifier<T>): T;
    private _createProxy<T>(proxyId);
    set<T, R extends T>(identifier: ProxyIdentifier<T>, value: R): R;
    assertRegistered(identifiers: ProxyIdentifier<any>[]): void;
    private _callOnRemote(proxyId, methodName, args);
}
