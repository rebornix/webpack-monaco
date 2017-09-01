import { TPromise } from 'vs/base/common/winjs.base';
import { IExtensionDescription } from 'vs/platform/extensions/common/extensions';
import { IInitData, ExtHostExtensionServiceShape } from './extHost.protocol';
import { IExtensionAPI } from 'vs/workbench/api/node/extHostExtensionActivator';
import { ExtHostThreadService } from 'vs/workbench/services/thread/node/extHostThreadService';
import { TrieMap } from 'vs/base/common/map';
export declare class ExtHostExtensionService implements ExtHostExtensionServiceShape {
    private readonly _barrier;
    private readonly _registry;
    private readonly _threadService;
    private readonly _mainThreadTelemetry;
    private readonly _storage;
    private readonly _storagePath;
    private readonly _proxy;
    private _activator;
    private _extensionPathIndex;
    /**
     * This class is constructed manually because it is a service, so it doesn't use any ctor injection
     */
    constructor(initData: IInitData, threadService: ExtHostThreadService);
    onExtensionAPIReady(): TPromise<boolean>;
    isActivated(extensionId: string): boolean;
    activateByEvent(activationEvent: string, startup: boolean): TPromise<void>;
    activateById(extensionId: string, startup: boolean): TPromise<void>;
    getAllExtensionDescriptions(): IExtensionDescription[];
    getExtensionDescription(extensionId: string): IExtensionDescription;
    getExtensionExports(extensionId: string): IExtensionAPI;
    getExtensionPathIndex(): TPromise<TrieMap<IExtensionDescription>>;
    deactivate(extensionId: string): TPromise<void>;
    private _activateExtension(extensionDescription, startup);
    private _doActivateExtension(extensionDescription, startup);
    private _loadExtensionContext(extensionDescription);
    private static _callActivate(extensionModule, context, activationTimesBuilder);
    private static _callActivateOptional(extensionModule, context, activationTimesBuilder);
    $activateByEvent(activationEvent: string): TPromise<void>;
}
