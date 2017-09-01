import Severity from 'vs/base/common/severity';
import { TPromise } from 'vs/base/common/winjs.base';
import { IExtensionDescription, IExtensionsStatus, IExtensionService, ExtensionPointContribution, ActivationTimes } from 'vs/platform/extensions/common/extensions';
import { IExtensionEnablementService } from 'vs/platform/extensionManagement/common/extensionManagement';
import { IExtensionPoint } from 'vs/platform/extensions/common/extensionsRegistry';
import { ILog } from 'vs/workbench/services/extensions/electron-browser/extensionPoints';
import { IMessageService } from 'vs/platform/message/common/message';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { IStorageService } from 'vs/platform/storage/common/storage';
import { IInstantiationService } from 'vs/platform/instantiation/common/instantiation';
import { IWindowService } from 'vs/platform/windows/common/windows';
export declare class ExtensionService implements IExtensionService {
    private readonly _instantiationService;
    private readonly _messageService;
    private readonly _environmentService;
    private readonly _telemetryService;
    private readonly _extensionEnablementService;
    private readonly _storageService;
    private readonly _windowService;
    _serviceBrand: any;
    private _registry;
    private readonly _barrier;
    private readonly _isDev;
    private readonly _extensionsStatus;
    private _allRequestedActivateEvents;
    /**
     * A map of already activated events to speed things up if the same activation event is triggered multiple times.
     */
    private _extensionHostProcessFinishedActivateEvents;
    private _extensionHostProcessActivationTimes;
    private _extensionHostProcessWorker;
    private _extensionHostProcessThreadService;
    private _extensionHostProcessCustomers;
    /**
     * winjs believes a proxy is a promise because it has a `then` method, so wrap the result in an object.
     */
    private _extensionHostProcessProxy;
    constructor(_instantiationService: IInstantiationService, _messageService: IMessageService, _environmentService: IEnvironmentService, _telemetryService: ITelemetryService, _extensionEnablementService: IExtensionEnablementService, _storageService: IStorageService, _windowService: IWindowService);
    restartExtensionHost(): void;
    private _stopExtensionHostProcess();
    private _startExtensionHostProcess(initialActivationEvents);
    private _onExtensionHostCrashed(code, signal);
    private _createExtensionHostCustomers(protocol);
    activateByEvent(activationEvent: string): TPromise<void>;
    protected _activateByEvent(activationEvent: string): TPromise<void>;
    onReady(): TPromise<boolean>;
    getExtensions(): TPromise<IExtensionDescription[]>;
    readExtensionPointContributions<T>(extPoint: IExtensionPoint<T>): TPromise<ExtensionPointContribution<T>[]>;
    getExtensionsStatus(): {
        [id: string]: IExtensionsStatus;
    };
    getExtensionsActivationTimes(): {
        [id: string]: ActivationTimes;
    };
    private _scanAndHandleExtensions();
    private _handleExtensionPointMessage(msg);
    private static _scanInstalledExtensions(environmentService, log);
    private static _handleExtensionPoint<T>(extensionPoint, availableExtensions, messageHandler);
    private _showMessageToUser(severity, msg);
    private _logMessageInConsole(severity, msg);
    _logOrShowMessage(severity: Severity, msg: string): void;
    _onExtensionActivated(extensionId: string, startup: boolean, codeLoadingTime: number, activateCallTime: number, activateResolvedTime: number): void;
}
export declare class Logger implements ILog {
    private readonly _messageHandler;
    constructor(messageHandler: (severity: Severity, source: string, message: string) => void);
    error(source: string, message: string): void;
    warn(source: string, message: string): void;
    info(source: string, message: string): void;
}
