import { TPromise } from 'vs/base/common/winjs.base';
import { IMessagePassingProtocol } from 'vs/base/parts/ipc/common/ipc';
export interface IDispatcher {
    invoke(proxyId: string, methodName: string, args: any[]): any;
}
export declare class RPCProtocol {
    private _isDisposed;
    private _bigHandler;
    private _lastMessageId;
    private readonly _invokedHandlers;
    private readonly _pendingRPCReplies;
    private readonly _multiplexor;
    constructor(protocol: IMessagePassingProtocol);
    dispose(): void;
    private _receiveOneMessage(rawmsg);
    private _invokeHandler(proxyId, methodName, args);
    callOnRemote(proxyId: string, methodName: string, args: any[]): TPromise<any>;
    setDispatcher(handler: IDispatcher): void;
}
