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
define(["require", "exports", "vs/base/browser/dom", "vs/workbench/parts/views/browser/views", "vs/workbench/parts/debug/common/debug", "vs/workbench/parts/debug/browser/debugActions", "vs/workbench/parts/debug/browser/debugActionItems", "vs/platform/instantiation/common/instantiation", "vs/platform/extensions/common/extensions", "vs/platform/progress/common/progress", "vs/platform/workspace/common/workspace", "vs/platform/telemetry/common/telemetry", "vs/platform/storage/common/storage", "vs/platform/theme/common/themeService", "vs/workbench/parts/views/browser/viewsRegistry", "vs/platform/contextkey/common/contextkey", "vs/platform/contextview/browser/contextView", "vs/css!./media/debugViewlet"], function (require, exports, DOM, views_1, debug_1, debugActions_1, debugActionItems_1, instantiation_1, extensions_1, progress_1, workspace_1, telemetry_1, storage_1, themeService_1, viewsRegistry_1, contextkey_1, contextView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DebugViewlet = (function (_super) {
        __extends(DebugViewlet, _super);
        function DebugViewlet(telemetryService, progressService, debugService, instantiationService, contextService, storageService, themeService, contextKeyService, contextMenuService, extensionService) {
            var _this = _super.call(this, debug_1.VIEWLET_ID, viewsRegistry_1.ViewLocation.Debug, debug_1.VIEWLET_ID + ".state", false, telemetryService, storageService, instantiationService, themeService, contextService, contextKeyService, contextMenuService, extensionService) || this;
            _this.progressService = progressService;
            _this.debugService = debugService;
            _this.progressRunner = null;
            _this._register(_this.debugService.onDidChangeState(function (state) { return _this.onDebugServiceStateChange(state); }));
            return _this;
        }
        DebugViewlet.prototype.create = function (parent) {
            var _this = this;
            return _super.prototype.create.call(this, parent).then(function () { return DOM.addClass(_this.viewletContainer, 'debug-viewlet'); });
        };
        DebugViewlet.prototype.focus = function () {
            _super.prototype.focus.call(this);
            if (!this.contextService.hasWorkspace()) {
                this.views[0].focusBody();
            }
            if (this.startDebugActionItem) {
                this.startDebugActionItem.focus();
            }
        };
        DebugViewlet.prototype.getActions = function () {
            if (!this.actions) {
                this.actions = [];
                this.actions.push(this.instantiationService.createInstance(debugActions_1.StartAction, debugActions_1.StartAction.ID, debugActions_1.StartAction.LABEL));
                if (this.contextService.hasWorkspace()) {
                    this.actions.push(this.instantiationService.createInstance(debugActions_1.ConfigureAction, debugActions_1.ConfigureAction.ID, debugActions_1.ConfigureAction.LABEL));
                }
                this.actions.push(this._register(this.instantiationService.createInstance(debugActions_1.ToggleReplAction, debugActions_1.ToggleReplAction.ID, debugActions_1.ToggleReplAction.LABEL)));
            }
            return this.actions;
        };
        DebugViewlet.prototype.getSecondaryActions = function () {
            return [];
        };
        DebugViewlet.prototype.getActionItem = function (action) {
            if (action.id === debugActions_1.StartAction.ID && this.contextService.hasWorkspace()) {
                this.startDebugActionItem = this.instantiationService.createInstance(debugActionItems_1.StartDebugActionItem, null, action);
                return this.startDebugActionItem;
            }
            return null;
        };
        DebugViewlet.prototype.onDebugServiceStateChange = function (state) {
            if (this.progressRunner) {
                this.progressRunner.done();
            }
            if (state === debug_1.State.Initializing) {
                this.progressRunner = this.progressService.show(true);
            }
            else {
                this.progressRunner = null;
            }
        };
        DebugViewlet = __decorate([
            __param(0, telemetry_1.ITelemetryService),
            __param(1, progress_1.IProgressService),
            __param(2, debug_1.IDebugService),
            __param(3, instantiation_1.IInstantiationService),
            __param(4, workspace_1.IWorkspaceContextService),
            __param(5, storage_1.IStorageService),
            __param(6, themeService_1.IThemeService),
            __param(7, contextkey_1.IContextKeyService),
            __param(8, contextView_1.IContextMenuService),
            __param(9, extensions_1.IExtensionService)
        ], DebugViewlet);
        return DebugViewlet;
    }(views_1.PersistentViewsViewlet));
    exports.DebugViewlet = DebugViewlet;
});
//# sourceMappingURL=debugViewlet.js.map