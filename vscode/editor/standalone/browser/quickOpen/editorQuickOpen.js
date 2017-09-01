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
define(["require", "exports", "vs/editor/browser/editorBrowserExtensions", "./quickOpenEditorWidget", "vs/editor/common/editorCommonExtensions", "vs/platform/theme/common/themeService", "vs/editor/common/model/textModelWithDecorations"], function (require, exports, editorBrowserExtensions_1, quickOpenEditorWidget_1, editorCommonExtensions_1, themeService_1, textModelWithDecorations_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var QuickOpenController = (function () {
        function QuickOpenController(editor, themeService) {
            this.themeService = themeService;
            this.editor = editor;
        }
        QuickOpenController_1 = QuickOpenController;
        QuickOpenController.get = function (editor) {
            return editor.getContribution(QuickOpenController_1.ID);
        };
        QuickOpenController.prototype.getId = function () {
            return QuickOpenController_1.ID;
        };
        QuickOpenController.prototype.dispose = function () {
            // Dispose widget
            if (this.widget) {
                this.widget.destroy();
                this.widget = null;
            }
        };
        QuickOpenController.prototype.run = function (opts) {
            var _this = this;
            if (this.widget) {
                this.widget.destroy();
                this.widget = null;
            }
            // Create goto line widget
            var onClose = function (canceled) {
                // Clear Highlight Decorations if present
                _this.clearDecorations();
                // Restore selection if canceled
                if (canceled && _this.lastKnownEditorSelection) {
                    _this.editor.setSelection(_this.lastKnownEditorSelection);
                    _this.editor.revealRangeInCenterIfOutsideViewport(_this.lastKnownEditorSelection);
                }
                _this.lastKnownEditorSelection = null;
                _this.editor.focus();
            };
            this.widget = new quickOpenEditorWidget_1.QuickOpenEditorWidget(this.editor, function () { return onClose(false); }, function () { return onClose(true); }, function (value) {
                _this.widget.setInput(opts.getModel(value), opts.getAutoFocus(value));
            }, {
                inputAriaLabel: opts.inputAriaLabel
            }, this.themeService);
            // Remember selection to be able to restore on cancel
            if (!this.lastKnownEditorSelection) {
                this.lastKnownEditorSelection = this.editor.getSelection();
            }
            // Show
            this.widget.show('');
        };
        QuickOpenController.prototype.decorateLine = function (range, editor) {
            var _this = this;
            editor.changeDecorations(function (changeAccessor) {
                var oldDecorations = [];
                if (_this.rangeHighlightDecorationId) {
                    oldDecorations.push(_this.rangeHighlightDecorationId);
                    _this.rangeHighlightDecorationId = null;
                }
                var newDecorations = [
                    {
                        range: range,
                        options: QuickOpenController_1._RANGE_HIGHLIGHT_DECORATION
                    }
                ];
                var decorations = changeAccessor.deltaDecorations(oldDecorations, newDecorations);
                _this.rangeHighlightDecorationId = decorations[0];
            });
        };
        QuickOpenController.prototype.clearDecorations = function () {
            var _this = this;
            if (this.rangeHighlightDecorationId) {
                this.editor.changeDecorations(function (changeAccessor) {
                    changeAccessor.deltaDecorations([_this.rangeHighlightDecorationId], []);
                    _this.rangeHighlightDecorationId = null;
                });
            }
        };
        QuickOpenController.ID = 'editor.controller.quickOpenController';
        QuickOpenController._RANGE_HIGHLIGHT_DECORATION = textModelWithDecorations_1.ModelDecorationOptions.register({
            className: 'rangeHighlight',
            isWholeLine: true
        });
        QuickOpenController = QuickOpenController_1 = __decorate([
            editorBrowserExtensions_1.editorContribution,
            __param(1, themeService_1.IThemeService)
        ], QuickOpenController);
        return QuickOpenController;
        var QuickOpenController_1;
    }());
    exports.QuickOpenController = QuickOpenController;
    /**
     * Base class for providing quick open in the editor.
     */
    var BaseEditorQuickOpenAction = (function (_super) {
        __extends(BaseEditorQuickOpenAction, _super);
        function BaseEditorQuickOpenAction(inputAriaLabel, opts) {
            var _this = _super.call(this, opts) || this;
            _this._inputAriaLabel = inputAriaLabel;
            return _this;
        }
        BaseEditorQuickOpenAction.prototype.getController = function (editor) {
            return QuickOpenController.get(editor);
        };
        BaseEditorQuickOpenAction.prototype._show = function (controller, opts) {
            controller.run({
                inputAriaLabel: this._inputAriaLabel,
                getModel: function (value) { return opts.getModel(value); },
                getAutoFocus: function (searchValue) { return opts.getAutoFocus(searchValue); }
            });
        };
        return BaseEditorQuickOpenAction;
    }(editorCommonExtensions_1.EditorAction));
    exports.BaseEditorQuickOpenAction = BaseEditorQuickOpenAction;
});
//# sourceMappingURL=editorQuickOpen.js.map