import { TPromise } from 'vs/base/common/winjs.base';
import { IChannel } from 'vs/base/parts/ipc/common/ipc';
import { ITelemetryAppender } from 'vs/platform/telemetry/common/telemetryUtils';
export interface ITelemetryLog {
    eventName: string;
    data?: any;
}
export interface ITelemetryAppenderChannel extends IChannel {
    call(command: 'log', data: ITelemetryLog): TPromise<void>;
    call(command: string, arg: any): TPromise<any>;
}
export declare class TelemetryAppenderChannel implements ITelemetryAppenderChannel {
    private appender;
    constructor(appender: ITelemetryAppender);
    call(command: string, {eventName, data}: ITelemetryLog): TPromise<any>;
}
export declare class TelemetryAppenderClient implements ITelemetryAppender {
    private channel;
    constructor(channel: ITelemetryAppenderChannel);
    log(eventName: string, data?: any): any;
    dispose(): any;
}
