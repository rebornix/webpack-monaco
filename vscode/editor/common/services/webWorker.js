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
define(["require", "exports", "vs/base/common/async", "vs/editor/common/services/editorWorkerServiceImpl"], function (require, exports, async_1, editorWorkerServiceImpl_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Create a new web worker that has model syncing capabilities built in.
     * Specify an AMD module to load that will `create` an object that will be proxied.
     */
    function createWebWorker(modelService, opts) {
        return new MonacoWebWorkerImpl(modelService, opts);
    }
    exports.createWebWorker = createWebWorker;
    var MonacoWebWorkerImpl = (function (_super) {
        __extends(MonacoWebWorkerImpl, _super);
        function MonacoWebWorkerImpl(modelService, opts) {
            var _this = _super.call(this, modelService, opts.label) || this;
            _this._foreignModuleId = opts.moduleId;
            _this._foreignModuleCreateData = opts.createData || null;
            _this._foreignProxy = null;
            return _this;
        }
        MonacoWebWorkerImpl.prototype._getForeignProxy = function () {
            var _this = this;
            if (!this._foreignProxy) {
                this._foreignProxy = new async_1.ShallowCancelThenPromise(this._getProxy().then(function (proxy) {
                    return proxy.loadForeignModule(_this._foreignModuleId, _this._foreignModuleCreateData).then(function (foreignMethods) {
                        _this._foreignModuleId = null;
                        _this._foreignModuleCreateData = null;
                        var proxyMethodRequest = function (method, args) {
                            return proxy.fmr(method, args);
                        };
                        var createProxyMethod = function (method, proxyMethodRequest) {
                            return function () {
                                var args = Array.prototype.slice.call(arguments, 0);
                                return proxyMethodRequest(method, args);
                            };
                        };
                        var foreignProxy = {};
                        for (var i = 0; i < foreignMethods.length; i++) {
                            foreignProxy[foreignMethods[i]] = createProxyMethod(foreignMethods[i], proxyMethodRequest);
                        }
                        return foreignProxy;
                    });
                }));
            }
            return this._foreignProxy;
        };
        MonacoWebWorkerImpl.prototype.getProxy = function () {
            return this._getForeignProxy();
        };
        MonacoWebWorkerImpl.prototype.withSyncedResources = function (resources) {
            var _this = this;
            return this._withSyncedResources(resources).then(function (_) { return _this.getProxy(); });
        };
        return MonacoWebWorkerImpl;
    }(editorWorkerServiceImpl_1.EditorWorkerClient));
});
//# sourceMappingURL=webWorker.js.map