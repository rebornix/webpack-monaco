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
define(["require", "exports", "vs/base/common/winjs.base", "../node/extHost.protocol", "gc-signals", "vs/platform/instantiation/common/instantiation", "vs/platform/instantiation/common/extensions", "vs/base/common/event", "vs/workbench/api/electron-browser/extHostCustomers"], function (require, exports, winjs_base_1, extHost_protocol_1, gc_signals_1, instantiation_1, extensions_1, event_1, extHostCustomers_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IHeapService = instantiation_1.createDecorator('heapService');
    var HeapService = (function () {
        function HeapService() {
            var _this = this;
            this._onGarbageCollection = new event_1.Emitter();
            this.onGarbageCollection = this._onGarbageCollection.event;
            this._activeSignals = new WeakMap();
            this._activeIds = new Set();
            this._consumeHandle = setInterval(function () {
                var ids = gc_signals_1.consumeSignals();
                if (ids.length > 0) {
                    // local book-keeping
                    for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                        var id = ids_1[_i];
                        _this._activeIds.delete(id);
                    }
                    // fire event
                    _this._onGarbageCollection.fire(ids);
                }
            }, 15 * 1000);
        }
        HeapService.prototype.dispose = function () {
            clearInterval(this._consumeHandle);
        };
        HeapService.prototype.trackRecursive = function (obj) {
            var _this = this;
            if (winjs_base_1.TPromise.is(obj)) {
                return obj.then(function (result) { return _this.trackRecursive(result); });
            }
            else {
                return this._doTrackRecursive(obj);
            }
        };
        HeapService.prototype._doTrackRecursive = function (obj) {
            var stack = [obj];
            while (stack.length > 0) {
                // remove first element
                var obj_1 = stack.shift();
                if (!obj_1 || typeof obj_1 !== 'object') {
                    continue;
                }
                for (var key in obj_1) {
                    if (!Object.prototype.hasOwnProperty.call(obj_1, key)) {
                        continue;
                    }
                    var value = obj_1[key];
                    // recurse -> object/array
                    if (typeof value === 'object') {
                        stack.push(value);
                    }
                    else if (key === extHost_protocol_1.ObjectIdentifier.name) {
                        // track new $ident-objects
                        if (typeof value === 'number' && !this._activeIds.has(value)) {
                            this._activeIds.add(value);
                            this._activeSignals.set(obj_1, new gc_signals_1.GCSignal(value));
                        }
                    }
                }
            }
            return obj;
        };
        return HeapService;
    }());
    exports.HeapService = HeapService;
    var MainThreadHeapService = (function () {
        function MainThreadHeapService(extHostContext, heapService) {
            var proxy = extHostContext.get(extHost_protocol_1.ExtHostContext.ExtHostHeapService);
            this._toDispose = heapService.onGarbageCollection(function (ids) {
                // send to ext host
                proxy.$onGarbageCollection(ids);
            });
        }
        MainThreadHeapService.prototype.dispose = function () {
            this._toDispose.dispose();
        };
        MainThreadHeapService = __decorate([
            extHostCustomers_1.extHostCustomer,
            __param(1, exports.IHeapService)
        ], MainThreadHeapService);
        return MainThreadHeapService;
    }());
    exports.MainThreadHeapService = MainThreadHeapService;
    extensions_1.registerSingleton(exports.IHeapService, HeapService);
});
//# sourceMappingURL=mainThreadHeapService.js.map