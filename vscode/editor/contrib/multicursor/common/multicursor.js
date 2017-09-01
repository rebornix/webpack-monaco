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
define(["require", "exports", "vs/nls", "vs/editor/common/editorContextKeys", "vs/editor/common/editorCommonExtensions", "vs/editor/common/core/selection", "vs/editor/common/controller/cursorEvents", "vs/editor/common/controller/cursorMoveCommands", "vs/editor/common/controller/cursorCommon"], function (require, exports, nls, editorContextKeys_1, editorCommonExtensions_1, selection_1, cursorEvents_1, cursorMoveCommands_1, cursorCommon_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var InsertCursorAbove = (function (_super) {
        __extends(InsertCursorAbove, _super);
        function InsertCursorAbove() {
            return _super.call(this, {
                id: 'editor.action.insertCursorAbove',
                label: nls.localize('mutlicursor.insertAbove', "Add Cursor Above"),
                alias: 'Add Cursor Above',
                precondition: null,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 16 /* UpArrow */,
                    linux: {
                        primary: 1024 /* Shift */ | 512 /* Alt */ | 16 /* UpArrow */,
                        secondary: [2048 /* CtrlCmd */ | 1024 /* Shift */ | 16 /* UpArrow */]
                    }
                }
            }) || this;
        }
        InsertCursorAbove.prototype.run = function (accessor, editor, args) {
            var cursors = editor._getCursors();
            var context = cursors.context;
            if (context.config.readOnly) {
                return;
            }
            context.model.pushStackElement();
            cursors.setStates(args.source, cursorEvents_1.CursorChangeReason.Explicit, cursorCommon_1.CursorState.ensureInEditableRange(context, cursorMoveCommands_1.CursorMoveCommands.addCursorUp(context, cursors.getAll())));
            cursors.reveal(true, 1 /* TopMost */);
        };
        InsertCursorAbove = __decorate([
            editorCommonExtensions_1.editorAction
        ], InsertCursorAbove);
        return InsertCursorAbove;
    }(editorCommonExtensions_1.EditorAction));
    exports.InsertCursorAbove = InsertCursorAbove;
    var InsertCursorBelow = (function (_super) {
        __extends(InsertCursorBelow, _super);
        function InsertCursorBelow() {
            return _super.call(this, {
                id: 'editor.action.insertCursorBelow',
                label: nls.localize('mutlicursor.insertBelow', "Add Cursor Below"),
                alias: 'Add Cursor Below',
                precondition: null,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 18 /* DownArrow */,
                    linux: {
                        primary: 1024 /* Shift */ | 512 /* Alt */ | 18 /* DownArrow */,
                        secondary: [2048 /* CtrlCmd */ | 1024 /* Shift */ | 18 /* DownArrow */]
                    }
                }
            }) || this;
        }
        InsertCursorBelow.prototype.run = function (accessor, editor, args) {
            var cursors = editor._getCursors();
            var context = cursors.context;
            if (context.config.readOnly) {
                return;
            }
            context.model.pushStackElement();
            cursors.setStates(args.source, cursorEvents_1.CursorChangeReason.Explicit, cursorCommon_1.CursorState.ensureInEditableRange(context, cursorMoveCommands_1.CursorMoveCommands.addCursorDown(context, cursors.getAll())));
            cursors.reveal(true, 2 /* BottomMost */);
        };
        InsertCursorBelow = __decorate([
            editorCommonExtensions_1.editorAction
        ], InsertCursorBelow);
        return InsertCursorBelow;
    }(editorCommonExtensions_1.EditorAction));
    exports.InsertCursorBelow = InsertCursorBelow;
    var InsertCursorAtEndOfEachLineSelected = (function (_super) {
        __extends(InsertCursorAtEndOfEachLineSelected, _super);
        function InsertCursorAtEndOfEachLineSelected() {
            return _super.call(this, {
                id: 'editor.action.insertCursorAtEndOfEachLineSelected',
                label: nls.localize('mutlicursor.insertAtEndOfEachLineSelected', "Add Cursors to Line Ends"),
                alias: 'Add Cursors to Line Ends',
                precondition: null,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 1024 /* Shift */ | 512 /* Alt */ | 39 /* KEY_I */
                }
            }) || this;
        }
        InsertCursorAtEndOfEachLineSelected.prototype.getCursorsForSelection = function (selection, editor) {
            if (selection.isEmpty()) {
                return [];
            }
            var model = editor.getModel();
            var newSelections = [];
            for (var i = selection.startLineNumber; i < selection.endLineNumber; i++) {
                var currentLineMaxColumn = model.getLineMaxColumn(i);
                newSelections.push(new selection_1.Selection(i, currentLineMaxColumn, i, currentLineMaxColumn));
            }
            if (selection.endColumn > 1) {
                newSelections.push(new selection_1.Selection(selection.endLineNumber, selection.endColumn, selection.endLineNumber, selection.endColumn));
            }
            return newSelections;
        };
        InsertCursorAtEndOfEachLineSelected.prototype.run = function (accessor, editor) {
            var _this = this;
            var selections = editor.getSelections();
            var newSelections = selections
                .map(function (selection) { return _this.getCursorsForSelection(selection, editor); })
                .reduce(function (prev, curr) { return prev.concat(curr); });
            if (newSelections.length > 0) {
                editor.setSelections(newSelections);
            }
        };
        InsertCursorAtEndOfEachLineSelected = __decorate([
            editorCommonExtensions_1.editorAction
        ], InsertCursorAtEndOfEachLineSelected);
        return InsertCursorAtEndOfEachLineSelected;
    }(editorCommonExtensions_1.EditorAction));
});
//# sourceMappingURL=multicursor.js.map