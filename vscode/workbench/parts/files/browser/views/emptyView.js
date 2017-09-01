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
define(["require", "exports", "vs/nls", "vs/base/common/errors", "vs/base/common/platform", "vs/base/browser/dom", "vs/base/common/winjs.base", "vs/base/browser/ui/button/button", "vs/base/browser/builder", "vs/workbench/parts/views/browser/views", "vs/platform/instantiation/common/instantiation", "vs/workbench/browser/actions/workspaceActions", "vs/platform/theme/common/styler", "vs/platform/theme/common/themeService", "vs/platform/keybinding/common/keybinding", "vs/platform/contextview/browser/contextView", "vs/base/browser/ui/splitview/splitview"], function (require, exports, nls, errors, env, DOM, winjs_base_1, button_1, builder_1, views_1, instantiation_1, workspaceActions_1, styler_1, themeService_1, keybinding_1, contextView_1, splitview_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var EmptyView = (function (_super) {
        __extends(EmptyView, _super);
        function EmptyView(initialSize, options, themeService, instantiationService, keybindingService, contextMenuService) {
            var _this = _super.call(this, initialSize, __assign({}, options, { ariaHeaderLabel: nls.localize('explorerSection', "Files Explorer Section"), sizing: splitview_1.ViewSizing.Flexible }), keybindingService, contextMenuService) || this;
            _this.themeService = themeService;
            _this.instantiationService = instantiationService;
            return _this;
        }
        EmptyView.prototype.renderHeader = function (container) {
            var titleDiv = builder_1.$('div.title').appendTo(container);
            builder_1.$('span').text(this.name).appendTo(titleDiv);
        };
        EmptyView.prototype.renderBody = function (container) {
            var _this = this;
            DOM.addClass(container, 'explorer-empty-view');
            var titleDiv = builder_1.$('div.section').appendTo(container);
            builder_1.$('p').text(nls.localize('noWorkspaceHelp', "You have not yet opened a folder.")).appendTo(titleDiv);
            var section = builder_1.$('div.section').appendTo(container);
            this.openFolderButton = new button_1.Button(section);
            styler_1.attachButtonStyler(this.openFolderButton, this.themeService);
            this.openFolderButton.label = nls.localize('openFolder', "Open Folder");
            this.openFolderButton.addListener('click', function () {
                var actionClass = env.isMacintosh ? workspaceActions_1.OpenFileFolderAction : workspaceActions_1.OpenFolderAction;
                var action = _this.instantiationService.createInstance(actionClass, actionClass.ID, actionClass.LABEL);
                _this.actionRunner.run(action).done(function () {
                    action.dispose();
                }, function (err) {
                    action.dispose();
                    errors.onUnexpectedError(err);
                });
            });
        };
        EmptyView.prototype.layoutBody = function (size) {
            // no-op
        };
        EmptyView.prototype.create = function () {
            return winjs_base_1.TPromise.as(null);
        };
        EmptyView.prototype.setVisible = function (visible) {
            return winjs_base_1.TPromise.as(null);
        };
        EmptyView.prototype.focusBody = function () {
            if (this.openFolderButton) {
                this.openFolderButton.getElement().focus();
            }
        };
        EmptyView.prototype.reveal = function (element, relativeTop) {
            return winjs_base_1.TPromise.as(null);
        };
        EmptyView.prototype.getActions = function () {
            return [];
        };
        EmptyView.prototype.getSecondaryActions = function () {
            return [];
        };
        EmptyView.prototype.getActionItem = function (action) {
            return null;
        };
        EmptyView.prototype.shutdown = function () {
            // Subclass to implement
        };
        EmptyView.ID = 'workbench.explorer.emptyView';
        EmptyView.NAME = nls.localize('noWorkspace', "No Folder Opened");
        EmptyView = __decorate([
            __param(2, themeService_1.IThemeService),
            __param(3, instantiation_1.IInstantiationService),
            __param(4, keybinding_1.IKeybindingService),
            __param(5, contextView_1.IContextMenuService)
        ], EmptyView);
        return EmptyView;
    }(views_1.CollapsibleView));
    exports.EmptyView = EmptyView;
});
//# sourceMappingURL=emptyView.js.map