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
define(["require", "exports", "vs/nls", "vs/base/common/winjs.base", "vs/editor/common/editorCommonExtensions", "vs/platform/quickOpen/common/quickOpen", "vs/editor/common/editorContextKeys"], function (require, exports, nls, winjs_base_1, editorCommonExtensions_1, quickOpen_1, editorContextKeys_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var EMMET_COMMANDS_PREFIX = '>Emmet: ';
    var ShowEmmetCommandsAction = (function (_super) {
        __extends(ShowEmmetCommandsAction, _super);
        function ShowEmmetCommandsAction() {
            return _super.call(this, {
                id: 'workbench.action.showEmmetCommands',
                label: nls.localize('showEmmetCommands', "Show Emmet Commands"),
                alias: 'Show Emmet Commands',
                precondition: editorContextKeys_1.EditorContextKeys.writable,
            }) || this;
        }
        ShowEmmetCommandsAction.prototype.run = function (accessor, editor) {
            var quickOpenService = accessor.get(quickOpen_1.IQuickOpenService);
            quickOpenService.show(EMMET_COMMANDS_PREFIX);
            return winjs_base_1.TPromise.as(null);
        };
        ShowEmmetCommandsAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], ShowEmmetCommandsAction);
        return ShowEmmetCommandsAction;
    }(editorCommonExtensions_1.EditorAction));
});
//# sourceMappingURL=showEmmetCommands.js.map