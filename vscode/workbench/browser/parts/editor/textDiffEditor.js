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
define(["require", "exports", "vs/base/common/winjs.base", "vs/nls", "vs/base/common/objects", "vs/base/common/actions", "vs/base/common/errors", "vs/base/common/types", "vs/workbench/browser/parts/editor/textEditor", "vs/workbench/common/editor", "vs/workbench/common/editor/resourceEditorInput", "vs/workbench/common/editor/diffEditorInput", "vs/editor/browser/widget/diffNavigator", "vs/editor/browser/widget/diffEditorWidget", "vs/workbench/common/editor/textDiffEditorModel", "vs/workbench/services/editor/browser/editorService", "vs/platform/files/common/files", "vs/platform/telemetry/common/telemetry", "vs/platform/storage/common/storage", "vs/editor/common/services/resourceConfiguration", "vs/platform/instantiation/common/instantiation", "vs/platform/instantiation/common/serviceCollection", "vs/workbench/services/editor/common/editorService", "vs/platform/theme/common/themeService", "vs/workbench/services/group/common/groupService", "vs/editor/common/services/modeService", "vs/workbench/services/textfile/common/textfiles", "vs/css!./media/textdiffeditor"], function (require, exports, winjs_base_1, nls, objects, actions_1, errors_1, types, textEditor_1, editor_1, resourceEditorInput_1, diffEditorInput_1, diffNavigator_1, diffEditorWidget_1, textDiffEditorModel_1, editorService_1, files_1, telemetry_1, storage_1, resourceConfiguration_1, instantiation_1, serviceCollection_1, editorService_2, themeService_1, groupService_1, modeService_1, textfiles_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * The text editor that leverages the diff text editor for the editing experience.
     */
    var TextDiffEditor = (function (_super) {
        __extends(TextDiffEditor, _super);
        function TextDiffEditor(telemetryService, instantiationService, storageService, configurationService, editorService, themeService, editorGroupService, modeService, textFileService) {
            var _this = _super.call(this, TextDiffEditor.ID, telemetryService, instantiationService, storageService, configurationService, themeService, modeService, textFileService, editorGroupService) || this;
            _this.editorService = editorService;
            return _this;
        }
        TextDiffEditor.prototype.getTitle = function () {
            if (this.input) {
                return this.input.getName();
            }
            return nls.localize('textDiffEditor', "Text Diff Editor");
        };
        TextDiffEditor.prototype.createEditorControl = function (parent, configuration) {
            var _this = this;
            // Actions
            this.nextDiffAction = new NavigateAction(this, true);
            this.previousDiffAction = new NavigateAction(this, false);
            // Support navigation within the diff editor by overriding the editor service within
            var delegatingEditorService = this.instantiationService.createInstance(editorService_1.DelegatingWorkbenchEditorService);
            delegatingEditorService.setEditorOpenHandler(function (input, options, arg3) {
                // Check if arg4 is a position argument that differs from this editors position
                if (types.isUndefinedOrNull(arg3) || arg3 === false || arg3 === _this.position) {
                    var activeDiffInput = _this.input;
                    if (input && options && activeDiffInput) {
                        // Input matches modified side of the diff editor: perform the action on modified side
                        if (input.matches(activeDiffInput.modifiedInput)) {
                            return _this.setInput(_this.input, options).then(function () { return _this; });
                        }
                        else if (input.matches(activeDiffInput.originalInput)) {
                            var originalEditor = _this.getControl().getOriginalEditor();
                            if (options instanceof editor_1.TextEditorOptions) {
                                options.apply(originalEditor);
                                return winjs_base_1.TPromise.as(_this);
                            }
                        }
                    }
                }
                return winjs_base_1.TPromise.as(null);
            });
            // Create a special child of instantiator that will delegate all calls to openEditor() to the same diff editor if the input matches with the modified one
            var diffEditorInstantiator = this.instantiationService.createChild(new serviceCollection_1.ServiceCollection([editorService_2.IWorkbenchEditorService, delegatingEditorService]));
            return diffEditorInstantiator.createInstance(diffEditorWidget_1.DiffEditorWidget, parent.getHTMLElement(), configuration);
        };
        TextDiffEditor.prototype.setInput = function (input, options) {
            var _this = this;
            var oldInput = this.input;
            _super.prototype.setInput.call(this, input, options);
            // Detect options
            var forceOpen = options && options.forceOpen;
            // Same Input
            if (!forceOpen && input.matches(oldInput)) {
                // TextOptions (avoiding instanceof here for a reason, do not change!)
                var textOptions = options;
                if (textOptions && types.isFunction(textOptions.apply)) {
                    textOptions.apply(this.getControl());
                }
                return winjs_base_1.TPromise.as(null);
            }
            // Dispose previous diff navigator
            if (this.diffNavigator) {
                this.diffNavigator.dispose();
            }
            // Different Input (Reload)
            return input.resolve(true).then(function (resolvedModel) {
                // Assert Model Instance
                if (!(resolvedModel instanceof textDiffEditorModel_1.TextDiffEditorModel) && _this.openAsBinary(input, options)) {
                    return null;
                }
                // Assert that the current input is still the one we expect. This prevents a race condition when loading a diff takes long and another input was set meanwhile
                if (!_this.input || _this.input !== input) {
                    return null;
                }
                // Editor
                var diffEditor = _this.getControl();
                diffEditor.setModel(resolvedModel.textDiffEditorModel);
                // Handle TextOptions
                var alwaysRevealFirst = true;
                if (options && types.isFunction(options.apply)) {
                    var hadOptions = options.apply(diffEditor);
                    if (hadOptions) {
                        alwaysRevealFirst = false; // Do not reveal if we are instructed to open specific line/col
                    }
                }
                // Listen on diff updated changes to reveal the first change
                _this.diffNavigator = new diffNavigator_1.DiffNavigator(diffEditor, {
                    alwaysRevealFirst: alwaysRevealFirst
                });
                _this.diffNavigator.addListener(diffNavigator_1.DiffNavigator.Events.UPDATED, function () {
                    _this.nextDiffAction.updateEnablement();
                    _this.previousDiffAction.updateEnablement();
                });
            }, function (error) {
                // In case we tried to open a file and the response indicates that this is not a text file, fallback to binary diff.
                if (_this.isFileBinaryError(error) && _this.openAsBinary(input, options)) {
                    return null;
                }
                // Otherwise make sure the error bubbles up
                return winjs_base_1.TPromise.wrapError(error);
            });
        };
        TextDiffEditor.prototype.openAsBinary = function (input, options) {
            if (input instanceof diffEditorInput_1.DiffEditorInput) {
                var originalInput = input.originalInput;
                var modifiedInput = input.modifiedInput;
                var binaryDiffInput = new diffEditorInput_1.DiffEditorInput(input.getName(), input.getDescription(), originalInput, modifiedInput, true);
                // Forward binary flag to input if supported
                if (types.isFunction(originalInput.setForceOpenAsBinary)) {
                    originalInput.setForceOpenAsBinary();
                }
                if (types.isFunction(modifiedInput.setForceOpenAsBinary)) {
                    modifiedInput.setForceOpenAsBinary();
                }
                this.editorService.openEditor(binaryDiffInput, options, this.position).done(null, errors_1.onUnexpectedError);
                return true;
            }
            return false;
        };
        TextDiffEditor.prototype.computeConfiguration = function (configuration) {
            var editorConfiguration = _super.prototype.computeConfiguration.call(this, configuration);
            // Handle diff editor specially by merging in diffEditor configuration
            if (types.isObject(configuration.diffEditor)) {
                objects.mixin(editorConfiguration, configuration.diffEditor);
            }
            return editorConfiguration;
        };
        TextDiffEditor.prototype.getConfigurationOverrides = function () {
            var options = _super.prototype.getConfigurationOverrides.call(this);
            options.readOnly = this.isReadOnly();
            return options;
        };
        TextDiffEditor.prototype.getAriaLabel = function () {
            var ariaLabel;
            var inputName = this.input && this.input.getName();
            if (this.isReadOnly()) {
                ariaLabel = inputName ? nls.localize('readonlyEditorWithInputAriaLabel', "{0}. Readonly text compare editor.", inputName) : nls.localize('readonlyEditorAriaLabel', "Readonly text compare editor.");
            }
            else {
                ariaLabel = inputName ? nls.localize('editableEditorWithInputAriaLabel', "{0}. Text file compare editor.", inputName) : nls.localize('editableEditorAriaLabel', "Text file compare editor.");
            }
            return ariaLabel;
        };
        TextDiffEditor.prototype.isReadOnly = function () {
            var input = this.input;
            if (input instanceof diffEditorInput_1.DiffEditorInput) {
                var modifiedInput = input.modifiedInput;
                return modifiedInput instanceof resourceEditorInput_1.ResourceEditorInput;
            }
            return false;
        };
        TextDiffEditor.prototype.isFileBinaryError = function (error) {
            var _this = this;
            if (types.isArray(error)) {
                var errors = error;
                return errors.some(function (e) { return _this.isFileBinaryError(e); });
            }
            return error.fileOperationResult === files_1.FileOperationResult.FILE_IS_BINARY;
        };
        TextDiffEditor.prototype.clearInput = function () {
            // Dispose previous diff navigator
            if (this.diffNavigator) {
                this.diffNavigator.dispose();
            }
            // Clear Model
            this.getControl().setModel(null);
            // Pass to super
            _super.prototype.clearInput.call(this);
        };
        TextDiffEditor.prototype.getDiffNavigator = function () {
            return this.diffNavigator;
        };
        TextDiffEditor.prototype.getActions = function () {
            return [
                this.previousDiffAction,
                this.nextDiffAction
            ];
        };
        TextDiffEditor.prototype.getSecondaryActions = function () {
            var actions = _super.prototype.getSecondaryActions.call(this);
            // Action to toggle editor mode from inline to side by side
            var toggleEditorModeAction = new ToggleEditorModeAction(this);
            toggleEditorModeAction.order = 50; // Closer to the end
            actions.push.apply(// Closer to the end
            actions, [
                toggleEditorModeAction
            ]);
            return actions;
        };
        TextDiffEditor.prototype.getControl = function () {
            return _super.prototype.getControl.call(this);
        };
        TextDiffEditor.prototype.dispose = function () {
            // Dispose previous diff navigator
            if (this.diffNavigator) {
                this.diffNavigator.dispose();
            }
            _super.prototype.dispose.call(this);
        };
        TextDiffEditor.ID = editor_1.TEXT_DIFF_EDITOR_ID;
        TextDiffEditor = __decorate([
            __param(0, telemetry_1.ITelemetryService),
            __param(1, instantiation_1.IInstantiationService),
            __param(2, storage_1.IStorageService),
            __param(3, resourceConfiguration_1.ITextResourceConfigurationService),
            __param(4, editorService_2.IWorkbenchEditorService),
            __param(5, themeService_1.IThemeService),
            __param(6, groupService_1.IEditorGroupService),
            __param(7, modeService_1.IModeService),
            __param(8, textfiles_1.ITextFileService)
        ], TextDiffEditor);
        return TextDiffEditor;
    }(textEditor_1.BaseTextEditor));
    exports.TextDiffEditor = TextDiffEditor;
    var NavigateAction = (function (_super) {
        __extends(NavigateAction, _super);
        function NavigateAction(editor, next) {
            var _this = _super.call(this, next ? NavigateAction.ID_NEXT : NavigateAction.ID_PREV) || this;
            _this.editor = editor;
            _this.next = next;
            _this.label = _this.next ? nls.localize('navigate.next.label', "Next Change") : nls.localize('navigate.prev.label', "Previous Change");
            _this.class = _this.next ? 'textdiff-editor-action next' : 'textdiff-editor-action previous';
            _this.enabled = false;
            return _this;
        }
        NavigateAction.prototype.run = function () {
            if (this.next) {
                this.editor.getDiffNavigator().next();
            }
            else {
                this.editor.getDiffNavigator().previous();
            }
            return null;
        };
        NavigateAction.prototype.updateEnablement = function () {
            this.enabled = this.editor.getDiffNavigator().canNavigate();
        };
        NavigateAction.ID_NEXT = 'workbench.action.compareEditor.nextChange';
        NavigateAction.ID_PREV = 'workbench.action.compareEditor.previousChange';
        return NavigateAction;
    }(actions_1.Action));
    var ToggleEditorModeAction = (function (_super) {
        __extends(ToggleEditorModeAction, _super);
        function ToggleEditorModeAction(editor) {
            var _this = _super.call(this, ToggleEditorModeAction.ID) || this;
            _this.editor = editor;
            return _this;
        }
        Object.defineProperty(ToggleEditorModeAction.prototype, "label", {
            get: function () {
                return ToggleEditorModeAction.isInlineMode(this.editor) ? ToggleEditorModeAction.SIDEBYSIDE_LABEL : ToggleEditorModeAction.INLINE_LABEL;
            },
            enumerable: true,
            configurable: true
        });
        ToggleEditorModeAction.prototype.run = function () {
            var inlineModeActive = ToggleEditorModeAction.isInlineMode(this.editor);
            var control = this.editor.getControl();
            control.updateOptions({
                renderSideBySide: inlineModeActive
            });
            return winjs_base_1.TPromise.as(true);
        };
        ToggleEditorModeAction.isInlineMode = function (editor) {
            var control = editor.getControl();
            return control && !control.renderSideBySide;
        };
        ToggleEditorModeAction.ID = 'toggle.diff.editorMode';
        ToggleEditorModeAction.INLINE_LABEL = nls.localize('inlineDiffLabel', "Switch to Inline View");
        ToggleEditorModeAction.SIDEBYSIDE_LABEL = nls.localize('sideBySideDiffLabel', "Switch to Side by Side View");
        return ToggleEditorModeAction;
    }(actions_1.Action));
});
//# sourceMappingURL=textDiffEditor.js.map