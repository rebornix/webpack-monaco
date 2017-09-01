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
define(["require", "exports", "vs/base/common/winjs.base", "vs/nls", "vs/platform/registry/common/platform", "vs/base/common/actions", "vs/platform/actions/common/actions", "vs/workbench/common/actionRegistry", "vs/workbench/services/configuration/common/configurationEditing", "vs/workbench/services/part/common/partService"], function (require, exports, winjs_base_1, nls, platform_1, actions_1, actions_2, actionRegistry_1, configurationEditing_1, partService_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ToggleActivityBarVisibilityAction = (function (_super) {
        __extends(ToggleActivityBarVisibilityAction, _super);
        function ToggleActivityBarVisibilityAction(id, label, partService, configurationEditingService) {
            var _this = _super.call(this, id, label) || this;
            _this.partService = partService;
            _this.configurationEditingService = configurationEditingService;
            _this.enabled = !!_this.partService;
            return _this;
        }
        ToggleActivityBarVisibilityAction.prototype.run = function () {
            var visibility = this.partService.isVisible(partService_1.Parts.ACTIVITYBAR_PART);
            var newVisibilityValue = !visibility;
            this.configurationEditingService.writeConfiguration(configurationEditing_1.ConfigurationTarget.USER, { key: ToggleActivityBarVisibilityAction.activityBarVisibleKey, value: newVisibilityValue });
            return winjs_base_1.TPromise.as(null);
        };
        ToggleActivityBarVisibilityAction.ID = 'workbench.action.toggleActivityBarVisibility';
        ToggleActivityBarVisibilityAction.LABEL = nls.localize('toggleActivityBar', "Toggle Activity Bar Visibility");
        ToggleActivityBarVisibilityAction.activityBarVisibleKey = 'workbench.activityBar.visible';
        ToggleActivityBarVisibilityAction = __decorate([
            __param(2, partService_1.IPartService),
            __param(3, configurationEditing_1.IConfigurationEditingService)
        ], ToggleActivityBarVisibilityAction);
        return ToggleActivityBarVisibilityAction;
    }(actions_1.Action));
    exports.ToggleActivityBarVisibilityAction = ToggleActivityBarVisibilityAction;
    var registry = platform_1.Registry.as(actionRegistry_1.Extensions.WorkbenchActions);
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(ToggleActivityBarVisibilityAction, ToggleActivityBarVisibilityAction.ID, ToggleActivityBarVisibilityAction.LABEL), 'View: Toggle Activity Bar Visibility', nls.localize('view', "View"));
});
//# sourceMappingURL=toggleActivityBarVisibility.js.map