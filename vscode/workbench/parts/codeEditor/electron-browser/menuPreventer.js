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
define(["require", "exports", "vs/base/common/lifecycle", "vs/editor/browser/editorBrowserExtensions"], function (require, exports, lifecycle_1, editorBrowserExtensions_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Prevents the top-level menu from showing up when doing Alt + Click in the editor
     */
    var MenuPreventer = (function (_super) {
        __extends(MenuPreventer, _super);
        function MenuPreventer(editor) {
            var _this = _super.call(this) || this;
            _this._editor = editor;
            _this._altListeningMouse = false;
            _this._altMouseTriggered = false;
            // A global crossover handler to prevent menu bar from showing up
            // When <alt> is hold, we will listen to mouse events and prevent
            // the release event up <alt> if the mouse is triggered.
            _this._register(_this._editor.onMouseDown(function (e) {
                if (_this._altListeningMouse) {
                    _this._altMouseTriggered = true;
                }
            }));
            _this._register(_this._editor.onKeyDown(function (e) {
                if (e.equals(512 /* Alt */)) {
                    if (!_this._altListeningMouse) {
                        _this._altMouseTriggered = false;
                    }
                    _this._altListeningMouse = true;
                }
            }));
            _this._register(_this._editor.onKeyUp(function (e) {
                if (e.equals(512 /* Alt */)) {
                    if (_this._altMouseTriggered) {
                        e.preventDefault();
                    }
                    _this._altListeningMouse = false;
                    _this._altMouseTriggered = false;
                }
            }));
            return _this;
        }
        MenuPreventer_1 = MenuPreventer;
        MenuPreventer.prototype.getId = function () {
            return MenuPreventer_1.ID;
        };
        MenuPreventer.ID = 'editor.contrib.menuPreventer';
        MenuPreventer = MenuPreventer_1 = __decorate([
            editorBrowserExtensions_1.editorContribution
        ], MenuPreventer);
        return MenuPreventer;
        var MenuPreventer_1;
    }(lifecycle_1.Disposable));
    exports.MenuPreventer = MenuPreventer;
});
//# sourceMappingURL=menuPreventer.js.map