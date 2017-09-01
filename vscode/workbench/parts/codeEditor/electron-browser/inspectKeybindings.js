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
define(["require", "exports", "vs/nls", "vs/editor/common/editorCommonExtensions", "vs/platform/keybinding/common/keybinding", "vs/workbench/services/keybinding/electron-browser/keybindingService", "vs/workbench/services/editor/common/editorService"], function (require, exports, nls, editorCommonExtensions_1, keybinding_1, keybindingService_1, editorService_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var InspectKeyMap = (function (_super) {
        __extends(InspectKeyMap, _super);
        function InspectKeyMap() {
            return _super.call(this, {
                id: 'workbench.action.inspectKeyMappings',
                label: nls.localize('workbench.action.inspectKeyMap', "Developer: Inspect Key Mappings"),
                alias: 'Developer: Inspect Key Mappings',
                precondition: null
            }) || this;
        }
        InspectKeyMap.prototype.run = function (accessor, editor) {
            var keybindingService = accessor.get(keybinding_1.IKeybindingService);
            var editorService = accessor.get(editorService_1.IWorkbenchEditorService);
            if (keybindingService instanceof keybindingService_1.WorkbenchKeybindingService) {
                editorService.openEditor({ contents: keybindingService.dumpDebugInfo(), options: { pinned: true } });
            }
        };
        InspectKeyMap = __decorate([
            editorCommonExtensions_1.editorAction
        ], InspectKeyMap);
        return InspectKeyMap;
    }(editorCommonExtensions_1.EditorAction));
});
//# sourceMappingURL=inspectKeybindings.js.map