var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/browser/ui/list/listWidget", "vs/platform/instantiation/common/instantiation", "vs/base/common/lifecycle", "vs/platform/contextkey/common/contextkey", "vs/base/common/async"], function (require, exports, listWidget_1, instantiation_1, lifecycle_1, contextkey_1, async_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IListService = instantiation_1.createDecorator('listService');
    exports.ListFocusContext = new contextkey_1.RawContextKey('listFocus', false);
    var ListService = (function () {
        function ListService(contextKeyService) {
            var _this = this;
            this.listFocusContext = exports.ListFocusContext.bindTo(contextKeyService);
            this.lists = [];
            this.focusChangeScheduler = new async_1.RunOnceScheduler(function () { return _this.onFocusChange(); }, 50 /* delay until the focus/blur dust settles */);
        }
        ListService.prototype.register = function (widget, extraContextKeys) {
            var _this = this;
            if (this.indexOf(widget) >= 0) {
                throw new Error('Cannot register the same widget multiple times');
            }
            // Keep in our lists list
            var registeredList = { widget: widget, extraContextKeys: extraContextKeys };
            this.lists.push(registeredList);
            // Check for currently being focused
            if (widget.isDOMFocused()) {
                this.setFocusedList(registeredList);
            }
            var toDispose = [
                widget.onDOMFocus(function () { return _this.focusChangeScheduler.schedule(); }),
                widget.onDOMBlur(function () { return _this.focusChangeScheduler.schedule(); })
            ];
            // Special treatment for tree highlight mode
            if (!(widget instanceof listWidget_1.List)) {
                var tree = widget;
                toDispose.push(tree.onHighlightChange(function () {
                    _this.focusChangeScheduler.schedule();
                }));
            }
            // Remove list once disposed
            toDispose.push({
                dispose: function () { _this.lists.splice(_this.lists.indexOf(registeredList), 1); }
            });
            return {
                dispose: function () { return lifecycle_1.dispose(toDispose); }
            };
        };
        ListService.prototype.indexOf = function (widget) {
            for (var i = 0; i < this.lists.length; i++) {
                var list = this.lists[i];
                if (list.widget === widget) {
                    return i;
                }
            }
            return -1;
        };
        ListService.prototype.onFocusChange = function () {
            var focusedList;
            for (var i = 0; i < this.lists.length; i++) {
                var list = this.lists[i];
                if (document.activeElement === list.widget.getHTMLElement()) {
                    focusedList = list;
                    break;
                }
            }
            this.setFocusedList(focusedList);
        };
        ListService.prototype.setFocusedList = function (focusedList) {
            // First update our context
            if (focusedList) {
                this.focusedTreeOrList = focusedList.widget;
                this.listFocusContext.set(true);
            }
            else {
                this.focusedTreeOrList = void 0;
                this.listFocusContext.set(false);
            }
            // Then check for extra contexts to unset
            for (var i = 0; i < this.lists.length; i++) {
                var list = this.lists[i];
                if (list !== focusedList && list.extraContextKeys) {
                    list.extraContextKeys.forEach(function (key) { return key.set(false); });
                }
            }
            // Finally set context for focused list if there are any
            if (focusedList && focusedList.extraContextKeys) {
                focusedList.extraContextKeys.forEach(function (key) { return key.set(true); });
            }
        };
        ListService.prototype.getFocused = function () {
            return this.focusedTreeOrList;
        };
        ListService = __decorate([
            __param(0, contextkey_1.IContextKeyService)
        ], ListService);
        return ListService;
    }());
    exports.ListService = ListService;
});
//# sourceMappingURL=listService.js.map