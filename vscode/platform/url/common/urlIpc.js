/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/parts/ipc/common/ipc", "vs/base/common/event", "vs/platform/windows/common/windows", "vs/base/common/uri"], function (require, exports, ipc_1, event_1, windows_1, uri_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var URISerializer = function (uri) { return uri.toJSON(); };
    var URIDeserializer = function (raw) { return uri_1.default.revive(raw); };
    var URLChannel = (function () {
        function URLChannel(service, windowsService) {
            var _this = this;
            this.service = service;
            windowsService.onWindowFocus(function (id) { return _this.focusedWindowId = id; });
        }
        URLChannel.prototype.call = function (command, arg) {
            var _this = this;
            switch (command) {
                case 'event:onOpenURL': return ipc_1.eventToCall(event_1.filterEvent(this.service.onOpenURL, function () { return _this.isWindowFocused(arg); }), URISerializer);
            }
            return undefined;
        };
        /**
         * We only want the focused window to get pinged with the onOpenUrl event.
         * The idea here is to filter the onOpenUrl event with the knowledge of which
         * was the last window to be focused. When first listening to the event,
         * each client sends its window ID via the arguments to `call(...)`.
         * When the event fires, the server has enough knowledge to filter the event
         * and fire it only to the focused window.
         */
        URLChannel.prototype.isWindowFocused = function (windowID) {
            return this.focusedWindowId === windowID;
        };
        URLChannel = __decorate([
            __param(1, windows_1.IWindowsService)
        ], URLChannel);
        return URLChannel;
    }());
    exports.URLChannel = URLChannel;
    var URLChannelClient = (function () {
        function URLChannelClient(channel, windowID) {
            this.channel = channel;
            this.windowID = windowID;
            this._onOpenURL = ipc_1.eventFromCall(this.channel, 'event:onOpenURL', this.windowID, URIDeserializer);
        }
        Object.defineProperty(URLChannelClient.prototype, "onOpenURL", {
            get: function () { return this._onOpenURL; },
            enumerable: true,
            configurable: true
        });
        URLChannelClient.prototype.open = function (url) {
            return; // not implemented
        };
        return URLChannelClient;
    }());
    exports.URLChannelClient = URLChannelClient;
});
//# sourceMappingURL=urlIpc.js.map