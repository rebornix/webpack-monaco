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
define(["require", "exports", "vs/nls", "vs/editor/common/core/range", "vs/editor/common/editorContextKeys", "vs/editor/common/editorCommonExtensions", "vs/editor/common/commands/replaceCommand"], function (require, exports, nls, range_1, editorContextKeys_1, editorCommonExtensions_1, replaceCommand_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var TransposeLettersAction = (function (_super) {
        __extends(TransposeLettersAction, _super);
        function TransposeLettersAction() {
            return _super.call(this, {
                id: 'editor.action.transposeLetters',
                label: nls.localize('transposeLetters.label', "Transpose Letters"),
                alias: 'Transpose Letters',
                precondition: editorContextKeys_1.EditorContextKeys.writable,
                kbOpts: {
                    kbExpr: editorContextKeys_1.EditorContextKeys.textFocus,
                    primary: 0,
                    mac: {
                        primary: 256 /* WinCtrl */ | 50 /* KEY_T */
                    }
                }
            }) || this;
        }
        TransposeLettersAction.prototype.run = function (accessor, editor) {
            var model = editor.getModel();
            var commands = [];
            var selections = editor.getSelections();
            for (var i = 0; i < selections.length; i++) {
                var selection = selections[i];
                if (!selection.isEmpty()) {
                    continue;
                }
                var lineNumber = selection.startLineNumber;
                var column = selection.startColumn;
                if (column === 1) {
                    // at the beginning of line
                    continue;
                }
                var maxColumn = model.getLineMaxColumn(lineNumber);
                if (column === maxColumn) {
                    // at the end of line
                    continue;
                }
                var lineContent = model.getLineContent(lineNumber);
                var charToTheLeft = lineContent.charAt(column - 2);
                var charToTheRight = lineContent.charAt(column - 1);
                var replaceRange = new range_1.Range(lineNumber, column - 1, lineNumber, column + 1);
                commands.push(new replaceCommand_1.ReplaceCommand(replaceRange, charToTheRight + charToTheLeft));
            }
            if (commands.length > 0) {
                editor.pushUndoStop();
                editor.executeCommands(this.id, commands);
                editor.pushUndoStop();
            }
        };
        TransposeLettersAction = __decorate([
            editorCommonExtensions_1.editorAction
        ], TransposeLettersAction);
        return TransposeLettersAction;
    }(editorCommonExtensions_1.EditorAction));
});
//# sourceMappingURL=transpose.js.map