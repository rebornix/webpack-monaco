var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/common/lifecycle", "vs/workbench/parts/debug/common/debug", "vs/base/common/winjs.base", "../node/extHost.protocol", "vs/workbench/api/electron-browser/extHostCustomers"], function (require, exports, lifecycle_1, debug_1, winjs_base_1, extHost_protocol_1, extHostCustomers_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var MainThreadDebugService = (function () {
        function MainThreadDebugService(extHostContext, debugService) {
            var _this = this;
            this.debugService = debugService;
            this._proxy = extHostContext.get(extHost_protocol_1.ExtHostContext.ExtHostDebugService);
            this._toDispose = [];
            this._toDispose.push(debugService.onDidNewProcess(function (proc) { return _this._proxy.$acceptDebugSessionStarted(proc.getId(), proc.configuration.type, proc.getName(false)); }));
            this._toDispose.push(debugService.onDidEndProcess(function (proc) { return _this._proxy.$acceptDebugSessionTerminated(proc.getId(), proc.configuration.type, proc.getName(false)); }));
            this._toDispose.push(debugService.getViewModel().onDidFocusProcess(function (proc) {
                if (proc) {
                    _this._proxy.$acceptDebugSessionActiveChanged(proc.getId(), proc.configuration.type, proc.getName(false));
                }
                else {
                    _this._proxy.$acceptDebugSessionActiveChanged(undefined);
                }
            }));
            this._toDispose.push(debugService.onDidCustomEvent(function (event) {
                if (event && event.sessionId) {
                    var process_1 = _this.debugService.findProcessByUUID(event.sessionId);
                    _this._proxy.$acceptDebugSessionCustomEvent(event.sessionId, process_1.configuration.type, process_1.configuration.name, event);
                }
            }));
        }
        MainThreadDebugService.prototype.dispose = function () {
            this._toDispose = lifecycle_1.dispose(this._toDispose);
        };
        MainThreadDebugService.prototype.$registerDebugConfigurationProvider = function (debugType, hasProvide, hasResolve, handle) {
            var _this = this;
            var provider = {
                type: debugType
            };
            if (hasProvide) {
                provider.provideDebugConfigurations = function (folder) {
                    return _this._proxy.$provideDebugConfigurations(handle, folder);
                };
            }
            if (hasResolve) {
                provider.resolveDebugConfiguration = function (folder, debugConfiguration) {
                    return _this._proxy.$resolveDebugConfiguration(handle, folder, debugConfiguration);
                };
            }
            this.debugService.getConfigurationManager().registerDebugConfigurationProvider(handle, provider);
            return winjs_base_1.TPromise.as(undefined);
        };
        MainThreadDebugService.prototype.$unregisterDebugConfigurationProvider = function (handle) {
            this.debugService.getConfigurationManager().unregisterDebugConfigurationProvider(handle);
            return winjs_base_1.TPromise.as(undefined);
        };
        MainThreadDebugService.prototype.$startDebugging = function (folderUri, nameOrConfiguration) {
            return this.debugService.startDebugging(folderUri, nameOrConfiguration).then(function (x) {
                return true;
            }, function (err) {
                return winjs_base_1.TPromise.wrapError(err && err.message ? err.message : 'cannot start debugging');
            });
        };
        MainThreadDebugService.prototype.$startDebugSession = function (folderUri, configuration) {
            if (configuration.request !== 'launch' && configuration.request !== 'attach') {
                return winjs_base_1.TPromise.wrapError(new Error("only 'launch' or 'attach' allowed for 'request' attribute"));
            }
            return this.debugService.createProcess(folderUri, configuration).then(function (process) {
                if (process) {
                    return process.getId();
                }
                return winjs_base_1.TPromise.wrapError(new Error('cannot create debug session'));
            }, function (err) {
                return winjs_base_1.TPromise.wrapError(err && err.message ? err.message : 'cannot start debug session');
            });
        };
        MainThreadDebugService.prototype.$customDebugAdapterRequest = function (sessionId, request, args) {
            var process = this.debugService.findProcessByUUID(sessionId);
            if (process) {
                return process.session.custom(request, args).then(function (response) {
                    if (response.success) {
                        return response.body;
                    }
                    else {
                        return winjs_base_1.TPromise.wrapError(new Error(response.message));
                    }
                });
            }
            return winjs_base_1.TPromise.wrapError(new Error('debug session not found'));
        };
        MainThreadDebugService = __decorate([
            extHostCustomers_1.extHostNamedCustomer(extHost_protocol_1.MainContext.MainThreadDebugService),
            __param(1, debug_1.IDebugService)
        ], MainThreadDebugService);
        return MainThreadDebugService;
    }());
    exports.MainThreadDebugService = MainThreadDebugService;
});
//# sourceMappingURL=mainThreadDebugService.js.map