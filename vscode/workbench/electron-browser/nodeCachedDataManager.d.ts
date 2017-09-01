import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
export declare class NodeCachedDataManager {
    private static _DataMaxAge;
    private _telemetryService;
    private _environmentService;
    private _disposables;
    constructor(telemetryService: ITelemetryService, environmentService: IEnvironmentService);
    dispose(): void;
    private _handleCachedDataInfo();
    private _manageCachedDataSoon();
}
