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
define(["require", "exports", "vs/editor/common/editorContextKeys", "vs/editor/common/core/selection", "vs/editor/common/editorCommonExtensions", "vs/editor/common/core/position", "vs/editor/common/core/range", "vs/editor/common/controller/cursorWordOperations", "vs/editor/common/commands/replaceCommand", "vs/editor/common/controller/wordCharacterClassifier", "vs/editor/common/controller/cursorCommon", "vs/editor/common/controller/cursorEvents"], function (require, exports, editorContextKeys_1, selection_1, editorCommonExtensions_1, position_1, range_1, cursorWordOperations_1, replaceCommand_1, wordCharacterClassifier_1, cursorCommon_1, cursorEvents_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var MoveWordCommand = (function (_super) {
        __extends(MoveWordCommand, _super);
        function MoveWordCommand(opts) {
            var _this = _super.call(this, opts) || this;
            _this._inSelectionMode = opts.inSelectionMode;
            _this._wordNavigationType = opts.wordNavigationType;
            return _this;
        }
        MoveWordCommand.prototype.runEditorCommand = function (accessor, editor, args) {
            var _this = this;
            var config = editor.getConfiguration();
            var wordSeparators = wordCharacterClassifier_1.getMapForWordSeparators(config.wordSeparators);
            var model = editor.getModel();
            var selections = editor.getSelections();
            var result = selections.map(function (sel) {
                var inPosition = new position_1.Position(sel.positionLineNumber, sel.positionColumn);
                var outPosition = _this._move(wordSeparators, model, inPosition, _this._wordNavigationType);
                return _this._moveTo(sel, outPosition, _this._inSelectionMode);
            });
            editor._getCursors().setStates('moveWordCommand', cursorEvents_1.CursorChangeReason.NotSet, result.map(function (r) { return cursorCommon_1.CursorState.fromModelSelection(r); }));
            if (result.length === 1) {
                var pos = new position_1.Position(result[0].positionLineNumber, result[0].positionColumn);
                editor.revealPosition(pos, false, true);
            }
        };
        MoveWordCommand.prototype._moveTo = function (from, to, inSelectionMode) {
            if (inSelectionMode) {
                // move just position
                return new selection_1.Selection(from.selectionStartLineNumber, from.selectionStartColumn, to.lineNumber, to.column);
            }
            else {
                // move everything
                return new selection_1.Selection(to.lineNumber, to.column, to.lineNumber, to.column);
            }
        };
        return MoveWordCommand;
    }(editorCommonExtensions_1.EditorCommand));
    exports.MoveWordCommand = MoveWordCommand;
    var WordLeftCommand = (function (_super) {
        __extends(WordLeftCommand, _super);
        function WordLeftCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        WordLeftCommand.prototype._move = function (wordSeparators, model, position, wordNavigationType) {
            return cursorWordOperations_1.WordOperations.moveWordLeft(wordSeparators, model, position, wordNavigationType);
        };
        return WordLeftCommand;
    }(MoveWordCommand));
    exports.WordLeftCommand = WordLeftCommand;
    var WordRightCommand = (function (_super) {
        __extends(WordRightCommand, _super);
        function WordRightCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        WordRightCommand.prototype._move = function (wordSeparators, model, position, wordNavigationType) {
            return cursorWordOperations_1.WordOperations.moveWordRight(wordSeparators, model, position, wordNavigationType);
        };
        return WordRightCommand;
    }(MoveWordCommand));
    exports.WordRightCommand = WordRightCommand;
    var CursorWordStartLeft = (function (_super) {
        __extends(CursorWordStartLeft, _super);
        function CursorWordStartLeft() {
            return _super.call(this, {
                inSelectionMode: false,
                wordNavigationType: 0 /* WordStart */,
                id: 'cursorWordStartLeft',
                precondition: null,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 2048 /* CtrlCmd */ | 15 /* LeftArrow */,
                    mac: { primary: 512 /* Alt */ | 15 /* LeftArrow */ }
                }
            }) || this;
        }
        CursorWordStartLeft = __decorate([
            editorCommonExtensions_1.editorCommand
        ], CursorWordStartLeft);
        return CursorWordStartLeft;
    }(WordLeftCommand));
    exports.CursorWordStartLeft = CursorWordStartLeft;
    var CursorWordEndLeft = (function (_super) {
        __extends(CursorWordEndLeft, _super);
        function CursorWordEndLeft() {
            return _super.call(this, {
                inSelectionMode: false,
                wordNavigationType: 1 /* WordEnd */,
                id: 'cursorWordEndLeft',
                precondition: null
            }) || this;
        }
        CursorWordEndLeft = __decorate([
            editorCommonExtensions_1.editorCommand
        ], CursorWordEndLeft);
        return CursorWordEndLeft;
    }(WordLeftCommand));
    exports.CursorWordEndLeft = CursorWordEndLeft;
    var CursorWordLeft = (function (_super) {
        __extends(CursorWordLeft, _super);
        function CursorWordLeft() {
            return _super.call(this, {
                inSelectionMode: false,
                wordNavigationType: 0 /* WordStart */,
                id: 'cursorWordLeft',
                precondition: null
            }) || this;
        }
        CursorWordLeft = __decorate([
            editorCommonExtensions_1.editorCommand
        ], CursorWordLeft);
        return CursorWordLeft;
    }(WordLeftCommand));
    exports.CursorWordLeft = CursorWordLeft;
    var CursorWordStartLeftSelect = (function (_super) {
        __extends(CursorWordStartLeftSelect, _super);
        function CursorWordStartLeftSelect() {
            return _super.call(this, {
                inSelectionMode: true,
                wordNavigationType: 0 /* WordStart */,
                id: 'cursorWordStartLeftSelect',
                precondition: null,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 15 /* LeftArrow */,
                    mac: { primary: 512 /* Alt */ | 1024 /* Shift */ | 15 /* LeftArrow */ }
                }
            }) || this;
        }
        CursorWordStartLeftSelect = __decorate([
            editorCommonExtensions_1.editorCommand
        ], CursorWordStartLeftSelect);
        return CursorWordStartLeftSelect;
    }(WordLeftCommand));
    exports.CursorWordStartLeftSelect = CursorWordStartLeftSelect;
    var CursorWordEndLeftSelect = (function (_super) {
        __extends(CursorWordEndLeftSelect, _super);
        function CursorWordEndLeftSelect() {
            return _super.call(this, {
                inSelectionMode: true,
                wordNavigationType: 1 /* WordEnd */,
                id: 'cursorWordEndLeftSelect',
                precondition: null
            }) || this;
        }
        CursorWordEndLeftSelect = __decorate([
            editorCommonExtensions_1.editorCommand
        ], CursorWordEndLeftSelect);
        return CursorWordEndLeftSelect;
    }(WordLeftCommand));
    exports.CursorWordEndLeftSelect = CursorWordEndLeftSelect;
    var CursorWordLeftSelect = (function (_super) {
        __extends(CursorWordLeftSelect, _super);
        function CursorWordLeftSelect() {
            return _super.call(this, {
                inSelectionMode: true,
                wordNavigationType: 0 /* WordStart */,
                id: 'cursorWordLeftSelect',
                precondition: null
            }) || this;
        }
        CursorWordLeftSelect = __decorate([
            editorCommonExtensions_1.editorCommand
        ], CursorWordLeftSelect);
        return CursorWordLeftSelect;
    }(WordLeftCommand));
    exports.CursorWordLeftSelect = CursorWordLeftSelect;
    var CursorWordStartRight = (function (_super) {
        __extends(CursorWordStartRight, _super);
        function CursorWordStartRight() {
            return _super.call(this, {
                inSelectionMode: false,
                wordNavigationType: 0 /* WordStart */,
                id: 'cursorWordStartRight',
                precondition: null
            }) || this;
        }
        CursorWordStartRight = __decorate([
            editorCommonExtensions_1.editorCommand
        ], CursorWordStartRight);
        return CursorWordStartRight;
    }(WordRightCommand));
    exports.CursorWordStartRight = CursorWordStartRight;
    var CursorWordEndRight = (function (_super) {
        __extends(CursorWordEndRight, _super);
        function CursorWordEndRight() {
            return _super.call(this, {
                inSelectionMode: false,
                wordNavigationType: 1 /* WordEnd */,
                id: 'cursorWordEndRight',
                precondition: null,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 2048 /* CtrlCmd */ | 17 /* RightArrow */,
                    mac: { primary: 512 /* Alt */ | 17 /* RightArrow */ }
                }
            }) || this;
        }
        CursorWordEndRight = __decorate([
            editorCommonExtensions_1.editorCommand
        ], CursorWordEndRight);
        return CursorWordEndRight;
    }(WordRightCommand));
    exports.CursorWordEndRight = CursorWordEndRight;
    var CursorWordRight = (function (_super) {
        __extends(CursorWordRight, _super);
        function CursorWordRight() {
            return _super.call(this, {
                inSelectionMode: false,
                wordNavigationType: 1 /* WordEnd */,
                id: 'cursorWordRight',
                precondition: null
            }) || this;
        }
        CursorWordRight = __decorate([
            editorCommonExtensions_1.editorCommand
        ], CursorWordRight);
        return CursorWordRight;
    }(WordRightCommand));
    exports.CursorWordRight = CursorWordRight;
    var CursorWordStartRightSelect = (function (_super) {
        __extends(CursorWordStartRightSelect, _super);
        function CursorWordStartRightSelect() {
            return _super.call(this, {
                inSelectionMode: true,
                wordNavigationType: 0 /* WordStart */,
                id: 'cursorWordStartRightSelect',
                precondition: null
            }) || this;
        }
        CursorWordStartRightSelect = __decorate([
            editorCommonExtensions_1.editorCommand
        ], CursorWordStartRightSelect);
        return CursorWordStartRightSelect;
    }(WordRightCommand));
    exports.CursorWordStartRightSelect = CursorWordStartRightSelect;
    var CursorWordEndRightSelect = (function (_super) {
        __extends(CursorWordEndRightSelect, _super);
        function CursorWordEndRightSelect() {
            return _super.call(this, {
                inSelectionMode: true,
                wordNavigationType: 1 /* WordEnd */,
                id: 'cursorWordEndRightSelect',
                precondition: null,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 17 /* RightArrow */,
                    mac: { primary: 512 /* Alt */ | 1024 /* Shift */ | 17 /* RightArrow */ }
                }
            }) || this;
        }
        CursorWordEndRightSelect = __decorate([
            editorCommonExtensions_1.editorCommand
        ], CursorWordEndRightSelect);
        return CursorWordEndRightSelect;
    }(WordRightCommand));
    exports.CursorWordEndRightSelect = CursorWordEndRightSelect;
    var CursorWordRightSelect = (function (_super) {
        __extends(CursorWordRightSelect, _super);
        function CursorWordRightSelect() {
            return _super.call(this, {
                inSelectionMode: true,
                wordNavigationType: 1 /* WordEnd */,
                id: 'cursorWordRightSelect',
                precondition: null
            }) || this;
        }
        CursorWordRightSelect = __decorate([
            editorCommonExtensions_1.editorCommand
        ], CursorWordRightSelect);
        return CursorWordRightSelect;
    }(WordRightCommand));
    exports.CursorWordRightSelect = CursorWordRightSelect;
    var DeleteWordCommand = (function (_super) {
        __extends(DeleteWordCommand, _super);
        function DeleteWordCommand(opts) {
            var _this = _super.call(this, opts) || this;
            _this._whitespaceHeuristics = opts.whitespaceHeuristics;
            _this._wordNavigationType = opts.wordNavigationType;
            return _this;
        }
        DeleteWordCommand.prototype.runEditorCommand = function (accessor, editor, args) {
            var _this = this;
            var config = editor.getConfiguration();
            var wordSeparators = wordCharacterClassifier_1.getMapForWordSeparators(config.wordSeparators);
            var model = editor.getModel();
            var selections = editor.getSelections();
            var commands = selections.map(function (sel) {
                var deleteRange = _this._delete(wordSeparators, model, sel, _this._whitespaceHeuristics, _this._wordNavigationType);
                return new replaceCommand_1.ReplaceCommand(deleteRange, '');
            });
            editor.pushUndoStop();
            editor.executeCommands(this.id, commands);
            editor.pushUndoStop();
        };
        return DeleteWordCommand;
    }(editorCommonExtensions_1.EditorCommand));
    exports.DeleteWordCommand = DeleteWordCommand;
    var DeleteWordLeftCommand = (function (_super) {
        __extends(DeleteWordLeftCommand, _super);
        function DeleteWordLeftCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DeleteWordLeftCommand.prototype._delete = function (wordSeparators, model, selection, whitespaceHeuristics, wordNavigationType) {
            var r = cursorWordOperations_1.WordOperations.deleteWordLeft(wordSeparators, model, selection, whitespaceHeuristics, wordNavigationType);
            if (r) {
                return r;
            }
            return new range_1.Range(1, 1, 1, 1);
        };
        return DeleteWordLeftCommand;
    }(DeleteWordCommand));
    exports.DeleteWordLeftCommand = DeleteWordLeftCommand;
    var DeleteWordRightCommand = (function (_super) {
        __extends(DeleteWordRightCommand, _super);
        function DeleteWordRightCommand() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DeleteWordRightCommand.prototype._delete = function (wordSeparators, model, selection, whitespaceHeuristics, wordNavigationType) {
            var r = cursorWordOperations_1.WordOperations.deleteWordRight(wordSeparators, model, selection, whitespaceHeuristics, wordNavigationType);
            if (r) {
                return r;
            }
            var lineCount = model.getLineCount();
            var maxColumn = model.getLineMaxColumn(lineCount);
            return new range_1.Range(lineCount, maxColumn, lineCount, maxColumn);
        };
        return DeleteWordRightCommand;
    }(DeleteWordCommand));
    exports.DeleteWordRightCommand = DeleteWordRightCommand;
    var DeleteWordStartLeft = (function (_super) {
        __extends(DeleteWordStartLeft, _super);
        function DeleteWordStartLeft() {
            return _super.call(this, {
                whitespaceHeuristics: false,
                wordNavigationType: 0 /* WordStart */,
                id: 'deleteWordStartLeft',
                precondition: editorContextKeys_1.EditorContextKeys.writable
            }) || this;
        }
        DeleteWordStartLeft = __decorate([
            editorCommonExtensions_1.editorCommand
        ], DeleteWordStartLeft);
        return DeleteWordStartLeft;
    }(DeleteWordLeftCommand));
    exports.DeleteWordStartLeft = DeleteWordStartLeft;
    var DeleteWordEndLeft = (function (_super) {
        __extends(DeleteWordEndLeft, _super);
        function DeleteWordEndLeft() {
            return _super.call(this, {
                whitespaceHeuristics: false,
                wordNavigationType: 1 /* WordEnd */,
                id: 'deleteWordEndLeft',
                precondition: editorContextKeys_1.EditorContextKeys.writable
            }) || this;
        }
        DeleteWordEndLeft = __decorate([
            editorCommonExtensions_1.editorCommand
        ], DeleteWordEndLeft);
        return DeleteWordEndLeft;
    }(DeleteWordLeftCommand));
    exports.DeleteWordEndLeft = DeleteWordEndLeft;
    var DeleteWordLeft = (function (_super) {
        __extends(DeleteWordLeft, _super);
        function DeleteWordLeft() {
            return _super.call(this, {
                whitespaceHeuristics: true,
                wordNavigationType: 0 /* WordStart */,
                id: 'deleteWordLeft',
                precondition: editorContextKeys_1.EditorContextKeys.writable,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 2048 /* CtrlCmd */ | 1 /* Backspace */,
                    mac: { primary: 512 /* Alt */ | 1 /* Backspace */ }
                }
            }) || this;
        }
        DeleteWordLeft = __decorate([
            editorCommonExtensions_1.editorCommand
        ], DeleteWordLeft);
        return DeleteWordLeft;
    }(DeleteWordLeftCommand));
    exports.DeleteWordLeft = DeleteWordLeft;
    var DeleteWordStartRight = (function (_super) {
        __extends(DeleteWordStartRight, _super);
        function DeleteWordStartRight() {
            return _super.call(this, {
                whitespaceHeuristics: false,
                wordNavigationType: 0 /* WordStart */,
                id: 'deleteWordStartRight',
                precondition: editorContextKeys_1.EditorContextKeys.writable
            }) || this;
        }
        DeleteWordStartRight = __decorate([
            editorCommonExtensions_1.editorCommand
        ], DeleteWordStartRight);
        return DeleteWordStartRight;
    }(DeleteWordRightCommand));
    exports.DeleteWordStartRight = DeleteWordStartRight;
    var DeleteWordEndRight = (function (_super) {
        __extends(DeleteWordEndRight, _super);
        function DeleteWordEndRight() {
            return _super.call(this, {
                whitespaceHeuristics: false,
                wordNavigationType: 1 /* WordEnd */,
                id: 'deleteWordEndRight',
                precondition: editorContextKeys_1.EditorContextKeys.writable
            }) || this;
        }
        DeleteWordEndRight = __decorate([
            editorCommonExtensions_1.editorCommand
        ], DeleteWordEndRight);
        return DeleteWordEndRight;
    }(DeleteWordRightCommand));
    exports.DeleteWordEndRight = DeleteWordEndRight;
    var DeleteWordRight = (function (_super) {
        __extends(DeleteWordRight, _super);
        function DeleteWordRight() {
            return _super.call(this, {
                whitespaceHeuristics: true,
                wordNavigationType: 1 /* WordEnd */,
                id: 'deleteWordRight',
                precondition: editorContextKeys_1.EditorContextKeys.writable,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 2048 /* CtrlCmd */ | 20 /* Delete */,
                    mac: { primary: 512 /* Alt */ | 20 /* Delete */ }
                }
            }) || this;
        }
        DeleteWordRight = __decorate([
            editorCommonExtensions_1.editorCommand
        ], DeleteWordRight);
        return DeleteWordRight;
    }(DeleteWordRightCommand));
    exports.DeleteWordRight = DeleteWordRight;
});
//# sourceMappingURL=wordOperations.js.map