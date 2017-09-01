import URI from 'vs/base/common/uri';
import Event from 'vs/base/common/event';
export declare const IWorkspaceContextService: {
    (...args: any[]): void;
    type: IWorkspaceContextService;
};
export interface IWorkspaceContextService {
    _serviceBrand: any;
    /**
     * Returns if the application was opened with a workspace or not.
     */
    hasWorkspace(): boolean;
    /**
     * Returns if the application was opened with a folder.
     */
    hasFolderWorkspace(): boolean;
    /**
     * Returns if the application was opened with a workspace that can have one or more folders.
     */
    hasMultiFolderWorkspace(): boolean;
    /**
     * Provides access to the workspace object the platform is running with. This may be null if the workbench was opened
     * without workspace (empty);
     */
    getLegacyWorkspace(): ILegacyWorkspace;
    /**
     * Provides access to the workspace object the platform is running with. This may be null if the workbench was opened
     * without workspace (empty);
     */
    getWorkspace(): IWorkspace;
    /**
     * An event which fires on workspace name changes.
     */
    onDidChangeWorkspaceName: Event<void>;
    /**
     * An event which fires on workspace roots change.
     */
    onDidChangeWorkspaceRoots: Event<void>;
    /**
     * Returns the root for the given resource from the workspace.
     * Can be null if there is no workspace or the resource is not inside the workspace.
     */
    getRoot(resource: URI): URI;
    /**
     * Returns if the provided resource is inside the workspace or not.
     */
    isInsideWorkspace(resource: URI): boolean;
    /**
     * Given a workspace relative path, returns the resource with the absolute path.
     */
    toResource: (workspaceRelativePath: string) => URI;
}
export interface ILegacyWorkspace {
    /**
     * the full uri of the workspace. this is a file:// URL to the location
     * of the workspace on disk.
     */
    resource: URI;
    /**
     * creation time of the workspace folder if known
     */
    ctime?: number;
}
export interface IWorkspace {
    /**
     * the unique identifier of the workspace.
     */
    readonly id: string;
    /**
     * the name of the workspace.
     */
    readonly name: string;
    /**
     * Roots in the workspace.
     */
    readonly roots: URI[];
    /**
     * the location of the workspace configuration
     */
    readonly configuration?: URI;
}
export declare class LegacyWorkspace implements ILegacyWorkspace {
    private _resource;
    private _ctime;
    private _name;
    constructor(_resource: URI, _ctime?: number);
    readonly resource: URI;
    readonly name: string;
    readonly ctime: number;
    toResource(workspaceRelativePath: string, root?: URI): URI;
}
export declare class Workspace implements IWorkspace {
    readonly id: string;
    private _name;
    private _configuration;
    private _rootsMap;
    private _roots;
    constructor(id: string, _name: string, roots: URI[], _configuration?: URI);
    private ensureUnique(roots);
    roots: URI[];
    name: string;
    configuration: URI;
    getRoot(resource: URI): URI;
    private updateRootsMap();
    toJSON(): IWorkspace;
}
