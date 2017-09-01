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
define(["require", "exports", "vs/base/common/event", "vs/base/common/lifecycle", "vs/platform/instantiation/common/instantiation", "vs/base/common/winjs.base", "vs/base/browser/dom", "vs/base/browser/builder", "vs/base/common/actions", "vs/platform/message/common/message", "vs/platform/keybinding/common/keybinding", "vs/platform/contextview/browser/contextView", "vs/platform/list/browser/listService", "vs/base/parts/tree/browser/treeImpl", "vs/base/parts/tree/browser/treeDefaults", "vs/platform/actions/common/actions", "vs/platform/theme/common/styler", "vs/platform/theme/common/themeService", "vs/platform/actions/browser/menuItemActionItem", "vs/platform/progress/common/progress", "vs/platform/contextkey/common/contextkey", "vs/base/browser/ui/actionbar/actionbar", "vs/workbench/parts/views/browser/viewsRegistry", "vs/workbench/parts/views/common/views", "vs/platform/extensions/common/extensions", "vs/base/browser/ui/splitview/splitview", "vs/workbench/parts/views/browser/views", "vs/platform/commands/common/commands", "vs/css!./media/views"], function (require, exports, event_1, lifecycle_1, instantiation_1, winjs_base_1, DOM, builder_1, actions_1, message_1, keybinding_1, contextView_1, listService_1, treeImpl_1, treeDefaults_1, actions_2, styler_1, themeService_1, menuItemActionItem_1, progress_1, contextkey_1, actionbar_1, viewsRegistry_1, views_1, extensions_1, splitview_1, views_2, commands_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TreeView = (function (_super) {
        __extends(TreeView, _super);
        function TreeView(initialSize, options, messageService, keybindingService, contextMenuService, instantiationService, listService, themeService, contextKeyService, extensionService, commandService) {
            var _this = _super.call(this, initialSize, __assign({}, options, { ariaHeaderLabel: options.name, sizing: splitview_1.ViewSizing.Flexible, collapsed: options.collapsed === void 0 ? true : options.collapsed }), keybindingService, contextMenuService) || this;
            _this.options = options;
            _this.messageService = messageService;
            _this.instantiationService = instantiationService;
            _this.listService = listService;
            _this.themeService = themeService;
            _this.contextKeyService = contextKeyService;
            _this.extensionService = extensionService;
            _this.commandService = commandService;
            _this.activated = false;
            _this.disposables = [];
            _this.menus = _this.instantiationService.createInstance(Menus, _this.id);
            _this.viewFocusContext = _this.contextKeyService.createKey(_this.id, void 0);
            _this.menus.onDidChangeTitle(function () { return _this.updateActions(); }, _this, _this.disposables);
            _this.themeService.onThemeChange(function () { return _this.tree.refresh(); } /* soft refresh */, _this, _this.disposables);
            if (!options.collapsed) {
                _this.activate();
            }
            return _this;
        }
        TreeView.prototype.renderHeader = function (container) {
            var titleDiv = builder_1.$('div.title').appendTo(container);
            builder_1.$('span').text(this.options.name).appendTo(titleDiv);
            _super.prototype.renderHeader.call(this, container);
        };
        TreeView.prototype.renderBody = function (container) {
            this.treeContainer = _super.prototype.renderViewTree.call(this, container);
            DOM.addClass(this.treeContainer, 'tree-explorer-viewlet-tree-view');
            this.tree = this.createViewer(builder_1.$(this.treeContainer));
            this.setInput();
        };
        TreeView.prototype.changeState = function (state) {
            _super.prototype.changeState.call(this, state);
            if (state === splitview_1.CollapsibleState.EXPANDED) {
                this.activate();
            }
        };
        TreeView.prototype.activate = function () {
            if (!this.activated && this.extensionService) {
                this.extensionService.activateByEvent("onView:" + this.id);
                this.activated = true;
                this.setInput();
            }
        };
        TreeView.prototype.createViewer = function (container) {
            var _this = this;
            var dataSource = this.instantiationService.createInstance(TreeDataSource, this.id);
            var renderer = this.instantiationService.createInstance(TreeRenderer);
            var controller = this.instantiationService.createInstance(TreeController, this.id, this.menus);
            var tree = new treeImpl_1.Tree(container.getHTMLElement(), {
                dataSource: dataSource,
                renderer: renderer,
                controller: controller
            }, {
                keyboardSupport: false
            });
            this.toDispose.push(styler_1.attachListStyler(tree, this.themeService));
            this.toDispose.push(this.listService.register(tree, [this.viewFocusContext]));
            tree.addListener('selection', function (event) { return _this.onSelection(); });
            return tree;
        };
        TreeView.prototype.getActions = function () {
            return this.menus.getTitleActions().slice();
        };
        TreeView.prototype.getSecondaryActions = function () {
            return this.menus.getTitleSecondaryActions();
        };
        TreeView.prototype.getActionItem = function (action) {
            return menuItemActionItem_1.createActionItem(action, this.keybindingService, this.messageService);
        };
        TreeView.prototype.setVisible = function (visible) {
            return _super.prototype.setVisible.call(this, visible);
        };
        TreeView.prototype.setInput = function () {
            var _this = this;
            if (this.tree) {
                if (!this.treeInputPromise) {
                    if (this.listenToDataProvider()) {
                        this.treeInputPromise = this.tree.setInput(new Root());
                    }
                    else {
                        this.treeInputPromise = new winjs_base_1.TPromise(function (c, e) {
                            _this.disposables.push(viewsRegistry_1.ViewsRegistry.onTreeViewDataProviderRegistered(function (id) {
                                if (_this.id === id) {
                                    if (_this.listenToDataProvider()) {
                                        _this.tree.setInput(new Root()).then(function () { return c(null); });
                                    }
                                }
                            }));
                        });
                    }
                }
                return this.treeInputPromise;
            }
            return winjs_base_1.TPromise.as(null);
        };
        TreeView.prototype.listenToDataProvider = function () {
            var _this = this;
            var dataProvider = viewsRegistry_1.ViewsRegistry.getTreeViewDataProvider(this.id);
            if (dataProvider) {
                if (this.dataProviderElementChangeListener) {
                    this.dataProviderElementChangeListener.dispose();
                }
                this.dataProviderElementChangeListener = dataProvider.onDidChange(function (element) { return _this.refresh(element); });
                var disposable_1 = dataProvider.onDispose(function () {
                    _this.dataProviderElementChangeListener.dispose();
                    _this.tree.setInput(new Root());
                    disposable_1.dispose();
                });
                return true;
            }
            return false;
        };
        TreeView.prototype.getOptimalWidth = function () {
            var parentNode = this.tree.getHTMLElement();
            var childNodes = [].slice.call(parentNode.querySelectorAll('.outline-item-label > a'));
            return DOM.getLargestChildWidth(parentNode, childNodes);
        };
        TreeView.prototype.onSelection = function () {
            var selection = this.tree.getSelection()[0];
            if (selection) {
                if (selection.command) {
                    (_a = this.commandService).executeCommand.apply(_a, [selection.command.id].concat((selection.command.arguments || [])));
                }
            }
            var _a;
        };
        TreeView.prototype.refresh = function (elements) {
            elements = elements ? elements : [this.tree.getInput()];
            for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                var element = elements_1[_i];
                element.children = null;
                this.tree.refresh(element);
            }
        };
        TreeView.prototype.dispose = function () {
            lifecycle_1.dispose(this.disposables);
            if (this.dataProviderElementChangeListener) {
                this.dataProviderElementChangeListener.dispose();
            }
            lifecycle_1.dispose(this.disposables);
            _super.prototype.dispose.call(this);
        };
        TreeView = __decorate([
            __param(2, message_1.IMessageService),
            __param(3, keybinding_1.IKeybindingService),
            __param(4, contextView_1.IContextMenuService),
            __param(5, instantiation_1.IInstantiationService),
            __param(6, listService_1.IListService),
            __param(7, themeService_1.IThemeService),
            __param(8, contextkey_1.IContextKeyService),
            __param(9, extensions_1.IExtensionService),
            __param(10, commands_1.ICommandService)
        ], TreeView);
        return TreeView;
    }(views_2.CollapsibleView));
    exports.TreeView = TreeView;
    var Root = (function () {
        function Root() {
            this.label = 'root';
            this.handle = -1;
            this.collapsibleState = views_1.TreeItemCollapsibleState.Expanded;
        }
        return Root;
    }());
    var TreeDataSource = (function () {
        function TreeDataSource(id, progressService) {
            this.id = id;
            this.progressService = progressService;
        }
        TreeDataSource.prototype.getId = function (tree, node) {
            return '' + node.handle;
        };
        TreeDataSource.prototype.hasChildren = function (tree, node) {
            if (!this.getDataProvider()) {
                return false;
            }
            return node.collapsibleState === views_1.TreeItemCollapsibleState.Collapsed || node.collapsibleState === views_1.TreeItemCollapsibleState.Expanded;
        };
        TreeDataSource.prototype.getChildren = function (tree, node) {
            if (node.children) {
                return winjs_base_1.TPromise.as(node.children);
            }
            var dataProvider = this.getDataProvider();
            if (dataProvider) {
                var promise = node instanceof Root ? dataProvider.getElements() : dataProvider.getChildren(node);
                this.progressService.showWhile(promise, 100);
                return promise.then(function (children) {
                    node.children = children;
                    return children;
                });
            }
            return winjs_base_1.TPromise.as(null);
        };
        TreeDataSource.prototype.shouldAutoexpand = function (tree, node) {
            return node.collapsibleState === views_1.TreeItemCollapsibleState.Expanded;
        };
        TreeDataSource.prototype.getParent = function (tree, node) {
            return winjs_base_1.TPromise.as(null);
        };
        TreeDataSource.prototype.getDataProvider = function () {
            return viewsRegistry_1.ViewsRegistry.getTreeViewDataProvider(this.id);
        };
        TreeDataSource = __decorate([
            __param(1, progress_1.IProgressService)
        ], TreeDataSource);
        return TreeDataSource;
    }());
    var TreeRenderer = (function () {
        function TreeRenderer(themeService) {
            this.themeService = themeService;
        }
        TreeRenderer.prototype.getHeight = function (tree, element) {
            return TreeRenderer.ITEM_HEIGHT;
        };
        TreeRenderer.prototype.getTemplateId = function (tree, element) {
            return TreeRenderer.TREE_TEMPLATE_ID;
        };
        TreeRenderer.prototype.renderTemplate = function (tree, templateId, container) {
            var el = builder_1.$(container);
            var item = builder_1.$('.custom-view-tree-node-item');
            item.appendTo(el);
            var icon = builder_1.$('.custom-view-tree-node-item-icon').appendTo(item);
            var label = builder_1.$('.custom-view-tree-node-item-label').appendTo(item);
            var link = builder_1.$('a.label').appendTo(label);
            return { label: link, icon: icon };
        };
        TreeRenderer.prototype.renderElement = function (tree, node, templateId, templateData) {
            templateData.label.text(node.label).title(node.label);
            var theme = this.themeService.getTheme();
            var icon = theme.type === themeService_1.LIGHT ? node.icon : node.iconDark;
            if (icon) {
                templateData.icon.getHTMLElement().style.backgroundImage = "url('" + icon + "')";
                DOM.addClass(templateData.icon.getHTMLElement(), 'custom-view-tree-node-item-icon');
            }
            else {
                templateData.icon.getHTMLElement().style.backgroundImage = '';
                DOM.removeClass(templateData.icon.getHTMLElement(), 'custom-view-tree-node-item-icon');
            }
        };
        TreeRenderer.prototype.disposeTemplate = function (tree, templateId, templateData) {
        };
        TreeRenderer.ITEM_HEIGHT = 22;
        TreeRenderer.TREE_TEMPLATE_ID = 'treeExplorer';
        TreeRenderer = __decorate([
            __param(0, themeService_1.IThemeService)
        ], TreeRenderer);
        return TreeRenderer;
    }());
    var TreeController = (function (_super) {
        __extends(TreeController, _super);
        function TreeController(treeViewId, menus, contextMenuService, _keybindingService) {
            var _this = _super.call(this, { clickBehavior: treeDefaults_1.ClickBehavior.ON_MOUSE_UP /* do not change to not break DND */, keyboardSupport: false }) || this;
            _this.treeViewId = treeViewId;
            _this.menus = menus;
            _this.contextMenuService = contextMenuService;
            _this._keybindingService = _keybindingService;
            return _this;
        }
        TreeController.prototype.onContextMenu = function (tree, node, event) {
            var _this = this;
            event.preventDefault();
            event.stopPropagation();
            tree.setFocus(node);
            var actions = this.menus.getResourceContextActions(node);
            if (!actions.length) {
                return true;
            }
            var anchor = { x: event.posx + 1, y: event.posy };
            this.contextMenuService.showContextMenu({
                getAnchor: function () { return anchor; },
                getActions: function () {
                    return winjs_base_1.TPromise.as(actions);
                },
                getActionItem: function (action) {
                    var keybinding = _this._keybindingService.lookupKeybinding(action.id);
                    if (keybinding) {
                        return new actionbar_1.ActionItem(action, action, { label: true, keybinding: keybinding.getLabel() });
                    }
                    return null;
                },
                onHide: function (wasCancelled) {
                    if (wasCancelled) {
                        tree.DOMFocus();
                    }
                },
                getActionsContext: function () { return ({ $treeViewId: _this.treeViewId, $treeItemHandle: node.handle }); },
                actionRunner: new MultipleSelectionActionRunner(function () { return tree.getSelection(); })
            });
            return true;
        };
        TreeController = __decorate([
            __param(2, contextView_1.IContextMenuService),
            __param(3, keybinding_1.IKeybindingService)
        ], TreeController);
        return TreeController;
    }(treeDefaults_1.DefaultController));
    var MultipleSelectionActionRunner = (function (_super) {
        __extends(MultipleSelectionActionRunner, _super);
        function MultipleSelectionActionRunner(getSelectedResources) {
            var _this = _super.call(this) || this;
            _this.getSelectedResources = getSelectedResources;
            return _this;
        }
        MultipleSelectionActionRunner.prototype.runAction = function (action, context) {
            if (action instanceof actions_2.MenuItemAction) {
                var selection = this.getSelectedResources();
                var filteredSelection = selection.filter(function (s) { return s !== context; });
                if (selection.length === filteredSelection.length || selection.length === 1) {
                    return action.run(context);
                }
                return action.run.apply(action, [context].concat(filteredSelection));
            }
            return _super.prototype.runAction.call(this, action, context);
        };
        return MultipleSelectionActionRunner;
    }(actions_1.ActionRunner));
    var Menus = (function () {
        function Menus(id, contextKeyService, menuService) {
            var _this = this;
            this.id = id;
            this.contextKeyService = contextKeyService;
            this.menuService = menuService;
            this.disposables = [];
            this.titleDisposable = lifecycle_1.empty;
            this.titleActions = [];
            this.titleSecondaryActions = [];
            this._onDidChangeTitle = new event_1.Emitter();
            if (this.titleDisposable) {
                this.titleDisposable.dispose();
                this.titleDisposable = lifecycle_1.empty;
            }
            var _contextKeyService = this.contextKeyService.createScoped();
            _contextKeyService.createKey('view', id);
            var titleMenu = this.menuService.createMenu(actions_2.MenuId.ViewTitle, _contextKeyService);
            var updateActions = function () {
                _this.titleActions = [];
                _this.titleSecondaryActions = [];
                menuItemActionItem_1.fillInActions(titleMenu, null, { primary: _this.titleActions, secondary: _this.titleSecondaryActions });
                _this._onDidChangeTitle.fire();
            };
            var listener = titleMenu.onDidChange(updateActions);
            updateActions();
            this.titleDisposable = lifecycle_1.toDisposable(function () {
                listener.dispose();
                titleMenu.dispose();
                _contextKeyService.dispose();
                _this.titleActions = [];
                _this.titleSecondaryActions = [];
            });
        }
        Object.defineProperty(Menus.prototype, "onDidChangeTitle", {
            get: function () { return this._onDidChangeTitle.event; },
            enumerable: true,
            configurable: true
        });
        Menus.prototype.getTitleActions = function () {
            return this.titleActions;
        };
        Menus.prototype.getTitleSecondaryActions = function () {
            return this.titleSecondaryActions;
        };
        Menus.prototype.getResourceContextActions = function (element) {
            return this.getActions(actions_2.MenuId.ViewItemContext, { key: 'viewItem', value: element.contextValue }).secondary;
        };
        Menus.prototype.getActions = function (menuId, context) {
            var contextKeyService = this.contextKeyService.createScoped();
            contextKeyService.createKey('view', this.id);
            contextKeyService.createKey(context.key, context.value);
            var menu = this.menuService.createMenu(menuId, contextKeyService);
            var primary = [];
            var secondary = [];
            var result = { primary: primary, secondary: secondary };
            menuItemActionItem_1.fillInActions(menu, { shouldForwardArgs: true }, result);
            menu.dispose();
            contextKeyService.dispose();
            return result;
        };
        Menus.prototype.dispose = function () {
            this.disposables = lifecycle_1.dispose(this.disposables);
        };
        Menus = __decorate([
            __param(1, contextkey_1.IContextKeyService),
            __param(2, actions_2.IMenuService)
        ], Menus);
        return Menus;
    }());
});
//# sourceMappingURL=treeView.js.map