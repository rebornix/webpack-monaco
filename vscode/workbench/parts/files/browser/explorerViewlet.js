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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/nls", "vs/base/browser/dom", "vs/workbench/parts/files/common/files", "vs/workbench/parts/views/browser/views", "vs/platform/configuration/common/configuration", "vs/workbench/services/configuration/common/configurationEditing", "vs/workbench/parts/files/browser/views/explorerViewer", "vs/workbench/parts/files/browser/views/explorerView", "vs/workbench/parts/files/browser/views/emptyView", "vs/workbench/parts/files/browser/views/openEditorsView", "vs/platform/storage/common/storage", "vs/platform/instantiation/common/instantiation", "vs/platform/extensions/common/extensions", "vs/platform/workspace/common/workspace", "vs/platform/telemetry/common/telemetry", "vs/workbench/services/editor/browser/editorService", "vs/platform/instantiation/common/serviceCollection", "vs/workbench/services/editor/common/editorService", "vs/workbench/services/group/common/groupService", "vs/platform/contextkey/common/contextkey", "vs/platform/theme/common/themeService", "vs/workbench/parts/views/browser/viewsRegistry", "vs/platform/contextview/browser/contextView", "vs/css!./media/explorerviewlet"], function (require, exports, nls_1, DOM, files_1, views_1, configuration_1, configurationEditing_1, explorerViewer_1, explorerView_1, emptyView_1, openEditorsView_1, storage_1, instantiation_1, extensions_1, workspace_1, telemetry_1, editorService_1, serviceCollection_1, editorService_2, groupService_1, contextkey_1, themeService_1, viewsRegistry_1, contextView_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExplorerViewlet = (function (_super) {
        __extends(ExplorerViewlet, _super);
        function ExplorerViewlet(telemetryService, contextService, storageService, editorGroupService, editorService, configurationService, instantiationService, contextKeyService, configurationEditingService, themeService, contextMenuService, extensionService) {
            var _this = _super.call(this, files_1.VIEWLET_ID, viewsRegistry_1.ViewLocation.Explorer, ExplorerViewlet.EXPLORER_VIEWS_STATE, true, telemetryService, storageService, instantiationService, themeService, contextService, contextKeyService, contextMenuService, extensionService) || this;
            _this.contextService = contextService;
            _this.storageService = storageService;
            _this.editorGroupService = editorGroupService;
            _this.editorService = editorService;
            _this.configurationService = configurationService;
            _this.instantiationService = instantiationService;
            _this.configurationEditingService = configurationEditingService;
            _this.viewletState = new explorerViewer_1.FileViewletState();
            _this.viewletVisibleContextKey = files_1.ExplorerViewletVisibleContext.bindTo(contextKeyService);
            _this.openEditorsVisibleContextKey = files_1.OpenEditorsVisibleContext.bindTo(contextKeyService);
            _this.registerViews();
            _this.onConfigurationUpdated();
            _this._register(_this.configurationService.onDidUpdateConfiguration(function (e) { return _this.onConfigurationUpdated(); }));
            _this._register(_this.contextService.onDidChangeWorkspaceName(function (e) { return _this.updateTitleArea(); }));
            return _this;
        }
        ExplorerViewlet.prototype.create = function (parent) {
            var _this = this;
            return _super.prototype.create.call(this, parent).then(function () { return DOM.addClass(_this.viewletContainer, 'explorer-viewlet'); });
        };
        ExplorerViewlet.prototype.registerViews = function () {
            var viewDescriptors = [];
            viewDescriptors.push(this.createOpenEditorsViewDescriptor());
            if (this.contextService.hasWorkspace()) {
                viewDescriptors.push(this.createExplorerViewDescriptor());
            }
            else {
                viewDescriptors.push(this.createEmptyViewDescriptor());
            }
            viewsRegistry_1.ViewsRegistry.registerViews(viewDescriptors);
        };
        ExplorerViewlet.prototype.createOpenEditorsViewDescriptor = function () {
            return {
                id: openEditorsView_1.OpenEditorsView.ID,
                name: openEditorsView_1.OpenEditorsView.NAME,
                location: viewsRegistry_1.ViewLocation.Explorer,
                ctor: openEditorsView_1.OpenEditorsView,
                order: 0,
                when: files_1.OpenEditorsVisibleCondition,
                canToggleVisibility: true
            };
        };
        ExplorerViewlet.prototype.createEmptyViewDescriptor = function () {
            return {
                id: emptyView_1.EmptyView.ID,
                name: emptyView_1.EmptyView.NAME,
                location: viewsRegistry_1.ViewLocation.Explorer,
                ctor: emptyView_1.EmptyView,
                order: 1,
                canToggleVisibility: true
            };
        };
        ExplorerViewlet.prototype.createExplorerViewDescriptor = function () {
            return {
                id: explorerView_1.ExplorerView.ID,
                name: nls_1.localize('folders', "Folders"),
                location: viewsRegistry_1.ViewLocation.Explorer,
                ctor: explorerView_1.ExplorerView,
                order: 1,
                canToggleVisibility: true
            };
        };
        ExplorerViewlet.prototype.onConfigurationUpdated = function () {
            this.openEditorsVisibleContextKey.set(!this.contextService.hasWorkspace() || this.configurationService.getConfiguration().explorer.openEditors.visible !== 0);
        };
        ExplorerViewlet.prototype.createView = function (viewDescriptor, initialSize, options) {
            var _this = this;
            if (viewDescriptor.id === explorerView_1.ExplorerView.ID) {
                // Create a delegating editor service for the explorer to be able to delay the refresh in the opened
                // editors view above. This is a workaround for being able to double click on a file to make it pinned
                // without causing the animation in the opened editors view to kick in and change scroll position.
                // We try to be smart and only use the delay if we recognize that the user action is likely to cause
                // a new entry in the opened editors view.
                var delegatingEditorService = this.instantiationService.createInstance(editorService_1.DelegatingWorkbenchEditorService);
                delegatingEditorService.setEditorOpenHandler(function (input, options, arg3) {
                    var openEditorsView = _this.getOpenEditorsView();
                    if (openEditorsView) {
                        var delay = 0;
                        var config = _this.configurationService.getConfiguration();
                        // No need to delay if preview is disabled
                        var delayEditorOpeningInOpenedEditors = !!config.workbench.editor.enablePreview;
                        if (delayEditorOpeningInOpenedEditors && (arg3 === false /* not side by side */ || typeof arg3 !== 'number' /* no explicit position */)) {
                            var activeGroup = _this.editorGroupService.getStacksModel().activeGroup;
                            if (!activeGroup || !activeGroup.previewEditor) {
                                delay = 250; // a new editor entry is likely because there is either no group or no preview in group
                            }
                        }
                        openEditorsView.setStructuralRefreshDelay(delay);
                    }
                    var onSuccessOrError = function (editor) {
                        var openEditorsView = _this.getOpenEditorsView();
                        if (openEditorsView) {
                            openEditorsView.setStructuralRefreshDelay(0);
                        }
                        return editor;
                    };
                    return _this.editorService.openEditor(input, options, arg3).then(onSuccessOrError, onSuccessOrError);
                });
                var explorerInstantiator = this.instantiationService.createChild(new serviceCollection_1.ServiceCollection([editorService_2.IWorkbenchEditorService, delegatingEditorService]));
                return explorerInstantiator.createInstance(explorerView_1.ExplorerView, initialSize, __assign({}, options, { viewletState: this.viewletState }));
            }
            return _super.prototype.createView.call(this, viewDescriptor, initialSize, options);
        };
        ExplorerViewlet.prototype.getExplorerView = function () {
            return this.getView(explorerView_1.ExplorerView.ID);
        };
        ExplorerViewlet.prototype.getOpenEditorsView = function () {
            return this.getView(openEditorsView_1.OpenEditorsView.ID);
        };
        ExplorerViewlet.prototype.getEmptyView = function () {
            return this.getView(emptyView_1.EmptyView.ID);
        };
        ExplorerViewlet.prototype.setVisible = function (visible) {
            this.viewletVisibleContextKey.set(visible);
            return _super.prototype.setVisible.call(this, visible);
        };
        ExplorerViewlet.prototype.focus = function () {
            var hasOpenedEditors = !!this.editorGroupService.getStacksModel().activeGroup;
            var openEditorsView = this.getOpenEditorsView();
            if (this.lastFocusedView && this.lastFocusedView.isExpanded() && this.hasSelectionOrFocus(this.lastFocusedView)) {
                if (this.lastFocusedView !== openEditorsView || hasOpenedEditors) {
                    this.lastFocusedView.focusBody();
                    return;
                }
            }
            if (this.hasSelectionOrFocus(openEditorsView) && hasOpenedEditors) {
                return openEditorsView.focusBody();
            }
            var explorerView = this.getExplorerView();
            if (this.hasSelectionOrFocus(explorerView)) {
                return explorerView.focusBody();
            }
            if (openEditorsView && openEditorsView.isExpanded() && hasOpenedEditors) {
                return openEditorsView.focusBody(); // we have entries in the opened editors view to focus on
            }
            if (explorerView && explorerView.isExpanded()) {
                return explorerView.focusBody();
            }
            var emptyView = this.getEmptyView();
            if (emptyView && emptyView.isExpanded()) {
                return emptyView.focusBody();
            }
            _super.prototype.focus.call(this);
        };
        ExplorerViewlet.prototype.hasSelectionOrFocus = function (view) {
            if (!view) {
                return false;
            }
            if (!view.isExpanded()) {
                return false;
            }
            if (view instanceof explorerView_1.ExplorerView || view instanceof openEditorsView_1.OpenEditorsView) {
                var viewer = view.getViewer();
                if (!viewer) {
                    return false;
                }
                return !!viewer.getFocus() || (viewer.getSelection() && viewer.getSelection().length > 0);
            }
            return false;
        };
        ExplorerViewlet.prototype.getActionRunner = function () {
            if (!this.actionRunner) {
                this.actionRunner = new explorerViewer_1.ActionRunner(this.viewletState);
            }
            return this.actionRunner;
        };
        ExplorerViewlet.prototype.getViewletState = function () {
            return this.viewletState;
        };
        ExplorerViewlet.EXPLORER_VIEWS_STATE = 'workbench.explorer.views.state';
        ExplorerViewlet = __decorate([
            __param(0, telemetry_1.ITelemetryService),
            __param(1, workspace_1.IWorkspaceContextService),
            __param(2, storage_1.IStorageService),
            __param(3, groupService_1.IEditorGroupService),
            __param(4, editorService_2.IWorkbenchEditorService),
            __param(5, configuration_1.IConfigurationService),
            __param(6, instantiation_1.IInstantiationService),
            __param(7, contextkey_1.IContextKeyService),
            __param(8, configurationEditing_1.IConfigurationEditingService),
            __param(9, themeService_1.IThemeService),
            __param(10, contextView_1.IContextMenuService),
            __param(11, extensions_1.IExtensionService)
        ], ExplorerViewlet);
        return ExplorerViewlet;
    }(views_1.PersistentViewsViewlet));
    exports.ExplorerViewlet = ExplorerViewlet;
});
//# sourceMappingURL=explorerViewlet.js.map