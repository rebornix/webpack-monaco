var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/platform/files/common/files", "../node/extHost.protocol", "vs/workbench/api/electron-browser/extHostCustomers"], function (require, exports, files_1, extHost_protocol_1, extHostCustomers_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var MainThreadFileSystemEventService = (function () {
        function MainThreadFileSystemEventService(extHostContext, fileService) {
            var proxy = extHostContext.get(extHost_protocol_1.ExtHostContext.ExtHostFileSystemEventService);
            var events = {
                created: [],
                changed: [],
                deleted: []
            };
            this._listener = fileService.onFileChanges(function (event) {
                for (var _i = 0, _a = event.changes; _i < _a.length; _i++) {
                    var change = _a[_i];
                    switch (change.type) {
                        case files_1.FileChangeType.ADDED:
                            events.created.push(change.resource);
                            break;
                        case files_1.FileChangeType.UPDATED:
                            events.changed.push(change.resource);
                            break;
                        case files_1.FileChangeType.DELETED:
                            events.deleted.push(change.resource);
                            break;
                    }
                }
                proxy.$onFileEvent(events);
                events.created.length = 0;
                events.changed.length = 0;
                events.deleted.length = 0;
            });
        }
        MainThreadFileSystemEventService.prototype.dispose = function () {
            this._listener.dispose();
        };
        MainThreadFileSystemEventService = __decorate([
            extHostCustomers_1.extHostCustomer,
            __param(1, files_1.IFileService)
        ], MainThreadFileSystemEventService);
        return MainThreadFileSystemEventService;
    }());
    exports.MainThreadFileSystemEventService = MainThreadFileSystemEventService;
});
//# sourceMappingURL=mainThreadFileSystemEventService.js.map