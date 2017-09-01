/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/nls", "child_process", "net", "vs/base/common/event", "vs/base/common/platform", "vs/base/common/objects", "vs/base/common/actions", "vs/base/common/errors", "vs/base/common/winjs.base", "vs/base/common/severity", "vs/base/node/stdFork", "vs/platform/message/common/message", "vs/platform/telemetry/common/telemetry", "vs/workbench/parts/terminal/common/terminal", "vs/workbench/parts/execution/common/execution", "vs/workbench/parts/debug/common/debug", "vs/workbench/parts/debug/node/v8Protocol", "vs/workbench/parts/output/common/output", "vs/platform/extensionManagement/common/extensionManagement", "vs/workbench/parts/debug/electron-browser/terminalSupport", "vs/platform/configuration/common/configuration"], function (require, exports, nls, cp, net, event_1, platform, objects, actions_1, errors, winjs_base_1, severity_1, stdfork, message_1, telemetry_1, terminal_1, execution_1, debug, v8Protocol_1, output_1, extensionManagement_1, terminalSupport_1, configuration_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RawDebugSession = (function (_super) {
        __extends(RawDebugSession, _super);
        function RawDebugSession(id, debugServerPort, adapter, customTelemetryService, root, messageService, telemetryService, outputService, terminalService, nativeTerminalService, configurationService) {
            var _this = _super.call(this, id) || this;
            _this.debugServerPort = debugServerPort;
            _this.adapter = adapter;
            _this.customTelemetryService = customTelemetryService;
            _this.root = root;
            _this.messageService = messageService;
            _this.telemetryService = telemetryService;
            _this.outputService = outputService;
            _this.terminalService = terminalService;
            _this.nativeTerminalService = nativeTerminalService;
            _this.configurationService = configurationService;
            _this.socket = null;
            _this.emittedStopped = false;
            _this.readyForBreakpoints = false;
            _this.allThreadsContinued = true;
            _this.sentPromises = [];
            _this._onDidInitialize = new event_1.Emitter();
            _this._onDidStop = new event_1.Emitter();
            _this._onDidContinued = new event_1.Emitter();
            _this._onDidTerminateDebugee = new event_1.Emitter();
            _this._onDidExitAdapter = new event_1.Emitter();
            _this._onDidThread = new event_1.Emitter();
            _this._onDidOutput = new event_1.Emitter();
            _this._onDidBreakpoint = new event_1.Emitter();
            _this._onDidCustomEvent = new event_1.Emitter();
            _this._onDidEvent = new event_1.Emitter();
            return _this;
        }
        Object.defineProperty(RawDebugSession.prototype, "onDidInitialize", {
            get: function () {
                return this._onDidInitialize.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RawDebugSession.prototype, "onDidStop", {
            get: function () {
                return this._onDidStop.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RawDebugSession.prototype, "onDidContinued", {
            get: function () {
                return this._onDidContinued.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RawDebugSession.prototype, "onDidTerminateDebugee", {
            get: function () {
                return this._onDidTerminateDebugee.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RawDebugSession.prototype, "onDidExitAdapter", {
            get: function () {
                return this._onDidExitAdapter.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RawDebugSession.prototype, "onDidThread", {
            get: function () {
                return this._onDidThread.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RawDebugSession.prototype, "onDidOutput", {
            get: function () {
                return this._onDidOutput.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RawDebugSession.prototype, "onDidBreakpoint", {
            get: function () {
                return this._onDidBreakpoint.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RawDebugSession.prototype, "onDidCustomEvent", {
            get: function () {
                return this._onDidCustomEvent.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RawDebugSession.prototype, "onDidEvent", {
            get: function () {
                return this._onDidEvent.event;
            },
            enumerable: true,
            configurable: true
        });
        RawDebugSession.prototype.initServer = function () {
            var _this = this;
            if (this.cachedInitServer) {
                return this.cachedInitServer;
            }
            var serverPromise = this.debugServerPort ? this.connectServer(this.debugServerPort) : this.startServer();
            this.cachedInitServer = serverPromise.then(function () {
                _this.startTime = new Date().getTime();
            }, function (err) {
                _this.cachedInitServer = null;
                return winjs_base_1.TPromise.wrapError(err);
            });
            return this.cachedInitServer;
        };
        RawDebugSession.prototype.custom = function (request, args) {
            return this.send(request, args);
        };
        RawDebugSession.prototype.send = function (command, args, cancelOnDisconnect) {
            var _this = this;
            if (cancelOnDisconnect === void 0) { cancelOnDisconnect = true; }
            return this.initServer().then(function () {
                var promise = _super.prototype.send.call(_this, command, args).then(function (response) { return response; }, function (errorResponse) {
                    var error = errorResponse && errorResponse.body ? errorResponse.body.error : null;
                    var errorMessage = errorResponse ? errorResponse.message : '';
                    var telemetryMessage = error ? debug.formatPII(error.format, true, error.variables) : errorMessage;
                    if (error && error.sendTelemetry) {
                        _this.telemetryService.publicLog('debugProtocolErrorResponse', { error: telemetryMessage });
                        if (_this.customTelemetryService) {
                            _this.customTelemetryService.publicLog('debugProtocolErrorResponse', { error: telemetryMessage });
                        }
                    }
                    var userMessage = error ? debug.formatPII(error.format, false, error.variables) : errorMessage;
                    if (error && error.url) {
                        var label = error.urlLabel ? error.urlLabel : nls.localize('moreInfo', "More Info");
                        return winjs_base_1.TPromise.wrapError(errors.create(userMessage, {
                            actions: [message_1.CloseAction, new actions_1.Action('debug.moreInfo', label, null, true, function () {
                                    window.open(error.url);
                                    return winjs_base_1.TPromise.as(null);
                                })]
                        }));
                    }
                    return errors.isPromiseCanceledError(errorResponse) ? undefined : winjs_base_1.TPromise.wrapError(new Error(userMessage));
                });
                if (cancelOnDisconnect) {
                    _this.sentPromises.push(promise);
                }
                return promise;
            });
        };
        RawDebugSession.prototype.onEvent = function (event) {
            event.sessionId = this.getId();
            if (event.event === 'initialized') {
                this.readyForBreakpoints = true;
                this._onDidInitialize.fire(event);
            }
            else if (event.event === 'stopped') {
                this.emittedStopped = true;
                this._onDidStop.fire(event);
            }
            else if (event.event === 'continued') {
                this.allThreadsContinued = event.body.allThreadsContinued === false ? false : true;
                this._onDidContinued.fire(event);
            }
            else if (event.event === 'thread') {
                this._onDidThread.fire(event);
            }
            else if (event.event === 'output') {
                this._onDidOutput.fire(event);
            }
            else if (event.event === 'breakpoint') {
                this._onDidBreakpoint.fire(event);
            }
            else if (event.event === 'terminated') {
                this._onDidTerminateDebugee.fire(event);
            }
            else if (event.event === 'exit') {
                this._onDidExitAdapter.fire(event);
            }
            else {
                this._onDidCustomEvent.fire(event);
            }
            this._onDidEvent.fire(event);
        };
        Object.defineProperty(RawDebugSession.prototype, "capabilities", {
            get: function () {
                return this._capabilities || {};
            },
            enumerable: true,
            configurable: true
        });
        RawDebugSession.prototype.initialize = function (args) {
            var _this = this;
            return this.send('initialize', args).then(function (response) { return _this.readCapabilities(response); });
        };
        RawDebugSession.prototype.readCapabilities = function (response) {
            if (response) {
                this._capabilities = objects.mixin(this._capabilities, response.body);
            }
            return response;
        };
        RawDebugSession.prototype.launch = function (args) {
            var _this = this;
            return this.send('launch', args).then(function (response) { return _this.readCapabilities(response); });
        };
        RawDebugSession.prototype.attach = function (args) {
            var _this = this;
            return this.send('attach', args).then(function (response) { return _this.readCapabilities(response); });
        };
        RawDebugSession.prototype.next = function (args) {
            var _this = this;
            return this.send('next', args).then(function (response) {
                _this.fireFakeContinued(args.threadId);
                return response;
            });
        };
        RawDebugSession.prototype.stepIn = function (args) {
            var _this = this;
            return this.send('stepIn', args).then(function (response) {
                _this.fireFakeContinued(args.threadId);
                return response;
            });
        };
        RawDebugSession.prototype.stepOut = function (args) {
            var _this = this;
            return this.send('stepOut', args).then(function (response) {
                _this.fireFakeContinued(args.threadId);
                return response;
            });
        };
        RawDebugSession.prototype.continue = function (args) {
            var _this = this;
            return this.send('continue', args).then(function (response) {
                if (response && response.body && response.body.allThreadsContinued !== undefined) {
                    _this.allThreadsContinued = response.body.allThreadsContinued;
                }
                _this.fireFakeContinued(args.threadId, _this.allThreadsContinued);
                return response;
            });
        };
        RawDebugSession.prototype.pause = function (args) {
            return this.send('pause', args);
        };
        RawDebugSession.prototype.setVariable = function (args) {
            return this.send('setVariable', args);
        };
        RawDebugSession.prototype.restartFrame = function (args, threadId) {
            var _this = this;
            return this.send('restartFrame', args).then(function (response) {
                _this.fireFakeContinued(threadId);
                return response;
            });
        };
        RawDebugSession.prototype.completions = function (args) {
            return this.send('completions', args);
        };
        RawDebugSession.prototype.disconnect = function (restart, force) {
            var _this = this;
            if (restart === void 0) { restart = false; }
            if (force === void 0) { force = false; }
            if (this.disconnected && force) {
                return this.stopServer();
            }
            // Cancel all sent promises on disconnect so debug trees are not left in a broken state #3666.
            // Give a 1s timeout to give a chance for some promises to complete.
            setTimeout(function () {
                _this.sentPromises.forEach(function (p) { return p && p.cancel(); });
                _this.sentPromises = [];
            }, 1000);
            if ((this.serverProcess || this.socket) && !this.disconnected) {
                // point of no return: from now on don't report any errors
                this.disconnected = true;
                return this.send('disconnect', { restart: restart }, false).then(function () { return _this.stopServer(); }, function () { return _this.stopServer(); });
            }
            return winjs_base_1.TPromise.as(null);
        };
        RawDebugSession.prototype.setBreakpoints = function (args) {
            return this.send('setBreakpoints', args);
        };
        RawDebugSession.prototype.setFunctionBreakpoints = function (args) {
            return this.send('setFunctionBreakpoints', args);
        };
        RawDebugSession.prototype.setExceptionBreakpoints = function (args) {
            return this.send('setExceptionBreakpoints', args);
        };
        RawDebugSession.prototype.configurationDone = function () {
            return this.send('configurationDone', null);
        };
        RawDebugSession.prototype.stackTrace = function (args) {
            return this.send('stackTrace', args);
        };
        RawDebugSession.prototype.exceptionInfo = function (args) {
            return this.send('exceptionInfo', args);
        };
        RawDebugSession.prototype.scopes = function (args) {
            return this.send('scopes', args);
        };
        RawDebugSession.prototype.variables = function (args) {
            return this.send('variables', args);
        };
        RawDebugSession.prototype.source = function (args) {
            return this.send('source', args);
        };
        RawDebugSession.prototype.threads = function () {
            return this.send('threads', null);
        };
        RawDebugSession.prototype.evaluate = function (args) {
            return this.send('evaluate', args);
        };
        RawDebugSession.prototype.stepBack = function (args) {
            var _this = this;
            return this.send('stepBack', args).then(function (response) {
                _this.fireFakeContinued(args.threadId);
                return response;
            });
        };
        RawDebugSession.prototype.reverseContinue = function (args) {
            var _this = this;
            return this.send('reverseContinue', args).then(function (response) {
                _this.fireFakeContinued(args.threadId);
                return response;
            });
        };
        RawDebugSession.prototype.getLengthInSeconds = function () {
            return (new Date().getTime() - this.startTime) / 1000;
        };
        RawDebugSession.prototype.dispatchRequest = function (request, response) {
            var _this = this;
            if (request.command === 'runInTerminal') {
                terminalSupport_1.TerminalSupport.runInTerminal(this.terminalService, this.nativeTerminalService, this.configurationService, request.arguments, response).then(function () {
                    _this.sendResponse(response);
                }, function (e) {
                    response.success = false;
                    response.message = e.message;
                    _this.sendResponse(response);
                });
            }
            else if (request.command === 'handshake') {
                try {
                    var vsda = require.__$__nodeRequire('vsda');
                    var obj = new vsda.signer();
                    var sig = obj.sign(request.arguments.value);
                    response.body = {
                        signature: sig
                    };
                    this.sendResponse(response);
                }
                catch (e) {
                    response.success = false;
                    response.message = e.message;
                    this.sendResponse(response);
                }
            }
            else {
                response.success = false;
                response.message = "unknown request '" + request.command + "'";
                this.sendResponse(response);
            }
        };
        RawDebugSession.prototype.fireFakeContinued = function (threadId, allThreadsContinued) {
            if (allThreadsContinued === void 0) { allThreadsContinued = false; }
            this._onDidContinued.fire({
                type: 'event',
                event: 'continued',
                body: {
                    threadId: threadId,
                    allThreadsContinued: allThreadsContinued
                },
                seq: undefined
            });
        };
        RawDebugSession.prototype.connectServer = function (port) {
            var _this = this;
            return new winjs_base_1.TPromise(function (c, e) {
                _this.socket = net.createConnection(port, '127.0.0.1', function () {
                    _this.connect(_this.socket, _this.socket);
                    c(null);
                });
                _this.socket.on('error', function (err) {
                    e(err);
                });
                _this.socket.on('close', function () { return _this.onServerExit(); });
            });
        };
        RawDebugSession.prototype.startServer = function () {
            var _this = this;
            return this.adapter.getAdapterExecutable(this.root).then(function (ae) { return _this.launchServer(ae).then(function () {
                _this.serverProcess.on('error', function (err) { return _this.onServerError(err); });
                _this.serverProcess.on('exit', function (code, signal) { return _this.onServerExit(); });
                var sanitize = function (s) { return s.toString().replace(/\r?\n$/mg, ''); };
                // this.serverProcess.stdout.on('data', (data: string) => {
                // 	console.log('%c' + sanitize(data), 'background: #ddd; font-style: italic;');
                // });
                _this.serverProcess.stderr.on('data', function (data) {
                    _this.outputService.getChannel(extensionManagement_1.ExtensionsChannelId).append(sanitize(data));
                });
                _this.connect(_this.serverProcess.stdout, _this.serverProcess.stdin);
            }); });
        };
        RawDebugSession.prototype.launchServer = function (launch) {
            var _this = this;
            return new winjs_base_1.TPromise(function (c, e) {
                if (launch.command === 'node') {
                    if (Array.isArray(launch.args) && launch.args.length > 0) {
                        stdfork.fork(launch.args[0], launch.args.slice(1), {}, function (err, child) {
                            if (err) {
                                e(new Error(nls.localize('unableToLaunchDebugAdapter', "Unable to launch debug adapter from '{0}'.", launch.args[0])));
                            }
                            _this.serverProcess = child;
                            c(null);
                        });
                    }
                    else {
                        e(new Error(nls.localize('unableToLaunchDebugAdapterNoArgs', "Unable to launch debug adapter.")));
                    }
                }
                else {
                    _this.serverProcess = cp.spawn(launch.command, launch.args, {
                        stdio: [
                            'pipe',
                            'pipe',
                            'pipe' // stderr
                        ],
                    });
                    c(null);
                }
            });
        };
        RawDebugSession.prototype.stopServer = function () {
            var _this = this;
            if (this.socket !== null) {
                this.socket.end();
                this.cachedInitServer = null;
            }
            this.onEvent({ event: 'exit', type: 'event', seq: 0 });
            if (!this.serverProcess) {
                return winjs_base_1.TPromise.as(null);
            }
            this.disconnected = true;
            var ret;
            // when killing a process in windows its child
            // processes are *not* killed but become root
            // processes. Therefore we use TASKKILL.EXE
            if (platform.isWindows) {
                ret = new winjs_base_1.TPromise(function (c, e) {
                    var killer = cp.exec("taskkill /F /T /PID " + _this.serverProcess.pid, function (err, stdout, stderr) {
                        if (err) {
                            return e(err);
                        }
                    });
                    killer.on('exit', c);
                    killer.on('error', e);
                });
            }
            else {
                this.serverProcess.kill('SIGTERM');
                ret = winjs_base_1.TPromise.as(null);
            }
            return ret;
        };
        RawDebugSession.prototype.onServerError = function (err) {
            this.messageService.show(severity_1.default.Error, nls.localize('stoppingDebugAdapter', "{0}. Stopping the debug adapter.", err.message));
            this.stopServer().done(null, errors.onUnexpectedError);
        };
        RawDebugSession.prototype.onServerExit = function () {
            this.serverProcess = null;
            this.cachedInitServer = null;
            if (!this.disconnected) {
                this.messageService.show(severity_1.default.Error, nls.localize('debugAdapterCrash', "Debug adapter process has terminated unexpectedly"));
            }
            this.onEvent({ event: 'exit', type: 'event', seq: 0 });
        };
        RawDebugSession.prototype.dispose = function () {
            this.disconnect().done(null, errors.onUnexpectedError);
        };
        RawDebugSession = __decorate([
            __param(5, message_1.IMessageService),
            __param(6, telemetry_1.ITelemetryService),
            __param(7, output_1.IOutputService),
            __param(8, terminal_1.ITerminalService),
            __param(9, execution_1.ITerminalService),
            __param(10, configuration_1.IConfigurationService)
        ], RawDebugSession);
        return RawDebugSession;
    }(v8Protocol_1.V8Protocol));
    exports.RawDebugSession = RawDebugSession;
});
//# sourceMappingURL=rawDebugSession.js.map