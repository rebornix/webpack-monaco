/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/nls", "vs/base/common/lifecycle", "vs/base/common/event", "vs/base/common/paths", "vs/base/common/strings", "vs/base/common/uuid", "vs/base/common/uri", "vs/base/common/actions", "vs/base/common/arrays", "vs/base/common/types", "vs/base/common/errors", "vs/base/common/severity", "vs/base/common/winjs.base", "vs/base/browser/ui/aria/aria", "vs/base/parts/ipc/node/ipc.cp", "vs/platform/contextkey/common/contextkey", "vs/platform/markers/common/markers", "vs/platform/lifecycle/common/lifecycle", "vs/platform/extensions/common/extensions", "vs/platform/instantiation/common/instantiation", "vs/platform/files/common/files", "vs/platform/message/common/message", "vs/platform/windows/common/windows", "vs/platform/telemetry/common/telemetry", "vs/platform/telemetry/common/telemetryService", "vs/platform/telemetry/common/telemetryIpc", "vs/platform/commands/common/commands", "vs/platform/storage/common/storage", "vs/workbench/parts/debug/common/debug", "vs/workbench/parts/debug/electron-browser/rawDebugSession", "vs/workbench/parts/debug/common/debugModel", "vs/workbench/parts/debug/common/debugViewModel", "vs/workbench/parts/debug/browser/debugActions", "vs/workbench/parts/debug/electron-browser/debugConfigurationManager", "vs/workbench/parts/markers/browser/markersPanelActions", "vs/workbench/parts/tasks/common/taskService", "vs/workbench/parts/files/common/files", "vs/workbench/services/viewlet/browser/viewlet", "vs/workbench/services/panel/common/panelService", "vs/workbench/services/part/common/partService", "vs/workbench/services/textfile/common/textfiles", "vs/platform/configuration/common/configuration", "vs/platform/workspace/common/workspace", "vs/workbench/services/editor/common/editorService", "vs/platform/extensions/common/extensionHost", "vs/platform/broadcast/electron-browser/broadcastService"], function (require, exports, nls, lifecycle, event_1, paths, strings, uuid_1, uri_1, actions_1, arrays_1, types_1, errors, severity_1, winjs_base_1, aria, ipc_cp_1, contextkey_1, markers_1, lifecycle_1, extensions_1, instantiation_1, files_1, message_1, windows_1, telemetry_1, telemetryService_1, telemetryIpc_1, commands_1, storage_1, debug, rawDebugSession_1, debugModel_1, debugViewModel_1, debugactions, debugConfigurationManager_1, markersPanelActions_1, taskService_1, files_2, viewlet_1, panelService_1, partService_1, textfiles_1, configuration_1, workspace_1, editorService_1, extensionHost_1, broadcastService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DEBUG_BREAKPOINTS_KEY = 'debug.breakpoint';
    var DEBUG_BREAKPOINTS_ACTIVATED_KEY = 'debug.breakpointactivated';
    var DEBUG_FUNCTION_BREAKPOINTS_KEY = 'debug.functionbreakpoint';
    var DEBUG_EXCEPTION_BREAKPOINTS_KEY = 'debug.exceptionbreakpoint';
    var DEBUG_WATCH_EXPRESSIONS_KEY = 'debug.watchexpressions';
    ;
    var DebugService = (function () {
        function DebugService(storageService, editorService, textFileService, viewletService, panelService, messageService, partService, windowsService, windowService, broadcastService, telemetryService, contextService, contextKeyService, lifecycleService, instantiationService, extensionService, markerService, taskService, fileService, configurationService, commandService) {
            this.storageService = storageService;
            this.editorService = editorService;
            this.textFileService = textFileService;
            this.viewletService = viewletService;
            this.panelService = panelService;
            this.messageService = messageService;
            this.partService = partService;
            this.windowsService = windowsService;
            this.windowService = windowService;
            this.broadcastService = broadcastService;
            this.telemetryService = telemetryService;
            this.contextService = contextService;
            this.instantiationService = instantiationService;
            this.extensionService = extensionService;
            this.markerService = markerService;
            this.taskService = taskService;
            this.fileService = fileService;
            this.configurationService = configurationService;
            this.commandService = commandService;
            this.toDispose = [];
            this.toDisposeOnSessionEnd = new Map();
            this.breakpointsToSendOnResourceSaved = new Set();
            this._onDidChangeState = new event_1.Emitter();
            this._onDidNewProcess = new event_1.Emitter();
            this._onDidEndProcess = new event_1.Emitter();
            this._onDidCustomEvent = new event_1.Emitter();
            this.sessionStates = new Map();
            this.allSessionIds = new Set();
            this.configurationManager = this.instantiationService.createInstance(debugConfigurationManager_1.ConfigurationManager);
            this.toDispose.push(this.configurationManager);
            this.inDebugMode = debug.CONTEXT_IN_DEBUG_MODE.bindTo(contextKeyService);
            this.debugType = debug.CONTEXT_DEBUG_TYPE.bindTo(contextKeyService);
            this.debugState = debug.CONTEXT_DEBUG_STATE.bindTo(contextKeyService);
            this.model = new debugModel_1.Model(this.loadBreakpoints(), this.storageService.getBoolean(DEBUG_BREAKPOINTS_ACTIVATED_KEY, storage_1.StorageScope.WORKSPACE, true), this.loadFunctionBreakpoints(), this.loadExceptionBreakpoints(), this.loadWatchExpressions());
            this.toDispose.push(this.model);
            this.viewModel = new debugViewModel_1.ViewModel();
            this.registerListeners(lifecycleService);
        }
        DebugService.prototype.registerListeners = function (lifecycleService) {
            var _this = this;
            this.toDispose.push(this.fileService.onFileChanges(function (e) { return _this.onFileChanges(e); }));
            lifecycleService.onShutdown(this.store, this);
            lifecycleService.onShutdown(this.dispose, this);
            this.toDispose.push(this.broadcastService.onBroadcast(this.onBroadcast, this));
        };
        DebugService.prototype.onBroadcast = function (broadcast) {
            var _this = this;
            // attach: PH is ready to be attached to
            var process = this.model.getProcesses().filter(function (p) { return p.getId() === broadcast.payload.debugId; }).pop();
            var session = process ? process.session : null;
            if (!this.allSessionIds.has(broadcast.payload.debugId)) {
                // Ignore attach events for sessions that never existed (wrong vscode windows)
                return;
            }
            if (broadcast.channel === extensionHost_1.EXTENSION_ATTACH_BROADCAST_CHANNEL) {
                if (session) {
                    this.onSessionEnd(session);
                }
                var config = this.configurationManager.selectedLaunch.getConfiguration(this.configurationManager.selectedName);
                this.configurationManager.selectedLaunch.resolveConfiguration(config).done(function (resolvedConfig) {
                    resolvedConfig.request = 'attach';
                    resolvedConfig.port = broadcast.payload.port;
                    _this.doCreateProcess(_this.configurationManager.selectedLaunch.workspaceUri, resolvedConfig, broadcast.payload.debugId);
                }, errors.onUnexpectedError);
                return;
            }
            if (session && broadcast.channel === extensionHost_1.EXTENSION_TERMINATE_BROADCAST_CHANNEL) {
                this.onSessionEnd(session);
                return;
            }
            // from this point on we require an active session
            if (!session) {
                return;
            }
            // an extension logged output, show it inside the REPL
            if (broadcast.channel === extensionHost_1.EXTENSION_LOG_BROADCAST_CHANNEL) {
                var extensionOutput = broadcast.payload.logEntry;
                var sev = extensionOutput.severity === 'warn' ? severity_1.default.Warning : extensionOutput.severity === 'error' ? severity_1.default.Error : severity_1.default.Info;
                var args = [];
                try {
                    var parsed_1 = JSON.parse(extensionOutput.arguments);
                    args.push.apply(args, Object.getOwnPropertyNames(parsed_1).map(function (o) { return parsed_1[o]; }));
                }
                catch (error) {
                    args.push(extensionOutput.arguments);
                }
                // add output for each argument logged
                var simpleVals = [];
                for (var i = 0; i < args.length; i++) {
                    var a = args[i];
                    // undefined gets printed as 'undefined'
                    if (typeof a === 'undefined') {
                        simpleVals.push('undefined');
                    }
                    else if (a === null) {
                        simpleVals.push('null');
                    }
                    else if (types_1.isObject(a) || Array.isArray(a)) {
                        // flush any existing simple values logged
                        if (simpleVals.length) {
                            this.logToRepl(simpleVals.join(' '), sev);
                            simpleVals = [];
                        }
                        // show object
                        this.logToRepl(new debugModel_1.OutputNameValueElement(a.prototype, a, nls.localize('snapshotObj', "Only primitive values are shown for this object.")), sev);
                    }
                    else if (typeof a === 'string') {
                        var buf = '';
                        for (var j = 0, len = a.length; j < len; j++) {
                            if (a[j] === '%' && (a[j + 1] === 's' || a[j + 1] === 'i' || a[j + 1] === 'd')) {
                                i++; // read over substitution
                                buf += !types_1.isUndefinedOrNull(args[i]) ? args[i] : ''; // replace
                                j++; // read over directive
                            }
                            else {
                                buf += a[j];
                            }
                        }
                        simpleVals.push(buf);
                    }
                    else {
                        simpleVals.push(a);
                    }
                }
                // flush simple values
                // always append a new line for output coming from an extension such that separate logs go to separate lines #23695
                if (simpleVals.length) {
                    this.logToRepl(simpleVals.join(' ') + '\n', sev);
                }
            }
        };
        DebugService.prototype.tryToAutoFocusStackFrame = function (thread) {
            var callStack = thread.getCallStack();
            if (!callStack.length || this.viewModel.focusedStackFrame) {
                return winjs_base_1.TPromise.as(null);
            }
            // focus first stack frame from top that has source location if no other stack frame is focused
            var stackFrameToFocus = arrays_1.first(callStack, function (sf) { return sf.source && sf.source.available; }, undefined);
            if (!stackFrameToFocus) {
                return winjs_base_1.TPromise.as(null);
            }
            this.focusStackFrameAndEvaluate(stackFrameToFocus).done(null, errors.onUnexpectedError);
            if (thread.stoppedDetails) {
                this.windowService.focusWindow();
                aria.alert(nls.localize('debuggingPaused', "Debugging paused, reason {0}, {1} {2}", thread.stoppedDetails.reason, stackFrameToFocus.source ? stackFrameToFocus.source.name : '', stackFrameToFocus.range.startLineNumber));
            }
            return stackFrameToFocus.openInEditor(this.editorService);
        };
        DebugService.prototype.registerSessionListeners = function (process, session) {
            var _this = this;
            this.toDisposeOnSessionEnd.get(session.getId()).push(session);
            this.toDisposeOnSessionEnd.get(session.getId()).push(session.onDidInitialize(function (event) {
                aria.status(nls.localize('debuggingStarted', "Debugging started."));
                var sendConfigurationDone = function () {
                    if (session && session.capabilities.supportsConfigurationDoneRequest) {
                        return session.configurationDone().done(null, function (e) {
                            // Disconnect the debug session on configuration done error #10596
                            if (session) {
                                session.disconnect().done(null, errors.onUnexpectedError);
                            }
                            _this.messageService.show(severity_1.default.Error, e.message);
                        });
                    }
                };
                _this.sendAllBreakpoints(process).then(sendConfigurationDone, sendConfigurationDone)
                    .done(function () { return _this.fetchThreads(session); }, errors.onUnexpectedError);
            }));
            this.toDisposeOnSessionEnd.get(session.getId()).push(session.onDidStop(function (event) {
                _this.updateStateAndEmit(session.getId(), debug.State.Stopped);
                var threadId = event.body.threadId;
                session.threads().then(function (response) {
                    if (!response || !response.body || !response.body.threads) {
                        return;
                    }
                    var rawThread = response.body.threads.filter(function (t) { return t.id === threadId; }).pop();
                    _this.model.rawUpdate({
                        sessionId: session.getId(),
                        thread: rawThread,
                        threadId: threadId,
                        stoppedDetails: event.body,
                        allThreadsStopped: event.body.allThreadsStopped
                    });
                    var thread = process && process.getThread(threadId);
                    if (thread) {
                        // Call fetch call stack twice, the first only return the top stack frame.
                        // Second retrieves the rest of the call stack. For performance reasons #25605
                        _this.model.fetchCallStack(thread).then(function () {
                            return _this.tryToAutoFocusStackFrame(thread);
                        });
                    }
                }, errors.onUnexpectedError);
            }));
            this.toDisposeOnSessionEnd.get(session.getId()).push(session.onDidThread(function (event) {
                if (event.body.reason === 'started') {
                    _this.fetchThreads(session).done(undefined, errors.onUnexpectedError);
                }
                else if (event.body.reason === 'exited') {
                    _this.model.clearThreads(session.getId(), true, event.body.threadId);
                }
            }));
            this.toDisposeOnSessionEnd.get(session.getId()).push(session.onDidTerminateDebugee(function (event) {
                aria.status(nls.localize('debuggingStopped', "Debugging stopped."));
                if (session && session.getId() === event.sessionId) {
                    if (event.body && event.body.restart && process) {
                        _this.restartProcess(process, event.body.restart).done(null, function (err) { return _this.messageService.show(severity_1.default.Error, err.message); });
                    }
                    else {
                        session.disconnect().done(null, errors.onUnexpectedError);
                    }
                }
            }));
            this.toDisposeOnSessionEnd.get(session.getId()).push(session.onDidContinued(function (event) {
                var threadId = event.body.allThreadsContinued !== false ? undefined : event.body.threadId;
                _this.model.clearThreads(session.getId(), false, threadId);
                if (_this.viewModel.focusedProcess.getId() === session.getId()) {
                    _this.focusStackFrameAndEvaluate(null, _this.viewModel.focusedProcess).done(null, errors.onUnexpectedError);
                }
                _this.updateStateAndEmit(session.getId(), debug.State.Running);
            }));
            this.toDisposeOnSessionEnd.get(session.getId()).push(session.onDidOutput(function (event) {
                if (!event.body) {
                    return;
                }
                var outputSeverity = event.body.category === 'stderr' ? severity_1.default.Error : event.body.category === 'console' ? severity_1.default.Warning : severity_1.default.Info;
                if (event.body.category === 'telemetry') {
                    // only log telemetry events from debug adapter if the adapter provided the telemetry key
                    // and the user opted in telemetry
                    if (_this.customTelemetryService && _this.telemetryService.isOptedIn) {
                        _this.customTelemetryService.publicLog(event.body.output, event.body.data);
                    }
                }
                else if (event.body.variablesReference) {
                    var container = new debugModel_1.ExpressionContainer(process, event.body.variablesReference, uuid_1.generateUuid());
                    container.getChildren().then(function (children) {
                        children.forEach(function (child) {
                            // Since we can not display multiple trees in a row, we are displaying these variables one after the other (ignoring their names)
                            child.name = null;
                            _this.logToRepl(child, outputSeverity);
                        });
                    });
                }
                else if (typeof event.body.output === 'string') {
                    _this.logToRepl(event.body.output, outputSeverity);
                }
            }));
            this.toDisposeOnSessionEnd.get(session.getId()).push(session.onDidBreakpoint(function (event) {
                var id = event.body && event.body.breakpoint ? event.body.breakpoint.id : undefined;
                var breakpoint = _this.model.getBreakpoints().filter(function (bp) { return bp.idFromAdapter === id; }).pop();
                if (breakpoint) {
                    if (!breakpoint.column) {
                        event.body.breakpoint.column = undefined;
                    }
                    _this.model.updateBreakpoints((_a = {}, _a[breakpoint.getId()] = event.body.breakpoint, _a));
                }
                else {
                    var functionBreakpoint = _this.model.getFunctionBreakpoints().filter(function (bp) { return bp.idFromAdapter === id; }).pop();
                    if (functionBreakpoint) {
                        _this.model.updateFunctionBreakpoints((_b = {}, _b[functionBreakpoint.getId()] = event.body.breakpoint, _b));
                    }
                }
                var _a, _b;
            }));
            this.toDisposeOnSessionEnd.get(session.getId()).push(session.onDidExitAdapter(function (event) {
                // 'Run without debugging' mode VSCode must terminate the extension host. More details: #3905
                var process = _this.viewModel.focusedProcess;
                if (process && session && process.getId() === session.getId() && strings.equalsIgnoreCase(process.configuration.type, 'extensionhost') && _this.sessionStates.get(session.getId()) === debug.State.Running &&
                    process && _this.contextService.hasWorkspace() && process.configuration.noDebug) {
                    _this.broadcastService.broadcast({
                        channel: extensionHost_1.EXTENSION_CLOSE_EXTHOST_BROADCAST_CHANNEL,
                        payload: [process.session.root.fsPath]
                    });
                }
                if (session && session.getId() === event.sessionId) {
                    _this.onSessionEnd(session);
                }
            }));
            this.toDisposeOnSessionEnd.get(session.getId()).push(session.onDidCustomEvent(function (event) {
                _this._onDidCustomEvent.fire(event);
            }));
        };
        DebugService.prototype.fetchThreads = function (session) {
            var _this = this;
            return session.threads().then(function (response) {
                if (response && response.body && response.body.threads) {
                    response.body.threads.forEach(function (thread) {
                        return _this.model.rawUpdate({
                            sessionId: session.getId(),
                            threadId: thread.id,
                            thread: thread
                        });
                    });
                }
            });
        };
        DebugService.prototype.loadBreakpoints = function () {
            var result;
            try {
                result = JSON.parse(this.storageService.get(DEBUG_BREAKPOINTS_KEY, storage_1.StorageScope.WORKSPACE, '[]')).map(function (breakpoint) {
                    return new debugModel_1.Breakpoint(uri_1.default.parse(breakpoint.uri.external || breakpoint.source.uri.external), breakpoint.lineNumber, breakpoint.column, breakpoint.enabled, breakpoint.condition, breakpoint.hitCondition);
                });
            }
            catch (e) { }
            return result || [];
        };
        DebugService.prototype.loadFunctionBreakpoints = function () {
            var result;
            try {
                result = JSON.parse(this.storageService.get(DEBUG_FUNCTION_BREAKPOINTS_KEY, storage_1.StorageScope.WORKSPACE, '[]')).map(function (fb) {
                    return new debugModel_1.FunctionBreakpoint(fb.name, fb.enabled, fb.hitCondition);
                });
            }
            catch (e) { }
            return result || [];
        };
        DebugService.prototype.loadExceptionBreakpoints = function () {
            var result;
            try {
                result = JSON.parse(this.storageService.get(DEBUG_EXCEPTION_BREAKPOINTS_KEY, storage_1.StorageScope.WORKSPACE, '[]')).map(function (exBreakpoint) {
                    return new debugModel_1.ExceptionBreakpoint(exBreakpoint.filter || exBreakpoint.name, exBreakpoint.label, exBreakpoint.enabled);
                });
            }
            catch (e) { }
            return result || [];
        };
        DebugService.prototype.loadWatchExpressions = function () {
            var result;
            try {
                result = JSON.parse(this.storageService.get(DEBUG_WATCH_EXPRESSIONS_KEY, storage_1.StorageScope.WORKSPACE, '[]')).map(function (watchStoredData) {
                    return new debugModel_1.Expression(watchStoredData.name, watchStoredData.id);
                });
            }
            catch (e) { }
            return result || [];
        };
        Object.defineProperty(DebugService.prototype, "state", {
            get: function () {
                var focusedThread = this.viewModel.focusedThread;
                if (focusedThread && focusedThread.stopped) {
                    return debug.State.Stopped;
                }
                var focusedProcess = this.viewModel.focusedProcess;
                if (focusedProcess && this.sessionStates.has(focusedProcess.getId())) {
                    return this.sessionStates.get(focusedProcess.getId());
                }
                if (this.sessionStates.size > 0) {
                    return debug.State.Initializing;
                }
                return debug.State.Inactive;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugService.prototype, "onDidChangeState", {
            get: function () {
                return this._onDidChangeState.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugService.prototype, "onDidNewProcess", {
            get: function () {
                return this._onDidNewProcess.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugService.prototype, "onDidEndProcess", {
            get: function () {
                return this._onDidEndProcess.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DebugService.prototype, "onDidCustomEvent", {
            get: function () {
                return this._onDidCustomEvent.event;
            },
            enumerable: true,
            configurable: true
        });
        DebugService.prototype.updateStateAndEmit = function (sessionId, newState) {
            if (sessionId) {
                if (newState === debug.State.Inactive) {
                    this.sessionStates.delete(sessionId);
                }
                else {
                    this.sessionStates.set(sessionId, newState);
                }
            }
            var state = this.state;
            var stateLabel = debug.State[state];
            if (stateLabel) {
                this.debugState.set(stateLabel.toLowerCase());
            }
            this._onDidChangeState.fire(state);
        };
        DebugService.prototype.focusStackFrameAndEvaluate = function (stackFrame, process, explicit) {
            if (!process) {
                var processes = this.model.getProcesses();
                process = stackFrame ? stackFrame.thread.process : processes.length ? processes[0] : null;
            }
            if (!stackFrame) {
                var threads = process ? process.getAllThreads() : null;
                var callStack = threads && threads.length ? threads[0].getCallStack() : null;
                stackFrame = callStack && callStack.length ? callStack[0] : null;
            }
            this.viewModel.setFocusedStackFrame(stackFrame, process, explicit);
            this.updateStateAndEmit();
            return this.model.evaluateWatchExpressions(process, stackFrame);
        };
        DebugService.prototype.enableOrDisableBreakpoints = function (enable, breakpoint) {
            if (breakpoint) {
                this.model.setEnablement(breakpoint, enable);
                if (breakpoint instanceof debugModel_1.Breakpoint) {
                    return this.sendBreakpoints(breakpoint.uri);
                }
                else if (breakpoint instanceof debugModel_1.FunctionBreakpoint) {
                    return this.sendFunctionBreakpoints();
                }
                return this.sendExceptionBreakpoints();
            }
            this.model.enableOrDisableAllBreakpoints(enable);
            return this.sendAllBreakpoints();
        };
        DebugService.prototype.addBreakpoints = function (uri, rawBreakpoints) {
            this.model.addBreakpoints(uri, rawBreakpoints);
            rawBreakpoints.forEach(function (rbp) { return aria.status(nls.localize('breakpointAdded', "Added breakpoint, line {0}, file {1}", rbp.lineNumber, uri.fsPath)); });
            return this.sendBreakpoints(uri);
        };
        DebugService.prototype.removeBreakpoints = function (id) {
            var _this = this;
            var toRemove = this.model.getBreakpoints().filter(function (bp) { return !id || bp.getId() === id; });
            toRemove.forEach(function (bp) { return aria.status(nls.localize('breakpointRemoved', "Removed breakpoint, line {0}, file {1}", bp.lineNumber, bp.uri.fsPath)); });
            var urisToClear = arrays_1.distinct(toRemove, function (bp) { return bp.uri.toString(); }).map(function (bp) { return bp.uri; });
            this.model.removeBreakpoints(toRemove);
            return winjs_base_1.TPromise.join(urisToClear.map(function (uri) { return _this.sendBreakpoints(uri); }));
        };
        DebugService.prototype.setBreakpointsActivated = function (activated) {
            this.model.setBreakpointsActivated(activated);
            return this.sendAllBreakpoints();
        };
        DebugService.prototype.addFunctionBreakpoint = function () {
            this.model.addFunctionBreakpoint('');
        };
        DebugService.prototype.renameFunctionBreakpoint = function (id, newFunctionName) {
            this.model.updateFunctionBreakpoints((_a = {}, _a[id] = { name: newFunctionName }, _a));
            return this.sendFunctionBreakpoints();
            var _a;
        };
        DebugService.prototype.removeFunctionBreakpoints = function (id) {
            this.model.removeFunctionBreakpoints(id);
            return this.sendFunctionBreakpoints();
        };
        DebugService.prototype.addReplExpression = function (name) {
            var _this = this;
            this.telemetryService.publicLog('debugService/addReplExpression');
            return this.model.addReplExpression(this.viewModel.focusedProcess, this.viewModel.focusedStackFrame, name)
                .then(function () { return _this.focusStackFrameAndEvaluate(_this.viewModel.focusedStackFrame, _this.viewModel.focusedProcess); });
        };
        DebugService.prototype.removeReplExpressions = function () {
            this.model.removeReplExpressions();
        };
        DebugService.prototype.logToRepl = function (value, sev) {
            if (sev === void 0) { sev = severity_1.default.Info; }
            if (typeof value === 'string' && '[2J'.localeCompare(value) === 0) {
                // [2J is the ansi escape sequence for clearing the display http://ascii-table.com/ansi-escape-sequences.php
                this.model.removeReplExpressions();
            }
            else {
                this.model.appendToRepl(value, sev);
            }
        };
        DebugService.prototype.addWatchExpression = function (name) {
            return this.model.addWatchExpression(this.viewModel.focusedProcess, this.viewModel.focusedStackFrame, name);
        };
        DebugService.prototype.renameWatchExpression = function (id, newName) {
            return this.model.renameWatchExpression(this.viewModel.focusedProcess, this.viewModel.focusedStackFrame, id, newName);
        };
        DebugService.prototype.moveWatchExpression = function (id, position) {
            this.model.moveWatchExpression(id, position);
        };
        DebugService.prototype.removeWatchExpressions = function (id) {
            this.model.removeWatchExpressions(id);
        };
        DebugService.prototype.startDebugging = function (root, configOrName, noDebug, topCompoundName) {
            var _this = this;
            if (noDebug === void 0) { noDebug = false; }
            // make sure to save all files and that the configuration is up to date
            return this.textFileService.saveAll().then(function () { return _this.configurationService.reloadConfiguration().then(function () {
                return _this.extensionService.onReady().then(function () {
                    if (_this.model.getProcesses().length === 0) {
                        _this.removeReplExpressions();
                    }
                    _this.launchJsonChanged = false;
                    var manager = _this.getConfigurationManager();
                    var launch = root ? manager.getLaunches().filter(function (l) { return l.workspaceUri.toString() === root.toString(); }).pop() : undefined;
                    var config, compound;
                    if (!configOrName) {
                        configOrName = _this.configurationManager.selectedName;
                    }
                    if (typeof configOrName === 'string' && launch) {
                        config = launch.getConfiguration(configOrName);
                        compound = launch.getCompound(configOrName);
                    }
                    else if (typeof configOrName !== 'string') {
                        config = configOrName;
                    }
                    if (launch) {
                        // in the drop down the name of the top most compound takes precedence over the launch config name
                        manager.selectConfiguration(launch, topCompoundName || (typeof configOrName === 'string' ? configOrName : undefined), true);
                    }
                    if (compound) {
                        if (!compound.configurations) {
                            return winjs_base_1.TPromise.wrapError(new Error(nls.localize({ key: 'compoundMustHaveConfigurations', comment: ['compound indicates a "compounds" configuration item', '"configurations" is an attribute and should not be localized'] }, "Compound must have \"configurations\" attribute set in order to start multiple configurations.")));
                        }
                        return winjs_base_1.TPromise.join(compound.configurations.map(function (name) { return name !== compound.name ? _this.startDebugging(root, name, noDebug, topCompoundName || compound.name) : winjs_base_1.TPromise.as(null); }));
                    }
                    if (configOrName && !config) {
                        return winjs_base_1.TPromise.wrapError(new Error(nls.localize('configMissing', "Configuration '{0}' is missing in 'launch.json'.", configOrName)));
                    }
                    return manager.getStartSessionCommand(config ? config.type : undefined).then(function (commandAndType) {
                        if (noDebug && config) {
                            config.noDebug = true;
                        }
                        // deprecated code: use DebugConfigurationProvider instead of startSessionCommand
                        if (commandAndType && commandAndType.command) {
                            var defaultConfig = noDebug ? { noDebug: true } : {};
                            return _this.commandService.executeCommand(commandAndType.command, config || defaultConfig, launch ? launch.workspaceUri : undefined).then(function (result) {
                                if (launch) {
                                    if (result && result.status === 'initialConfiguration') {
                                        return launch.openConfigFile(false, commandAndType.type);
                                    }
                                    if (result && result.status === 'saveConfiguration') {
                                        return _this.fileService.updateContent(launch.uri, result.content).then(function () { return launch.openConfigFile(false); });
                                    }
                                }
                                return undefined;
                            });
                        }
                        // end of deprecation
                        if (config) {
                            return _this.configurationManager.resolveDebugConfiguration(launch ? launch.workspaceUri : undefined, config).then(function (config) {
                                // TODO@AW: handle the 'initialConfiguration' and 'saveConfiguration' cases from above!
                                return _this.createProcess(root, config);
                            });
                        }
                        if (launch && commandAndType) {
                            return launch.openConfigFile(false, commandAndType.type);
                        }
                        return undefined;
                    });
                });
            }); });
        };
        DebugService.prototype.findProcessByUUID = function (uuid) {
            var processes = this.getModel().getProcesses();
            var result = processes.filter(function (process) { return process.getId() === uuid; });
            if (result.length > 0) {
                return result[0]; // there can only be one
            }
            return null;
        };
        DebugService.prototype.createProcess = function (root, config) {
            var _this = this;
            return this.textFileService.saveAll().then(function () {
                return (_this.configurationManager.selectedLaunch ? _this.configurationManager.selectedLaunch.resolveConfiguration(config) : winjs_base_1.TPromise.as(config)).then(function (resolvedConfig) {
                    if (!resolvedConfig) {
                        // User canceled resolving of interactive variables, silently return
                        return undefined;
                    }
                    if (!_this.configurationManager.getAdapter(resolvedConfig.type)) {
                        var message = resolvedConfig.type ? nls.localize('debugTypeNotSupported', "Configured debug type '{0}' is not supported.", resolvedConfig.type) :
                            nls.localize('debugTypeMissing', "Missing property 'type' for the chosen launch configuration.");
                        return winjs_base_1.TPromise.wrapError(errors.create(message, { actions: [_this.instantiationService.createInstance(debugactions.ConfigureAction, debugactions.ConfigureAction.ID, debugactions.ConfigureAction.LABEL), message_1.CloseAction] }));
                    }
                    return _this.runPreLaunchTask(resolvedConfig.preLaunchTask).then(function (taskSummary) {
                        var errorCount = resolvedConfig.preLaunchTask ? _this.markerService.getStatistics().errors : 0;
                        var successExitCode = taskSummary && taskSummary.exitCode === 0;
                        var failureExitCode = taskSummary && taskSummary.exitCode !== undefined && taskSummary.exitCode !== 0;
                        if (successExitCode || (errorCount === 0 && !failureExitCode)) {
                            return _this.doCreateProcess(root, resolvedConfig);
                        }
                        _this.messageService.show(severity_1.default.Error, {
                            message: errorCount > 1 ? nls.localize('preLaunchTaskErrors', "Build errors have been detected during preLaunchTask '{0}'.", resolvedConfig.preLaunchTask) :
                                errorCount === 1 ? nls.localize('preLaunchTaskError', "Build error has been detected during preLaunchTask '{0}'.", resolvedConfig.preLaunchTask) :
                                    nls.localize('preLaunchTaskExitCode', "The preLaunchTask '{0}' terminated with exit code {1}.", resolvedConfig.preLaunchTask, taskSummary.exitCode),
                            actions: [
                                new actions_1.Action('debug.continue', nls.localize('debugAnyway', "Debug Anyway"), null, true, function () {
                                    _this.messageService.hideAll();
                                    return _this.doCreateProcess(root, resolvedConfig);
                                }),
                                _this.instantiationService.createInstance(markersPanelActions_1.ToggleMarkersPanelAction, markersPanelActions_1.ToggleMarkersPanelAction.ID, markersPanelActions_1.ToggleMarkersPanelAction.LABEL),
                                message_1.CloseAction
                            ]
                        });
                        return undefined;
                    }, function (err) {
                        _this.messageService.show(err.severity, {
                            message: err.message,
                            actions: [
                                _this.instantiationService.createInstance(debugactions.ConfigureAction, debugactions.ConfigureAction.ID, debugactions.ConfigureAction.LABEL),
                                _this.taskService.configureAction(),
                                message_1.CloseAction
                            ]
                        });
                    });
                }, function (err) {
                    if (!_this.contextService.hasWorkspace()) {
                        _this.messageService.show(severity_1.default.Error, nls.localize('noFolderWorkspaceDebugError', "The active file can not be debugged. Make sure it is saved on disk and that you have a debug extension installed for that file type."));
                        return undefined;
                    }
                    return _this.configurationManager.selectedLaunch.openConfigFile(false).then(function (openend) {
                        if (openend) {
                            _this.messageService.show(severity_1.default.Info, nls.localize('NewLaunchConfig', "Please set up the launch configuration file for your application. {0}", err.message));
                        }
                        return undefined;
                    });
                });
            });
        };
        DebugService.prototype.doCreateProcess = function (root, configuration, sessionId) {
            var _this = this;
            if (sessionId === void 0) { sessionId = uuid_1.generateUuid(); }
            configuration.__sessionId = sessionId;
            this.allSessionIds.add(sessionId);
            this.updateStateAndEmit(sessionId, debug.State.Initializing);
            return this.telemetryService.getTelemetryInfo().then(function (info) {
                var telemetryInfo = Object.create(null);
                telemetryInfo['common.vscodemachineid'] = info.machineId;
                telemetryInfo['common.vscodesessionid'] = info.sessionId;
                return telemetryInfo;
            }).then(function (data) {
                var adapter = _this.configurationManager.getAdapter(configuration.type);
                var aiKey = adapter.aiKey, type = adapter.type;
                var publisher = adapter.extensionDescription.publisher;
                _this.customTelemetryService = null;
                var client;
                if (aiKey) {
                    client = new ipc_cp_1.Client(uri_1.default.parse(require.toUrl('bootstrap')).fsPath, {
                        serverName: 'Debug Telemetry',
                        timeout: 1000 * 60 * 5,
                        args: [publisher + "." + type, JSON.stringify(data), aiKey],
                        env: {
                            ELECTRON_RUN_AS_NODE: 1,
                            PIPE_LOGGING: 'true',
                            AMD_ENTRYPOINT: 'vs/workbench/parts/debug/node/telemetryApp'
                        }
                    });
                    var channel = client.getChannel('telemetryAppender');
                    var appender = new telemetryIpc_1.TelemetryAppenderClient(channel);
                    _this.customTelemetryService = new telemetryService_1.TelemetryService({ appender: appender }, _this.configurationService);
                }
                var session = _this.instantiationService.createInstance(rawDebugSession_1.RawDebugSession, sessionId, configuration.debugServer, adapter, _this.customTelemetryService, root);
                var process = _this.model.addProcess(configuration, session);
                _this.toDisposeOnSessionEnd.set(session.getId(), []);
                if (client) {
                    _this.toDisposeOnSessionEnd.get(session.getId()).push(client);
                }
                _this.registerSessionListeners(process, session);
                return session.initialize({
                    clientID: 'vscode',
                    adapterID: configuration.type,
                    pathFormat: 'path',
                    linesStartAt1: true,
                    columnsStartAt1: true,
                    supportsVariableType: true,
                    supportsVariablePaging: true,
                    supportsRunInTerminalRequest: true // #10574
                }).then(function (result) {
                    _this.model.setExceptionBreakpoints(session.capabilities.exceptionBreakpointFilters);
                    return configuration.request === 'attach' ? session.attach(configuration) : session.launch(configuration);
                }).then(function (result) {
                    if (session.disconnected) {
                        return winjs_base_1.TPromise.as(null);
                    }
                    _this._onDidNewProcess.fire(process);
                    _this.focusStackFrameAndEvaluate(null, process);
                    var internalConsoleOptions = configuration.internalConsoleOptions || _this.configurationService.getConfiguration('debug').internalConsoleOptions;
                    if (internalConsoleOptions === 'openOnSessionStart' || (!_this.viewModel.changedWorkbenchViewState && internalConsoleOptions === 'openOnFirstSessionStart')) {
                        _this.panelService.openPanel(debug.REPL_ID, false).done(undefined, errors.onUnexpectedError);
                    }
                    if (!_this.viewModel.changedWorkbenchViewState && (_this.partService.isVisible(partService_1.Parts.SIDEBAR_PART) || !_this.contextService.hasWorkspace())) {
                        // We only want to change the workbench view state on the first debug session #5738 and if the side bar is not hidden
                        _this.viewModel.changedWorkbenchViewState = true;
                        _this.viewletService.openViewlet(debug.VIEWLET_ID);
                    }
                    _this.extensionService.activateByEvent("onDebug:" + configuration.type).done(null, errors.onUnexpectedError);
                    _this.inDebugMode.set(true);
                    _this.debugType.set(configuration.type);
                    if (_this.model.getProcesses().length > 1) {
                        _this.viewModel.setMultiProcessView(true);
                    }
                    _this.updateStateAndEmit(session.getId(), debug.State.Running);
                    return _this.telemetryService.publicLog('debugSessionStart', {
                        type: configuration.type,
                        breakpointCount: _this.model.getBreakpoints().length,
                        exceptionBreakpoints: _this.model.getExceptionBreakpoints(),
                        watchExpressionsCount: _this.model.getWatchExpressions().length,
                        extensionName: adapter.extensionDescription.publisher + "." + adapter.extensionDescription.name,
                        isBuiltin: adapter.extensionDescription.isBuiltin,
                        launchJsonExists: _this.contextService.hasWorkspace() && !!_this.configurationService.getConfiguration('launch', { resource: root })
                    });
                }).then(function () { return process; }, function (error) {
                    if (error instanceof Error && error.message === 'Canceled') {
                        // Do not show 'canceled' error messages to the user #7906
                        return winjs_base_1.TPromise.as(null);
                    }
                    var errorMessage = error instanceof Error ? error.message : error;
                    _this.telemetryService.publicLog('debugMisconfiguration', { type: configuration ? configuration.type : undefined, error: errorMessage });
                    _this.updateStateAndEmit(session.getId(), debug.State.Inactive);
                    if (!session.disconnected) {
                        session.disconnect().done(null, errors.onUnexpectedError);
                    }
                    // Show the repl if some error got logged there #5870
                    if (_this.model.getReplElements().length > 0) {
                        _this.panelService.openPanel(debug.REPL_ID, false).done(undefined, errors.onUnexpectedError);
                    }
                    var configureAction = _this.instantiationService.createInstance(debugactions.ConfigureAction, debugactions.ConfigureAction.ID, debugactions.ConfigureAction.LABEL);
                    var actions = (error.actions && error.actions.length) ? error.actions.concat([configureAction]) : [message_1.CloseAction, configureAction];
                    _this.messageService.show(severity_1.default.Error, { message: errorMessage, actions: actions });
                    return undefined;
                });
            });
        };
        DebugService.prototype.runPreLaunchTask = function (taskName) {
            var _this = this;
            if (!taskName) {
                return winjs_base_1.TPromise.as(null);
            }
            // run a task before starting a debug session
            return this.taskService.getTask(taskName).then(function (task) {
                if (!task) {
                    return winjs_base_1.TPromise.wrapError(errors.create(nls.localize('DebugTaskNotFound', "Could not find the preLaunchTask \'{0}\'.", taskName)));
                }
                return _this.taskService.getActiveTasks().then(function (tasks) {
                    if (tasks.filter(function (t) { return t._id === task._id; }).length) {
                        // task is already running - nothing to do.
                        return winjs_base_1.TPromise.as(null);
                    }
                    var taskPromise = _this.taskService.run(task);
                    if (task.isBackground) {
                        return new winjs_base_1.TPromise(function (c, e) { return _this.taskService.addOneTimeListener(taskService_1.TaskServiceEvents.Inactive, function () { return c(null); }); });
                    }
                    return taskPromise;
                });
            });
        };
        DebugService.prototype.sourceIsNotAvailable = function (uri) {
            this.model.sourceIsNotAvailable(uri);
        };
        DebugService.prototype.restartProcess = function (process, restartData) {
            var _this = this;
            if (process.session.capabilities.supportsRestartRequest) {
                return this.textFileService.saveAll().then(function () { return process.session.custom('restart', null); });
            }
            var focusedProcess = this.viewModel.focusedProcess;
            var preserveFocus = focusedProcess && process.getId() === focusedProcess.getId();
            return process.session.disconnect(true).then(function () {
                if (strings.equalsIgnoreCase(process.configuration.type, 'extensionHost')) {
                    _this.broadcastService.broadcast({
                        channel: extensionHost_1.EXTENSION_RELOAD_BROADCAST_CHANNEL,
                        payload: [process.session.root.fsPath]
                    });
                }
                return new winjs_base_1.TPromise(function (c, e) {
                    setTimeout(function () {
                        // Read the configuration again if a launch.json has been changed, if not just use the inmemory configuration
                        var config = process.configuration;
                        if (_this.launchJsonChanged && _this.configurationManager.selectedLaunch) {
                            _this.launchJsonChanged = false;
                            config = _this.configurationManager.selectedLaunch.getConfiguration(process.configuration.name) || config;
                            // Take the type from the process since the debug extension might overwrite it #21316
                            config.type = process.configuration.type;
                            config.noDebug = process.configuration.noDebug;
                        }
                        config.__restart = restartData;
                        _this.createProcess(process.session.root, config).then(function () { return c(null); }, function (err) { return e(err); });
                    }, 300);
                });
            }).then(function () {
                if (preserveFocus) {
                    // Restart should preserve the focused process
                    var restartedProcess = _this.model.getProcesses().filter(function (p) { return p.configuration.name === process.configuration.name; }).pop();
                    if (restartedProcess && restartedProcess !== _this.viewModel.focusedProcess) {
                        _this.focusStackFrameAndEvaluate(null, restartedProcess);
                    }
                }
            });
        };
        DebugService.prototype.stopProcess = function (process) {
            if (process) {
                return process.session.disconnect(false, true);
            }
            var processes = this.model.getProcesses();
            if (processes.length) {
                return winjs_base_1.TPromise.join(processes.map(function (p) { return p.session.disconnect(false, true); }));
            }
            this.sessionStates.clear();
            this._onDidChangeState.fire();
            return undefined;
        };
        DebugService.prototype.onSessionEnd = function (session) {
            var bpsExist = this.model.getBreakpoints().length > 0;
            var process = this.model.getProcesses().filter(function (p) { return p.getId() === session.getId(); }).pop();
            this.telemetryService.publicLog('debugSessionStop', {
                type: process && process.configuration.type,
                success: session.emittedStopped || !bpsExist,
                sessionLengthInSeconds: session.getLengthInSeconds(),
                breakpointCount: this.model.getBreakpoints().length,
                watchExpressionsCount: this.model.getWatchExpressions().length
            });
            this.model.removeProcess(session.getId());
            if (process && process.state !== debug.ProcessState.INACTIVE) {
                this._onDidEndProcess.fire(process);
            }
            this.toDisposeOnSessionEnd.set(session.getId(), lifecycle.dispose(this.toDisposeOnSessionEnd.get(session.getId())));
            var focusedProcess = this.viewModel.focusedProcess;
            if (focusedProcess && focusedProcess.getId() === session.getId()) {
                this.focusStackFrameAndEvaluate(null).done(null, errors.onUnexpectedError);
            }
            this.updateStateAndEmit(session.getId(), debug.State.Inactive);
            if (this.model.getProcesses().length === 0) {
                // set breakpoints back to unverified since the session ended.
                var data_1 = {};
                this.model.getBreakpoints().forEach(function (bp) {
                    data_1[bp.getId()] = { line: bp.lineNumber, verified: false, column: bp.column, endLine: bp.endLineNumber, endColumn: bp.endColumn };
                });
                this.model.updateBreakpoints(data_1);
                this.inDebugMode.reset();
                this.debugType.reset();
                this.viewModel.setMultiProcessView(false);
                if (this.partService.isVisible(partService_1.Parts.SIDEBAR_PART) && this.configurationService.getConfiguration('debug').openExplorerOnEnd) {
                    this.viewletService.openViewlet(files_2.VIEWLET_ID).done(null, errors.onUnexpectedError);
                }
            }
        };
        DebugService.prototype.getModel = function () {
            return this.model;
        };
        DebugService.prototype.getViewModel = function () {
            return this.viewModel;
        };
        DebugService.prototype.getConfigurationManager = function () {
            return this.configurationManager;
        };
        DebugService.prototype.sendAllBreakpoints = function (process) {
            var _this = this;
            return winjs_base_1.TPromise.join(arrays_1.distinct(this.model.getBreakpoints(), function (bp) { return bp.uri.toString(); }).map(function (bp) { return _this.sendBreakpoints(bp.uri, false, process); }))
                .then(function () { return _this.sendFunctionBreakpoints(process); })
                .then(function () { return _this.sendExceptionBreakpoints(process); });
        };
        DebugService.prototype.sendBreakpoints = function (modelUri, sourceModified, targetProcess) {
            var _this = this;
            if (sourceModified === void 0) { sourceModified = false; }
            var sendBreakpointsToProcess = function (process) {
                var session = process.session;
                if (!session.readyForBreakpoints) {
                    return winjs_base_1.TPromise.as(null);
                }
                if (_this.textFileService.isDirty(modelUri)) {
                    // Only send breakpoints for a file once it is not dirty #8077
                    _this.breakpointsToSendOnResourceSaved.add(modelUri.toString());
                    return winjs_base_1.TPromise.as(null);
                }
                var breakpointsToSend = _this.model.getBreakpoints().filter(function (bp) { return _this.model.areBreakpointsActivated() && bp.enabled && bp.uri.toString() === modelUri.toString(); });
                var source = process.sources.get(modelUri.toString());
                var rawSource = source ? source.raw : { path: paths.normalize(modelUri.fsPath, true), name: paths.basename(modelUri.fsPath) };
                return session.setBreakpoints({
                    source: rawSource,
                    lines: breakpointsToSend.map(function (bp) { return bp.lineNumber; }),
                    breakpoints: breakpointsToSend.map(function (bp) { return ({ line: bp.lineNumber, column: bp.column, condition: bp.condition, hitCondition: bp.hitCondition }); }),
                    sourceModified: sourceModified
                }).then(function (response) {
                    if (!response || !response.body) {
                        return;
                    }
                    var data = {};
                    for (var i = 0; i < breakpointsToSend.length; i++) {
                        data[breakpointsToSend[i].getId()] = response.body.breakpoints[i];
                        if (!breakpointsToSend[i].column) {
                            // If there was no column sent ignore the breakpoint column response from the adapter
                            data[breakpointsToSend[i].getId()].column = undefined;
                        }
                    }
                    _this.model.updateBreakpoints(data);
                });
            };
            return this.sendToOneOrAllProcesses(targetProcess, sendBreakpointsToProcess);
        };
        DebugService.prototype.sendFunctionBreakpoints = function (targetProcess) {
            var _this = this;
            var sendFunctionBreakpointsToProcess = function (process) {
                var session = process.session;
                if (!session.readyForBreakpoints || !session.capabilities.supportsFunctionBreakpoints) {
                    return winjs_base_1.TPromise.as(null);
                }
                var breakpointsToSend = _this.model.getFunctionBreakpoints().filter(function (fbp) { return fbp.enabled && _this.model.areBreakpointsActivated(); });
                return session.setFunctionBreakpoints({ breakpoints: breakpointsToSend }).then(function (response) {
                    if (!response || !response.body) {
                        return;
                    }
                    var data = {};
                    for (var i = 0; i < breakpointsToSend.length; i++) {
                        data[breakpointsToSend[i].getId()] = response.body.breakpoints[i];
                    }
                    _this.model.updateFunctionBreakpoints(data);
                });
            };
            return this.sendToOneOrAllProcesses(targetProcess, sendFunctionBreakpointsToProcess);
        };
        DebugService.prototype.sendExceptionBreakpoints = function (targetProcess) {
            var _this = this;
            var sendExceptionBreakpointsToProcess = function (process) {
                var session = process.session;
                if (!session.readyForBreakpoints || _this.model.getExceptionBreakpoints().length === 0) {
                    return winjs_base_1.TPromise.as(null);
                }
                var enabledExceptionBps = _this.model.getExceptionBreakpoints().filter(function (exb) { return exb.enabled; });
                return session.setExceptionBreakpoints({ filters: enabledExceptionBps.map(function (exb) { return exb.filter; }) });
            };
            return this.sendToOneOrAllProcesses(targetProcess, sendExceptionBreakpointsToProcess);
        };
        DebugService.prototype.sendToOneOrAllProcesses = function (process, send) {
            if (process) {
                return send(process);
            }
            return winjs_base_1.TPromise.join(this.model.getProcesses().map(function (p) { return send(p); })).then(function () { return void 0; });
        };
        DebugService.prototype.onFileChanges = function (fileChangesEvent) {
            var _this = this;
            this.model.removeBreakpoints(this.model.getBreakpoints().filter(function (bp) {
                return fileChangesEvent.contains(bp.uri, files_1.FileChangeType.DELETED);
            }));
            fileChangesEvent.getUpdated().forEach(function (event) {
                if (_this.breakpointsToSendOnResourceSaved.has(event.resource.toString())) {
                    _this.breakpointsToSendOnResourceSaved.delete(event.resource.toString());
                    _this.sendBreakpoints(event.resource, true).done(null, errors.onUnexpectedError);
                }
                if (event.resource.toString().indexOf('.vscode/launch.json') >= 0) {
                    _this.launchJsonChanged = true;
                }
            });
        };
        DebugService.prototype.store = function () {
            var breakpoints = this.model.getBreakpoints();
            if (breakpoints.length) {
                this.storageService.store(DEBUG_BREAKPOINTS_KEY, JSON.stringify(breakpoints), storage_1.StorageScope.WORKSPACE);
            }
            else {
                this.storageService.remove(DEBUG_BREAKPOINTS_KEY, storage_1.StorageScope.WORKSPACE);
            }
            if (!this.model.areBreakpointsActivated()) {
                this.storageService.store(DEBUG_BREAKPOINTS_ACTIVATED_KEY, 'false', storage_1.StorageScope.WORKSPACE);
            }
            else {
                this.storageService.remove(DEBUG_BREAKPOINTS_ACTIVATED_KEY, storage_1.StorageScope.WORKSPACE);
            }
            var functionBreakpoints = this.model.getFunctionBreakpoints();
            if (functionBreakpoints.length) {
                this.storageService.store(DEBUG_FUNCTION_BREAKPOINTS_KEY, JSON.stringify(functionBreakpoints), storage_1.StorageScope.WORKSPACE);
            }
            else {
                this.storageService.remove(DEBUG_FUNCTION_BREAKPOINTS_KEY, storage_1.StorageScope.WORKSPACE);
            }
            var exceptionBreakpoints = this.model.getExceptionBreakpoints();
            if (exceptionBreakpoints.length) {
                this.storageService.store(DEBUG_EXCEPTION_BREAKPOINTS_KEY, JSON.stringify(exceptionBreakpoints), storage_1.StorageScope.WORKSPACE);
            }
            else {
                this.storageService.remove(DEBUG_EXCEPTION_BREAKPOINTS_KEY, storage_1.StorageScope.WORKSPACE);
            }
            var watchExpressions = this.model.getWatchExpressions();
            if (watchExpressions.length) {
                this.storageService.store(DEBUG_WATCH_EXPRESSIONS_KEY, JSON.stringify(watchExpressions.map(function (we) { return ({ name: we.name, id: we.getId() }); })), storage_1.StorageScope.WORKSPACE);
            }
            else {
                this.storageService.remove(DEBUG_WATCH_EXPRESSIONS_KEY, storage_1.StorageScope.WORKSPACE);
            }
        };
        DebugService.prototype.dispose = function () {
            this.toDisposeOnSessionEnd.forEach(function (toDispose) { return lifecycle.dispose(toDispose); });
            this.toDispose = lifecycle.dispose(this.toDispose);
        };
        DebugService = __decorate([
            __param(0, storage_1.IStorageService),
            __param(1, editorService_1.IWorkbenchEditorService),
            __param(2, textfiles_1.ITextFileService),
            __param(3, viewlet_1.IViewletService),
            __param(4, panelService_1.IPanelService),
            __param(5, message_1.IMessageService),
            __param(6, partService_1.IPartService),
            __param(7, windows_1.IWindowsService),
            __param(8, windows_1.IWindowService),
            __param(9, broadcastService_1.IBroadcastService),
            __param(10, telemetry_1.ITelemetryService),
            __param(11, workspace_1.IWorkspaceContextService),
            __param(12, contextkey_1.IContextKeyService),
            __param(13, lifecycle_1.ILifecycleService),
            __param(14, instantiation_1.IInstantiationService),
            __param(15, extensions_1.IExtensionService),
            __param(16, markers_1.IMarkerService),
            __param(17, taskService_1.ITaskService),
            __param(18, files_1.IFileService),
            __param(19, configuration_1.IConfigurationService),
            __param(20, commands_1.ICommandService)
        ], DebugService);
        return DebugService;
    }());
    exports.DebugService = DebugService;
});
//# sourceMappingURL=debugService.js.map