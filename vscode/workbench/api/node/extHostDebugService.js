define(["require", "exports", "vs/base/common/winjs.base", "vs/base/common/event", "vs/base/common/async", "vs/workbench/api/node/extHost.protocol", "vs/workbench/api/node/extHostTypes"], function (require, exports, winjs_base_1, event_1, async_1, extHost_protocol_1, types) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExtHostDebugService = (function () {
        function ExtHostDebugService(mainContext, workspace) {
            this._debugSessions = new Map();
            this._workspace = workspace;
            this._handleCounter = 0;
            this._handlers = new Map();
            this._onDidStartDebugSession = new event_1.Emitter();
            this._onDidTerminateDebugSession = new event_1.Emitter();
            this._onDidChangeActiveDebugSession = new event_1.Emitter();
            this._onDidReceiveDebugSessionCustomEvent = new event_1.Emitter();
            this._debugServiceProxy = mainContext.get(extHost_protocol_1.MainContext.MainThreadDebugService);
        }
        Object.defineProperty(ExtHostDebugService.prototype, "onDidStartDebugSession", {
            get: function () { return this._onDidStartDebugSession.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostDebugService.prototype, "onDidTerminateDebugSession", {
            get: function () { return this._onDidTerminateDebugSession.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostDebugService.prototype, "onDidChangeActiveDebugSession", {
            get: function () { return this._onDidChangeActiveDebugSession.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostDebugService.prototype, "activeDebugSession", {
            get: function () { return this._activeDebugSession; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostDebugService.prototype, "onDidReceiveDebugSessionCustomEvent", {
            get: function () { return this._onDidReceiveDebugSessionCustomEvent.event; },
            enumerable: true,
            configurable: true
        });
        ExtHostDebugService.prototype.registerDebugConfigurationProvider = function (type, provider) {
            var _this = this;
            if (!provider) {
                return new types.Disposable(function () { });
            }
            var handle = this.nextHandle();
            this._handlers.set(handle, provider);
            this._debugServiceProxy.$registerDebugConfigurationProvider(type, !!provider.provideDebugConfigurations, !!provider.resolveDebugConfiguration, handle);
            return new types.Disposable(function () {
                _this._handlers.delete(handle);
                _this._debugServiceProxy.$unregisterDebugConfigurationProvider(handle);
            });
        };
        ExtHostDebugService.prototype.$provideDebugConfigurations = function (handle, folderUri) {
            var _this = this;
            var handler = this._handlers.get(handle);
            if (!handler) {
                return winjs_base_1.TPromise.wrapError(new Error('no handler found'));
            }
            if (!handler.provideDebugConfigurations) {
                return winjs_base_1.TPromise.wrapError(new Error('handler has no method provideDebugConfigurations'));
            }
            return async_1.asWinJsPromise(function (token) { return handler.provideDebugConfigurations(_this.getFolder(folderUri), token); });
        };
        ExtHostDebugService.prototype.$resolveDebugConfiguration = function (handle, folderUri, debugConfiguration) {
            var _this = this;
            var handler = this._handlers.get(handle);
            if (!handler) {
                return winjs_base_1.TPromise.wrapError(new Error('no handler found'));
            }
            if (!handler.resolveDebugConfiguration) {
                return winjs_base_1.TPromise.wrapError(new Error('handler has no method resolveDebugConfiguration'));
            }
            return async_1.asWinJsPromise(function (token) { return handler.resolveDebugConfiguration(_this.getFolder(folderUri), debugConfiguration, token); });
        };
        ExtHostDebugService.prototype.startDebugging = function (folder, nameOrConfig) {
            return this._debugServiceProxy.$startDebugging(folder ? folder.uri : undefined, nameOrConfig);
        };
        ExtHostDebugService.prototype.startDebugSession = function (folder, config) {
            var _this = this;
            return this._debugServiceProxy.$startDebugSession(folder ? folder.uri : undefined, config).then(function (id) {
                var debugSession = new ExtHostDebugSession(_this._debugServiceProxy, id, config.type, config.name);
                _this._debugSessions.set(id, debugSession);
                return debugSession;
            });
        };
        ExtHostDebugService.prototype.$acceptDebugSessionStarted = function (id, type, name) {
            var debugSession = this._debugSessions.get(id);
            if (!debugSession) {
                debugSession = new ExtHostDebugSession(this._debugServiceProxy, id, type, name);
                this._debugSessions.set(id, debugSession);
            }
            this._onDidStartDebugSession.fire(debugSession);
        };
        ExtHostDebugService.prototype.$acceptDebugSessionTerminated = function (id, type, name) {
            var debugSession = this._debugSessions.get(id);
            if (!debugSession) {
                debugSession = new ExtHostDebugSession(this._debugServiceProxy, id, type, name);
                this._debugSessions.set(id, debugSession);
            }
            this._onDidTerminateDebugSession.fire(debugSession);
            this._debugSessions.delete(id);
        };
        ExtHostDebugService.prototype.$acceptDebugSessionActiveChanged = function (id, type, name) {
            if (id) {
                this._activeDebugSession = this._debugSessions.get(id);
                if (!this._activeDebugSession) {
                    this._activeDebugSession = new ExtHostDebugSession(this._debugServiceProxy, id, type, name);
                    this._debugSessions.set(id, this._activeDebugSession);
                }
            }
            else {
                this._activeDebugSession = undefined;
            }
            this._onDidChangeActiveDebugSession.fire(this._activeDebugSession);
        };
        ExtHostDebugService.prototype.$acceptDebugSessionCustomEvent = function (id, type, name, event) {
            var debugSession = this._debugSessions.get(id);
            if (!debugSession) {
                debugSession = new ExtHostDebugSession(this._debugServiceProxy, id, type, name);
                this._debugSessions.set(id, debugSession);
            }
            var ee = {
                session: debugSession,
                event: event.event,
                body: event.body
            };
            this._onDidReceiveDebugSessionCustomEvent.fire(ee);
        };
        ExtHostDebugService.prototype.getFolder = function (folderUri) {
            if (folderUri) {
                var folders = this._workspace.getWorkspaceFolders();
                var found = folders.filter(function (f) { return f.uri.toString() === folderUri.toString(); });
                if (found && found.length > 0) {
                    return found[0];
                }
            }
            return undefined;
        };
        ExtHostDebugService.prototype.nextHandle = function () {
            return this._handleCounter++;
        };
        return ExtHostDebugService;
    }());
    exports.ExtHostDebugService = ExtHostDebugService;
    var ExtHostDebugSession = (function () {
        function ExtHostDebugSession(proxy, id, type, name) {
            this._debugServiceProxy = proxy;
            this._id = id;
            this._type = type;
            this._name = name;
        }
        ;
        Object.defineProperty(ExtHostDebugSession.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostDebugSession.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExtHostDebugSession.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        ExtHostDebugSession.prototype.customRequest = function (command, args) {
            return this._debugServiceProxy.$customDebugAdapterRequest(this._id, command, args);
        };
        return ExtHostDebugSession;
    }());
    exports.ExtHostDebugSession = ExtHostDebugSession;
});
//# sourceMappingURL=extHostDebugService.js.map