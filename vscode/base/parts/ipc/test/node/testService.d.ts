import { TPromise, PPromise } from 'vs/base/common/winjs.base';
import { IChannel } from 'vs/base/parts/ipc/common/ipc';
import Event from 'vs/base/common/event';
export interface IMarcoPoloEvent {
    answer: string;
}
export interface ITestService {
    onMarco: Event<IMarcoPoloEvent>;
    marco(): TPromise<string>;
    pong(ping: string): TPromise<{
        incoming: string;
        outgoing: string;
    }>;
    cancelMe(): TPromise<boolean>;
    batchPerf(batches: number, size: number, dataSize: number): PPromise<any, any[]>;
}
export declare class TestService implements ITestService {
    private _onMarco;
    onMarco: Event<IMarcoPoloEvent>;
    private _data;
    marco(): TPromise<string>;
    pong(ping: string): TPromise<{
        incoming: string;
        outgoing: string;
    }>;
    cancelMe(): TPromise<boolean>;
    batchPerf(batches: number, size: number, dataSize: number): PPromise<any, any[]>;
}
export interface ITestChannel extends IChannel {
    call(command: 'marco'): TPromise<any>;
    call(command: 'pong', ping: string): TPromise<any>;
    call(command: 'cancelMe'): TPromise<any>;
    call(command: 'batchPerf', args: {
        batches: number;
        size: number;
        dataSize: number;
    }): PPromise<any, any[]>;
    call(command: string, ...args: any[]): TPromise<any>;
}
export declare class TestChannel implements ITestChannel {
    private testService;
    constructor(testService: ITestService);
    call(command: string, ...args: any[]): TPromise<any>;
}
export declare class TestServiceClient implements ITestService {
    private channel;
    private _onMarco;
    readonly onMarco: Event<IMarcoPoloEvent>;
    constructor(channel: ITestChannel);
    marco(): TPromise<string>;
    pong(ping: string): TPromise<{
        incoming: string;
        outgoing: string;
    }>;
    cancelMe(): TPromise<boolean>;
    batchPerf(batches: number, size: number, dataSize: number): PPromise<any, any[]>;
}
