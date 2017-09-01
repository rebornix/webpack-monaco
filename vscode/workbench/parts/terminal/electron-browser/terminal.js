define(["require", "exports", "os", "vs/base/common/platform", "vs/base/node/processes"], function (require, exports, os, platform, processes) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TERMINAL_DEFAULT_SHELL_LINUX = !platform.isWindows ? (process.env.SHELL || 'sh') : 'sh';
    exports.TERMINAL_DEFAULT_SHELL_OSX = !platform.isWindows ? (process.env.SHELL || 'sh') : 'sh';
    var isAtLeastWindows10 = platform.isWindows && parseFloat(os.release()) >= 10;
    var is32ProcessOn64Windows = process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432');
    var powerShellPath = process.env.windir + "\\" + (is32ProcessOn64Windows ? 'Sysnative' : 'System32') + "\\WindowsPowerShell\\v1.0\\powershell.exe";
    exports.TERMINAL_DEFAULT_SHELL_WINDOWS = isAtLeastWindows10 ? powerShellPath : processes.getWindowsShell();
});
//# sourceMappingURL=terminal.js.map