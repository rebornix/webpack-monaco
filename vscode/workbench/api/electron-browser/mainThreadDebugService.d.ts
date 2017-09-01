import URI from 'vs/base/common/uri';
import { IDebugService, IConfig } from 'vs/workbench/parts/debug/common/debug';
import { TPromise } from 'vs/base/common/winjs.base';
import { MainThreadDebugServiceShape, DebugSessionUUID, IExtHostContext } from '../node/extHost.protocol';
export declare class MainThreadDebugService implements MainThreadDebugServiceShape {
    private debugService;
    private _proxy;
    private _toDispose;
    constructor(extHostContext: IExtHostContext, debugService: IDebugService);
    dispose(): void;
    $registerDebugConfigurationProvider(debugType: string, hasProvide: boolean, hasResolve: boolean, handle: number): TPromise<void>;
    $unregisterDebugConfigurationProvider(handle: number): TPromise<any>;
    $startDebugging(folderUri: URI | undefined, nameOrConfiguration: string | IConfig): TPromise<boolean>;
    $startDebugSession(folderUri: URI | undefined, configuration: IConfig): TPromise<DebugSessionUUID>;
    $customDebugAdapterRequest(sessionId: DebugSessionUUID, request: string, args: any): TPromise<any>;
}
