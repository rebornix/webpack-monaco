var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "vs/base/common/async", "vs/base/common/event", "vs/base/common/lifecycle", "vs/base/browser/dom"], function (require, exports, async_1, event_1, lifecycle_1, dom) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var UserStatus;
    (function (UserStatus) {
        UserStatus[UserStatus["Idle"] = 0] = "Idle";
        UserStatus[UserStatus["Active"] = 1] = "Active";
    })(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
    var IdleMonitor = (function (_super) {
        __extends(IdleMonitor, _super);
        function IdleMonitor(idleTime) {
            var _this = _super.call(this) || this;
            _this._status = null;
            _this._idleCheckTimeout = _this._register(new async_1.TimeoutTimer());
            _this._lastActiveTime = -1;
            _this._idleTime = idleTime;
            _this._onStatusChange = new event_1.Emitter();
            _this._register(dom.addDisposableListener(document, 'mousemove', function () { return _this._onUserActive(); }));
            _this._register(dom.addDisposableListener(document, 'keydown', function () { return _this._onUserActive(); }));
            _this._onUserActive();
            return _this;
        }
        Object.defineProperty(IdleMonitor.prototype, "onStatusChange", {
            get: function () { return this._onStatusChange.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(IdleMonitor.prototype, "status", {
            get: function () {
                return this._status;
            },
            enumerable: true,
            configurable: true
        });
        IdleMonitor.prototype._onUserActive = function () {
            this._lastActiveTime = (new Date()).getTime();
            if (this._status !== UserStatus.Active) {
                this._status = UserStatus.Active;
                this._scheduleIdleCheck();
                this._onStatusChange.fire(this._status);
            }
        };
        IdleMonitor.prototype._onUserIdle = function () {
            if (this._status !== UserStatus.Idle) {
                this._status = UserStatus.Idle;
                this._onStatusChange.fire(this._status);
            }
        };
        IdleMonitor.prototype._scheduleIdleCheck = function () {
            var _this = this;
            var minimumTimeWhenUserCanBecomeIdle = this._lastActiveTime + this._idleTime;
            var timeout = minimumTimeWhenUserCanBecomeIdle - (new Date()).getTime();
            this._idleCheckTimeout.setIfNotSet(function () { return _this._checkIfUserIsIdle(); }, timeout);
        };
        IdleMonitor.prototype._checkIfUserIsIdle = function () {
            var actualIdleTime = (new Date()).getTime() - this._lastActiveTime;
            if (actualIdleTime >= this._idleTime) {
                this._onUserIdle();
            }
            else {
                this._scheduleIdleCheck();
            }
        };
        return IdleMonitor;
    }(lifecycle_1.Disposable));
    exports.IdleMonitor = IdleMonitor;
});
//# sourceMappingURL=idleMonitor.js.map