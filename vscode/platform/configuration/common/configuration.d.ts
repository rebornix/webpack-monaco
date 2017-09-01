import { TPromise } from 'vs/base/common/winjs.base';
import URI from 'vs/base/common/uri';
import { StrictResourceMap } from 'vs/base/common/map';
import { Workspace } from 'vs/platform/workspace/common/workspace';
import Event from 'vs/base/common/event';
export declare const IConfigurationService: {
    (...args: any[]): void;
    type: IConfigurationService;
};
export interface IConfigurationOverrides {
    overrideIdentifier?: string;
    resource?: URI;
}
export declare type IConfigurationValues = {
    [key: string]: IConfigurationValue<any>;
};
export interface IConfigurationService {
    _serviceBrand: any;
    getConfigurationData<T>(): IConfigurationData<T>;
    /**
     * Fetches the appropriate section of the configuration JSON file.
     * This will be an object keyed off the section name.
     */
    getConfiguration<T>(section?: string, overrides?: IConfigurationOverrides): T;
    /**
     * Resolves a configuration key to its values in the different scopes
     * the setting is defined.
     */
    lookup<T>(key: string, overrides?: IConfigurationOverrides): IConfigurationValue<T>;
    /**
     * Returns the defined keys of configurations in the different scopes
     * the key is defined.
     */
    keys(overrides?: IConfigurationOverrides): IConfigurationKeys;
    /**
     * Similar to #getConfiguration() but ensures that the latest configuration
     * from disk is fetched.
     */
    reloadConfiguration<T>(section?: string): TPromise<T>;
    /**
     * Event that fires when the configuration changes.
     */
    onDidUpdateConfiguration: Event<IConfigurationServiceEvent>;
    /**
     * Returns the defined values of configurations in the different scopes.
     */
    values(): IConfigurationValues;
}
export declare enum ConfigurationSource {
    Default = 1,
    User = 2,
    Workspace = 3,
}
export interface IConfigurationServiceEvent {
    /**
     * The type of source that triggered this event.
     */
    source: ConfigurationSource;
    /**
     * The part of the configuration contributed by the source of this event.
     */
    sourceConfig: any;
}
export interface IConfigurationValue<T> {
    value: T;
    default: T;
    user: T;
    workspace: T;
    folder: T;
}
export interface IConfigurationKeys {
    default: string[];
    user: string[];
    workspace: string[];
    folder: string[];
}
/**
 * A helper function to get the configuration value with a specific settings path (e.g. config.some.setting)
 */
export declare function getConfigurationValue<T>(config: any, settingPath: string, defaultValue?: T): T;
export declare function merge(base: any, add: any, overwrite: boolean): void;
export interface IConfiguraionModel<T> {
    contents: T;
    keys: string[];
    overrides: IOverrides<T>[];
}
export interface IOverrides<T> {
    contents: T;
    identifiers: string[];
}
export declare class ConfigurationModel<T> implements IConfiguraionModel<T> {
    protected _contents: T;
    protected _keys: string[];
    protected _overrides: IOverrides<T>[];
    constructor(_contents?: T, _keys?: string[], _overrides?: IOverrides<T>[]);
    readonly contents: T;
    readonly overrides: IOverrides<T>[];
    readonly keys: string[];
    getContentsFor<V>(section: string): V;
    override<V>(identifier: string): ConfigurationModel<V>;
    merge(other: ConfigurationModel<T>, overwrite?: boolean): ConfigurationModel<T>;
    protected doMerge(source: ConfigurationModel<T>, target: ConfigurationModel<T>, overwrite?: boolean): void;
}
export interface IConfigurationData<T> {
    defaults: IConfiguraionModel<T>;
    user: IConfiguraionModel<T>;
    workspace: IConfiguraionModel<T>;
    folders: {
        [folder: string]: IConfiguraionModel<T>;
    };
}
export declare class Configuration<T> {
    protected _defaults: ConfigurationModel<T>;
    protected _user: ConfigurationModel<T>;
    protected _workspaceConfiguration: ConfigurationModel<T>;
    protected folders: StrictResourceMap<ConfigurationModel<T>>;
    protected _workspace: Workspace;
    private _globalConfiguration;
    private _workspaceConsolidatedConfiguration;
    private _legacyWorkspaceConsolidatedConfiguration;
    protected _foldersConsolidatedConfigurations: StrictResourceMap<ConfigurationModel<T>>;
    constructor(_defaults: ConfigurationModel<T>, _user: ConfigurationModel<T>, _workspaceConfiguration?: ConfigurationModel<T>, folders?: StrictResourceMap<ConfigurationModel<T>>, _workspace?: Workspace);
    readonly defaults: ConfigurationModel<T>;
    readonly user: ConfigurationModel<T>;
    protected merge(): void;
    protected mergeFolder(folder: URI): void;
    getValue<C>(section?: string, overrides?: IConfigurationOverrides): C;
    lookup<C>(key: string, overrides?: IConfigurationOverrides): IConfigurationValue<C>;
    lookupLegacy<C>(key: string): IConfigurationValue<C>;
    keys(overrides?: IConfigurationOverrides): IConfigurationKeys;
    values(): IConfigurationValues;
    values2(): Map<string, IConfigurationValue<T>>;
    private getConsolidateConfigurationModel<C>(overrides);
    private getConsolidatedConfigurationModelForResource({resource});
    private getFolderConfigurationModelForResource(resource);
    toData(): IConfigurationData<any>;
    static parse(data: IConfigurationData<any>, workspace: Workspace): Configuration<any>;
    private static parseConfigurationModel(model);
}
