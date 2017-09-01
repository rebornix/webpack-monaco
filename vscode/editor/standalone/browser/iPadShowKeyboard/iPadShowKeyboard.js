/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "vs/base/common/lifecycle", "vs/base/browser/browser", "vs/base/browser/dom", "vs/editor/browser/editorBrowser", "vs/editor/browser/editorBrowserExtensions", "vs/css!./iPadShowKeyboard"], function (require, exports, lifecycle_1, browser, dom, editorBrowser_1, editorBrowserExtensions_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var IPadShowKeyboard = (function () {
        function IPadShowKeyboard(editor) {
            var _this = this;
            this.editor = editor;
            this.toDispose = [];
            if (browser.isIPad) {
                this.toDispose.push(editor.onDidChangeConfiguration(function () { return _this.update(); }));
                this.update();
            }
        }
        IPadShowKeyboard_1 = IPadShowKeyboard;
        IPadShowKeyboard.prototype.update = function () {
            var hasWidget = (!!this.widget);
            var shouldHaveWidget = (!this.editor.getConfiguration().readOnly);
            if (!hasWidget && shouldHaveWidget) {
                this.widget = new ShowKeyboardWidget(this.editor);
            }
            else if (hasWidget && !shouldHaveWidget) {
                this.widget.dispose();
                this.widget = null;
            }
        };
        IPadShowKeyboard.prototype.getId = function () {
            return IPadShowKeyboard_1.ID;
        };
        IPadShowKeyboard.prototype.dispose = function () {
            this.toDispose = lifecycle_1.dispose(this.toDispose);
            if (this.widget) {
                this.widget.dispose();
                this.widget = null;
            }
        };
        IPadShowKeyboard.ID = 'editor.contrib.iPadShowKeyboard';
        IPadShowKeyboard = IPadShowKeyboard_1 = __decorate([
            editorBrowserExtensions_1.editorContribution
        ], IPadShowKeyboard);
        return IPadShowKeyboard;
        var IPadShowKeyboard_1;
    }());
    exports.IPadShowKeyboard = IPadShowKeyboard;
    var ShowKeyboardWidget = (function () {
        function ShowKeyboardWidget(editor) {
            var _this = this;
            this.editor = editor;
            this._domNode = document.createElement('textarea');
            this._domNode.className = 'iPadShowKeyboard';
            this._toDispose = [];
            this._toDispose.push(dom.addDisposableListener(this._domNode, 'touchstart', function (e) {
                _this.editor.focus();
            }));
            this._toDispose.push(dom.addDisposableListener(this._domNode, 'focus', function (e) {
                _this.editor.focus();
            }));
            this.editor.addOverlayWidget(this);
        }
        ShowKeyboardWidget.prototype.dispose = function () {
            this.editor.removeOverlayWidget(this);
            this._toDispose = lifecycle_1.dispose(this._toDispose);
        };
        // ----- IOverlayWidget API
        ShowKeyboardWidget.prototype.getId = function () {
            return ShowKeyboardWidget.ID;
        };
        ShowKeyboardWidget.prototype.getDomNode = function () {
            return this._domNode;
        };
        ShowKeyboardWidget.prototype.getPosition = function () {
            return {
                preference: editorBrowser_1.OverlayWidgetPositionPreference.BOTTOM_RIGHT_CORNER
            };
        };
        ShowKeyboardWidget.ID = 'editor.contrib.ShowKeyboardWidget';
        return ShowKeyboardWidget;
    }());
});
//# sourceMappingURL=iPadShowKeyboard.js.map