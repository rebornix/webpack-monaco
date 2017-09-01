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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/common/winjs.base", "vs/nls", "vs/base/common/actions", "vs/base/common/keyCodes", "vs/platform/registry/common/platform", "vs/platform/actions/common/actions", "vs/workbench/common/actionRegistry", "vs/workbench/services/part/common/partService"], function (require, exports, winjs_base_1, nls, actions_1, keyCodes_1, platform_1, actions_2, actionRegistry_1, partService_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ToggleZenMode = (function (_super) {
        __extends(ToggleZenMode, _super);
        function ToggleZenMode(id, label, partService) {
            var _this = _super.call(this, id, label) || this;
            _this.partService = partService;
            _this.enabled = !!_this.partService;
            return _this;
        }
        ToggleZenMode.prototype.run = function () {
            this.partService.toggleZenMode();
            return winjs_base_1.TPromise.as(null);
        };
        ToggleZenMode.ID = 'workbench.action.toggleZenMode';
        ToggleZenMode.LABEL = nls.localize('toggleZenMode', "Toggle Zen Mode");
        ToggleZenMode = __decorate([
            __param(2, partService_1.IPartService)
        ], ToggleZenMode);
        return ToggleZenMode;
    }(actions_1.Action));
    var registry = platform_1.Registry.as(actionRegistry_1.Extensions.WorkbenchActions);
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(ToggleZenMode, ToggleZenMode.ID, ToggleZenMode.LABEL, { primary: keyCodes_1.KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 56 /* KEY_Z */) }), 'View: Toggle Zen Mode', nls.localize('view', "View"));
});
//# sourceMappingURL=toggleZenMode.js.map