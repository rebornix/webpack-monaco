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
define(["require", "exports", "vs/nls", "vs/base/node/pfs", "vs/base/common/platform", "vs/platform/node/product", "vs/platform/contextkey/common/contextkey", "vs/platform/instantiation/common/instantiation", "vs/platform/lifecycle/common/lifecycle", "vs/workbench/services/panel/common/panelService", "vs/workbench/services/part/common/partService", "vs/platform/configuration/common/configuration", "vs/workbench/services/configuration/common/configurationEditing", "vs/platform/quickOpen/common/quickOpen", "vs/workbench/parts/terminal/common/terminal", "vs/workbench/parts/terminal/common/terminalService", "vs/workbench/parts/terminal/electron-browser/terminalConfigHelper", "vs/workbench/parts/terminal/electron-browser/terminalInstance", "vs/base/common/winjs.base", "vs/platform/message/common/message", "vs/base/common/severity", "vs/platform/storage/common/storage", "vs/workbench/parts/terminal/electron-browser/terminal", "vs/platform/windows/common/windows"], function (require, exports, nls, pfs, platform, product_1, contextkey_1, instantiation_1, lifecycle_1, panelService_1, partService_1, configuration_1, configurationEditing_1, quickOpen_1, terminal_1, terminalService_1, terminalConfigHelper_1, terminalInstance_1, winjs_base_1, message_1, severity_1, storage_1, terminal_2, windows_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TerminalService = (function (_super) {
        __extends(TerminalService, _super);
        function TerminalService(_contextKeyService, _configurationService, _panelService, _partService, _lifecycleService, _instantiationService, _windowService, _quickOpenService, _configurationEditingService, _choiceService, _storageService) {
            var _this = _super.call(this, _contextKeyService, _configurationService, _panelService, _partService, _lifecycleService) || this;
            _this._instantiationService = _instantiationService;
            _this._windowService = _windowService;
            _this._quickOpenService = _quickOpenService;
            _this._configurationEditingService = _configurationEditingService;
            _this._choiceService = _choiceService;
            _this._storageService = _storageService;
            _this._configHelper = _this._instantiationService.createInstance(terminalConfigHelper_1.TerminalConfigHelper, platform.platform);
            return _this;
        }
        Object.defineProperty(TerminalService.prototype, "configHelper", {
            get: function () { return this._configHelper; },
            enumerable: true,
            configurable: true
        });
        ;
        TerminalService.prototype.createInstance = function (shell, wasNewTerminalAction) {
            if (shell === void 0) { shell = {}; }
            var terminalInstance = this._instantiationService.createInstance(terminalInstance_1.TerminalInstance, this._terminalFocusContextKey, this._configHelper, this._terminalContainer, shell);
            terminalInstance.addDisposable(terminalInstance.onTitleChanged(this._onInstanceTitleChanged.fire, this._onInstanceTitleChanged));
            terminalInstance.addDisposable(terminalInstance.onDisposed(this._onInstanceDisposed.fire, this._onInstanceDisposed));
            terminalInstance.addDisposable(terminalInstance.onDataForApi(this._onInstanceData.fire, this._onInstanceData));
            terminalInstance.addDisposable(terminalInstance.onProcessIdReady(this._onInstanceProcessIdReady.fire, this._onInstanceProcessIdReady));
            this.terminalInstances.push(terminalInstance);
            if (this.terminalInstances.length === 1) {
                // It's the first instance so it should be made active automatically
                this.setActiveInstanceByIndex(0);
            }
            this._onInstancesChanged.fire();
            this._suggestShellChange(wasNewTerminalAction);
            return terminalInstance;
        };
        TerminalService.prototype.focusFindWidget = function () {
            var _this = this;
            return this.showPanel(false).then(function () {
                var panel = _this._panelService.getActivePanel();
                panel.focusFindWidget();
                _this._findWidgetVisible.set(true);
            });
        };
        TerminalService.prototype.hideFindWidget = function () {
            var panel = this._panelService.getActivePanel();
            if (panel && panel.getId() === terminal_1.TERMINAL_PANEL_ID) {
                panel.hideFindWidget();
                this._findWidgetVisible.reset();
                panel.focus();
            }
        };
        TerminalService.prototype.showNextFindTermFindWidget = function () {
            var panel = this._panelService.getActivePanel();
            if (panel && panel.getId() === terminal_1.TERMINAL_PANEL_ID) {
                panel.showNextFindTermFindWidget();
            }
        };
        TerminalService.prototype.showPreviousFindTermFindWidget = function () {
            var panel = this._panelService.getActivePanel();
            if (panel && panel.getId() === terminal_1.TERMINAL_PANEL_ID) {
                panel.showPreviousFindTermFindWidget();
            }
        };
        TerminalService.prototype._suggestShellChange = function (wasNewTerminalAction) {
            var _this = this;
            // Only suggest on Windows since $SHELL works great for macOS/Linux
            if (!platform.isWindows) {
                return;
            }
            // Only suggest when the terminal instance is being created by an explicit user action to
            // launch a terminal, as opposed to something like tasks, debug, panel restore, etc.
            if (!wasNewTerminalAction) {
                return;
            }
            // Don't suggest if the user has explicitly opted out
            var neverSuggest = this._storageService.getBoolean(terminal_1.NEVER_SUGGEST_SELECT_WINDOWS_SHELL_STORAGE_KEY, storage_1.StorageScope.GLOBAL, false);
            if (neverSuggest) {
                return;
            }
            // Never suggest if the setting is non-default already (ie. they set the setting manually)
            if (this._configHelper.config.shell.windows !== terminal_2.TERMINAL_DEFAULT_SHELL_WINDOWS) {
                this._storageService.store(terminal_1.NEVER_SUGGEST_SELECT_WINDOWS_SHELL_STORAGE_KEY, true);
                return;
            }
            var message = nls.localize('terminal.integrated.chooseWindowsShellInfo', "You can change the default terminal shell by selecting the customize button.");
            var options = [nls.localize('customize', "Customize"), nls.localize('cancel', "Cancel"), nls.localize('never again', "OK, Never Show Again")];
            this._choiceService.choose(severity_1.default.Info, message, options, 1).then(function (choice) {
                switch (choice) {
                    case 0:
                        return _this.selectDefaultWindowsShell().then(function (shell) {
                            if (!shell) {
                                return winjs_base_1.TPromise.as(null);
                            }
                            // Launch a new instance with the newly selected shell
                            var instance = _this.createInstance({
                                executable: shell,
                                args: _this._configHelper.config.shellArgs.windows
                            });
                            if (instance) {
                                _this.setActiveInstance(instance);
                            }
                            return winjs_base_1.TPromise.as(null);
                        });
                    case 1:
                        return winjs_base_1.TPromise.as(null);
                    case 2:
                        _this._storageService.store(terminal_1.NEVER_SUGGEST_SELECT_WINDOWS_SHELL_STORAGE_KEY, true);
                    default:
                        return winjs_base_1.TPromise.as(null);
                }
            });
        };
        TerminalService.prototype.selectDefaultWindowsShell = function () {
            var _this = this;
            return this._detectWindowsShells().then(function (shells) {
                var options = {
                    placeHolder: nls.localize('terminal.integrated.chooseWindowsShell', "Select your preferred terminal shell, you can change this later in your settings")
                };
                return _this._quickOpenService.pick(shells, options).then(function (value) {
                    if (!value) {
                        return null;
                    }
                    var shell = value.description;
                    var configChange = { key: 'terminal.integrated.shell.windows', value: shell };
                    return _this._configurationEditingService.writeConfiguration(configurationEditing_1.ConfigurationTarget.USER, configChange).then(function () { return shell; });
                });
            });
        };
        TerminalService.prototype._detectWindowsShells = function () {
            var _this = this;
            // Determine the correct System32 path. We want to point to Sysnative
            // when the 32-bit version of VS Code is running on a 64-bit machine.
            // The reason for this is because PowerShell's important PSReadline
            // module doesn't work if this is not the case. See #27915.
            var is32ProcessOn64Windows = process.env.hasOwnProperty('PROCESSOR_ARCHITEW6432');
            var system32Path = process.env['windir'] + "\\" + (is32ProcessOn64Windows ? 'Sysnative' : 'System32');
            var expectedLocations = {
                'Command Prompt': [system32Path + "\\cmd.exe"],
                PowerShell: [system32Path + "\\WindowsPowerShell\\v1.0\\powershell.exe"],
                'WSL Bash': [system32Path + "\\bash.exe"],
                'Git Bash': [
                    process.env['ProgramW6432'] + "\\Git\\bin\\bash.exe",
                    process.env['ProgramW6432'] + "\\Git\\usr\\bin\\bash.exe",
                    process.env['ProgramFiles'] + "\\Git\\bin\\bash.exe",
                    process.env['ProgramFiles'] + "\\Git\\usr\\bin\\bash.exe",
                ]
            };
            var promises = [];
            Object.keys(expectedLocations).forEach(function (key) { return promises.push(_this._validateShellPaths(key, expectedLocations[key])); });
            return winjs_base_1.TPromise.join(promises).then(function (results) {
                return results.filter(function (result) { return !!result; }).map(function (result) {
                    return {
                        label: result[0],
                        description: result[1]
                    };
                });
            });
        };
        TerminalService.prototype._validateShellPaths = function (label, potentialPaths) {
            var _this = this;
            var current = potentialPaths.shift();
            return pfs.fileExists(current).then(function (exists) {
                if (!exists) {
                    if (potentialPaths.length === 0) {
                        return null;
                    }
                    return _this._validateShellPaths(label, potentialPaths);
                }
                return [label, current];
            });
        };
        TerminalService.prototype.getActiveOrCreateInstance = function (wasNewTerminalAction) {
            var activeInstance = this.getActiveInstance();
            return activeInstance ? activeInstance : this.createInstance(undefined, wasNewTerminalAction);
        };
        TerminalService.prototype._showTerminalCloseConfirmation = function () {
            var cancelId = 1;
            var message;
            if (this.terminalInstances.length === 1) {
                message = nls.localize('terminalService.terminalCloseConfirmationSingular', "There is an active terminal session, do you want to kill it?");
            }
            else {
                message = nls.localize('terminalService.terminalCloseConfirmationPlural', "There are {0} active terminal sessions, do you want to kill them?", this.terminalInstances.length);
            }
            var opts = {
                title: product_1.default.nameLong,
                message: message,
                type: 'warning',
                buttons: [nls.localize('yes', "Yes"), nls.localize('cancel', "Cancel")],
                noLink: true,
                cancelId: cancelId
            };
            return this._windowService.showMessageBox(opts) === cancelId;
        };
        TerminalService.prototype.setContainers = function (panelContainer, terminalContainer) {
            var _this = this;
            this._configHelper.panelContainer = panelContainer;
            this._terminalContainer = terminalContainer;
            this._terminalInstances.forEach(function (terminalInstance) {
                terminalInstance.attachToElement(_this._terminalContainer);
            });
        };
        TerminalService = __decorate([
            __param(0, contextkey_1.IContextKeyService),
            __param(1, configuration_1.IConfigurationService),
            __param(2, panelService_1.IPanelService),
            __param(3, partService_1.IPartService),
            __param(4, lifecycle_1.ILifecycleService),
            __param(5, instantiation_1.IInstantiationService),
            __param(6, windows_1.IWindowService),
            __param(7, quickOpen_1.IQuickOpenService),
            __param(8, configurationEditing_1.IConfigurationEditingService),
            __param(9, message_1.IChoiceService),
            __param(10, storage_1.IStorageService)
        ], TerminalService);
        return TerminalService;
    }(terminalService_1.TerminalService));
    exports.TerminalService = TerminalService;
});
//# sourceMappingURL=terminalService.js.map