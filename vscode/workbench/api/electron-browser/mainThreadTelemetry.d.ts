import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { MainThreadTelemetryShape, IExtHostContext } from '../node/extHost.protocol';
export declare class MainThreadTelemetry implements MainThreadTelemetryShape {
    private readonly _telemetryService;
    private static _name;
    constructor(extHostContext: IExtHostContext, _telemetryService: ITelemetryService);
    dispose(): void;
    $publicLog(eventName: string, data?: any): void;
}
