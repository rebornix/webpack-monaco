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
define(["require", "exports", "vs/nls", "vs/base/common/winjs.base", "vs/base/browser/dom", "vs/base/common/strings", "vs/base/common/paths", "vs/base/common/types", "vs/base/common/uri", "vs/base/common/errors", "vs/base/common/actions", "vs/base/common/platform", "vs/workbench/common/editor/untitledEditorInput", "vs/workbench/common/editor", "vs/base/common/lifecycle", "vs/workbench/services/untitled/common/untitledEditorService", "vs/workbench/services/configuration/common/configurationEditing", "vs/editor/common/editorCommon", "vs/editor/contrib/linesOperations/common/linesOperations", "vs/editor/contrib/indentation/common/indentation", "vs/workbench/browser/parts/editor/binaryEditor", "vs/workbench/browser/parts/editor/binaryDiffEditor", "vs/workbench/services/editor/common/editorService", "vs/platform/quickOpen/common/quickOpen", "vs/workbench/services/configuration/common/configuration", "vs/platform/files/common/files", "vs/platform/instantiation/common/instantiation", "vs/editor/common/services/modeService", "vs/editor/common/services/modelService", "vs/editor/common/core/selection", "vs/workbench/services/group/common/groupService", "vs/editor/common/config/commonEditorConfig", "vs/platform/commands/common/commands", "vs/platform/extensionManagement/common/extensionManagement", "vs/workbench/services/textfile/common/textfiles", "vs/editor/common/services/codeEditorService", "vs/workbench/parts/preferences/common/preferences", "vs/css!./media/editorstatus"], function (require, exports, nls, winjs_base_1, dom_1, strings, paths, types, uri_1, errors, actions_1, platform_1, untitledEditorInput_1, editor_1, lifecycle_1, untitledEditorService_1, configurationEditing_1, editorCommon_1, linesOperations_1, indentation_1, binaryEditor_1, binaryDiffEditor_1, editorService_1, quickOpen_1, configuration_1, files_1, instantiation_1, modeService_1, modelService_1, selection_1, groupService_1, commonEditorConfig_1, commands_1, extensionManagement_1, textfiles_1, codeEditorService_1, preferences_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function toEditorWithEncodingSupport(input) {
        if (input instanceof editor_1.SideBySideEditorInput) {
            input = input.master;
        }
        if (input instanceof untitledEditorInput_1.UntitledEditorInput) {
            return input;
        }
        var encodingSupport = input;
        if (types.areFunctions(encodingSupport.setEncoding, encodingSupport.getEncoding)) {
            return encodingSupport;
        }
        return null;
    }
    var StateChange = (function () {
        function StateChange() {
            this.indentation = false;
            this.selectionStatus = false;
            this.mode = false;
            this.encoding = false;
            this.EOL = false;
            this.tabFocusMode = false;
            this.screenReaderMode = false;
            this.metadata = false;
        }
        StateChange.prototype.combine = function (other) {
            this.indentation = this.indentation || other.indentation;
            this.selectionStatus = this.selectionStatus || other.selectionStatus;
            this.mode = this.mode || other.mode;
            this.encoding = this.encoding || other.encoding;
            this.EOL = this.EOL || other.EOL;
            this.tabFocusMode = this.tabFocusMode || other.tabFocusMode;
            this.screenReaderMode = this.screenReaderMode || other.screenReaderMode;
            this.metadata = this.metadata || other.metadata;
        };
        return StateChange;
    }());
    var State = (function () {
        function State() {
            this._selectionStatus = null;
            this._mode = null;
            this._encoding = null;
            this._EOL = null;
            this._tabFocusMode = false;
            this._screenReaderMode = false;
            this._metadata = null;
        }
        Object.defineProperty(State.prototype, "selectionStatus", {
            get: function () { return this._selectionStatus; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(State.prototype, "mode", {
            get: function () { return this._mode; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(State.prototype, "encoding", {
            get: function () { return this._encoding; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(State.prototype, "EOL", {
            get: function () { return this._EOL; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(State.prototype, "indentation", {
            get: function () { return this._indentation; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(State.prototype, "tabFocusMode", {
            get: function () { return this._tabFocusMode; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(State.prototype, "screenReaderMode", {
            get: function () { return this._screenReaderMode; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(State.prototype, "metadata", {
            get: function () { return this._metadata; },
            enumerable: true,
            configurable: true
        });
        State.prototype.update = function (update) {
            var e = new StateChange();
            var somethingChanged = false;
            if (typeof update.selectionStatus !== 'undefined') {
                if (this._selectionStatus !== update.selectionStatus) {
                    this._selectionStatus = update.selectionStatus;
                    somethingChanged = true;
                    e.selectionStatus = true;
                }
            }
            if (typeof update.indentation !== 'undefined') {
                if (this._indentation !== update.indentation) {
                    this._indentation = update.indentation;
                    somethingChanged = true;
                    e.indentation = true;
                }
            }
            if (typeof update.mode !== 'undefined') {
                if (this._mode !== update.mode) {
                    this._mode = update.mode;
                    somethingChanged = true;
                    e.mode = true;
                }
            }
            if (typeof update.encoding !== 'undefined') {
                if (this._encoding !== update.encoding) {
                    this._encoding = update.encoding;
                    somethingChanged = true;
                    e.encoding = true;
                }
            }
            if (typeof update.EOL !== 'undefined') {
                if (this._EOL !== update.EOL) {
                    this._EOL = update.EOL;
                    somethingChanged = true;
                    e.EOL = true;
                }
            }
            if (typeof update.tabFocusMode !== 'undefined') {
                if (this._tabFocusMode !== update.tabFocusMode) {
                    this._tabFocusMode = update.tabFocusMode;
                    somethingChanged = true;
                    e.tabFocusMode = true;
                }
            }
            if (typeof update.screenReaderMode !== 'undefined') {
                if (this._screenReaderMode !== update.screenReaderMode) {
                    this._screenReaderMode = update.screenReaderMode;
                    somethingChanged = true;
                    e.screenReaderMode = true;
                }
            }
            if (typeof update.metadata !== 'undefined') {
                if (this._metadata !== update.metadata) {
                    this._metadata = update.metadata;
                    somethingChanged = true;
                    e.metadata = true;
                }
            }
            if (somethingChanged) {
                return e;
            }
            return null;
        };
        return State;
    }());
    var nlsSingleSelectionRange = nls.localize('singleSelectionRange', "Ln {0}, Col {1} ({2} selected)");
    var nlsSingleSelection = nls.localize('singleSelection', "Ln {0}, Col {1}");
    var nlsMultiSelectionRange = nls.localize('multiSelectionRange', "{0} selections ({1} characters selected)");
    var nlsMultiSelection = nls.localize('multiSelection', "{0} selections");
    var nlsEOLLF = nls.localize('endOfLineLineFeed', "LF");
    var nlsEOLCRLF = nls.localize('endOfLineCarriageReturnLineFeed', "CRLF");
    var nlsTabFocusMode = nls.localize('tabFocusModeEnabled', "Tab Moves Focus");
    var nlsScreenReaderDetected = nls.localize('screenReaderDetected', "Screen Reader Detected");
    var nlsScreenReaderDetectedTitle = nls.localize('screenReaderDetectedExtra', "If you are not using a Screen Reader, please change the setting `editor.accessibilitySupport` to \"off\".");
    function _setDisplay(el, desiredValue) {
        if (el.style.display !== desiredValue) {
            el.style.display = desiredValue;
        }
    }
    function show(el) {
        _setDisplay(el, '');
    }
    function hide(el) {
        _setDisplay(el, 'none');
    }
    var EditorStatus = (function () {
        function EditorStatus(editorService, editorGroupService, quickOpenService, instantiationService, untitledEditorService, modeService, textFileService) {
            this.editorService = editorService;
            this.editorGroupService = editorGroupService;
            this.quickOpenService = quickOpenService;
            this.instantiationService = instantiationService;
            this.untitledEditorService = untitledEditorService;
            this.modeService = modeService;
            this.textFileService = textFileService;
            this.toDispose = [];
            this.activeEditorListeners = [];
            this.state = new State();
        }
        EditorStatus.prototype.render = function (container) {
            var _this = this;
            this.element = dom_1.append(container, dom_1.$('.editor-statusbar-item'));
            this.tabFocusModeElement = dom_1.append(this.element, dom_1.$('a.editor-status-tabfocusmode.status-bar-info'));
            this.tabFocusModeElement.title = nls.localize('disableTabMode', "Disable Accessibility Mode");
            this.tabFocusModeElement.onclick = function () { return _this.onTabFocusModeClick(); };
            this.tabFocusModeElement.textContent = nlsTabFocusMode;
            hide(this.tabFocusModeElement);
            this.screenRedearModeElement = dom_1.append(this.element, dom_1.$('a.editor-status-screenreadermode.status-bar-info'));
            this.screenRedearModeElement.textContent = nlsScreenReaderDetected;
            this.screenRedearModeElement.title = nlsScreenReaderDetectedTitle;
            hide(this.screenRedearModeElement);
            this.selectionElement = dom_1.append(this.element, dom_1.$('a.editor-status-selection'));
            this.selectionElement.title = nls.localize('gotoLine', "Go to Line");
            this.selectionElement.onclick = function () { return _this.onSelectionClick(); };
            hide(this.selectionElement);
            this.indentationElement = dom_1.append(this.element, dom_1.$('a.editor-status-indentation'));
            this.indentationElement.title = nls.localize('indentation', "Indentation");
            this.indentationElement.onclick = function () { return _this.onIndentationClick(); };
            hide(this.indentationElement);
            this.encodingElement = dom_1.append(this.element, dom_1.$('a.editor-status-encoding'));
            this.encodingElement.title = nls.localize('selectEncoding', "Select Encoding");
            this.encodingElement.onclick = function () { return _this.onEncodingClick(); };
            hide(this.encodingElement);
            this.eolElement = dom_1.append(this.element, dom_1.$('a.editor-status-eol'));
            this.eolElement.title = nls.localize('selectEOL', "Select End of Line Sequence");
            this.eolElement.onclick = function () { return _this.onEOLClick(); };
            hide(this.eolElement);
            this.modeElement = dom_1.append(this.element, dom_1.$('a.editor-status-mode'));
            this.modeElement.title = nls.localize('selectLanguageMode', "Select Language Mode");
            this.modeElement.onclick = function () { return _this.onModeClick(); };
            hide(this.modeElement);
            this.metadataElement = dom_1.append(this.element, dom_1.$('span.editor-status-metadata'));
            this.metadataElement.title = nls.localize('fileInfo', "File Information");
            hide(this.metadataElement);
            this.delayedRender = null;
            this.toRender = null;
            this.toDispose.push({
                dispose: function () {
                    if (_this.delayedRender) {
                        _this.delayedRender.dispose();
                        _this.delayedRender = null;
                    }
                }
            }, this.editorGroupService.onEditorsChanged(function () { return _this.onEditorsChanged(); }), this.untitledEditorService.onDidChangeEncoding(function (r) { return _this.onResourceEncodingChange(r); }), this.textFileService.models.onModelEncodingChanged(function (e) { return _this.onResourceEncodingChange(e.resource); }), commonEditorConfig_1.TabFocus.onDidChangeTabFocus(function (e) { return _this.onTabFocusModeChange(); }));
            return lifecycle_1.combinedDisposable(this.toDispose);
        };
        EditorStatus.prototype.updateState = function (update) {
            var _this = this;
            var changed = this.state.update(update);
            if (!changed) {
                // Nothing really changed
                return;
            }
            if (!this.toRender) {
                this.toRender = changed;
                this.delayedRender = dom_1.runAtThisOrScheduleAtNextAnimationFrame(function () {
                    _this.delayedRender = null;
                    var toRender = _this.toRender;
                    _this.toRender = null;
                    _this._renderNow(toRender);
                });
            }
            else {
                this.toRender.combine(changed);
            }
        };
        EditorStatus.prototype._renderNow = function (changed) {
            if (changed.tabFocusMode) {
                if (this.state.tabFocusMode && this.state.tabFocusMode === true) {
                    show(this.tabFocusModeElement);
                }
                else {
                    hide(this.tabFocusModeElement);
                }
            }
            if (changed.screenReaderMode) {
                if (this.state.screenReaderMode && this.state.screenReaderMode === true) {
                    show(this.screenRedearModeElement);
                }
                else {
                    hide(this.screenRedearModeElement);
                }
            }
            if (changed.indentation) {
                if (this.state.indentation) {
                    this.indentationElement.textContent = this.state.indentation;
                    show(this.indentationElement);
                }
                else {
                    hide(this.indentationElement);
                }
            }
            if (changed.selectionStatus) {
                if (this.state.selectionStatus && !this.state.screenReaderMode) {
                    this.selectionElement.textContent = this.state.selectionStatus;
                    show(this.selectionElement);
                }
                else {
                    hide(this.selectionElement);
                }
            }
            if (changed.encoding) {
                if (this.state.encoding) {
                    this.encodingElement.textContent = this.state.encoding;
                    show(this.encodingElement);
                }
                else {
                    hide(this.encodingElement);
                }
            }
            if (changed.EOL) {
                if (this.state.EOL) {
                    this.eolElement.textContent = this.state.EOL === '\r\n' ? nlsEOLCRLF : nlsEOLLF;
                    show(this.eolElement);
                }
                else {
                    hide(this.eolElement);
                }
            }
            if (changed.mode) {
                if (this.state.mode) {
                    this.modeElement.textContent = this.state.mode;
                    show(this.modeElement);
                }
                else {
                    hide(this.modeElement);
                }
            }
            if (changed.metadata) {
                if (this.state.metadata) {
                    this.metadataElement.textContent = this.state.metadata;
                    show(this.metadataElement);
                }
                else {
                    hide(this.metadataElement);
                }
            }
        };
        EditorStatus.prototype.getSelectionLabel = function (info) {
            if (!info || !info.selections) {
                return null;
            }
            if (info.selections.length === 1) {
                if (info.charactersSelected) {
                    return strings.format(nlsSingleSelectionRange, info.selections[0].positionLineNumber, info.selections[0].positionColumn, info.charactersSelected);
                }
                return strings.format(nlsSingleSelection, info.selections[0].positionLineNumber, info.selections[0].positionColumn);
            }
            if (info.charactersSelected) {
                return strings.format(nlsMultiSelectionRange, info.selections.length, info.charactersSelected);
            }
            if (info.selections.length > 0) {
                return strings.format(nlsMultiSelection, info.selections.length);
            }
            return null;
        };
        EditorStatus.prototype.onModeClick = function () {
            var action = this.instantiationService.createInstance(ChangeModeAction, ChangeModeAction.ID, ChangeModeAction.LABEL);
            action.run().done(null, errors.onUnexpectedError);
            action.dispose();
        };
        EditorStatus.prototype.onIndentationClick = function () {
            var action = this.instantiationService.createInstance(ChangeIndentationAction, ChangeIndentationAction.ID, ChangeIndentationAction.LABEL);
            action.run().done(null, errors.onUnexpectedError);
            action.dispose();
        };
        EditorStatus.prototype.onSelectionClick = function () {
            this.quickOpenService.show(':'); // "Go to line"
        };
        EditorStatus.prototype.onEOLClick = function () {
            var action = this.instantiationService.createInstance(ChangeEOLAction, ChangeEOLAction.ID, ChangeEOLAction.LABEL);
            action.run().done(null, errors.onUnexpectedError);
            action.dispose();
        };
        EditorStatus.prototype.onEncodingClick = function () {
            var action = this.instantiationService.createInstance(ChangeEncodingAction, ChangeEncodingAction.ID, ChangeEncodingAction.LABEL);
            action.run().done(null, errors.onUnexpectedError);
            action.dispose();
        };
        EditorStatus.prototype.onTabFocusModeClick = function () {
            commonEditorConfig_1.TabFocus.setTabFocusMode(false);
        };
        EditorStatus.prototype.onEditorsChanged = function () {
            var _this = this;
            var activeEditor = this.editorService.getActiveEditor();
            var control = codeEditorService_1.getCodeEditor(activeEditor);
            // Update all states
            this.onScreenReaderModeChange(control);
            this.onSelectionChange(control);
            this.onModeChange(control);
            this.onEOLChange(control);
            this.onEncodingChange(activeEditor);
            this.onIndentationChange(control);
            this.onMetadataChange(activeEditor);
            // Dispose old active editor listeners
            lifecycle_1.dispose(this.activeEditorListeners);
            // Attach new listeners to active editor
            if (control) {
                // Hook Listener for Configuration changes
                this.activeEditorListeners.push(control.onDidChangeConfiguration(function (event) {
                    if (event.accessibilitySupport) {
                        _this.onScreenReaderModeChange(control);
                    }
                }));
                // Hook Listener for Selection changes
                this.activeEditorListeners.push(control.onDidChangeCursorPosition(function (event) {
                    _this.onSelectionChange(control);
                }));
                // Hook Listener for mode changes
                this.activeEditorListeners.push(control.onDidChangeModelLanguage(function (event) {
                    _this.onModeChange(control);
                }));
                // Hook Listener for content changes
                this.activeEditorListeners.push(control.onDidChangeModelContent(function (e) {
                    _this.onEOLChange(control);
                }));
                // Hook Listener for content options changes
                this.activeEditorListeners.push(control.onDidChangeModelOptions(function (event) {
                    _this.onIndentationChange(control);
                }));
            }
            else if (activeEditor instanceof binaryEditor_1.BaseBinaryResourceEditor || activeEditor instanceof binaryDiffEditor_1.BinaryResourceDiffEditor) {
                var binaryEditors = [];
                if (activeEditor instanceof binaryDiffEditor_1.BinaryResourceDiffEditor) {
                    var details = activeEditor.getDetailsEditor();
                    if (details instanceof binaryEditor_1.BaseBinaryResourceEditor) {
                        binaryEditors.push(details);
                    }
                    var master = activeEditor.getMasterEditor();
                    if (master instanceof binaryEditor_1.BaseBinaryResourceEditor) {
                        binaryEditors.push(master);
                    }
                }
                else {
                    binaryEditors.push(activeEditor);
                }
                binaryEditors.forEach(function (editor) {
                    _this.activeEditorListeners.push(editor.onMetadataChanged(function (metadata) {
                        _this.onMetadataChange(activeEditor);
                    }));
                });
            }
        };
        EditorStatus.prototype.onModeChange = function (editorWidget) {
            var info = { mode: null };
            // We only support text based editors
            if (editorWidget) {
                var textModel = editorWidget.getModel();
                if (textModel) {
                    // Compute mode
                    var modeId = textModel.getLanguageIdentifier().language;
                    info = { mode: this.modeService.getLanguageName(modeId) };
                }
            }
            this.updateState(info);
        };
        EditorStatus.prototype.onIndentationChange = function (editorWidget) {
            var update = { indentation: null };
            if (editorWidget) {
                var model = editorWidget.getModel();
                if (model) {
                    var modelOpts = model.getOptions();
                    update.indentation = (modelOpts.insertSpaces
                        ? nls.localize('spacesSize', "Spaces: {0}", modelOpts.tabSize)
                        : nls.localize({ key: 'tabSize', comment: ['Tab corresponds to the tab key'] }, "Tab Size: {0}", modelOpts.tabSize));
                }
            }
            this.updateState(update);
        };
        EditorStatus.prototype.onMetadataChange = function (editor) {
            var update = { metadata: null };
            if (editor instanceof binaryEditor_1.BaseBinaryResourceEditor || editor instanceof binaryDiffEditor_1.BinaryResourceDiffEditor) {
                update.metadata = editor.getMetadata();
            }
            this.updateState(update);
        };
        EditorStatus.prototype.onScreenReaderModeChange = function (editorWidget) {
            var screenReaderMode = false;
            // We only support text based editors
            if (editorWidget) {
                screenReaderMode = (editorWidget.getConfiguration().accessibilitySupport === 2 /* Enabled */);
            }
            this.updateState({ screenReaderMode: screenReaderMode });
        };
        EditorStatus.prototype.onSelectionChange = function (editorWidget) {
            var info = {};
            // We only support text based editors
            if (editorWidget) {
                // Compute selection(s)
                info.selections = editorWidget.getSelections() || [];
                // Compute selection length
                info.charactersSelected = 0;
                var textModel_1 = editorWidget.getModel();
                if (textModel_1) {
                    info.selections.forEach(function (selection) {
                        info.charactersSelected += textModel_1.getValueLengthInRange(selection);
                    });
                }
                // Compute the visible column for one selection. This will properly handle tabs and their configured widths
                if (info.selections.length === 1) {
                    var visibleColumn = editorWidget.getVisibleColumnFromPosition(editorWidget.getPosition());
                    var selectionClone = info.selections[0].clone(); // do not modify the original position we got from the editor
                    selectionClone = new selection_1.Selection(selectionClone.selectionStartLineNumber, selectionClone.selectionStartColumn, selectionClone.positionLineNumber, visibleColumn);
                    info.selections[0] = selectionClone;
                }
            }
            this.updateState({ selectionStatus: this.getSelectionLabel(info) });
        };
        EditorStatus.prototype.onEOLChange = function (editorWidget) {
            var info = { EOL: null };
            if (editorWidget && !editorWidget.getConfiguration().readOnly) {
                var codeEditorModel = editorWidget.getModel();
                if (codeEditorModel) {
                    info.EOL = codeEditorModel.getEOL();
                }
            }
            this.updateState(info);
        };
        EditorStatus.prototype.onEncodingChange = function (e) {
            if (e && !this.isActiveEditor(e)) {
                return;
            }
            var info = { encoding: null };
            // We only support text based editors
            if (codeEditorService_1.getCodeEditor(e)) {
                var encodingSupport = toEditorWithEncodingSupport(e.input);
                if (encodingSupport) {
                    var rawEncoding = encodingSupport.getEncoding();
                    var encodingInfo = files_1.SUPPORTED_ENCODINGS[rawEncoding];
                    if (encodingInfo) {
                        info.encoding = encodingInfo.labelShort; // if we have a label, take it from there
                    }
                    else {
                        info.encoding = rawEncoding; // otherwise use it raw
                    }
                }
            }
            this.updateState(info);
        };
        EditorStatus.prototype.onResourceEncodingChange = function (resource) {
            var activeEditor = this.editorService.getActiveEditor();
            if (activeEditor) {
                var activeResource = editor_1.toResource(activeEditor.input, { supportSideBySide: true, filter: ['file', 'untitled'] });
                if (activeResource && activeResource.toString() === resource.toString()) {
                    return this.onEncodingChange(activeEditor); // only update if the encoding changed for the active resource
                }
            }
        };
        EditorStatus.prototype.onTabFocusModeChange = function () {
            var info = { tabFocusMode: commonEditorConfig_1.TabFocus.getTabFocusMode() };
            this.updateState(info);
        };
        EditorStatus.prototype.isActiveEditor = function (e) {
            var activeEditor = this.editorService.getActiveEditor();
            return activeEditor && e && activeEditor === e;
        };
        EditorStatus = __decorate([
            __param(0, editorService_1.IWorkbenchEditorService),
            __param(1, groupService_1.IEditorGroupService),
            __param(2, quickOpen_1.IQuickOpenService),
            __param(3, instantiation_1.IInstantiationService),
            __param(4, untitledEditorService_1.IUntitledEditorService),
            __param(5, modeService_1.IModeService),
            __param(6, textfiles_1.ITextFileService)
        ], EditorStatus);
        return EditorStatus;
    }());
    exports.EditorStatus = EditorStatus;
    function isWritableCodeEditor(codeEditor) {
        if (!codeEditor) {
            return false;
        }
        var config = codeEditor.getConfiguration();
        return (!config.readOnly);
    }
    function isWritableBaseEditor(e) {
        return isWritableCodeEditor(codeEditorService_1.getCodeEditor(e));
    }
    var ShowLanguageExtensionsAction = (function (_super) {
        __extends(ShowLanguageExtensionsAction, _super);
        function ShowLanguageExtensionsAction(fileExtension, commandService, galleryService) {
            var _this = _super.call(this, ShowLanguageExtensionsAction.ID, nls.localize('showLanguageExtensions', "Search Marketplace Extensions for '{0}'...", fileExtension)) || this;
            _this.fileExtension = fileExtension;
            _this.commandService = commandService;
            _this.enabled = galleryService.isEnabled();
            return _this;
        }
        ShowLanguageExtensionsAction.prototype.run = function () {
            return this.commandService.executeCommand('workbench.extensions.action.showExtensionsForLanguage', this.fileExtension).then(function () { return void 0; });
        };
        ShowLanguageExtensionsAction.ID = 'workbench.action.showLanguageExtensions';
        ShowLanguageExtensionsAction = __decorate([
            __param(1, commands_1.ICommandService),
            __param(2, extensionManagement_1.IExtensionGalleryService)
        ], ShowLanguageExtensionsAction);
        return ShowLanguageExtensionsAction;
    }(actions_1.Action));
    exports.ShowLanguageExtensionsAction = ShowLanguageExtensionsAction;
    var ChangeModeAction = (function (_super) {
        __extends(ChangeModeAction, _super);
        function ChangeModeAction(actionId, actionLabel, modeService, modelService, editorService, configurationEditingService, configurationService, quickOpenService, preferencesService, instantiationService, commandService, configurationEditService) {
            var _this = _super.call(this, actionId, actionLabel) || this;
            _this.modeService = modeService;
            _this.modelService = modelService;
            _this.editorService = editorService;
            _this.configurationEditingService = configurationEditingService;
            _this.configurationService = configurationService;
            _this.quickOpenService = quickOpenService;
            _this.preferencesService = preferencesService;
            _this.instantiationService = instantiationService;
            _this.commandService = commandService;
            _this.configurationEditService = configurationEditService;
            return _this;
        }
        ChangeModeAction.prototype.run = function () {
            var _this = this;
            var activeEditor = this.editorService.getActiveEditor();
            var editorWidget = codeEditorService_1.getCodeEditor(activeEditor);
            if (!editorWidget) {
                return this.quickOpenService.pick([{ label: nls.localize('noEditor', "No text editor active at this time") }]);
            }
            var textModel = editorWidget.getModel();
            var fileResource = editor_1.toResource(activeEditor.input, { supportSideBySide: true, filter: 'file' });
            // Compute mode
            var currentModeId;
            var modeId;
            if (textModel) {
                modeId = textModel.getLanguageIdentifier().language;
                currentModeId = this.modeService.getLanguageName(modeId);
            }
            // All languages are valid picks
            var languages = this.modeService.getRegisteredLanguageNames();
            var picks = languages.sort().map(function (lang, index) {
                var description;
                if (currentModeId === lang) {
                    description = nls.localize('languageDescription', "({0}) - Configured Language", _this.modeService.getModeIdForLanguageName(lang.toLowerCase()));
                }
                else {
                    description = nls.localize('languageDescriptionConfigured', "({0})", _this.modeService.getModeIdForLanguageName(lang.toLowerCase()));
                }
                // construct a fake resource to be able to show nice icons if any
                var fakeResource;
                var extensions = _this.modeService.getExtensions(lang);
                if (extensions && extensions.length) {
                    fakeResource = uri_1.default.file(extensions[0]);
                }
                else {
                    var filenames = _this.modeService.getFilenames(lang);
                    if (filenames && filenames.length) {
                        fakeResource = uri_1.default.file(filenames[0]);
                    }
                }
                return {
                    label: lang,
                    resource: fakeResource,
                    description: description
                };
            });
            if (fileResource) {
                picks[0].separator = { border: true, label: nls.localize('languagesPicks', "languages (identifier)") };
            }
            // Offer action to configure via settings
            var configureModeAssociations;
            var configureModeSettings;
            var galleryAction;
            if (fileResource) {
                var ext = paths.extname(fileResource.fsPath) || paths.basename(fileResource.fsPath);
                galleryAction = this.instantiationService.createInstance(ShowLanguageExtensionsAction, ext);
                if (galleryAction.enabled) {
                    picks.unshift(galleryAction);
                }
                configureModeSettings = { label: nls.localize('configureModeSettings', "Configure '{0}' language based settings...", currentModeId) };
                picks.unshift(configureModeSettings);
                configureModeAssociations = { label: nls.localize('configureAssociationsExt', "Configure File Association for '{0}'...", ext) };
                picks.unshift(configureModeAssociations);
            }
            // Offer to "Auto Detect"
            var autoDetectMode = {
                label: nls.localize('autoDetect', "Auto Detect")
            };
            if (fileResource) {
                picks.unshift(autoDetectMode);
            }
            return this.quickOpenService.pick(picks, { placeHolder: nls.localize('pickLanguage', "Select Language Mode") }).then(function (pick) {
                if (!pick) {
                    return;
                }
                if (pick === galleryAction) {
                    galleryAction.run();
                    return;
                }
                // User decided to permanently configure associations, return right after
                if (pick === configureModeAssociations) {
                    _this.configureFileAssociation(fileResource);
                    return;
                }
                // User decided to configure settings for current language
                if (pick === configureModeSettings) {
                    _this.preferencesService.configureSettingsForLanguage(modeId);
                    return;
                }
                // Change mode for active editor
                activeEditor = _this.editorService.getActiveEditor();
                var editorWidget = codeEditorService_1.getCodeEditor(activeEditor);
                if (editorWidget) {
                    var models = [];
                    var textModel_2 = editorWidget.getModel();
                    if (textModel_2) {
                        models.push(textModel_2);
                    }
                    // Find mode
                    var mode_1;
                    if (pick === autoDetectMode) {
                        mode_1 = _this.modeService.getOrCreateModeByFilenameOrFirstLine(editor_1.toResource(activeEditor.input, { supportSideBySide: true, filter: ['file', 'untitled'] }).fsPath, textModel_2.getLineContent(1));
                    }
                    else {
                        mode_1 = _this.modeService.getOrCreateModeByLanguageName(pick.label);
                    }
                    // Change mode
                    models.forEach(function (textModel) {
                        _this.modelService.setMode(textModel, mode_1);
                    });
                }
            });
        };
        ChangeModeAction.prototype.configureFileAssociation = function (resource) {
            var _this = this;
            var extension = paths.extname(resource.fsPath);
            var basename = paths.basename(resource.fsPath);
            var currentAssociation = this.modeService.getModeIdByFilenameOrFirstLine(basename);
            var languages = this.modeService.getRegisteredLanguageNames();
            var picks = languages.sort().map(function (lang, index) {
                var id = _this.modeService.getModeIdForLanguageName(lang.toLowerCase());
                return {
                    id: id,
                    label: lang,
                    description: (id === currentAssociation) ? nls.localize('currentAssociation', "Current Association") : void 0
                };
            });
            winjs_base_1.TPromise.timeout(50 /* quick open is sensitive to being opened so soon after another */).done(function () {
                _this.quickOpenService.pick(picks, { placeHolder: nls.localize('pickLanguageToConfigure', "Select Language Mode to Associate with '{0}'", extension || basename) }).done(function (language) {
                    if (language) {
                        var fileAssociationsConfig = _this.configurationService.lookup(ChangeModeAction.FILE_ASSOCIATION_KEY);
                        var associationKey = void 0;
                        if (extension && basename[0] !== '.') {
                            associationKey = "*" + extension; // only use "*.ext" if the file path is in the form of <name>.<ext>
                        }
                        else {
                            associationKey = basename; // otherwise use the basename (e.g. .gitignore, Dockerfile)
                        }
                        // If the association is already being made in the workspace, make sure to target workspace settings
                        var target = configurationEditing_1.ConfigurationTarget.USER;
                        if (fileAssociationsConfig.workspace && !!fileAssociationsConfig.workspace[associationKey]) {
                            target = configurationEditing_1.ConfigurationTarget.WORKSPACE;
                        }
                        // Make sure to write into the value of the target and not the merged value from USER and WORKSPACE config
                        var currentAssociations = (target === configurationEditing_1.ConfigurationTarget.WORKSPACE) ? fileAssociationsConfig.workspace : fileAssociationsConfig.user;
                        if (!currentAssociations) {
                            currentAssociations = Object.create(null);
                        }
                        currentAssociations[associationKey] = language.id;
                        // Write config
                        _this.configurationEditingService.writeConfiguration(target, { key: ChangeModeAction.FILE_ASSOCIATION_KEY, value: currentAssociations });
                    }
                });
            });
        };
        ChangeModeAction.ID = 'workbench.action.editor.changeLanguageMode';
        ChangeModeAction.LABEL = nls.localize('changeMode', "Change Language Mode");
        ChangeModeAction.FILE_ASSOCIATION_KEY = 'files.associations';
        ChangeModeAction = __decorate([
            __param(2, modeService_1.IModeService),
            __param(3, modelService_1.IModelService),
            __param(4, editorService_1.IWorkbenchEditorService),
            __param(5, configurationEditing_1.IConfigurationEditingService),
            __param(6, configuration_1.IWorkspaceConfigurationService),
            __param(7, quickOpen_1.IQuickOpenService),
            __param(8, preferences_1.IPreferencesService),
            __param(9, instantiation_1.IInstantiationService),
            __param(10, commands_1.ICommandService),
            __param(11, configurationEditing_1.IConfigurationEditingService)
        ], ChangeModeAction);
        return ChangeModeAction;
    }(actions_1.Action));
    exports.ChangeModeAction = ChangeModeAction;
    var ChangeIndentationAction = (function (_super) {
        __extends(ChangeIndentationAction, _super);
        function ChangeIndentationAction(actionId, actionLabel, editorService, quickOpenService) {
            var _this = _super.call(this, actionId, actionLabel) || this;
            _this.editorService = editorService;
            _this.quickOpenService = quickOpenService;
            return _this;
        }
        ChangeIndentationAction.prototype.run = function () {
            var activeEditor = this.editorService.getActiveEditor();
            var control = codeEditorService_1.getCodeEditor(activeEditor);
            if (!control) {
                return this.quickOpenService.pick([{ label: nls.localize('noEditor', "No text editor active at this time") }]);
            }
            if (!isWritableCodeEditor(control)) {
                return this.quickOpenService.pick([{ label: nls.localize('noWritableCodeEditor', "The active code editor is read-only.") }]);
            }
            var picks = [
                control.getAction(indentation_1.IndentUsingSpaces.ID),
                control.getAction(indentation_1.IndentUsingTabs.ID),
                control.getAction(indentation_1.DetectIndentation.ID),
                control.getAction(indentation_1.IndentationToSpacesAction.ID),
                control.getAction(indentation_1.IndentationToTabsAction.ID),
                control.getAction(linesOperations_1.TrimTrailingWhitespaceAction.ID)
            ].map(function (a) {
                return {
                    id: a.id,
                    label: a.label,
                    detail: (platform_1.language === platform_1.LANGUAGE_DEFAULT) ? null : a.alias,
                    run: function () {
                        control.focus();
                        a.run();
                    }
                };
            });
            picks[0].separator = { label: nls.localize('indentView', "change view") };
            picks[3].separator = { label: nls.localize('indentConvert', "convert file"), border: true };
            return this.quickOpenService.pick(picks, { placeHolder: nls.localize('pickAction', "Select Action"), matchOnDetail: true }).then(function (action) { return action && action.run(); });
        };
        ChangeIndentationAction.ID = 'workbench.action.editor.changeIndentation';
        ChangeIndentationAction.LABEL = nls.localize('changeIndentation', "Change Indentation");
        ChangeIndentationAction = __decorate([
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, quickOpen_1.IQuickOpenService)
        ], ChangeIndentationAction);
        return ChangeIndentationAction;
    }(actions_1.Action));
    var ChangeEOLAction = (function (_super) {
        __extends(ChangeEOLAction, _super);
        function ChangeEOLAction(actionId, actionLabel, editorService, quickOpenService) {
            var _this = _super.call(this, actionId, actionLabel) || this;
            _this.editorService = editorService;
            _this.quickOpenService = quickOpenService;
            return _this;
        }
        ChangeEOLAction.prototype.run = function () {
            var _this = this;
            var activeEditor = this.editorService.getActiveEditor();
            var editorWidget = codeEditorService_1.getCodeEditor(activeEditor);
            if (!editorWidget) {
                return this.quickOpenService.pick([{ label: nls.localize('noEditor', "No text editor active at this time") }]);
            }
            if (!isWritableCodeEditor(editorWidget)) {
                return this.quickOpenService.pick([{ label: nls.localize('noWritableCodeEditor', "The active code editor is read-only.") }]);
            }
            var textModel = editorWidget.getModel();
            var EOLOptions = [
                { label: nlsEOLLF, eol: editorCommon_1.EndOfLineSequence.LF },
                { label: nlsEOLCRLF, eol: editorCommon_1.EndOfLineSequence.CRLF },
            ];
            var selectedIndex = (textModel && textModel.getEOL() === '\n') ? 0 : 1;
            return this.quickOpenService.pick(EOLOptions, { placeHolder: nls.localize('pickEndOfLine', "Select End of Line Sequence"), autoFocus: { autoFocusIndex: selectedIndex } }).then(function (eol) {
                if (eol) {
                    activeEditor = _this.editorService.getActiveEditor();
                    var editorWidget_1 = codeEditorService_1.getCodeEditor(activeEditor);
                    if (editorWidget_1 && isWritableCodeEditor(editorWidget_1)) {
                        var textModel_3 = editorWidget_1.getModel();
                        textModel_3.setEOL(eol.eol);
                    }
                }
            });
        };
        ChangeEOLAction.ID = 'workbench.action.editor.changeEOL';
        ChangeEOLAction.LABEL = nls.localize('changeEndOfLine', "Change End of Line Sequence");
        ChangeEOLAction = __decorate([
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, quickOpen_1.IQuickOpenService)
        ], ChangeEOLAction);
        return ChangeEOLAction;
    }(actions_1.Action));
    exports.ChangeEOLAction = ChangeEOLAction;
    var ChangeEncodingAction = (function (_super) {
        __extends(ChangeEncodingAction, _super);
        function ChangeEncodingAction(actionId, actionLabel, editorService, quickOpenService, configurationService, fileService) {
            var _this = _super.call(this, actionId, actionLabel) || this;
            _this.editorService = editorService;
            _this.quickOpenService = quickOpenService;
            _this.configurationService = configurationService;
            _this.fileService = fileService;
            return _this;
        }
        ChangeEncodingAction.prototype.run = function () {
            var _this = this;
            var activeEditor = this.editorService.getActiveEditor();
            if (!codeEditorService_1.getCodeEditor(activeEditor) || !activeEditor.input) {
                return this.quickOpenService.pick([{ label: nls.localize('noEditor', "No text editor active at this time") }]);
            }
            var encodingSupport = toEditorWithEncodingSupport(activeEditor.input);
            if (!encodingSupport) {
                return this.quickOpenService.pick([{ label: nls.localize('noFileEditor', "No file active at this time") }]);
            }
            var pickActionPromise;
            var saveWithEncodingPick;
            var reopenWithEncodingPick;
            if (platform_1.language === platform_1.LANGUAGE_DEFAULT) {
                saveWithEncodingPick = { label: nls.localize('saveWithEncoding', "Save with Encoding") };
                reopenWithEncodingPick = { label: nls.localize('reopenWithEncoding', "Reopen with Encoding") };
            }
            else {
                saveWithEncodingPick = { label: nls.localize('saveWithEncoding', "Save with Encoding"), detail: 'Save with Encoding', };
                reopenWithEncodingPick = { label: nls.localize('reopenWithEncoding', "Reopen with Encoding"), detail: 'Reopen with Encoding' };
            }
            if (encodingSupport instanceof untitledEditorInput_1.UntitledEditorInput) {
                pickActionPromise = winjs_base_1.TPromise.as(saveWithEncodingPick);
            }
            else if (!isWritableBaseEditor(activeEditor)) {
                pickActionPromise = winjs_base_1.TPromise.as(reopenWithEncodingPick);
            }
            else {
                pickActionPromise = this.quickOpenService.pick([reopenWithEncodingPick, saveWithEncodingPick], { placeHolder: nls.localize('pickAction', "Select Action"), matchOnDetail: true });
            }
            return pickActionPromise.then(function (action) {
                if (!action) {
                    return void 0;
                }
                var resource = editor_1.toResource(activeEditor.input, { filter: ['file', 'untitled'], supportSideBySide: true });
                return winjs_base_1.TPromise.timeout(50 /* quick open is sensitive to being opened so soon after another */)
                    .then(function () {
                    if (!resource || resource.scheme !== 'file') {
                        return winjs_base_1.TPromise.as(null); // encoding detection only possible for file resources
                    }
                    return _this.fileService.resolveContent(resource, { autoGuessEncoding: true, acceptTextOnly: true }).then(function (content) { return content.encoding; }, function (err) { return null; });
                })
                    .then(function (guessedEncoding) {
                    var isReopenWithEncoding = (action === reopenWithEncodingPick);
                    var configuredEncoding = _this.configurationService.lookup('files.encoding', { resource: resource }).value;
                    var directMatchIndex;
                    var aliasMatchIndex;
                    // All encodings are valid picks
                    var picks = Object.keys(files_1.SUPPORTED_ENCODINGS)
                        .sort(function (k1, k2) {
                        if (k1 === configuredEncoding) {
                            return -1;
                        }
                        else if (k2 === configuredEncoding) {
                            return 1;
                        }
                        return files_1.SUPPORTED_ENCODINGS[k1].order - files_1.SUPPORTED_ENCODINGS[k2].order;
                    })
                        .filter(function (k) {
                        if (k === guessedEncoding && guessedEncoding !== configuredEncoding) {
                            return false; // do not show encoding if it is the guessed encoding that does not match the configured
                        }
                        return !isReopenWithEncoding || !files_1.SUPPORTED_ENCODINGS[k].encodeOnly; // hide those that can only be used for encoding if we are about to decode
                    })
                        .map(function (key, index) {
                        if (key === encodingSupport.getEncoding()) {
                            directMatchIndex = index;
                        }
                        else if (files_1.SUPPORTED_ENCODINGS[key].alias === encodingSupport.getEncoding()) {
                            aliasMatchIndex = index;
                        }
                        return { id: key, label: files_1.SUPPORTED_ENCODINGS[key].labelLong };
                    });
                    // If we have a guessed encoding, show it first unless it matches the configured encoding
                    if (guessedEncoding && configuredEncoding !== guessedEncoding && files_1.SUPPORTED_ENCODINGS[guessedEncoding]) {
                        picks[0].separator = { border: true };
                        picks.unshift({ id: guessedEncoding, label: files_1.SUPPORTED_ENCODINGS[guessedEncoding].labelLong, description: nls.localize('guessedEncoding', "Guessed from content") });
                    }
                    return _this.quickOpenService.pick(picks, {
                        placeHolder: isReopenWithEncoding ? nls.localize('pickEncodingForReopen', "Select File Encoding to Reopen File") : nls.localize('pickEncodingForSave', "Select File Encoding to Save with"),
                        autoFocus: { autoFocusIndex: typeof directMatchIndex === 'number' ? directMatchIndex : typeof aliasMatchIndex === 'number' ? aliasMatchIndex : void 0 }
                    }).then(function (encoding) {
                        if (encoding) {
                            activeEditor = _this.editorService.getActiveEditor();
                            encodingSupport = toEditorWithEncodingSupport(activeEditor.input);
                            if (encodingSupport && encodingSupport.getEncoding() !== encoding.id) {
                                encodingSupport.setEncoding(encoding.id, isReopenWithEncoding ? editor_1.EncodingMode.Decode : editor_1.EncodingMode.Encode); // Set new encoding
                            }
                        }
                    });
                });
            });
        };
        ChangeEncodingAction.ID = 'workbench.action.editor.changeEncoding';
        ChangeEncodingAction.LABEL = nls.localize('changeEncoding', "Change File Encoding");
        ChangeEncodingAction = __decorate([
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, quickOpen_1.IQuickOpenService),
            __param(4, configuration_1.IWorkspaceConfigurationService),
            __param(5, files_1.IFileService)
        ], ChangeEncodingAction);
        return ChangeEncodingAction;
    }(actions_1.Action));
    exports.ChangeEncodingAction = ChangeEncodingAction;
});
//# sourceMappingURL=editorStatus.js.map