/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "vs/nls", "vs/base/node/pfs", "vs/base/common/winjs.base", "path", "vs/workbench/api/node/extHostExtensionService", "vs/workbench/services/thread/node/extHostThreadService", "vs/platform/search/common/search", "vs/workbench/services/search/node/searchService", "vs/workbench/api/node/extHost.protocol", "vs/base/common/errors", "native-watchdog"], function (require, exports, nls, pfs, winjs_base_1, path_1, extHostExtensionService_1, extHostThreadService_1, search_1, searchService_1, extHost_protocol_1, errors, watchdog) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    // const nativeExit = process.exit.bind(process);
    process.exit = function () {
        var err = new Error('An extension called process.exit() and this was prevented.');
        console.warn(err.stack);
    };
    function exit(code) {
        //nativeExit(code);
        // TODO@electron
        // See https://github.com/Microsoft/vscode/issues/32990
        // calling process.exit() does not exit the process when the process is being debugged
        // It waits for the debugger to disconnect, but in our version, the debugger does not
        // receive an event that the process desires to exit such that it can disconnect.
        // Do exactly what node.js would have done, minus the wait for the debugger part
        if (code || code === 0) {
            process.exitCode = code;
        }
        if (!process._exiting) {
            process._exiting = true;
            process.emit('exit', process.exitCode || 0);
        }
        watchdog.exit(process.exitCode || 0);
    }
    exports.exit = exit;
    var ExtensionHostMain = (function () {
        function ExtensionHostMain(rpcProtocol, initData) {
            this._isTerminating = false;
            this._environment = initData.environment;
            this._workspace = initData.workspace;
            // services
            var threadService = new extHostThreadService_1.ExtHostThreadService(rpcProtocol);
            this._extensionService = new extHostExtensionService_1.ExtHostExtensionService(initData, threadService);
            // error forwarding and stack trace scanning
            var extensionErrors = new WeakMap();
            this._extensionService.getExtensionPathIndex().then(function (map) {
                Error.prepareStackTrace = function (error, stackTrace) {
                    var stackTraceMessage = '';
                    var extension;
                    for (var _i = 0, stackTrace_1 = stackTrace; _i < stackTrace_1.length; _i++) {
                        var call = stackTrace_1[_i];
                        stackTraceMessage += "\n\tat " + call.toString();
                        extension = extension || map.findSubstr(stackTrace[0].getFileName());
                    }
                    extensionErrors.set(error, extension);
                    return (error.name || 'Error') + ": " + (error.message || '') + stackTraceMessage;
                };
            });
            var mainThreadErrors = threadService.get(extHost_protocol_1.MainContext.MainThreadErrors);
            errors.setUnexpectedErrorHandler(function (err) {
                var data = errors.transformErrorForSerialization(err);
                var extension = extensionErrors.get(err);
                mainThreadErrors.$onUnexpectedError(data, extension && extension.id);
            });
            // Configure the watchdog to kill our process if the JS event loop is unresponsive for more than 10s
            // if (!initData.environment.isExtensionDevelopmentDebug) {
            // 	watchdog.start(10000);
            // }
        }
        ExtensionHostMain.prototype.start = function () {
            var _this = this;
            return this._extensionService.onExtensionAPIReady()
                .then(function () { return _this.handleEagerExtensions(); })
                .then(function () { return _this.handleExtensionTests(); });
        };
        ExtensionHostMain.prototype.terminate = function () {
            var _this = this;
            if (this._isTerminating) {
                // we are already shutting down...
                return;
            }
            this._isTerminating = true;
            errors.setUnexpectedErrorHandler(function (err) {
                // TODO: write to log once we have one
            });
            var allPromises = [];
            try {
                var allExtensions = this._extensionService.getAllExtensionDescriptions();
                var allExtensionsIds = allExtensions.map(function (ext) { return ext.id; });
                var activatedExtensions = allExtensionsIds.filter(function (id) { return _this._extensionService.isActivated(id); });
                allPromises = activatedExtensions.map(function (extensionId) {
                    return _this._extensionService.deactivate(extensionId);
                });
            }
            catch (err) {
                // TODO: write to log once we have one
            }
            var extensionsDeactivated = winjs_base_1.TPromise.join(allPromises).then(function () { return void 0; });
            // Give extensions 1 second to wrap up any async dispose, then exit
            setTimeout(function () {
                winjs_base_1.TPromise.any([winjs_base_1.TPromise.timeout(4000), extensionsDeactivated]).then(function () { return exit(); }, function () { return exit(); });
            }, 1000);
        };
        // Handle "eager" activation extensions
        ExtensionHostMain.prototype.handleEagerExtensions = function () {
            this._extensionService.activateByEvent('*', true).then(null, function (err) {
                console.error(err);
            });
            return this.handleWorkspaceContainsEagerExtensions();
        };
        ExtensionHostMain.prototype.handleWorkspaceContainsEagerExtensions = function () {
            var _this = this;
            if (!this._workspace || this._workspace.roots.length === 0) {
                return winjs_base_1.TPromise.as(null);
            }
            var desiredFilesMap = {};
            this._extensionService.getAllExtensionDescriptions().forEach(function (desc) {
                var activationEvents = desc.activationEvents;
                if (!activationEvents) {
                    return;
                }
                for (var i = 0; i < activationEvents.length; i++) {
                    if (/^workspaceContains:/.test(activationEvents[i])) {
                        var fileName = activationEvents[i].substr('workspaceContains:'.length);
                        desiredFilesMap[fileName] = true;
                    }
                }
            });
            var matchingPatterns = Object.keys(desiredFilesMap).map(function (p) {
                // TODO: This is a bit hacky -- maybe this should be implemented by using something like
                // `workspaceGlob` or something along those lines?
                if (p.indexOf('*') > -1 || p.indexOf('?') > -1) {
                    if (!_this._diskSearch) {
                        // Shut down this search process after 1s
                        _this._diskSearch = new searchService_1.DiskSearch(false, 1000);
                    }
                    var query = {
                        folderQueries: _this._workspace.roots.map(function (root) { return ({ folder: root }); }),
                        type: search_1.QueryType.File,
                        maxResults: 1,
                        includePattern: (_a = {}, _a[p] = true, _a)
                    };
                    return _this._diskSearch.search(query).then(function (result) { return result.results.length ? p : undefined; });
                }
                else {
                    // find exact path
                    return (function (resolve) { return __awaiter(_this, void 0, void 0, function () {
                        var _i, _a, fsPath;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _i = 0, _a = this._workspace.roots;
                                    _b.label = 1;
                                case 1:
                                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                                    fsPath = _a[_i].fsPath;
                                    return [4 /*yield*/, pfs.exists(path_1.join(fsPath, p))];
                                case 2:
                                    if (_b.sent()) {
                                        return [2 /*return*/, p];
                                    }
                                    _b.label = 3;
                                case 3:
                                    _i++;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/, undefined];
                            }
                        });
                    }); })();
                }
                var _a;
            });
            return winjs_base_1.TPromise.join(matchingPatterns).then(function (patterns) {
                patterns
                    .filter(function (p) { return p !== undefined; })
                    .forEach(function (p) {
                    var activationEvent = "workspaceContains:" + p;
                    _this._extensionService.activateByEvent(activationEvent, true)
                        .done(null, function (err) { return console.error(err); });
                });
            });
        };
        ExtensionHostMain.prototype.handleExtensionTests = function () {
            var _this = this;
            if (!this._environment.extensionTestsPath || !this._environment.extensionDevelopmentPath) {
                return winjs_base_1.TPromise.as(null);
            }
            // Require the test runner via node require from the provided path
            var testRunner;
            var requireError;
            try {
                testRunner = require.__$__nodeRequire(this._environment.extensionTestsPath);
            }
            catch (error) {
                requireError = error;
            }
            // Execute the runner if it follows our spec
            if (testRunner && typeof testRunner.run === 'function') {
                return new winjs_base_1.TPromise(function (c, e) {
                    testRunner.run(_this._environment.extensionTestsPath, function (error, failures) {
                        if (error) {
                            e(error.toString());
                        }
                        else {
                            c(null);
                        }
                        // after tests have run, we shutdown the host
                        _this.gracefulExit(failures && failures > 0 ? 1 /* ERROR */ : 0 /* OK */);
                    });
                });
            }
            else {
                this.gracefulExit(1 /* ERROR */);
            }
            return winjs_base_1.TPromise.wrapError(new Error(requireError ? requireError.toString() : nls.localize('extensionTestError', "Path {0} does not point to a valid extension test runner.", this._environment.extensionTestsPath)));
        };
        ExtensionHostMain.prototype.gracefulExit = function (code) {
            // to give the PH process a chance to flush any outstanding console
            // messages to the main process, we delay the exit() by some time
            setTimeout(function () { return exit(code); }, 500);
        };
        return ExtensionHostMain;
    }());
    exports.ExtensionHostMain = ExtensionHostMain;
});
//# sourceMappingURL=extensionHostMain.js.map