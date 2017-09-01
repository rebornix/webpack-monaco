import { ITelemetryService, ITelemetryInfo, ITelemetryData } from 'vs/platform/telemetry/common/telemetry';
import { ITelemetryAppender } from 'vs/platform/telemetry/common/telemetryUtils';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { TPromise } from 'vs/base/common/winjs.base';
export interface ITelemetryServiceConfig {
    appender: ITelemetryAppender;
    commonProperties?: TPromise<{
        [name: string]: any;
    }>;
    piiPaths?: string[];
    userOptIn?: boolean;
}
export declare class TelemetryService implements ITelemetryService {
    private _configurationService;
    static IDLE_START_EVENT_NAME: string;
    static IDLE_STOP_EVENT_NAME: string;
    _serviceBrand: any;
    private _appender;
    private _commonProperties;
    private _piiPaths;
    private _userOptIn;
    private _disposables;
    private _cleanupPatterns;
    constructor(config: ITelemetryServiceConfig, _configurationService: IConfigurationService);
    private _updateUserOptIn();
    readonly isOptedIn: boolean;
    getTelemetryInfo(): TPromise<ITelemetryInfo>;
    dispose(): void;
    publicLog(eventName: string, data?: ITelemetryData): TPromise<any>;
    private _cleanupInfo(stack);
}
