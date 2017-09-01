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
define(["require", "exports", "child_process", "path", "vs/base/node/processes", "vs/nls", "vs/base/common/errors", "vs/base/common/objects", "vs/base/common/winjs.base", "vs/platform/configuration/common/configuration", "vs/workbench/parts/execution/electron-browser/terminal", "vs/base/common/uri"], function (require, exports, cp, path, processes, nls, errors, objects_1, winjs_base_1, configuration_1, terminal_1, uri_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var TERMINAL_TITLE = nls.localize('console.title', "VS Code Console");
    var WinSpawnType;
    (function (WinSpawnType) {
        WinSpawnType[WinSpawnType["CMD"] = 0] = "CMD";
        WinSpawnType[WinSpawnType["CMDER"] = 1] = "CMDER";
    })(WinSpawnType || (WinSpawnType = {}));
    var WinTerminalService = (function () {
        function WinTerminalService(_configurationService) {
            this._configurationService = _configurationService;
        }
        WinTerminalService.prototype.openTerminal = function (cwd) {
            var configuration = this._configurationService.getConfiguration();
            this.spawnTerminal(cp, configuration, processes.getWindowsShell(), cwd)
                .done(null, errors.onUnexpectedError);
        };
        WinTerminalService.prototype.runInTerminal = function (title, dir, args, envVars) {
            var configuration = this._configurationService.getConfiguration();
            var terminalConfig = configuration.terminal.external;
            var exec = terminalConfig.windowsExec || terminal_1.DEFAULT_TERMINAL_WINDOWS;
            return new winjs_base_1.TPromise(function (c, e) {
                var title = "\"" + dir + " - " + TERMINAL_TITLE + "\"";
                var command = "\"\"" + args.join('" "') + "\" & pause\""; // use '|' to only pause on non-zero exit code
                var cmdArgs = [
                    '/c', 'start', title, '/wait', exec, '/c', command
                ];
                // merge environment variables into a copy of the process.env
                var env = objects_1.assign({}, process.env, envVars);
                var options = {
                    cwd: dir,
                    env: env,
                    windowsVerbatimArguments: true
                };
                var cmd = cp.spawn(WinTerminalService.CMD, cmdArgs, options);
                cmd.on('error', e);
                c(null);
            });
        };
        WinTerminalService.prototype.spawnTerminal = function (spawner, configuration, command, cwd) {
            var terminalConfig = configuration.terminal.external;
            var exec = terminalConfig.windowsExec || terminal_1.DEFAULT_TERMINAL_WINDOWS;
            var spawnType = this.getSpawnType(exec);
            // Make the drive letter uppercase on Windows (see #9448)
            if (cwd && cwd[1] === ':') {
                cwd = cwd[0].toUpperCase() + cwd.substr(1);
            }
            // cmder ignores the environment cwd and instead opts to always open in %USERPROFILE%
            // unless otherwise specified
            if (spawnType === WinSpawnType.CMDER) {
                spawner.spawn(exec, [cwd]);
                return winjs_base_1.TPromise.as(void 0);
            }
            // The '""' argument is the window title. Without this, exec doesn't work when the path
            // contains spaces
            var cmdArgs = ['/c', 'start', '/wait', '""', exec];
            return new winjs_base_1.TPromise(function (c, e) {
                var env = cwd ? { cwd: cwd } : void 0;
                var child = spawner.spawn(command, cmdArgs, env);
                child.on('error', e);
                child.on('exit', function () { return c(null); });
            });
        };
        WinTerminalService.prototype.getSpawnType = function (exec) {
            var basename = path.basename(exec).toLowerCase();
            if (basename === 'cmder' || basename === 'cmder.exe') {
                return WinSpawnType.CMDER;
            }
            return WinSpawnType.CMD;
        };
        WinTerminalService.CMD = 'cmd.exe';
        WinTerminalService = __decorate([
            __param(0, configuration_1.IConfigurationService)
        ], WinTerminalService);
        return WinTerminalService;
    }());
    exports.WinTerminalService = WinTerminalService;
    var MacTerminalService = (function () {
        function MacTerminalService(_configurationService) {
            this._configurationService = _configurationService;
        }
        MacTerminalService.prototype.openTerminal = function (cwd) {
            var configuration = this._configurationService.getConfiguration();
            this.spawnTerminal(cp, configuration, cwd).done(null, errors.onUnexpectedError);
        };
        MacTerminalService.prototype.runInTerminal = function (title, dir, args, envVars) {
            var configuration = this._configurationService.getConfiguration();
            var terminalConfig = configuration.terminal.external;
            var terminalApp = terminalConfig.osxExec || terminal_1.DEFAULT_TERMINAL_OSX;
            return new winjs_base_1.TPromise(function (c, e) {
                if (terminalApp === terminal_1.DEFAULT_TERMINAL_OSX || terminalApp === 'iTerm.app') {
                    // On OS X we launch an AppleScript that creates (or reuses) a Terminal window
                    // and then launches the program inside that window.
                    var script_1 = terminalApp === terminal_1.DEFAULT_TERMINAL_OSX ? 'TerminalHelper' : 'iTermHelper';
                    var scriptpath = uri_1.default.parse(require.toUrl("vs/workbench/parts/execution/electron-browser/" + script_1 + ".scpt")).fsPath;
                    var osaArgs = [
                        scriptpath,
                        '-t', title || TERMINAL_TITLE,
                        '-w', dir,
                    ];
                    for (var _i = 0, args_1 = args; _i < args_1.length; _i++) {
                        var a = args_1[_i];
                        osaArgs.push('-a');
                        osaArgs.push(a);
                    }
                    if (envVars) {
                        for (var key in envVars) {
                            osaArgs.push('-e');
                            osaArgs.push(key + '=' + envVars[key]);
                        }
                    }
                    var stderr_1 = '';
                    var osa = cp.spawn(MacTerminalService.OSASCRIPT, osaArgs);
                    osa.on('error', e);
                    osa.stderr.on('data', function (data) {
                        stderr_1 += data.toString();
                    });
                    osa.on('exit', function (code) {
                        if (code === 0) {
                            c(null);
                        }
                        else {
                            if (stderr_1) {
                                var lines = stderr_1.split('\n', 1);
                                e(new Error(lines[0]));
                            }
                            else {
                                e(new Error(nls.localize('mac.terminal.script.failed', "Script '{0}' failed with exit code {1}", script_1, code)));
                            }
                        }
                    });
                }
                else {
                    e(new Error(nls.localize('mac.terminal.type.not.supported', "'{0}' not supported", terminalApp)));
                }
            });
        };
        MacTerminalService.prototype.spawnTerminal = function (spawner, configuration, cwd) {
            var terminalConfig = configuration.terminal.external;
            var terminalApp = terminalConfig.osxExec || terminal_1.DEFAULT_TERMINAL_OSX;
            return new winjs_base_1.TPromise(function (c, e) {
                var child = spawner.spawn('/usr/bin/open', ['-a', terminalApp, cwd]);
                child.on('error', e);
                child.on('exit', function () { return c(null); });
            });
        };
        MacTerminalService.OSASCRIPT = '/usr/bin/osascript'; // osascript is the AppleScript interpreter on OS X
        MacTerminalService = __decorate([
            __param(0, configuration_1.IConfigurationService)
        ], MacTerminalService);
        return MacTerminalService;
    }());
    exports.MacTerminalService = MacTerminalService;
    var LinuxTerminalService = (function () {
        function LinuxTerminalService(_configurationService) {
            this._configurationService = _configurationService;
        }
        LinuxTerminalService.prototype.openTerminal = function (cwd) {
            var configuration = this._configurationService.getConfiguration();
            this.spawnTerminal(cp, configuration, cwd)
                .done(null, errors.onUnexpectedError);
        };
        LinuxTerminalService.prototype.runInTerminal = function (title, dir, args, envVars) {
            var configuration = this._configurationService.getConfiguration();
            var terminalConfig = configuration.terminal.external;
            var execPromise = terminalConfig.linuxExec ? winjs_base_1.TPromise.as(terminalConfig.linuxExec) : terminal_1.DEFAULT_TERMINAL_LINUX_READY;
            return new winjs_base_1.TPromise(function (c, e) {
                var termArgs = [];
                //termArgs.push('--title');
                //termArgs.push(`"${TERMINAL_TITLE}"`);
                execPromise.then(function (exec) {
                    if (exec.indexOf('gnome-terminal') >= 0) {
                        termArgs.push('-x');
                    }
                    else {
                        termArgs.push('-e');
                    }
                    termArgs.push('bash');
                    termArgs.push('-c');
                    var bashCommand = quote(args) + "; echo; read -p \"" + LinuxTerminalService.WAIT_MESSAGE + "\" -n1;";
                    termArgs.push("''" + bashCommand + "''"); // wrapping argument in two sets of ' because node is so "friendly" that it removes one set...
                    // merge environment variables into a copy of the process.env
                    var env = objects_1.assign({}, process.env, envVars);
                    var options = {
                        cwd: dir,
                        env: env
                    };
                    var stderr = '';
                    var cmd = cp.spawn(exec, termArgs, options);
                    cmd.on('error', e);
                    cmd.stderr.on('data', function (data) {
                        stderr += data.toString();
                    });
                    cmd.on('exit', function (code) {
                        if (code === 0) {
                            c(null);
                        }
                        else {
                            if (stderr) {
                                var lines = stderr.split('\n', 1);
                                e(new Error(lines[0]));
                            }
                            else {
                                e(new Error(nls.localize('linux.term.failed', "'{0}' failed with exit code {1}", exec, code)));
                            }
                        }
                    });
                });
            });
        };
        LinuxTerminalService.prototype.spawnTerminal = function (spawner, configuration, cwd) {
            var terminalConfig = configuration.terminal.external;
            var execPromise = terminalConfig.linuxExec ? winjs_base_1.TPromise.as(terminalConfig.linuxExec) : terminal_1.DEFAULT_TERMINAL_LINUX_READY;
            var env = cwd ? { cwd: cwd } : void 0;
            return new winjs_base_1.TPromise(function (c, e) {
                execPromise.then(function (exec) {
                    var child = spawner.spawn(exec, [], env);
                    child.on('error', e);
                    child.on('exit', function () { return c(null); });
                });
            });
        };
        LinuxTerminalService.WAIT_MESSAGE = nls.localize('press.any.key', "Press any key to continue...");
        LinuxTerminalService = __decorate([
            __param(0, configuration_1.IConfigurationService)
        ], LinuxTerminalService);
        return LinuxTerminalService;
    }());
    exports.LinuxTerminalService = LinuxTerminalService;
    /**
     * Quote args if necessary and combine into a space separated string.
     */
    function quote(args) {
        var r = '';
        for (var _i = 0, args_2 = args; _i < args_2.length; _i++) {
            var a = args_2[_i];
            if (a.indexOf(' ') >= 0) {
                r += '"' + a + '"';
            }
            else {
                r += a;
            }
            r += ' ';
        }
        return r;
    }
});
//# sourceMappingURL=terminalService.js.map