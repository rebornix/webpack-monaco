import { TPromise } from 'vs/base/common/winjs.base';
import { IChannel } from 'vs/base/parts/ipc/common/ipc';
import { ICredentialsService } from 'vs/platform/credentials/common/credentials';
export interface ICredentialsArgs {
    service: string;
    account: string;
    secret?: string;
}
export interface ICredentialsChannel extends IChannel {
    call(command: 'readSecret', credentials: ICredentialsArgs): TPromise<string>;
    call(command: 'writeSecret', credentials: ICredentialsArgs): TPromise<void>;
    call(command: 'deleteSecret', credentials: ICredentialsArgs): TPromise<boolean>;
    call(command: string, arg?: any): TPromise<any>;
}
export declare class CredentialsChannel implements ICredentialsChannel {
    private service;
    constructor(service: ICredentialsService);
    call(command: string, arg: ICredentialsArgs): TPromise<any>;
}
export declare class CredentialsChannelClient implements ICredentialsService {
    private channel;
    _serviceBrand: any;
    constructor(channel: ICredentialsChannel);
    readSecret(service: string, account: string): TPromise<string | undefined>;
    writeSecret(service: string, account: string, secret: string): TPromise<void>;
    deleteSecret(service: string, account: string): TPromise<boolean>;
}
