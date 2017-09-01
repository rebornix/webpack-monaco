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
define(["require", "exports", "vs/base/browser/dom", "vs/base/browser/ui/widget", "vs/editor/browser/editorBrowser", "vs/editor/contrib/find/common/findModel", "vs/base/browser/ui/findinput/findInputCheckboxes", "vs/base/common/async", "vs/platform/theme/common/themeService", "vs/platform/theme/common/colorRegistry"], function (require, exports, dom, widget_1, editorBrowser_1, findModel_1, findInputCheckboxes_1, async_1, themeService_1, colorRegistry_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var FindOptionsWidget = (function (_super) {
        __extends(FindOptionsWidget, _super);
        function FindOptionsWidget(editor, state, keybindingService, themeService) {
            var _this = _super.call(this) || this;
            _this._hideSoon = _this._register(new async_1.RunOnceScheduler(function () { return _this._hide(); }, 1000));
            _this._isVisible = false;
            _this._editor = editor;
            _this._state = state;
            _this._keybindingService = keybindingService;
            _this._domNode = document.createElement('div');
            _this._domNode.className = 'findOptionsWidget';
            _this._domNode.style.display = 'none';
            _this._domNode.style.top = '10px';
            _this._domNode.setAttribute('role', 'presentation');
            _this._domNode.setAttribute('aria-hidden', 'true');
            var inputActiveOptionBorderColor = themeService.getTheme().getColor(colorRegistry_1.inputActiveOptionBorder);
            _this.caseSensitive = _this._register(new findInputCheckboxes_1.CaseSensitiveCheckbox({
                appendTitle: _this._keybindingLabelFor(findModel_1.FIND_IDS.ToggleCaseSensitiveCommand),
                isChecked: _this._state.matchCase,
                onChange: function (viaKeyboard) {
                    _this._state.change({
                        matchCase: _this.caseSensitive.checked
                    }, false);
                },
                inputActiveOptionBorder: inputActiveOptionBorderColor
            }));
            _this._domNode.appendChild(_this.caseSensitive.domNode);
            _this.wholeWords = _this._register(new findInputCheckboxes_1.WholeWordsCheckbox({
                appendTitle: _this._keybindingLabelFor(findModel_1.FIND_IDS.ToggleWholeWordCommand),
                isChecked: _this._state.wholeWord,
                onChange: function (viaKeyboard) {
                    _this._state.change({
                        wholeWord: _this.wholeWords.checked
                    }, false);
                },
                inputActiveOptionBorder: inputActiveOptionBorderColor
            }));
            _this._domNode.appendChild(_this.wholeWords.domNode);
            _this.regex = _this._register(new findInputCheckboxes_1.RegexCheckbox({
                appendTitle: _this._keybindingLabelFor(findModel_1.FIND_IDS.ToggleRegexCommand),
                isChecked: _this._state.isRegex,
                onChange: function (viaKeyboard) {
                    _this._state.change({
                        isRegex: _this.regex.checked
                    }, false);
                },
                inputActiveOptionBorder: inputActiveOptionBorderColor
            }));
            _this._domNode.appendChild(_this.regex.domNode);
            _this._editor.addOverlayWidget(_this);
            _this._register(_this._state.addChangeListener(function (e) {
                var somethingChanged = false;
                if (e.isRegex) {
                    _this.regex.checked = _this._state.isRegex;
                    somethingChanged = true;
                }
                if (e.wholeWord) {
                    _this.wholeWords.checked = _this._state.wholeWord;
                    somethingChanged = true;
                }
                if (e.matchCase) {
                    _this.caseSensitive.checked = _this._state.matchCase;
                    somethingChanged = true;
                }
                if (!_this._state.isRevealed && somethingChanged) {
                    _this._revealTemporarily();
                }
            }));
            _this._register(dom.addDisposableNonBubblingMouseOutListener(_this._domNode, function (e) { return _this._onMouseOut(); }));
            _this._register(dom.addDisposableListener(_this._domNode, 'mouseover', function (e) { return _this._onMouseOver(); }));
            _this._applyTheme(themeService.getTheme());
            _this._register(themeService.onThemeChange(_this._applyTheme.bind(_this)));
            return _this;
        }
        FindOptionsWidget.prototype._keybindingLabelFor = function (actionId) {
            var kb = this._keybindingService.lookupKeybinding(actionId);
            if (!kb) {
                return '';
            }
            return " (" + kb.getLabel() + ")";
        };
        FindOptionsWidget.prototype.dispose = function () {
            this._editor.removeOverlayWidget(this);
            _super.prototype.dispose.call(this);
        };
        // ----- IOverlayWidget API
        FindOptionsWidget.prototype.getId = function () {
            return FindOptionsWidget.ID;
        };
        FindOptionsWidget.prototype.getDomNode = function () {
            return this._domNode;
        };
        FindOptionsWidget.prototype.getPosition = function () {
            return {
                preference: editorBrowser_1.OverlayWidgetPositionPreference.TOP_RIGHT_CORNER
            };
        };
        FindOptionsWidget.prototype.highlightFindOptions = function () {
            this._revealTemporarily();
        };
        FindOptionsWidget.prototype._revealTemporarily = function () {
            this._show();
            this._hideSoon.schedule();
        };
        FindOptionsWidget.prototype._onMouseOut = function () {
            this._hideSoon.schedule();
        };
        FindOptionsWidget.prototype._onMouseOver = function () {
            this._hideSoon.cancel();
        };
        FindOptionsWidget.prototype._show = function () {
            if (this._isVisible) {
                return;
            }
            this._isVisible = true;
            this._domNode.style.display = 'block';
        };
        FindOptionsWidget.prototype._hide = function () {
            if (!this._isVisible) {
                return;
            }
            this._isVisible = false;
            this._domNode.style.display = 'none';
        };
        FindOptionsWidget.prototype._applyTheme = function (theme) {
            var inputStyles = { inputActiveOptionBorder: theme.getColor(colorRegistry_1.inputActiveOptionBorder) };
            this.caseSensitive.style(inputStyles);
            this.wholeWords.style(inputStyles);
            this.regex.style(inputStyles);
        };
        FindOptionsWidget.ID = 'editor.contrib.findOptionsWidget';
        return FindOptionsWidget;
    }(widget_1.Widget));
    exports.FindOptionsWidget = FindOptionsWidget;
    themeService_1.registerThemingParticipant(function (theme, collector) {
        var widgetBackground = theme.getColor(colorRegistry_1.editorWidgetBackground);
        if (widgetBackground) {
            collector.addRule(".monaco-editor .findOptionsWidget { background-color: " + widgetBackground + "; }");
        }
        var widgetShadowColor = theme.getColor(colorRegistry_1.widgetShadow);
        if (widgetShadowColor) {
            collector.addRule(".monaco-editor .findOptionsWidget { box-shadow: 0 2px 8px " + widgetShadowColor + "; }");
        }
        var hcBorder = theme.getColor(colorRegistry_1.contrastBorder);
        if (hcBorder) {
            collector.addRule(".monaco-editor .findOptionsWidget { border: 2px solid " + hcBorder + "; }");
        }
    });
});
//# sourceMappingURL=findOptionsWidget.js.map