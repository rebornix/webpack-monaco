/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/common/strings", "vs/workbench/services/extensions/node/rpcProtocol", "vs/workbench/services/thread/node/abstractThreadService", "vs/platform/environment/common/environment"], function (require, exports, strings, rpcProtocol_1, abstractThreadService_1, environment_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    // Enable to see detailed message communication between window and extension host
    var logExtensionHostCommunication = false;
    function asLoggingProtocol(protocol) {
        protocol.onMessage(function (msg) {
            console.log('%c[Extension \u2192 Window]%c[len: ' + strings.pad(msg.length, 5, ' ') + ']', 'color: darkgreen', 'color: grey', msg);
        });
        return {
            onMessage: protocol.onMessage,
            send: function (msg) {
                protocol.send(msg);
                console.log('%c[Window \u2192 Extension]%c[len: ' + strings.pad(msg.length, 5, ' ') + ']', 'color: darkgreen', 'color: grey', msg);
            }
        };
    }
    var MainThreadService = (function (_super) {
        __extends(MainThreadService, _super);
        function MainThreadService(protocol, environmentService) {
            var _this = this;
            if (logExtensionHostCommunication || environmentService.logExtensionHostCommunication) {
                protocol = asLoggingProtocol(protocol);
            }
            _this = _super.call(this, new rpcProtocol_1.RPCProtocol(protocol), true) || this;
            return _this;
        }
        MainThreadService = __decorate([
            __param(1, environment_1.IEnvironmentService)
        ], MainThreadService);
        return MainThreadService;
    }(abstractThreadService_1.AbstractThreadService));
    exports.MainThreadService = MainThreadService;
});
//# sourceMappingURL=threadService.js.map