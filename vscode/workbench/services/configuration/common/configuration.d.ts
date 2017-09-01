import { IConfigurationService } from 'vs/platform/configuration/common/configuration';
export declare const CONFIG_DEFAULT_NAME = "settings";
export declare const WORKSPACE_CONFIG_FOLDER_DEFAULT_NAME = ".vscode";
export declare const WORKSPACE_CONFIG_DEFAULT_PATH: string;
export declare const IWorkspaceConfigurationService: {
    (...args: any[]): void;
    type: IWorkspaceConfigurationService;
};
export interface IWorkspaceConfigurationService extends IConfigurationService {
    /**
     * Returns untrusted configuration keys for the current workspace.
     */
    getUnsupportedWorkspaceKeys(): string[];
}
export declare const WORKSPACE_STANDALONE_CONFIGURATIONS: {
    'tasks': string;
    'launch': string;
};
