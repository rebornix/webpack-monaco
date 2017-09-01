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
    var ToggleRenderWhitespaceAction = (function (_super) {
        __extends(ToggleRenderWhitespaceAction, _super);
        function ToggleRenderWhitespaceAction() {
            return _super.call(this, {
                id: 'editor.action.toggleRenderWhitespace',
                label: nls.localize('toggleRenderWhitespace', "Toggle Render Whitespace"),
                alias: 'Toggle Render Whitespace',
                precondition: null
            }) || this;
        }
        ToggleRenderWhitespaceAction.prototype.run = function (accessor, editor) {
            var configurationEditingService = accessor.get(configurationEditing_1.IConfigurationEditingService);
            var renderWhitespace = editor.getConfiguration().viewInfo.renderWhitespace;
            var newRenderWhitespace;
            if (renderWhitespace === 'none') {
                newRenderWhitespace = 'all';
            }
            else {
                newRenderWhitespace = 'none';
            }
            configurationEditingService.writeConfiguration(configurationEditing_1.ConfigurationTarget.USER, { key: 'editor.renderWhitespace', value: newRenderWhitespace });
        };
        ToggleRenderWhitespaceAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], ToggleRenderWhitespaceAction);
        return ToggleRenderWhitespaceAction;
    }(editorCommonExtensions_1.EditorAction));
    exports.ToggleRenderWhitespaceAction = ToggleRenderWhitespaceAction;
});
//# sourceMappingURL=toggleRenderWhitespace.js.map