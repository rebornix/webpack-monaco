var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/common/winjs.base", "vs/base/common/arrays", "../node/extHost.protocol", "vs/workbench/api/electron-browser/extHostCustomers", "vs/platform/windows/common/windows"], function (require, exports, winjs_base_1, arrays_1, extHost_protocol_1, extHostCustomers_1, windows_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var MainThreadDialogs = (function () {
        function MainThreadDialogs(context, _windowService) {
            this._windowService = _windowService;
            //
        }
        MainThreadDialogs_1 = MainThreadDialogs;
        MainThreadDialogs.prototype.dispose = function () {
            //
        };
        MainThreadDialogs.prototype.$showOpenDialog = function (options) {
            var _this = this;
            // TODO@joh what about remote dev setup?
            if (options.uri && options.uri.scheme !== 'file') {
                return winjs_base_1.TPromise.wrapError(new Error('bad path'));
            }
            return new winjs_base_1.TPromise(function (resolve) {
                _this._windowService.showOpenDialog(MainThreadDialogs_1._convertOptions(options), function (filenames) {
                    resolve(arrays_1.isFalsyOrEmpty(filenames) ? undefined : filenames);
                });
            });
        };
        MainThreadDialogs._convertOptions = function (options) {
            var result = {
                properties: ['createDirectory']
            };
            if (options.openLabel) {
                result.buttonLabel = options.openLabel;
            }
            if (options.uri) {
                result.defaultPath = options.uri.fsPath;
            }
            if (!options.openFiles && !options.openFolders) {
                options.openFiles = true;
            }
            if (options.openFiles) {
                result.properties.push('openFile');
            }
            if (options.openFolders) {
                result.properties.push('openDirectory');
            }
            if (options.openMany) {
                result.properties.push('multiSelections');
            }
            return result;
        };
        MainThreadDialogs = MainThreadDialogs_1 = __decorate([
            extHostCustomers_1.extHostNamedCustomer(extHost_protocol_1.MainContext.MainThreadDialogs),
            __param(1, windows_1.IWindowService)
        ], MainThreadDialogs);
        return MainThreadDialogs;
        var MainThreadDialogs_1;
    }());
    exports.MainThreadDialogs = MainThreadDialogs;
});
//# sourceMappingURL=mainThreadDialogs.js.map