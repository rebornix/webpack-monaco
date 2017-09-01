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
define(["require", "exports", "vs/nls", "vs/editor/common/editorContextKeys", "vs/editor/common/editorCommonExtensions", "./moveCaretCommand"], function (require, exports, nls, editorContextKeys_1, editorCommonExtensions_1, moveCaretCommand_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var MoveCaretAction = (function (_super) {
        __extends(MoveCaretAction, _super);
        function MoveCaretAction(left, opts) {
            var _this = _super.call(this, opts) || this;
            _this.left = left;
            return _this;
        }
        MoveCaretAction.prototype.run = function (accessor, editor) {
            var commands = [];
            var selections = editor.getSelections();
            for (var i = 0; i < selections.length; i++) {
                commands.push(new moveCaretCommand_1.MoveCaretCommand(selections[i], this.left));
            }
            editor.pushUndoStop();
            editor.executeCommands(this.id, commands);
            editor.pushUndoStop();
        };
        return MoveCaretAction;
    }(editorCommonExtensions_1.EditorAction));
    var MoveCaretLeftAction = (function (_super) {
        __extends(MoveCaretLeftAction, _super);
        function MoveCaretLeftAction() {
            return _super.call(this, true, {
                id: 'editor.action.moveCarretLeftAction',
                label: nls.localize('caret.moveLeft', "Move Caret Left"),
                alias: 'Move Caret Left',
                precondition: editorContextKeys_1.EditorContextKeys.writable
            }) || this;
        }
        MoveCaretLeftAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], MoveCaretLeftAction);
        return MoveCaretLeftAction;
    }(MoveCaretAction));
    var MoveCaretRightAction = (function (_super) {
        __extends(MoveCaretRightAction, _super);
        function MoveCaretRightAction() {
            return _super.call(this, false, {
                id: 'editor.action.moveCarretRightAction',
                label: nls.localize('caret.moveRight', "Move Caret Right"),
                alias: 'Move Caret Right',
                precondition: editorContextKeys_1.EditorContextKeys.writable
            }) || this;
        }
        MoveCaretRightAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], MoveCaretRightAction);
        return MoveCaretRightAction;
    }(MoveCaretAction));
});
//# sourceMappingURL=caretOperations.js.map