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
define(["require", "exports", "vs/base/browser/dom", "vs/base/common/objects", "vs/base/browser/ui/widget", "vs/base/common/color", "vs/css!./checkbox"], function (require, exports, DOM, objects, widget_1, color_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var defaultOpts = {
        inputActiveOptionBorder: color_1.Color.fromHex('#007ACC')
    };
    var Checkbox = (function (_super) {
        __extends(Checkbox, _super);
        function Checkbox(opts) {
            var _this = _super.call(this) || this;
            _this._opts = objects.clone(opts);
            objects.mixin(_this._opts, defaultOpts, false);
            _this._checked = _this._opts.isChecked;
            _this.domNode = document.createElement('div');
            _this.domNode.title = _this._opts.title;
            _this.domNode.className = _this._className();
            _this.domNode.tabIndex = 0;
            _this.domNode.setAttribute('role', 'checkbox');
            _this.domNode.setAttribute('aria-checked', String(_this._checked));
            _this.domNode.setAttribute('aria-label', _this._opts.title);
            _this.applyStyles();
            _this.onclick(_this.domNode, function (ev) {
                _this.checked = !_this._checked;
                _this._opts.onChange(false);
                ev.preventDefault();
            });
            _this.onkeydown(_this.domNode, function (keyboardEvent) {
                if (keyboardEvent.keyCode === 10 /* Space */ || keyboardEvent.keyCode === 3 /* Enter */) {
                    _this.checked = !_this._checked;
                    _this._opts.onChange(true);
                    keyboardEvent.preventDefault();
                    return;
                }
                if (_this._opts.onKeyDown) {
                    _this._opts.onKeyDown(keyboardEvent);
                }
            });
            return _this;
        }
        Checkbox.prototype.focus = function () {
            this.domNode.focus();
        };
        Object.defineProperty(Checkbox.prototype, "checked", {
            get: function () {
                return this._checked;
            },
            set: function (newIsChecked) {
                this._checked = newIsChecked;
                this.domNode.setAttribute('aria-checked', String(this._checked));
                this.domNode.className = this._className();
                this.applyStyles();
            },
            enumerable: true,
            configurable: true
        });
        Checkbox.prototype._className = function () {
            return 'custom-checkbox ' + this._opts.actionClassName + ' ' + (this._checked ? 'checked' : 'unchecked');
        };
        Checkbox.prototype.width = function () {
            return 2 /*marginleft*/ + 2 /*border*/ + 2 /*padding*/ + 16 /* icon width */;
        };
        Checkbox.prototype.style = function (styles) {
            if (styles.inputActiveOptionBorder) {
                this._opts.inputActiveOptionBorder = styles.inputActiveOptionBorder;
            }
            this.applyStyles();
        };
        Checkbox.prototype.applyStyles = function () {
            if (this.domNode) {
                this.domNode.style.borderColor = this._checked && this._opts.inputActiveOptionBorder ? this._opts.inputActiveOptionBorder.toString() : 'transparent';
            }
        };
        Checkbox.prototype.enable = function () {
            this.domNode.tabIndex = 0;
            this.domNode.setAttribute('aria-disabled', String(false));
        };
        Checkbox.prototype.disable = function () {
            DOM.removeTabIndexAndUpdateFocus(this.domNode);
            this.domNode.setAttribute('aria-disabled', String(true));
        };
        return Checkbox;
    }(widget_1.Widget));
    exports.Checkbox = Checkbox;
});
//# sourceMappingURL=checkbox.js.map