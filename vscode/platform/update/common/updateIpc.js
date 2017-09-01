/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/winjs.base", "vs/base/parts/ipc/common/ipc", "vs/base/common/event", "vs/base/common/errors", "./update"], function (require, exports, winjs_base_1, ipc_1, event_1, errors_1, update_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var UpdateChannel = (function () {
        function UpdateChannel(service) {
            this.service = service;
        }
        UpdateChannel.prototype.call = function (command, arg) {
            switch (command) {
                case 'event:onError': return ipc_1.eventToCall(this.service.onError);
                case 'event:onUpdateAvailable': return ipc_1.eventToCall(this.service.onUpdateAvailable);
                case 'event:onUpdateNotAvailable': return ipc_1.eventToCall(this.service.onUpdateNotAvailable);
                case 'event:onUpdateReady': return ipc_1.eventToCall(this.service.onUpdateReady);
                case 'event:onStateChange': return ipc_1.eventToCall(this.service.onStateChange);
                case 'checkForUpdates': return this.service.checkForUpdates(arg);
                case 'quitAndInstall': return this.service.quitAndInstall();
                case '_getInitialState': return winjs_base_1.TPromise.as(this.service.state);
            }
            return undefined;
        };
        return UpdateChannel;
    }());
    exports.UpdateChannel = UpdateChannel;
    var UpdateChannelClient = (function () {
        function UpdateChannelClient(channel) {
            var _this = this;
            this.channel = channel;
            this._onError = ipc_1.eventFromCall(this.channel, 'event:onError');
            this._onUpdateAvailable = ipc_1.eventFromCall(this.channel, 'event:onUpdateAvailable');
            this._onUpdateNotAvailable = ipc_1.eventFromCall(this.channel, 'event:onUpdateNotAvailable');
            this._onUpdateReady = ipc_1.eventFromCall(this.channel, 'event:onUpdateReady');
            this._onRemoteStateChange = ipc_1.eventFromCall(this.channel, 'event:onStateChange');
            this._onStateChange = new event_1.Emitter();
            this._state = update_1.State.Uninitialized;
            // always set this._state as the state changes
            this.onStateChange(function (state) { return _this._state = state; });
            channel.call('_getInitialState').done(function (state) {
                // fire initial state
                _this._onStateChange.fire(state);
                // fire subsequent states as they come in from remote
                _this._onRemoteStateChange(function (state) { return _this._onStateChange.fire(state); });
            }, errors_1.onUnexpectedError);
        }
        Object.defineProperty(UpdateChannelClient.prototype, "onError", {
            get: function () { return this._onError; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateChannelClient.prototype, "onUpdateAvailable", {
            get: function () { return this._onUpdateAvailable; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateChannelClient.prototype, "onUpdateNotAvailable", {
            get: function () { return this._onUpdateNotAvailable; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateChannelClient.prototype, "onUpdateReady", {
            get: function () { return this._onUpdateReady; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateChannelClient.prototype, "onStateChange", {
            get: function () { return this._onStateChange.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UpdateChannelClient.prototype, "state", {
            get: function () { return this._state; },
            enumerable: true,
            configurable: true
        });
        ;
        UpdateChannelClient.prototype.checkForUpdates = function (explicit) {
            return this.channel.call('checkForUpdates', explicit);
        };
        UpdateChannelClient.prototype.quitAndInstall = function () {
            return this.channel.call('quitAndInstall');
        };
        return UpdateChannelClient;
    }());
    exports.UpdateChannelClient = UpdateChannelClient;
});
//# sourceMappingURL=updateIpc.js.map