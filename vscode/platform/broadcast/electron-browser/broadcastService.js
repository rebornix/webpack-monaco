/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/platform/instantiation/common/instantiation", "vs/base/common/event", "electron"], function (require, exports, instantiation_1, event_1, electron_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IBroadcastService = instantiation_1.createDecorator('broadcastService');
    var BroadcastService = (function () {
        function BroadcastService(windowId) {
            this.windowId = windowId;
            this._onBroadcast = new event_1.Emitter();
            this.registerListeners();
        }
        BroadcastService.prototype.registerListeners = function () {
            var _this = this;
            electron_1.ipcRenderer.on('vscode:broadcast', function (event, b) {
                _this._onBroadcast.fire(b);
            });
        };
        Object.defineProperty(BroadcastService.prototype, "onBroadcast", {
            get: function () {
                return this._onBroadcast.event;
            },
            enumerable: true,
            configurable: true
        });
        BroadcastService.prototype.broadcast = function (b) {
            electron_1.ipcRenderer.send('vscode:broadcast', this.windowId, {
                channel: b.channel,
                payload: b.payload
            });
        };
        return BroadcastService;
    }());
    exports.BroadcastService = BroadcastService;
});
//# sourceMappingURL=broadcastService.js.map