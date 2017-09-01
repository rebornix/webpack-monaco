/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/platform", "windows-process-tree", "vs/base/common/winjs.base", "vs/base/common/event"], function (require, exports, platform, windowsProcessTree, winjs_base_1, event_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SHELL_EXECUTABLES = ['cmd.exe', 'powershell.exe', 'bash.exe'];
    var WindowsShellHelper = (function () {
        function WindowsShellHelper(_rootProcessId, _rootShellExecutable, _terminalInstance, _xterm) {
            var _this = this;
            this._rootProcessId = _rootProcessId;
            this._rootShellExecutable = _rootShellExecutable;
            this._terminalInstance = _terminalInstance;
            this._xterm = _xterm;
            if (!platform.isWindows) {
                throw new Error("WindowsShellHelper cannot be instantiated on " + platform.platform);
            }
            this._childProcessIdStack = [this._rootProcessId];
            this._isDisposed = false;
            this._onCheckShell = new event_1.Emitter();
            // The debounce is necessary to prevent multiple processes from spawning when
            // the enter key or output is spammed
            event_1.debounceEvent(this._onCheckShell.event, function (l, e) { return e; }, 150, true)(function () {
                setTimeout(function () {
                    _this.checkShell();
                }, 50);
            });
            this._xterm.on('lineFeed', function () { return _this._onCheckShell.fire(); });
            this._xterm.on('keypress', function () { return _this._onCheckShell.fire(); });
        }
        WindowsShellHelper.prototype.checkShell = function () {
            var _this = this;
            if (platform.isWindows && this._terminalInstance.isTitleSetByProcess) {
                this.getShellName().then(function (title) {
                    if (!_this._isDisposed) {
                        _this._terminalInstance.setTitle(title, true);
                    }
                });
            }
        };
        WindowsShellHelper.prototype.traverseTree = function (tree) {
            if (SHELL_EXECUTABLES.indexOf(tree.name) === -1) {
                return tree.name;
            }
            if (!tree.children || tree.children.length === 0) {
                return tree.name;
            }
            var favouriteChild = 0;
            for (; favouriteChild < tree.children.length; favouriteChild++) {
                var child = tree.children[favouriteChild];
                if (!child.children || child.children.length === 0) {
                    break;
                }
                if (child.children[0].name !== 'conhost.exe') {
                    break;
                }
            }
            if (favouriteChild >= tree.children.length) {
                return tree.name;
            }
            return this.traverseTree(tree.children[favouriteChild]);
        };
        WindowsShellHelper.prototype.dispose = function () {
            this._isDisposed = true;
            if (this._wmicProcess) {
                this._wmicProcess.kill();
            }
        };
        /**
         * Returns the innermost shell executable running in the terminal
         */
        WindowsShellHelper.prototype.getShellName = function () {
            var _this = this;
            return new winjs_base_1.TPromise(function (resolve) {
                windowsProcessTree(_this._rootProcessId, function (tree) {
                    resolve(_this.traverseTree(tree));
                });
            });
        };
        return WindowsShellHelper;
    }());
    exports.WindowsShellHelper = WindowsShellHelper;
});
//# sourceMappingURL=windowsShellHelper.js.map