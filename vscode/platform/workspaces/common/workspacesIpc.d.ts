import { TPromise } from 'vs/base/common/winjs.base';
import { IChannel } from 'vs/base/parts/ipc/common/ipc';
import { IWorkspacesService, IWorkspaceIdentifier } from 'vs/platform/workspaces/common/workspaces';
export interface IWorkspacesChannel extends IChannel {
    call(command: 'createWorkspace', arg: [string[]]): TPromise<string>;
    call(command: string, arg?: any): TPromise<any>;
}
export declare class WorkspacesChannel implements IWorkspacesChannel {
    private service;
    constructor(service: IWorkspacesService);
    call(command: string, arg?: any): TPromise<any>;
}
export declare class WorkspacesChannelClient implements IWorkspacesService {
    private channel;
    _serviceBrand: any;
    constructor(channel: IWorkspacesChannel);
    createWorkspace(folders?: string[]): TPromise<IWorkspaceIdentifier>;
}
