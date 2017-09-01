import { TPromise } from 'vs/base/common/winjs.base';
import { IChannel } from 'vs/base/parts/ipc/common/ipc';
import { IWatcherRequest, IWatcherService } from './watcher';
export interface IWatcherChannel extends IChannel {
    call(command: 'initialize', verboseLogging: boolean): TPromise<void>;
    call(command: 'setRoots', request: IWatcherRequest[]): TPromise<void>;
    call(command: string, arg: any): TPromise<any>;
}
export declare class WatcherChannel implements IWatcherChannel {
    private service;
    constructor(service: IWatcherService);
    call(command: string, arg: any): TPromise<any>;
}
export declare class WatcherChannelClient implements IWatcherService {
    private channel;
    constructor(channel: IWatcherChannel);
    initialize(verboseLogging: boolean): TPromise<void>;
    setRoots(roots: IWatcherRequest[]): TPromise<void>;
}
