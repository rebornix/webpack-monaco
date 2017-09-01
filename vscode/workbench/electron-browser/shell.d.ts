import 'vs/css!./media/shell';
import { TPromise } from 'vs/base/common/winjs.base';
import { IWindowConfiguration } from 'vs/platform/windows/common/windows';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { ServiceCollection } from 'vs/platform/instantiation/common/serviceCollection';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { ITimerService } from 'vs/workbench/services/timer/common/timerService';
import 'vs/platform/opener/browser/opener.contribution';
/**
 * Services that we require for the Shell
 */
export interface ICoreServices {
    contextService: IWorkspaceContextService;
    configurationService: IConfigurationService;
    environmentService: IEnvironmentService;
    timerService: ITimerService;
    storageService: IStorageService;
}
/**
 * The workbench shell contains the workbench with a rich header containing navigation and the activity bar.
 * With the Shell being the top level element in the page, it is also responsible for driving the layouting.
 */
export declare class WorkbenchShell {
    private storageService;
    private messageService;
    private environmentService;
    private contextViewService;
    private configurationService;
    private contextService;
    private telemetryService;
    private experimentService;
    private extensionService;
    private broadcastService;
    private timerService;
    private themeService;
    private lifecycleService;
    private mainProcessServices;
    private container;
    private toUnbind;
    private previousErrorValue;
    private previousErrorTime;
    private content;
    private contentsContainer;
    private configuration;
    private workbench;
    constructor(container: HTMLElement, coreServices: ICoreServices, mainProcessServices: ServiceCollection, configuration: IWindowConfiguration);
    private createContents(parent);
    private onWorkbenchStarted(info);
    private initServiceCollection(container);
    private sendMachineIdToMain(storageService);
    open(): void;
    private registerListeners();
    onUnexpectedError(error: any): void;
    private layout();
    joinCreation(): TPromise<boolean>;
    dispose(): void;
}
