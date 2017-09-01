import { ILifecycleService, ShutdownEvent, ShutdownReason, StartupKind, LifecyclePhase } from 'vs/platform/lifecycle/common/lifecycle';
import { IMessageService } from 'vs/platform/message/common/message';
import { IStorageService } from 'vs/platform/storage/common/storage';
import Event from 'vs/base/common/event';
import { IWindowService } from 'vs/platform/windows/common/windows';
export declare class LifecycleService implements ILifecycleService {
    private _messageService;
    private _windowService;
    private _storageService;
    private static readonly _lastShutdownReasonKey;
    _serviceBrand: any;
    private readonly _onDidChangePhase;
    private readonly _onWillShutdown;
    private readonly _onShutdown;
    private readonly _startupKind;
    private _phase;
    constructor(_messageService: IMessageService, _windowService: IWindowService, _storageService: IStorageService);
    phase: LifecyclePhase;
    readonly startupKind: StartupKind;
    readonly onDidChangePhase: Event<LifecyclePhase>;
    readonly onWillShutdown: Event<ShutdownEvent>;
    readonly onShutdown: Event<ShutdownReason>;
    private _registerListeners();
    private onBeforeUnload(reason, payload?);
}
