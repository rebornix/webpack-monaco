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
define(["require", "exports", "vs/platform/instantiation/common/instantiation", "vs/platform/environment/common/environment"], function (require, exports, instantiation_1, environment_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ILogService = instantiation_1.createDecorator('logService');
    var LogMainService = (function () {
        function LogMainService(environmentService) {
            this.environmentService = environmentService;
        }
        LogMainService.prototype.log = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this.environmentService.verbose) {
                console.log.apply(console, ["\u001B[90m[main " + new Date().toLocaleTimeString() + "]\u001B[0m"].concat(args));
            }
        };
        LogMainService.prototype.error = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.error.apply(console, ["\u001B[91m[main " + new Date().toLocaleTimeString() + "]\u001B[0m"].concat(args));
        };
        LogMainService.prototype.warn = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.warn.apply(console, ["\u001B[93m[main " + new Date().toLocaleTimeString() + "]\u001B[0m"].concat(args));
        };
        LogMainService = __decorate([
            __param(0, environment_1.IEnvironmentService)
        ], LogMainService);
        return LogMainService;
    }());
    exports.LogMainService = LogMainService;
});
//# sourceMappingURL=log.js.map