/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports"], function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var SearchWorkerChannel = (function () {
        function SearchWorkerChannel(worker) {
            this.worker = worker;
        }
        SearchWorkerChannel.prototype.call = function (command, arg) {
            switch (command) {
                case 'initialize': return this.worker.initialize();
                case 'search': return this.worker.search(arg);
                case 'cancel': return this.worker.cancel();
            }
            return undefined;
        };
        return SearchWorkerChannel;
    }());
    exports.SearchWorkerChannel = SearchWorkerChannel;
    var SearchWorkerChannelClient = (function () {
        function SearchWorkerChannelClient(channel) {
            this.channel = channel;
        }
        SearchWorkerChannelClient.prototype.initialize = function () {
            return this.channel.call('initialize');
        };
        SearchWorkerChannelClient.prototype.search = function (args) {
            return this.channel.call('search', args);
        };
        SearchWorkerChannelClient.prototype.cancel = function () {
            return this.channel.call('cancel');
        };
        return SearchWorkerChannelClient;
    }());
    exports.SearchWorkerChannelClient = SearchWorkerChannelClient;
});
//# sourceMappingURL=searchWorkerIpc.js.map