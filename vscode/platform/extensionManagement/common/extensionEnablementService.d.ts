import { TPromise } from 'vs/base/common/winjs.base';
import Event from 'vs/base/common/event';
import { IExtensionManagementService, IExtensionEnablementService } from 'vs/platform/extensionManagement/common/extensionManagement';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
export declare class ExtensionEnablementService implements IExtensionEnablementService {
    private storageService;
    private contextService;
    private environmentService;
    private extensionManagementService;
    _serviceBrand: any;
    private disposables;
    private _onEnablementChanged;
    onEnablementChanged: Event<string>;
    constructor(storageService: IStorageService, contextService: IWorkspaceContextService, environmentService: IEnvironmentService, extensionManagementService: IExtensionManagementService);
    private readonly hasWorkspace;
    getGloballyDisabledExtensions(): string[];
    getWorkspaceDisabledExtensions(): string[];
    canEnable(identifier: string): boolean;
    setEnablement(identifier: string, enable: boolean, workspace?: boolean): TPromise<boolean>;
    private disableExtension(identifier, scope);
    private enableExtension(identifier, scope, fireEvent?);
    private getDisabledExtensions(scope);
    private setDisabledExtensions(disabledExtensions, scope, extension, fireEvent?);
    private onDidUninstallExtension({id, error});
    dispose(): void;
}
