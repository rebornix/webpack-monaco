import { TPromise } from 'vs/base/common/winjs.base';
import { IEnvironmentService } from 'vs/platform/environment/common/environment';
import { ILogService } from 'vs/platform/log/common/log';
import { IStorageService } from 'vs/platform/storage/node/storage';
import Event from 'vs/base/common/event';
import { ICodeWindow } from 'vs/platform/windows/electron-main/windows';
export declare const ILifecycleService: {
    (...args: any[]): void;
    type: ILifecycleService;
};
export declare enum UnloadReason {
    CLOSE = 1,
    QUIT = 2,
    RELOAD = 3,
    LOAD = 4,
}
export interface IWindowUnloadEvent {
    window: ICodeWindow;
    reason: UnloadReason;
    veto(value: boolean | TPromise<boolean>): void;
}
export interface ILifecycleService {
    _serviceBrand: any;
    /**
     * Will be true if the program was restarted (e.g. due to explicit request or update).
     */
    wasRestarted: boolean;
    /**
     * Due to the way we handle lifecycle with eventing, the general app.on('before-quit')
     * event cannot be used because it can be called twice on shutdown. Instead the onBeforeQuit
     * handler in this module can be used and it is only called once on a shutdown sequence.
     */
    onBeforeQuit: Event<void>;
    /**
     * We provide our own event when we close a window because the general window.on('close')
     * is called even when the window prevents the closing. We want an event that truly fires
     * before the window gets closed for real.
     */
    onBeforeWindowClose: Event<ICodeWindow>;
    /**
     * An even that can be vetoed to prevent a window from being unloaded.
     */
    onBeforeWindowUnload: Event<IWindowUnloadEvent>;
    ready(): void;
    registerWindow(window: ICodeWindow): void;
    unload(window: ICodeWindow, reason: UnloadReason, payload?: object): TPromise<boolean>;
    relaunch(options?: {
        addArgs?: string[];
        removeArgs?: string[];
    }): any;
    quit(fromUpdate?: boolean): TPromise<boolean>;
    isQuitRequested(): boolean;
    kill(code?: number): any;
}
export declare class LifecycleService implements ILifecycleService {
    private environmentService;
    private logService;
    private storageService;
    _serviceBrand: any;
    private static QUIT_FROM_RESTART_MARKER;
    private windowToCloseRequest;
    private quitRequested;
    private pendingQuitPromise;
    private pendingQuitPromiseComplete;
    private oneTimeListenerTokenGenerator;
    private _wasRestarted;
    private _onBeforeQuit;
    onBeforeQuit: Event<void>;
    private _onBeforeWindowClose;
    onBeforeWindowClose: Event<ICodeWindow>;
    private _onBeforeWindowUnload;
    onBeforeWindowUnload: Event<IWindowUnloadEvent>;
    constructor(environmentService: IEnvironmentService, logService: ILogService, storageService: IStorageService);
    private handleRestarted();
    readonly wasRestarted: boolean;
    ready(): void;
    private registerListeners();
    registerWindow(window: ICodeWindow): void;
    unload(window: ICodeWindow, reason: UnloadReason, payload?: object): TPromise<boolean>;
    private handleVeto(veto);
    private doUnloadWindowInRenderer(window, reason, payload?);
    private doUnloadWindowInMain(window, reason);
    /**
     * A promise that completes to indicate if the quit request has been veto'd
     * by the user or not.
     */
    quit(fromUpdate?: boolean): TPromise<boolean>;
    kill(code?: number): void;
    relaunch(options?: {
        addArgs?: string[];
        removeArgs?: string[];
    }): void;
    isQuitRequested(): boolean;
}
