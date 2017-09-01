/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "child_process", "vs/base/common/objects", "vs/base/common/uuid", "vs/base/common/winjs.base", "vs/base/common/platform"], function (require, exports, cp, objects_1, uuid_1, winjs_base_1, platform_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function getUnixShellEnvironment() {
        var promise = new winjs_base_1.TPromise(function (c, e) {
            var runAsNode = process.env['ELECTRON_RUN_AS_NODE'];
            var noAttach = process.env['ELECTRON_NO_ATTACH_CONSOLE'];
            var mark = uuid_1.generateUuid().replace(/-/g, '').substr(0, 12);
            var regex = new RegExp(mark + '(.*)' + mark);
            var env = objects_1.assign({}, process.env, {
                ELECTRON_RUN_AS_NODE: '1',
                ELECTRON_NO_ATTACH_CONSOLE: '1'
            });
            var command = "'" + process.execPath + "' -p '\"" + mark + "\" + JSON.stringify(process.env) + \"" + mark + "\"'";
            var child = cp.spawn(process.env.SHELL, ['-ilc', command], {
                detached: true,
                stdio: ['ignore', 'pipe', process.stderr],
                env: env
            });
            var buffers = [];
            child.on('error', function () { return c({}); });
            child.stdout.on('data', function (b) { return buffers.push(b); });
            child.on('close', function (code, signal) {
                if (code !== 0) {
                    return e(new Error('Failed to get environment'));
                }
                var raw = Buffer.concat(buffers).toString('utf8');
                var match = regex.exec(raw);
                var rawStripped = match ? match[1] : '{}';
                try {
                    var env_1 = JSON.parse(rawStripped);
                    if (runAsNode) {
                        env_1['ELECTRON_RUN_AS_NODE'] = runAsNode;
                    }
                    else {
                        delete env_1['ELECTRON_RUN_AS_NODE'];
                    }
                    if (noAttach) {
                        env_1['ELECTRON_NO_ATTACH_CONSOLE'] = noAttach;
                    }
                    else {
                        delete env_1['ELECTRON_NO_ATTACH_CONSOLE'];
                    }
                    c(env_1);
                }
                catch (err) {
                    e(err);
                }
            });
        });
        // swallow errors
        return promise.then(null, function () { return ({}); });
    }
    var _shellEnv;
    /**
     * We need to get the environment from a user's shell.
     * This should only be done when Code itself is not launched
     * from within a shell.
     */
    function getShellEnvironment() {
        if (_shellEnv === undefined) {
            if (platform_1.isWindows) {
                _shellEnv = winjs_base_1.TPromise.as({});
            }
            else if (process.env['VSCODE_CLI'] === '1') {
                _shellEnv = winjs_base_1.TPromise.as({});
            }
            else {
                _shellEnv = getUnixShellEnvironment();
            }
        }
        return _shellEnv;
    }
    exports.getShellEnvironment = getShellEnvironment;
});
//# sourceMappingURL=shellEnv.js.map