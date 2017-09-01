/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/// <amd-dependency path="vs/css!./folding" />
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
define(["require", "exports", "vs/nls", "vs/base/common/types", "vs/base/browser/dom", "vs/base/common/async", "vs/base/common/keyCodes", "vs/base/common/lifecycle", "vs/editor/common/core/range", "vs/editor/common/editorCommonExtensions", "vs/editor/browser/editorBrowser", "vs/editor/browser/editorBrowserExtensions", "vs/editor/contrib/folding/common/foldingModel", "vs/editor/contrib/folding/common/indentFoldStrategy", "vs/editor/contrib/folding/common/folding", "vs/editor/common/editorContextKeys", "vs/css!./folding"], function (require, exports, nls, types, dom, async_1, keyCodes_1, lifecycle_1, range_1, editorCommonExtensions_1, editorBrowser_1, editorBrowserExtensions_1, foldingModel_1, indentFoldStrategy_1, folding_1, editorContextKeys_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var FoldingController = (function () {
        function FoldingController(editor) {
            var _this = this;
            this.editor = editor;
            this._isEnabled = this.editor.getConfiguration().contribInfo.folding;
            this._showFoldingControls = this.editor.getConfiguration().contribInfo.showFoldingControls;
            this.globalToDispose = [];
            this.localToDispose = [];
            this.decorations = [];
            this.computeToken = 0;
            this.globalToDispose.push(this.editor.onDidChangeModel(function () { return _this.onModelChanged(); }));
            this.globalToDispose.push(this.editor.onDidChangeConfiguration(function (e) {
                var oldIsEnabled = _this._isEnabled;
                _this._isEnabled = _this.editor.getConfiguration().contribInfo.folding;
                if (oldIsEnabled !== _this._isEnabled) {
                    _this.onModelChanged();
                }
                var oldShowFoldingControls = _this._showFoldingControls;
                _this._showFoldingControls = _this.editor.getConfiguration().contribInfo.showFoldingControls;
                if (oldShowFoldingControls !== _this._showFoldingControls) {
                    _this.updateHideFoldIconClass();
                }
            }));
            this.onModelChanged();
        }
        FoldingController_1 = FoldingController;
        FoldingController.get = function (editor) {
            return editor.getContribution(folding_1.ID);
        };
        FoldingController.prototype.getId = function () {
            return folding_1.ID;
        };
        FoldingController.prototype.dispose = function () {
            this.cleanState();
            this.globalToDispose = lifecycle_1.dispose(this.globalToDispose);
        };
        FoldingController.prototype.updateHideFoldIconClass = function () {
            var domNode = this.editor.getDomNode();
            if (domNode) {
                dom.toggleClass(domNode, 'alwaysShowFoldIcons', this._showFoldingControls === 'always');
            }
        };
        /**
         * Store view state.
         */
        FoldingController.prototype.saveViewState = function () {
            var model = this.editor.getModel();
            if (!model) {
                return {};
            }
            var collapsedRegions = [];
            this.decorations.forEach(function (d) {
                if (d.isCollapsed) {
                    var range = d.getDecorationRange(model);
                    if (range) {
                        collapsedRegions.push({ startLineNumber: range.startLineNumber, endLineNumber: range.endLineNumber, indent: d.indent, isCollapsed: true });
                    }
                }
            });
            return { collapsedRegions: collapsedRegions, lineCount: model.getLineCount() };
        };
        /**
         * Restore view state.
         */
        FoldingController.prototype.restoreViewState = function (state) {
            var _this = this;
            var model = this.editor.getModel();
            if (!model) {
                return;
            }
            if (!this._isEnabled) {
                return;
            }
            if (!state || !Array.isArray(state.collapsedRegions) || state.collapsedRegions.length === 0 || state.lineCount !== model.getLineCount()) {
                return;
            }
            var newFolded = state.collapsedRegions;
            if (this.decorations.length > 0) {
                var hasChanges_1 = false;
                var i_1 = 0;
                this.editor.changeDecorations(function (changeAccessor) {
                    _this.decorations.forEach(function (d) {
                        if (i_1 === newFolded.length || d.startLineNumber < newFolded[i_1].startLineNumber) {
                            if (d.isCollapsed) {
                                d.setCollapsed(false, changeAccessor);
                                hasChanges_1 = true;
                            }
                        }
                        else if (d.startLineNumber === newFolded[i_1].startLineNumber) {
                            if (!d.isCollapsed) {
                                d.setCollapsed(true, changeAccessor);
                                hasChanges_1 = true;
                            }
                            i_1++;
                        }
                        else {
                            return; // folding regions doesn't match, don't try to restore
                        }
                    });
                });
                if (hasChanges_1) {
                    this.updateHiddenAreas(void 0);
                }
            }
        };
        FoldingController.prototype.cleanState = function () {
            this.localToDispose = lifecycle_1.dispose(this.localToDispose);
        };
        FoldingController.prototype.applyRegions = function (regions) {
            var _this = this;
            var model = this.editor.getModel();
            if (!model) {
                return;
            }
            var updateHiddenRegions = false;
            regions = indentFoldStrategy_1.limitByIndent(regions, FoldingController_1.MAX_FOLDING_REGIONS).sort(function (r1, r2) { return r1.startLineNumber - r2.startLineNumber; });
            this.editor.changeDecorations(function (changeAccessor) {
                var newDecorations = [];
                var k = 0, i = 0;
                while (i < _this.decorations.length && k < regions.length) {
                    var dec = _this.decorations[i];
                    var decRange = dec.getDecorationRange(model);
                    if (!decRange) {
                        updateHiddenRegions = updateHiddenRegions || dec.isCollapsed;
                        dec.dispose(changeAccessor);
                        i++;
                    }
                    else {
                        while (k < regions.length && decRange.startLineNumber > regions[k].startLineNumber) {
                            var region = regions[k];
                            updateHiddenRegions = updateHiddenRegions || region.isCollapsed;
                            newDecorations.push(new foldingModel_1.CollapsibleRegion(region, model, changeAccessor));
                            k++;
                        }
                        if (k < regions.length) {
                            var currRange = regions[k];
                            if (decRange.startLineNumber < currRange.startLineNumber) {
                                updateHiddenRegions = updateHiddenRegions || dec.isCollapsed;
                                dec.dispose(changeAccessor);
                                i++;
                            }
                            else if (decRange.startLineNumber === currRange.startLineNumber) {
                                if (dec.isCollapsed && (dec.startLineNumber !== currRange.startLineNumber || dec.endLineNumber !== currRange.endLineNumber)) {
                                    updateHiddenRegions = true;
                                }
                                currRange.isCollapsed = dec.isCollapsed; // preserve collapse state
                                dec.update(currRange, model, changeAccessor);
                                newDecorations.push(dec);
                                i++;
                                k++;
                            }
                        }
                    }
                }
                while (i < _this.decorations.length) {
                    var dec = _this.decorations[i];
                    updateHiddenRegions = updateHiddenRegions || dec.isCollapsed;
                    dec.dispose(changeAccessor);
                    i++;
                }
                while (k < regions.length) {
                    var region = regions[k];
                    updateHiddenRegions = updateHiddenRegions || region.isCollapsed;
                    newDecorations.push(new foldingModel_1.CollapsibleRegion(region, model, changeAccessor));
                    k++;
                }
                _this.decorations = newDecorations;
            });
            if (updateHiddenRegions) {
                this.updateHiddenAreas();
            }
        };
        FoldingController.prototype.onModelChanged = function () {
            var _this = this;
            this.cleanState();
            this.updateHideFoldIconClass();
            var model = this.editor.getModel();
            if (!this._isEnabled || !model) {
                return;
            }
            this.computeAndApplyCollapsibleRegions();
            this.contentChangedScheduler = new async_1.RunOnceScheduler(function () { return _this.computeAndApplyCollapsibleRegions(); }, 200);
            this.cursorChangedScheduler = new async_1.RunOnceScheduler(function () { return _this.revealCursor(); }, 200);
            this.localToDispose.push(this.contentChangedScheduler);
            this.localToDispose.push(this.cursorChangedScheduler);
            this.localToDispose.push(this.editor.onDidChangeModelContent(function (e) { return _this.contentChangedScheduler.schedule(); }));
            this.localToDispose.push(this.editor.onDidChangeCursorPosition(function (e) {
                if (!_this._isEnabled) {
                    // Early exit if nothing needs to be done!
                    // Leave some form of early exit check here if you wish to continue being a cursor position change listener ;)
                    return;
                }
                _this.cursorChangedScheduler.schedule();
            }));
            this.localToDispose.push(this.editor.onMouseDown(function (e) { return _this.onEditorMouseDown(e); }));
            this.localToDispose.push(this.editor.onMouseUp(function (e) { return _this.onEditorMouseUp(e); }));
            this.localToDispose.push({ dispose: function () { return _this.disposeDecorations(); } });
        };
        FoldingController.prototype.computeAndApplyCollapsibleRegions = function () {
            var model = this.editor.getModel();
            this.applyRegions(model ? indentFoldStrategy_1.computeRanges(model) : []);
        };
        FoldingController.prototype.disposeDecorations = function () {
            var _this = this;
            this.editor.changeDecorations(function (changeAccessor) {
                _this.decorations.forEach(function (dec) { return dec.dispose(changeAccessor); });
            });
            this.decorations = [];
            this.editor.setHiddenAreas([]);
        };
        FoldingController.prototype.revealCursor = function () {
            var _this = this;
            var model = this.editor.getModel();
            if (!model) {
                return;
            }
            var hasChanges = false;
            var selections = this.editor.getSelections();
            this.editor.changeDecorations(function (changeAccessor) {
                return _this.decorations.forEach(function (dec) {
                    if (dec.isCollapsed) {
                        var decRange = dec.getDecorationRange(model);
                        if (decRange) {
                            for (var _i = 0, selections_1 = selections; _i < selections_1.length; _i++) {
                                var selection = selections_1[_i];
                                // reveal if cursor in in one of the collapsed line (not the first)
                                if (decRange.startLineNumber < selection.selectionStartLineNumber && selection.selectionStartLineNumber <= decRange.endLineNumber) {
                                    dec.setCollapsed(false, changeAccessor);
                                    hasChanges = true;
                                    break;
                                }
                            }
                        }
                    }
                });
            });
            if (hasChanges) {
                this.updateHiddenAreas(this.editor.getPosition().lineNumber);
            }
        };
        FoldingController.prototype.onEditorMouseDown = function (e) {
            this.mouseDownInfo = null;
            if (this.decorations.length === 0) {
                return;
            }
            var range = e.target.range;
            if (!range) {
                return;
            }
            if (!e.event.leftButton) {
                return;
            }
            var model = this.editor.getModel();
            var iconClicked = false;
            switch (e.target.type) {
                case editorBrowser_1.MouseTargetType.GUTTER_LINE_DECORATIONS:
                    iconClicked = true;
                    break;
                case editorBrowser_1.MouseTargetType.CONTENT_EMPTY:
                case editorBrowser_1.MouseTargetType.CONTENT_TEXT:
                    if (range.startColumn === model.getLineMaxColumn(range.startLineNumber)) {
                        break;
                    }
                    return;
                default:
                    return;
            }
            this.mouseDownInfo = { lineNumber: range.startLineNumber, iconClicked: iconClicked };
        };
        FoldingController.prototype.onEditorMouseUp = function (e) {
            var _this = this;
            if (!this.mouseDownInfo) {
                return;
            }
            var lineNumber = this.mouseDownInfo.lineNumber;
            var iconClicked = this.mouseDownInfo.iconClicked;
            var range = e.target.range;
            if (!range || range.startLineNumber !== lineNumber) {
                return;
            }
            var model = this.editor.getModel();
            if (iconClicked) {
                if (e.target.type !== editorBrowser_1.MouseTargetType.GUTTER_LINE_DECORATIONS) {
                    return;
                }
            }
            else {
                if (range.startColumn !== model.getLineMaxColumn(lineNumber)) {
                    return;
                }
            }
            this.editor.changeDecorations(function (changeAccessor) {
                for (var i = 0; i < _this.decorations.length; i++) {
                    var dec = _this.decorations[i];
                    var decRange = dec.getDecorationRange(model);
                    if (decRange && decRange.startLineNumber === lineNumber) {
                        if (iconClicked || dec.isCollapsed) {
                            dec.setCollapsed(!dec.isCollapsed, changeAccessor);
                            _this.updateHiddenAreas(lineNumber);
                        }
                        return;
                    }
                }
            });
        };
        FoldingController.prototype.updateHiddenAreas = function (focusLine) {
            var model = this.editor.getModel();
            var selections = this.editor.getSelections();
            var updateSelections = false;
            var hiddenAreas = [];
            this.decorations.filter(function (dec) { return dec.isCollapsed; }).forEach(function (dec) {
                var decRange = dec.getDecorationRange(model);
                if (!decRange) {
                    return;
                }
                var isLineHidden = function (line) { return line > decRange.startLineNumber && line <= decRange.endLineNumber; };
                hiddenAreas.push(new range_1.Range(decRange.startLineNumber + 1, 1, decRange.endLineNumber, 1));
                selections.forEach(function (selection, i) {
                    if (isLineHidden(selection.getStartPosition().lineNumber)) {
                        selections[i] = selection = selection.setStartPosition(decRange.startLineNumber, model.getLineMaxColumn(decRange.startLineNumber));
                        updateSelections = true;
                    }
                    if (isLineHidden(selection.getEndPosition().lineNumber)) {
                        selections[i] = selection.setEndPosition(decRange.startLineNumber, model.getLineMaxColumn(decRange.startLineNumber));
                        updateSelections = true;
                    }
                });
            });
            if (updateSelections) {
                this.editor.setSelections(selections);
            }
            this.editor.setHiddenAreas(hiddenAreas);
            if (focusLine) {
                this.editor.revealPositionInCenterIfOutsideViewport({ lineNumber: focusLine, column: 1 });
            }
        };
        FoldingController.prototype.unfold = function (levels) {
            var _this = this;
            var model = this.editor.getModel();
            var hasChanges = false;
            var selections = this.editor.getSelections();
            var selectionsHasChanged = false;
            selections.forEach(function (selection, index) {
                var toUnfold = foldingModel_1.getCollapsibleRegionsToUnfoldAtLine(_this.decorations, model, selection.startLineNumber, levels);
                if (toUnfold.length > 0) {
                    toUnfold.forEach(function (collapsibleRegion, index) {
                        _this.editor.changeDecorations(function (changeAccessor) {
                            collapsibleRegion.setCollapsed(false, changeAccessor);
                            hasChanges = true;
                        });
                    });
                    if (!foldingModel_1.doesLineBelongsToCollapsibleRegion(toUnfold[0].foldingRange, selection.startLineNumber)) {
                        var lineNumber = toUnfold[0].startLineNumber, column = model.getLineMaxColumn(toUnfold[0].startLineNumber);
                        selections[index] = selection.setEndPosition(lineNumber, column).setStartPosition(lineNumber, column);
                        selectionsHasChanged = true;
                    }
                }
            });
            if (selectionsHasChanged) {
                this.editor.setSelections(selections);
            }
            if (hasChanges) {
                this.updateHiddenAreas(selections[0].startLineNumber);
            }
        };
        FoldingController.prototype.fold = function (levels, up) {
            var _this = this;
            var hasChanges = false;
            var selections = this.editor.getSelections();
            selections.forEach(function (selection) {
                var lineNumber = selection.startLineNumber;
                var toFold = foldingModel_1.getCollapsibleRegionsToFoldAtLine(_this.decorations, _this.editor.getModel(), lineNumber, levels, up);
                toFold.forEach(function (collapsibleRegion) { return _this.editor.changeDecorations(function (changeAccessor) {
                    collapsibleRegion.setCollapsed(true, changeAccessor);
                    hasChanges = true;
                }); });
            });
            if (hasChanges) {
                this.updateHiddenAreas(selections[0].startLineNumber);
            }
        };
        FoldingController.prototype.foldUnfoldRecursively = function (isFold) {
            var _this = this;
            var hasChanges = false;
            var model = this.editor.getModel();
            var selections = this.editor.getSelections();
            selections.forEach(function (selection) {
                var lineNumber = selection.startLineNumber;
                var endLineNumber;
                var decToFoldUnfold = [];
                for (var i = 0, len = _this.decorations.length; i < len; i++) {
                    var dec = _this.decorations[i];
                    var decRange = dec.getDecorationRange(model);
                    if (!decRange) {
                        continue;
                    }
                    if (decRange.startLineNumber >= lineNumber && (decRange.endLineNumber <= endLineNumber || typeof endLineNumber === 'undefined')) {
                        //Protect against cursor not being in decoration and lower decoration folding/unfolding
                        if (decRange.startLineNumber !== lineNumber && typeof endLineNumber === 'undefined') {
                            return;
                        }
                        endLineNumber = endLineNumber || decRange.endLineNumber;
                        decToFoldUnfold.push(dec);
                    }
                }
                ;
                if (decToFoldUnfold.length > 0) {
                    decToFoldUnfold.forEach(function (dec) {
                        _this.editor.changeDecorations(function (changeAccessor) {
                            dec.setCollapsed(isFold, changeAccessor);
                            hasChanges = true;
                        });
                    });
                }
            });
            if (hasChanges) {
                this.updateHiddenAreas(selections[0].startLineNumber);
            }
        };
        FoldingController.prototype.foldAll = function () {
            this.changeAll(true);
        };
        FoldingController.prototype.unfoldAll = function () {
            this.changeAll(false);
        };
        FoldingController.prototype.changeAll = function (collapse) {
            var _this = this;
            if (this.decorations.length > 0) {
                var hasChanges_2 = true;
                this.editor.changeDecorations(function (changeAccessor) {
                    _this.decorations.forEach(function (d) {
                        if (collapse !== d.isCollapsed) {
                            d.setCollapsed(collapse, changeAccessor);
                            hasChanges_2 = true;
                        }
                    });
                });
                if (hasChanges_2) {
                    this.updateHiddenAreas(this.editor.getPosition().lineNumber);
                }
            }
        };
        FoldingController.prototype.foldLevel = function (foldLevel, selectedLineNumbers) {
            var _this = this;
            var model = this.editor.getModel();
            var foldingRegionStack = [model.getFullModelRange()]; // sentinel
            var hasChanges = false;
            this.editor.changeDecorations(function (changeAccessor) {
                _this.decorations.forEach(function (dec) {
                    var decRange = dec.getDecorationRange(model);
                    if (decRange) {
                        while (!range_1.Range.containsRange(foldingRegionStack[foldingRegionStack.length - 1], decRange)) {
                            foldingRegionStack.pop();
                        }
                        foldingRegionStack.push(decRange);
                        if (foldingRegionStack.length === foldLevel + 1 && !dec.isCollapsed && !selectedLineNumbers.some(function (lineNumber) { return decRange.startLineNumber < lineNumber && lineNumber <= decRange.endLineNumber; })) {
                            dec.setCollapsed(true, changeAccessor);
                            hasChanges = true;
                        }
                    }
                });
            });
            if (hasChanges) {
                this.updateHiddenAreas(selectedLineNumbers[0]);
            }
        };
        FoldingController.MAX_FOLDING_REGIONS = 5000;
        FoldingController = FoldingController_1 = __decorate([
            editorBrowserExtensions_1.editorContribution
        ], FoldingController);
        return FoldingController;
        var FoldingController_1;
    }());
    exports.FoldingController = FoldingController;
    var FoldingAction = (function (_super) {
        __extends(FoldingAction, _super);
        function FoldingAction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FoldingAction.prototype.runEditorCommand = function (accessor, editor, args) {
            var foldingController = FoldingController.get(editor);
            if (!foldingController) {
                return;
            }
            this.reportTelemetry(accessor, editor);
            this.invoke(foldingController, editor, args);
        };
        FoldingAction.prototype.run = function (accessor, editor) {
        };
        return FoldingAction;
    }(editorCommonExtensions_1.EditorAction));
    function foldingArgumentsConstraint(args) {
        if (!types.isUndefined(args)) {
            if (!types.isObject(args)) {
                return false;
            }
            var foldingArgs = args;
            if (!types.isUndefined(foldingArgs.levels) && !types.isNumber(foldingArgs.levels)) {
                return false;
            }
            if (!types.isUndefined(foldingArgs.direction) && !types.isString(foldingArgs.direction)) {
                return false;
            }
        }
        return true;
    }
    var UnfoldAction = (function (_super) {
        __extends(UnfoldAction, _super);
        function UnfoldAction() {
            return _super.call(this, {
                id: 'editor.unfold',
                label: nls.localize('unfoldAction.label', "Unfold"),
                alias: 'Unfold',
                precondition: null,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 89 /* US_CLOSE_SQUARE_BRACKET */,
                    mac: {
                        primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 89 /* US_CLOSE_SQUARE_BRACKET */
                    }
                },
                description: {
                    description: 'Unfold the content in the editor',
                    args: [
                        {
                            name: 'Unfold editor argument',
                            description: "Property-value pairs that can be passed through this argument:\n\t\t\t\t\t\t\t* 'level': Number of levels to unfold\n\t\t\t\t\t\t",
                            constraint: foldingArgumentsConstraint
                        }
                    ]
                }
            }) || this;
        }
        UnfoldAction.prototype.invoke = function (foldingController, editor, args) {
            foldingController.unfold(args ? args.levels || 1 : 1);
        };
        UnfoldAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], UnfoldAction);
        return UnfoldAction;
    }(FoldingAction));
    var UnFoldRecursivelyAction = (function (_super) {
        __extends(UnFoldRecursivelyAction, _super);
        function UnFoldRecursivelyAction() {
            return _super.call(this, {
                id: 'editor.unfoldRecursively',
                label: nls.localize('unFoldRecursivelyAction.label', "Unfold Recursively"),
                alias: 'Unfold Recursively',
                precondition: null,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: keyCodes_1.KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 89 /* US_CLOSE_SQUARE_BRACKET */)
                }
            }) || this;
        }
        UnFoldRecursivelyAction.prototype.invoke = function (foldingController, editor, args) {
            foldingController.foldUnfoldRecursively(false);
        };
        UnFoldRecursivelyAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], UnFoldRecursivelyAction);
        return UnFoldRecursivelyAction;
    }(FoldingAction));
    var FoldAction = (function (_super) {
        __extends(FoldAction, _super);
        function FoldAction() {
            return _super.call(this, {
                id: 'editor.fold',
                label: nls.localize('foldAction.label', "Fold"),
                alias: 'Fold',
                precondition: null,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 87 /* US_OPEN_SQUARE_BRACKET */,
                    mac: {
                        primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 87 /* US_OPEN_SQUARE_BRACKET */
                    }
                },
                description: {
                    description: 'Fold the content in the editor',
                    args: [
                        {
                            name: 'Fold editor argument',
                            description: "Property-value pairs that can be passed through this argument:\n\t\t\t\t\t\t\t* 'levels': Number of levels to fold\n\t\t\t\t\t\t\t* 'up': If 'true', folds given number of levels up otherwise folds down\n\t\t\t\t\t\t",
                            constraint: foldingArgumentsConstraint
                        }
                    ]
                }
            }) || this;
        }
        FoldAction.prototype.invoke = function (foldingController, editor, args) {
            args = args ? args : { levels: 1, direction: 'up' };
            foldingController.fold(args.levels || 1, args.direction === 'up');
        };
        FoldAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], FoldAction);
        return FoldAction;
    }(FoldingAction));
    var FoldRecursivelyAction = (function (_super) {
        __extends(FoldRecursivelyAction, _super);
        function FoldRecursivelyAction() {
            return _super.call(this, {
                id: 'editor.foldRecursively',
                label: nls.localize('foldRecursivelyAction.label', "Fold Recursively"),
                alias: 'Fold Recursively',
                precondition: null,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: keyCodes_1.KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 87 /* US_OPEN_SQUARE_BRACKET */)
                }
            }) || this;
        }
        FoldRecursivelyAction.prototype.invoke = function (foldingController, editor) {
            foldingController.foldUnfoldRecursively(true);
        };
        FoldRecursivelyAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], FoldRecursivelyAction);
        return FoldRecursivelyAction;
    }(FoldingAction));
    var FoldAllAction = (function (_super) {
        __extends(FoldAllAction, _super);
        function FoldAllAction() {
            return _super.call(this, {
                id: 'editor.foldAll',
                label: nls.localize('foldAllAction.label', "Fold All"),
                alias: 'Fold All',
                precondition: null,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: keyCodes_1.KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 21 /* KEY_0 */)
                }
            }) || this;
        }
        FoldAllAction.prototype.invoke = function (foldingController, editor) {
            foldingController.foldAll();
        };
        FoldAllAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], FoldAllAction);
        return FoldAllAction;
    }(FoldingAction));
    var UnfoldAllAction = (function (_super) {
        __extends(UnfoldAllAction, _super);
        function UnfoldAllAction() {
            return _super.call(this, {
                id: 'editor.unfoldAll',
                label: nls.localize('unfoldAllAction.label', "Unfold All"),
                alias: 'Unfold All',
                precondition: null,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: keyCodes_1.KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 40 /* KEY_J */)
                }
            }) || this;
        }
        UnfoldAllAction.prototype.invoke = function (foldingController, editor) {
            foldingController.unfoldAll();
        };
        UnfoldAllAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], UnfoldAllAction);
        return UnfoldAllAction;
    }(FoldingAction));
    var FoldLevelAction = (function (_super) {
        __extends(FoldLevelAction, _super);
        function FoldLevelAction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FoldLevelAction.prototype.getFoldingLevel = function () {
            return parseInt(this.id.substr(FoldLevelAction.ID_PREFIX.length));
        };
        FoldLevelAction.prototype.getSelectedLines = function (editor) {
            return editor.getSelections().map(function (s) { return s.startLineNumber; });
        };
        FoldLevelAction.prototype.invoke = function (foldingController, editor) {
            foldingController.foldLevel(this.getFoldingLevel(), this.getSelectedLines(editor));
        };
        FoldLevelAction.ID_PREFIX = 'editor.foldLevel';
        FoldLevelAction.ID = function (level) { return FoldLevelAction.ID_PREFIX + level; };
        return FoldLevelAction;
    }(FoldingAction));
    for (var i = 1; i <= 9; i++) {
        editorCommonExtensions_1.CommonEditorRegistry.registerEditorAction(new FoldLevelAction({
            id: FoldLevelAction.ID(i),
            label: nls.localize('foldLevelAction.label', "Fold Level {0}", i),
            alias: "Fold Level " + i,
            precondition: null,
            kbOpts: {
                kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                primary: keyCodes_1.KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | (21 /* KEY_0 */ + i))
            }
        }));
    }
    ;
});
//# sourceMappingURL=folding.js.map