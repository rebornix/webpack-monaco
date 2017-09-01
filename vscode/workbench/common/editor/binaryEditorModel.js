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
define(["require", "exports", "vs/workbench/common/editor", "vs/platform/files/common/files"], function (require, exports, editor_1, files_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * An editor model that just represents a resource that can be loaded.
     */
    var BinaryEditorModel = (function (_super) {
        __extends(BinaryEditorModel, _super);
        function BinaryEditorModel(resource, name, fileService) {
            var _this = _super.call(this) || this;
            _this.fileService = fileService;
            _this.name = name;
            _this.resource = resource;
            return _this;
        }
        /**
         * The name of the binary resource.
         */
        BinaryEditorModel.prototype.getName = function () {
            return this.name;
        };
        /**
         * The resource of the binary resource.
         */
        BinaryEditorModel.prototype.getResource = function () {
            return this.resource;
        };
        /**
         * The size of the binary file if known.
         */
        BinaryEditorModel.prototype.getSize = function () {
            return this.size;
        };
        /**
         * The etag of the binary file if known.
         */
        BinaryEditorModel.prototype.getETag = function () {
            return this.etag;
        };
        BinaryEditorModel.prototype.load = function () {
            var _this = this;
            return this.fileService.resolveFile(this.resource).then(function (stat) {
                _this.etag = stat.etag;
                _this.size = stat.size;
                return _this;
            });
        };
        BinaryEditorModel = __decorate([
            __param(2, files_1.IFileService)
        ], BinaryEditorModel);
        return BinaryEditorModel;
    }(editor_1.EditorModel));
    exports.BinaryEditorModel = BinaryEditorModel;
});
//# sourceMappingURL=binaryEditorModel.js.map