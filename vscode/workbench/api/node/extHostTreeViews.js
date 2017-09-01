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
define(["require", "exports", "vs/nls", "vs/base/common/uri", "vs/base/common/arrays", "vs/base/common/event", "vs/base/common/winjs.base", "vs/base/common/lifecycle", "./extHostTypes", "vs/base/common/async"], function (require, exports, nls_1, uri_1, arrays_1, event_1, winjs_base_1, lifecycle_1, extHostTypes_1, async_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExtHostTreeViews = (function () {
        function ExtHostTreeViews(_proxy, commands) {
            var _this = this;
            this._proxy = _proxy;
            this.commands = commands;
            this.treeViews = new Map();
            commands.registerArgumentProcessor({
                processArgument: function (arg) {
                    if (arg && arg.$treeViewId && arg.$treeItemHandle) {
                        return _this.convertArgument(arg);
                    }
                    return arg;
                }
            });
        }
        ExtHostTreeViews.prototype.registerTreeDataProvider = function (id, treeDataProvider) {
            var _this = this;
            var treeView = new ExtHostTreeView(id, treeDataProvider, this._proxy, this.commands.converter);
            this.treeViews.set(id, treeView);
            return {
                dispose: function () {
                    _this.treeViews.delete(id);
                    treeView.dispose();
                }
            };
        };
        ExtHostTreeViews.prototype.$getElements = function (treeViewId) {
            var treeView = this.treeViews.get(treeViewId);
            if (!treeView) {
                return winjs_base_1.TPromise.wrapError(new Error(nls_1.localize('treeView.notRegistered', 'No tree view with id \'{0}\' registered.', treeViewId)));
            }
            return treeView.getTreeItems();
        };
        ExtHostTreeViews.prototype.$getChildren = function (treeViewId, treeItemHandle) {
            var treeView = this.treeViews.get(treeViewId);
            if (!treeView) {
                return winjs_base_1.TPromise.wrapError(new Error(nls_1.localize('treeView.notRegistered', 'No tree view with id \'{0}\' registered.', treeViewId)));
            }
            return treeView.getChildren(treeItemHandle);
        };
        ExtHostTreeViews.prototype.convertArgument = function (arg) {
            var treeView = this.treeViews.get(arg.$treeViewId);
            return treeView ? treeView.getExtensionElement(arg.$treeItemHandle) : null;
        };
        return ExtHostTreeViews;
    }());
    exports.ExtHostTreeViews = ExtHostTreeViews;
    var ExtHostTreeView = (function (_super) {
        __extends(ExtHostTreeView, _super);
        function ExtHostTreeView(viewId, dataProvider, proxy, commands) {
            var _this = _super.call(this) || this;
            _this.viewId = viewId;
            _this.dataProvider = dataProvider;
            _this.proxy = proxy;
            _this.commands = commands;
            _this._itemHandlePool = 0;
            _this.extElementsMap = new Map();
            _this.itemHandlesMap = new Map();
            _this.extChildrenElementsMap = new Map();
            _this.proxy.$registerView(viewId);
            if (dataProvider.onDidChangeTreeData) {
                _this._register(event_1.debounceEvent(dataProvider.onDidChangeTreeData, function (last, current) { return last ? last.concat([current]) : [current]; }, 200)(function (elements) { return _this._refresh(elements); }));
            }
            return _this;
        }
        ExtHostTreeView.prototype.getTreeItems = function () {
            var _this = this;
            this.extChildrenElementsMap.clear();
            this.extElementsMap.clear();
            this.itemHandlesMap.clear();
            return async_1.asWinJsPromise(function () { return _this.dataProvider.getChildren(); })
                .then(function (elements) { return _this.processAndMapElements(elements); });
        };
        ExtHostTreeView.prototype.getChildren = function (treeItemHandle) {
            var _this = this;
            var extElement = this.getExtensionElement(treeItemHandle);
            if (extElement) {
                this.clearChildren(extElement);
            }
            else {
                return winjs_base_1.TPromise.wrapError(new Error(nls_1.localize('treeItem.notFound', 'No tree item with id \'{0}\' found.', treeItemHandle)));
            }
            return async_1.asWinJsPromise(function () { return _this.dataProvider.getChildren(extElement); })
                .then(function (childrenElements) { return _this.processAndMapElements(childrenElements); });
        };
        ExtHostTreeView.prototype.getExtensionElement = function (treeItemHandle) {
            return this.extElementsMap.get(treeItemHandle);
        };
        ExtHostTreeView.prototype._refresh = function (elements) {
            var _this = this;
            var hasRoot = elements.some(function (element) { return !element; });
            if (hasRoot) {
                this.proxy.$refresh(this.viewId, []);
            }
            else {
                var itemHandles = arrays_1.distinct(elements.map(function (element) { return _this.itemHandlesMap.get(element); })
                    .filter(function (itemHandle) { return !!itemHandle; }));
                if (itemHandles.length) {
                    this.proxy.$refresh(this.viewId, itemHandles);
                }
            }
        };
        ExtHostTreeView.prototype.processAndMapElements = function (elements) {
            var _this = this;
            if (elements && elements.length) {
                return winjs_base_1.TPromise.join(elements.filter(function (element) { return !!element; })
                    .map(function (element) {
                    if (_this.extChildrenElementsMap.has(element)) {
                        return winjs_base_1.TPromise.wrapError(new Error(nls_1.localize('treeView.duplicateElement', 'Element {0} is already registered', element)));
                    }
                    return _this.resolveElement(element);
                }))
                    .then(function (treeItems) { return treeItems.filter(function (treeItem) { return !!treeItem; }); });
            }
            return winjs_base_1.TPromise.as([]);
        };
        ExtHostTreeView.prototype.resolveElement = function (element) {
            var _this = this;
            return async_1.asWinJsPromise(function () { return _this.dataProvider.getTreeItem(element); })
                .then(function (extTreeItem) {
                var treeItem = _this.massageTreeItem(extTreeItem);
                if (treeItem) {
                    _this.itemHandlesMap.set(element, treeItem.handle);
                    _this.extElementsMap.set(treeItem.handle, element);
                    if (treeItem.collapsibleState === extHostTypes_1.TreeItemCollapsibleState.Expanded) {
                        return _this.getChildren(treeItem.handle).then(function (children) {
                            treeItem.children = children;
                            return treeItem;
                        });
                    }
                    else {
                        return treeItem;
                    }
                }
                return null;
            });
        };
        ExtHostTreeView.prototype.massageTreeItem = function (extensionTreeItem) {
            if (!extensionTreeItem) {
                return null;
            }
            var icon = this.getLightIconPath(extensionTreeItem);
            return {
                handle: ++this._itemHandlePool,
                label: extensionTreeItem.label,
                command: extensionTreeItem.command ? this.commands.toInternal(extensionTreeItem.command) : void 0,
                contextValue: extensionTreeItem.contextValue,
                icon: icon,
                iconDark: this.getDarkIconPath(extensionTreeItem) || icon,
                collapsibleState: extensionTreeItem.collapsibleState,
            };
        };
        ExtHostTreeView.prototype.getLightIconPath = function (extensionTreeItem) {
            if (extensionTreeItem.iconPath) {
                if (typeof extensionTreeItem.iconPath === 'string' || extensionTreeItem.iconPath instanceof uri_1.default) {
                    return this.getIconPath(extensionTreeItem.iconPath);
                }
                return this.getIconPath(extensionTreeItem.iconPath['light']);
            }
            return void 0;
        };
        ExtHostTreeView.prototype.getDarkIconPath = function (extensionTreeItem) {
            if (extensionTreeItem.iconPath && extensionTreeItem.iconPath['dark']) {
                return this.getIconPath(extensionTreeItem.iconPath['dark']);
            }
            return void 0;
        };
        ExtHostTreeView.prototype.getIconPath = function (iconPath) {
            if (iconPath instanceof uri_1.default) {
                return iconPath.toString();
            }
            return uri_1.default.file(iconPath).toString();
        };
        ExtHostTreeView.prototype.clearChildren = function (extElement) {
            var children = this.extChildrenElementsMap.get(extElement);
            if (children) {
                for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                    var child = children_1[_i];
                    this.clearElement(child);
                }
                this.extChildrenElementsMap.delete(extElement);
            }
        };
        ExtHostTreeView.prototype.clearElement = function (extElement) {
            this.clearChildren(extElement);
            var treeItemhandle = this.itemHandlesMap.get(extElement);
            this.itemHandlesMap.delete(extElement);
            if (treeItemhandle) {
                this.extElementsMap.delete(treeItemhandle);
            }
        };
        ExtHostTreeView.prototype.dispose = function () {
            this.extElementsMap.clear();
            this.itemHandlesMap.clear();
            this.extChildrenElementsMap.clear();
        };
        return ExtHostTreeView;
    }(lifecycle_1.Disposable));
});
//# sourceMappingURL=extHostTreeViews.js.map