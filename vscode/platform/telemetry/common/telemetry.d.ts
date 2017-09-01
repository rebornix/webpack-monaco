import { TPromise } from 'vs/base/common/winjs.base';
export declare const ITelemetryService: {
    (...args: any[]): void;
    type: ITelemetryService;
};
export interface ITelemetryInfo {
    sessionId: string;
    machineId: string;
    instanceId: string;
}
export interface ITelemetryData {
    from?: string;
    target?: string;
    [key: string]: any;
}
export interface ITelemetryService {
    _serviceBrand: any;
    /**
     * Sends a telemetry event that has been privacy approved.
     * Do not call this unless you have been given approval.
     */
    publicLog(eventName: string, data?: ITelemetryData): TPromise<void>;
    getTelemetryInfo(): TPromise<ITelemetryInfo>;
    isOptedIn: boolean;
}
