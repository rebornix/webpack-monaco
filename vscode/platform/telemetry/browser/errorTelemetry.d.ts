import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
export default class ErrorTelemetry {
    static ERROR_FLUSH_TIMEOUT: number;
    private _telemetryService;
    private _flushDelay;
    private _flushHandle;
    private _buffer;
    private _disposables;
    constructor(telemetryService: ITelemetryService, flushDelay?: number);
    dispose(): void;
    private _onErrorEvent(err);
    private _onUncaughtError(message, filename, line, column?, err?);
    private _enqueue(e);
    private _flushBuffer();
}
