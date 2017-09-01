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
define(["require", "exports", "vs/workbench/common/editor/resourceEditorInput", "vs/editor/common/services/resolverService"], function (require, exports, resourceEditorInput_1, resolverService_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function areHtmlInputOptionsEqual(left, right) {
        return left.allowScripts === right.allowScripts && left.allowSvgs === right.allowSvgs;
    }
    exports.areHtmlInputOptionsEqual = areHtmlInputOptionsEqual;
    var HtmlInput = (function (_super) {
        __extends(HtmlInput, _super);
        function HtmlInput(name, description, resource, options, textModelResolverService) {
            var _this = _super.call(this, name, description, resource, textModelResolverService) || this;
            _this.options = options;
            return _this;
        }
        HtmlInput = __decorate([
            __param(4, resolverService_1.ITextModelService)
        ], HtmlInput);
        return HtmlInput;
    }(resourceEditorInput_1.ResourceEditorInput));
    exports.HtmlInput = HtmlInput;
});
//# sourceMappingURL=htmlInput.js.map