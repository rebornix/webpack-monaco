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
define(["require", "exports", "vs/base/common/errors", "vs/base/common/event", "vs/platform/contextkey/common/contextkey", "vs/platform/lifecycle/common/lifecycle", "vs/workbench/services/panel/common/panelService", "vs/workbench/services/part/common/partService", "vs/platform/configuration/common/configuration", "vs/workbench/parts/terminal/common/terminal", "vs/base/common/winjs.base"], function (require, exports, errors, event_1, contextkey_1, lifecycle_1, panelService_1, partService_1, configuration_1, terminal_1, winjs_base_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TerminalService = (function () {
        function TerminalService(_contextKeyService, _configurationService, _panelService, _partService, lifecycleService) {
            var _this = this;
            this._contextKeyService = _contextKeyService;
            this._configurationService = _configurationService;
            this._panelService = _panelService;
            this._partService = _partService;
            this._terminalInstances = [];
            this._activeTerminalInstanceIndex = 0;
            this._isShuttingDown = false;
            this._onActiveInstanceChanged = new event_1.Emitter();
            this._onInstanceDisposed = new event_1.Emitter();
            this._onInstanceProcessIdReady = new event_1.Emitter();
            this._onInstanceData = new event_1.Emitter();
            this._onInstanceTitleChanged = new event_1.Emitter();
            this._onInstancesChanged = new event_1.Emitter();
            this._configurationService.onDidUpdateConfiguration(function () { return _this.updateConfig(); });
            lifecycleService.onWillShutdown(function (event) { return event.veto(_this._onWillShutdown()); });
            this._terminalFocusContextKey = terminal_1.KEYBINDING_CONTEXT_TERMINAL_FOCUS.bindTo(this._contextKeyService);
            this._findWidgetVisible = terminal_1.KEYBINDING_CONTEXT_TERMINAL_FIND_WIDGET_VISIBLE.bindTo(this._contextKeyService);
            this.onInstanceDisposed(function (terminalInstance) { _this._removeInstance(terminalInstance); });
        }
        Object.defineProperty(TerminalService.prototype, "activeTerminalInstanceIndex", {
            get: function () { return this._activeTerminalInstanceIndex; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TerminalService.prototype, "onActiveInstanceChanged", {
            get: function () { return this._onActiveInstanceChanged.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TerminalService.prototype, "onInstanceDisposed", {
            get: function () { return this._onInstanceDisposed.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TerminalService.prototype, "onInstanceProcessIdReady", {
            get: function () { return this._onInstanceProcessIdReady.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TerminalService.prototype, "onInstanceData", {
            get: function () { return this._onInstanceData.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TerminalService.prototype, "onInstanceTitleChanged", {
            get: function () { return this._onInstanceTitleChanged.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TerminalService.prototype, "onInstancesChanged", {
            get: function () { return this._onInstancesChanged.event; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TerminalService.prototype, "terminalInstances", {
            get: function () { return this._terminalInstances; },
            enumerable: true,
            configurable: true
        });
        TerminalService.prototype._onWillShutdown = function () {
            if (this.terminalInstances.length === 0) {
                // No terminal instances, don't veto
                return false;
            }
            if (this.configHelper.config.confirmOnExit) {
                // veto if configured to show confirmation and the user choosed not to exit
                if (this._showTerminalCloseConfirmation()) {
                    return true;
                }
            }
            // Dispose all terminal instances and don't veto
            this._isShuttingDown = true;
            this.terminalInstances.forEach(function (instance) {
                instance.dispose();
            });
            return false;
        };
        TerminalService.prototype.getInstanceLabels = function () {
            return this._terminalInstances.map(function (instance, index) { return index + 1 + ": " + instance.title; });
        };
        TerminalService.prototype._removeInstance = function (terminalInstance) {
            var index = this.terminalInstances.indexOf(terminalInstance);
            var wasActiveInstance = terminalInstance === this.getActiveInstance();
            if (index !== -1) {
                this.terminalInstances.splice(index, 1);
            }
            if (wasActiveInstance && this.terminalInstances.length > 0) {
                var newIndex = index < this.terminalInstances.length ? index : this.terminalInstances.length - 1;
                this.setActiveInstanceByIndex(newIndex);
                if (terminalInstance.hadFocusOnExit) {
                    this.getActiveInstance().focus(true);
                }
            }
            // Hide the panel if there are no more instances, provided that VS Code is not shutting
            // down. When shutting down the panel is locked in place so that it is restored upon next
            // launch.
            if (this.terminalInstances.length === 0 && !this._isShuttingDown) {
                this.hidePanel();
            }
            this._onInstancesChanged.fire();
            if (wasActiveInstance) {
                this._onActiveInstanceChanged.fire();
            }
        };
        TerminalService.prototype.getActiveInstance = function () {
            if (this.activeTerminalInstanceIndex < 0 || this.activeTerminalInstanceIndex >= this.terminalInstances.length) {
                return null;
            }
            return this.terminalInstances[this.activeTerminalInstanceIndex];
        };
        TerminalService.prototype.getInstanceFromId = function (terminalId) {
            return this.terminalInstances[this._getIndexFromId(terminalId)];
        };
        TerminalService.prototype.getInstanceFromIndex = function (terminalIndex) {
            return this.terminalInstances[terminalIndex];
        };
        TerminalService.prototype.setActiveInstance = function (terminalInstance) {
            this.setActiveInstanceByIndex(this._getIndexFromId(terminalInstance.id));
        };
        TerminalService.prototype.setActiveInstanceByIndex = function (terminalIndex) {
            if (terminalIndex >= this._terminalInstances.length) {
                return;
            }
            var didInstanceChange = this._activeTerminalInstanceIndex !== terminalIndex;
            this._activeTerminalInstanceIndex = terminalIndex;
            this._terminalInstances.forEach(function (terminalInstance, i) {
                terminalInstance.setVisible(i === terminalIndex);
            });
            // Only fire the event if there was a change
            if (didInstanceChange) {
                this._onActiveInstanceChanged.fire();
            }
        };
        TerminalService.prototype.setActiveInstanceToNext = function () {
            if (this.terminalInstances.length <= 1) {
                return;
            }
            var newIndex = this._activeTerminalInstanceIndex + 1;
            if (newIndex >= this.terminalInstances.length) {
                newIndex = 0;
            }
            this.setActiveInstanceByIndex(newIndex);
        };
        TerminalService.prototype.setActiveInstanceToPrevious = function () {
            if (this.terminalInstances.length <= 1) {
                return;
            }
            var newIndex = this._activeTerminalInstanceIndex - 1;
            if (newIndex < 0) {
                newIndex = this.terminalInstances.length - 1;
            }
            this.setActiveInstanceByIndex(newIndex);
        };
        TerminalService.prototype.showPanel = function (focus) {
            var _this = this;
            return new winjs_base_1.TPromise(function (complete) {
                var panel = _this._panelService.getActivePanel();
                if (!panel || panel.getId() !== terminal_1.TERMINAL_PANEL_ID) {
                    return _this._panelService.openPanel(terminal_1.TERMINAL_PANEL_ID, focus).then(function () {
                        if (focus) {
                            _this.getActiveInstance().focus(true);
                        }
                        complete(void 0);
                    });
                }
                else {
                    if (focus) {
                        _this.getActiveInstance().focus(true);
                    }
                    complete(void 0);
                }
                return undefined;
            });
        };
        TerminalService.prototype.hidePanel = function () {
            var panel = this._panelService.getActivePanel();
            if (panel && panel.getId() === terminal_1.TERMINAL_PANEL_ID) {
                this._partService.setPanelHidden(true).done(undefined, errors.onUnexpectedError);
            }
        };
        TerminalService.prototype._getIndexFromId = function (terminalId) {
            var terminalIndex = -1;
            this.terminalInstances.forEach(function (terminalInstance, i) {
                if (terminalInstance.id === terminalId) {
                    terminalIndex = i;
                }
            });
            if (terminalIndex === -1) {
                throw new Error("Terminal with ID " + terminalId + " does not exist (has it already been disposed?)");
            }
            return terminalIndex;
        };
        TerminalService.prototype.updateConfig = function () {
            this.terminalInstances.forEach(function (instance) { return instance.updateConfig(); });
        };
        TerminalService.prototype.setWorkspaceShellAllowed = function (isAllowed) {
            this.configHelper.setWorkspaceShellAllowed(isAllowed);
        };
        TerminalService = __decorate([
            __param(0, contextkey_1.IContextKeyService),
            __param(1, configuration_1.IConfigurationService),
            __param(2, panelService_1.IPanelService),
            __param(3, partService_1.IPartService),
            __param(4, lifecycle_1.ILifecycleService)
        ], TerminalService);
        return TerminalService;
    }());
    exports.TerminalService = TerminalService;
});
//# sourceMappingURL=terminalService.js.map