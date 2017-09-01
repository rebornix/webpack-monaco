/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/nls", "vs/base/common/platform", "vs/base/common/winjs.base"], function (require, exports, nls, platform, winjs_base_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ShellType;
    (function (ShellType) {
        ShellType[ShellType["cmd"] = 0] = "cmd";
        ShellType[ShellType["powershell"] = 1] = "powershell";
        ShellType[ShellType["bash"] = 2] = "bash";
    })(ShellType || (ShellType = {}));
    ;
    var TerminalSupport = (function () {
        function TerminalSupport() {
        }
        TerminalSupport.runInTerminal = function (terminalService, nativeTerminalService, configurationService, args, response) {
            var _this = this;
            if (args.kind === 'external') {
                return nativeTerminalService.runInTerminal(args.title, args.cwd, args.args, args.env || {});
            }
            var delay = 0;
            if (!TerminalSupport.integratedTerminalInstance) {
                TerminalSupport.integratedTerminalInstance = terminalService.createInstance({ name: args.title || nls.localize('debug.terminal.title', "debuggee") });
                delay = 2000; // delay the first sendText so that the newly created terminal is ready.
            }
            if (!TerminalSupport.terminalDisposedListener) {
                // React on terminal disposed and check if that is the debug terminal #12956
                TerminalSupport.terminalDisposedListener = terminalService.onInstanceDisposed(function (terminal) {
                    if (TerminalSupport.integratedTerminalInstance && TerminalSupport.integratedTerminalInstance.id === terminal.id) {
                        TerminalSupport.integratedTerminalInstance = null;
                    }
                });
            }
            terminalService.setActiveInstance(TerminalSupport.integratedTerminalInstance);
            terminalService.showPanel(true);
            return new winjs_base_1.TPromise(function (c, e) {
                setTimeout(function () {
                    if (TerminalSupport.integratedTerminalInstance) {
                        var command = _this.prepareCommand(args, configurationService);
                        TerminalSupport.integratedTerminalInstance.sendText(command, true);
                        c(void 0);
                    }
                    else {
                        e(new Error(nls.localize('debug.terminal.not.available.error', "Integrated terminal not available")));
                    }
                }, delay);
            });
        };
        TerminalSupport.prepareCommand = function (args, configurationService) {
            var shellType;
            // get the shell configuration for the current platform
            var shell;
            var shell_config = configurationService.getConfiguration().terminal.integrated.shell;
            if (platform.isWindows) {
                shell = shell_config.windows;
                shellType = 0 /* cmd */;
            }
            else if (platform.isLinux) {
                shell = shell_config.linux;
                shellType = 2 /* bash */;
            }
            else if (platform.isMacintosh) {
                shell = shell_config.osx;
                shellType = 2 /* bash */;
            }
            // try to determine the shell type
            shell = shell.trim().toLowerCase();
            if (shell.indexOf('powershell') >= 0) {
                shellType = 1 /* powershell */;
            }
            else if (shell.indexOf('cmd.exe') >= 0) {
                shellType = 0 /* cmd */;
            }
            else if (shell.indexOf('bash') >= 0) {
                shellType = 2 /* bash */;
            }
            else if (shell.indexOf('git\\bin\\bash.exe') >= 0) {
                shellType = 2 /* bash */;
            }
            var quote;
            var command = '';
            switch (shellType) {
                case 1 /* powershell */:
                    quote = function (s) {
                        s = s.replace(/\'/g, '\'\'');
                        return s.indexOf(' ') >= 0 || s.indexOf('\'') >= 0 || s.indexOf('"') >= 0 ? "'" + s + "'" : s;
                    };
                    if (args.cwd) {
                        command += "cd '" + args.cwd + "'; ";
                    }
                    if (args.env) {
                        for (var key in args.env) {
                            command += "$env:" + key + "='" + args.env[key] + "'; ";
                        }
                    }
                    if (args.args && args.args.length > 0) {
                        var cmd = quote(args.args.shift());
                        command += (cmd[0] === '\'') ? "& " + cmd + " " : cmd + " ";
                        for (var _i = 0, _a = args.args; _i < _a.length; _i++) {
                            var a = _a[_i];
                            command += quote(a) + " ";
                        }
                    }
                    break;
                case 0 /* cmd */:
                    quote = function (s) {
                        s = s.replace(/\"/g, '""');
                        return (s.indexOf(' ') >= 0 || s.indexOf('"') >= 0) ? "\"" + s + "\"" : s;
                    };
                    if (args.cwd) {
                        command += "cd " + quote(args.cwd) + " && ";
                    }
                    if (args.env) {
                        command += 'cmd /C "';
                        for (var key in args.env) {
                            command += "set \"" + key + "=" + args.env[key] + "\" && ";
                        }
                    }
                    for (var _b = 0, _c = args.args; _b < _c.length; _b++) {
                        var a = _c[_b];
                        command += quote(a) + " ";
                    }
                    if (args.env) {
                        command += '"';
                    }
                    break;
                case 2 /* bash */:
                    quote = function (s) {
                        s = s.replace(/\"/g, '\\"');
                        return (s.indexOf(' ') >= 0 || s.indexOf('\\') >= 0) ? "\"" + s + "\"" : s;
                    };
                    if (args.cwd) {
                        command += "cd " + quote(args.cwd) + " ; ";
                    }
                    if (args.env) {
                        command += 'env';
                        for (var key in args.env) {
                            command += " \"" + key + "=" + args.env[key] + "\"";
                        }
                        command += ' ';
                    }
                    for (var _d = 0, _e = args.args; _d < _e.length; _d++) {
                        var a = _e[_d];
                        command += quote(a) + " ";
                    }
                    break;
            }
            return command;
        };
        return TerminalSupport;
    }());
    exports.TerminalSupport = TerminalSupport;
});
//# sourceMappingURL=terminalSupport.js.map