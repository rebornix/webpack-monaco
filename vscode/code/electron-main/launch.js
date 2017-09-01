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
define(["require", "exports", "vs/base/common/winjs.base", "vs/platform/log/common/log", "vs/platform/url/common/url", "vs/platform/instantiation/common/instantiation", "vs/platform/windows/common/windows", "vs/platform/windows/electron-main/windows"], function (require, exports, winjs_base_1, log_1, url_1, instantiation_1, windows_1, windows_2) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ID = 'launchService';
    exports.ILaunchService = instantiation_1.createDecorator(exports.ID);
    var LaunchChannel = (function () {
        function LaunchChannel(service) {
            this.service = service;
        }
        LaunchChannel.prototype.call = function (command, arg) {
            switch (command) {
                case 'start':
                    var _a = arg, args = _a.args, userEnv = _a.userEnv;
                    return this.service.start(args, userEnv);
                case 'get-main-process-id':
                    return this.service.getMainProcessId();
            }
            return undefined;
        };
        return LaunchChannel;
    }());
    exports.LaunchChannel = LaunchChannel;
    var LaunchChannelClient = (function () {
        function LaunchChannelClient(channel) {
            this.channel = channel;
        }
        LaunchChannelClient.prototype.start = function (args, userEnv) {
            return this.channel.call('start', { args: args, userEnv: userEnv });
        };
        LaunchChannelClient.prototype.getMainProcessId = function () {
            return this.channel.call('get-main-process-id', null);
        };
        return LaunchChannelClient;
    }());
    exports.LaunchChannelClient = LaunchChannelClient;
    var LaunchService = (function () {
        function LaunchService(logService, windowsService, urlService) {
            this.logService = logService;
            this.windowsService = windowsService;
            this.urlService = urlService;
        }
        LaunchService.prototype.start = function (args, userEnv) {
            var _this = this;
            this.logService.log('Received data from other instance: ', args, userEnv);
            // Check early for open-url which is handled in URL service
            var openUrlArg = args['open-url'] || [];
            var openUrl = typeof openUrlArg === 'string' ? [openUrlArg] : openUrlArg;
            if (openUrl.length > 0) {
                openUrl.forEach(function (url) { return _this.urlService.open(url); });
                return winjs_base_1.TPromise.as(null);
            }
            // Otherwise handle in windows service
            var context = !!userEnv['VSCODE_CLI'] ? windows_1.OpenContext.CLI : windows_1.OpenContext.DESKTOP;
            var usedWindows;
            if (!!args.extensionDevelopmentPath) {
                this.windowsService.openExtensionDevelopmentHostWindow({ context: context, cli: args, userEnv: userEnv });
            }
            else if (args._.length === 0 && (args['new-window'] || args['unity-launch'])) {
                usedWindows = this.windowsService.open({ context: context, cli: args, userEnv: userEnv, forceNewWindow: true, forceEmpty: true });
            }
            else if (args._.length === 0) {
                usedWindows = [this.windowsService.focusLastActive(args, context)];
            }
            else {
                usedWindows = this.windowsService.open({
                    context: context,
                    cli: args,
                    userEnv: userEnv,
                    forceNewWindow: args.wait || args['new-window'],
                    preferNewWindow: !args['reuse-window'],
                    forceReuseWindow: args['reuse-window'],
                    diffMode: args.diff,
                    addMode: args.add
                });
            }
            // If the other instance is waiting to be killed, we hook up a window listener if one window
            // is being used and only then resolve the startup promise which will kill this second instance
            if (args.wait && usedWindows.length === 1 && usedWindows[0]) {
                return this.windowsService.waitForWindowClose(usedWindows[0].id);
            }
            return winjs_base_1.TPromise.as(null);
        };
        LaunchService.prototype.getMainProcessId = function () {
            this.logService.log('Received request for process ID from other instance.');
            return winjs_base_1.TPromise.as(process.pid);
        };
        LaunchService = __decorate([
            __param(0, log_1.ILogService),
            __param(1, windows_2.IWindowsMainService),
            __param(2, url_1.IURLService)
        ], LaunchService);
        return LaunchService;
    }());
    exports.LaunchService = LaunchService;
});
//# sourceMappingURL=launch.js.map