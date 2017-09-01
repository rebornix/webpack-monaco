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
define(["require", "exports", "vs/nls", "vs/base/common/lifecycle", "vs/editor/common/core/position", "vs/editor/common/core/selection", "vs/base/common/async", "vs/editor/common/editorCommon", "vs/editor/common/editorCommonExtensions", "vs/editor/common/editorContextKeys", "vs/platform/theme/common/themeService", "vs/editor/common/view/editorColorRegistry", "vs/editor/common/model/textModelWithDecorations"], function (require, exports, nls, lifecycle_1, position_1, selection_1, async_1, editorCommon, editorCommonExtensions_1, editorContextKeys_1, themeService_1, editorColorRegistry_1, textModelWithDecorations_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var SelectBracketAction = (function (_super) {
        __extends(SelectBracketAction, _super);
        function SelectBracketAction() {
            return _super.call(this, {
                id: 'editor.action.jumpToBracket',
                label: nls.localize('smartSelect.jumpBracket', "Go to Bracket"),
                alias: 'Go to Bracket',
                precondition: null,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 88 /* US_BACKSLASH */
                }
            }) || this;
        }
        SelectBracketAction.prototype.run = function (accessor, editor) {
            var controller = BracketMatchingController.get(editor);
            if (!controller) {
                return;
            }
            controller.jumpToBracket();
        };
        SelectBracketAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], SelectBracketAction);
        return SelectBracketAction;
    }(editorCommonExtensions_1.EditorAction));
    var BracketsData = (function () {
        function BracketsData(position, brackets) {
            this.position = position;
            this.brackets = brackets;
        }
        return BracketsData;
    }());
    var BracketMatchingController = (function (_super) {
        __extends(BracketMatchingController, _super);
        function BracketMatchingController(editor) {
            var _this = _super.call(this) || this;
            _this._editor = editor;
            _this._lastBracketsData = [];
            _this._lastVersionId = 0;
            _this._decorations = [];
            _this._updateBracketsSoon = _this._register(new async_1.RunOnceScheduler(function () { return _this._updateBrackets(); }, 50));
            _this._matchBrackets = _this._editor.getConfiguration().contribInfo.matchBrackets;
            _this._updateBracketsSoon.schedule();
            _this._register(editor.onDidChangeCursorPosition(function (e) {
                if (!_this._matchBrackets) {
                    // Early exit if nothing needs to be done!
                    // Leave some form of early exit check here if you wish to continue being a cursor position change listener ;)
                    return;
                }
                _this._updateBracketsSoon.schedule();
            }));
            _this._register(editor.onDidChangeModel(function (e) { _this._decorations = []; _this._updateBracketsSoon.schedule(); }));
            _this._register(editor.onDidChangeConfiguration(function (e) {
                _this._matchBrackets = _this._editor.getConfiguration().contribInfo.matchBrackets;
                if (!_this._matchBrackets && _this._decorations.length > 0) {
                    // Remove existing decorations if bracket matching is off
                    _this._decorations = _this._editor.deltaDecorations(_this._decorations, []);
                }
                _this._updateBracketsSoon.schedule();
            }));
            return _this;
        }
        BracketMatchingController_1 = BracketMatchingController;
        BracketMatchingController.get = function (editor) {
            return editor.getContribution(BracketMatchingController_1.ID);
        };
        BracketMatchingController.prototype.getId = function () {
            return BracketMatchingController_1.ID;
        };
        BracketMatchingController.prototype.jumpToBracket = function () {
            var model = this._editor.getModel();
            if (!model) {
                return;
            }
            var newSelections = this._editor.getSelections().map(function (selection) {
                var position = selection.getStartPosition();
                // find matching brackets if position is on a bracket
                var brackets = model.matchBracket(position);
                var newCursorPosition = null;
                if (brackets) {
                    if (brackets[0].containsPosition(position)) {
                        newCursorPosition = brackets[1].getStartPosition();
                    }
                    else if (brackets[1].containsPosition(position)) {
                        newCursorPosition = brackets[0].getStartPosition();
                    }
                }
                else {
                    // find the next bracket if the position isn't on a matching bracket
                    var nextBracket = model.findNextBracket(position);
                    if (nextBracket && nextBracket.range) {
                        newCursorPosition = nextBracket.range.getStartPosition();
                    }
                }
                if (newCursorPosition) {
                    return new selection_1.Selection(newCursorPosition.lineNumber, newCursorPosition.column, newCursorPosition.lineNumber, newCursorPosition.column);
                }
                return new selection_1.Selection(position.lineNumber, position.column, position.lineNumber, position.column);
            });
            this._editor.setSelections(newSelections);
        };
        BracketMatchingController.prototype._updateBrackets = function () {
            if (!this._matchBrackets) {
                return;
            }
            this._recomputeBrackets();
            var newDecorations = [], newDecorationsLen = 0;
            for (var i = 0, len = this._lastBracketsData.length; i < len; i++) {
                var brackets = this._lastBracketsData[i].brackets;
                if (brackets) {
                    newDecorations[newDecorationsLen++] = { range: brackets[0], options: BracketMatchingController_1._DECORATION_OPTIONS };
                    newDecorations[newDecorationsLen++] = { range: brackets[1], options: BracketMatchingController_1._DECORATION_OPTIONS };
                }
            }
            this._decorations = this._editor.deltaDecorations(this._decorations, newDecorations);
        };
        BracketMatchingController.prototype._recomputeBrackets = function () {
            var model = this._editor.getModel();
            if (!model) {
                // no model => no brackets!
                this._lastBracketsData = [];
                this._lastVersionId = 0;
                return;
            }
            var versionId = model.getVersionId();
            var previousData = [];
            if (this._lastVersionId === versionId) {
                // use the previous data only if the model is at the same version id
                previousData = this._lastBracketsData;
            }
            var selections = this._editor.getSelections();
            var positions = [], positionsLen = 0;
            for (var i = 0, len = selections.length; i < len; i++) {
                var selection = selections[i];
                if (selection.isEmpty()) {
                    // will bracket match a cursor only if the selection is collapsed
                    positions[positionsLen++] = selection.getStartPosition();
                }
            }
            // sort positions for `previousData` cache hits
            if (positions.length > 1) {
                positions.sort(position_1.Position.compare);
            }
            var newData = [], newDataLen = 0;
            var previousIndex = 0, previousLen = previousData.length;
            for (var i = 0, len = positions.length; i < len; i++) {
                var position = positions[i];
                while (previousIndex < previousLen && previousData[previousIndex].position.isBefore(position)) {
                    previousIndex++;
                }
                if (previousIndex < previousLen && previousData[previousIndex].position.equals(position)) {
                    newData[newDataLen++] = previousData[previousIndex];
                }
                else {
                    var brackets = model.matchBracket(position);
                    newData[newDataLen++] = new BracketsData(position, brackets);
                }
            }
            this._lastBracketsData = newData;
            this._lastVersionId = versionId;
        };
        BracketMatchingController.ID = 'editor.contrib.bracketMatchingController';
        BracketMatchingController._DECORATION_OPTIONS = textModelWithDecorations_1.ModelDecorationOptions.register({
            stickiness: editorCommon.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
            className: 'bracket-match'
        });
        BracketMatchingController = BracketMatchingController_1 = __decorate([
            editorCommonExtensions_1.commonEditorContribution
        ], BracketMatchingController);
        return BracketMatchingController;
        var BracketMatchingController_1;
    }(lifecycle_1.Disposable));
    exports.BracketMatchingController = BracketMatchingController;
    themeService_1.registerThemingParticipant(function (theme, collector) {
        var bracketMatchBackground = theme.getColor(editorColorRegistry_1.editorBracketMatchBackground);
        if (bracketMatchBackground) {
            collector.addRule(".monaco-editor .bracket-match { background-color: " + bracketMatchBackground + "; }");
        }
        var bracketMatchBorder = theme.getColor(editorColorRegistry_1.editorBracketMatchBorder);
        if (bracketMatchBorder) {
            collector.addRule(".monaco-editor .bracket-match { border: 1px solid " + bracketMatchBorder + "; }");
        }
    });
});
//# sourceMappingURL=bracketMatching.js.map