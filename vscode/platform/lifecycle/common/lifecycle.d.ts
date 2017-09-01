import { TPromise } from 'vs/base/common/winjs.base';
import Event from 'vs/base/common/event';
export declare const ILifecycleService: {
    (...args: any[]): void;
    type: ILifecycleService;
};
/**
 * An event that is send out when the window is about to close. Clients have a chance to veto the closing by either calling veto
 * with a boolean "true" directly or with a promise that resolves to a boolean. Returning a promise is useful
 * in cases of long running operations on shutdown.
 *
 * Note: It is absolutely important to avoid long running promises on this call. Please try hard to return
 * a boolean directly. Returning a promise has quite an impact on the shutdown sequence!
 */
export interface ShutdownEvent {
    veto(value: boolean | TPromise<boolean>): void;
    reason: ShutdownReason;
    payload?: object;
}
export declare enum ShutdownReason {
    /** Window is closed */
    CLOSE = 1,
    /** Application is quit */
    QUIT = 2,
    /** Window is reloaded */
    RELOAD = 3,
    /** Other configuration loaded into window */
    LOAD = 4,
}
export declare enum StartupKind {
    NewWindow = 1,
    ReloadedWindow = 3,
    ReopenedWindow = 4,
}
export declare enum LifecyclePhase {
    Starting = 1,
    Running = 2,
    ShuttingDown = 3,
}
/**
 * A lifecycle service informs about lifecycle events of the
 * application, such as shutdown.
 */
export interface ILifecycleService {
    _serviceBrand: any;
    /**
     * Value indicates how this window got loaded.
     */
    readonly startupKind: StartupKind;
    /**
     * A flag indicating in what phase of the lifecycle we currently are.
     */
    readonly phase: LifecyclePhase;
    /**
     * An event that fire when the lifecycle phase has changed
     */
    readonly onDidChangePhase: Event<LifecyclePhase>;
    /**
     * Fired before shutdown happens. Allows listeners to veto against the
     * shutdown.
     */
    readonly onWillShutdown: Event<ShutdownEvent>;
    /**
     * Fired when no client is preventing the shutdown from happening. Can be used to dispose heavy resources
     * like running processes. Can also be used to save UI state to storage.
     *
     * The event carries a shutdown reason that indicates how the shutdown was triggered.
     */
    readonly onShutdown: Event<ShutdownReason>;
}
export declare const NullLifecycleService: ILifecycleService;
export declare function handleVetos(vetos: (boolean | TPromise<boolean>)[], onError: (error: Error) => void): TPromise<boolean>;
