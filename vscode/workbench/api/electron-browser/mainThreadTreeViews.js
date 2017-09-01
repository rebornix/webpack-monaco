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
define(["require", "exports", "vs/base/common/event", "vs/base/common/winjs.base", "vs/base/common/lifecycle", "../node/extHost.protocol", "vs/platform/message/common/message", "vs/workbench/parts/views/browser/viewsRegistry", "vs/workbench/parts/views/common/views", "vs/workbench/api/electron-browser/extHostCustomers"], function (require, exports, event_1, winjs_base_1, lifecycle_1, extHost_protocol_1, message_1, viewsRegistry_1, views_1, extHostCustomers_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var MainThreadTreeViews = (function (_super) {
        __extends(MainThreadTreeViews, _super);
        function MainThreadTreeViews(extHostContext, messageService) {
            var _this = _super.call(this) || this;
            _this.messageService = messageService;
            _this._proxy = extHostContext.get(extHost_protocol_1.ExtHostContext.ExtHostTreeViews);
            return _this;
        }
        MainThreadTreeViews.prototype.$registerView = function (treeViewId) {
            viewsRegistry_1.ViewsRegistry.registerTreeViewDataProvider(treeViewId, this._register(new TreeViewDataProvider(treeViewId, this._proxy, this.messageService)));
        };
        MainThreadTreeViews.prototype.$refresh = function (treeViewId, treeItemHandles) {
            var treeViewDataProvider = viewsRegistry_1.ViewsRegistry.getTreeViewDataProvider(treeViewId);
            if (treeViewDataProvider) {
                treeViewDataProvider.refresh(treeItemHandles);
            }
        };
        MainThreadTreeViews.prototype.dispose = function () {
            viewsRegistry_1.ViewsRegistry.deregisterTreeViewDataProviders();
            _super.prototype.dispose.call(this);
        };
        MainThreadTreeViews = __decorate([
            extHostCustomers_1.extHostNamedCustomer(extHost_protocol_1.MainContext.MainThreadTreeViews),
            __param(1, message_1.IMessageService)
        ], MainThreadTreeViews);
        return MainThreadTreeViews;
    }(lifecycle_1.Disposable));
    exports.MainThreadTreeViews = MainThreadTreeViews;
    var TreeViewDataProvider = (function () {
        function TreeViewDataProvider(treeViewId, _proxy, messageService) {
            this.treeViewId = treeViewId;
            this._proxy = _proxy;
            this.messageService = messageService;
            this._onDidChange = new event_1.Emitter();
            this.onDidChange = this._onDidChange.event;
            this._onDispose = new event_1.Emitter();
            this.onDispose = this._onDispose.event;
            this.childrenMap = new Map();
            this.itemsMap = new Map();
        }
        TreeViewDataProvider.prototype.getElements = function () {
            var _this = this;
            return this._proxy.$getElements(this.treeViewId)
                .then(function (elements) {
                _this.postGetElements(null, elements);
                return elements;
            }, function (err) {
                _this.messageService.show(message_1.Severity.Error, err);
                return null;
            });
        };
        TreeViewDataProvider.prototype.getChildren = function (treeItem) {
            var _this = this;
            if (treeItem.children) {
                return winjs_base_1.TPromise.as(treeItem.children);
            }
            return this._proxy.$getChildren(this.treeViewId, treeItem.handle)
                .then(function (children) {
                _this.postGetElements(treeItem.handle, children);
                return children;
            }, function (err) {
                _this.messageService.show(message_1.Severity.Error, err);
                return null;
            });
        };
        TreeViewDataProvider.prototype.refresh = function (treeItemHandles) {
            var _this = this;
            if (treeItemHandles && treeItemHandles.length) {
                var treeItems = treeItemHandles.map(function (treeItemHandle) { return _this.itemsMap.get(treeItemHandle); })
                    .filter(function (treeItem) { return !!treeItem; });
                if (treeItems.length) {
                    this._onDidChange.fire(treeItems);
                }
            }
            else {
                this._onDidChange.fire();
            }
        };
        TreeViewDataProvider.prototype.dispose = function () {
            this._onDispose.fire();
        };
        TreeViewDataProvider.prototype.clearChildren = function (treeItemHandle) {
            var children = this.childrenMap.get(treeItemHandle);
            if (children) {
                for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
                    var child = children_1[_i];
                    this.clearChildren(child);
                    this.itemsMap.delete(child);
                }
                this.childrenMap.delete(treeItemHandle);
            }
        };
        TreeViewDataProvider.prototype.postGetElements = function (parent, children) {
            this.setElements(parent, children);
        };
        TreeViewDataProvider.prototype.setElements = function (parent, children) {
            if (children && children.length) {
                for (var _i = 0, children_2 = children; _i < children_2.length; _i++) {
                    var child = children_2[_i];
                    this.itemsMap.set(child.handle, child);
                    if (child.children && child.children.length) {
                        this.setElements(child.handle, child.children);
                    }
                }
                if (parent) {
                    this.childrenMap.set(parent, children.map(function (child) { return child.handle; }));
                }
            }
        };
        TreeViewDataProvider.prototype.populateElementsToExpand = function (elements, toExpand) {
            for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
                var element = elements_1[_i];
                if (element.collapsibleState === views_1.TreeItemCollapsibleState.Expanded) {
                    toExpand.push(element);
                    if (element.children && element.children.length) {
                        this.populateElementsToExpand(element.children, toExpand);
                    }
                }
            }
        };
        return TreeViewDataProvider;
    }());
});
//# sourceMappingURL=mainThreadTreeViews.js.map