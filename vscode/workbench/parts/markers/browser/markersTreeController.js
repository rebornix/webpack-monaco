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
define(["require", "exports", "vs/base/common/winjs.base", "vs/base/parts/tree/browser/treeDefaults", "vs/workbench/parts/markers/common/markersModel", "vs/platform/contextview/browser/contextView", "vs/platform/contextkey/common/contextkey", "vs/platform/actions/common/actions", "vs/base/browser/ui/actionbar/actionbar", "vs/platform/keybinding/common/keybinding"], function (require, exports, winjs_base_1, treedefaults, markersModel_1, contextView_1, contextkey_1, actions_1, actionbar_1, keybinding_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Controller = (function (_super) {
        __extends(Controller, _super);
        function Controller(contextMenuService, menuService, contextKeyService, _keybindingService) {
            var _this = _super.call(this, { clickBehavior: treedefaults.ClickBehavior.ON_MOUSE_DOWN, keyboardSupport: false }) || this;
            _this.contextMenuService = contextMenuService;
            _this._keybindingService = _keybindingService;
            _this.contextMenu = menuService.createMenu(actions_1.MenuId.ProblemsPanelContext, contextKeyService);
            return _this;
        }
        Controller.prototype.onLeftClick = function (tree, element, event) {
            var currentFoucssed = tree.getFocus();
            if (_super.prototype.onLeftClick.call(this, tree, element, event)) {
                if (element instanceof markersModel_1.MarkersModel) {
                    if (currentFoucssed) {
                        tree.setFocus(currentFoucssed);
                    }
                    else {
                        tree.focusFirst();
                    }
                }
                return true;
            }
            return false;
        };
        Controller.prototype.onContextMenu = function (tree, element, event) {
            var _this = this;
            tree.setFocus(element);
            var actions = this._getMenuActions();
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
                }
            });
            return true;
        };
        Controller.prototype._getMenuActions = function () {
            var result = [];
            var groups = this.contextMenu.getActions();
            for (var _i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
                var group = groups_1[_i];
                var actions = group[1];
                result.push.apply(result, actions);
                result.push(new actionbar_1.Separator());
            }
            result.pop(); // remove last separator
            return result;
        };
        Controller = __decorate([
            __param(0, contextView_1.IContextMenuService),
            __param(1, actions_1.IMenuService),
            __param(2, contextkey_1.IContextKeyService),
            __param(3, keybinding_1.IKeybindingService)
        ], Controller);
        return Controller;
    }(treedefaults.DefaultController));
    exports.Controller = Controller;
});
//# sourceMappingURL=markersTreeController.js.map