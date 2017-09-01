import * as appInsights from 'applicationinsights';
import { TPromise } from 'vs/base/common/winjs.base';
import { ITelemetryAppender } from 'vs/platform/telemetry/common/telemetryUtils';
export declare class AppInsightsAppender implements ITelemetryAppender {
    private _eventPrefix;
    private _defaultData;
    private _aiClient;
    constructor(_eventPrefix: string, _defaultData: {
        [key: string]: any;
    }, aiKeyOrClientFactory: string | (() => typeof appInsights.client));
    private static _getData(data?);
    private static _flaten(obj, result, order?, prefix?);
    log(eventName: string, data?: any): void;
    dispose(): TPromise<any>;
}
