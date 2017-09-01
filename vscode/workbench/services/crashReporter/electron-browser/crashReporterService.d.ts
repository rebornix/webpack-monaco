import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IWindowsService } from 'vs/platform/windows/common/windows';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { ICrashReporterService } from 'vs/workbench/services/crashReporter/common/crashReporterService';
export declare class CrashReporterService implements ICrashReporterService {
    private telemetryService;
    private windowsService;
    _serviceBrand: any;
    private options;
    private isEnabled;
    constructor(telemetryService: ITelemetryService, windowsService: IWindowsService, configurationService: IConfigurationService);
    private startCrashReporter();
    private getSubmitURL();
    getChildProcessStartOptions(name: string): Electron.CrashReporterStartOptions;
}
