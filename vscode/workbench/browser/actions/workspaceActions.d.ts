import { TPromise } from 'vs/base/common/winjs.base';
import { Action } from 'vs/base/common/actions';
import { IWindowService, IWindowsService } from 'vs/platform/windows/common/windows';
import { ITelemetryData } from 'vs/platform/telemetry/common/telemetry';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { IWorkspaceEditingService } from 'vs/workbench/services/workspace/common/workspaceEditing';
import URI from 'vs/base/common/uri';
import { IViewletService } from 'vs/workbench/services/viewlet/browser/viewlet';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IWorkspacesService } from 'vs/platform/workspaces/common/workspaces';
import { IMessageService } from 'vs/platform/message/common/message';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { IWorkbenchEditorService } from 'vs/workbench/services/editor/common/editorService';
export declare class OpenFolderAction extends Action {
    private windowService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, windowService: IWindowService);
    run(event?: any, data?: ITelemetryData): TPromise<any>;
}
export declare class OpenFileFolderAction extends Action {
    private windowService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, windowService: IWindowService);
    run(event?: any, data?: ITelemetryData): TPromise<any>;
}
export declare abstract class BaseWorkspacesAction extends Action {
    protected windowService: IWindowService;
    protected environmentService: IEnvironmentService;
    protected contextService: IWorkspaceContextService;
    constructor(id: string, label: string, windowService: IWindowService, environmentService: IEnvironmentService, contextService: IWorkspaceContextService);
    protected pickFolders(buttonLabel: string, title: string): string[];
}
export declare class AddRootFolderAction extends BaseWorkspacesAction {
    private instantiationService;
    private workspaceEditingService;
    private viewletService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, windowService: IWindowService, contextService: IWorkspaceContextService, environmentService: IEnvironmentService, instantiationService: IInstantiationService, workspaceEditingService: IWorkspaceEditingService, viewletService: IViewletService);
    run(): TPromise<any>;
}
export declare class RemoveRootFolderAction extends Action {
    private rootUri;
    private workspaceEditingService;
    static ID: string;
    static LABEL: string;
    constructor(rootUri: URI, id: string, label: string, workspaceEditingService: IWorkspaceEditingService);
    run(): TPromise<any>;
}
export declare class SaveWorkspaceAsAction extends BaseWorkspacesAction {
    protected workspacesService: IWorkspacesService;
    private windowsService;
    private messageService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, windowService: IWindowService, environmentService: IEnvironmentService, contextService: IWorkspaceContextService, workspacesService: IWorkspacesService, windowsService: IWindowsService, messageService: IMessageService);
    run(): TPromise<any>;
    private saveWorkspace(configPath);
    private saveFolderWorkspace(configPath);
    private getNewWorkspaceConfigPath();
    private isUntitledWorkspace(path);
}
export declare class OpenWorkspaceAction extends Action {
    private windowService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, windowService: IWindowService);
    run(): TPromise<any>;
}
export declare class OpenWorkspaceConfigFileAction extends Action {
    private workspaceContextService;
    private editorService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, workspaceContextService: IWorkspaceContextService, editorService: IWorkbenchEditorService);
    run(): TPromise<any>;
}
