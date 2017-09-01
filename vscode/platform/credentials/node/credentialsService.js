define(["require", "exports", "vs/base/common/winjs.base", "keytar"], function (require, exports, winjs_base_1, keytar) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var CredentialsService = (function () {
        function CredentialsService() {
        }
        CredentialsService.prototype.readSecret = function (service, account) {
            return winjs_base_1.TPromise.wrap(keytar.getPassword(service, account))
                .then(function (result) { return result === null ? undefined : result; });
        };
        CredentialsService.prototype.writeSecret = function (service, account, secret) {
            return winjs_base_1.TPromise.wrap(keytar.setPassword(service, account, secret));
        };
        CredentialsService.prototype.deleteSecret = function (service, account) {
            return winjs_base_1.TPromise.wrap(keytar.deletePassword(service, account));
        };
        return CredentialsService;
    }());
    exports.CredentialsService = CredentialsService;
});
//# sourceMappingURL=credentialsService.js.map