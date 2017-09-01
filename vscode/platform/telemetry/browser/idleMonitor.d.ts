import Event from 'vs/base/common/event';
import { Disposable } from 'vs/base/common/lifecycle';
export declare enum UserStatus {
    Idle = 0,
    Active = 1,
}
export declare class IdleMonitor extends Disposable {
    private _lastActiveTime;
    private _idleCheckTimeout;
    private _status;
    private _idleTime;
    private _onStatusChange;
    readonly onStatusChange: Event<UserStatus>;
    constructor(idleTime: any);
    readonly status: UserStatus;
    private _onUserActive();
    private _onUserIdle();
    private _scheduleIdleCheck();
    private _checkIfUserIsIdle();
}
