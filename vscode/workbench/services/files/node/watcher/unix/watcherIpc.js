/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports"], function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var WatcherChannel = (function () {
        function WatcherChannel(service) {
            this.service = service;
        }
        WatcherChannel.prototype.call = function (command, arg) {
            switch (command) {
                case 'watch': return this.service.watch(arg);
            }
            return undefined;
        };
        return WatcherChannel;
    }());
    exports.WatcherChannel = WatcherChannel;
    var WatcherChannelClient = (function () {
        function WatcherChannelClient(channel) {
            this.channel = channel;
        }
        WatcherChannelClient.prototype.watch = function (request) {
            return this.channel.call('watch', request);
        };
        return WatcherChannelClient;
    }());
    exports.WatcherChannelClient = WatcherChannelClient;
});
//# sourceMappingURL=watcherIpc.js.map