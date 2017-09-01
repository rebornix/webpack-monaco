define(["require", "exports"], function (require, exports) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExtHostHeapService = (function () {
        function ExtHostHeapService() {
            this._data = new Map();
        }
        ExtHostHeapService.prototype.keep = function (obj) {
            var id = ExtHostHeapService._idPool++;
            this._data.set(id, obj);
            return id;
        };
        ExtHostHeapService.prototype.delete = function (id) {
            return this._data.delete(id);
        };
        ExtHostHeapService.prototype.get = function (id) {
            return this._data.get(id);
        };
        ExtHostHeapService.prototype.$onGarbageCollection = function (ids) {
            for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
                var id = ids_1[_i];
                this.delete(id);
            }
        };
        ExtHostHeapService._idPool = 0;
        return ExtHostHeapService;
    }());
    exports.ExtHostHeapService = ExtHostHeapService;
});
//# sourceMappingURL=extHostHeapService.js.map