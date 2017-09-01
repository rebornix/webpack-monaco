define(["require", "exports", "vs/workbench/api/node/extHost.protocol"], function (require, exports, extHost_protocol_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExtHostCredentials = (function () {
        function ExtHostCredentials(mainContext) {
            this._proxy = mainContext.get(extHost_protocol_1.MainContext.MainThreadCredentials);
        }
        ;
        ExtHostCredentials.prototype.readSecret = function (service, account) {
            return this._proxy.$readSecret(service, account);
        };
        ExtHostCredentials.prototype.writeSecret = function (service, account, secret) {
            return this._proxy.$writeSecret(service, account, secret);
        };
        ExtHostCredentials.prototype.deleteSecret = function (service, account) {
            return this._proxy.$deleteSecret(service, account);
        };
        return ExtHostCredentials;
    }());
    exports.ExtHostCredentials = ExtHostCredentials;
});
//# sourceMappingURL=extHostCredentials.js.map