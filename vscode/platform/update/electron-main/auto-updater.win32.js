/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "path", "vs/base/node/pfs", "vs/base/node/crypto", "events", "os", "child_process", "vs/base/node/extfs", "vs/base/common/types", "vs/base/common/winjs.base", "vs/base/node/request", "vs/platform/request/node/request", "vs/platform/node/product"], function (require, exports, path, pfs, crypto_1, events_1, os_1, child_process_1, extfs_1, types_1, winjs_base_1, request_1, request_2, product_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Win32AutoUpdaterImpl = (function (_super) {
        __extends(Win32AutoUpdaterImpl, _super);
        function Win32AutoUpdaterImpl(requestService) {
            var _this = _super.call(this) || this;
            _this.requestService = requestService;
            _this.url = null;
            _this.currentRequest = null;
            _this.updatePackagePath = null;
            return _this;
        }
        Object.defineProperty(Win32AutoUpdaterImpl.prototype, "cachePath", {
            get: function () {
                var result = path.join(os_1.tmpdir(), "vscode-update-" + process.arch);
                return new winjs_base_1.TPromise(function (c, e) { return extfs_1.mkdirp(result, null, function (err) { return err ? e(err) : c(result); }); });
            },
            enumerable: true,
            configurable: true
        });
        Win32AutoUpdaterImpl.prototype.setFeedURL = function (url) {
            this.url = url;
        };
        Win32AutoUpdaterImpl.prototype.checkForUpdates = function () {
            var _this = this;
            if (!this.url) {
                throw new Error('No feed url set.');
            }
            if (this.currentRequest) {
                return;
            }
            this.emit('checking-for-update');
            this.currentRequest = this.requestService.request({ url: this.url })
                .then(request_1.asJson)
                .then(function (update) {
                if (!update || !update.url || !update.version) {
                    _this.emit('update-not-available');
                    return _this.cleanup();
                }
                _this.emit('update-available');
                return _this.cleanup(update.version).then(function () {
                    return _this.getUpdatePackagePath(update.version).then(function (updatePackagePath) {
                        return pfs.exists(updatePackagePath).then(function (exists) {
                            if (exists) {
                                return winjs_base_1.TPromise.as(updatePackagePath);
                            }
                            var url = update.url;
                            var hash = update.hash;
                            var downloadPath = updatePackagePath + ".tmp";
                            return _this.requestService.request({ url: url })
                                .then(function (context) { return request_1.download(downloadPath, context); })
                                .then(hash ? function () { return crypto_1.checksum(downloadPath, update.hash); } : function () { return null; })
                                .then(function () { return pfs.rename(downloadPath, updatePackagePath); })
                                .then(function () { return updatePackagePath; });
                        });
                    }).then(function (updatePackagePath) {
                        _this.updatePackagePath = updatePackagePath;
                        _this.emit('update-downloaded', {}, update.releaseNotes, update.productVersion, new Date(), _this.url);
                    });
                });
            })
                .then(null, function (e) {
                if (types_1.isString(e) && /^Server returned/.test(e)) {
                    return;
                }
                _this.emit('update-not-available');
                _this.emit('error', e);
            })
                .then(function () { return _this.currentRequest = null; });
        };
        Win32AutoUpdaterImpl.prototype.getUpdatePackagePath = function (version) {
            return this.cachePath.then(function (cachePath) { return path.join(cachePath, "CodeSetup-" + product_1.default.quality + "-" + version + ".exe"); });
        };
        Win32AutoUpdaterImpl.prototype.cleanup = function (exceptVersion) {
            if (exceptVersion === void 0) { exceptVersion = null; }
            var filter = exceptVersion ? function (one) { return !(new RegExp(product_1.default.quality + "-" + exceptVersion + "\\.exe$").test(one)); } : function () { return true; };
            return this.cachePath
                .then(function (cachePath) { return pfs.readdir(cachePath)
                .then(function (all) { return winjs_base_1.Promise.join(all
                .filter(filter)
                .map(function (one) { return pfs.unlink(path.join(cachePath, one)).then(null, function () { return null; }); })); }); });
        };
        Win32AutoUpdaterImpl.prototype.quitAndInstall = function () {
            if (!this.updatePackagePath) {
                return;
            }
            child_process_1.spawn(this.updatePackagePath, ['/silent', '/mergetasks=runcode,!desktopicon,!quicklaunchicon'], {
                detached: true,
                stdio: ['ignore', 'ignore', 'ignore']
            });
        };
        Win32AutoUpdaterImpl = __decorate([
            __param(0, request_2.IRequestService)
        ], Win32AutoUpdaterImpl);
        return Win32AutoUpdaterImpl;
    }(events_1.EventEmitter));
    exports.Win32AutoUpdaterImpl = Win32AutoUpdaterImpl;
});
//# sourceMappingURL=auto-updater.win32.js.map