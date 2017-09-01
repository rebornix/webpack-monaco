var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/common/severity", "vs/base/common/errorMessage", "vs/platform/lifecycle/common/lifecycle", "vs/platform/message/common/message", "vs/platform/storage/common/storage", "electron", "vs/base/common/event", "vs/platform/windows/common/windows"], function (require, exports, severity_1, errorMessage_1, lifecycle_1, message_1, storage_1, electron_1, event_1, windows_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var LifecycleService = (function () {
        function LifecycleService(_messageService, _windowService, _storageService) {
            this._messageService = _messageService;
            this._windowService = _windowService;
            this._storageService = _storageService;
            this._onDidChangePhase = new event_1.Emitter();
            this._onWillShutdown = new event_1.Emitter();
            this._onShutdown = new event_1.Emitter();
            this._phase = lifecycle_1.LifecyclePhase.Starting;
            this._registerListeners();
            var lastShutdownReason = this._storageService.getInteger(LifecycleService._lastShutdownReasonKey, storage_1.StorageScope.WORKSPACE);
            this._storageService.remove(LifecycleService._lastShutdownReasonKey, storage_1.StorageScope.WORKSPACE);
            if (lastShutdownReason === lifecycle_1.ShutdownReason.RELOAD) {
                this._startupKind = lifecycle_1.StartupKind.ReloadedWindow;
            }
            else if (lastShutdownReason === lifecycle_1.ShutdownReason.LOAD) {
                this._startupKind = lifecycle_1.StartupKind.ReopenedWindow;
            }
            else {
                this._startupKind = lifecycle_1.StartupKind.NewWindow;
            }
        }
        Object.defineProperty(LifecycleService.prototype, "phase", {
            get: function () {
                return this._phase;
            },
            set: function (value) {
                if (this._phase !== value) {
                    this._phase = value;
                    this._onDidChangePhase.fire(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LifecycleService.prototype, "startupKind", {
            get: function () {
                return this._startupKind;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LifecycleService.prototype, "onDidChangePhase", {
            get: function () {
                return this._onDidChangePhase.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LifecycleService.prototype, "onWillShutdown", {
            get: function () {
                return this._onWillShutdown.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LifecycleService.prototype, "onShutdown", {
            get: function () {
                return this._onShutdown.event;
            },
            enumerable: true,
            configurable: true
        });
        LifecycleService.prototype._registerListeners = function () {
            var _this = this;
            var windowId = this._windowService.getCurrentWindowId();
            // Main side indicates that window is about to unload, check for vetos
            electron_1.ipcRenderer.on('vscode:beforeUnload', function (event, reply) {
                _this.phase = lifecycle_1.LifecyclePhase.ShuttingDown;
                _this._storageService.store(LifecycleService._lastShutdownReasonKey, JSON.stringify(reply.reason), storage_1.StorageScope.WORKSPACE);
                // trigger onWillShutdown events and veto collecting
                _this.onBeforeUnload(reply.reason, reply.payload).done(function (veto) {
                    if (veto) {
                        _this._storageService.remove(LifecycleService._lastShutdownReasonKey, storage_1.StorageScope.WORKSPACE);
                        _this.phase = lifecycle_1.LifecyclePhase.Running; // reset this flag since the shutdown has been vetoed!
                        electron_1.ipcRenderer.send(reply.cancelChannel, windowId);
                    }
                    else {
                        _this._onShutdown.fire(reply.reason);
                        electron_1.ipcRenderer.send(reply.okChannel, windowId);
                    }
                });
            });
        };
        LifecycleService.prototype.onBeforeUnload = function (reason, payload) {
            var _this = this;
            var vetos = [];
            this._onWillShutdown.fire({
                veto: function (value) {
                    vetos.push(value);
                },
                reason: reason,
                payload: payload
            });
            return lifecycle_1.handleVetos(vetos, function (err) { return _this._messageService.show(severity_1.default.Error, errorMessage_1.toErrorMessage(err)); });
        };
        LifecycleService._lastShutdownReasonKey = 'lifecyle.lastShutdownReason';
        LifecycleService = __decorate([
            __param(0, message_1.IMessageService),
            __param(1, windows_1.IWindowService),
            __param(2, storage_1.IStorageService)
        ], LifecycleService);
        return LifecycleService;
    }());
    exports.LifecycleService = LifecycleService;
});
//# sourceMappingURL=lifecycleService.js.map