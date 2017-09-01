import { IWorkspaceEditingService } from 'vs/workbench/services/workspace/common/workspaceEditing';
import URI from 'vs/base/common/uri';
import { TPromise } from 'vs/base/common/winjs.base';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IWindowsService } from 'vs/platform/windows/common/windows';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { IJSONEditingService } from 'vs/workbench/services/configuration/common/jsonEditing';
import { IWorkspacesService } from 'vs/platform/workspaces/common/workspaces';
export declare class WorkspaceEditingService implements IWorkspaceEditingService {
    private jsonEditingService;
    private contextService;
    private environmentService;
    private windowsService;
    private workspacesService;
    _serviceBrand: any;
    constructor(jsonEditingService: IJSONEditingService, contextService: IWorkspaceContextService, environmentService: IEnvironmentService, windowsService: IWindowsService, workspacesService: IWorkspacesService);
    addRoots(rootsToAdd: URI[]): TPromise<void>;
    removeRoots(rootsToRemove: URI[]): TPromise<void>;
    private isSupported();
    private doSetRoots(newRoots);
    private validateRoots(roots);
}
