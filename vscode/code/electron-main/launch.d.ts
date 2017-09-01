import { TPromise } from 'vs/base/common/winjs.base';
import { IChannel } from 'vs/base/parts/ipc/common/ipc';
import { ILogService } from 'vs/platform/log/common/log';
import { IURLService } from 'vs/platform/url/common/url';
import { IProcessEnvironment } from 'vs/base/common/platform';
import { ParsedArgs } from 'vs/platform/environment/common/environment';
import { IWindowsMainService } from 'vs/platform/windows/electron-main/windows';
export declare const ID = "launchService";
export declare const ILaunchService: {
    (...args: any[]): void;
    type: ILaunchService;
};
export interface IStartArguments {
    args: ParsedArgs;
    userEnv: IProcessEnvironment;
}
export interface ILaunchService {
    _serviceBrand: any;
    start(args: ParsedArgs, userEnv: IProcessEnvironment): TPromise<void>;
    getMainProcessId(): TPromise<number>;
}
export interface ILaunchChannel extends IChannel {
    call(command: 'start', arg: IStartArguments): TPromise<void>;
    call(command: 'get-main-process-id', arg: null): TPromise<any>;
    call(command: string, arg: any): TPromise<any>;
}
export declare class LaunchChannel implements ILaunchChannel {
    private service;
    constructor(service: ILaunchService);
    call(command: string, arg: any): TPromise<any>;
}
export declare class LaunchChannelClient implements ILaunchService {
    private channel;
    _serviceBrand: any;
    constructor(channel: ILaunchChannel);
    start(args: ParsedArgs, userEnv: IProcessEnvironment): TPromise<void>;
    getMainProcessId(): TPromise<number>;
}
export declare class LaunchService implements ILaunchService {
    private logService;
    private windowsService;
    private urlService;
    _serviceBrand: any;
    constructor(logService: ILogService, windowsService: IWindowsMainService, urlService: IURLService);
    start(args: ParsedArgs, userEnv: IProcessEnvironment): TPromise<void>;
    getMainProcessId(): TPromise<number>;
}
