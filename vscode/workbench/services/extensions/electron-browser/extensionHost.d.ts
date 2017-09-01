import { TPromise } from 'vs/base/common/winjs.base';
import { IMessageService } from 'vs/platform/message/common/message';
import { ILifecycleService } from 'vs/platform/lifecycle/common/lifecycle';
import { IWindowsService, IWindowService } from 'vs/platform/windows/common/windows';
import { IWorkspaceContextService } from 'vs/platform/workspace/common/workspace';
import { ITelemetryService } from 'vs/platform/telemetry/common/telemetry';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { IMessagePassingProtocol } from 'vs/base/parts/ipc/common/ipc';
import Event from 'vs/base/common/event';
import { IExtensionService } from 'vs/platform/extensions/common/extensions';
import { IWorkspaceConfigurationService } from 'vs/workbench/services/configuration/common/configuration';
import { ICrashReporterService } from 'vs/workbench/services/crashReporter/common/crashReporterService';
import { IBroadcastService } from 'vs/platform/broadcast/electron-browser/broadcastService';
export declare class ExtensionHostProcessWorker {
    private readonly _extensionService;
    private readonly _contextService;
    private readonly _messageService;
    private readonly _windowsService;
    private readonly _windowService;
    private readonly _broadcastService;
    private readonly _lifecycleService;
    private readonly _environmentService;
    private readonly _configurationService;
    private readonly _telemetryService;
    private readonly _crashReporterService;
    private _onCrashed;
    readonly onCrashed: Event<[number, string]>;
    private readonly _toDispose;
    private readonly _isExtensionDevHost;
    private readonly _isExtensionDevDebug;
    private readonly _isExtensionDevDebugBrk;
    private readonly _isExtensionDevTestFromCli;
    private _lastExtensionHostError;
    private _terminating;
    private _namedPipeServer;
    private _extensionHostProcess;
    private _extensionHostConnection;
    private _messageProtocol;
    constructor(_extensionService: IExtensionService, _contextService: IWorkspaceContextService, _messageService: IMessageService, _windowsService: IWindowsService, _windowService: IWindowService, _broadcastService: IBroadcastService, _lifecycleService: ILifecycleService, _environmentService: IEnvironmentService, _configurationService: IWorkspaceConfigurationService, _telemetryService: ITelemetryService, _crashReporterService: ICrashReporterService);
    dispose(): void;
    private _onBroadcast(broadcast);
    start(): TPromise<IMessagePassingProtocol>;
    /**
     * Start a server (`this._namedPipeServer`) that listens on a named pipe and return the named pipe name.
     */
    private _tryListenOnPipe();
    /**
     * Find a free port if extension host debugging is enabled.
     */
    private _tryFindDebugPort();
    private _tryExtHostHandshake();
    private _createExtHostInitData();
    private _logExtensionHostMessage(logEntry);
    private _onExtHostProcessError(err);
    private _onExtHostProcessExit(code, signal);
    terminate(): void;
    private _cleanResources();
    private _onWillShutdown(event);
}
