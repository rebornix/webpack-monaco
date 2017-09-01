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
define(["require", "exports", "vs/nls", "vs/base/common/lifecycle", "vs/platform/commands/common/commands", "vs/platform/contextview/browser/contextView", "vs/platform/contextkey/common/contextkey", "vs/platform/keybinding/common/keybinding", "vs/platform/markers/common/markers", "vs/editor/common/editorContextKeys", "vs/editor/common/editorCommonExtensions", "vs/editor/browser/editorBrowserExtensions", "./quickFixWidget", "./lightBulbWidget", "./quickFixModel"], function (require, exports, nls, lifecycle_1, commands_1, contextView_1, contextkey_1, keybinding_1, markers_1, editorContextKeys_1, editorCommonExtensions_1, editorBrowserExtensions_1, quickFixWidget_1, lightBulbWidget_1, quickFixModel_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var QuickFixController = (function () {
        function QuickFixController(editor, markerService, contextKeyService, commandService, contextMenuService, _keybindingService) {
            var _this = this;
            this._keybindingService = _keybindingService;
            this._disposables = [];
            this._editor = editor;
            this._model = new quickFixModel_1.QuickFixModel(this._editor, markerService);
            this._quickFixContextMenu = new quickFixWidget_1.QuickFixContextMenu(editor, contextMenuService, commandService);
            this._lightBulbWidget = new lightBulbWidget_1.LightBulbWidget(editor);
            this._updateLightBulbTitle();
            this._disposables.push(this._quickFixContextMenu.onDidExecuteCodeAction(function (_) { return _this._model.trigger('auto'); }), this._lightBulbWidget.onClick(this._handleLightBulbSelect, this), this._model.onDidChangeFixes(function (e) { return _this._onQuickFixEvent(e); }), this._keybindingService.onDidUpdateKeybindings(this._updateLightBulbTitle, this));
        }
        QuickFixController_1 = QuickFixController;
        QuickFixController.get = function (editor) {
            return editor.getContribution(QuickFixController_1.ID);
        };
        QuickFixController.prototype.dispose = function () {
            this._model.dispose();
            lifecycle_1.dispose(this._disposables);
        };
        QuickFixController.prototype._onQuickFixEvent = function (e) {
            if (e && e.type === 'manual') {
                this._quickFixContextMenu.show(e.fixes, e.position);
            }
            else if (e && e.fixes) {
                // auto magically triggered
                // * update an existing list of code actions
                // * manage light bulb
                if (this._quickFixContextMenu.isVisible) {
                    this._quickFixContextMenu.show(e.fixes, e.position);
                }
                else {
                    this._lightBulbWidget.model = e;
                }
            }
            else {
                this._lightBulbWidget.hide();
            }
        };
        QuickFixController.prototype.getId = function () {
            return QuickFixController_1.ID;
        };
        QuickFixController.prototype._handleLightBulbSelect = function (coords) {
            this._quickFixContextMenu.show(this._lightBulbWidget.model.fixes, coords);
        };
        QuickFixController.prototype.triggerFromEditorSelection = function () {
            this._model.trigger('manual');
        };
        QuickFixController.prototype._updateLightBulbTitle = function () {
            var kb = this._keybindingService.lookupKeybinding(QuickFixAction.Id);
            var title;
            if (kb) {
                title = nls.localize('quickFixWithKb', "Show Fixes ({0})", kb.getLabel());
            }
            else {
                title = nls.localize('quickFix', "Show Fixes");
            }
            this._lightBulbWidget.title = title;
        };
        QuickFixController.ID = 'editor.contrib.quickFixController';
        QuickFixController = QuickFixController_1 = __decorate([
            editorBrowserExtensions_1.editorContribution,
            __param(1, markers_1.IMarkerService),
            __param(2, contextkey_1.IContextKeyService),
            __param(3, commands_1.ICommandService),
            __param(4, contextView_1.IContextMenuService),
            __param(5, keybinding_1.IKeybindingService)
        ], QuickFixController);
        return QuickFixController;
        var QuickFixController_1;
    }());
    exports.QuickFixController = QuickFixController;
    var QuickFixAction = (function (_super) {
        __extends(QuickFixAction, _super);
        function QuickFixAction() {
            return _super.call(this, {
                id: QuickFixAction_1.Id,
                label: nls.localize('quickfix.trigger.label', "Quick Fix"),
                alias: 'Quick Fix',
                precondition: contextkey_1.ContextKeyExpr.and(editorContextKeys_1.EditorContextKeys.writable, editorContextKeys_1.EditorContextKeys.hasCodeActionsProvider),
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 2048 /* CtrlCmd */ | 84 /* US_DOT */
                }
            }) || this;
        }
        QuickFixAction_1 = QuickFixAction;
        QuickFixAction.prototype.run = function (accessor, editor) {
            var controller = QuickFixController.get(editor);
            if (controller) {
                controller.triggerFromEditorSelection();
            }
        };
        QuickFixAction.Id = 'editor.action.quickFix';
        QuickFixAction = QuickFixAction_1 = __decorate([
            editorCommonExtensions_1.editorAction
        ], QuickFixAction);
        return QuickFixAction;
        var QuickFixAction_1;
    }(editorCommonExtensions_1.EditorAction));
    exports.QuickFixAction = QuickFixAction;
});
//# sourceMappingURL=quickFixCommands.js.map