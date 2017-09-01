import { TPromise } from 'vs/base/common/winjs.base';
import Event from 'vs/base/common/event';
import { IPager } from 'vs/base/common/paging';
export declare const EXTENSION_IDENTIFIER_PATTERN = "^([a-z0-9A-Z][a-z0-9-A-Z]*)\\.([a-z0-9A-Z][a-z0-9-A-Z]*)$";
export declare const EXTENSION_IDENTIFIER_REGEX: RegExp;
export interface ICommand {
    command: string;
    title: string;
    category?: string;
}
export interface IConfigurationProperty {
    description: string;
    type: string | string[];
    default?: any;
}
export interface IConfiguration {
    properties: {
        [key: string]: IConfigurationProperty;
    };
}
export interface IDebugger {
    label?: string;
    type: string;
    runtime: string;
}
export interface IGrammar {
    language: string;
}
export interface IJSONValidation {
    fileMatch: string;
}
export interface IKeyBinding {
    command: string;
    key: string;
    when?: string;
    mac?: string;
    linux?: string;
    win?: string;
}
export interface ILanguage {
    id: string;
    extensions: string[];
    aliases: string[];
}
export interface IMenu {
    command: string;
    alt?: string;
    when?: string;
    group?: string;
}
export interface ISnippet {
    language: string;
}
export interface ITheme {
    label: string;
}
export interface IView {
    id: string;
    name: string;
}
export interface IExtensionContributions {
    commands?: ICommand[];
    configuration?: IConfiguration;
    debuggers?: IDebugger[];
    grammars?: IGrammar[];
    jsonValidation?: IJSONValidation[];
    keybindings?: IKeyBinding[];
    languages?: ILanguage[];
    menus?: {
        [context: string]: IMenu[];
    };
    snippets?: ISnippet[];
    themes?: ITheme[];
    views?: {
        [location: string]: IView[];
    };
}
export interface IExtensionManifest {
    name: string;
    publisher: string;
    version: string;
    engines: {
        vscode: string;
    };
    displayName?: string;
    description?: string;
    main?: string;
    icon?: string;
    categories?: string[];
    activationEvents?: string[];
    extensionDependencies?: string[];
    contributes?: IExtensionContributions;
}
export interface IGalleryExtensionProperties {
    dependencies?: string[];
    engine?: string;
}
export interface IGalleryExtensionAsset {
    uri: string;
    fallbackUri: string;
}
export interface IGalleryExtensionAssets {
    manifest: IGalleryExtensionAsset;
    readme: IGalleryExtensionAsset;
    changelog: IGalleryExtensionAsset;
    download: IGalleryExtensionAsset;
    icon: IGalleryExtensionAsset;
    license: IGalleryExtensionAsset;
}
export interface IGalleryExtension {
    uuid: string;
    id: string;
    name: string;
    version: string;
    date: string;
    displayName: string;
    publisherId: string;
    publisher: string;
    publisherDisplayName: string;
    description: string;
    installCount: number;
    rating: number;
    ratingCount: number;
    assets: IGalleryExtensionAssets;
    properties: IGalleryExtensionProperties;
    telemetryData: any;
}
export interface IGalleryMetadata {
    id: string;
    publisherId: string;
    publisherDisplayName: string;
}
export declare enum LocalExtensionType {
    System = 0,
    User = 1,
}
export interface ILocalExtension {
    type: LocalExtensionType;
    id: string;
    manifest: IExtensionManifest;
    metadata: IGalleryMetadata;
    path: string;
    readmeUrl: string;
    changelogUrl: string;
}
export declare const IExtensionManagementService: {
    (...args: any[]): void;
    type: IExtensionManagementService;
};
export declare const IExtensionGalleryService: {
    (...args: any[]): void;
    type: IExtensionGalleryService;
};
export declare enum SortBy {
    NoneOrRelevance = 0,
    LastUpdatedDate = 1,
    Title = 2,
    PublisherName = 3,
    InstallCount = 4,
    PublishedDate = 5,
    AverageRating = 6,
    WeightedRating = 12,
}
export declare enum SortOrder {
    Default = 0,
    Ascending = 1,
    Descending = 2,
}
export interface IQueryOptions {
    text?: string;
    ids?: string[];
    names?: string[];
    pageSize?: number;
    sortBy?: SortBy;
    sortOrder?: SortOrder;
    source?: string;
}
export declare enum StatisticType {
    Uninstall = "uninstall",
}
export interface IExtensionGalleryService {
    _serviceBrand: any;
    isEnabled(): boolean;
    query(options?: IQueryOptions): TPromise<IPager<IGalleryExtension>>;
    download(extension: IGalleryExtension): TPromise<string>;
    reportStatistic(publisher: string, name: string, version: string, type: StatisticType): TPromise<void>;
    getReadme(extension: IGalleryExtension): TPromise<string>;
    getManifest(extension: IGalleryExtension): TPromise<IExtensionManifest>;
    getChangelog(extension: IGalleryMetadata): TPromise<string>;
    loadCompatibleVersion(extension: IGalleryExtension): TPromise<IGalleryExtension>;
    getAllDependencies(extension: IGalleryExtension): TPromise<IGalleryExtension[]>;
}
export interface InstallExtensionEvent {
    id: string;
    zipPath?: string;
    gallery?: IGalleryExtension;
}
export interface DidInstallExtensionEvent {
    id: string;
    zipPath?: string;
    gallery?: IGalleryExtension;
    local?: ILocalExtension;
    error?: Error;
}
export interface DidUninstallExtensionEvent {
    id: string;
    error?: Error;
}
export interface IExtensionManagementService {
    _serviceBrand: any;
    onInstallExtension: Event<InstallExtensionEvent>;
    onDidInstallExtension: Event<DidInstallExtensionEvent>;
    onUninstallExtension: Event<string>;
    onDidUninstallExtension: Event<DidUninstallExtensionEvent>;
    install(zipPath: string): TPromise<void>;
    installFromGallery(extension: IGalleryExtension, promptToInstallDependencies?: boolean): TPromise<void>;
    uninstall(extension: ILocalExtension, force?: boolean): TPromise<void>;
    getInstalled(type?: LocalExtensionType): TPromise<ILocalExtension[]>;
}
export declare const IExtensionEnablementService: {
    (...args: any[]): void;
    type: IExtensionEnablementService;
};
export interface IExtensionEnablementService {
    _serviceBrand: any;
    /**
     * Event to listen on for extension enablement changes
     */
    onEnablementChanged: Event<string>;
    /**
     * Returns all globally disabled extension identifiers.
     * Returns an empty array if none exist.
     */
    getGloballyDisabledExtensions(): string[];
    /**
     * Returns all workspace disabled extension identifiers.
     * Returns an empty array if none exist or workspace does not exist.
     */
    getWorkspaceDisabledExtensions(): string[];
    /**
     * Returns `true` if given extension can be enabled by calling `setEnablement`, otherwise false`.
     */
    canEnable(identifier: string): boolean;
    /**
     * Enable or disable the given extension.
     * if `workspace` is `true` then enablement is done for workspace, otherwise globally.
     *
     * Returns a promise that resolves to boolean value.
     * if resolves to `true` then requires restart for the change to take effect.
     *
     * Throws error if enablement is requested for workspace and there is no workspace
     */
    setEnablement(identifier: string, enable: boolean, workspace?: boolean): TPromise<boolean>;
}
export declare const IExtensionTipsService: {
    (...args: any[]): void;
    type: IExtensionTipsService;
};
export interface IExtensionTipsService {
    _serviceBrand: any;
    getRecommendations(): string[];
    getWorkspaceRecommendations(): TPromise<string[]>;
    getKeymapRecommendations(): string[];
    getKeywordsForExtension(extension: string): string[];
    getRecommendationsForExtension(extension: string): string[];
}
export declare const ExtensionsLabel: string;
export declare const ExtensionsChannelId = "extensions";
export declare const PreferencesLabel: string;
