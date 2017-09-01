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
define(["require", "exports", "vs/workbench/browser/parts/editor/webviewEditor", "vs/editor/common/editorCommonExtensions", "vs/workbench/services/editor/common/editorService", "vs/platform/contextkey/common/contextkey", "vs/platform/keybinding/common/keybindingsRegistry"], function (require, exports, webviewEditor_1, editorCommonExtensions_1, editorService_1, contextkey_1, keybindingsRegistry_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**  A context key that is set when a webview editor has focus. */
    exports.KEYBINDING_CONTEXT_WEBVIEWEDITOR_FOCUS = new contextkey_1.RawContextKey('webviewEditorFocus', undefined);
    /**  A context key that is set when a webview editor does not have focus. */
    exports.KEYBINDING_CONTEXT_WEBVIEWEDITOR_NOT_FOCUSED = exports.KEYBINDING_CONTEXT_WEBVIEWEDITOR_FOCUS.toNegated();
    /**  A context key that is set when the find widget find input in webview editor webview is focused. */
    exports.KEYBINDING_CONTEXT_WEBVIEWEDITOR_FIND_WIDGET_INPUT_FOCUSED = new contextkey_1.RawContextKey('webviewEditorFindWidgetInputFocused', false);
    /**  A context key that is set when the find widget find input in webview editor webview is not focused. */
    exports.KEYBINDING_CONTEXT_WEBVIEWEDITOR_FIND_WIDGET_INPUT_NOT_FOCUSED = exports.KEYBINDING_CONTEXT_WEBVIEWEDITOR_FIND_WIDGET_INPUT_FOCUSED.toNegated();
    /**
     * This class is only intended to be subclassed and not instantiated.
     */
    var WebviewEditor = (function (_super) {
        __extends(WebviewEditor, _super);
        function WebviewEditor(id, telemetryService, themeService, storageService, contextKeyService) {
            var _this = _super.call(this, id, telemetryService, themeService, storageService) || this;
            if (contextKeyService) {
                _this.contextKey = exports.KEYBINDING_CONTEXT_WEBVIEWEDITOR_FOCUS.bindTo(contextKeyService);
                _this.findInputFocusContextKey = exports.KEYBINDING_CONTEXT_WEBVIEWEDITOR_FIND_WIDGET_INPUT_FOCUSED.bindTo(contextKeyService);
            }
            return _this;
        }
        WebviewEditor.prototype.showFind = function () {
            if (this._webview) {
                this._webview.showFind();
            }
        };
        WebviewEditor.prototype.hideFind = function () {
            if (this._webview) {
                this._webview.hideFind();
            }
        };
        WebviewEditor.prototype.showNextFindTerm = function () {
            if (this._webview) {
                this._webview.showNextFindTerm();
            }
        };
        WebviewEditor.prototype.showPreviousFindTerm = function () {
            if (this._webview) {
                this._webview.showPreviousFindTerm();
            }
        };
        WebviewEditor.prototype.updateStyles = function () {
            _super.prototype.updateStyles.call(this);
            if (this._webview) {
                this._webview.style(this.themeService.getTheme());
            }
        };
        Object.defineProperty(WebviewEditor.prototype, "isWebviewEditor", {
            get: function () {
                return true;
            },
            enumerable: true,
            configurable: true
        });
        return WebviewEditor;
    }(webviewEditor_1.BaseWebviewEditor));
    exports.WebviewEditor = WebviewEditor;
    var ShowWebViewEditorFindCommand = (function (_super) {
        __extends(ShowWebViewEditorFindCommand, _super);
        function ShowWebViewEditorFindCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ShowWebViewEditorFindCommand.prototype.runCommand = function (accessor, args) {
            var webViewEditor = this.getWebViewEditor(accessor);
            if (webViewEditor) {
                webViewEditor.showFind();
            }
        };
        ShowWebViewEditorFindCommand.prototype.getWebViewEditor = function (accessor) {
            var activeEditor = accessor.get(editorService_1.IWorkbenchEditorService).getActiveEditor();
            if (activeEditor.isWebviewEditor) {
                return activeEditor;
            }
            return null;
        };
        return ShowWebViewEditorFindCommand;
    }(editorCommonExtensions_1.Command));
    var showFindCommand = new ShowWebViewEditorFindCommand({
        id: 'editor.action.webvieweditor.showFind',
        precondition: exports.KEYBINDING_CONTEXT_WEBVIEWEDITOR_FOCUS,
        kbOpts: {
            primary: 2048 /* CtrlCmd */ | 36 /* KEY_F */
        }
    });
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule(showFindCommand.toCommandAndKeybindingRule(keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.editorContrib()));
    var HideWebViewEditorFindCommand = (function (_super) {
        __extends(HideWebViewEditorFindCommand, _super);
        function HideWebViewEditorFindCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        HideWebViewEditorFindCommand.prototype.runCommand = function (accessor, args) {
            var webViewEditor = this.getWebViewEditor(accessor);
            if (webViewEditor) {
                webViewEditor.hideFind();
            }
        };
        HideWebViewEditorFindCommand.prototype.getWebViewEditor = function (accessor) {
            var activeEditor = accessor.get(editorService_1.IWorkbenchEditorService).getActiveEditor();
            if (activeEditor.isWebviewEditor) {
                return activeEditor;
            }
            return null;
        };
        return HideWebViewEditorFindCommand;
    }(editorCommonExtensions_1.Command));
    var hideCommand = new HideWebViewEditorFindCommand({
        id: 'editor.action.webvieweditor.hideFind',
        precondition: exports.KEYBINDING_CONTEXT_WEBVIEWEDITOR_FOCUS,
        kbOpts: {
            primary: 9 /* Escape */
        }
    });
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule(hideCommand.toCommandAndKeybindingRule(keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.editorContrib()));
    var ShowWebViewEditorFindTermCommand = (function (_super) {
        __extends(ShowWebViewEditorFindTermCommand, _super);
        function ShowWebViewEditorFindTermCommand(opts, _next) {
            var _this = _super.call(this, opts) || this;
            _this._next = _next;
            return _this;
        }
        ShowWebViewEditorFindTermCommand.prototype.runCommand = function (accessor, args) {
            var webViewEditor = this.getWebViewEditor(accessor);
            if (webViewEditor) {
                if (this._next) {
                    webViewEditor.showNextFindTerm();
                }
                else {
                    webViewEditor.showPreviousFindTerm();
                }
            }
        };
        ShowWebViewEditorFindTermCommand.prototype.getWebViewEditor = function (accessor) {
            var activeEditor = accessor.get(editorService_1.IWorkbenchEditorService).getActiveEditor();
            if (activeEditor.isWebviewEditor) {
                return activeEditor;
            }
            return null;
        };
        return ShowWebViewEditorFindTermCommand;
    }(editorCommonExtensions_1.Command));
    var showNextFindTermCommand = new ShowWebViewEditorFindTermCommand({
        id: 'editor.action.webvieweditor.showNextFindTerm',
        precondition: exports.KEYBINDING_CONTEXT_WEBVIEWEDITOR_FIND_WIDGET_INPUT_FOCUSED,
        kbOpts: {
            primary: 512 /* Alt */ | 18 /* DownArrow */
        }
    }, true);
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule(showNextFindTermCommand.toCommandAndKeybindingRule(keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.editorContrib()));
    var showPreviousFindTermCommand = new ShowWebViewEditorFindTermCommand({
        id: 'editor.action.webvieweditor.showPreviousFindTerm',
        precondition: exports.KEYBINDING_CONTEXT_WEBVIEWEDITOR_FIND_WIDGET_INPUT_FOCUSED,
        kbOpts: {
            primary: 512 /* Alt */ | 16 /* UpArrow */
        }
    }, false);
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule(showPreviousFindTermCommand.toCommandAndKeybindingRule(keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.editorContrib()));
});
//# sourceMappingURL=webviewEditor.js.map