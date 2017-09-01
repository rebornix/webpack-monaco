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
define(["require", "exports", "vs/nls", "vs/base/common/winjs.base", "vs/platform/theme/common/styler", "vs/base/common/errors", "vs/base/browser/dom", "vs/base/browser/builder", "vs/workbench/common/memento", "vs/base/common/lifecycle", "vs/base/browser/ui/actionbar/actionbar", "vs/platform/registry/common/platform", "vs/workbench/browser/actions", "vs/workbench/browser/viewlet", "vs/base/browser/dnd", "vs/base/browser/ui/toolbar/toolbar", "vs/platform/extensions/common/extensions", "vs/platform/contextview/browser/contextView", "vs/base/browser/ui/splitview/splitview", "vs/workbench/parts/views/browser/viewsRegistry", "vs/platform/telemetry/common/telemetry", "vs/platform/theme/common/themeService", "vs/platform/instantiation/common/instantiation", "vs/platform/storage/common/storage", "vs/platform/workspace/common/workspace", "vs/platform/contextkey/common/contextkey", "vs/base/browser/mouseEvent", "vs/workbench/common/theme", "vs/platform/theme/common/colorRegistry"], function (require, exports, nls, winjs_base_1, styler_1, errors, DOM, builder_1, memento_1, lifecycle_1, actionbar_1, platform_1, actions_1, viewlet_1, dnd_1, toolbar_1, extensions_1, contextView_1, splitview_1, viewsRegistry_1, telemetry_1, themeService_1, instantiation_1, storage_1, workspace_1, contextkey_1, mouseEvent_1, theme_1, colorRegistry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CollapsibleView = (function (_super) {
        __extends(CollapsibleView, _super);
        function CollapsibleView(initialSize, options, keybindingService, contextMenuService) {
            var _this = _super.call(this, initialSize, {
                ariaHeaderLabel: options.ariaHeaderLabel,
                sizing: options.sizing,
                bodySize: options.initialBodySize ? options.initialBodySize : 4 * 22,
                initialState: options.collapsed ? splitview_1.CollapsibleState.COLLAPSED : splitview_1.CollapsibleState.EXPANDED,
            }) || this;
            _this.keybindingService = keybindingService;
            _this.contextMenuService = contextMenuService;
            _this.id = options.id;
            _this.name = options.name;
            _this.actionRunner = options.actionRunner;
            _this.toDispose = [];
            return _this;
        }
        CollapsibleView.prototype.changeState = function (state) {
            this.updateTreeVisibility(this.tree, state === splitview_1.CollapsibleState.EXPANDED);
            _super.prototype.changeState.call(this, state);
        };
        Object.defineProperty(CollapsibleView.prototype, "draggableLabel", {
            get: function () { return this.name; },
            enumerable: true,
            configurable: true
        });
        CollapsibleView.prototype.create = function () {
            return winjs_base_1.TPromise.as(null);
        };
        CollapsibleView.prototype.getHeaderElement = function () {
            return this.header;
        };
        CollapsibleView.prototype.renderHeader = function (container) {
            var _this = this;
            // Tool bar
            this.toolBar = new toolbar_1.ToolBar(builder_1.$('div.actions').appendTo(container).getHTMLElement(), this.contextMenuService, {
                orientation: actionbar_1.ActionsOrientation.HORIZONTAL,
                actionItemProvider: function (action) { return _this.getActionItem(action); },
                ariaLabel: nls.localize('viewToolbarAriaLabel', "{0} actions", this.name),
                getKeyBinding: function (action) { return _this.keybindingService.lookupKeybinding(action.id); }
            });
            this.toolBar.actionRunner = this.actionRunner;
            this.updateActions();
            // Expand on drag over
            this.dragHandler = new dnd_1.DelayedDragHandler(container, function () {
                if (!_this.isExpanded()) {
                    _this.expand();
                }
            });
        };
        CollapsibleView.prototype.updateActions = function () {
            this.toolBar.setActions(actions_1.prepareActions(this.getActions()), actions_1.prepareActions(this.getSecondaryActions()))();
            this.toolBar.context = this.getActionsContext();
        };
        CollapsibleView.prototype.renderViewTree = function (container) {
            var treeContainer = document.createElement('div');
            container.appendChild(treeContainer);
            return treeContainer;
        };
        CollapsibleView.prototype.getViewer = function () {
            return this.tree;
        };
        CollapsibleView.prototype.isVisible = function () {
            return this._isVisible;
        };
        CollapsibleView.prototype.setVisible = function (visible) {
            if (this._isVisible !== visible) {
                this._isVisible = visible;
                this.updateTreeVisibility(this.tree, visible && this.state === splitview_1.CollapsibleState.EXPANDED);
            }
            return winjs_base_1.TPromise.as(null);
        };
        CollapsibleView.prototype.focusBody = function () {
            this.focusTree();
        };
        CollapsibleView.prototype.reveal = function (element, relativeTop) {
            if (!this.tree) {
                return winjs_base_1.TPromise.as(null); // return early if viewlet has not yet been created
            }
            return this.tree.reveal(element, relativeTop);
        };
        CollapsibleView.prototype.layoutBody = function (size) {
            if (this.tree) {
                this.treeContainer.style.height = size + 'px';
                this.tree.layout(size);
            }
        };
        CollapsibleView.prototype.getActions = function () {
            return [];
        };
        CollapsibleView.prototype.getSecondaryActions = function () {
            return [];
        };
        CollapsibleView.prototype.getActionItem = function (action) {
            return null;
        };
        CollapsibleView.prototype.getActionsContext = function () {
            return undefined;
        };
        CollapsibleView.prototype.shutdown = function () {
            // Subclass to implement
        };
        CollapsibleView.prototype.getOptimalWidth = function () {
            return 0;
        };
        CollapsibleView.prototype.dispose = function () {
            this.isDisposed = true;
            this.treeContainer = null;
            if (this.tree) {
                this.tree.dispose();
            }
            if (this.dragHandler) {
                this.dragHandler.dispose();
            }
            this.toDispose = lifecycle_1.dispose(this.toDispose);
            if (this.toolBar) {
                this.toolBar.dispose();
            }
            _super.prototype.dispose.call(this);
        };
        CollapsibleView.prototype.updateTreeVisibility = function (tree, isVisible) {
            if (!tree) {
                return;
            }
            if (isVisible) {
                builder_1.$(tree.getHTMLElement()).show();
            }
            else {
                builder_1.$(tree.getHTMLElement()).hide(); // make sure the tree goes out of the tabindex world by hiding it
            }
            if (isVisible) {
                tree.onVisible();
            }
            else {
                tree.onHidden();
            }
        };
        CollapsibleView.prototype.focusTree = function () {
            if (!this.tree) {
                return; // return early if viewlet has not yet been created
            }
            // Make sure the current selected element is revealed
            var selection = this.tree.getSelection();
            if (selection.length > 0) {
                this.reveal(selection[0], 0.5).done(null, errors.onUnexpectedError);
            }
            // Pass Focus to Viewer
            this.tree.DOMFocus();
        };
        return CollapsibleView;
    }(splitview_1.AbstractCollapsibleView));
    exports.CollapsibleView = CollapsibleView;
    var ViewsViewlet = (function (_super) {
        __extends(ViewsViewlet, _super);
        function ViewsViewlet(id, location, showHeaderInTitleWhenSingleView, telemetryService, storageService, instantiationService, themeService, contextService, contextKeyService, contextMenuService, extensionService) {
            var _this = _super.call(this, id, telemetryService, themeService) || this;
            _this.location = location;
            _this.showHeaderInTitleWhenSingleView = showHeaderInTitleWhenSingleView;
            _this.storageService = storageService;
            _this.instantiationService = instantiationService;
            _this.contextService = contextService;
            _this.contextKeyService = contextKeyService;
            _this.contextMenuService = contextMenuService;
            _this.viewHeaderContextMenuListeners = [];
            _this.viewsContextKeys = new Set();
            _this.viewsStates = new Map();
            _this.areExtensionsReady = false;
            _this.viewletSettings = _this.getMemento(storageService, memento_1.Scope.WORKSPACE);
            _this._register(viewsRegistry_1.ViewsRegistry.onViewsRegistered(_this.onViewsRegistered, _this));
            _this._register(viewsRegistry_1.ViewsRegistry.onViewsDeregistered(_this.onViewsDeregistered, _this));
            _this._register(contextKeyService.onDidChangeContext(function (keys) { return _this.onContextChanged(keys); }));
            extensionService.onReady().then(function () {
                _this.areExtensionsReady = true;
                _this.onViewsUpdated();
            });
            return _this;
        }
        ViewsViewlet.prototype.create = function (parent) {
            var _this = this;
            _super.prototype.create.call(this, parent);
            this.viewletContainer = DOM.append(parent.getHTMLElement(), DOM.$(''));
            this.splitView = this._register(new splitview_1.SplitView(this.viewletContainer, { canChangeOrderByDragAndDrop: true }));
            this.attachSplitViewStyler(this.splitView);
            this._register(this.splitView.onFocus(function (view) { return _this.lastFocusedView = view; }));
            this._register(this.splitView.onDidOrderChange(function () {
                var views = _this.splitView.getViews();
                for (var order = 0; order < views.length; order++) {
                    _this.viewsStates.get(views[order].id).order = order;
                }
            }));
            return this.onViewsRegistered(viewsRegistry_1.ViewsRegistry.getViews(this.location))
                .then(function () {
                _this.lastFocusedView = _this.splitView.getViews()[0];
                _this.focus();
            });
        };
        ViewsViewlet.prototype.getTitle = function () {
            var title = platform_1.Registry.as(viewlet_1.Extensions.Viewlets).getViewlet(this.getId()).name;
            if (this.showHeaderInTitleArea() && this.splitView.getViews()[0]) {
                title += ': ' + this.splitView.getViews()[0].name;
            }
            return title;
        };
        ViewsViewlet.prototype.getActions = function () {
            if (this.showHeaderInTitleArea() && this.splitView.getViews()[0]) {
                return this.splitView.getViews()[0].getActions();
            }
            return [];
        };
        ViewsViewlet.prototype.getSecondaryActions = function () {
            if (this.showHeaderInTitleArea() && this.splitView.getViews()[0]) {
                return this.splitView.getViews()[0].getSecondaryActions();
            }
            return [];
        };
        ViewsViewlet.prototype.getContextMenuActions = function () {
            var _this = this;
            return this.getViewDescriptorsFromRegistry(true)
                .filter(function (viewDescriptor) { return viewDescriptor.canToggleVisibility; })
                .map(function (viewDescriptor) { return ({
                id: viewDescriptor.id + ".toggleVisibility",
                label: viewDescriptor.name,
                checked: _this.isCurrentlyVisible(viewDescriptor),
                enabled: _this.contextKeyService.contextMatchesRules(viewDescriptor.when),
                run: function () { return _this.toggleViewVisibility(viewDescriptor.id); }
            }); });
        };
        ViewsViewlet.prototype.setVisible = function (visible) {
            var _this = this;
            return _super.prototype.setVisible.call(this, visible)
                .then(function () { return winjs_base_1.TPromise.join(_this.splitView.getViews().filter(function (view) { return view.isVisible() !== visible; })
                .map(function (view) { return view.setVisible(visible); })); })
                .then(function () { return void 0; });
        };
        ViewsViewlet.prototype.focus = function () {
            _super.prototype.focus.call(this);
            if (this.lastFocusedView) {
                this.lastFocusedView.focus();
            }
            else if (this.views.length > 0) {
                this.views[0].focus();
            }
        };
        ViewsViewlet.prototype.layout = function (dimension) {
            this.dimension = dimension;
            this.layoutViews();
        };
        ViewsViewlet.prototype.getOptimalWidth = function () {
            var additionalMargin = 16;
            var optimalWidth = Math.max.apply(Math, this.splitView.getViews().map(function (view) { return view.getOptimalWidth() || 0; }));
            return optimalWidth + additionalMargin;
        };
        ViewsViewlet.prototype.shutdown = function () {
            this.splitView.getViews().forEach(function (view) { return view.shutdown(); });
            _super.prototype.shutdown.call(this);
        };
        ViewsViewlet.prototype.layoutViews = function () {
            if (this.splitView) {
                this.splitView.layout(this.dimension.height);
                for (var _i = 0, _a = this.splitView.getViews(); _i < _a.length; _i++) {
                    var view = _a[_i];
                    var viewState = this.updateViewStateSize(view);
                    this.viewsStates.set(view.id, viewState);
                }
            }
        };
        ViewsViewlet.prototype.toggleViewVisibility = function (id) {
            var view = this.getView(id);
            var viewState = this.viewsStates.get(id);
            if (view) {
                viewState = viewState || this.createViewState(view);
                viewState.isHidden = true;
            }
            else {
                viewState = viewState || { collapsed: true, size: void 0, isHidden: false, order: void 0 };
                viewState.isHidden = false;
            }
            this.viewsStates.set(id, viewState);
            this.updateViews();
        };
        ViewsViewlet.prototype.onViewsRegistered = function (views) {
            this.viewsContextKeys.clear();
            for (var _i = 0, _a = this.getViewDescriptorsFromRegistry(); _i < _a.length; _i++) {
                var viewDescriptor = _a[_i];
                if (viewDescriptor.when) {
                    for (var _b = 0, _c = viewDescriptor.when.keys(); _b < _c.length; _b++) {
                        var key = _c[_b];
                        this.viewsContextKeys.add(key);
                    }
                }
            }
            return this.updateViews();
        };
        ViewsViewlet.prototype.onViewsDeregistered = function (views) {
            return this.updateViews(views);
        };
        ViewsViewlet.prototype.onContextChanged = function (keys) {
            if (!keys) {
                return;
            }
            var hasToUpdate = false;
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if (this.viewsContextKeys.has(key)) {
                    hasToUpdate = true;
                    break;
                }
            }
            if (hasToUpdate) {
                this.updateViews();
            }
        };
        ViewsViewlet.prototype.updateViews = function (unregisteredViews) {
            var _this = this;
            if (unregisteredViews === void 0) { unregisteredViews = []; }
            if (this.splitView) {
                var registeredViews = this.getViewDescriptorsFromRegistry();
                var _a = registeredViews.reduce(function (result, viewDescriptor) {
                    var isCurrentlyVisible = _this.isCurrentlyVisible(viewDescriptor);
                    var canBeVisible = _this.canBeVisible(viewDescriptor);
                    if (canBeVisible) {
                        result[0].push(viewDescriptor);
                    }
                    if (!isCurrentlyVisible && canBeVisible) {
                        result[1].push(viewDescriptor);
                    }
                    if (isCurrentlyVisible && !canBeVisible) {
                        result[2].push(viewDescriptor);
                    }
                    return result;
                }, [[], [], unregisteredViews]), visible = _a[0], toAdd = _a[1], toRemove = _a[2];
                var toCreate_1 = [];
                if (toAdd.length || toRemove.length) {
                    for (var _i = 0, _b = this.splitView.getViews(); _i < _b.length; _i++) {
                        var view = _b[_i];
                        var viewState = this.viewsStates.get(view.id);
                        if (!viewState || typeof viewState.size === 'undefined' || view.size !== viewState.size || !view.isExpanded() !== viewState.collapsed) {
                            viewState = this.updateViewStateSize(view);
                            this.viewsStates.set(view.id, viewState);
                        }
                    }
                    if (toRemove.length) {
                        for (var _c = 0, toRemove_1 = toRemove; _c < toRemove_1.length; _c++) {
                            var viewDescriptor = toRemove_1[_c];
                            var view = this.getView(viewDescriptor.id);
                            this.splitView.removeView(view);
                            if (this.lastFocusedView === view) {
                                this.lastFocusedView = null;
                            }
                        }
                    }
                    for (var _d = 0, toAdd_1 = toAdd; _d < toAdd_1.length; _d++) {
                        var viewDescriptor = toAdd_1[_d];
                        var viewState = this.viewsStates.get(viewDescriptor.id);
                        var index = visible.indexOf(viewDescriptor);
                        var view = this.createView(viewDescriptor, viewState ? viewState.size : void 0, {
                            id: viewDescriptor.id,
                            name: viewDescriptor.name,
                            actionRunner: this.getActionRunner(),
                            collapsed: viewState ? viewState.collapsed : void 0,
                            viewletSettings: this.viewletSettings
                        });
                        toCreate_1.push(view);
                        this.attachViewStyler(view);
                        this.splitView.addView(view, viewState && viewState.size ? Math.max(viewState.size, 1) : viewDescriptor.size, index);
                    }
                    return winjs_base_1.TPromise.join(toCreate_1.map(function (view) { return view.create(); }))
                        .then(function () { return _this.onViewsUpdated(); })
                        .then(function () { return toCreate_1; });
                }
            }
            return winjs_base_1.TPromise.as([]);
        };
        ViewsViewlet.prototype.attachViewStyler = function (widget, options) {
            return styler_1.attachStyler(this.themeService, {
                headerForeground: theme_1.SIDE_BAR_SECTION_HEADER_FOREGROUND,
                headerBackground: theme_1.SIDE_BAR_SECTION_HEADER_BACKGROUND,
                headerHighContrastBorder: (options && options.noContrastBorder) ? null : colorRegistry_1.contrastBorder
            }, widget);
        };
        ViewsViewlet.prototype.attachSplitViewStyler = function (widget) {
            return styler_1.attachStyler(this.themeService, {
                dropBackground: theme_1.SIDE_BAR_DRAG_AND_DROP_BACKGROUND
            }, widget);
        };
        ViewsViewlet.prototype.isCurrentlyVisible = function (viewDescriptor) {
            return !!this.getView(viewDescriptor.id);
        };
        ViewsViewlet.prototype.canBeVisible = function (viewDescriptor) {
            var viewstate = this.viewsStates.get(viewDescriptor.id);
            if (viewstate && viewstate.isHidden) {
                return false;
            }
            return this.contextKeyService.contextMatchesRules(viewDescriptor.when);
        };
        ViewsViewlet.prototype.onViewsUpdated = function () {
            var _this = this;
            if (!this.splitView) {
                return winjs_base_1.TPromise.as(null);
            }
            if (this.showHeaderInTitleArea()) {
                if (this.splitView.getViews()[0]) {
                    this.splitView.getViews()[0].hideHeader();
                    if (!this.splitView.getViews()[0].isExpanded()) {
                        this.splitView.getViews()[0].expand();
                    }
                }
            }
            else {
                for (var _i = 0, _a = this.splitView.getViews(); _i < _a.length; _i++) {
                    var view = _a[_i];
                    view.showHeader();
                }
            }
            // Update title area since the title actions have changed.
            this.updateTitleArea();
            this.viewHeaderContextMenuListeners = lifecycle_1.dispose(this.viewHeaderContextMenuListeners);
            var _loop_1 = function (viewDescriptor) {
                var view = this_1.getView(viewDescriptor.id);
                if (view) {
                    this_1.viewHeaderContextMenuListeners.push(DOM.addDisposableListener(view.getHeaderElement(), DOM.EventType.CONTEXT_MENU, function (e) {
                        e.stopPropagation();
                        e.preventDefault();
                        if (viewDescriptor.canToggleVisibility) {
                            _this.onContextMenu(new mouseEvent_1.StandardMouseEvent(e), view);
                        }
                    }));
                }
            };
            var this_1 = this;
            for (var _b = 0, _c = this.getViewDescriptorsFromRegistry(); _b < _c.length; _b++) {
                var viewDescriptor = _c[_b];
                _loop_1(viewDescriptor);
            }
            if (this.dimension) {
                this.layoutViews();
            }
            return this.setVisible(this.isVisible());
        };
        ViewsViewlet.prototype.onContextMenu = function (event, view) {
            var _this = this;
            event.stopPropagation();
            event.preventDefault();
            var anchor = { x: event.posx, y: event.posy };
            this.contextMenuService.showContextMenu({
                getAnchor: function () { return anchor; },
                getActions: function () { return winjs_base_1.TPromise.as([{
                        id: view.id + ".removeView",
                        label: nls.localize('removeView', "Remove from Side Bar"),
                        enabled: true,
                        run: function () { return _this.toggleViewVisibility(view.id); }
                    }]); },
            });
        };
        ViewsViewlet.prototype.showHeaderInTitleArea = function () {
            if (!this.showHeaderInTitleWhenSingleView) {
                return false;
            }
            if (this.splitView.getViews().length > 1) {
                return false;
            }
            if (viewsRegistry_1.ViewLocation.getContributedViewLocation(this.location.id) && !this.areExtensionsReady) {
                // Checks in cache so that view do not jump. See #29609
                var visibleViewsCount_1 = 0;
                this.viewsStates.forEach(function (viewState) {
                    if (!viewState.isHidden) {
                        visibleViewsCount_1++;
                    }
                });
                return visibleViewsCount_1 === 1;
            }
            return true;
        };
        ViewsViewlet.prototype.getViewDescriptorsFromRegistry = function (defaultOrder) {
            var _this = this;
            if (defaultOrder === void 0) { defaultOrder = false; }
            return viewsRegistry_1.ViewsRegistry.getViews(this.location)
                .sort(function (a, b) {
                var viewStateA = _this.viewsStates.get(a.id);
                var viewStateB = _this.viewsStates.get(b.id);
                var orderA = !defaultOrder && viewStateA ? viewStateA.order : a.order;
                var orderB = !defaultOrder && viewStateB ? viewStateB.order : b.order;
                if (orderB === void 0 || orderB === null) {
                    return -1;
                }
                if (orderA === void 0 || orderA === null) {
                    return 1;
                }
                return orderA - orderB;
            });
        };
        ViewsViewlet.prototype.createView = function (viewDescriptor, initialSize, options) {
            return this.instantiationService.createInstance(viewDescriptor.ctor, initialSize, options);
        };
        Object.defineProperty(ViewsViewlet.prototype, "views", {
            get: function () {
                return this.splitView ? this.splitView.getViews() : [];
            },
            enumerable: true,
            configurable: true
        });
        ViewsViewlet.prototype.getView = function (id) {
            return this.splitView.getViews().filter(function (view) { return view.id === id; })[0];
        };
        ViewsViewlet.prototype.updateViewStateSize = function (view) {
            var currentState = this.viewsStates.get(view.id);
            var newViewState = this.createViewState(view);
            return currentState ? __assign({}, currentState, { collapsed: newViewState.collapsed, size: newViewState.size }) : newViewState;
        };
        ViewsViewlet.prototype.createViewState = function (view) {
            var collapsed = !view.isExpanded();
            var size = collapsed && view instanceof CollapsibleView ? view.previousSize : view.size;
            return {
                collapsed: collapsed,
                size: size && size > 0 ? size : void 0,
                isHidden: false,
                order: this.splitView.getViews().indexOf(view)
            };
        };
        ViewsViewlet = __decorate([
            __param(3, telemetry_1.ITelemetryService),
            __param(4, storage_1.IStorageService),
            __param(5, instantiation_1.IInstantiationService),
            __param(6, themeService_1.IThemeService),
            __param(7, workspace_1.IWorkspaceContextService),
            __param(8, contextkey_1.IContextKeyService),
            __param(9, contextView_1.IContextMenuService),
            __param(10, extensions_1.IExtensionService)
        ], ViewsViewlet);
        return ViewsViewlet;
    }(viewlet_1.Viewlet));
    exports.ViewsViewlet = ViewsViewlet;
    var PersistentViewsViewlet = (function (_super) {
        __extends(PersistentViewsViewlet, _super);
        function PersistentViewsViewlet(id, location, viewletStateStorageId, showHeaderInTitleWhenSingleView, telemetryService, storageService, instantiationService, themeService, contextService, contextKeyService, contextMenuService, extensionService) {
            var _this = _super.call(this, id, location, showHeaderInTitleWhenSingleView, telemetryService, storageService, instantiationService, themeService, contextService, contextKeyService, contextMenuService, extensionService) || this;
            _this.viewletStateStorageId = viewletStateStorageId;
            _this.loadViewsStates();
            return _this;
        }
        PersistentViewsViewlet.prototype.shutdown = function () {
            this.saveViewsStates();
            _super.prototype.shutdown.call(this);
        };
        PersistentViewsViewlet.prototype.saveViewsStates = function () {
            var _this = this;
            var viewsStates = {};
            var registeredViewDescriptors = this.getViewDescriptorsFromRegistry();
            this.viewsStates.forEach(function (viewState, id) {
                var view = _this.getView(id);
                if (view) {
                    viewState = _this.createViewState(view);
                    viewsStates[id] = { size: viewState.size, collapsed: viewState.collapsed, isHidden: viewState.isHidden, order: viewState.order };
                }
                else {
                    var viewDescriptor = registeredViewDescriptors.filter(function (v) { return v.id === id; })[0];
                    if (viewDescriptor) {
                        viewsStates[id] = viewState;
                    }
                }
            });
            this.storageService.store(this.viewletStateStorageId, JSON.stringify(viewsStates), this.contextService.hasWorkspace() ? storage_1.StorageScope.WORKSPACE : storage_1.StorageScope.GLOBAL);
        };
        PersistentViewsViewlet.prototype.loadViewsStates = function () {
            var _this = this;
            var viewsStates = JSON.parse(this.storageService.get(this.viewletStateStorageId, this.contextService.hasWorkspace() ? storage_1.StorageScope.WORKSPACE : storage_1.StorageScope.GLOBAL, '{}'));
            Object.keys(viewsStates).forEach(function (id) { return _this.viewsStates.set(id, viewsStates[id]); });
        };
        PersistentViewsViewlet = __decorate([
            __param(4, telemetry_1.ITelemetryService),
            __param(5, storage_1.IStorageService),
            __param(6, instantiation_1.IInstantiationService),
            __param(7, themeService_1.IThemeService),
            __param(8, workspace_1.IWorkspaceContextService),
            __param(9, contextkey_1.IContextKeyService),
            __param(10, contextView_1.IContextMenuService),
            __param(11, extensions_1.IExtensionService)
        ], PersistentViewsViewlet);
        return PersistentViewsViewlet;
    }(ViewsViewlet));
    exports.PersistentViewsViewlet = PersistentViewsViewlet;
});
//# sourceMappingURL=views.js.map