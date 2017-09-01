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
define(["require", "exports", "vs/nls", "vs/base/common/errors", "vs/base/common/async", "vs/base/browser/dom", "vs/base/parts/tree/browser/treeImpl", "vs/platform/contextview/browser/contextView", "vs/platform/instantiation/common/instantiation", "vs/workbench/services/group/common/groupService", "vs/platform/configuration/common/configuration", "vs/platform/keybinding/common/keybinding", "vs/workbench/parts/files/browser/fileActions", "vs/workbench/parts/views/browser/views", "vs/workbench/parts/files/common/files", "vs/workbench/services/textfile/common/textfiles", "vs/workbench/services/viewlet/browser/viewlet", "vs/workbench/parts/files/common/explorerModel", "vs/workbench/parts/files/browser/views/openEditorsViewer", "vs/workbench/services/untitled/common/untitledEditorService", "vs/workbench/browser/parts/editor/editorActions", "vs/workbench/browser/actions/toggleEditorLayout", "vs/platform/contextkey/common/contextkey", "vs/platform/list/browser/listService", "vs/workbench/common/editor/editorStacksModel", "vs/platform/theme/common/styler", "vs/platform/theme/common/themeService", "vs/platform/theme/common/colorRegistry", "vs/base/browser/ui/splitview/splitview"], function (require, exports, nls, errors, async_1, dom, treeImpl_1, contextView_1, instantiation_1, groupService_1, configuration_1, keybinding_1, fileActions_1, views_1, files_1, textfiles_1, viewlet_1, explorerModel_1, openEditorsViewer_1, untitledEditorService_1, editorActions_1, toggleEditorLayout_1, contextkey_1, listService_1, editorStacksModel_1, styler_1, themeService_1, colorRegistry_1, splitview_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var $ = dom.$;
    var OpenEditorsView = (function (_super) {
        __extends(OpenEditorsView, _super);
        function OpenEditorsView(initialSize, options, instantiationService, contextMenuService, textFileService, editorGroupService, configurationService, keybindingService, listService, untitledEditorService, contextKeyService, viewletService, themeService) {
            var _this = _super.call(this, initialSize, __assign({}, options, { ariaHeaderLabel: nls.localize({ key: 'openEditosrSection', comment: ['Open is an adjective'] }, "Open Editors Section"), sizing: splitview_1.ViewSizing.Fixed, initialBodySize: OpenEditorsView.computeExpandedBodySize(editorGroupService.getStacksModel()) }), keybindingService, contextMenuService) || this;
            _this.instantiationService = instantiationService;
            _this.textFileService = textFileService;
            _this.configurationService = configurationService;
            _this.listService = listService;
            _this.untitledEditorService = untitledEditorService;
            _this.viewletService = viewletService;
            _this.themeService = themeService;
            _this.model = editorGroupService.getStacksModel();
            _this.openEditorsFocusedContext = files_1.OpenEditorsFocusedContext.bindTo(contextKeyService);
            _this.explorerFocusedContext = files_1.ExplorerFocusedContext.bindTo(contextKeyService);
            _this.structuralRefreshDelay = 0;
            _this.structuralTreeRefreshScheduler = new async_1.RunOnceScheduler(function () { return _this.structuralTreeUpdate(); }, _this.structuralRefreshDelay);
            return _this;
        }
        OpenEditorsView.prototype.renderHeader = function (container) {
            var _this = this;
            var titleDiv = dom.append(container, $('.title'));
            var titleSpan = dom.append(titleDiv, $('span'));
            titleSpan.textContent = this.name;
            this.dirtyCountElement = dom.append(titleDiv, $('.monaco-count-badge'));
            this.toDispose.push((styler_1.attachStylerCallback(this.themeService, { badgeBackground: colorRegistry_1.badgeBackground, badgeForeground: colorRegistry_1.badgeForeground, contrastBorder: colorRegistry_1.contrastBorder }, function (colors) {
                var background = colors.badgeBackground ? colors.badgeBackground.toString() : null;
                var foreground = colors.badgeForeground ? colors.badgeForeground.toString() : null;
                var border = colors.contrastBorder ? colors.contrastBorder.toString() : null;
                _this.dirtyCountElement.style.backgroundColor = background;
                _this.dirtyCountElement.style.color = foreground;
                _this.dirtyCountElement.style.borderWidth = border ? '1px' : null;
                _this.dirtyCountElement.style.borderStyle = border ? 'solid' : null;
                _this.dirtyCountElement.style.borderColor = border;
            })));
            this.updateDirtyIndicator();
            _super.prototype.renderHeader.call(this, container);
        };
        OpenEditorsView.prototype.getActions = function () {
            return [
                this.instantiationService.createInstance(toggleEditorLayout_1.ToggleEditorLayoutAction, toggleEditorLayout_1.ToggleEditorLayoutAction.ID, toggleEditorLayout_1.ToggleEditorLayoutAction.LABEL),
                this.instantiationService.createInstance(fileActions_1.SaveAllAction, fileActions_1.SaveAllAction.ID, fileActions_1.SaveAllAction.LABEL),
                this.instantiationService.createInstance(editorActions_1.CloseAllEditorsAction, editorActions_1.CloseAllEditorsAction.ID, editorActions_1.CloseAllEditorsAction.LABEL)
            ];
        };
        OpenEditorsView.prototype.renderBody = function (container) {
            var _this = this;
            this.treeContainer = _super.prototype.renderViewTree.call(this, container);
            dom.addClass(this.treeContainer, 'explorer-open-editors');
            dom.addClass(this.treeContainer, 'show-file-icons');
            var dataSource = this.instantiationService.createInstance(openEditorsViewer_1.DataSource);
            var actionProvider = this.instantiationService.createInstance(openEditorsViewer_1.ActionProvider, this.model);
            var renderer = this.instantiationService.createInstance(openEditorsViewer_1.Renderer, actionProvider);
            var controller = this.instantiationService.createInstance(openEditorsViewer_1.Controller, actionProvider, this.model);
            var accessibilityProvider = this.instantiationService.createInstance(openEditorsViewer_1.AccessibilityProvider);
            var dnd = this.instantiationService.createInstance(openEditorsViewer_1.DragAndDrop);
            this.tree = new treeImpl_1.Tree(this.treeContainer, {
                dataSource: dataSource,
                renderer: renderer,
                controller: controller,
                accessibilityProvider: accessibilityProvider,
                dnd: dnd
            }, {
                indentPixels: 0,
                twistiePixels: 22,
                ariaLabel: nls.localize({ key: 'treeAriaLabel', comment: ['Open is an adjective'] }, "Open Editors: List of Active Files"),
                showTwistie: false,
                keyboardSupport: false
            });
            // Theme styler
            this.toDispose.push(styler_1.attachListStyler(this.tree, this.themeService));
            // Register to list service
            this.toDispose.push(this.listService.register(this.tree, [this.explorerFocusedContext, this.openEditorsFocusedContext]));
            // Open when selecting via keyboard
            this.toDispose.push(this.tree.addListener('selection', function (event) {
                if (event && event.payload && event.payload.origin === 'keyboard') {
                    controller.openEditor(_this.tree.getFocus(), { pinned: false, sideBySide: false, preserveFocus: false });
                }
            }));
            // Prevent collapsing of editor groups
            this.toDispose.push(this.tree.addListener('item:collapsed', function (event) {
                if (event.item && event.item.getElement() instanceof editorStacksModel_1.EditorGroup) {
                    setTimeout(function () { return _this.tree.expand(event.item.getElement()); }); // unwind from callback
                }
            }));
            this.fullRefreshNeeded = true;
            this.structuralTreeUpdate();
        };
        OpenEditorsView.prototype.create = function () {
            // Load Config
            var configuration = this.configurationService.getConfiguration();
            this.onConfigurationUpdated(configuration);
            // listeners
            this.registerListeners();
            return _super.prototype.create.call(this);
        };
        OpenEditorsView.prototype.registerListeners = function () {
            var _this = this;
            // update on model changes
            this.toDispose.push(this.model.onModelChanged(function (e) { return _this.onEditorStacksModelChanged(e); }));
            // Also handle configuration updates
            this.toDispose.push(this.configurationService.onDidUpdateConfiguration(function (e) { return _this.onConfigurationUpdated(_this.configurationService.getConfiguration()); }));
            // Handle dirty counter
            this.toDispose.push(this.untitledEditorService.onDidChangeDirty(function (e) { return _this.updateDirtyIndicator(); }));
            this.toDispose.push(this.textFileService.models.onModelsDirty(function (e) { return _this.updateDirtyIndicator(); }));
            this.toDispose.push(this.textFileService.models.onModelsSaved(function (e) { return _this.updateDirtyIndicator(); }));
            this.toDispose.push(this.textFileService.models.onModelsSaveError(function (e) { return _this.updateDirtyIndicator(); }));
            this.toDispose.push(this.textFileService.models.onModelsReverted(function (e) { return _this.updateDirtyIndicator(); }));
            // We are not updating the tree while the viewlet is not visible. Thus refresh when viewlet becomes visible #6702
            this.toDispose.push(this.viewletService.onDidViewletOpen(function (viewlet) {
                if (viewlet.getId() === files_1.VIEWLET_ID) {
                    _this.fullRefreshNeeded = true;
                    _this.structuralTreeUpdate();
                    _this.updateDirtyIndicator();
                }
            }));
        };
        OpenEditorsView.prototype.onEditorStacksModelChanged = function (e) {
            var _this = this;
            if (this.isDisposed || !this.isVisible() || !this.tree) {
                return;
            }
            // Do a minimal tree update based on if the change is structural or not #6670
            if (e.structural) {
                // If an editor changed structurally it is enough to refresh the group, otherwise a group changed structurally and we need the full refresh.
                // If there are multiple groups to refresh - refresh the whole tree.
                if (e.editor && !this.groupToRefresh) {
                    this.groupToRefresh = e.group;
                }
                else {
                    this.fullRefreshNeeded = true;
                }
                this.structuralTreeRefreshScheduler.schedule(this.structuralRefreshDelay);
            }
            else {
                var toRefresh = e.editor ? new explorerModel_1.OpenEditor(e.editor, e.group) : e.group;
                this.tree.refresh(toRefresh, false).done(function () { return _this.highlightActiveEditor(); }, errors.onUnexpectedError);
            }
        };
        OpenEditorsView.prototype.structuralTreeUpdate = function () {
            var _this = this;
            // View size
            this.setBodySize(this.getExpandedBodySize(this.model));
            // Show groups only if there is more than 1 group
            var treeInput = this.model.groups.length === 1 ? this.model.groups[0] : this.model;
            // TODO@Isidor temporary workaround due to a partial tree refresh issue
            this.fullRefreshNeeded = true;
            var toRefresh = this.fullRefreshNeeded ? null : this.groupToRefresh;
            (treeInput !== this.tree.getInput() ? this.tree.setInput(treeInput) : this.tree.refresh(toRefresh)).done(function () {
                _this.fullRefreshNeeded = false;
                _this.groupToRefresh = null;
                // Always expand all the groups as they are unclickable
                return _this.tree.expandAll(_this.model.groups).then(function () { return _this.highlightActiveEditor(); });
            }, errors.onUnexpectedError);
        };
        OpenEditorsView.prototype.highlightActiveEditor = function () {
            if (this.model.activeGroup && this.model.activeGroup.activeEditor /* could be empty */) {
                var openEditor = new explorerModel_1.OpenEditor(this.model.activeGroup.activeEditor, this.model.activeGroup);
                this.tree.clearFocus();
                this.tree.clearSelection();
                if (openEditor) {
                    this.tree.setFocus(openEditor);
                    this.tree.setSelection([openEditor]);
                    var relativeTop = this.tree.getRelativeTop(openEditor);
                    if (relativeTop <= 0 || relativeTop >= 1) {
                        // Only reveal the element if it is not visible #8279
                        this.tree.reveal(openEditor).done(null, errors.onUnexpectedError);
                    }
                }
            }
        };
        OpenEditorsView.prototype.onConfigurationUpdated = function (configuration) {
            if (this.isDisposed) {
                return; // guard against possible race condition when config change causes recreate of views
            }
            var visibleOpenEditors = configuration && configuration.explorer && configuration.explorer.openEditors && configuration.explorer.openEditors.visible;
            if (typeof visibleOpenEditors === 'number') {
                this.visibleOpenEditors = visibleOpenEditors;
            }
            else {
                this.visibleOpenEditors = OpenEditorsView.DEFAULT_VISIBLE_OPEN_EDITORS;
            }
            var dynamicHeight = configuration && configuration.explorer && configuration.explorer.openEditors && configuration.explorer.openEditors.dynamicHeight;
            if (typeof dynamicHeight === 'boolean') {
                this.dynamicHeight = dynamicHeight;
            }
            else {
                this.dynamicHeight = OpenEditorsView.DEFAULT_DYNAMIC_HEIGHT;
            }
            // Adjust expanded body size
            this.setBodySize(this.getExpandedBodySize(this.model));
        };
        OpenEditorsView.prototype.updateDirtyIndicator = function () {
            var dirty = this.textFileService.getAutoSaveMode() !== textfiles_1.AutoSaveMode.AFTER_SHORT_DELAY ? this.textFileService.getDirty().length
                : this.untitledEditorService.getDirty().length;
            if (dirty === 0) {
                dom.addClass(this.dirtyCountElement, 'hidden');
            }
            else {
                this.dirtyCountElement.textContent = nls.localize('dirtyCounter', "{0} unsaved", dirty);
                dom.removeClass(this.dirtyCountElement, 'hidden');
            }
        };
        OpenEditorsView.prototype.getExpandedBodySize = function (model) {
            return OpenEditorsView.computeExpandedBodySize(model, this.visibleOpenEditors, this.dynamicHeight);
        };
        OpenEditorsView.computeExpandedBodySize = function (model, visibleOpenEditors, dynamicHeight) {
            if (visibleOpenEditors === void 0) { visibleOpenEditors = OpenEditorsView.DEFAULT_VISIBLE_OPEN_EDITORS; }
            if (dynamicHeight === void 0) { dynamicHeight = OpenEditorsView.DEFAULT_DYNAMIC_HEIGHT; }
            var entryCount = model.groups.reduce(function (sum, group) { return sum + group.count; }, 0);
            // We only show the group labels if there is more than 1 group
            if (model.groups.length > 1) {
                entryCount += model.groups.length;
            }
            var itemsToShow;
            if (dynamicHeight) {
                itemsToShow = Math.min(Math.max(visibleOpenEditors, 1), entryCount);
            }
            else {
                itemsToShow = Math.max(visibleOpenEditors, 1);
            }
            return itemsToShow * openEditorsViewer_1.Renderer.ITEM_HEIGHT;
        };
        OpenEditorsView.prototype.setStructuralRefreshDelay = function (delay) {
            this.structuralRefreshDelay = delay;
        };
        OpenEditorsView.prototype.getOptimalWidth = function () {
            var parentNode = this.tree.getHTMLElement();
            var childNodes = [].slice.call(parentNode.querySelectorAll('.open-editor > a'));
            return dom.getLargestChildWidth(parentNode, childNodes);
        };
        OpenEditorsView.DEFAULT_VISIBLE_OPEN_EDITORS = 9;
        OpenEditorsView.DEFAULT_DYNAMIC_HEIGHT = true;
        OpenEditorsView.ID = 'workbench.explorer.openEditorsView';
        OpenEditorsView.NAME = nls.localize({ key: 'openEditors', comment: ['Open is an adjective'] }, "Open Editors");
        OpenEditorsView = __decorate([
            __param(2, instantiation_1.IInstantiationService),
            __param(3, contextView_1.IContextMenuService),
            __param(4, textfiles_1.ITextFileService),
            __param(5, groupService_1.IEditorGroupService),
            __param(6, configuration_1.IConfigurationService),
            __param(7, keybinding_1.IKeybindingService),
            __param(8, listService_1.IListService),
            __param(9, untitledEditorService_1.IUntitledEditorService),
            __param(10, contextkey_1.IContextKeyService),
            __param(11, viewlet_1.IViewletService),
            __param(12, themeService_1.IThemeService)
        ], OpenEditorsView);
        return OpenEditorsView;
    }(views_1.CollapsibleView));
    exports.OpenEditorsView = OpenEditorsView;
});
//# sourceMappingURL=openEditorsView.js.map