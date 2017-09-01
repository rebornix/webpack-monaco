var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "../node/extHost.protocol", "vs/platform/credentials/common/credentials", "vs/workbench/api/electron-browser/extHostCustomers"], function (require, exports, extHost_protocol_1, credentials_1, extHostCustomers_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var MainThreadCredentials = (function () {
        function MainThreadCredentials(extHostContext, _credentialsService) {
            this._credentialsService = _credentialsService;
            this._proxy = extHostContext.get(extHost_protocol_1.ExtHostContext.ExtHostCredentials);
        }
        MainThreadCredentials.prototype.dispose = function () {
        };
        MainThreadCredentials.prototype.$readSecret = function (service, account) {
            return this._credentialsService.readSecret(service, account);
        };
        MainThreadCredentials.prototype.$writeSecret = function (service, account, secret) {
            return this._credentialsService.writeSecret(service, account, secret);
        };
        MainThreadCredentials.prototype.$deleteSecret = function (service, account) {
            return this._credentialsService.deleteSecret(service, account);
        };
        MainThreadCredentials = __decorate([
            extHostCustomers_1.extHostNamedCustomer(extHost_protocol_1.MainContext.MainThreadCredentials),
            __param(1, credentials_1.ICredentialsService)
        ], MainThreadCredentials);
        return MainThreadCredentials;
    }());
    exports.MainThreadCredentials = MainThreadCredentials;
});
//# sourceMappingURL=mainThreadCredentials.js.map