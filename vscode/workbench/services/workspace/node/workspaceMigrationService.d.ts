import { TPromise } from 'vs/base/common/winjs.base';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
import { IWorkspaceIdentifier } from 'vs/platform/workspaces/common/workspaces';
import { ILifecycleService } from 'vs/platform/lifecycle/common/lifecycle';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { IJSONEditingService } from 'vs/workbench/services/configuration/common/jsonEditing';
import { IWorkspaceMigrationService } from 'vs/workbench/services/workspace/common/workspaceEditing';
export declare class WorkspaceMigrationService implements IWorkspaceMigrationService {
    private storageService;
    private jsonEditingService;
    private contextService;
    private configurationService;
    private lifecycleService;
    _serviceBrand: any;
    private shutdownListener;
    constructor(storageService: IStorageService, jsonEditingService: IJSONEditingService, contextService: IWorkspaceContextService, configurationService: IConfigurationService, lifecycleService: ILifecycleService);
    migrate(toWorkspaceId: IWorkspaceIdentifier): TPromise<void>;
    migrateStorage(toWorkspaceId: IWorkspaceIdentifier): void;
    private migrateConfiguration(toWorkspaceId);
}
