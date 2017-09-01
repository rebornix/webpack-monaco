import { TPromise } from 'vs/base/common/winjs.base';
import { Action } from 'vs/base/common/actions';
import { IModeService } from 'vs/editor/common/services/modeService';
import { IQuickOpenService } from 'vs/platform/quickOpen/common/quickOpen';
import { IPreferencesService } from 'vs/workbench/parts/preferences/common/preferences';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
export declare class OpenGlobalSettingsAction extends Action {
    private preferencesService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, preferencesService: IPreferencesService);
    run(event?: any): TPromise<any>;
}
export declare class OpenGlobalKeybindingsAction extends Action {
    private preferencesService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, preferencesService: IPreferencesService);
    run(event?: any): TPromise<any>;
}
export declare class OpenGlobalKeybindingsFileAction extends Action {
    private preferencesService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, preferencesService: IPreferencesService);
    run(event?: any): TPromise<any>;
}
export declare class OpenWorkspaceSettingsAction extends Action {
    private preferencesService;
    private workspaceContextService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, preferencesService: IPreferencesService, workspaceContextService: IWorkspaceContextService);
    run(event?: any): TPromise<any>;
}
export declare class OpenFolderSettingsAction extends Action {
    private preferencesService;
    private workspaceContextService;
    private quickOpenService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, preferencesService: IPreferencesService, workspaceContextService: IWorkspaceContextService, quickOpenService: IQuickOpenService);
    run(): TPromise<any>;
}
export declare class ConfigureLanguageBasedSettingsAction extends Action {
    private modeService;
    private quickOpenService;
    private preferencesService;
    static ID: string;
    static LABEL: string;
    constructor(id: string, label: string, modeService: IModeService, quickOpenService: IQuickOpenService, preferencesService: IPreferencesService);
    run(): TPromise<any>;
}
