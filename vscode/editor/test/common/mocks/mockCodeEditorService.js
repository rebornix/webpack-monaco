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
define(["require", "exports", "vs/editor/common/services/abstractCodeEditorService"], function (require, exports, abstractCodeEditorService_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var MockCodeEditorService = (function (_super) {
        __extends(MockCodeEditorService, _super);
        function MockCodeEditorService() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MockCodeEditorService.prototype.registerDecorationType = function (key, options, parentTypeKey) { };
        MockCodeEditorService.prototype.removeDecorationType = function (key) { };
        MockCodeEditorService.prototype.resolveDecorationOptions = function (decorationTypeKey, writable) { return null; };
        return MockCodeEditorService;
    }(abstractCodeEditorService_1.AbstractCodeEditorService));
    exports.MockCodeEditorService = MockCodeEditorService;
});
//# sourceMappingURL=mockCodeEditorService.js.map