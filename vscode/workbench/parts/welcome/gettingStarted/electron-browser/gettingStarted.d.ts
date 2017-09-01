import { IWorkbenchContribution } from 'vs/workbench/common/contributions';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
export declare class GettingStarted implements IWorkbenchContribution {
    private storageService;
    private telemetryService;
    private static hideWelcomeSettingskey;
    private welcomePageURL;
    private appName;
    constructor(storageService: IStorageService, environmentService: IEnvironmentService, telemetryService: ITelemetryService);
    getId(): string;
    private getUrl(telemetryInfo);
    private openExternal(url);
    private handleWelcome();
}
