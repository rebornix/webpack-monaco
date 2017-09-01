import { TPromise } from 'vs/base/common/winjs.base';
import { IChannel } from 'vs/base/parts/ipc/common/ipc';
import Event from 'vs/base/common/event';
import { IUpdateService, IRawUpdate, State, IUpdate } from './update';
export interface IUpdateChannel extends IChannel {
    call(command: 'event:onError'): TPromise<void>;
    call(command: 'event:onUpdateAvailable'): TPromise<void>;
    call(command: 'event:onUpdateNotAvailable'): TPromise<void>;
    call(command: 'event:onUpdateReady'): TPromise<void>;
    call(command: 'event:onStateChange'): TPromise<void>;
    call(command: 'checkForUpdates', arg: boolean): TPromise<IUpdate>;
    call(command: 'quitAndInstall'): TPromise<void>;
    call(command: '_getInitialState'): TPromise<State>;
    call(command: string, arg?: any): TPromise<any>;
}
export declare class UpdateChannel implements IUpdateChannel {
    private service;
    constructor(service: IUpdateService);
    call(command: string, arg?: any): TPromise<any>;
}
export declare class UpdateChannelClient implements IUpdateService {
    private channel;
    _serviceBrand: any;
    private _onError;
    readonly onError: Event<any>;
    private _onUpdateAvailable;
    readonly onUpdateAvailable: Event<{
        url: string;
        version: string;
    }>;
    private _onUpdateNotAvailable;
    readonly onUpdateNotAvailable: Event<boolean>;
    private _onUpdateReady;
    readonly onUpdateReady: Event<IRawUpdate>;
    private _onRemoteStateChange;
    private _onStateChange;
    readonly onStateChange: Event<State>;
    private _state;
    readonly state: State;
    constructor(channel: IUpdateChannel);
    checkForUpdates(explicit: boolean): TPromise<IUpdate>;
    quitAndInstall(): TPromise<void>;
}
