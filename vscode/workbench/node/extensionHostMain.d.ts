import { TPromise } from 'vs/base/common/winjs.base';
import { RPCProtocol } from 'vs/workbench/services/extensions/node/rpcProtocol';
import { IInitData } from 'vs/workbench/api/node/extHost.protocol';
export declare function exit(code?: number): void;
export declare class ExtensionHostMain {
    private _isTerminating;
    private _diskSearch;
    private _workspace;
    private _environment;
    private _extensionService;
    constructor(rpcProtocol: RPCProtocol, initData: IInitData);
    start(): TPromise<void>;
    terminate(): void;
    private handleEagerExtensions();
    private handleWorkspaceContainsEagerExtensions();
    private handleExtensionTests();
    private gracefulExit(code);
}
