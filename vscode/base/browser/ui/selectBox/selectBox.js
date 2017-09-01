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
define(["require", "exports", "vs/base/common/lifecycle", "vs/base/common/event", "vs/base/browser/ui/widget", "vs/base/browser/dom", "vs/base/common/arrays", "vs/base/common/color", "vs/base/common/objects", "vs/css!./selectBox"], function (require, exports, lifecycle_1, event_1, widget_1, dom, arrays, color_1, objects_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultStyles = {
        selectBackground: color_1.Color.fromHex('#3C3C3C'),
        selectForeground: color_1.Color.fromHex('#F0F0F0'),
        selectBorder: color_1.Color.fromHex('#3C3C3C')
    };
    var SelectBox = (function (_super) {
        __extends(SelectBox, _super);
        function SelectBox(options, selected, styles) {
            if (styles === void 0) { styles = objects_1.clone(exports.defaultStyles); }
            var _this = _super.call(this) || this;
            _this.selectElement = document.createElement('select');
            _this.selectElement.className = 'select-box';
            _this.setOptions(options, selected);
            _this.toDispose = [];
            _this._onDidSelect = new event_1.Emitter();
            _this.selectBackground = styles.selectBackground;
            _this.selectForeground = styles.selectForeground;
            _this.selectBorder = styles.selectBorder;
            _this.toDispose.push(dom.addStandardDisposableListener(_this.selectElement, 'change', function (e) {
                _this.selectElement.title = e.target.value;
                _this._onDidSelect.fire({
                    index: e.target.selectedIndex,
                    selected: e.target.value
                });
            }));
            _this.toDispose.push(dom.addStandardDisposableListener(_this.selectElement, 'keydown', function (e) {
                if (e.equals(10 /* Space */) || e.equals(3 /* Enter */)) {
                    // Space is used to expand select box, do not propagate it (prevent action bar action run)
                    e.stopPropagation();
                }
            }));
            return _this;
        }
        Object.defineProperty(SelectBox.prototype, "onDidSelect", {
            get: function () {
                return this._onDidSelect.event;
            },
            enumerable: true,
            configurable: true
        });
        SelectBox.prototype.setOptions = function (options, selected, disabled) {
            var _this = this;
            if (!this.options || !arrays.equals(this.options, options)) {
                this.options = options;
                this.selectElement.options.length = 0;
                var i_1 = 0;
                this.options.forEach(function (option) {
                    _this.selectElement.add(_this.createOption(option, disabled === i_1++));
                });
            }
            this.select(selected);
        };
        SelectBox.prototype.select = function (index) {
            if (index >= 0 && index < this.options.length) {
                this.selected = index;
            }
            else if (this.selected < 0) {
                this.selected = 0;
            }
            this.selectElement.selectedIndex = this.selected;
            this.selectElement.title = this.options[this.selected];
        };
        SelectBox.prototype.focus = function () {
            if (this.selectElement) {
                this.selectElement.focus();
            }
        };
        SelectBox.prototype.blur = function () {
            if (this.selectElement) {
                this.selectElement.blur();
            }
        };
        SelectBox.prototype.render = function (container) {
            this.container = container;
            dom.addClass(container, 'select-container');
            container.appendChild(this.selectElement);
            this.setOptions(this.options, this.selected);
            this.applyStyles();
        };
        SelectBox.prototype.style = function (styles) {
            this.selectBackground = styles.selectBackground;
            this.selectForeground = styles.selectForeground;
            this.selectBorder = styles.selectBorder;
            this.applyStyles();
        };
        SelectBox.prototype.applyStyles = function () {
            if (this.selectElement) {
                var background = this.selectBackground ? this.selectBackground.toString() : null;
                var foreground = this.selectForeground ? this.selectForeground.toString() : null;
                var border = this.selectBorder ? this.selectBorder.toString() : null;
                this.selectElement.style.backgroundColor = background;
                this.selectElement.style.color = foreground;
                this.selectElement.style.borderColor = border;
            }
        };
        SelectBox.prototype.createOption = function (value, disabled) {
            var option = document.createElement('option');
            option.value = value;
            option.text = value;
            option.disabled = disabled;
            return option;
        };
        SelectBox.prototype.dispose = function () {
            this.toDispose = lifecycle_1.dispose(this.toDispose);
            _super.prototype.dispose.call(this);
        };
        return SelectBox;
    }(widget_1.Widget));
    exports.SelectBox = SelectBox;
});
//# sourceMappingURL=selectBox.js.map