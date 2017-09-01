export declare const ICrashReporterService: {
    (...args: any[]): void;
    type: ICrashReporterService;
};
export declare const TELEMETRY_SECTION_ID = "telemetry";
export interface ICrashReporterConfig {
    enableCrashReporter: boolean;
}
export interface ICrashReporterService {
    _serviceBrand: any;
    getChildProcessStartOptions(processName: string): Electron.CrashReporterStartOptions;
}
export declare const NullCrashReporterService: ICrashReporterService;
