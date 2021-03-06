import Event from 'vs/base/common/event';
import { TPromise } from 'vs/base/common/winjs.base';
import { IPager } from 'vs/base/common/paging';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IExtensionManagementService, IExtensionGalleryService, IQueryOptions, IExtensionEnablementService, IExtensionTipsService } from 'vs/platform/extensionManagement/common/extensionManagement';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IConfigurationEditingService } from 'vs/workbench/services/configuration/common/configurationEditing';
import { IChoiceService, IMessageService } from 'vs/platform/message/common/message';
import { IExtension, IExtensionDependencies, IExtensionsWorkbenchService } from 'vs/workbench/parts/extensions/common/extensions';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
import { IURLService } from 'vs/platform/url/common/url';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
export declare class ExtensionsWorkbenchService implements IExtensionsWorkbenchService {
    private instantiationService;
    private editorService;
    private extensionService;
    private galleryService;
    private configurationService;
    private configurationEditingService;
    private telemetryService;
    private messageService;
    private choiceService;
    private extensionEnablementService;
    private tipsService;
    private workspaceContextService;
    private static SyncPeriod;
    _serviceBrand: any;
    private stateProvider;
    private installing;
    private uninstalling;
    private installed;
    private syncDelayer;
    private autoUpdateDelayer;
    private disposables;
    private _onChange;
    readonly onChange: Event<void>;
    private _isAutoUpdateEnabled;
    private _extensionAllowedBadgeProviders;
    constructor(instantiationService: IInstantiationService, editorService: IWorkbenchEditorService, extensionService: IExtensionManagementService, galleryService: IExtensionGalleryService, configurationService: IConfigurationService, configurationEditingService: IConfigurationEditingService, telemetryService: ITelemetryService, messageService: IMessageService, choiceService: IChoiceService, urlService: IURLService, extensionEnablementService: IExtensionEnablementService, tipsService: IExtensionTipsService, workspaceContextService: IWorkspaceContextService);
    readonly local: IExtension[];
    queryLocal(): TPromise<IExtension[]>;
    queryGallery(options?: IQueryOptions): TPromise<IPager<IExtension>>;
    loadDependencies(extension: IExtension): TPromise<IExtensionDependencies>;
    open(extension: IExtension, sideByside?: boolean): TPromise<any>;
    private fromGallery(gallery);
    private syncLocalWithGalleryExtension(local, gallery);
    checkForUpdates(): TPromise<void>;
    readonly isAutoUpdateEnabled: boolean;
    setAutoUpdate(autoUpdate: boolean): TPromise<void>;
    private eventuallySyncWithGallery(immediate?);
    private syncWithGallery();
    private eventuallyAutoUpdateExtensions();
    private autoUpdateExtensions();
    canInstall(extension: IExtension): boolean;
    install(extension: string | IExtension, promptToInstallDependencies?: boolean): TPromise<void>;
    setEnablement(extension: IExtension, enable: boolean, workspace?: boolean): TPromise<void>;
    uninstall(extension: IExtension): TPromise<void>;
    private promptAndSetEnablement(extension, enable, workspace);
    private promptForDependenciesAndEnable(extension, dependencies, workspace);
    private promptForDependenciesAndDisable(extension, dependencies, workspace);
    private checkAndSetEnablement(extension, dependencies, enable, workspace);
    private getDependenciesRecursively(extension, installed, enable, workspace, checked);
    private getDependentsAfterDisablement(extension, dependencies, installed, workspace);
    private getDependentsErrorMessage(extension, dependents);
    private doSetEnablement(extension, enable, workspace);
    readonly allowedBadgeProviders: string[];
    private onInstallExtension(event);
    private onDidInstallExtension(event);
    private onUninstallExtension(id);
    private onDidUninstallExtension({id, error});
    private onEnablementChanged(extensionIdentifier);
    private getExtensionState(extension);
    private reportTelemetry(active, success);
    private onError(err);
    private onOpenExtensionUrl(uri);
    dispose(): void;
}
