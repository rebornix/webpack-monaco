var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/common/lifecycle", "vs/base/common/errors", "vs/base/common/winjs.base", "path", "vs/base/node/pfs", "vs/platform/environment/common/environment", "vs/platform/telemetry/common/telemetry", "vs/platform/node/product"], function (require, exports, lifecycle_1, errors_1, winjs_base_1, path_1, pfs_1, environment_1, telemetry_1, product_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var NodeCachedDataManager = (function () {
        function NodeCachedDataManager(telemetryService, environmentService) {
            this._disposables = [];
            this._telemetryService = telemetryService;
            this._environmentService = environmentService;
            this._handleCachedDataInfo();
            this._manageCachedDataSoon();
        }
        NodeCachedDataManager.prototype.dispose = function () {
            this._disposables = lifecycle_1.dispose(this._disposables);
        };
        NodeCachedDataManager.prototype._handleCachedDataInfo = function () {
            var didRejectCachedData = false;
            var didProduceCachedData = false;
            for (var _i = 0, _a = MonacoEnvironment.onNodeCachedData; _i < _a.length; _i++) {
                var _b = _a[_i], err = _b[0], data = _b[1];
                // build summary
                didRejectCachedData = didRejectCachedData || Boolean(err);
                didProduceCachedData = didProduceCachedData || Boolean(data);
                // log each failure separately
                if (err) {
                    this._telemetryService.publicLog('cachedDataError', {
                        errorCode: err.errorCode,
                        path: path_1.basename(err.path)
                    });
                }
            }
            // log summary
            this._telemetryService.publicLog('cachedDataInfo', {
                didRequestCachedData: Boolean(global.require.getConfig().nodeCachedDataDir),
                didRejectCachedData: didRejectCachedData,
                didProduceCachedData: didProduceCachedData
            });
            global.require.config({ onNodeCachedData: undefined });
            delete MonacoEnvironment.onNodeCachedData;
        };
        NodeCachedDataManager.prototype._manageCachedDataSoon = function () {
            // Cached data is stored as user data and we run a cleanup task everytime
            // the editor starts. The strategy is to delete all files that are older than
            // 3 months
            var nodeCachedDataDir = this._environmentService.nodeCachedDataDir;
            if (!nodeCachedDataDir) {
                return;
            }
            var handle = setTimeout(function () {
                handle = undefined;
                pfs_1.readdir(nodeCachedDataDir).then(function (entries) {
                    var now = Date.now();
                    var deletes = entries.map(function (entry) {
                        var path = path_1.join(nodeCachedDataDir, entry);
                        return pfs_1.stat(path).then(function (stats) {
                            var diff = now - stats.mtime.getTime();
                            if (diff > NodeCachedDataManager._DataMaxAge) {
                                return pfs_1.rimraf(path);
                            }
                            return undefined;
                        });
                    });
                    return winjs_base_1.TPromise.join(deletes);
                }).done(undefined, errors_1.onUnexpectedError);
            }, 30 * 1000);
            this._disposables.push({
                dispose: function () { clearTimeout(handle); }
            });
        };
        NodeCachedDataManager._DataMaxAge = product_1.default.nameLong.indexOf('Insiders') >= 0
            ? 1000 * 60 * 60 * 24 * 7 // roughly 1 week
            : 1000 * 60 * 60 * 24 * 30 * 3; // roughly 3 months
        NodeCachedDataManager = __decorate([
            __param(0, telemetry_1.ITelemetryService),
            __param(1, environment_1.IEnvironmentService)
        ], NodeCachedDataManager);
        return NodeCachedDataManager;
    }());
    exports.NodeCachedDataManager = NodeCachedDataManager;
});
//# sourceMappingURL=nodeCachedDataManager.js.map