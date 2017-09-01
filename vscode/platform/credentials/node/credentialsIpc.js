/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports"], function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var CredentialsChannel = (function () {
        function CredentialsChannel(service) {
            this.service = service;
        }
        CredentialsChannel.prototype.call = function (command, arg) {
            switch (command) {
                case 'readSecret': return this.service.readSecret(arg.service, arg.account);
                case 'writeSecret': return this.service.writeSecret(arg.service, arg.account, arg.secret);
                case 'deleteSecret': return this.service.deleteSecret(arg.service, arg.account);
            }
            return undefined;
        };
        return CredentialsChannel;
    }());
    exports.CredentialsChannel = CredentialsChannel;
    var CredentialsChannelClient = (function () {
        function CredentialsChannelClient(channel) {
            this.channel = channel;
        }
        CredentialsChannelClient.prototype.readSecret = function (service, account) {
            return this.channel.call('readSecret', { service: service, account: account });
        };
        CredentialsChannelClient.prototype.writeSecret = function (service, account, secret) {
            return this.channel.call('writeSecret', { service: service, account: account, secret: secret });
        };
        CredentialsChannelClient.prototype.deleteSecret = function (service, account) {
            return this.channel.call('deleteSecret', { service: service, account: account });
        };
        return CredentialsChannelClient;
    }());
    exports.CredentialsChannelClient = CredentialsChannelClient;
});
//# sourceMappingURL=credentialsIpc.js.map