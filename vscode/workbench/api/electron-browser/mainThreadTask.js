var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/common/winjs.base", "vs/workbench/parts/tasks/common/taskService", "../node/extHost.protocol", "vs/workbench/api/electron-browser/extHostCustomers"], function (require, exports, winjs_base_1, taskService_1, extHost_protocol_1, extHostCustomers_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var MainThreadTask = (function () {
        function MainThreadTask(extHostContext, _taskService) {
            this._taskService = _taskService;
            this._proxy = extHostContext.get(extHost_protocol_1.ExtHostContext.ExtHostTask);
            this._activeHandles = Object.create(null);
        }
        MainThreadTask.prototype.dispose = function () {
            var _this = this;
            Object.keys(this._activeHandles).forEach(function (handle) {
                _this._taskService.unregisterTaskProvider(parseInt(handle, 10));
            });
            this._activeHandles = Object.create(null);
        };
        MainThreadTask.prototype.$registerTaskProvider = function (handle) {
            var _this = this;
            this._taskService.registerTaskProvider(handle, {
                provideTasks: function () {
                    return _this._proxy.$provideTasks(handle);
                }
            });
            this._activeHandles[handle] = true;
            return winjs_base_1.TPromise.as(undefined);
        };
        MainThreadTask.prototype.$unregisterTaskProvider = function (handle) {
            this._taskService.unregisterTaskProvider(handle);
            delete this._activeHandles[handle];
            return winjs_base_1.TPromise.as(undefined);
        };
        MainThreadTask = __decorate([
            extHostCustomers_1.extHostNamedCustomer(extHost_protocol_1.MainContext.MainThreadTask),
            __param(1, taskService_1.ITaskService)
        ], MainThreadTask);
        return MainThreadTask;
    }());
    exports.MainThreadTask = MainThreadTask;
});
//# sourceMappingURL=mainThreadTask.js.map