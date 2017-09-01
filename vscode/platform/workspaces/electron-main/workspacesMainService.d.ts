import { IWorkspacesMainService, IWorkspaceIdentifier, IWorkspaceSavedEvent, IResolvedWorkspace } from 'vs/platform/workspaces/common/workspaces';
import { TPromise } from 'vs/base/common/winjs.base';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import Event from 'vs/base/common/event';
import { ILogService } from 'vs/platform/log/common/log';
export interface ILegacyStoredWorkspace {
    id: string;
    folders: string[];
}
export declare class WorkspacesMainService implements IWorkspacesMainService {
    private environmentService;
    private logService;
    _serviceBrand: any;
    protected workspacesHome: string;
    private _onWorkspaceSaved;
    private _onUntitledWorkspaceDeleted;
    constructor(environmentService: IEnvironmentService, logService: ILogService);
    readonly onWorkspaceSaved: Event<IWorkspaceSavedEvent>;
    readonly onUntitledWorkspaceDeleted: Event<IWorkspaceIdentifier>;
    resolveWorkspace(path: string): TPromise<IResolvedWorkspace>;
    resolveWorkspaceSync(path: string): IResolvedWorkspace;
    private isWorkspacePath(path);
    private doResolveWorkspace(path, contents);
    private doParseStoredWorkspace(path, contents);
    private isInsideWorkspacesHome(path);
    createWorkspace(folders: string[]): TPromise<IWorkspaceIdentifier>;
    createWorkspaceSync(folders: string[]): IWorkspaceIdentifier;
    private createUntitledWorkspace(folders);
    getWorkspaceId(workspaceConfigPath: string): string;
    isUntitledWorkspace(workspace: IWorkspaceIdentifier): boolean;
    saveWorkspace(workspace: IWorkspaceIdentifier, targetConfigPath: string): TPromise<IWorkspaceIdentifier>;
    deleteUntitledWorkspaceSync(workspace: IWorkspaceIdentifier): void;
    private doDeleteUntitledWorkspaceSync(configPath);
    getUntitledWorkspacesSync(): IWorkspaceIdentifier[];
}
