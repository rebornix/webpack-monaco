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
define(["require", "exports", "vs/nls", "vs/workbench/browser/parts/editor/binaryEditor", "vs/workbench/parts/files/common/files", "vs/platform/telemetry/common/telemetry", "vs/platform/theme/common/themeService", "vs/platform/windows/common/windows"], function (require, exports, nls, binaryEditor_1, files_1, telemetry_1, themeService_1, windows_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * An implementation of editor for binary files like images.
     */
    var BinaryFileEditor = (function (_super) {
        __extends(BinaryFileEditor, _super);
        function BinaryFileEditor(telemetryService, themeService, windowsService) {
            return _super.call(this, BinaryFileEditor.ID, telemetryService, themeService, windowsService) || this;
        }
        BinaryFileEditor.prototype.getTitle = function () {
            return this.input ? this.input.getName() : nls.localize('binaryFileEditor', "Binary File Viewer");
        };
        BinaryFileEditor.ID = files_1.BINARY_FILE_EDITOR_ID;
        BinaryFileEditor = __decorate([
            __param(0, telemetry_1.ITelemetryService),
            __param(1, themeService_1.IThemeService),
            __param(2, windows_1.IWindowsService)
        ], BinaryFileEditor);
        return BinaryFileEditor;
    }(binaryEditor_1.BaseBinaryResourceEditor));
    exports.BinaryFileEditor = BinaryFileEditor;
});
//# sourceMappingURL=binaryFileEditor.js.map