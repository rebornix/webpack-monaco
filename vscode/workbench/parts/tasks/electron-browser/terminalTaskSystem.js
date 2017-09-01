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
define(["require", "exports", "fs", "path", "vs/nls", "vs/base/common/objects", "vs/base/common/types", "vs/base/common/platform", "vs/base/common/async", "vs/base/common/winjs.base", "vs/base/common/map", "vs/base/common/severity", "vs/base/common/eventEmitter", "vs/base/common/lifecycle", "vs/base/common/paths", "vs/platform/markers/common/problemMatcher", "vs/workbench/parts/tasks/common/problemCollectors", "vs/workbench/parts/tasks/common/tasks", "vs/workbench/parts/tasks/common/taskSystem"], function (require, exports, fs, path, nls, Objects, Types, Platform, Async, winjs_base_1, map_1, severity_1, eventEmitter_1, lifecycle_1, TPath, problemMatcher_1, problemCollectors_1, tasks_1, taskSystem_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var TerminalDecoder = (function () {
        function TerminalDecoder() {
        }
        TerminalDecoder.prototype.write = function (data) {
            var result = [];
            data = data.replace(TerminalDecoder.ANSI_CONTROL_SEQUENCE, '');
            data = data.replace(TerminalDecoder.OPERATING_SYSTEM_COMMAND_SEQUENCE, '');
            var value = this.remaining
                ? this.remaining + data
                : data;
            if (value.length < 1) {
                return result;
            }
            var start = 0;
            var ch;
            while (start < value.length && ((ch = value.charCodeAt(start)) === 13 /* CarriageReturn */ || ch === 10 /* LineFeed */)) {
                start++;
            }
            var idx = start;
            while (idx < value.length) {
                ch = value.charCodeAt(idx);
                if (ch === 13 /* CarriageReturn */ || ch === 10 /* LineFeed */) {
                    result.push(value.substring(start, idx));
                    idx++;
                    while (idx < value.length && ((ch = value.charCodeAt(idx)) === 13 /* CarriageReturn */ || ch === 10 /* LineFeed */)) {
                        idx++;
                    }
                    start = idx;
                }
                else {
                    idx++;
                }
            }
            this.remaining = start < value.length ? value.substr(start) : undefined;
            return result;
        };
        TerminalDecoder.prototype.end = function () {
            return this.remaining;
        };
        // See https://en.wikipedia.org/wiki/ANSI_escape_code & http://stackoverflow.com/questions/25189651/how-to-remove-ansi-control-chars-vt100-from-a-java-string &
        // https://www.npmjs.com/package/strip-ansi
        TerminalDecoder.ANSI_CONTROL_SEQUENCE = /\x1b[[()#;?]*(?:\d{1,4}(?:;\d{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
        TerminalDecoder.OPERATING_SYSTEM_COMMAND_SEQUENCE = /\x1b[\]](?:.*)(?:\x07|\x1b\\)/g;
        return TerminalDecoder;
    }());
    var TerminalTaskSystem = (function (_super) {
        __extends(TerminalTaskSystem, _super);
        function TerminalTaskSystem(terminalService, outputService, markerService, modelService, configurationResolverService, telemetryService, workbenchEditorService, contextService, outputChannelId) {
            var _this = _super.call(this) || this;
            _this.terminalService = terminalService;
            _this.outputService = outputService;
            _this.markerService = markerService;
            _this.modelService = modelService;
            _this.configurationResolverService = configurationResolverService;
            _this.telemetryService = telemetryService;
            _this.workbenchEditorService = workbenchEditorService;
            _this.contextService = contextService;
            _this.outputChannel = _this.outputService.getChannel(outputChannelId);
            _this.activeTasks = Object.create(null);
            _this.terminals = Object.create(null);
            _this.idleTaskTerminals = new map_1.LinkedMap();
            _this.sameTaskTerminals = Object.create(null);
            return _this;
        }
        TerminalTaskSystem.prototype.log = function (value) {
            this.outputChannel.append(value + '\n');
        };
        TerminalTaskSystem.prototype.showOutput = function () {
            this.outputChannel.show(true);
        };
        TerminalTaskSystem.prototype.run = function (task, resolver, trigger) {
            if (trigger === void 0) { trigger = taskSystem_1.Triggers.command; }
            var terminalData = this.activeTasks[task._id];
            if (terminalData && terminalData.promise) {
                var reveal = tasks_1.RevealKind.Always;
                var focus_1 = false;
                if (tasks_1.CustomTask.is(task) || tasks_1.ContributedTask.is(task)) {
                    reveal = task.command.presentation.reveal;
                    focus_1 = task.command.presentation.focus;
                }
                if (reveal === tasks_1.RevealKind.Always || focus_1) {
                    this.terminalService.setActiveInstance(terminalData.terminal);
                    this.terminalService.showPanel(focus_1);
                }
                return { kind: taskSystem_1.TaskExecuteKind.Active, active: { same: true, background: task.isBackground }, promise: terminalData.promise };
            }
            try {
                return { kind: taskSystem_1.TaskExecuteKind.Started, started: {}, promise: this.executeTask(Object.create(null), task, resolver, trigger) };
            }
            catch (error) {
                if (error instanceof taskSystem_1.TaskError) {
                    throw error;
                }
                else if (error instanceof Error) {
                    this.log(error.message);
                    throw new taskSystem_1.TaskError(severity_1.default.Error, error.message, taskSystem_1.TaskErrors.UnknownError);
                }
                else {
                    this.log(error.toString());
                    throw new taskSystem_1.TaskError(severity_1.default.Error, nls.localize('TerminalTaskSystem.unknownError', 'A unknown error has occurred while executing a task. See task output log for details.'), taskSystem_1.TaskErrors.UnknownError);
                }
            }
        };
        TerminalTaskSystem.prototype.revealTask = function (task) {
            var terminalData = this.activeTasks[task._id];
            if (!terminalData) {
                return false;
            }
            this.terminalService.setActiveInstance(terminalData.terminal);
            if (tasks_1.CustomTask.is(task) || tasks_1.ContributedTask.is(task)) {
                this.terminalService.showPanel(task.command.presentation.focus);
            }
            return true;
        };
        TerminalTaskSystem.prototype.isActive = function () {
            return winjs_base_1.TPromise.as(this.isActiveSync());
        };
        TerminalTaskSystem.prototype.isActiveSync = function () {
            return Object.keys(this.activeTasks).length > 0;
        };
        TerminalTaskSystem.prototype.canAutoTerminate = function () {
            var _this = this;
            return Object.keys(this.activeTasks).every(function (key) { return !_this.activeTasks[key].task.promptOnClose; });
        };
        TerminalTaskSystem.prototype.getActiveTasks = function () {
            var _this = this;
            return Object.keys(this.activeTasks).map(function (key) { return _this.activeTasks[key].task; });
        };
        TerminalTaskSystem.prototype.terminate = function (id) {
            var _this = this;
            var activeTerminal = this.activeTasks[id];
            if (!activeTerminal) {
                return winjs_base_1.TPromise.as({ success: false, task: undefined });
            }
            ;
            return new winjs_base_1.TPromise(function (resolve, reject) {
                var terminal = activeTerminal.terminal;
                var onExit = terminal.onExit(function () {
                    var task = activeTerminal.task;
                    try {
                        onExit.dispose();
                        var event_1 = { taskId: task._id, taskName: task.name, type: taskSystem_1.TaskType.SingleRun, group: task.group, __task: task };
                        _this.emit(taskSystem_1.TaskSystemEvents.Terminated, event_1);
                    }
                    catch (error) {
                        // Do nothing.
                    }
                    resolve({ success: true, task: task });
                });
                terminal.dispose();
            });
        };
        TerminalTaskSystem.prototype.terminateAll = function () {
            var _this = this;
            var promises = [];
            Object.keys(this.activeTasks).forEach(function (key) {
                var terminalData = _this.activeTasks[key];
                var terminal = terminalData.terminal;
                promises.push(new winjs_base_1.TPromise(function (resolve, reject) {
                    var onExit = terminal.onExit(function () {
                        var task = terminalData.task;
                        try {
                            onExit.dispose();
                            var event_2 = { taskId: task._id, taskName: task.name, type: taskSystem_1.TaskType.SingleRun, group: task.group, __task: task };
                            _this.emit(taskSystem_1.TaskSystemEvents.Terminated, event_2);
                        }
                        catch (error) {
                            // Do nothing.
                        }
                        resolve({ success: true, task: terminalData.task });
                    });
                }));
                terminal.dispose();
            });
            this.activeTasks = Object.create(null);
            return winjs_base_1.TPromise.join(promises);
        };
        TerminalTaskSystem.prototype.executeTask = function (startedTasks, task, resolver, trigger) {
            var _this = this;
            var promises = [];
            if (task.dependsOn) {
                task.dependsOn.forEach(function (identifier) {
                    var task = resolver.resolve(identifier);
                    if (task) {
                        var promise = startedTasks[task._id];
                        if (!promise) {
                            promise = _this.executeTask(startedTasks, task, resolver, trigger);
                            startedTasks[task._id] = promise;
                        }
                        promises.push(promise);
                    }
                });
            }
            if (tasks_1.ContributedTask.is(task) || tasks_1.CustomTask.is(task)) {
                return winjs_base_1.TPromise.join(promises).then(function (summaries) {
                    for (var _i = 0, summaries_1 = summaries; _i < summaries_1.length; _i++) {
                        var summary = summaries_1[_i];
                        if (summary.exitCode !== 0) {
                            return { exitCode: summary.exitCode };
                        }
                    }
                    return _this.executeCommand(task, trigger);
                });
            }
            else {
                return winjs_base_1.TPromise.join(promises).then(function (summaries) {
                    for (var _i = 0, summaries_2 = summaries; _i < summaries_2.length; _i++) {
                        var summary = summaries_2[_i];
                        if (summary.exitCode !== 0) {
                            return { exitCode: summary.exitCode };
                        }
                    }
                    return { exitCode: 0 };
                });
            }
        };
        TerminalTaskSystem.prototype.executeCommand = function (task, trigger) {
            var _this = this;
            var terminal = undefined;
            var executedCommand = undefined;
            var promise = undefined;
            if (task.isBackground) {
                promise = new winjs_base_1.TPromise(function (resolve, reject) {
                    var problemMatchers = _this.resolveMatchers(task.problemMatchers);
                    var watchingProblemMatcher = new problemCollectors_1.WatchingProblemCollector(problemMatchers, _this.markerService, _this.modelService);
                    var toUnbind = [];
                    var event = { taskId: task._id, taskName: task.name, type: taskSystem_1.TaskType.Watching, group: task.group, __task: task };
                    var eventCounter = 0;
                    toUnbind.push(watchingProblemMatcher.addListener(problemCollectors_1.ProblemCollectorEvents.WatchingBeginDetected, function () {
                        eventCounter++;
                        _this.emit(taskSystem_1.TaskSystemEvents.Active, event);
                    }));
                    toUnbind.push(watchingProblemMatcher.addListener(problemCollectors_1.ProblemCollectorEvents.WatchingEndDetected, function () {
                        eventCounter--;
                        _this.emit(taskSystem_1.TaskSystemEvents.Inactive, event);
                    }));
                    watchingProblemMatcher.aboutToStart();
                    var delayer = null;
                    var decoder = new TerminalDecoder();
                    _a = _this.createTerminal(task), terminal = _a[0], executedCommand = _a[1];
                    var registeredLinkMatchers = _this.registerLinkMatchers(terminal, problemMatchers);
                    var onData = terminal.onData(function (data) {
                        decoder.write(data).forEach(function (line) {
                            watchingProblemMatcher.processLine(line);
                            if (delayer === null) {
                                delayer = new Async.Delayer(3000);
                            }
                            delayer.trigger(function () {
                                watchingProblemMatcher.forceDelivery();
                                delayer = null;
                            });
                        });
                    });
                    var onExit = terminal.onExit(function (exitCode) {
                        onData.dispose();
                        onExit.dispose();
                        delete _this.activeTasks[task._id];
                        _this.emit(taskSystem_1.TaskSystemEvents.Changed);
                        switch (task.command.presentation.panel) {
                            case tasks_1.PanelKind.Dedicated:
                                _this.sameTaskTerminals[task._id] = terminal.id.toString();
                                break;
                            case tasks_1.PanelKind.Shared:
                                _this.idleTaskTerminals.set(task._id, terminal.id.toString(), map_1.Touch.First);
                                break;
                        }
                        var remaining = decoder.end();
                        if (remaining) {
                            watchingProblemMatcher.processLine(remaining);
                        }
                        watchingProblemMatcher.dispose();
                        registeredLinkMatchers.forEach(function (handle) { return terminal.deregisterLinkMatcher(handle); });
                        toUnbind = lifecycle_1.dispose(toUnbind);
                        toUnbind = null;
                        for (var i = 0; i < eventCounter; i++) {
                            _this.emit(taskSystem_1.TaskSystemEvents.Inactive, event);
                        }
                        eventCounter = 0;
                        var reveal = task.command.presentation.reveal;
                        if (exitCode && exitCode === 1 && watchingProblemMatcher.numberOfMatches === 0 && reveal !== tasks_1.RevealKind.Never) {
                            _this.terminalService.setActiveInstance(terminal);
                            _this.terminalService.showPanel(false);
                        }
                        resolve({ exitCode: exitCode });
                    });
                    var _a;
                });
            }
            else {
                promise = new winjs_base_1.TPromise(function (resolve, reject) {
                    _a = _this.createTerminal(task), terminal = _a[0], executedCommand = _a[1];
                    var event = { taskId: task._id, taskName: task.name, type: taskSystem_1.TaskType.SingleRun, group: task.group, __task: task };
                    _this.emit(taskSystem_1.TaskSystemEvents.Active, event);
                    var decoder = new TerminalDecoder();
                    var problemMatchers = _this.resolveMatchers(task.problemMatchers);
                    var startStopProblemMatcher = new problemCollectors_1.StartStopProblemCollector(problemMatchers, _this.markerService, _this.modelService);
                    var registeredLinkMatchers = _this.registerLinkMatchers(terminal, problemMatchers);
                    var onData = terminal.onData(function (data) {
                        decoder.write(data).forEach(function (line) {
                            startStopProblemMatcher.processLine(line);
                        });
                    });
                    var onExit = terminal.onExit(function (exitCode) {
                        onData.dispose();
                        onExit.dispose();
                        delete _this.activeTasks[task._id];
                        _this.emit(taskSystem_1.TaskSystemEvents.Changed);
                        switch (task.command.presentation.panel) {
                            case tasks_1.PanelKind.Dedicated:
                                _this.sameTaskTerminals[task._id] = terminal.id.toString();
                                break;
                            case tasks_1.PanelKind.Shared:
                                _this.idleTaskTerminals.set(task._id, terminal.id.toString(), map_1.Touch.First);
                                break;
                        }
                        var remaining = decoder.end();
                        if (remaining) {
                            startStopProblemMatcher.processLine(remaining);
                        }
                        startStopProblemMatcher.done();
                        startStopProblemMatcher.dispose();
                        registeredLinkMatchers.forEach(function (handle) { return terminal.deregisterLinkMatcher(handle); });
                        _this.emit(taskSystem_1.TaskSystemEvents.Inactive, event);
                        // See https://github.com/Microsoft/vscode/issues/31965
                        if (exitCode === 0 && startStopProblemMatcher.numberOfMatches > 0) {
                            exitCode = 1;
                        }
                        resolve({ exitCode: exitCode });
                    });
                    var _a;
                });
            }
            this.terminalService.setActiveInstance(terminal);
            if (task.command.presentation.reveal === tasks_1.RevealKind.Always || (task.command.presentation.reveal === tasks_1.RevealKind.Silent && task.problemMatchers.length === 0)) {
                this.terminalService.showPanel(task.command.presentation.focus);
            }
            this.activeTasks[task._id] = { terminal: terminal, task: task, promise: promise };
            this.emit(taskSystem_1.TaskSystemEvents.Changed);
            return promise.then(function (summary) {
                try {
                    var telemetryEvent = {
                        trigger: trigger,
                        runner: 'terminal',
                        taskKind: tasks_1.Task.getTelemetryKind(task),
                        command: _this.getSanitizedCommand(executedCommand),
                        success: true,
                        exitCode: summary.exitCode
                    };
                    _this.telemetryService.publicLog(TerminalTaskSystem.TelemetryEventName, telemetryEvent);
                }
                catch (error) {
                }
                return summary;
            }, function (error) {
                try {
                    var telemetryEvent = {
                        trigger: trigger,
                        runner: 'terminal',
                        taskKind: tasks_1.Task.getTelemetryKind(task),
                        command: _this.getSanitizedCommand(executedCommand),
                        success: false
                    };
                    _this.telemetryService.publicLog(TerminalTaskSystem.TelemetryEventName, telemetryEvent);
                }
                catch (error) {
                }
                return winjs_base_1.TPromise.wrapError(error);
            });
        };
        TerminalTaskSystem.prototype.createTerminal = function (task) {
            var _this = this;
            var options = this.resolveOptions(task.command.options);
            var _a = this.resolveCommandAndArgs(task), command = _a.command, args = _a.args;
            var terminalName = nls.localize('TerminalTaskSystem.terminalName', 'Task - {0}', task.name);
            var waitOnExit = false;
            if (task.command.presentation.reveal !== tasks_1.RevealKind.Never || !task.isBackground) {
                waitOnExit = nls.localize('reuseTerminal', 'Terminal will be reused by tasks, press any key to close it.');
            }
            ;
            var shellLaunchConfig = undefined;
            var isShellCommand = task.command.runtime === tasks_1.RuntimeType.Shell;
            if (isShellCommand) {
                if (Platform.isWindows && ((options.cwd && TPath.isUNC(options.cwd)) || (!options.cwd && TPath.isUNC(process.cwd())))) {
                    throw new taskSystem_1.TaskError(severity_1.default.Error, nls.localize('TerminalTaskSystem', 'Can\'t execute a shell command on an UNC drive.'), taskSystem_1.TaskErrors.UnknownError);
                }
                shellLaunchConfig = { name: terminalName, executable: null, args: null, waitOnExit: waitOnExit };
                var shellSpecified = false;
                var shellOptions = task.command.options && task.command.options.shell;
                if (shellOptions && shellOptions.executable) {
                    shellLaunchConfig.executable = shellOptions.executable;
                    shellSpecified = true;
                    if (shellOptions.args) {
                        shellLaunchConfig.args = shellOptions.args.slice();
                    }
                    else {
                        shellLaunchConfig.args = [];
                    }
                }
                else {
                    this.terminalService.configHelper.mergeDefaultShellPathAndArgs(shellLaunchConfig);
                }
                var shellArgs_1 = shellLaunchConfig.args.slice(0);
                var toAdd = [];
                var commandLine = args && args.length > 0 ? command + " " + args.join(' ') : "" + command;
                var windowsShellArgs = false;
                if (Platform.isWindows) {
                    windowsShellArgs = true;
                    var basename = path.basename(shellLaunchConfig.executable).toLowerCase();
                    if (basename === 'powershell.exe') {
                        if (!shellSpecified) {
                            toAdd.push('-Command');
                        }
                    }
                    else if (basename === 'bash.exe') {
                        windowsShellArgs = false;
                        if (!shellSpecified) {
                            toAdd.push('-c');
                        }
                    }
                    else {
                        if (!shellSpecified) {
                            toAdd.push('/d', '/c');
                        }
                    }
                }
                else {
                    if (!shellSpecified) {
                        toAdd.push('-c');
                    }
                }
                toAdd.forEach(function (element) {
                    if (!shellArgs_1.some(function (arg) { return arg.toLowerCase() === element; })) {
                        shellArgs_1.push(element);
                    }
                });
                shellArgs_1.push(commandLine);
                shellLaunchConfig.args = windowsShellArgs ? shellArgs_1.join(' ') : shellArgs_1;
                if (task.command.presentation.echo) {
                    shellLaunchConfig.initialText = "\u001B[1m> Executing task: " + commandLine + " <\u001B[0m\n";
                }
            }
            else {
                var cwd = options && options.cwd ? options.cwd : process.cwd();
                // On Windows executed process must be described absolute. Since we allowed command without an
                // absolute path (e.g. "command": "node") we need to find the executable in the CWD or PATH.
                var executable = Platform.isWindows && !isShellCommand ? this.findExecutable(command, cwd) : command;
                shellLaunchConfig = {
                    name: terminalName,
                    executable: executable,
                    args: args,
                    waitOnExit: waitOnExit
                };
                if (task.command.presentation.echo) {
                    var getArgsToEcho = function (args) {
                        if (!args || args.length === 0) {
                            return '';
                        }
                        if (Types.isString(args)) {
                            return args;
                        }
                        return args.join(' ');
                    };
                    shellLaunchConfig.initialText = "\u001B[1m> Executing task: " + shellLaunchConfig.executable + " " + getArgsToEcho(shellLaunchConfig.args) + " <\u001B[0m\n";
                }
            }
            if (options.cwd) {
                shellLaunchConfig.cwd = options.cwd;
            }
            if (options.env) {
                var env_1 = Object.create(null);
                Object.keys(process.env).forEach(function (key) {
                    env_1[key] = process.env[key];
                });
                Object.keys(options.env).forEach(function (key) {
                    env_1[key] = options.env[key];
                });
                shellLaunchConfig.env = env_1;
            }
            var prefersSameTerminal = task.command.presentation.panel === tasks_1.PanelKind.Dedicated;
            var allowsSharedTerminal = task.command.presentation.panel === tasks_1.PanelKind.Shared;
            var terminalToReuse;
            if (prefersSameTerminal) {
                var terminalId = this.sameTaskTerminals[task._id];
                if (terminalId) {
                    terminalToReuse = this.terminals[terminalId];
                    delete this.sameTaskTerminals[task._id];
                }
            }
            else if (allowsSharedTerminal) {
                var terminalId = this.idleTaskTerminals.remove(task._id) || this.idleTaskTerminals.shift();
                if (terminalId) {
                    terminalToReuse = this.terminals[terminalId];
                }
            }
            if (terminalToReuse) {
                terminalToReuse.terminal.reuseTerminal(shellLaunchConfig);
                return [terminalToReuse.terminal, command];
            }
            var result = this.terminalService.createInstance(shellLaunchConfig);
            var key = result.id.toString();
            result.onDisposed(function (terminal) {
                var terminalData = _this.terminals[key];
                if (terminalData) {
                    delete _this.terminals[key];
                    delete _this.sameTaskTerminals[terminalData.lastTask];
                    _this.idleTaskTerminals.delete(terminalData.lastTask);
                }
            });
            this.terminals[key] = { terminal: result, lastTask: task._id };
            return [result, command];
        };
        TerminalTaskSystem.prototype.resolveCommandAndArgs = function (task) {
            // First we need to use the command args:
            var args = task.command.args ? task.command.args.slice() : [];
            args = this.resolveVariables(args);
            var command = this.resolveVariable(task.command.name);
            return { command: command, args: args };
        };
        TerminalTaskSystem.prototype.findExecutable = function (command, cwd) {
            // If we have an absolute path then we take it.
            if (path.isAbsolute(command)) {
                return command;
            }
            var dir = path.dirname(command);
            if (dir !== '.') {
                // We have a directory. So leave the command as is.
                return command;
            }
            // We have a simple file name. We get the path variable from the env
            // and try to find the executable on the path.
            if (!process.env.PATH) {
                return command;
            }
            var paths = process.env.PATH.split(path.delimiter);
            for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
                var pathEntry = paths_1[_i];
                // The path entry is absolute.
                var fullPath = void 0;
                if (path.isAbsolute(pathEntry)) {
                    fullPath = path.join(pathEntry, command);
                }
                else {
                    fullPath = path.join(cwd, pathEntry, command);
                }
                if (fs.existsSync(fullPath)) {
                    return fullPath;
                }
                var withExtension = fullPath + '.com';
                if (fs.existsSync(withExtension)) {
                    return withExtension;
                }
                withExtension = fullPath + '.exe';
                if (fs.existsSync(withExtension)) {
                    return withExtension;
                }
            }
            return command;
        };
        TerminalTaskSystem.prototype.resolveVariables = function (value) {
            var _this = this;
            return value.map(function (s) { return _this.resolveVariable(s); });
        };
        TerminalTaskSystem.prototype.resolveMatchers = function (values) {
            var _this = this;
            if (values === void 0 || values === null || values.length === 0) {
                return [];
            }
            var result = [];
            values.forEach(function (value) {
                var matcher;
                if (Types.isString(value)) {
                    if (value[0] === '$') {
                        matcher = problemMatcher_1.ProblemMatcherRegistry.get(value.substring(1));
                    }
                    else {
                        matcher = problemMatcher_1.ProblemMatcherRegistry.get(value);
                    }
                }
                else {
                    matcher = value;
                }
                if (!matcher) {
                    _this.outputChannel.append(nls.localize('unkownProblemMatcher', 'Problem matcher {0} can\'t be resolved. The matcher will be ignored'));
                    return;
                }
                if (!matcher.filePrefix) {
                    result.push(matcher);
                }
                else {
                    var copy = Objects.clone(matcher);
                    copy.filePrefix = _this.resolveVariable(copy.filePrefix);
                    result.push(copy);
                }
            });
            return result;
        };
        TerminalTaskSystem.prototype.resolveVariable = function (value) {
            // TODO@Dirk adopt new configuration resolver service https://github.com/Microsoft/vscode/issues/31365
            return this.configurationResolverService.resolve(this.contextService.getLegacyWorkspace().resource, value);
        };
        TerminalTaskSystem.prototype.resolveOptions = function (options) {
            var _this = this;
            if (options === void 0 || options === null) {
                return { cwd: this.resolveVariable('${cwd}') };
            }
            var result = Types.isString(options.cwd)
                ? { cwd: this.resolveVariable(options.cwd) }
                : { cwd: this.resolveVariable('${cwd}') };
            if (options.env) {
                result.env = Object.create(null);
                Object.keys(options.env).forEach(function (key) {
                    var value = options.env[key];
                    if (Types.isString(value)) {
                        result.env[key] = _this.resolveVariable(value);
                    }
                    else {
                        result.env[key] = value.toString();
                    }
                });
            }
            return result;
        };
        TerminalTaskSystem.prototype.registerLinkMatchers = function (terminal, problemMatchers) {
            var result = [];
            /*
            let handlePattern = (matcher: ProblemMatcher, pattern: ProblemPattern): void => {
                if (pattern.regexp instanceof RegExp && Types.isNumber(pattern.file)) {
                    result.push(terminal.registerLinkMatcher(pattern.regexp, (match: string) => {
                        let resource: URI = getResource(match, matcher);
                        if (resource) {
                            this.workbenchEditorService.openEditor({
                                resource: resource
                            });
                        }
                    }, 0));
                }
            };
    
            for (let problemMatcher of problemMatchers) {
                if (Array.isArray(problemMatcher.pattern)) {
                    for (let pattern of problemMatcher.pattern) {
                        handlePattern(problemMatcher, pattern);
                    }
                } else if (problemMatcher.pattern) {
                    handlePattern(problemMatcher, problemMatcher.pattern);
                }
            }
            */
            return result;
        };
        TerminalTaskSystem.prototype.ensureDoubleQuotes = function (value) {
            if (TerminalTaskSystem.doubleQuotes.test(value)) {
                return {
                    value: '"' + value + '"',
                    quoted: true
                };
            }
            else {
                return {
                    value: value,
                    quoted: value.length > 0 && value[0] === '"' && value[value.length - 1] === '"'
                };
            }
        };
        TerminalTaskSystem.prototype.getSanitizedCommand = function (cmd) {
            var result = cmd.toLowerCase();
            var index = result.lastIndexOf(path.sep);
            if (index !== -1) {
                result = result.substring(index + 1);
            }
            if (TerminalTaskSystem.WellKnowCommands[result]) {
                return result;
            }
            return 'other';
        };
        TerminalTaskSystem.TelemetryEventName = 'taskService';
        TerminalTaskSystem.doubleQuotes = /^[^"].* .*[^"]$/;
        TerminalTaskSystem.WellKnowCommands = {
            'ant': true,
            'cmake': true,
            'eslint': true,
            'gradle': true,
            'grunt': true,
            'gulp': true,
            'jake': true,
            'jenkins': true,
            'jshint': true,
            'make': true,
            'maven': true,
            'msbuild': true,
            'msc': true,
            'nmake': true,
            'npm': true,
            'rake': true,
            'tsc': true,
            'xbuild': true
        };
        return TerminalTaskSystem;
    }(eventEmitter_1.EventEmitter));
    exports.TerminalTaskSystem = TerminalTaskSystem;
});
//# sourceMappingURL=terminalTaskSystem.js.map