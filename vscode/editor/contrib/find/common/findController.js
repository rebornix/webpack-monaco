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
define(["require", "exports", "vs/nls", "vs/base/common/history", "vs/base/common/keyCodes", "vs/base/common/lifecycle", "vs/platform/contextkey/common/contextkey", "vs/editor/common/core/range", "vs/editor/common/core/selection", "vs/base/common/strings", "vs/editor/common/editorCommon", "vs/editor/common/editorCommonExtensions", "vs/editor/contrib/find/common/findModel", "vs/editor/contrib/find/common/findState", "vs/editor/contrib/find/common/find", "vs/editor/common/modes", "vs/base/common/async", "vs/editor/common/controller/cursorEvents", "vs/editor/common/editorContextKeys", "vs/platform/storage/common/storage", "vs/editor/common/model/textModelWithDecorations", "vs/platform/theme/common/colorRegistry", "vs/platform/theme/common/themeService"], function (require, exports, nls, history_1, keyCodes_1, lifecycle_1, contextkey_1, range_1, selection_1, strings, editorCommon, editorCommonExtensions_1, findModel_1, findState_1, find_1, modes_1, async_1, cursorEvents_1, editorContextKeys_1, storage_1, textModelWithDecorations_1, colorRegistry_1, themeService_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var FindStartFocusAction;
    (function (FindStartFocusAction) {
        FindStartFocusAction[FindStartFocusAction["NoFocusChange"] = 0] = "NoFocusChange";
        FindStartFocusAction[FindStartFocusAction["FocusFindInput"] = 1] = "FocusFindInput";
        FindStartFocusAction[FindStartFocusAction["FocusReplaceInput"] = 2] = "FocusReplaceInput";
    })(FindStartFocusAction = exports.FindStartFocusAction || (exports.FindStartFocusAction = {}));
    exports.CONTEXT_FIND_WIDGET_VISIBLE = new contextkey_1.RawContextKey('findWidgetVisible', false);
    exports.CONTEXT_FIND_WIDGET_NOT_VISIBLE = exports.CONTEXT_FIND_WIDGET_VISIBLE.toNegated();
    // Keep ContextKey use of 'Focussed' to not break when clauses
    exports.CONTEXT_FIND_INPUT_FOCUSED = new contextkey_1.RawContextKey('findInputFocussed', false);
    var CommonFindController = (function (_super) {
        __extends(CommonFindController, _super);
        function CommonFindController(editor, contextKeyService, storageService) {
            var _this = _super.call(this) || this;
            _this._editor = editor;
            _this._findWidgetVisible = exports.CONTEXT_FIND_WIDGET_VISIBLE.bindTo(contextKeyService);
            _this._storageService = storageService;
            _this._updateHistoryDelayer = new async_1.Delayer(500);
            _this._currentHistoryNavigator = new history_1.HistoryNavigator();
            _this._state = _this._register(new findState_1.FindReplaceState());
            _this.loadQueryState();
            _this._register(_this._state.addChangeListener(function (e) { return _this._onStateChanged(e); }));
            _this._model = null;
            _this._register(_this._editor.onDidChangeModel(function () {
                var shouldRestartFind = (_this._editor.getModel() && _this._state.isRevealed);
                _this.disposeModel();
                _this._state.change({
                    searchScope: null,
                    matchCase: _this._storageService.getBoolean('editor.matchCase', storage_1.StorageScope.WORKSPACE, false),
                    wholeWord: _this._storageService.getBoolean('editor.wholeWord', storage_1.StorageScope.WORKSPACE, false),
                    isRegex: _this._storageService.getBoolean('editor.isRegex', storage_1.StorageScope.WORKSPACE, false)
                }, false);
                if (shouldRestartFind) {
                    _this._start({
                        forceRevealReplace: false,
                        seedSearchStringFromSelection: false,
                        shouldFocus: 0 /* NoFocusChange */,
                        shouldAnimate: false,
                    });
                }
            }));
            return _this;
        }
        CommonFindController.get = function (editor) {
            return editor.getContribution(CommonFindController.ID);
        };
        CommonFindController.prototype.dispose = function () {
            this.disposeModel();
            _super.prototype.dispose.call(this);
        };
        CommonFindController.prototype.disposeModel = function () {
            if (this._model) {
                this._model.dispose();
                this._model = null;
            }
        };
        CommonFindController.prototype.getId = function () {
            return CommonFindController.ID;
        };
        CommonFindController.prototype._onStateChanged = function (e) {
            this.saveQueryState(e);
            if (e.updateHistory && e.searchString) {
                this._delayedUpdateHistory();
            }
            if (e.isRevealed) {
                if (this._state.isRevealed) {
                    this._findWidgetVisible.set(true);
                }
                else {
                    this._findWidgetVisible.reset();
                    this.disposeModel();
                }
            }
        };
        CommonFindController.prototype.saveQueryState = function (e) {
            if (e.isRegex && typeof this._state.isRegex !== 'undefined') {
                this._storageService.store('editor.isRegex', this._state.isRegex, storage_1.StorageScope.WORKSPACE);
            }
            if (e.wholeWord && typeof this._state.wholeWord !== 'undefined') {
                this._storageService.store('editor.wholeWord', this._state.wholeWord, storage_1.StorageScope.WORKSPACE);
            }
            if (e.matchCase && typeof this._state.matchCase !== 'undefined') {
                this._storageService.store('editor.matchCase', this._state.matchCase, storage_1.StorageScope.WORKSPACE);
            }
        };
        CommonFindController.prototype.loadQueryState = function () {
            this._state.change({
                matchCase: this._storageService.getBoolean('editor.matchCase', storage_1.StorageScope.WORKSPACE, this._state.matchCase),
                wholeWord: this._storageService.getBoolean('editor.wholeWord', storage_1.StorageScope.WORKSPACE, this._state.wholeWord),
                isRegex: this._storageService.getBoolean('editor.isRegex', storage_1.StorageScope.WORKSPACE, this._state.isRegex)
            }, false);
        };
        CommonFindController.prototype._delayedUpdateHistory = function () {
            this._updateHistoryDelayer.trigger(this._updateHistory.bind(this));
        };
        CommonFindController.prototype._updateHistory = function () {
            if (this._state.searchString) {
                this._currentHistoryNavigator.add(this._state.searchString);
            }
        };
        CommonFindController.prototype.getState = function () {
            return this._state;
        };
        CommonFindController.prototype.getHistory = function () {
            return this._currentHistoryNavigator;
        };
        CommonFindController.prototype.closeFindWidget = function () {
            this._state.change({
                isRevealed: false,
                searchScope: null
            }, false);
            this._editor.focus();
        };
        CommonFindController.prototype.toggleCaseSensitive = function () {
            this._state.change({ matchCase: !this._state.matchCase }, false);
        };
        CommonFindController.prototype.toggleWholeWords = function () {
            this._state.change({ wholeWord: !this._state.wholeWord }, false);
        };
        CommonFindController.prototype.toggleRegex = function () {
            this._state.change({ isRegex: !this._state.isRegex }, false);
        };
        CommonFindController.prototype.toggleSearchScope = function () {
            if (this._state.searchScope) {
                this._state.change({ searchScope: null }, true);
            }
            else {
                var selection = this._editor.getSelection();
                if (selection.endColumn === 1 && selection.endLineNumber > selection.startLineNumber) {
                    selection = selection.setEndPosition(selection.endLineNumber - 1, 1);
                }
                if (!selection.isEmpty()) {
                    this._state.change({ searchScope: selection }, true);
                }
            }
        };
        CommonFindController.prototype.setSearchString = function (searchString) {
            this._state.change({ searchString: searchString }, false);
        };
        CommonFindController.prototype.highlightFindOptions = function () {
            // overwritten in subclass
        };
        CommonFindController.prototype._start = function (opts) {
            this.disposeModel();
            if (!this._editor.getModel()) {
                // cannot do anything with an editor that doesn't have a model...
                return;
            }
            var stateChanges = {
                isRevealed: true
            };
            // Consider editor selection and overwrite the state with it
            if (opts.seedSearchStringFromSelection && this._editor.getConfiguration().contribInfo.find.seedSearchStringFromSelection) {
                var selectionSearchString = find_1.getSelectionSearchString(this._editor);
                if (selectionSearchString) {
                    if (this._state.isRegex) {
                        stateChanges.searchString = strings.escapeRegExpCharacters(selectionSearchString);
                    }
                    else {
                        stateChanges.searchString = selectionSearchString;
                    }
                }
            }
            // Overwrite isReplaceRevealed
            if (opts.forceRevealReplace) {
                stateChanges.isReplaceRevealed = true;
            }
            else if (!this._findWidgetVisible.get()) {
                stateChanges.isReplaceRevealed = false;
            }
            this._state.change(stateChanges, false);
            if (!this._model) {
                this._model = new findModel_1.FindModelBoundToEditorModel(this._editor, this._state);
            }
        };
        CommonFindController.prototype.start = function (opts) {
            this._start(opts);
        };
        CommonFindController.prototype.moveToNextMatch = function () {
            if (this._model) {
                this._model.moveToNextMatch();
                return true;
            }
            return false;
        };
        CommonFindController.prototype.moveToPrevMatch = function () {
            if (this._model) {
                this._model.moveToPrevMatch();
                return true;
            }
            return false;
        };
        CommonFindController.prototype.replace = function () {
            if (this._model) {
                this._model.replace();
                return true;
            }
            return false;
        };
        CommonFindController.prototype.replaceAll = function () {
            if (this._model) {
                this._model.replaceAll();
                return true;
            }
            return false;
        };
        CommonFindController.prototype.selectAllMatches = function () {
            if (this._model) {
                this._model.selectAllMatches();
                this._editor.focus();
                return true;
            }
            return false;
        };
        CommonFindController.prototype.showPreviousFindTerm = function () {
            var previousTerm = this._currentHistoryNavigator.previous();
            if (previousTerm) {
                this._state.change({ searchString: previousTerm }, false, false);
            }
            return true;
        };
        CommonFindController.prototype.showNextFindTerm = function () {
            var nextTerm = this._currentHistoryNavigator.next();
            if (nextTerm) {
                this._state.change({ searchString: nextTerm }, false, false);
            }
            return true;
        };
        CommonFindController.ID = 'editor.contrib.findController';
        CommonFindController = __decorate([
            __param(1, contextkey_1.IContextKeyService), __param(2, storage_1.IStorageService)
        ], CommonFindController);
        return CommonFindController;
    }(lifecycle_1.Disposable));
    exports.CommonFindController = CommonFindController;
    var StartFindAction = (function (_super) {
        __extends(StartFindAction, _super);
        function StartFindAction() {
            return _super.call(this, {
                id: findModel_1.FIND_IDS.StartFindAction,
                label: nls.localize('startFindAction', "Find"),
                alias: 'Find',
                precondition: null,
                kbOpts: {
                    kbExpr: null,
                    primary: 2048 /* CtrlCmd */ | 36 /* KEY_F */,
                    mac: {
                        primary: 2048 /* CtrlCmd */ | 36 /* KEY_F */,
                        secondary: [2048 /* CtrlCmd */ | 35 /* KEY_E */]
                    }
                }
            }) || this;
        }
        StartFindAction.prototype.run = function (accessor, editor) {
            var controller = CommonFindController.get(editor);
            if (controller) {
                controller.start({
                    forceRevealReplace: false,
                    seedSearchStringFromSelection: true,
                    shouldFocus: 1 /* FocusFindInput */,
                    shouldAnimate: true
                });
            }
        };
        StartFindAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], StartFindAction);
        return StartFindAction;
    }(editorCommonExtensions_1.EditorAction));
    exports.StartFindAction = StartFindAction;
    var MatchFindAction = (function (_super) {
        __extends(MatchFindAction, _super);
        function MatchFindAction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MatchFindAction.prototype.run = function (accessor, editor) {
            var controller = CommonFindController.get(editor);
            if (controller && !this._run(controller)) {
                controller.start({
                    forceRevealReplace: false,
                    seedSearchStringFromSelection: (controller.getState().searchString.length === 0),
                    shouldFocus: 0 /* NoFocusChange */,
                    shouldAnimate: true
                });
                this._run(controller);
            }
        };
        return MatchFindAction;
    }(editorCommonExtensions_1.EditorAction));
    exports.MatchFindAction = MatchFindAction;
    var NextMatchFindAction = (function (_super) {
        __extends(NextMatchFindAction, _super);
        function NextMatchFindAction() {
            return _super.call(this, {
                id: findModel_1.FIND_IDS.NextMatchFindAction,
                label: nls.localize('findNextMatchAction', "Find Next"),
                alias: 'Find Next',
                precondition: null,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.focus,
                    primary: 61 /* F3 */,
                    mac: { primary: 2048 /* CtrlCmd */ | 37 /* KEY_G */, secondary: [61 /* F3 */] }
                }
            }) || this;
        }
        NextMatchFindAction.prototype._run = function (controller) {
            return controller.moveToNextMatch();
        };
        NextMatchFindAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], NextMatchFindAction);
        return NextMatchFindAction;
    }(MatchFindAction));
    exports.NextMatchFindAction = NextMatchFindAction;
    var PreviousMatchFindAction = (function (_super) {
        __extends(PreviousMatchFindAction, _super);
        function PreviousMatchFindAction() {
            return _super.call(this, {
                id: findModel_1.FIND_IDS.PreviousMatchFindAction,
                label: nls.localize('findPreviousMatchAction', "Find Previous"),
                alias: 'Find Previous',
                precondition: null,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.focus,
                    primary: 1024 /* Shift */ | 61 /* F3 */,
                    mac: { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 37 /* KEY_G */, secondary: [1024 /* Shift */ | 61 /* F3 */] }
                }
            }) || this;
        }
        PreviousMatchFindAction.prototype._run = function (controller) {
            return controller.moveToPrevMatch();
        };
        PreviousMatchFindAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], PreviousMatchFindAction);
        return PreviousMatchFindAction;
    }(MatchFindAction));
    exports.PreviousMatchFindAction = PreviousMatchFindAction;
    var SelectionMatchFindAction = (function (_super) {
        __extends(SelectionMatchFindAction, _super);
        function SelectionMatchFindAction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SelectionMatchFindAction.prototype.run = function (accessor, editor) {
            var controller = CommonFindController.get(editor);
            if (!controller) {
                return;
            }
            var selectionSearchString = find_1.getSelectionSearchString(editor);
            if (selectionSearchString) {
                controller.setSearchString(selectionSearchString);
            }
            if (!this._run(controller)) {
                controller.start({
                    forceRevealReplace: false,
                    seedSearchStringFromSelection: false,
                    shouldFocus: 0 /* NoFocusChange */,
                    shouldAnimate: true
                });
                this._run(controller);
            }
        };
        return SelectionMatchFindAction;
    }(editorCommonExtensions_1.EditorAction));
    exports.SelectionMatchFindAction = SelectionMatchFindAction;
    var NextSelectionMatchFindAction = (function (_super) {
        __extends(NextSelectionMatchFindAction, _super);
        function NextSelectionMatchFindAction() {
            return _super.call(this, {
                id: findModel_1.FIND_IDS.NextSelectionMatchFindAction,
                label: nls.localize('nextSelectionMatchFindAction', "Find Next Selection"),
                alias: 'Find Next Selection',
                precondition: null,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.focus,
                    primary: 2048 /* CtrlCmd */ | 61 /* F3 */
                }
            }) || this;
        }
        NextSelectionMatchFindAction.prototype._run = function (controller) {
            return controller.moveToNextMatch();
        };
        NextSelectionMatchFindAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], NextSelectionMatchFindAction);
        return NextSelectionMatchFindAction;
    }(SelectionMatchFindAction));
    exports.NextSelectionMatchFindAction = NextSelectionMatchFindAction;
    var PreviousSelectionMatchFindAction = (function (_super) {
        __extends(PreviousSelectionMatchFindAction, _super);
        function PreviousSelectionMatchFindAction() {
            return _super.call(this, {
                id: findModel_1.FIND_IDS.PreviousSelectionMatchFindAction,
                label: nls.localize('previousSelectionMatchFindAction', "Find Previous Selection"),
                alias: 'Find Previous Selection',
                precondition: null,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.focus,
                    primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 61 /* F3 */
                }
            }) || this;
        }
        PreviousSelectionMatchFindAction.prototype._run = function (controller) {
            return controller.moveToPrevMatch();
        };
        PreviousSelectionMatchFindAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], PreviousSelectionMatchFindAction);
        return PreviousSelectionMatchFindAction;
    }(SelectionMatchFindAction));
    exports.PreviousSelectionMatchFindAction = PreviousSelectionMatchFindAction;
    var StartFindReplaceAction = (function (_super) {
        __extends(StartFindReplaceAction, _super);
        function StartFindReplaceAction() {
            return _super.call(this, {
                id: findModel_1.FIND_IDS.StartFindReplaceAction,
                label: nls.localize('startReplace', "Replace"),
                alias: 'Replace',
                precondition: null,
                kbOpts: {
                    kbExpr: null,
                    primary: 2048 /* CtrlCmd */ | 38 /* KEY_H */,
                    mac: { primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 36 /* KEY_F */ }
                }
            }) || this;
        }
        StartFindReplaceAction.prototype.run = function (accessor, editor) {
            if (editor.getConfiguration().readOnly) {
                return;
            }
            var controller = CommonFindController.get(editor);
            var currentSelection = editor.getSelection();
            // we only seed search string from selection when the current selection is single line and not empty.
            var seedSearchStringFromSelection = !currentSelection.isEmpty() &&
                currentSelection.startLineNumber === currentSelection.endLineNumber;
            var oldSearchString = controller.getState().searchString;
            // if the existing search string in find widget is empty and we don't seed search string from selection, it means the Find Input
            // is still empty, so we should focus the Find Input instead of Replace Input.
            var shouldFocus = (!!oldSearchString || seedSearchStringFromSelection) ?
                2 /* FocusReplaceInput */ : 1 /* FocusFindInput */;
            if (controller) {
                controller.start({
                    forceRevealReplace: true,
                    seedSearchStringFromSelection: seedSearchStringFromSelection,
                    shouldFocus: shouldFocus,
                    shouldAnimate: true
                });
            }
        };
        StartFindReplaceAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], StartFindReplaceAction);
        return StartFindReplaceAction;
    }(editorCommonExtensions_1.EditorAction));
    exports.StartFindReplaceAction = StartFindReplaceAction;
    function multiCursorFind(editor, input) {
        var controller = CommonFindController.get(editor);
        if (!controller) {
            return null;
        }
        var state = controller.getState();
        var searchText;
        var currentMatch;
        // In any case, if the find widget was ever opened, the options are taken from it
        var wholeWord = state.wholeWord;
        var matchCase = state.matchCase;
        // Find widget owns what we search for if:
        //  - focus is not in the editor (i.e. it is in the find widget)
        //  - and the search widget is visible
        //  - and the search string is non-empty
        if (!editor.isFocused() && state.isRevealed && state.searchString.length > 0) {
            // Find widget owns what is searched for
            searchText = state.searchString;
        }
        else {
            // Selection owns what is searched for
            var s = editor.getSelection();
            if (s.startLineNumber !== s.endLineNumber && !input.allowMultiline) {
                // multiline forbidden
                return null;
            }
            if (s.isEmpty()) {
                // selection is empty => expand to current word
                var word = editor.getModel().getWordAtPosition(s.getStartPosition());
                if (!word) {
                    return null;
                }
                searchText = word.word;
                currentMatch = new selection_1.Selection(s.startLineNumber, word.startColumn, s.startLineNumber, word.endColumn);
            }
            else {
                searchText = editor.getModel().getValueInRange(s).replace(/\r\n/g, '\n');
            }
            if (input.changeFindSearchString) {
                controller.setSearchString(searchText);
            }
        }
        if (input.highlightFindOptions) {
            controller.highlightFindOptions();
        }
        return {
            searchText: searchText,
            matchCase: matchCase,
            wholeWord: wholeWord,
            currentMatch: currentMatch
        };
    }
    var SelectNextFindMatchAction = (function (_super) {
        __extends(SelectNextFindMatchAction, _super);
        function SelectNextFindMatchAction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SelectNextFindMatchAction.prototype._getNextMatch = function (editor) {
            var r = multiCursorFind(editor, {
                changeFindSearchString: true,
                allowMultiline: true,
                highlightFindOptions: true
            });
            if (!r) {
                return null;
            }
            if (r.currentMatch) {
                return r.currentMatch;
            }
            var allSelections = editor.getSelections();
            var lastAddedSelection = allSelections[allSelections.length - 1];
            var nextMatch = editor.getModel().findNextMatch(r.searchText, lastAddedSelection.getEndPosition(), false, r.matchCase, r.wholeWord ? editor.getConfiguration().wordSeparators : null, false);
            if (!nextMatch) {
                return null;
            }
            return new selection_1.Selection(nextMatch.range.startLineNumber, nextMatch.range.startColumn, nextMatch.range.endLineNumber, nextMatch.range.endColumn);
        };
        return SelectNextFindMatchAction;
    }(editorCommonExtensions_1.EditorAction));
    exports.SelectNextFindMatchAction = SelectNextFindMatchAction;
    var SelectPreviousFindMatchAction = (function (_super) {
        __extends(SelectPreviousFindMatchAction, _super);
        function SelectPreviousFindMatchAction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SelectPreviousFindMatchAction.prototype._getPreviousMatch = function (editor) {
            var r = multiCursorFind(editor, {
                changeFindSearchString: true,
                allowMultiline: true,
                highlightFindOptions: true
            });
            if (!r) {
                return null;
            }
            if (r.currentMatch) {
                return r.currentMatch;
            }
            var allSelections = editor.getSelections();
            var lastAddedSelection = allSelections[allSelections.length - 1];
            var previousMatch = editor.getModel().findPreviousMatch(r.searchText, lastAddedSelection.getStartPosition(), false, r.matchCase, r.wholeWord ? editor.getConfiguration().wordSeparators : null, false);
            if (!previousMatch) {
                return null;
            }
            return new selection_1.Selection(previousMatch.range.startLineNumber, previousMatch.range.startColumn, previousMatch.range.endLineNumber, previousMatch.range.endColumn);
        };
        return SelectPreviousFindMatchAction;
    }(editorCommonExtensions_1.EditorAction));
    exports.SelectPreviousFindMatchAction = SelectPreviousFindMatchAction;
    var AddSelectionToNextFindMatchAction = (function (_super) {
        __extends(AddSelectionToNextFindMatchAction, _super);
        function AddSelectionToNextFindMatchAction() {
            return _super.call(this, {
                id: findModel_1.FIND_IDS.AddSelectionToNextFindMatchAction,
                label: nls.localize('addSelectionToNextFindMatch', "Add Selection To Next Find Match"),
                alias: 'Add Selection To Next Find Match',
                precondition: null,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.focus,
                    primary: 2048 /* CtrlCmd */ | 34 /* KEY_D */
                }
            }) || this;
        }
        AddSelectionToNextFindMatchAction.prototype.run = function (accessor, editor) {
            var allSelections = editor.getSelections();
            // If there are mulitple cursors, handle the case where they do not all select the same text.
            if (allSelections.length > 1) {
                var model = editor.getModel();
                var controller = CommonFindController.get(editor);
                if (!controller) {
                    return;
                }
                var findState = controller.getState();
                var caseSensitive = findState.matchCase;
                var selectionsContainSameText = true;
                var selectedText = model.getValueInRange(allSelections[0]);
                if (!caseSensitive) {
                    selectedText = selectedText.toLowerCase();
                }
                for (var i = 1, len = allSelections.length; i < len; i++) {
                    var selection = allSelections[i];
                    if (selection.isEmpty()) {
                        selectionsContainSameText = false;
                        break;
                    }
                    var thisSelectedText = model.getValueInRange(selection);
                    if (!caseSensitive) {
                        thisSelectedText = thisSelectedText.toLowerCase();
                    }
                    if (selectedText !== thisSelectedText) {
                        selectionsContainSameText = false;
                        break;
                    }
                }
                if (!selectionsContainSameText) {
                    var resultingSelections = [];
                    for (var i = 0, len = allSelections.length; i < len; i++) {
                        var selection = allSelections[i];
                        if (selection.isEmpty()) {
                            var word = editor.getModel().getWordAtPosition(selection.getStartPosition());
                            if (word) {
                                resultingSelections[i] = new selection_1.Selection(selection.startLineNumber, word.startColumn, selection.startLineNumber, word.endColumn);
                                continue;
                            }
                        }
                        resultingSelections[i] = selection;
                    }
                    editor.setSelections(resultingSelections);
                    return;
                }
            }
            var nextMatch = this._getNextMatch(editor);
            if (!nextMatch) {
                return;
            }
            editor.setSelections(allSelections.concat(nextMatch));
            editor.revealRangeInCenterIfOutsideViewport(nextMatch);
        };
        AddSelectionToNextFindMatchAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], AddSelectionToNextFindMatchAction);
        return AddSelectionToNextFindMatchAction;
    }(SelectNextFindMatchAction));
    exports.AddSelectionToNextFindMatchAction = AddSelectionToNextFindMatchAction;
    var AddSelectionToPreviousFindMatchAction = (function (_super) {
        __extends(AddSelectionToPreviousFindMatchAction, _super);
        function AddSelectionToPreviousFindMatchAction() {
            return _super.call(this, {
                id: findModel_1.FIND_IDS.AddSelectionToPreviousFindMatchAction,
                label: nls.localize('addSelectionToPreviousFindMatch', "Add Selection To Previous Find Match"),
                alias: 'Add Selection To Previous Find Match',
                precondition: null
            }) || this;
        }
        AddSelectionToPreviousFindMatchAction.prototype.run = function (accessor, editor) {
            var previousMatch = this._getPreviousMatch(editor);
            if (!previousMatch) {
                return;
            }
            var allSelections = editor.getSelections();
            editor.setSelections(allSelections.concat(previousMatch));
            editor.revealRangeInCenterIfOutsideViewport(previousMatch);
        };
        AddSelectionToPreviousFindMatchAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], AddSelectionToPreviousFindMatchAction);
        return AddSelectionToPreviousFindMatchAction;
    }(SelectPreviousFindMatchAction));
    exports.AddSelectionToPreviousFindMatchAction = AddSelectionToPreviousFindMatchAction;
    var MoveSelectionToNextFindMatchAction = (function (_super) {
        __extends(MoveSelectionToNextFindMatchAction, _super);
        function MoveSelectionToNextFindMatchAction() {
            return _super.call(this, {
                id: findModel_1.FIND_IDS.MoveSelectionToNextFindMatchAction,
                label: nls.localize('moveSelectionToNextFindMatch', "Move Last Selection To Next Find Match"),
                alias: 'Move Last Selection To Next Find Match',
                precondition: null,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.focus,
                    primary: keyCodes_1.KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 34 /* KEY_D */)
                }
            }) || this;
        }
        MoveSelectionToNextFindMatchAction.prototype.run = function (accessor, editor) {
            var nextMatch = this._getNextMatch(editor);
            if (!nextMatch) {
                return;
            }
            var allSelections = editor.getSelections();
            editor.setSelections(allSelections.slice(0, allSelections.length - 1).concat(nextMatch));
            editor.revealRangeInCenterIfOutsideViewport(nextMatch);
        };
        MoveSelectionToNextFindMatchAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], MoveSelectionToNextFindMatchAction);
        return MoveSelectionToNextFindMatchAction;
    }(SelectNextFindMatchAction));
    exports.MoveSelectionToNextFindMatchAction = MoveSelectionToNextFindMatchAction;
    var MoveSelectionToPreviousFindMatchAction = (function (_super) {
        __extends(MoveSelectionToPreviousFindMatchAction, _super);
        function MoveSelectionToPreviousFindMatchAction() {
            return _super.call(this, {
                id: findModel_1.FIND_IDS.MoveSelectionToPreviousFindMatchAction,
                label: nls.localize('moveSelectionToPreviousFindMatch', "Move Last Selection To Previous Find Match"),
                alias: 'Move Last Selection To Previous Find Match',
                precondition: null
            }) || this;
        }
        MoveSelectionToPreviousFindMatchAction.prototype.run = function (accessor, editor) {
            var previousMatch = this._getPreviousMatch(editor);
            if (!previousMatch) {
                return;
            }
            var allSelections = editor.getSelections();
            editor.setSelections(allSelections.slice(0, allSelections.length - 1).concat(previousMatch));
            editor.revealRangeInCenterIfOutsideViewport(previousMatch);
        };
        MoveSelectionToPreviousFindMatchAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], MoveSelectionToPreviousFindMatchAction);
        return MoveSelectionToPreviousFindMatchAction;
    }(SelectPreviousFindMatchAction));
    exports.MoveSelectionToPreviousFindMatchAction = MoveSelectionToPreviousFindMatchAction;
    var AbstractSelectHighlightsAction = (function (_super) {
        __extends(AbstractSelectHighlightsAction, _super);
        function AbstractSelectHighlightsAction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AbstractSelectHighlightsAction.prototype.run = function (accessor, editor) {
            var controller = CommonFindController.get(editor);
            if (!controller) {
                return null;
            }
            var matches = null;
            var findState = controller.getState();
            if (findState.isRevealed && findState.isRegex && findState.searchString.length > 0) {
                matches = editor.getModel().findMatches(findState.searchString, true, findState.isRegex, findState.matchCase, findState.wholeWord ? editor.getConfiguration().wordSeparators : null, false).map(function (m) { return m.range; });
            }
            else {
                var r = multiCursorFind(editor, {
                    changeFindSearchString: true,
                    allowMultiline: true,
                    highlightFindOptions: true
                });
                if (!r) {
                    return;
                }
                matches = editor.getModel().findMatches(r.searchText, true, false, r.matchCase, r.wholeWord ? editor.getConfiguration().wordSeparators : null, false).map(function (m) { return m.range; });
            }
            if (matches.length > 0) {
                var editorSelection = editor.getSelection();
                for (var i = 0, len = matches.length; i < len; i++) {
                    var match = matches[i];
                    var intersection = match.intersectRanges(editorSelection);
                    if (intersection) {
                        // bingo!
                        matches.splice(i, 1);
                        matches.unshift(match);
                        break;
                    }
                }
                editor.setSelections(matches.map(function (m) { return new selection_1.Selection(m.startLineNumber, m.startColumn, m.endLineNumber, m.endColumn); }));
            }
        };
        return AbstractSelectHighlightsAction;
    }(editorCommonExtensions_1.EditorAction));
    exports.AbstractSelectHighlightsAction = AbstractSelectHighlightsAction;
    var SelectHighlightsAction = (function (_super) {
        __extends(SelectHighlightsAction, _super);
        function SelectHighlightsAction() {
            return _super.call(this, {
                id: 'editor.action.selectHighlights',
                label: nls.localize('selectAllOccurrencesOfFindMatch', "Select All Occurrences of Find Match"),
                alias: 'Select All Occurrences of Find Match',
                precondition: null,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.focus,
                    primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 42 /* KEY_L */
                }
            }) || this;
        }
        SelectHighlightsAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], SelectHighlightsAction);
        return SelectHighlightsAction;
    }(AbstractSelectHighlightsAction));
    exports.SelectHighlightsAction = SelectHighlightsAction;
    var CompatChangeAll = (function (_super) {
        __extends(CompatChangeAll, _super);
        function CompatChangeAll() {
            return _super.call(this, {
                id: 'editor.action.changeAll',
                label: nls.localize('changeAll.label', "Change All Occurrences"),
                alias: 'Change All Occurrences',
                precondition: editorContextKeys_1.EditorContextKeys.writable,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 2048 /* CtrlCmd */ | 60 /* F2 */
                },
                menuOpts: {
                    group: '1_modification',
                    order: 1.2
                }
            }) || this;
        }
        CompatChangeAll = __decorate([
            editorCommonExtensions_1.editorAction
        ], CompatChangeAll);
        return CompatChangeAll;
    }(AbstractSelectHighlightsAction));
    exports.CompatChangeAll = CompatChangeAll;
    var SelectionHighlighterState = (function () {
        function SelectionHighlighterState(lastWordUnderCursor, searchText, matchCase, wordSeparators) {
            this.searchText = searchText;
            this.matchCase = matchCase;
            this.wordSeparators = wordSeparators;
        }
        /**
         * Everything equals except for `lastWordUnderCursor`
         */
        SelectionHighlighterState.softEquals = function (a, b) {
            if (!a && !b) {
                return true;
            }
            if (!a || !b) {
                return false;
            }
            return (a.searchText === b.searchText
                && a.matchCase === b.matchCase
                && a.wordSeparators === b.wordSeparators);
        };
        return SelectionHighlighterState;
    }());
    var SelectionHighlighter = (function (_super) {
        __extends(SelectionHighlighter, _super);
        function SelectionHighlighter(editor) {
            var _this = _super.call(this) || this;
            _this.editor = editor;
            _this._isEnabled = editor.getConfiguration().contribInfo.selectionHighlight;
            _this.decorations = [];
            _this.updateSoon = _this._register(new async_1.RunOnceScheduler(function () { return _this._update(); }, 300));
            _this.state = null;
            _this._register(editor.onDidChangeConfiguration(function (e) {
                _this._isEnabled = editor.getConfiguration().contribInfo.selectionHighlight;
            }));
            _this._register(editor.onDidChangeCursorSelection(function (e) {
                if (!_this._isEnabled) {
                    // Early exit if nothing needs to be done!
                    // Leave some form of early exit check here if you wish to continue being a cursor position change listener ;)
                    return;
                }
                if (e.selection.isEmpty()) {
                    if (e.reason === cursorEvents_1.CursorChangeReason.Explicit) {
                        if (_this.state && (!_this.state.lastWordUnderCursor || !_this.state.lastWordUnderCursor.containsPosition(e.selection.getStartPosition()))) {
                            // no longer valid
                            _this._setState(null);
                        }
                        _this.updateSoon.schedule();
                    }
                    else {
                        _this._setState(null);
                    }
                }
                else {
                    _this._update();
                }
            }));
            _this._register(editor.onDidChangeModel(function (e) {
                _this._setState(null);
            }));
            _this._register(CommonFindController.get(editor).getState().addChangeListener(function (e) {
                _this._update();
            }));
            return _this;
        }
        SelectionHighlighter_1 = SelectionHighlighter;
        SelectionHighlighter.prototype.getId = function () {
            return SelectionHighlighter_1.ID;
        };
        SelectionHighlighter.prototype._update = function () {
            this._setState(SelectionHighlighter_1._createState(this._isEnabled, this.editor));
        };
        SelectionHighlighter._createState = function (isEnabled, editor) {
            var model = editor.getModel();
            if (!model) {
                return null;
            }
            var config = editor.getConfiguration();
            var lastWordUnderCursor = null;
            if (!isEnabled) {
                return null;
            }
            var r = multiCursorFind(editor, {
                changeFindSearchString: false,
                allowMultiline: false,
                highlightFindOptions: false
            });
            if (!r) {
                return null;
            }
            var hasFindOccurrences = modes_1.DocumentHighlightProviderRegistry.has(model);
            if (r.currentMatch) {
                // This is an empty selection
                if (hasFindOccurrences) {
                    // Do not interfere with semantic word highlighting in the no selection case
                    return null;
                }
                if (!config.contribInfo.occurrencesHighlight) {
                    return null;
                }
                lastWordUnderCursor = r.currentMatch;
            }
            if (/^[ \t]+$/.test(r.searchText)) {
                // whitespace only selection
                return null;
            }
            if (r.searchText.length > 200) {
                // very long selection
                return null;
            }
            var controller = CommonFindController.get(editor);
            if (!controller) {
                return null;
            }
            var findState = controller.getState();
            var caseSensitive = findState.matchCase;
            var selections = editor.getSelections();
            var firstSelectedText = model.getValueInRange(selections[0]);
            if (!caseSensitive) {
                firstSelectedText = firstSelectedText.toLowerCase();
            }
            for (var i = 1; i < selections.length; i++) {
                var selectedText = model.getValueInRange(selections[i]);
                if (!caseSensitive) {
                    selectedText = selectedText.toLowerCase();
                }
                if (firstSelectedText !== selectedText) {
                    // not all selections have the same text
                    return null;
                }
            }
            return new SelectionHighlighterState(lastWordUnderCursor, r.searchText, r.matchCase, r.wholeWord ? editor.getConfiguration().wordSeparators : null);
        };
        SelectionHighlighter.prototype._setState = function (state) {
            if (SelectionHighlighterState.softEquals(this.state, state)) {
                this.state = state;
                return;
            }
            this.state = state;
            if (!this.state) {
                if (this.decorations.length > 0) {
                    this.decorations = this.editor.deltaDecorations(this.decorations, []);
                }
                return;
            }
            var model = this.editor.getModel();
            var hasFindOccurrences = modes_1.DocumentHighlightProviderRegistry.has(model);
            var allMatches = model.findMatches(this.state.searchText, true, false, this.state.matchCase, this.state.wordSeparators, false).map(function (m) { return m.range; });
            allMatches.sort(range_1.Range.compareRangesUsingStarts);
            var selections = this.editor.getSelections();
            selections.sort(range_1.Range.compareRangesUsingStarts);
            // do not overlap with selection (issue #64 and #512)
            var matches = [];
            for (var i = 0, j = 0, len = allMatches.length, lenJ = selections.length; i < len;) {
                var match = allMatches[i];
                if (j >= lenJ) {
                    // finished all editor selections
                    matches.push(match);
                    i++;
                }
                else {
                    var cmp = range_1.Range.compareRangesUsingStarts(match, selections[j]);
                    if (cmp < 0) {
                        // match is before sel
                        matches.push(match);
                        i++;
                    }
                    else if (cmp > 0) {
                        // sel is before match
                        j++;
                    }
                    else {
                        // sel is equal to match
                        i++;
                        j++;
                    }
                }
            }
            var decorations = matches.map(function (r) {
                return {
                    range: r,
                    // Show in overviewRuler only if model has no semantic highlighting
                    options: (hasFindOccurrences ? SelectionHighlighter_1._SELECTION_HIGHLIGHT : SelectionHighlighter_1._SELECTION_HIGHLIGHT_OVERVIEW)
                };
            });
            this.decorations = this.editor.deltaDecorations(this.decorations, decorations);
        };
        SelectionHighlighter.prototype.dispose = function () {
            this._setState(null);
            _super.prototype.dispose.call(this);
        };
        SelectionHighlighter.ID = 'editor.contrib.selectionHighlighter';
        SelectionHighlighter._SELECTION_HIGHLIGHT_OVERVIEW = textModelWithDecorations_1.ModelDecorationOptions.register({
            stickiness: editorCommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
            className: 'selectionHighlight',
            overviewRuler: {
                color: themeService_1.themeColorFromId(colorRegistry_1.editorSelectionHighlight),
                darkColor: themeService_1.themeColorFromId(colorRegistry_1.editorSelectionHighlight),
                position: editorCommon.OverviewRulerLane.Center
            }
        });
        SelectionHighlighter._SELECTION_HIGHLIGHT = textModelWithDecorations_1.ModelDecorationOptions.register({
            stickiness: editorCommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
            className: 'selectionHighlight',
        });
        SelectionHighlighter = SelectionHighlighter_1 = __decorate([
            editorCommonExtensions_1.commonEditorContribution
        ], SelectionHighlighter);
        return SelectionHighlighter;
        var SelectionHighlighter_1;
    }(lifecycle_1.Disposable));
    exports.SelectionHighlighter = SelectionHighlighter;
    var ShowNextFindTermAction = (function (_super) {
        __extends(ShowNextFindTermAction, _super);
        function ShowNextFindTermAction() {
            return _super.call(this, {
                id: findModel_1.FIND_IDS.ShowNextFindTermAction,
                label: nls.localize('showNextFindTermAction', "Show Next Find Term"),
                alias: 'Show Next Find Term',
                precondition: exports.CONTEXT_FIND_WIDGET_VISIBLE,
                kbOpts: {
                    weight: editorCommonExtensions_1.CommonEditorRegistry.commandWeight(5),
                    kbExpr: contextkey_1.ContextKeyExpr.and(exports.CONTEXT_FIND_INPUT_FOCUSED, editorContextKeys_1.EditorContextKeys.focus),
                    primary: findModel_1.ShowNextFindTermKeybinding.primary,
                    mac: findModel_1.ShowNextFindTermKeybinding.mac,
                    win: findModel_1.ShowNextFindTermKeybinding.win,
                    linux: findModel_1.ShowNextFindTermKeybinding.linux
                }
            }) || this;
        }
        ShowNextFindTermAction.prototype._run = function (controller) {
            return controller.showNextFindTerm();
        };
        ShowNextFindTermAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], ShowNextFindTermAction);
        return ShowNextFindTermAction;
    }(MatchFindAction));
    exports.ShowNextFindTermAction = ShowNextFindTermAction;
    var ShpwPreviousFindTermAction = (function (_super) {
        __extends(ShpwPreviousFindTermAction, _super);
        function ShpwPreviousFindTermAction() {
            return _super.call(this, {
                id: findModel_1.FIND_IDS.ShowPreviousFindTermAction,
                label: nls.localize('showPreviousFindTermAction', "Show Previous Find Term"),
                alias: 'Find Show Previous Find Term',
                precondition: exports.CONTEXT_FIND_WIDGET_VISIBLE,
                kbOpts: {
                    weight: editorCommonExtensions_1.CommonEditorRegistry.commandWeight(5),
                    kbExpr: contextkey_1.ContextKeyExpr.and(exports.CONTEXT_FIND_INPUT_FOCUSED, editorContextKeys_1.EditorContextKeys.focus),
                    primary: findModel_1.ShowPreviousFindTermKeybinding.primary,
                    mac: findModel_1.ShowPreviousFindTermKeybinding.mac,
                    win: findModel_1.ShowPreviousFindTermKeybinding.win,
                    linux: findModel_1.ShowPreviousFindTermKeybinding.linux
                }
            }) || this;
        }
        ShpwPreviousFindTermAction.prototype._run = function (controller) {
            return controller.showPreviousFindTerm();
        };
        ShpwPreviousFindTermAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], ShpwPreviousFindTermAction);
        return ShpwPreviousFindTermAction;
    }(MatchFindAction));
    exports.ShpwPreviousFindTermAction = ShpwPreviousFindTermAction;
    var FindCommand = editorCommonExtensions_1.EditorCommand.bindToContribution(CommonFindController.get);
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand(new FindCommand({
        id: findModel_1.FIND_IDS.CloseFindWidgetCommand,
        precondition: exports.CONTEXT_FIND_WIDGET_VISIBLE,
        handler: function (x) { return x.closeFindWidget(); },
        kbOpts: {
            weight: editorCommonExtensions_1.CommonEditorRegistry.commandWeight(5),
            kbExpr: editorContextKeys_1.EditorContextKeys.focus,
            primary: 9 /* Escape */,
            secondary: [1024 /* Shift */ | 9 /* Escape */]
        }
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand(new FindCommand({
        id: findModel_1.FIND_IDS.ToggleCaseSensitiveCommand,
        precondition: null,
        handler: function (x) { return x.toggleCaseSensitive(); },
        kbOpts: {
            weight: editorCommonExtensions_1.CommonEditorRegistry.commandWeight(5),
            kbExpr: editorContextKeys_1.EditorContextKeys.focus,
            primary: findModel_1.ToggleCaseSensitiveKeybinding.primary,
            mac: findModel_1.ToggleCaseSensitiveKeybinding.mac,
            win: findModel_1.ToggleCaseSensitiveKeybinding.win,
            linux: findModel_1.ToggleCaseSensitiveKeybinding.linux
        }
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand(new FindCommand({
        id: findModel_1.FIND_IDS.ToggleWholeWordCommand,
        precondition: null,
        handler: function (x) { return x.toggleWholeWords(); },
        kbOpts: {
            weight: editorCommonExtensions_1.CommonEditorRegistry.commandWeight(5),
            kbExpr: editorContextKeys_1.EditorContextKeys.focus,
            primary: findModel_1.ToggleWholeWordKeybinding.primary,
            mac: findModel_1.ToggleWholeWordKeybinding.mac,
            win: findModel_1.ToggleWholeWordKeybinding.win,
            linux: findModel_1.ToggleWholeWordKeybinding.linux
        }
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand(new FindCommand({
        id: findModel_1.FIND_IDS.ToggleRegexCommand,
        precondition: null,
        handler: function (x) { return x.toggleRegex(); },
        kbOpts: {
            weight: editorCommonExtensions_1.CommonEditorRegistry.commandWeight(5),
            kbExpr: editorContextKeys_1.EditorContextKeys.focus,
            primary: findModel_1.ToggleRegexKeybinding.primary,
            mac: findModel_1.ToggleRegexKeybinding.mac,
            win: findModel_1.ToggleRegexKeybinding.win,
            linux: findModel_1.ToggleRegexKeybinding.linux
        }
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand(new FindCommand({
        id: findModel_1.FIND_IDS.ToggleSearchScopeCommand,
        precondition: null,
        handler: function (x) { return x.toggleSearchScope(); },
        kbOpts: {
            weight: editorCommonExtensions_1.CommonEditorRegistry.commandWeight(5),
            kbExpr: editorContextKeys_1.EditorContextKeys.focus,
            primary: findModel_1.ToggleSearchScopeKeybinding.primary,
            mac: findModel_1.ToggleSearchScopeKeybinding.mac,
            win: findModel_1.ToggleSearchScopeKeybinding.win,
            linux: findModel_1.ToggleSearchScopeKeybinding.linux
        }
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand(new FindCommand({
        id: findModel_1.FIND_IDS.ReplaceOneAction,
        precondition: exports.CONTEXT_FIND_WIDGET_VISIBLE,
        handler: function (x) { return x.replace(); },
        kbOpts: {
            weight: editorCommonExtensions_1.CommonEditorRegistry.commandWeight(5),
            kbExpr: editorContextKeys_1.EditorContextKeys.focus,
            primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 22 /* KEY_1 */
        }
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand(new FindCommand({
        id: findModel_1.FIND_IDS.ReplaceAllAction,
        precondition: exports.CONTEXT_FIND_WIDGET_VISIBLE,
        handler: function (x) { return x.replaceAll(); },
        kbOpts: {
            weight: editorCommonExtensions_1.CommonEditorRegistry.commandWeight(5),
            kbExpr: editorContextKeys_1.EditorContextKeys.focus,
            primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 3 /* Enter */
        }
    }));
    editorCommonExtensions_1.CommonEditorRegistry.registerEditorCommand(new FindCommand({
        id: findModel_1.FIND_IDS.SelectAllMatchesAction,
        precondition: exports.CONTEXT_FIND_WIDGET_VISIBLE,
        handler: function (x) { return x.selectAllMatches(); },
        kbOpts: {
            weight: editorCommonExtensions_1.CommonEditorRegistry.commandWeight(5),
            kbExpr: editorContextKeys_1.EditorContextKeys.focus,
            primary: 512 /* Alt */ | 3 /* Enter */
        }
    }));
});
//# sourceMappingURL=findController.js.map