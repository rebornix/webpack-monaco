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
define(["require", "exports", "vs/nls", "vs/base/common/keyCodes", "vs/editor/contrib/linesOperations/common/sortLinesCommand", "vs/editor/common/core/editOperation", "vs/editor/common/commands/trimTrailingWhitespaceCommand", "vs/editor/common/editorContextKeys", "vs/editor/common/commands/replaceCommand", "vs/editor/common/core/range", "vs/editor/common/core/selection", "vs/editor/common/editorCommonExtensions", "./copyLinesCommand", "./deleteLinesCommand", "./moveLinesCommand", "vs/editor/common/controller/cursorTypeOperations", "vs/editor/common/controller/coreCommands"], function (require, exports, nls, keyCodes_1, sortLinesCommand_1, editOperation_1, trimTrailingWhitespaceCommand_1, editorContextKeys_1, replaceCommand_1, range_1, selection_1, editorCommonExtensions_1, copyLinesCommand_1, deleteLinesCommand_1, moveLinesCommand_1, cursorTypeOperations_1, coreCommands_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    // copy lines
    var AbstractCopyLinesAction = (function (_super) {
        __extends(AbstractCopyLinesAction, _super);
        function AbstractCopyLinesAction(down, opts) {
            var _this = _super.call(this, opts) || this;
            _this.down = down;
            return _this;
        }
        AbstractCopyLinesAction.prototype.run = function (accessor, editor) {
            var commands = [];
            var selections = editor.getSelections();
            for (var i = 0; i < selections.length; i++) {
                commands.push(new copyLinesCommand_1.CopyLinesCommand(selections[i], this.down));
            }
            editor.pushUndoStop();
            editor.executeCommands(this.id, commands);
            editor.pushUndoStop();
        };
        return AbstractCopyLinesAction;
    }(editorCommonExtensions_1.EditorAction));
    var CopyLinesUpAction = (function (_super) {
        __extends(CopyLinesUpAction, _super);
        function CopyLinesUpAction() {
            return _super.call(this, false, {
                id: 'editor.action.copyLinesUpAction',
                label: nls.localize('lines.copyUp', "Copy Line Up"),
                alias: 'Copy Line Up',
                precondition: editorContextKeys_1.EditorContextKeys.writable,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 512 /* Alt */ | 1024 /* Shift */ | 16 /* UpArrow */,
                    linux: { primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 1024 /* Shift */ | 16 /* UpArrow */ }
                }
            }) || this;
        }
        CopyLinesUpAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], CopyLinesUpAction);
        return CopyLinesUpAction;
    }(AbstractCopyLinesAction));
    var CopyLinesDownAction = (function (_super) {
        __extends(CopyLinesDownAction, _super);
        function CopyLinesDownAction() {
            return _super.call(this, true, {
                id: 'editor.action.copyLinesDownAction',
                label: nls.localize('lines.copyDown', "Copy Line Down"),
                alias: 'Copy Line Down',
                precondition: editorContextKeys_1.EditorContextKeys.writable,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 512 /* Alt */ | 1024 /* Shift */ | 18 /* DownArrow */,
                    linux: { primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 1024 /* Shift */ | 18 /* DownArrow */ }
                }
            }) || this;
        }
        CopyLinesDownAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], CopyLinesDownAction);
        return CopyLinesDownAction;
    }(AbstractCopyLinesAction));
    // move lines
    var AbstractMoveLinesAction = (function (_super) {
        __extends(AbstractMoveLinesAction, _super);
        function AbstractMoveLinesAction(down, opts) {
            var _this = _super.call(this, opts) || this;
            _this.down = down;
            return _this;
        }
        AbstractMoveLinesAction.prototype.run = function (accessor, editor) {
            var commands = [];
            var selections = editor.getSelections();
            var autoIndent = editor.getConfiguration().autoIndent;
            for (var i = 0; i < selections.length; i++) {
                commands.push(new moveLinesCommand_1.MoveLinesCommand(selections[i], this.down, autoIndent));
            }
            editor.pushUndoStop();
            editor.executeCommands(this.id, commands);
            editor.pushUndoStop();
        };
        return AbstractMoveLinesAction;
    }(editorCommonExtensions_1.EditorAction));
    var MoveLinesUpAction = (function (_super) {
        __extends(MoveLinesUpAction, _super);
        function MoveLinesUpAction() {
            return _super.call(this, false, {
                id: 'editor.action.moveLinesUpAction',
                label: nls.localize('lines.moveUp', "Move Line Up"),
                alias: 'Move Line Up',
                precondition: editorContextKeys_1.EditorContextKeys.writable,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 512 /* Alt */ | 16 /* UpArrow */,
                    linux: { primary: 512 /* Alt */ | 16 /* UpArrow */ }
                }
            }) || this;
        }
        MoveLinesUpAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], MoveLinesUpAction);
        return MoveLinesUpAction;
    }(AbstractMoveLinesAction));
    var MoveLinesDownAction = (function (_super) {
        __extends(MoveLinesDownAction, _super);
        function MoveLinesDownAction() {
            return _super.call(this, true, {
                id: 'editor.action.moveLinesDownAction',
                label: nls.localize('lines.moveDown', "Move Line Down"),
                alias: 'Move Line Down',
                precondition: editorContextKeys_1.EditorContextKeys.writable,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 512 /* Alt */ | 18 /* DownArrow */,
                    linux: { primary: 512 /* Alt */ | 18 /* DownArrow */ }
                }
            }) || this;
        }
        MoveLinesDownAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], MoveLinesDownAction);
        return MoveLinesDownAction;
    }(AbstractMoveLinesAction));
    var AbstractSortLinesAction = (function (_super) {
        __extends(AbstractSortLinesAction, _super);
        function AbstractSortLinesAction(descending, opts) {
            var _this = _super.call(this, opts) || this;
            _this.descending = descending;
            return _this;
        }
        AbstractSortLinesAction.prototype.run = function (accessor, editor) {
            if (!sortLinesCommand_1.SortLinesCommand.canRun(editor.getModel(), editor.getSelection(), this.descending)) {
                return;
            }
            var command = new sortLinesCommand_1.SortLinesCommand(editor.getSelection(), this.descending);
            editor.pushUndoStop();
            editor.executeCommands(this.id, [command]);
            editor.pushUndoStop();
        };
        return AbstractSortLinesAction;
    }(editorCommonExtensions_1.EditorAction));
    var SortLinesAscendingAction = (function (_super) {
        __extends(SortLinesAscendingAction, _super);
        function SortLinesAscendingAction() {
            return _super.call(this, false, {
                id: 'editor.action.sortLinesAscending',
                label: nls.localize('lines.sortAscending', "Sort Lines Ascending"),
                alias: 'Sort Lines Ascending',
                precondition: editorContextKeys_1.EditorContextKeys.writable
            }) || this;
        }
        SortLinesAscendingAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], SortLinesAscendingAction);
        return SortLinesAscendingAction;
    }(AbstractSortLinesAction));
    var SortLinesDescendingAction = (function (_super) {
        __extends(SortLinesDescendingAction, _super);
        function SortLinesDescendingAction() {
            return _super.call(this, true, {
                id: 'editor.action.sortLinesDescending',
                label: nls.localize('lines.sortDescending', "Sort Lines Descending"),
                alias: 'Sort Lines Descending',
                precondition: editorContextKeys_1.EditorContextKeys.writable
            }) || this;
        }
        SortLinesDescendingAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], SortLinesDescendingAction);
        return SortLinesDescendingAction;
    }(AbstractSortLinesAction));
    var TrimTrailingWhitespaceAction = (function (_super) {
        __extends(TrimTrailingWhitespaceAction, _super);
        function TrimTrailingWhitespaceAction() {
            return _super.call(this, {
                id: TrimTrailingWhitespaceAction_1.ID,
                label: nls.localize('lines.trimTrailingWhitespace', "Trim Trailing Whitespace"),
                alias: 'Trim Trailing Whitespace',
                precondition: editorContextKeys_1.EditorContextKeys.writable,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: keyCodes_1.KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 54 /* KEY_X */)
                }
            }) || this;
        }
        TrimTrailingWhitespaceAction_1 = TrimTrailingWhitespaceAction;
        TrimTrailingWhitespaceAction.prototype.run = function (accessor, editor) {
            var command = new trimTrailingWhitespaceCommand_1.TrimTrailingWhitespaceCommand(editor.getSelection());
            editor.pushUndoStop();
            editor.executeCommands(this.id, [command]);
            editor.pushUndoStop();
        };
        TrimTrailingWhitespaceAction.ID = 'editor.action.trimTrailingWhitespace';
        TrimTrailingWhitespaceAction = TrimTrailingWhitespaceAction_1 = __decorate([
            editorCommonExtensions_1.editorAction
        ], TrimTrailingWhitespaceAction);
        return TrimTrailingWhitespaceAction;
        var TrimTrailingWhitespaceAction_1;
    }(editorCommonExtensions_1.EditorAction));
    exports.TrimTrailingWhitespaceAction = TrimTrailingWhitespaceAction;
    var AbstractRemoveLinesAction = (function (_super) {
        __extends(AbstractRemoveLinesAction, _super);
        function AbstractRemoveLinesAction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AbstractRemoveLinesAction.prototype._getLinesToRemove = function (editor) {
            // Construct delete operations
            var operations = editor.getSelections().map(function (s) {
                var endLineNumber = s.endLineNumber;
                if (s.startLineNumber < s.endLineNumber && s.endColumn === 1) {
                    endLineNumber -= 1;
                }
                return {
                    startLineNumber: s.startLineNumber,
                    endLineNumber: endLineNumber,
                    positionColumn: s.positionColumn
                };
            });
            // Sort delete operations
            operations.sort(function (a, b) {
                return a.startLineNumber - b.startLineNumber;
            });
            // Merge delete operations on consecutive lines
            var mergedOperations = [];
            var previousOperation = operations[0];
            for (var i = 1; i < operations.length; i++) {
                if (previousOperation.endLineNumber + 1 === operations[i].startLineNumber) {
                    // Merge current operations into the previous one
                    previousOperation.endLineNumber = operations[i].endLineNumber;
                }
                else {
                    // Push previous operation
                    mergedOperations.push(previousOperation);
                    previousOperation = operations[i];
                }
            }
            // Push the last operation
            mergedOperations.push(previousOperation);
            return mergedOperations;
        };
        return AbstractRemoveLinesAction;
    }(editorCommonExtensions_1.EditorAction));
    var DeleteLinesAction = (function (_super) {
        __extends(DeleteLinesAction, _super);
        function DeleteLinesAction() {
            return _super.call(this, {
                id: 'editor.action.deleteLines',
                label: nls.localize('lines.delete', "Delete Line"),
                alias: 'Delete Line',
                precondition: editorContextKeys_1.EditorContextKeys.writable,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 41 /* KEY_K */
                }
            }) || this;
        }
        DeleteLinesAction.prototype.run = function (accessor, editor) {
            var ops = this._getLinesToRemove(editor);
            // Finally, construct the delete lines commands
            var commands = ops.map(function (op) {
                return new deleteLinesCommand_1.DeleteLinesCommand(op.startLineNumber, op.endLineNumber, op.positionColumn);
            });
            editor.pushUndoStop();
            editor.executeCommands(this.id, commands);
            editor.pushUndoStop();
        };
        DeleteLinesAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], DeleteLinesAction);
        return DeleteLinesAction;
    }(AbstractRemoveLinesAction));
    var IndentLinesAction = (function (_super) {
        __extends(IndentLinesAction, _super);
        function IndentLinesAction() {
            return _super.call(this, {
                id: 'editor.action.indentLines',
                label: nls.localize('lines.indent', "Indent Line"),
                alias: 'Indent Line',
                precondition: editorContextKeys_1.EditorContextKeys.writable,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 2048 /* CtrlCmd */ | 89 /* US_CLOSE_SQUARE_BRACKET */
                }
            }) || this;
        }
        IndentLinesAction.prototype.run = function (accessor, editor) {
            editor.pushUndoStop();
            editor.executeCommands(this.id, cursorTypeOperations_1.TypeOperations.indent(editor._getCursorConfiguration(), editor.getModel(), editor.getSelections()));
            editor.pushUndoStop();
        };
        IndentLinesAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], IndentLinesAction);
        return IndentLinesAction;
    }(editorCommonExtensions_1.EditorAction));
    exports.IndentLinesAction = IndentLinesAction;
    var OutdentLinesAction = (function (_super) {
        __extends(OutdentLinesAction, _super);
        function OutdentLinesAction() {
            return _super.call(this, {
                id: 'editor.action.outdentLines',
                label: nls.localize('lines.outdent', "Outdent Line"),
                alias: 'Outdent Line',
                precondition: editorContextKeys_1.EditorContextKeys.writable,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 2048 /* CtrlCmd */ | 87 /* US_OPEN_SQUARE_BRACKET */
                }
            }) || this;
        }
        OutdentLinesAction.prototype.run = function (accessor, editor) {
            coreCommands_1.CoreEditingCommands.Outdent.runEditorCommand(null, editor, null);
        };
        OutdentLinesAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], OutdentLinesAction);
        return OutdentLinesAction;
    }(editorCommonExtensions_1.EditorAction));
    var InsertLineBeforeAction = (function (_super) {
        __extends(InsertLineBeforeAction, _super);
        function InsertLineBeforeAction() {
            return _super.call(this, {
                id: 'editor.action.insertLineBefore',
                label: nls.localize('lines.insertBefore', "Insert Line Above"),
                alias: 'Insert Line Above',
                precondition: editorContextKeys_1.EditorContextKeys.writable,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 3 /* Enter */
                }
            }) || this;
        }
        InsertLineBeforeAction.prototype.run = function (accessor, editor) {
            editor.pushUndoStop();
            editor.executeCommands(this.id, cursorTypeOperations_1.TypeOperations.lineInsertBefore(editor._getCursorConfiguration(), editor.getModel(), editor.getSelections()));
        };
        InsertLineBeforeAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], InsertLineBeforeAction);
        return InsertLineBeforeAction;
    }(editorCommonExtensions_1.EditorAction));
    exports.InsertLineBeforeAction = InsertLineBeforeAction;
    var InsertLineAfterAction = (function (_super) {
        __extends(InsertLineAfterAction, _super);
        function InsertLineAfterAction() {
            return _super.call(this, {
                id: 'editor.action.insertLineAfter',
                label: nls.localize('lines.insertAfter', "Insert Line Below"),
                alias: 'Insert Line Below',
                precondition: editorContextKeys_1.EditorContextKeys.writable,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 2048 /* CtrlCmd */ | 3 /* Enter */
                }
            }) || this;
        }
        InsertLineAfterAction.prototype.run = function (accessor, editor) {
            editor.pushUndoStop();
            editor.executeCommands(this.id, cursorTypeOperations_1.TypeOperations.lineInsertAfter(editor._getCursorConfiguration(), editor.getModel(), editor.getSelections()));
        };
        InsertLineAfterAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], InsertLineAfterAction);
        return InsertLineAfterAction;
    }(editorCommonExtensions_1.EditorAction));
    exports.InsertLineAfterAction = InsertLineAfterAction;
    var AbstractDeleteAllToBoundaryAction = (function (_super) {
        __extends(AbstractDeleteAllToBoundaryAction, _super);
        function AbstractDeleteAllToBoundaryAction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AbstractDeleteAllToBoundaryAction.prototype.run = function (accessor, editor) {
            var primaryCursor = editor.getSelection();
            var rangesToDelete = this._getRangesToDelete(editor);
            // merge overlapping selections
            var effectiveRanges = [];
            for (var i = 0, count = rangesToDelete.length - 1; i < count; i++) {
                var range = rangesToDelete[i];
                var nextRange = rangesToDelete[i + 1];
                if (range_1.Range.intersectRanges(range, nextRange) === null) {
                    effectiveRanges.push(range);
                }
                else {
                    rangesToDelete[i + 1] = range_1.Range.plusRange(range, nextRange);
                }
            }
            effectiveRanges.push(rangesToDelete[rangesToDelete.length - 1]);
            var endCursorState = this._getEndCursorState(primaryCursor, effectiveRanges);
            var edits = effectiveRanges.map(function (range) {
                endCursorState.push(new selection_1.Selection(range.startLineNumber, range.startColumn, range.startLineNumber, range.startColumn));
                return editOperation_1.EditOperation.replace(range, '');
            });
            editor.executeEdits(this.id, edits, endCursorState);
        };
        return AbstractDeleteAllToBoundaryAction;
    }(editorCommonExtensions_1.EditorAction));
    exports.AbstractDeleteAllToBoundaryAction = AbstractDeleteAllToBoundaryAction;
    var DeleteAllLeftAction = (function (_super) {
        __extends(DeleteAllLeftAction, _super);
        function DeleteAllLeftAction() {
            return _super.call(this, {
                id: 'deleteAllLeft',
                label: nls.localize('lines.deleteAllLeft', "Delete All Left"),
                alias: 'Delete All Left',
                precondition: editorContextKeys_1.EditorContextKeys.writable,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: null,
                    mac: { primary: 2048 /* CtrlCmd */ | 1 /* Backspace */ }
                }
            }) || this;
        }
        DeleteAllLeftAction.prototype._getEndCursorState = function (primaryCursor, rangesToDelete) {
            var endPrimaryCursor;
            var endCursorState = [];
            for (var i = 0, len = rangesToDelete.length; i < len; i++) {
                var range = rangesToDelete[i];
                var endCursor = new selection_1.Selection(rangesToDelete[i].startLineNumber, rangesToDelete[i].startColumn, rangesToDelete[i].startLineNumber, rangesToDelete[i].startColumn);
                if (range.intersectRanges(primaryCursor)) {
                    endPrimaryCursor = endCursor;
                }
                else {
                    endCursorState.push(endCursor);
                }
            }
            if (endPrimaryCursor) {
                endCursorState.unshift(endPrimaryCursor);
            }
            return endCursorState;
        };
        DeleteAllLeftAction.prototype._getRangesToDelete = function (editor) {
            var rangesToDelete = editor.getSelections();
            rangesToDelete.sort(range_1.Range.compareRangesUsingStarts);
            rangesToDelete = rangesToDelete.map(function (selection) {
                if (selection.isEmpty()) {
                    return new range_1.Range(selection.startLineNumber, 1, selection.startLineNumber, selection.startColumn);
                }
                else {
                    return selection;
                }
            });
            return rangesToDelete;
        };
        DeleteAllLeftAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], DeleteAllLeftAction);
        return DeleteAllLeftAction;
    }(AbstractDeleteAllToBoundaryAction));
    exports.DeleteAllLeftAction = DeleteAllLeftAction;
    var DeleteAllRightAction = (function (_super) {
        __extends(DeleteAllRightAction, _super);
        function DeleteAllRightAction() {
            return _super.call(this, {
                id: 'deleteAllRight',
                label: nls.localize('lines.deleteAllRight', "Delete All Right"),
                alias: 'Delete All Right',
                precondition: editorContextKeys_1.EditorContextKeys.writable,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: null,
                    mac: { primary: 256 /* WinCtrl */ | 41 /* KEY_K */, secondary: [2048 /* CtrlCmd */ | 20 /* Delete */] }
                }
            }) || this;
        }
        DeleteAllRightAction.prototype._getEndCursorState = function (primaryCursor, rangesToDelete) {
            var endPrimaryCursor;
            var endCursorState = [];
            for (var i = 0, len = rangesToDelete.length, offset = 0; i < len; i++) {
                var range = rangesToDelete[i];
                var endCursor = new selection_1.Selection(range.startLineNumber - offset, range.startColumn, range.startLineNumber - offset, range.startColumn);
                if (range.intersectRanges(primaryCursor)) {
                    endPrimaryCursor = endCursor;
                }
                else {
                    endCursorState.push(endCursor);
                }
            }
            if (endPrimaryCursor) {
                endCursorState.unshift(endPrimaryCursor);
            }
            return endCursorState;
        };
        DeleteAllRightAction.prototype._getRangesToDelete = function (editor) {
            var model = editor.getModel();
            var rangesToDelete = editor.getSelections().map(function (sel) {
                if (sel.isEmpty()) {
                    var maxColumn = model.getLineMaxColumn(sel.startLineNumber);
                    if (sel.startColumn === maxColumn) {
                        return new range_1.Range(sel.startLineNumber, sel.startColumn, sel.startLineNumber + 1, 1);
                    }
                    else {
                        return new range_1.Range(sel.startLineNumber, sel.startColumn, sel.startLineNumber, maxColumn);
                    }
                }
                return sel;
            });
            rangesToDelete.sort(range_1.Range.compareRangesUsingStarts);
            return rangesToDelete;
        };
        DeleteAllRightAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], DeleteAllRightAction);
        return DeleteAllRightAction;
    }(AbstractDeleteAllToBoundaryAction));
    exports.DeleteAllRightAction = DeleteAllRightAction;
    var JoinLinesAction = (function (_super) {
        __extends(JoinLinesAction, _super);
        function JoinLinesAction() {
            return _super.call(this, {
                id: 'editor.action.joinLines',
                label: nls.localize('lines.joinLines', "Join Lines"),
                alias: 'Join Lines',
                precondition: editorContextKeys_1.EditorContextKeys.writable,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 0,
                    mac: { primary: 256 /* WinCtrl */ | 40 /* KEY_J */ }
                }
            }) || this;
        }
        JoinLinesAction.prototype.run = function (accessor, editor) {
            var selections = editor.getSelections();
            var primaryCursor = editor.getSelection();
            selections.sort(range_1.Range.compareRangesUsingStarts);
            var reducedSelections = [];
            var lastSelection = selections.reduce(function (previousValue, currentValue) {
                if (previousValue.isEmpty()) {
                    if (previousValue.endLineNumber === currentValue.startLineNumber) {
                        if (primaryCursor.equalsSelection(previousValue)) {
                            primaryCursor = currentValue;
                        }
                        return currentValue;
                    }
                    if (currentValue.startLineNumber > previousValue.endLineNumber + 1) {
                        reducedSelections.push(previousValue);
                        return currentValue;
                    }
                    else {
                        return new selection_1.Selection(previousValue.startLineNumber, previousValue.startColumn, currentValue.endLineNumber, currentValue.endColumn);
                    }
                }
                else {
                    if (currentValue.startLineNumber > previousValue.endLineNumber) {
                        reducedSelections.push(previousValue);
                        return currentValue;
                    }
                    else {
                        return new selection_1.Selection(previousValue.startLineNumber, previousValue.startColumn, currentValue.endLineNumber, currentValue.endColumn);
                    }
                }
            });
            reducedSelections.push(lastSelection);
            var model = editor.getModel();
            var edits = [];
            var endCursorState = [];
            var endPrimaryCursor = primaryCursor;
            var lineOffset = 0;
            for (var i = 0, len = reducedSelections.length; i < len; i++) {
                var selection = reducedSelections[i];
                var startLineNumber = selection.startLineNumber;
                var startColumn = 1;
                var endLineNumber = void 0, endColumn = void 0, columnDeltaOffset = void 0;
                var selectionEndPositionOffset = model.getLineContent(selection.endLineNumber).length - selection.endColumn;
                if (selection.isEmpty() || selection.startLineNumber === selection.endLineNumber) {
                    var position = selection.getStartPosition();
                    if (position.lineNumber < model.getLineCount()) {
                        endLineNumber = startLineNumber + 1;
                        endColumn = model.getLineMaxColumn(endLineNumber);
                    }
                    else {
                        endLineNumber = position.lineNumber;
                        endColumn = model.getLineMaxColumn(position.lineNumber);
                    }
                }
                else {
                    endLineNumber = selection.endLineNumber;
                    endColumn = model.getLineMaxColumn(endLineNumber);
                }
                var trimmedLinesContent = model.getLineContent(startLineNumber);
                for (var i_1 = startLineNumber + 1; i_1 <= endLineNumber; i_1++) {
                    var lineText = model.getLineContent(i_1);
                    var firstNonWhitespaceIdx = model.getLineFirstNonWhitespaceColumn(i_1);
                    if (firstNonWhitespaceIdx >= 1) {
                        var insertSpace = true;
                        if (trimmedLinesContent === '') {
                            insertSpace = false;
                        }
                        if (insertSpace && (trimmedLinesContent.charAt(trimmedLinesContent.length - 1) === ' ' ||
                            trimmedLinesContent.charAt(trimmedLinesContent.length - 1) === '\t')) {
                            insertSpace = false;
                            trimmedLinesContent = trimmedLinesContent.replace(/[\s\uFEFF\xA0]+$/g, ' ');
                        }
                        var lineTextWithoutIndent = lineText.substr(firstNonWhitespaceIdx - 1);
                        trimmedLinesContent += (insertSpace ? ' ' : '') + lineTextWithoutIndent;
                        if (insertSpace) {
                            columnDeltaOffset = lineTextWithoutIndent.length + 1;
                        }
                        else {
                            columnDeltaOffset = lineTextWithoutIndent.length;
                        }
                    }
                    else {
                        columnDeltaOffset = 0;
                    }
                }
                var deleteSelection = new range_1.Range(startLineNumber, startColumn, endLineNumber, endColumn);
                if (!deleteSelection.isEmpty()) {
                    var resultSelection = void 0;
                    if (selection.isEmpty()) {
                        edits.push(editOperation_1.EditOperation.replace(deleteSelection, trimmedLinesContent));
                        resultSelection = new selection_1.Selection(deleteSelection.startLineNumber - lineOffset, trimmedLinesContent.length - columnDeltaOffset + 1, startLineNumber - lineOffset, trimmedLinesContent.length - columnDeltaOffset + 1);
                    }
                    else {
                        if (selection.startLineNumber === selection.endLineNumber) {
                            edits.push(editOperation_1.EditOperation.replace(deleteSelection, trimmedLinesContent));
                            resultSelection = new selection_1.Selection(selection.startLineNumber - lineOffset, selection.startColumn, selection.endLineNumber - lineOffset, selection.endColumn);
                        }
                        else {
                            edits.push(editOperation_1.EditOperation.replace(deleteSelection, trimmedLinesContent));
                            resultSelection = new selection_1.Selection(selection.startLineNumber - lineOffset, selection.startColumn, selection.startLineNumber - lineOffset, trimmedLinesContent.length - selectionEndPositionOffset);
                        }
                    }
                    if (range_1.Range.intersectRanges(deleteSelection, primaryCursor) !== null) {
                        endPrimaryCursor = resultSelection;
                    }
                    else {
                        endCursorState.push(resultSelection);
                    }
                }
                lineOffset += deleteSelection.endLineNumber - deleteSelection.startLineNumber;
            }
            endCursorState.unshift(endPrimaryCursor);
            editor.executeEdits(this.id, edits, endCursorState);
        };
        JoinLinesAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], JoinLinesAction);
        return JoinLinesAction;
    }(editorCommonExtensions_1.EditorAction));
    exports.JoinLinesAction = JoinLinesAction;
    var TransposeAction = (function (_super) {
        __extends(TransposeAction, _super);
        function TransposeAction() {
            return _super.call(this, {
                id: 'editor.action.transpose',
                label: nls.localize('editor.transpose', "Transpose characters around the cursor"),
                alias: 'Transpose characters around the cursor',
                precondition: editorContextKeys_1.EditorContextKeys.writable
            }) || this;
        }
        TransposeAction.prototype.run = function (accessor, editor) {
            var selections = editor.getSelections();
            var model = editor.getModel();
            var commands = [];
            for (var i = 0, len = selections.length; i < len; i++) {
                var selection = selections[i];
                if (!selection.isEmpty()) {
                    continue;
                }
                var cursor = selection.getStartPosition();
                var maxColumn = model.getLineMaxColumn(cursor.lineNumber);
                if (cursor.column >= maxColumn) {
                    if (cursor.lineNumber === model.getLineCount()) {
                        continue;
                    }
                    // The cursor is at the end of current line and current line is not empty
                    // then we transpose the character before the cursor and the line break if there is any following line.
                    var deleteSelection = new range_1.Range(cursor.lineNumber, Math.max(1, cursor.column - 1), cursor.lineNumber + 1, 1);
                    var chars = model.getValueInRange(deleteSelection).split('').reverse().join('');
                    commands.push(new replaceCommand_1.ReplaceCommand(new selection_1.Selection(cursor.lineNumber, Math.max(1, cursor.column - 1), cursor.lineNumber + 1, 1), chars));
                }
                else {
                    var deleteSelection = new range_1.Range(cursor.lineNumber, Math.max(1, cursor.column - 1), cursor.lineNumber, cursor.column + 1);
                    var chars = model.getValueInRange(deleteSelection).split('').reverse().join('');
                    commands.push(new replaceCommand_1.ReplaceCommandThatPreservesSelection(deleteSelection, chars, new selection_1.Selection(cursor.lineNumber, cursor.column + 1, cursor.lineNumber, cursor.column + 1)));
                }
            }
            editor.pushUndoStop();
            editor.executeCommands(this.id, commands);
            editor.pushUndoStop();
        };
        TransposeAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], TransposeAction);
        return TransposeAction;
    }(editorCommonExtensions_1.EditorAction));
    exports.TransposeAction = TransposeAction;
    var AbstractCaseAction = (function (_super) {
        __extends(AbstractCaseAction, _super);
        function AbstractCaseAction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AbstractCaseAction.prototype.run = function (accessor, editor) {
            var selections = editor.getSelections();
            var model = editor.getModel();
            var commands = [];
            for (var i = 0, len = selections.length; i < len; i++) {
                var selection = selections[i];
                if (selection.isEmpty()) {
                    var cursor = selection.getStartPosition();
                    var word = model.getWordAtPosition(cursor);
                    if (!word) {
                        continue;
                    }
                    var wordRange = new range_1.Range(cursor.lineNumber, word.startColumn, cursor.lineNumber, word.endColumn);
                    var text = model.getValueInRange(wordRange);
                    commands.push(new replaceCommand_1.ReplaceCommandThatPreservesSelection(wordRange, this._modifyText(text), new selection_1.Selection(cursor.lineNumber, cursor.column, cursor.lineNumber, cursor.column)));
                }
                else {
                    var text = model.getValueInRange(selection);
                    commands.push(new replaceCommand_1.ReplaceCommandThatPreservesSelection(selection, this._modifyText(text), selection));
                }
            }
            editor.pushUndoStop();
            editor.executeCommands(this.id, commands);
            editor.pushUndoStop();
        };
        return AbstractCaseAction;
    }(editorCommonExtensions_1.EditorAction));
    exports.AbstractCaseAction = AbstractCaseAction;
    var UpperCaseAction = (function (_super) {
        __extends(UpperCaseAction, _super);
        function UpperCaseAction() {
            return _super.call(this, {
                id: 'editor.action.transformToUppercase',
                label: nls.localize('editor.transformToUppercase', "Transform to Uppercase"),
                alias: 'Transform to Uppercase',
                precondition: editorContextKeys_1.EditorContextKeys.writable
            }) || this;
        }
        UpperCaseAction.prototype._modifyText = function (text) {
            return text.toLocaleUpperCase();
        };
        UpperCaseAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], UpperCaseAction);
        return UpperCaseAction;
    }(AbstractCaseAction));
    exports.UpperCaseAction = UpperCaseAction;
    var LowerCaseAction = (function (_super) {
        __extends(LowerCaseAction, _super);
        function LowerCaseAction() {
            return _super.call(this, {
                id: 'editor.action.transformToLowercase',
                label: nls.localize('editor.transformToLowercase', "Transform to Lowercase"),
                alias: 'Transform to Lowercase',
                precondition: editorContextKeys_1.EditorContextKeys.writable
            }) || this;
        }
        LowerCaseAction.prototype._modifyText = function (text) {
            return text.toLocaleLowerCase();
        };
        LowerCaseAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], LowerCaseAction);
        return LowerCaseAction;
    }(AbstractCaseAction));
    exports.LowerCaseAction = LowerCaseAction;
});
//# sourceMappingURL=linesOperations.js.map