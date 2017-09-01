import { CustomConfigurationModel } from 'vs/platform/configuration/common/model';
import { ConfigurationModel } from 'vs/platform/configuration/common/configuration';
import { ConfigurationScope } from 'vs/platform/configuration/common/configurationRegistry';
export declare class WorkspaceConfigurationModel<T> extends CustomConfigurationModel<T> {
    private _raw;
    private _folders;
    private _worksapaceSettings;
    private _tasksConfiguration;
    private _launchConfiguration;
    private _workspaceConfiguration;
    update(content: string): void;
    readonly folders: string[];
    readonly workspaceConfiguration: ConfigurationModel<T>;
    protected processRaw(raw: T): void;
    private parseConfigurationModel(section);
    private consolidate();
}
export declare class ScopedConfigurationModel<T> extends CustomConfigurationModel<T> {
    readonly scope: string;
    constructor(content: string, name: string, scope: string);
    update(content: string): void;
}
export declare class FolderSettingsModel<T> extends CustomConfigurationModel<T> {
    private _raw;
    private _unsupportedKeys;
    protected processRaw(raw: T): void;
    reprocess(): void;
    readonly unsupportedKeys: string[];
    private isNotExecutable(key, configurationProperties);
    createWorkspaceConfigurationModel(): ConfigurationModel<any>;
    createFolderScopedConfigurationModel(): ConfigurationModel<any>;
    private createScopedConfigurationModel(scope);
    private getScope(key, configurationProperties);
}
export declare class FolderConfigurationModel<T> extends CustomConfigurationModel<T> {
    readonly workspaceSettingsConfig: FolderSettingsModel<T>;
    private scopedConfigs;
    private scope;
    constructor(workspaceSettingsConfig: FolderSettingsModel<T>, scopedConfigs: ScopedConfigurationModel<T>[], scope: ConfigurationScope);
    private consolidate();
    readonly keys: string[];
    update(): void;
}
