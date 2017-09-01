import { TPromise } from 'vs/base/common/winjs.base';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import Event from 'vs/base/common/event';
export declare const IWorkspacesMainService: {
    (...args: any[]): void;
    type: IWorkspacesMainService;
};
export declare const IWorkspacesService: {
    (...args: any[]): void;
    type: IWorkspacesService;
};
export declare const WORKSPACE_EXTENSION = "code-workspace";
export declare const WORKSPACE_FILTER: {
    name: string;
    extensions: string[];
}[];
export declare const UNTITLED_WORKSPACE_NAME = "workspace.json";
/**
 * A single folder workspace identifier is just the path to the folder.
 */
export declare type ISingleFolderWorkspaceIdentifier = string;
export interface IWorkspaceIdentifier {
    id: string;
    configPath: string;
}
export interface IStoredWorkspaceFolder {
    path: string;
}
export interface IStoredWorkspace {
    folders: IStoredWorkspaceFolder[];
}
export interface IResolvedWorkspace extends IWorkspaceIdentifier, IStoredWorkspace {
}
export interface IWorkspaceSavedEvent {
    workspace: IWorkspaceIdentifier;
    oldConfigPath: string;
}
export interface IWorkspacesMainService extends IWorkspacesService {
    _serviceBrand: any;
    onWorkspaceSaved: Event<IWorkspaceSavedEvent>;
    onUntitledWorkspaceDeleted: Event<IWorkspaceIdentifier>;
    saveWorkspace(workspace: IWorkspaceIdentifier, target: string): TPromise<IWorkspaceIdentifier>;
    createWorkspaceSync(folders?: string[]): IWorkspaceIdentifier;
    resolveWorkspace(path: string): TPromise<IResolvedWorkspace>;
    resolveWorkspaceSync(path: string): IResolvedWorkspace;
    isUntitledWorkspace(workspace: IWorkspaceIdentifier): boolean;
    deleteUntitledWorkspaceSync(workspace: IWorkspaceIdentifier): void;
    getUntitledWorkspacesSync(): IWorkspaceIdentifier[];
    getWorkspaceId(workspacePath: string): string;
}
export interface IWorkspacesService {
    _serviceBrand: any;
    createWorkspace(folders?: string[]): TPromise<IWorkspaceIdentifier>;
}
export declare function getWorkspaceLabel(workspace: (IWorkspaceIdentifier | ISingleFolderWorkspaceIdentifier), environmentService: IEnvironmentService, options?: {
    verbose: boolean;
}): string;
export declare function isSingleFolderWorkspaceIdentifier(obj: any): obj is ISingleFolderWorkspaceIdentifier;
export declare function isWorkspaceIdentifier(obj: any): obj is IWorkspaceIdentifier;
