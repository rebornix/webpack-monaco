import { IViewlet } from 'vs/workbench/common/viewlet';
import Event from 'vs/base/common/event';
import { TPromise } from 'vs/base/common/winjs.base';
import { IPager } from 'vs/base/common/paging';
import { IQueryOptions, IExtensionManifest, LocalExtensionType } from 'vs/platform/extensionManagement/common/extensionManagement';
export declare const VIEWLET_ID = "workbench.view.extensions";
export interface IExtensionsViewlet extends IViewlet {
    search(text: string): void;
}
export declare enum ExtensionState {
    Installing = 0,
    Installed = 1,
    Uninstalling = 2,
    Uninstalled = 3,
}
export interface IExtension {
    type: LocalExtensionType;
    state: ExtensionState;
    name: string;
    displayName: string;
    id: string;
    publisher: string;
    publisherDisplayName: string;
    version: string;
    latestVersion: string;
    description: string;
    url: string;
    iconUrl: string;
    iconUrlFallback: string;
    licenseUrl: string;
    installCount: number;
    rating: number;
    ratingCount: number;
    outdated: boolean;
    disabledGlobally: boolean;
    disabledForWorkspace: boolean;
    dependencies: string[];
    telemetryData: any;
    getManifest(): TPromise<IExtensionManifest>;
    getReadme(): TPromise<string>;
    getChangelog(): TPromise<string>;
}
export interface IExtensionDependencies {
    dependencies: IExtensionDependencies[];
    hasDependencies: boolean;
    identifier: string;
    extension: IExtension;
    dependent: IExtensionDependencies;
}
export declare const SERVICE_ID = "extensionsWorkbenchService";
export declare const IExtensionsWorkbenchService: {
    (...args: any[]): void;
    type: IExtensionsWorkbenchService;
};
export interface IExtensionsWorkbenchService {
    _serviceBrand: any;
    onChange: Event<void>;
    local: IExtension[];
    isAutoUpdateEnabled: boolean;
    queryLocal(): TPromise<IExtension[]>;
    queryGallery(options?: IQueryOptions): TPromise<IPager<IExtension>>;
    canInstall(extension: IExtension): boolean;
    install(vsix: string): TPromise<void>;
    install(extension: IExtension, promptToInstallDependencies?: boolean): TPromise<void>;
    uninstall(extension: IExtension): TPromise<void>;
    setEnablement(extension: IExtension, enable: boolean, workspace?: boolean): TPromise<void>;
    loadDependencies(extension: IExtension): TPromise<IExtensionDependencies>;
    open(extension: IExtension, sideByside?: boolean): TPromise<any>;
    checkForUpdates(): TPromise<void>;
    setAutoUpdate(autoUpdate: boolean): TPromise<void>;
    allowedBadgeProviders: string[];
}
export declare const ConfigurationKey = "extensions";
export interface IExtensionsConfiguration {
    autoUpdate: boolean;
    ignoreRecommendations: boolean;
}
