import Event from 'vs/base/common/event';
import { TPromise } from 'vs/base/common/winjs.base';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IExtensionManagementService, ILocalExtension, IExtensionEnablementService, IExtensionTipsService } from 'vs/platform/extensionManagement/common/extensionManagement';
import { IExtensionService } from 'vs/platform/extensions/common/extensions';
import { ILifecycleService } from 'vs/platform/lifecycle/common/lifecycle';
import { IWorkbenchContribution } from 'vs/workbench/common/contributions';
import { ServicesAccessor, IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { IMessageService, IChoiceService } from 'vs/platform/message/common/message';
export interface IExtensionStatus {
    identifier: string;
    local: ILocalExtension;
    globallyEnabled: boolean;
}
export declare class KeymapExtensions implements IWorkbenchContribution {
    private instantiationService;
    private extensionEnablementService;
    private tipsService;
    private choiceService;
    private telemetryService;
    private disposables;
    constructor(instantiationService: IInstantiationService, extensionEnablementService: IExtensionEnablementService, tipsService: IExtensionTipsService, choiceService: IChoiceService, lifecycleService: ILifecycleService, telemetryService: ITelemetryService);
    getId(): string;
    private checkForOtherKeymaps(extensionId);
    private promptForDisablingOtherKeymaps(newKeymap, oldKeymaps);
    dispose(): void;
}
export declare function onExtensionChanged(accessor: ServicesAccessor): Event<string[]>;
export declare function getInstalledExtensions(accessor: ServicesAccessor): TPromise<IExtensionStatus[]>;
export declare function isKeymapExtension(tipsService: IExtensionTipsService, extension: IExtensionStatus): boolean;
export declare class BetterMergeDisabled implements IWorkbenchContribution {
    constructor(storageService: IStorageService, messageService: IMessageService, extensionService: IExtensionService, extensionManagementService: IExtensionManagementService, telemetryService: ITelemetryService);
    getId(): string;
}
