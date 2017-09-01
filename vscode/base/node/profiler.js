/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/winjs.base", "path", "vs/base/node/pfs"], function (require, exports, winjs_base_1, path_1, pfs_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function startProfiling(name) {
        return lazyV8Profiler.value.then(function (profiler) {
            profiler.startProfiling(name);
            return true;
        });
    }
    exports.startProfiling = startProfiling;
    var _isRunningOutOfDev = process.env['VSCODE_DEV'];
    function stopProfiling(dir, prefix) {
        return lazyV8Profiler.value.then(function (profiler) {
            return profiler.stopProfiling();
        }).then(function (profile) {
            return new winjs_base_1.TPromise(function (resolve, reject) {
                // remove pii paths
                if (!_isRunningOutOfDev) {
                    removePiiPaths(profile); // remove pii from our users
                }
                profile.export(function (error, result) {
                    profile.delete();
                    if (error) {
                        reject(error);
                        return;
                    }
                    var filepath = path_1.join(dir, prefix + "_" + profile.title + ".cpuprofile");
                    if (!_isRunningOutOfDev) {
                        filepath += '.txt'; // github issues must be: txt, zip, png, gif
                    }
                    pfs_1.writeFile(filepath, result).then(function () { return resolve(filepath); }, reject);
                });
            });
        });
    }
    exports.stopProfiling = stopProfiling;
    function removePiiPaths(profile) {
        var stack = [profile.head];
        while (stack.length > 0) {
            var element = stack.pop();
            if (element.url) {
                var shortUrl = path_1.basename(element.url);
                if (element.url !== shortUrl) {
                    element.url = "pii_removed/" + shortUrl;
                }
            }
            if (element.children) {
                stack.push.apply(stack, element.children);
            }
        }
    }
    exports.removePiiPaths = removePiiPaths;
    var lazyV8Profiler = new (function () {
        function class_1() {
        }
        Object.defineProperty(class_1.prototype, "value", {
            get: function () {
                if (!this._value) {
                    this._value = new winjs_base_1.TPromise(function (resolve, reject) {
                        require(['v8-profiler'], resolve, reject);
                    });
                }
                return this._value;
            },
            enumerable: true,
            configurable: true
        });
        return class_1;
    }());
});
//# sourceMappingURL=profiler.js.map