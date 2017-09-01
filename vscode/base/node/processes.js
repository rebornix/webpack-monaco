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
define(["require", "exports", "path", "child_process", "stream", "vs/base/node/stdFork", "vs/nls", "vs/base/common/winjs.base", "vs/base/common/types", "vs/base/common/uri", "vs/base/common/objects", "vs/base/common/paths", "vs/base/common/platform", "vs/base/node/decoder", "vs/base/common/processes"], function (require, exports, path, cp, stream_1, stdFork_1, nls, winjs_base_1, Types, uri_1, Objects, TPath, Platform, decoder_1, processes_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var exec = cp.exec;
    var spawn = cp.spawn;
    exports.Source = processes_1.Source;
    exports.TerminateResponseCode = processes_1.TerminateResponseCode;
    function getWindowsCode(status) {
        switch (status) {
            case 0:
                return processes_1.TerminateResponseCode.Success;
            case 1:
                return processes_1.TerminateResponseCode.AccessDenied;
            case 128:
                return processes_1.TerminateResponseCode.ProcessNotFound;
            default:
                return processes_1.TerminateResponseCode.Unknown;
        }
    }
    function terminateProcess(process, cwd) {
        if (Platform.isWindows) {
            try {
                var options = {
                    stdio: ['pipe', 'pipe', 'ignore']
                };
                if (cwd) {
                    options.cwd = cwd;
                }
                cp.execFileSync('taskkill', ['/T', '/F', '/PID', process.pid.toString()], options);
            }
            catch (err) {
                return { success: false, error: err, code: err.status ? getWindowsCode(err.status) : processes_1.TerminateResponseCode.Unknown };
            }
        }
        else if (Platform.isLinux || Platform.isMacintosh) {
            try {
                var cmd = uri_1.default.parse(require.toUrl('vs/base/node/terminateProcess.sh')).fsPath;
                var result = cp.spawnSync(cmd, [process.pid.toString()]);
                if (result.error) {
                    return { success: false, error: result.error };
                }
            }
            catch (err) {
                return { success: false, error: err };
            }
        }
        else {
            process.kill('SIGKILL');
        }
        return { success: true };
    }
    exports.terminateProcess = terminateProcess;
    function getWindowsShell() {
        return process.env['comspec'] || 'cmd.exe';
    }
    exports.getWindowsShell = getWindowsShell;
    var AbstractProcess = (function () {
        function AbstractProcess(arg1, arg2, arg3, arg4) {
            var _this = this;
            if (arg4) {
                this.cmd = arg1;
                this.args = arg2;
                this.shell = arg3;
                this.options = arg4;
            }
            else if (arg3 && arg2) {
                this.module = arg1;
                this.args = arg2;
                this.shell = false;
                this.options = arg3;
            }
            else {
                var executable = arg1;
                this.cmd = executable.command;
                this.shell = executable.isShellCommand;
                this.args = executable.args.slice(0);
                this.options = executable.options || {};
            }
            this.childProcess = null;
            this.terminateRequested = false;
            if (this.options.env) {
                var newEnv_1 = Object.create(null);
                Object.keys(process.env).forEach(function (key) {
                    newEnv_1[key] = process.env[key];
                });
                Object.keys(this.options.env).forEach(function (key) {
                    newEnv_1[key] = _this.options.env[key];
                });
                this.options.env = newEnv_1;
            }
        }
        AbstractProcess.prototype.getSanitizedCommand = function () {
            var result = this.cmd.toLowerCase();
            var index = result.lastIndexOf(path.sep);
            if (index !== -1) {
                result = result.substring(index + 1);
            }
            if (AbstractProcess.WellKnowCommands[result]) {
                return result;
            }
            return 'other';
        };
        AbstractProcess.prototype.start = function () {
            var _this = this;
            if (Platform.isWindows && ((this.options && this.options.cwd && TPath.isUNC(this.options.cwd)) || !this.options && !this.options.cwd && TPath.isUNC(process.cwd()))) {
                return winjs_base_1.TPromise.wrapError(new Error(nls.localize('TaskRunner.UNC', 'Can\'t execute a shell command on an UNC drive.')));
            }
            return this.useExec().then(function (useExec) {
                var cc;
                var ee;
                var pp;
                var result = new winjs_base_1.PPromise(function (c, e, p) {
                    cc = c;
                    ee = e;
                    pp = p;
                });
                if (useExec) {
                    var cmd = _this.cmd;
                    if (_this.args) {
                        cmd = cmd + ' ' + _this.args.join(' ');
                    }
                    _this.childProcess = exec(cmd, _this.options, function (error, stdout, stderr) {
                        _this.childProcess = null;
                        var err = error;
                        // This is tricky since executing a command shell reports error back in case the executed command return an
                        // error or the command didn't exist at all. So we can't blindly treat an error as a failed command. So we
                        // always parse the output and report success unless the job got killed.
                        if (err && err.killed) {
                            ee({ killed: _this.terminateRequested, stdout: stdout.toString(), stderr: stderr.toString() });
                        }
                        else {
                            _this.handleExec(cc, pp, error, stdout, stderr);
                        }
                    });
                }
                else {
                    var childProcess = null;
                    var closeHandler_1 = function (data) {
                        _this.childProcess = null;
                        _this.childProcessPromise = null;
                        _this.handleClose(data, cc, pp, ee);
                        var result = {
                            terminated: _this.terminateRequested
                        };
                        if (Types.isNumber(data)) {
                            result.cmdCode = data;
                        }
                        cc(result);
                    };
                    if (_this.shell && Platform.isWindows) {
                        var options = Objects.clone(_this.options);
                        options.windowsVerbatimArguments = true;
                        options.detached = false;
                        var quotedCommand = false;
                        var quotedArg_1 = false;
                        var commandLine_1 = [];
                        var quoted_1 = _this.ensureQuotes(_this.cmd);
                        commandLine_1.push(quoted_1.value);
                        quotedCommand = quoted_1.quoted;
                        if (_this.args) {
                            _this.args.forEach(function (elem) {
                                quoted_1 = _this.ensureQuotes(elem);
                                commandLine_1.push(quoted_1.value);
                                quotedArg_1 = quotedArg_1 && quoted_1.quoted;
                            });
                        }
                        var args = [
                            '/s',
                            '/c',
                        ];
                        if (quotedCommand) {
                            if (quotedArg_1) {
                                args.push('"' + commandLine_1.join(' ') + '"');
                            }
                            else if (commandLine_1.length > 1) {
                                args.push('"' + commandLine_1[0] + '"' + ' ' + commandLine_1.slice(1).join(' '));
                            }
                            else {
                                args.push('"' + commandLine_1[0] + '"');
                            }
                        }
                        else {
                            args.push(commandLine_1.join(' '));
                        }
                        childProcess = spawn(getWindowsShell(), args, options);
                    }
                    else {
                        if (_this.cmd) {
                            childProcess = spawn(_this.cmd, _this.args, _this.options);
                        }
                        else if (_this.module) {
                            _this.childProcessPromise = new winjs_base_1.TPromise(function (c, e, p) {
                                stdFork_1.fork(_this.module, _this.args, _this.options, function (error, childProcess) {
                                    if (error) {
                                        e(error);
                                        ee({ terminated: _this.terminateRequested, error: error });
                                        return;
                                    }
                                    _this.childProcess = childProcess;
                                    _this.childProcess.on('close', closeHandler_1);
                                    _this.handleSpawn(childProcess, cc, pp, ee, false);
                                    c(childProcess);
                                });
                            });
                        }
                    }
                    if (childProcess) {
                        _this.childProcess = childProcess;
                        _this.childProcessPromise = winjs_base_1.TPromise.as(childProcess);
                        childProcess.on('error', function (error) {
                            _this.childProcess = null;
                            ee({ terminated: _this.terminateRequested, error: error });
                        });
                        if (childProcess.pid) {
                            _this.childProcess.on('close', closeHandler_1);
                            _this.handleSpawn(childProcess, cc, pp, ee, true);
                        }
                    }
                }
                return result;
            });
        };
        AbstractProcess.prototype.handleClose = function (data, cc, pp, ee) {
            // Default is to do nothing.
        };
        AbstractProcess.prototype.ensureQuotes = function (value) {
            if (AbstractProcess.regexp.test(value)) {
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
        AbstractProcess.prototype.isRunning = function () {
            return this.childProcessPromise !== null;
        };
        Object.defineProperty(AbstractProcess.prototype, "pid", {
            get: function () {
                return this.childProcessPromise.then(function (childProcess) { return childProcess.pid; }, function (err) { return -1; });
            },
            enumerable: true,
            configurable: true
        });
        AbstractProcess.prototype.terminate = function () {
            var _this = this;
            if (!this.childProcessPromise) {
                return winjs_base_1.TPromise.as({ success: true });
            }
            return this.childProcessPromise.then(function (childProcess) {
                _this.terminateRequested = true;
                var result = terminateProcess(childProcess, _this.options.cwd);
                if (result.success) {
                    _this.childProcess = null;
                }
                return result;
            }, function (err) {
                return { success: true };
            });
        };
        AbstractProcess.prototype.useExec = function () {
            var _this = this;
            return new winjs_base_1.TPromise(function (c, e, p) {
                if (!_this.shell || !Platform.isWindows) {
                    c(false);
                }
                var cmdShell = spawn(getWindowsShell(), ['/s', '/c']);
                cmdShell.on('error', function (error) {
                    c(true);
                });
                cmdShell.on('exit', function (data) {
                    c(false);
                });
            });
        };
        AbstractProcess.WellKnowCommands = {
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
        AbstractProcess.regexp = /^[^"].* .*[^"]/;
        return AbstractProcess;
    }());
    exports.AbstractProcess = AbstractProcess;
    var LineProcess = (function (_super) {
        __extends(LineProcess, _super);
        function LineProcess(arg1, arg2, arg3, arg4) {
            return _super.call(this, arg1, arg2, arg3, arg4) || this;
        }
        LineProcess.prototype.handleExec = function (cc, pp, error, stdout, stderr) {
            [stdout, stderr].forEach(function (buffer, index) {
                var lineDecoder = new decoder_1.LineDecoder();
                var lines = lineDecoder.write(buffer);
                lines.forEach(function (line) {
                    pp({ line: line, source: index === 0 ? processes_1.Source.stdout : processes_1.Source.stderr });
                });
                var line = lineDecoder.end();
                if (line) {
                    pp({ line: line, source: index === 0 ? processes_1.Source.stdout : processes_1.Source.stderr });
                }
            });
            cc({ terminated: this.terminateRequested, error: error });
        };
        LineProcess.prototype.handleSpawn = function (childProcess, cc, pp, ee, sync) {
            var _this = this;
            this.stdoutLineDecoder = new decoder_1.LineDecoder();
            this.stderrLineDecoder = new decoder_1.LineDecoder();
            childProcess.stdout.on('data', function (data) {
                var lines = _this.stdoutLineDecoder.write(data);
                lines.forEach(function (line) { return pp({ line: line, source: processes_1.Source.stdout }); });
            });
            childProcess.stderr.on('data', function (data) {
                var lines = _this.stderrLineDecoder.write(data);
                lines.forEach(function (line) { return pp({ line: line, source: processes_1.Source.stderr }); });
            });
        };
        LineProcess.prototype.handleClose = function (data, cc, pp, ee) {
            [this.stdoutLineDecoder.end(), this.stderrLineDecoder.end()].forEach(function (line, index) {
                if (line) {
                    pp({ line: line, source: index === 0 ? processes_1.Source.stdout : processes_1.Source.stderr });
                }
            });
        };
        return LineProcess;
    }(AbstractProcess));
    exports.LineProcess = LineProcess;
    var BufferProcess = (function (_super) {
        __extends(BufferProcess, _super);
        function BufferProcess(arg1, arg2, arg3, arg4) {
            return _super.call(this, arg1, arg2, arg3, arg4) || this;
        }
        BufferProcess.prototype.handleExec = function (cc, pp, error, stdout, stderr) {
            pp({ data: stdout, source: processes_1.Source.stdout });
            pp({ data: stderr, source: processes_1.Source.stderr });
            cc({ terminated: this.terminateRequested, error: error });
        };
        BufferProcess.prototype.handleSpawn = function (childProcess, cc, pp, ee, sync) {
            childProcess.stdout.on('data', function (data) {
                pp({ data: data, source: processes_1.Source.stdout });
            });
            childProcess.stderr.on('data', function (data) {
                pp({ data: data, source: processes_1.Source.stderr });
            });
        };
        return BufferProcess;
    }(AbstractProcess));
    exports.BufferProcess = BufferProcess;
    var StreamProcess = (function (_super) {
        __extends(StreamProcess, _super);
        function StreamProcess(arg1, arg2, arg3, arg4) {
            return _super.call(this, arg1, arg2, arg3, arg4) || this;
        }
        StreamProcess.prototype.handleExec = function (cc, pp, error, stdout, stderr) {
            var stdoutStream = new stream_1.PassThrough();
            stdoutStream.end(stdout);
            var stderrStream = new stream_1.PassThrough();
            stderrStream.end(stderr);
            pp({ stdin: null, stdout: stdoutStream, stderr: stderrStream });
            cc({ terminated: this.terminateRequested, error: error });
        };
        StreamProcess.prototype.handleSpawn = function (childProcess, cc, pp, ee, sync) {
            if (sync) {
                process.nextTick(function () {
                    pp({ stdin: childProcess.stdin, stdout: childProcess.stdout, stderr: childProcess.stderr });
                });
            }
            else {
                pp({ stdin: childProcess.stdin, stdout: childProcess.stdout, stderr: childProcess.stderr });
            }
        };
        return StreamProcess;
    }(AbstractProcess));
    exports.StreamProcess = StreamProcess;
    // Wrapper around process.send() that will queue any messages if the internal node.js
    // queue is filled with messages and only continue sending messages when the internal
    // queue is free again to consume messages.
    // On Windows we always wait for the send() method to return before sending the next message
    // to workaround https://github.com/nodejs/node/issues/7657 (IPC can freeze process)
    function createQueuedSender(childProcess) {
        var msgQueue = [];
        var useQueue = false;
        var send = function (msg) {
            if (useQueue) {
                msgQueue.push(msg); // add to the queue if the process cannot handle more messages
                return;
            }
            var result = childProcess.send(msg, function (error) {
                if (error) {
                    console.error(error); // unlikely to happen, best we can do is log this error
                }
                useQueue = false; // we are good again to send directly without queue
                // now send all the messages that we have in our queue and did not send yet
                if (msgQueue.length > 0) {
                    var msgQueueCopy = msgQueue.slice(0);
                    msgQueue = [];
                    msgQueueCopy.forEach(function (entry) { return send(entry); });
                }
            });
            if (!result || Platform.isWindows /* workaround https://github.com/nodejs/node/issues/7657 */) {
                useQueue = true;
            }
        };
        return { send: send };
    }
    exports.createQueuedSender = createQueuedSender;
});
//# sourceMappingURL=processes.js.map