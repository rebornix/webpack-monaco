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
define(["require", "exports", "vs/editor/common/editorCommonExtensions", "vs/base/common/lifecycle", "vs/editor/common/editorContextKeys", "vs/editor/browser/editorBrowserExtensions"], function (require, exports, editorCommonExtensions_1, lifecycle_1, editorContextKeys_1, editorBrowserExtensions_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var CursorState = (function () {
        function CursorState(selections) {
            this.selections = selections;
        }
        CursorState.prototype.equals = function (other) {
            var thisLen = this.selections.length;
            var otherLen = other.selections.length;
            if (thisLen !== otherLen) {
                return false;
            }
            for (var i = 0; i < thisLen; i++) {
                if (!this.selections[i].equalsSelection(other.selections[i])) {
                    return false;
                }
            }
            return true;
        };
        return CursorState;
    }());
    var CursorUndoController = (function (_super) {
        __extends(CursorUndoController, _super);
        function CursorUndoController(editor) {
            var _this = _super.call(this) || this;
            _this._editor = editor;
            _this._isCursorUndo = false;
            _this._undoStack = [];
            _this._prevState = _this._readState();
            _this._register(editor.onDidChangeModel(function (e) {
                _this._undoStack = [];
                _this._prevState = null;
            }));
            _this._register(editor.onDidChangeModelContent(function (e) {
                _this._undoStack = [];
                _this._prevState = null;
            }));
            _this._register(editor.onDidChangeCursorSelection(function (e) {
                if (!_this._isCursorUndo && _this._prevState) {
                    _this._undoStack.push(_this._prevState);
                    if (_this._undoStack.length > 50) {
                        // keep the cursor undo stack bounded
                        _this._undoStack = _this._undoStack.splice(0, _this._undoStack.length - 50);
                    }
                }
                _this._prevState = _this._readState();
            }));
            return _this;
        }
        CursorUndoController_1 = CursorUndoController;
        CursorUndoController.get = function (editor) {
            return editor.getContribution(CursorUndoController_1.ID);
        };
        CursorUndoController.prototype._readState = function () {
            if (!this._editor.getModel()) {
                // no model => no state
                return null;
            }
            return new CursorState(this._editor.getSelections());
        };
        CursorUndoController.prototype.getId = function () {
            return CursorUndoController_1.ID;
        };
        CursorUndoController.prototype.cursorUndo = function () {
            var currState = new CursorState(this._editor.getSelections());
            while (this._undoStack.length > 0) {
                var prevState = this._undoStack.pop();
                if (!prevState.equals(currState)) {
                    this._isCursorUndo = true;
                    this._editor.setSelections(prevState.selections);
                    this._isCursorUndo = false;
                    return;
                }
            }
        };
        CursorUndoController.ID = 'editor.contrib.cursorUndoController';
        CursorUndoController = CursorUndoController_1 = __decorate([
            editorBrowserExtensions_1.editorContribution
        ], CursorUndoController);
        return CursorUndoController;
        var CursorUndoController_1;
    }(lifecycle_1.Disposable));
    exports.CursorUndoController = CursorUndoController;
    var CursorUndo = (function (_super) {
        __extends(CursorUndo, _super);
        function CursorUndo() {
            return _super.call(this, {
                id: 'cursorUndo',
                precondition: null,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 2048 /* CtrlCmd */ | 51 /* KEY_U */
                }
            }) || this;
        }
        CursorUndo.prototype.runEditorCommand = function (accessor, editor, args) {
            CursorUndoController.get(editor).cursorUndo();
        };
        CursorUndo = __decorate([
            editorCommonExtensions_1.editorCommand
        ], CursorUndo);
        return CursorUndo;
    }(editorCommonExtensions_1.EditorCommand));
    exports.CursorUndo = CursorUndo;
});
//# sourceMappingURL=cursorUndo.js.map