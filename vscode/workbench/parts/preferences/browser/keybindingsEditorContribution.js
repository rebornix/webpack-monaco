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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/nls", "vs/base/common/async", "vs/base/common/htmlContent", "vs/base/common/keyCodes", "vs/base/common/lifecycle", "vs/platform/keybinding/common/keybinding", "vs/platform/instantiation/common/instantiation", "vs/platform/contextkey/common/contextkey", "vs/editor/common/core/range", "vs/editor/common/editorCommon", "vs/editor/common/editorCommonExtensions", "vs/editor/browser/editorBrowserExtensions", "vs/editor/contrib/snippet/browser/snippetController2", "vs/workbench/parts/preferences/common/smartSnippetInserter", "vs/workbench/parts/preferences/browser/keybindingWidgets", "vs/workbench/parts/preferences/browser/preferencesWidgets", "vs/base/common/json", "vs/workbench/services/keybinding/common/keybindingIO", "vs/workbench/services/keybinding/common/scanCode", "vs/editor/common/editorContextKeys", "vs/workbench/services/keybinding/common/windowsKeyboardMapper"], function (require, exports, nls, async_1, htmlContent_1, keyCodes_1, lifecycle_1, keybinding_1, instantiation_1, contextkey_1, range_1, editorCommon, editorCommonExtensions_1, editorBrowserExtensions_1, snippetController2_1, smartSnippetInserter_1, keybindingWidgets_1, preferencesWidgets_1, json_1, keybindingIO_1, scanCode_1, editorContextKeys_1, windowsKeyboardMapper_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var NLS_LAUNCH_MESSAGE = nls.localize('defineKeybinding.start', "Define Keybinding");
    var NLS_KB_LAYOUT_ERROR_MESSAGE = nls.localize('defineKeybinding.kbLayoutErrorMessage', "You won't be able to produce this key combination under your current keyboard layout.");
    var INTERESTING_FILE = /keybindings\.json$/;
    var DefineKeybindingController = (function (_super) {
        __extends(DefineKeybindingController, _super);
        function DefineKeybindingController(_editor, _instantiationService) {
            var _this = _super.call(this) || this;
            _this._editor = _editor;
            _this._instantiationService = _instantiationService;
            _this._keybindingWidgetRenderer = null;
            _this._keybindingDecorationRenderer = null;
            _this._register(_this._editor.onDidChangeModel(function (e) { return _this._update(); }));
            _this._update();
            return _this;
        }
        DefineKeybindingController_1 = DefineKeybindingController;
        DefineKeybindingController.get = function (editor) {
            return editor.getContribution(DefineKeybindingController_1.ID);
        };
        DefineKeybindingController.prototype.getId = function () {
            return DefineKeybindingController_1.ID;
        };
        Object.defineProperty(DefineKeybindingController.prototype, "keybindingWidgetRenderer", {
            get: function () {
                return this._keybindingWidgetRenderer;
            },
            enumerable: true,
            configurable: true
        });
        DefineKeybindingController.prototype.dispose = function () {
            this._disposeKeybindingWidgetRenderer();
            this._disposeKeybindingDecorationRenderer();
            _super.prototype.dispose.call(this);
        };
        DefineKeybindingController.prototype._update = function () {
            if (!isInterestingEditorModel(this._editor)) {
                this._disposeKeybindingWidgetRenderer();
                this._disposeKeybindingDecorationRenderer();
                return;
            }
            // Decorations are shown for the default keybindings.json **and** for the user keybindings.json
            this._createKeybindingDecorationRenderer();
            // The button to define keybindings is shown only for the user keybindings.json
            if (!this._editor.getConfiguration().readOnly) {
                this._createKeybindingWidgetRenderer();
            }
            else {
                this._disposeKeybindingWidgetRenderer();
            }
        };
        DefineKeybindingController.prototype._createKeybindingWidgetRenderer = function () {
            if (!this._keybindingWidgetRenderer) {
                this._keybindingWidgetRenderer = this._instantiationService.createInstance(KeybindingWidgetRenderer, this._editor);
            }
        };
        DefineKeybindingController.prototype._disposeKeybindingWidgetRenderer = function () {
            if (this._keybindingWidgetRenderer) {
                this._keybindingWidgetRenderer.dispose();
                this._keybindingWidgetRenderer = null;
            }
        };
        DefineKeybindingController.prototype._createKeybindingDecorationRenderer = function () {
            if (!this._keybindingDecorationRenderer) {
                this._keybindingDecorationRenderer = this._instantiationService.createInstance(KeybindingEditorDecorationsRenderer, this._editor);
            }
        };
        DefineKeybindingController.prototype._disposeKeybindingDecorationRenderer = function () {
            if (this._keybindingDecorationRenderer) {
                this._keybindingDecorationRenderer.dispose();
                this._keybindingDecorationRenderer = null;
            }
        };
        DefineKeybindingController.ID = 'editor.contrib.defineKeybinding';
        DefineKeybindingController = DefineKeybindingController_1 = __decorate([
            editorBrowserExtensions_1.editorContribution,
            __param(1, instantiation_1.IInstantiationService)
        ], DefineKeybindingController);
        return DefineKeybindingController;
        var DefineKeybindingController_1;
    }(lifecycle_1.Disposable));
    exports.DefineKeybindingController = DefineKeybindingController;
    var KeybindingWidgetRenderer = (function (_super) {
        __extends(KeybindingWidgetRenderer, _super);
        function KeybindingWidgetRenderer(_editor, _instantiationService) {
            var _this = _super.call(this) || this;
            _this._editor = _editor;
            _this._instantiationService = _instantiationService;
            _this._launchWidget = _this._register(_this._instantiationService.createInstance(preferencesWidgets_1.FloatingClickWidget, _this._editor, NLS_LAUNCH_MESSAGE, DefineKeybindingCommand.ID));
            _this._register(_this._launchWidget.onClick(function () { return _this.showDefineKeybindingWidget(); }));
            _this._defineWidget = _this._register(_this._instantiationService.createInstance(keybindingWidgets_1.DefineKeybindingOverlayWidget, _this._editor));
            _this._launchWidget.render();
            return _this;
        }
        KeybindingWidgetRenderer.prototype.showDefineKeybindingWidget = function () {
            var _this = this;
            this._defineWidget.start().then(function (keybinding) { return _this._onAccepted(keybinding); });
        };
        KeybindingWidgetRenderer.prototype._onAccepted = function (keybinding) {
            this._editor.focus();
            if (keybinding) {
                var regexp = new RegExp(/\\/g);
                var backslash = regexp.test(keybinding);
                if (backslash) {
                    keybinding = keybinding.slice(0, -1) + '\\\\';
                }
                var snippetText = [
                    '{',
                    '\t"key": ' + JSON.stringify(keybinding) + ',',
                    '\t"command": "${1:commandId}",',
                    '\t"when": "${2:editorTextFocus}"',
                    '}$0'
                ].join('\n');
                var smartInsertInfo = smartSnippetInserter_1.SmartSnippetInserter.insertSnippet(this._editor.getModel(), this._editor.getPosition());
                snippetText = smartInsertInfo.prepend + snippetText + smartInsertInfo.append;
                this._editor.setPosition(smartInsertInfo.position);
                snippetController2_1.SnippetController2.get(this._editor).insert(snippetText, 0, 0);
            }
        };
        KeybindingWidgetRenderer = __decorate([
            __param(1, instantiation_1.IInstantiationService)
        ], KeybindingWidgetRenderer);
        return KeybindingWidgetRenderer;
    }(lifecycle_1.Disposable));
    exports.KeybindingWidgetRenderer = KeybindingWidgetRenderer;
    var KeybindingEditorDecorationsRenderer = (function (_super) {
        __extends(KeybindingEditorDecorationsRenderer, _super);
        function KeybindingEditorDecorationsRenderer(_editor, _keybindingService) {
            var _this = _super.call(this) || this;
            _this._editor = _editor;
            _this._keybindingService = _keybindingService;
            _this._dec = [];
            _this._updateDecorations = _this._register(new async_1.RunOnceScheduler(function () { return _this._updateDecorationsNow(); }, 500));
            var model = _this._editor.getModel();
            _this._register(model.onDidChangeContent(function () { return _this._updateDecorations.schedule(); }));
            _this._register(_this._keybindingService.onDidUpdateKeybindings(function (e) { return _this._updateDecorations.schedule(); }));
            _this._register({
                dispose: function () {
                    _this._dec = _this._editor.deltaDecorations(_this._dec, []);
                    _this._updateDecorations.cancel();
                }
            });
            _this._updateDecorations.schedule();
            return _this;
        }
        KeybindingEditorDecorationsRenderer.prototype._updateDecorationsNow = function () {
            var model = this._editor.getModel();
            var newDecorations = [];
            var root = json_1.parseTree(model.getValue());
            if (root && Array.isArray(root.children)) {
                for (var i = 0, len = root.children.length; i < len; i++) {
                    var entry = root.children[i];
                    var dec = this._getDecorationForEntry(model, entry);
                    if (dec !== null) {
                        newDecorations.push(dec);
                    }
                }
            }
            this._dec = this._editor.deltaDecorations(this._dec, newDecorations);
        };
        KeybindingEditorDecorationsRenderer.prototype._getDecorationForEntry = function (model, entry) {
            if (!Array.isArray(entry.children)) {
                return null;
            }
            for (var i = 0, len = entry.children.length; i < len; i++) {
                var prop = entry.children[i];
                if (prop.type !== 'property') {
                    continue;
                }
                if (!Array.isArray(prop.children) || prop.children.length !== 2) {
                    continue;
                }
                var key = prop.children[0];
                if (key.value !== 'key') {
                    continue;
                }
                var value = prop.children[1];
                if (value.type !== 'string') {
                    continue;
                }
                var resolvedKeybindings = this._keybindingService.resolveUserBinding(value.value);
                if (resolvedKeybindings.length === 0) {
                    return this._createDecoration(true, null, null, model, value);
                }
                var resolvedKeybinding = resolvedKeybindings[0];
                var usLabel = null;
                if (resolvedKeybinding instanceof windowsKeyboardMapper_1.WindowsNativeResolvedKeybinding) {
                    usLabel = resolvedKeybinding.getUSLabel();
                }
                if (!resolvedKeybinding.isWYSIWYG()) {
                    return this._createDecoration(false, resolvedKeybinding.getLabel(), usLabel, model, value);
                }
                if (/abnt_|oem_/.test(value.value)) {
                    return this._createDecoration(false, resolvedKeybinding.getLabel(), usLabel, model, value);
                }
                var expectedUserSettingsLabel = resolvedKeybinding.getUserSettingsLabel();
                if (!KeybindingEditorDecorationsRenderer._userSettingsFuzzyEquals(value.value, expectedUserSettingsLabel)) {
                    return this._createDecoration(false, resolvedKeybinding.getLabel(), usLabel, model, value);
                }
                return null;
            }
            return null;
        };
        KeybindingEditorDecorationsRenderer._userSettingsFuzzyEquals = function (a, b) {
            a = a.trim().toLowerCase();
            b = b.trim().toLowerCase();
            if (a === b) {
                return true;
            }
            var _a = keybindingIO_1.KeybindingIO._readUserBinding(a), parsedA1 = _a[0], parsedA2 = _a[1];
            var _b = keybindingIO_1.KeybindingIO._readUserBinding(b), parsedB1 = _b[0], parsedB2 = _b[1];
            return (this._userBindingEquals(parsedA1, parsedB1)
                && this._userBindingEquals(parsedA2, parsedB2));
        };
        KeybindingEditorDecorationsRenderer._userBindingEquals = function (a, b) {
            if (a === null && b === null) {
                return true;
            }
            if (!a || !b) {
                return false;
            }
            if (a instanceof keyCodes_1.SimpleKeybinding && b instanceof keyCodes_1.SimpleKeybinding) {
                return a.equals(b);
            }
            if (a instanceof scanCode_1.ScanCodeBinding && b instanceof scanCode_1.ScanCodeBinding) {
                return a.equals(b);
            }
            return false;
        };
        KeybindingEditorDecorationsRenderer.prototype._createDecoration = function (isError, uiLabel, usLabel, model, keyNode) {
            var msg;
            var className;
            var beforeContentClassName;
            var overviewRulerColor;
            if (isError) {
                // this is the error case
                msg = new htmlContent_1.MarkdownString().appendText(NLS_KB_LAYOUT_ERROR_MESSAGE);
                className = 'keybindingError';
                beforeContentClassName = 'inlineKeybindingError';
                overviewRulerColor = 'rgba(250, 100, 100, 0.6)';
            }
            else {
                // this is the info case
                if (usLabel && uiLabel !== usLabel) {
                    msg = new htmlContent_1.MarkdownString(nls.localize({
                        key: 'defineKeybinding.kbLayoutLocalAndUSMessage',
                        comment: [
                            'Please translate maintaining the stars (*) around the placeholders such that they will be rendered in bold.',
                            'The placeholders will contain a keyboard combination e.g. Ctrl+Shift+/'
                        ]
                    }, "**{0}** for your current keyboard layout (**{1}** for US standard).", uiLabel, usLabel));
                }
                else {
                    msg = new htmlContent_1.MarkdownString(nls.localize({
                        key: 'defineKeybinding.kbLayoutLocalMessage',
                        comment: [
                            'Please translate maintaining the stars (*) around the placeholder such that it will be rendered in bold.',
                            'The placeholder will contain a keyboard combination e.g. Ctrl+Shift+/'
                        ]
                    }, "**{0}** for your current keyboard layout.", uiLabel));
                }
                className = 'keybindingInfo';
                beforeContentClassName = 'inlineKeybindingInfo';
                overviewRulerColor = 'rgba(100, 100, 250, 0.6)';
            }
            var startPosition = model.getPositionAt(keyNode.offset);
            var endPosition = model.getPositionAt(keyNode.offset + keyNode.length);
            var range = new range_1.Range(startPosition.lineNumber, startPosition.column, endPosition.lineNumber, endPosition.column);
            // icon + highlight + message decoration
            return {
                range: range,
                options: {
                    stickiness: editorCommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
                    className: className,
                    beforeContentClassName: beforeContentClassName,
                    hoverMessage: msg,
                    overviewRuler: {
                        color: overviewRulerColor,
                        darkColor: overviewRulerColor,
                        position: editorCommon.OverviewRulerLane.Right
                    }
                }
            };
        };
        KeybindingEditorDecorationsRenderer = __decorate([
            __param(1, keybinding_1.IKeybindingService)
        ], KeybindingEditorDecorationsRenderer);
        return KeybindingEditorDecorationsRenderer;
    }(lifecycle_1.Disposable));
    exports.KeybindingEditorDecorationsRenderer = KeybindingEditorDecorationsRenderer;
    var DefineKeybindingCommand = (function (_super) {
        __extends(DefineKeybindingCommand, _super);
        function DefineKeybindingCommand() {
            return _super.call(this, {
                id: DefineKeybindingCommand.ID,
                precondition: contextkey_1.ContextKeyExpr.and(editorContextKeys_1.EditorContextKeys.writable, editorContextKeys_1.EditorContextKeys.languageId.isEqualTo('json')),
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: keyCodes_1.KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 41 /* KEY_K */)
                }
            }) || this;
        }
        DefineKeybindingCommand.prototype.runEditorCommand = function (accessor, editor) {
            if (!isInterestingEditorModel(editor) || editor.getConfiguration().readOnly) {
                return;
            }
            var controller = DefineKeybindingController.get(editor);
            if (controller && controller.keybindingWidgetRenderer) {
                controller.keybindingWidgetRenderer.showDefineKeybindingWidget();
            }
        };
        DefineKeybindingCommand.ID = 'editor.action.defineKeybinding';
        return DefineKeybindingCommand;
    }(editorCommonExtensions_1.EditorCommand));
    function isInterestingEditorModel(editor) {
        var model = editor.getModel();
        if (!model) {
            return false;
        }
        var url = model.uri.toString();
        return INTERESTING_FILE.test(url);
    }
    editorCommonExtensions_1.registerEditorCommand(new DefineKeybindingCommand());
});
//# sourceMappingURL=keybindingsEditorContribution.js.map