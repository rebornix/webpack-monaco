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
define(["require", "exports", "vs/nls", "vs/editor/common/editorCommonExtensions", "vs/editor/common/config/commonEditorConfig"], function (require, exports, nls, editorCommonExtensions_1, commonEditorConfig_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ToggleTabFocusModeAction = (function (_super) {
        __extends(ToggleTabFocusModeAction, _super);
        function ToggleTabFocusModeAction() {
            return _super.call(this, {
                id: ToggleTabFocusModeAction_1.ID,
                label: nls.localize({ key: 'toggle.tabMovesFocus', comment: ['Turn on/off use of tab key for moving focus around VS Code'] }, "Toggle Tab Key Moves Focus"),
                alias: 'Toggle Tab Key Moves Focus',
                precondition: null,
                kbOpts: {
                    kbExpr: null,
                    primary: 2048 /* CtrlCmd */ | 43 /* KEY_M */,
                    mac: { primary: 256 /* WinCtrl */ | 1024 /* Shift */ | 43 /* KEY_M */ }
                }
            }) || this;
        }
        ToggleTabFocusModeAction_1 = ToggleTabFocusModeAction;
        ToggleTabFocusModeAction.prototype.run = function (accessor, editor) {
            var oldValue = commonEditorConfig_1.TabFocus.getTabFocusMode();
            commonEditorConfig_1.TabFocus.setTabFocusMode(!oldValue);
        };
        ToggleTabFocusModeAction.ID = 'editor.action.toggleTabFocusMode';
        ToggleTabFocusModeAction = ToggleTabFocusModeAction_1 = __decorate([
            editorCommonExtensions_1.editorAction
        ], ToggleTabFocusModeAction);
        return ToggleTabFocusModeAction;
        var ToggleTabFocusModeAction_1;
    }(editorCommonExtensions_1.EditorAction));
    exports.ToggleTabFocusModeAction = ToggleTabFocusModeAction;
});
//# sourceMappingURL=toggleTabFocusMode.js.map