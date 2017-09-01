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
define(["require", "exports", "vs/base/common/eventEmitter", "vs/base/browser/dom", "vs/base/browser/builder", "vs/base/browser/keyboardEvent", "vs/base/common/color", "vs/base/common/objects", "vs/css!./button"], function (require, exports, eventEmitter_1, DOM, builder_1, keyboardEvent_1, color_1, objects_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var defaultOptions = {
        buttonBackground: color_1.Color.fromHex('#0E639C'),
        buttonHoverBackground: color_1.Color.fromHex('#006BB3'),
        buttonForeground: color_1.Color.white
    };
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button(container, options) {
            var _this = _super.call(this) || this;
            _this.options = options || Object.create(null);
            objects_1.mixin(_this.options, defaultOptions, false);
            _this.buttonBackground = _this.options.buttonBackground;
            _this.buttonHoverBackground = _this.options.buttonHoverBackground;
            _this.buttonForeground = _this.options.buttonForeground;
            _this.buttonBorder = _this.options.buttonBorder;
            _this.$el = builder_1.$('a.monaco-button').attr({
                'tabIndex': '0',
                'role': 'button'
            }).appendTo(container);
            _this.$el.on(DOM.EventType.CLICK, function (e) {
                if (!_this.enabled) {
                    DOM.EventHelper.stop(e);
                    return;
                }
                _this.emit(DOM.EventType.CLICK, e);
            });
            _this.$el.on(DOM.EventType.KEY_DOWN, function (e) {
                var event = new keyboardEvent_1.StandardKeyboardEvent(e);
                var eventHandled = false;
                if (_this.enabled && event.equals(3 /* Enter */) || event.equals(10 /* Space */)) {
                    _this.emit(DOM.EventType.CLICK, e);
                    eventHandled = true;
                }
                else if (event.equals(9 /* Escape */)) {
                    _this.$el.domBlur();
                    eventHandled = true;
                }
                if (eventHandled) {
                    DOM.EventHelper.stop(event, true);
                }
            });
            _this.$el.on(DOM.EventType.MOUSE_OVER, function (e) {
                if (!_this.$el.hasClass('disabled')) {
                    var hoverBackground = _this.buttonHoverBackground ? _this.buttonHoverBackground.toString() : null;
                    if (hoverBackground) {
                        _this.$el.style('background-color', hoverBackground);
                    }
                }
            });
            _this.$el.on(DOM.EventType.MOUSE_OUT, function (e) {
                _this.applyStyles(); // restore standard styles
            });
            _this.applyStyles();
            return _this;
        }
        Button.prototype.style = function (styles) {
            this.buttonForeground = styles.buttonForeground;
            this.buttonBackground = styles.buttonBackground;
            this.buttonHoverBackground = styles.buttonHoverBackground;
            this.buttonBorder = styles.buttonBorder;
            this.applyStyles();
        };
        Button.prototype.applyStyles = function () {
            if (this.$el) {
                var background = this.buttonBackground ? this.buttonBackground.toString() : null;
                var foreground = this.buttonForeground ? this.buttonForeground.toString() : null;
                var border = this.buttonBorder ? this.buttonBorder.toString() : null;
                this.$el.style('color', foreground);
                this.$el.style('background-color', background);
                this.$el.style('border-width', border ? '1px' : null);
                this.$el.style('border-style', border ? 'solid' : null);
                this.$el.style('border-color', border);
            }
        };
        Button.prototype.getElement = function () {
            return this.$el.getHTMLElement();
        };
        Object.defineProperty(Button.prototype, "label", {
            set: function (value) {
                if (!this.$el.hasClass('monaco-text-button')) {
                    this.$el.addClass('monaco-text-button');
                }
                this.$el.text(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "icon", {
            set: function (iconClassName) {
                this.$el.addClass(iconClassName);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "enabled", {
            get: function () {
                return !this.$el.hasClass('disabled');
            },
            set: function (value) {
                if (value) {
                    this.$el.removeClass('disabled');
                    this.$el.attr({
                        'aria-disabled': 'false',
                        'tabIndex': '0'
                    });
                }
                else {
                    this.$el.addClass('disabled');
                    this.$el.attr('aria-disabled', String(true));
                    DOM.removeTabIndexAndUpdateFocus(this.$el.getHTMLElement());
                }
            },
            enumerable: true,
            configurable: true
        });
        Button.prototype.focus = function () {
            this.$el.domFocus();
        };
        Button.prototype.dispose = function () {
            if (this.$el) {
                this.$el.dispose();
                this.$el = null;
            }
            _super.prototype.dispose.call(this);
        };
        return Button;
    }(eventEmitter_1.EventEmitter));
    exports.Button = Button;
});
//# sourceMappingURL=button.js.map