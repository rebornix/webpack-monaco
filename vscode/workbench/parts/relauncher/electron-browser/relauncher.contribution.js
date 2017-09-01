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
define(["require", "exports", "vs/base/common/lifecycle", "vs/workbench/common/contributions", "vs/platform/registry/common/platform", "vs/platform/message/common/message", "vs/workbench/parts/preferences/common/preferences", "vs/platform/windows/common/windows", "vs/platform/configuration/common/configuration", "vs/nls", "vs/platform/environment/common/environment", "vs/platform/workspace/common/workspace", "vs/platform/extensions/common/extensions"], function (require, exports, lifecycle_1, contributions_1, platform_1, message_1, preferences_1, windows_1, configuration_1, nls_1, environment_1, workspace_1, extensions_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var SettingsChangeRelauncher = (function () {
        function SettingsChangeRelauncher(windowsService, windowService, configurationService, preferencesService, envService, messageService, contextService, extensionService) {
            this.windowsService = windowsService;
            this.windowService = windowService;
            this.configurationService = configurationService;
            this.preferencesService = preferencesService;
            this.envService = envService;
            this.messageService = messageService;
            this.contextService = contextService;
            this.extensionService = extensionService;
            this.toDispose = [];
            var workspace = this.contextService.getWorkspace();
            if (workspace) {
                this.rootCount = workspace.roots.length;
                this.firstRootPath = workspace.roots.length > 0 ? workspace.roots[0].fsPath : void 0;
            }
            else {
                this.rootCount = 0;
            }
            this.onConfigurationChange(configurationService.getConfiguration(), false);
            this.registerListeners();
        }
        SettingsChangeRelauncher.prototype.registerListeners = function () {
            var _this = this;
            this.toDispose.push(this.configurationService.onDidUpdateConfiguration(function (e) { return _this.onConfigurationChange(_this.configurationService.getConfiguration(), true); }));
            this.toDispose.push(this.contextService.onDidChangeWorkspaceRoots(function () { return _this.onDidChangeWorkspaceRoots(); }));
        };
        SettingsChangeRelauncher.prototype.onConfigurationChange = function (config, notify) {
            var _this = this;
            var changed = false;
            // Titlebar style
            if (config.window && config.window.titleBarStyle !== this.titleBarStyle && (config.window.titleBarStyle === 'native' || config.window.titleBarStyle === 'custom')) {
                this.titleBarStyle = config.window.titleBarStyle;
                changed = true;
            }
            // Native tabs
            if (config.window && typeof config.window.nativeTabs === 'boolean' && config.window.nativeTabs !== this.nativeTabs) {
                this.nativeTabs = config.window.nativeTabs;
                changed = true;
            }
            // Update channel
            if (config.update && typeof config.update.channel === 'string' && config.update.channel !== this.updateChannel) {
                this.updateChannel = config.update.channel;
                changed = true;
            }
            // Crash reporter
            if (config.telemetry && typeof config.telemetry.enableCrashReporter === 'boolean' && config.telemetry.enableCrashReporter !== this.enableCrashReporter) {
                this.enableCrashReporter = config.telemetry.enableCrashReporter;
                changed = true;
            }
            // Notify only when changed and we are the focused window (avoids notification spam across windows)
            if (notify && changed) {
                this.doConfirm(nls_1.localize('relaunchSettingMessage', "A setting has changed that requires a restart to take effect."), nls_1.localize('relaunchSettingDetail', "Press the restart button to restart {0} and enable the setting.", this.envService.appNameLong), nls_1.localize('restart', "Restart"), function () { return _this.windowsService.relaunch(Object.create(null)); });
            }
        };
        SettingsChangeRelauncher.prototype.onDidChangeWorkspaceRoots = function () {
            var _this = this;
            var workspace = this.contextService.getWorkspace();
            var newRootCount = workspace ? workspace.roots.length : 0;
            var newFirstRootPath = workspace && workspace.roots.length > 0 ? workspace.roots[0].fsPath : void 0;
            var reloadWindow = false;
            var reloadExtensionHost = false;
            if (this.rootCount === 0 && newRootCount > 0) {
                reloadWindow = true; // transition: from 0 folders to 1+
            }
            else if (this.rootCount > 0 && newRootCount === 0) {
                reloadWindow = true; // transition: from 1+ folders to 0
            }
            if (this.firstRootPath !== newFirstRootPath) {
                reloadExtensionHost = true; // first root folder changed (impact on deprecated workspace.rootPath API)
            }
            this.rootCount = newRootCount;
            this.firstRootPath = newFirstRootPath;
            // Reload window if this is needed
            if (reloadWindow) {
                this.doConfirm(nls_1.localize('relaunchWorkspaceMessage', "This workspace change requires a reload of our extension system."), void 0, nls_1.localize('reload', "Reload"), function () { return _this.windowService.reloadWindow(); });
            }
            else if (reloadExtensionHost) {
                this.extensionService.restartExtensionHost();
            }
        };
        SettingsChangeRelauncher.prototype.doConfirm = function (message, detail, primaryButton, confirmed) {
            var _this = this;
            this.windowService.isFocused().then(function (focused) {
                if (focused) {
                    var confirm_1 = _this.messageService.confirm({
                        type: 'info',
                        message: message,
                        detail: detail,
                        primaryButton: primaryButton
                    });
                    if (confirm_1) {
                        confirmed();
                    }
                }
            });
        };
        SettingsChangeRelauncher.prototype.getId = function () {
            return 'workbench.relauncher';
        };
        SettingsChangeRelauncher.prototype.dispose = function () {
            this.toDispose = lifecycle_1.dispose(this.toDispose);
        };
        SettingsChangeRelauncher = __decorate([
            __param(0, windows_1.IWindowsService),
            __param(1, windows_1.IWindowService),
            __param(2, configuration_1.IConfigurationService),
            __param(3, preferences_1.IPreferencesService),
            __param(4, environment_1.IEnvironmentService),
            __param(5, message_1.IMessageService),
            __param(6, workspace_1.IWorkspaceContextService),
            __param(7, extensions_1.IExtensionService)
        ], SettingsChangeRelauncher);
        return SettingsChangeRelauncher;
    }());
    exports.SettingsChangeRelauncher = SettingsChangeRelauncher;
    var workbenchRegistry = platform_1.Registry.as(contributions_1.Extensions.Workbench);
    workbenchRegistry.registerWorkbenchContribution(SettingsChangeRelauncher);
});
//# sourceMappingURL=relauncher.contribution.js.map