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
define(["require", "exports", "vs/nls", "vs/editor/common/editorCommonExtensions", "vs/workbench/services/configuration/common/configurationEditing"], function (require, exports, nls, editorCommonExtensions_1, configurationEditing_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ToggleRenderControlCharacterAction = (function (_super) {
        __extends(ToggleRenderControlCharacterAction, _super);
        function ToggleRenderControlCharacterAction() {
            return _super.call(this, {
                id: 'editor.action.toggleRenderControlCharacter',
                label: nls.localize('toggleRenderControlCharacters', "Toggle Control Characters"),
                alias: 'Toggle Control Characters',
                precondition: null
            }) || this;
        }
        ToggleRenderControlCharacterAction.prototype.run = function (accessor, editor) {
            var configurationEditingService = accessor.get(configurationEditing_1.IConfigurationEditingService);
            var newRenderControlCharacters = !editor.getConfiguration().viewInfo.renderControlCharacters;
            configurationEditingService.writeConfiguration(configurationEditing_1.ConfigurationTarget.USER, { key: 'editor.renderControlCharacters', value: newRenderControlCharacters });
        };
        ToggleRenderControlCharacterAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], ToggleRenderControlCharacterAction);
        return ToggleRenderControlCharacterAction;
    }(editorCommonExtensions_1.EditorAction));
    exports.ToggleRenderControlCharacterAction = ToggleRenderControlCharacterAction;
});
//# sourceMappingURL=toggleRenderControlCharacter.js.map