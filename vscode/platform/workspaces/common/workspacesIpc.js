/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports"], function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var WorkspacesChannel = (function () {
        function WorkspacesChannel(service) {
            this.service = service;
        }
        WorkspacesChannel.prototype.call = function (command, arg) {
            switch (command) {
                case 'createWorkspace': return this.service.createWorkspace(arg);
            }
            return void 0;
        };
        return WorkspacesChannel;
    }());
    exports.WorkspacesChannel = WorkspacesChannel;
    var WorkspacesChannelClient = (function () {
        function WorkspacesChannelClient(channel) {
            this.channel = channel;
        }
        WorkspacesChannelClient.prototype.createWorkspace = function (folders) {
            return this.channel.call('createWorkspace', folders);
        };
        return WorkspacesChannelClient;
    }());
    exports.WorkspacesChannelClient = WorkspacesChannelClient;
});
//# sourceMappingURL=workspacesIpc.js.map