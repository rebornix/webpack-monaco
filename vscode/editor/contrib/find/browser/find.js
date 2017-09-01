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
define(["require", "exports", "vs/platform/contextview/browser/contextView", "vs/platform/keybinding/common/keybinding", "vs/platform/contextkey/common/contextkey", "vs/editor/browser/editorBrowserExtensions", "vs/editor/contrib/find/browser/findWidget", "vs/editor/contrib/find/browser/findOptionsWidget", "vs/editor/contrib/find/common/findController", "vs/platform/theme/common/themeService", "vs/platform/storage/common/storage"], function (require, exports, contextView_1, keybinding_1, contextkey_1, editorBrowserExtensions_1, findWidget_1, findOptionsWidget_1, findController_1, themeService_1, storage_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var FindController = (function (_super) {
        __extends(FindController, _super);
        function FindController(editor, contextViewService, contextKeyService, keybindingService, themeService, storageService) {
            var _this = _super.call(this, editor, contextKeyService, storageService) || this;
            _this._widget = _this._register(new findWidget_1.FindWidget(editor, _this, _this._state, contextViewService, keybindingService, contextKeyService, themeService));
            _this._findOptionsWidget = _this._register(new findOptionsWidget_1.FindOptionsWidget(editor, _this._state, keybindingService, themeService));
            return _this;
        }
        FindController.prototype._start = function (opts) {
            _super.prototype._start.call(this, opts);
            if (opts.shouldFocus === 2 /* FocusReplaceInput */) {
                this._widget.focusReplaceInput();
            }
            else if (opts.shouldFocus === 1 /* FocusFindInput */) {
                this._widget.focusFindInput();
            }
        };
        FindController.prototype.highlightFindOptions = function () {
            if (this._state.isRevealed) {
                this._widget.highlightFindOptions();
            }
            else {
                this._findOptionsWidget.highlightFindOptions();
            }
        };
        FindController = __decorate([
            editorBrowserExtensions_1.editorContribution,
            __param(1, contextView_1.IContextViewService),
            __param(2, contextkey_1.IContextKeyService),
            __param(3, keybinding_1.IKeybindingService),
            __param(4, themeService_1.IThemeService),
            __param(5, storage_1.IStorageService)
        ], FindController);
        return FindController;
    }(findController_1.CommonFindController));
    exports.FindController = FindController;
});
//# sourceMappingURL=find.js.map