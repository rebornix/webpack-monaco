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
define(["require", "exports", "vs/base/common/winjs.base", "vs/workbench/common/editor"], function (require, exports, winjs_base_1, editor_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * The base editor model for the diff editor. It is made up of two editor models, the original version
     * and the modified version.
     */
    var DiffEditorModel = (function (_super) {
        __extends(DiffEditorModel, _super);
        function DiffEditorModel(originalModel, modifiedModel) {
            var _this = _super.call(this) || this;
            _this._originalModel = originalModel;
            _this._modifiedModel = modifiedModel;
            return _this;
        }
        Object.defineProperty(DiffEditorModel.prototype, "originalModel", {
            get: function () {
                return this._originalModel;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DiffEditorModel.prototype, "modifiedModel", {
            get: function () {
                return this._modifiedModel;
            },
            enumerable: true,
            configurable: true
        });
        DiffEditorModel.prototype.load = function () {
            var _this = this;
            return winjs_base_1.TPromise.join([
                this._originalModel.load(),
                this._modifiedModel.load()
            ]).then(function () {
                return _this;
            });
        };
        DiffEditorModel.prototype.isResolved = function () {
            return this.originalModel.isResolved() && this.modifiedModel.isResolved();
        };
        DiffEditorModel.prototype.dispose = function () {
            // Do not propagate the dispose() call to the two models inside. We never created the two models
            // (original and modified) so we can not dispose them without sideeffects. Rather rely on the
            // models getting disposed when their related inputs get disposed from the diffEditorInput.
            _super.prototype.dispose.call(this);
        };
        return DiffEditorModel;
    }(editor_1.EditorModel));
    exports.DiffEditorModel = DiffEditorModel;
});
//# sourceMappingURL=diffEditorModel.js.map