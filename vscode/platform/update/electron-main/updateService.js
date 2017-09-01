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
define(["require", "exports", "original-fs", "path", "electron", "vs/base/common/lifecycle", "vs/base/common/event", "vs/base/common/async", "vs/base/common/decorators", "vs/base/node/event", "vs/platform/configuration/common/configuration", "./auto-updater.win32", "./auto-updater.linux", "vs/platform/lifecycle/electron-main/lifecycleMain", "vs/platform/request/node/request", "vs/platform/node/product", "vs/base/common/winjs.base", "vs/platform/update/common/update", "vs/platform/telemetry/common/telemetry"], function (require, exports, fs, path, electron, lifecycle_1, event_1, async_1, decorators_1, event_2, configuration_1, auto_updater_win32_1, auto_updater_linux_1, lifecycleMain_1, request_1, product_1, winjs_base_1, update_1, telemetry_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var UpdateService = (function () {
        function UpdateService(requestService, lifecycleService, configurationService, telemetryService) {
            this.lifecycleService = lifecycleService;
            this.configurationService = configurationService;
            this.telemetryService = telemetryService;
            this._state = update_1.State.Uninitialized;
            this._availableUpdate = null;
            this.throttler = new async_1.Throttler();
            this._onError = new event_1.Emitter();
            this._onCheckForUpdate = new event_1.Emitter();
            this._onUpdateAvailable = new event_1.Emitter();
            this._onUpdateNotAvailable = new event_1.Emitter();
            this._onUpdateReady = new event_1.Emitter();
            this._onStateChange = new event_1.Emitter();
            if (process.platform === 'win32') {
                this.raw = new auto_updater_win32_1.Win32AutoUpdaterImpl(requestService);
            }
            else if (process.platform === 'linux') {
                this.raw = new auto_updater_linux_1.LinuxAutoUpdaterImpl(requestService);
            }
            else if (process.platform === 'darwin') {
                this.raw = electron.autoUpdater;
            }
            else {
                return;
            }
            var channel = this.getUpdateChannel();
            var feedUrl = this.getUpdateFeedUrl(channel);
            if (!feedUrl) {
                return; // updates not available
            }
            try {
                this.raw.setFeedURL(feedUrl);
            }
            catch (e) {
                return; // application not signed
            }
            this.state = update_1.State.Idle;
            // Start checking for updates after 30 seconds
            this.scheduleCheckForUpdates(30 * 1000)
                .done(null, function (err) { return console.error(err); });
        }
        Object.defineProperty(UpdateService.prototype, "onError", {
            get: function () { return this._onError.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateService.prototype, "onCheckForUpdate", {
            get: function () { return this._onCheckForUpdate.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateService.prototype, "onUpdateAvailable", {
            get: function () { return this._onUpdateAvailable.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateService.prototype, "onUpdateNotAvailable", {
            get: function () { return this._onUpdateNotAvailable.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateService.prototype, "onUpdateReady", {
            get: function () { return this._onUpdateReady.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateService.prototype, "onStateChange", {
            get: function () { return this._onStateChange.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateService.prototype, "onRawError", {
            get: function () {
                return event_2.fromEventEmitter(this.raw, 'error', function (_, message) { return message; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateService.prototype, "onRawUpdateNotAvailable", {
            get: function () {
                return event_2.fromEventEmitter(this.raw, 'update-not-available');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateService.prototype, "onRawUpdateAvailable", {
            get: function () {
                return event_1.filterEvent(event_2.fromEventEmitter(this.raw, 'update-available', function (_, url, version) { return ({ url: url, version: version }); }), function (_a) {
                    var url = _a.url;
                    return !!url;
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateService.prototype, "onRawUpdateDownloaded", {
            get: function () {
                return event_2.fromEventEmitter(this.raw, 'update-downloaded', function (_, releaseNotes, version, date, url) { return ({ releaseNotes: releaseNotes, version: version, date: date }); });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateService.prototype, "state", {
            get: function () {
                return this._state;
            },
            set: function (state) {
                this._state = state;
                this._onStateChange.fire(state);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateService.prototype, "availableUpdate", {
            get: function () {
                return this._availableUpdate;
            },
            enumerable: true,
            configurable: true
        });
        UpdateService.prototype.scheduleCheckForUpdates = function (delay) {
            var _this = this;
            if (delay === void 0) { delay = 60 * 60 * 1000; }
            return winjs_base_1.TPromise.timeout(delay)
                .then(function () { return _this.checkForUpdates(); })
                .then(function (update) {
                if (update) {
                    // Update found, no need to check more
                    return winjs_base_1.TPromise.as(null);
                }
                // Check again after 1 hour
                return _this.scheduleCheckForUpdates(60 * 60 * 1000);
            });
        };
        UpdateService.prototype.checkForUpdates = function (explicit) {
            var _this = this;
            if (explicit === void 0) { explicit = false; }
            return this.throttler.queue(function () { return _this._checkForUpdates(explicit); })
                .then(null, function (err) {
                if (explicit) {
                    _this._onError.fire(err);
                }
                return null;
            });
        };
        UpdateService.prototype._checkForUpdates = function (explicit) {
            var _this = this;
            if (this.state !== update_1.State.Idle) {
                return winjs_base_1.TPromise.as(null);
            }
            this._onCheckForUpdate.fire();
            this.state = update_1.State.CheckingForUpdate;
            var listeners = [];
            var result = new winjs_base_1.TPromise(function (c, e) {
                event_1.once(_this.onRawError)(e, null, listeners);
                event_1.once(_this.onRawUpdateNotAvailable)(function () { return c(null); }, null, listeners);
                event_1.once(_this.onRawUpdateAvailable)(function (_a) {
                    var url = _a.url, version = _a.version;
                    return url && c({ url: url, version: version });
                }, null, listeners);
                event_1.once(_this.onRawUpdateDownloaded)(function (_a) {
                    var version = _a.version, date = _a.date, releaseNotes = _a.releaseNotes;
                    return c({ version: version, date: date, releaseNotes: releaseNotes });
                }, null, listeners);
                _this.raw.checkForUpdates();
            }).then(function (update) {
                if (!update) {
                    _this._onUpdateNotAvailable.fire(explicit);
                    _this.state = update_1.State.Idle;
                    _this.telemetryService.publicLog('update:notAvailable', { explicit: explicit });
                }
                else if (update.url) {
                    var data = {
                        url: update.url,
                        releaseNotes: '',
                        version: update.version,
                        date: new Date()
                    };
                    _this._availableUpdate = data;
                    _this._onUpdateAvailable.fire({ url: update.url, version: update.version });
                    _this.state = update_1.State.UpdateAvailable;
                    _this.telemetryService.publicLog('update:available', { explicit: explicit, version: update.version, currentVersion: product_1.default.commit });
                }
                else {
                    var data = {
                        releaseNotes: update.releaseNotes,
                        version: update.version,
                        date: update.date
                    };
                    _this._availableUpdate = data;
                    _this._onUpdateReady.fire(data);
                    _this.state = update_1.State.UpdateDownloaded;
                    _this.telemetryService.publicLog('update:downloaded', { version: update.version });
                }
                return update;
            }, function (err) {
                _this.state = update_1.State.Idle;
                return winjs_base_1.TPromise.wrapError(err);
            });
            return async_1.always(result, function () { return lifecycle_1.dispose(listeners); });
        };
        UpdateService.prototype.getUpdateChannel = function () {
            var config = this.configurationService.getConfiguration('update');
            var channel = config && config.channel;
            return channel === 'none' ? null : product_1.default.quality;
        };
        UpdateService.prototype.getUpdateFeedUrl = function (channel) {
            if (!channel) {
                return null;
            }
            if (process.platform === 'win32' && !fs.existsSync(path.join(path.dirname(process.execPath), 'unins000.exe'))) {
                return null;
            }
            if (!product_1.default.updateUrl || !product_1.default.commit) {
                return null;
            }
            var platform = this.getUpdatePlatform();
            return product_1.default.updateUrl + "/api/update/" + platform + "/" + channel + "/" + product_1.default.commit;
        };
        UpdateService.prototype.getUpdatePlatform = function () {
            if (process.platform === 'linux') {
                return "linux-" + process.arch;
            }
            if (process.platform === 'win32' && process.arch === 'x64') {
                return 'win32-x64';
            }
            return process.platform;
        };
        UpdateService.prototype.quitAndInstall = function () {
            var _this = this;
            if (!this._availableUpdate) {
                return winjs_base_1.TPromise.as(null);
            }
            if (this._availableUpdate.url) {
                electron.shell.openExternal(this._availableUpdate.url);
                return winjs_base_1.TPromise.as(null);
            }
            this.lifecycleService.quit(true /* from update */).done(function (vetod) {
                if (vetod) {
                    return;
                }
                // for some reason updating on Mac causes the local storage not to be flushed.
                // we workaround this issue by forcing an explicit flush of the storage data.
                // see also https://github.com/Microsoft/vscode/issues/172
                if (process.platform === 'darwin') {
                    electron.session.defaultSession.flushStorageData();
                }
                _this.raw.quitAndInstall();
            });
            return winjs_base_1.TPromise.as(null);
        };
        __decorate([
            decorators_1.memoize
        ], UpdateService.prototype, "onRawError", null);
        __decorate([
            decorators_1.memoize
        ], UpdateService.prototype, "onRawUpdateNotAvailable", null);
        __decorate([
            decorators_1.memoize
        ], UpdateService.prototype, "onRawUpdateAvailable", null);
        __decorate([
            decorators_1.memoize
        ], UpdateService.prototype, "onRawUpdateDownloaded", null);
        UpdateService = __decorate([
            __param(0, request_1.IRequestService),
            __param(1, lifecycleMain_1.ILifecycleService),
            __param(2, configuration_1.IConfigurationService),
            __param(3, telemetry_1.ITelemetryService)
        ], UpdateService);
        return UpdateService;
    }());
    exports.UpdateService = UpdateService;
});
//# sourceMappingURL=updateService.js.map