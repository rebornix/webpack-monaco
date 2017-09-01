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
define(["require", "exports", "vs/nls", "vs/base/common/winjs.base", "vs/base/common/lifecycle", "vs/base/common/actions", "vs/platform/registry/common/platform", "vs/platform/actions/common/actions", "vs/workbench/common/actionRegistry", "vs/workbench/services/panel/common/panelService", "vs/workbench/services/part/common/partService", "vs/platform/keybinding/common/keybinding", "vs/css!./media/panelpart"], function (require, exports, nls, winjs_base_1, lifecycle_1, actions_1, platform_1, actions_2, actionRegistry_1, panelService_1, partService_1, keybinding_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PanelAction = (function (_super) {
        __extends(PanelAction, _super);
        function PanelAction(panel, keybindingService, panelService) {
            var _this = _super.call(this, panel.id, panel.name) || this;
            _this.panel = panel;
            _this.keybindingService = keybindingService;
            _this.panelService = panelService;
            _this.tooltip = nls.localize('panelActionTooltip', "{0} ({1})", panel.name, _this.getKeybindingLabel(panel.commandId));
            return _this;
        }
        PanelAction.prototype.run = function (event) {
            var _this = this;
            return this.panelService.openPanel(this.panel.id, true).then(function () { return _this.activate(); });
        };
        PanelAction.prototype.activate = function () {
            if (!this.checked) {
                this._setChecked(true);
            }
        };
        PanelAction.prototype.deactivate = function () {
            if (this.checked) {
                this._setChecked(false);
            }
        };
        PanelAction.prototype.getKeybindingLabel = function (id) {
            var keys = this.keybindingService.lookupKeybinding(id);
            return keys ? keys.getLabel() : '';
        };
        PanelAction = __decorate([
            __param(1, keybinding_1.IKeybindingService),
            __param(2, panelService_1.IPanelService)
        ], PanelAction);
        return PanelAction;
    }(actions_1.Action));
    exports.PanelAction = PanelAction;
    var ClosePanelAction = (function (_super) {
        __extends(ClosePanelAction, _super);
        function ClosePanelAction(id, name, partService) {
            var _this = _super.call(this, id, name, 'hide-panel-action') || this;
            _this.partService = partService;
            return _this;
        }
        ClosePanelAction.prototype.run = function () {
            return this.partService.setPanelHidden(true);
        };
        ClosePanelAction.ID = 'workbench.action.closePanel';
        ClosePanelAction.LABEL = nls.localize('closePanel', "Close Panel");
        ClosePanelAction = __decorate([
            __param(2, partService_1.IPartService)
        ], ClosePanelAction);
        return ClosePanelAction;
    }(actions_1.Action));
    exports.ClosePanelAction = ClosePanelAction;
    var TogglePanelAction = (function (_super) {
        __extends(TogglePanelAction, _super);
        function TogglePanelAction(id, name, partService) {
            var _this = _super.call(this, id, name, partService.isVisible(partService_1.Parts.PANEL_PART) ? 'panel expanded' : 'panel') || this;
            _this.partService = partService;
            return _this;
        }
        TogglePanelAction.prototype.run = function () {
            return this.partService.setPanelHidden(this.partService.isVisible(partService_1.Parts.PANEL_PART));
        };
        TogglePanelAction.ID = 'workbench.action.togglePanel';
        TogglePanelAction.LABEL = nls.localize('togglePanel', "Toggle Panel");
        TogglePanelAction = __decorate([
            __param(2, partService_1.IPartService)
        ], TogglePanelAction);
        return TogglePanelAction;
    }(actions_1.Action));
    exports.TogglePanelAction = TogglePanelAction;
    var FocusPanelAction = (function (_super) {
        __extends(FocusPanelAction, _super);
        function FocusPanelAction(id, label, panelService, partService) {
            var _this = _super.call(this, id, label) || this;
            _this.panelService = panelService;
            _this.partService = partService;
            return _this;
        }
        FocusPanelAction.prototype.run = function () {
            // Show panel
            if (!this.partService.isVisible(partService_1.Parts.PANEL_PART)) {
                return this.partService.setPanelHidden(false);
            }
            // Focus into active panel
            var panel = this.panelService.getActivePanel();
            if (panel) {
                panel.focus();
            }
            return winjs_base_1.TPromise.as(true);
        };
        FocusPanelAction.ID = 'workbench.action.focusPanel';
        FocusPanelAction.LABEL = nls.localize('focusPanel', "Focus into Panel");
        FocusPanelAction = __decorate([
            __param(2, panelService_1.IPanelService),
            __param(3, partService_1.IPartService)
        ], FocusPanelAction);
        return FocusPanelAction;
    }(actions_1.Action));
    var ToggleMaximizedPanelAction = (function (_super) {
        __extends(ToggleMaximizedPanelAction, _super);
        function ToggleMaximizedPanelAction(id, label, partService) {
            var _this = _super.call(this, id, label, partService.isPanelMaximized() ? 'minimize-panel-action' : 'maximize-panel-action') || this;
            _this.partService = partService;
            _this.toDispose = [];
            _this.toDispose.push(partService.onEditorLayout(function () {
                var maximized = _this.partService.isPanelMaximized();
                _this.class = maximized ? 'minimize-panel-action' : 'maximize-panel-action';
                _this.label = maximized ? ToggleMaximizedPanelAction.RESTORE_LABEL : ToggleMaximizedPanelAction.MAXIMIZE_LABEL;
            }));
            return _this;
        }
        ToggleMaximizedPanelAction.prototype.run = function () {
            var _this = this;
            // Show panel
            return this.partService.setPanelHidden(false)
                .then(function () { return _this.partService.toggleMaximizedPanel(); });
        };
        ToggleMaximizedPanelAction.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.toDispose = lifecycle_1.dispose(this.toDispose);
        };
        ToggleMaximizedPanelAction.ID = 'workbench.action.toggleMaximizedPanel';
        ToggleMaximizedPanelAction.LABEL = nls.localize('toggleMaximizedPanel', "Toggle Maximized Panel");
        ToggleMaximizedPanelAction.MAXIMIZE_LABEL = nls.localize('maximizePanel', "Maximize Panel Size");
        ToggleMaximizedPanelAction.RESTORE_LABEL = nls.localize('minimizePanel', "Restore Panel Size");
        ToggleMaximizedPanelAction = __decorate([
            __param(2, partService_1.IPartService)
        ], ToggleMaximizedPanelAction);
        return ToggleMaximizedPanelAction;
    }(actions_1.Action));
    exports.ToggleMaximizedPanelAction = ToggleMaximizedPanelAction;
    var actionRegistry = platform_1.Registry.as(actionRegistry_1.Extensions.WorkbenchActions);
    actionRegistry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(TogglePanelAction, TogglePanelAction.ID, TogglePanelAction.LABEL, { primary: 2048 /* CtrlCmd */ | 40 /* KEY_J */ }), 'View: Toggle Panel', nls.localize('view', "View"));
    actionRegistry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(FocusPanelAction, FocusPanelAction.ID, FocusPanelAction.LABEL), 'View: Focus into Panel', nls.localize('view', "View"));
    actionRegistry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(ToggleMaximizedPanelAction, ToggleMaximizedPanelAction.ID, ToggleMaximizedPanelAction.LABEL), 'View: Toggle Maximized Panel', nls.localize('view', "View"));
    actionRegistry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(ClosePanelAction, ClosePanelAction.ID, ClosePanelAction.LABEL), 'View: Close Panel', nls.localize('view', "View"));
});
//# sourceMappingURL=panelActions.js.map