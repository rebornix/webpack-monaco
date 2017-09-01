var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "vs/base/common/errors", "../node/extHost.protocol", "vs/workbench/api/electron-browser/extHostCustomers"], function (require, exports, errors_1, extHost_protocol_1, extHostCustomers_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var MainThreadErrors = (function () {
        function MainThreadErrors() {
        }
        MainThreadErrors.prototype.dispose = function () {
            //
        };
        MainThreadErrors.prototype.$onUnexpectedError = function (err, extensionId) {
            if (err.$isError) {
                var name_1 = err.name, message = err.message, stack = err.stack;
                err = new Error();
                err.message = extensionId ? "[" + extensionId + "] " + message : message;
                err.name = name_1;
                err.stack = stack;
            }
            errors_1.onUnexpectedError(err);
        };
        MainThreadErrors = __decorate([
            extHostCustomers_1.extHostNamedCustomer(extHost_protocol_1.MainContext.MainThreadErrors)
        ], MainThreadErrors);
        return MainThreadErrors;
    }());
    exports.MainThreadErrors = MainThreadErrors;
});
//# sourceMappingURL=mainThreadErrors.js.map