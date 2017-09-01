import { TPromise } from 'vs/base/common/winjs.base';
import { IChannel } from 'vs/base/parts/ipc/common/ipc';
import { IExtensionManagementService, ILocalExtension, InstallExtensionEvent, DidInstallExtensionEvent, IGalleryExtension, LocalExtensionType, DidUninstallExtensionEvent } from './extensionManagement';
import Event from 'vs/base/common/event';
export interface IExtensionManagementChannel extends IChannel {
    call(command: 'event:onInstallExtension'): TPromise<void>;
    call(command: 'event:onDidInstallExtension'): TPromise<void>;
    call(command: 'event:onUninstallExtension'): TPromise<void>;
    call(command: 'event:onDidUninstallExtension'): TPromise<void>;
    call(command: 'install', path: string): TPromise<void>;
    call(command: 'installFromGallery', extension: IGalleryExtension): TPromise<void>;
    call(command: 'uninstall', args: [ILocalExtension, boolean]): TPromise<void>;
    call(command: 'getInstalled'): TPromise<ILocalExtension[]>;
    call(command: string, arg?: any): TPromise<any>;
}
export declare class ExtensionManagementChannel implements IExtensionManagementChannel {
    private service;
    onInstallExtension: Event<InstallExtensionEvent>;
    onDidInstallExtension: Event<DidInstallExtensionEvent>;
    onUninstallExtension: Event<string>;
    onDidUninstallExtension: Event<DidUninstallExtensionEvent>;
    constructor(service: IExtensionManagementService);
    call(command: string, arg?: any): TPromise<any>;
}
export declare class ExtensionManagementChannelClient implements IExtensionManagementService {
    private channel;
    _serviceBrand: any;
    constructor(channel: IExtensionManagementChannel);
    private _onInstallExtension;
    readonly onInstallExtension: Event<InstallExtensionEvent>;
    private _onDidInstallExtension;
    readonly onDidInstallExtension: Event<DidInstallExtensionEvent>;
    private _onUninstallExtension;
    readonly onUninstallExtension: Event<string>;
    private _onDidUninstallExtension;
    readonly onDidUninstallExtension: Event<DidUninstallExtensionEvent>;
    install(zipPath: string): TPromise<void>;
    installFromGallery(extension: IGalleryExtension, promptToInstallDependencies?: boolean): TPromise<void>;
    uninstall(extension: ILocalExtension, force?: boolean): TPromise<void>;
    getInstalled(type?: LocalExtensionType): TPromise<ILocalExtension[]>;
}
