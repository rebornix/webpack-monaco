/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "vs/base/common/lifecycle", "vs/base/common/platform", "vs/editor/browser/editorBrowser", "vs/editor/browser/editorBrowserExtensions", "vs/editor/common/core/position", "vs/editor/common/core/range", "vs/editor/common/core/selection", "../common/dragAndDropCommand", "vs/editor/common/model/textModelWithDecorations", "vs/css!./dnd"], function (require, exports, lifecycle_1, platform_1, editorBrowser_1, editorBrowserExtensions_1, position_1, range_1, selection_1, dragAndDropCommand_1, textModelWithDecorations_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var DragAndDropController = (function () {
        function DragAndDropController(editor) {
            var _this = this;
            this._editor = editor;
            this._toUnhook = [];
            this._toUnhook.push(this._editor.onMouseDown(function (e) { return _this._onEditorMouseDown(e); }));
            this._toUnhook.push(this._editor.onMouseUp(function (e) { return _this._onEditorMouseUp(e); }));
            this._toUnhook.push(this._editor.onMouseDrag(function (e) { return _this._onEditorMouseDrag(e); }));
            this._toUnhook.push(this._editor.onMouseDrop(function (e) { return _this._onEditorMouseDrop(e); }));
            this._toUnhook.push(this._editor.onKeyDown(function (e) { return _this.onEditorKeyDown(e); }));
            this._toUnhook.push(this._editor.onKeyUp(function (e) { return _this.onEditorKeyUp(e); }));
            this._dndDecorationIds = [];
            this._mouseDown = false;
            this._modiferPressed = false;
            this._dragSelection = null;
        }
        DragAndDropController_1 = DragAndDropController;
        DragAndDropController.get = function (editor) {
            return editor.getContribution(DragAndDropController_1.ID);
        };
        DragAndDropController.prototype.onEditorKeyDown = function (e) {
            if (!this._editor.getConfiguration().dragAndDrop) {
                return;
            }
            if (e[DragAndDropController_1.TRIGGER_MODIFIER]) {
                this._modiferPressed = true;
            }
            if (this._mouseDown && e[DragAndDropController_1.TRIGGER_MODIFIER]) {
                this._editor.updateOptions({
                    mouseStyle: 'copy'
                });
            }
        };
        DragAndDropController.prototype.onEditorKeyUp = function (e) {
            if (!this._editor.getConfiguration().dragAndDrop) {
                return;
            }
            if (e[DragAndDropController_1.TRIGGER_MODIFIER]) {
                this._modiferPressed = false;
            }
            if (this._mouseDown && e.keyCode === DragAndDropController_1.TRIGGER_KEY_VALUE) {
                this._editor.updateOptions({
                    mouseStyle: 'default'
                });
            }
        };
        DragAndDropController.prototype._onEditorMouseDown = function (mouseEvent) {
            this._mouseDown = true;
        };
        DragAndDropController.prototype._onEditorMouseUp = function (mouseEvent) {
            this._mouseDown = false;
            // Whenever users release the mouse, the drag and drop operation should finish and the cursor should revert to text.
            this._editor.updateOptions({
                mouseStyle: 'text'
            });
        };
        DragAndDropController.prototype._onEditorMouseDrag = function (mouseEvent) {
            var target = mouseEvent.target;
            if (this._dragSelection === null) {
                var possibleSelections = this._editor.getSelections().filter(function (selection) { return selection.containsPosition(target.position); });
                if (possibleSelections.length === 1) {
                    this._dragSelection = possibleSelections[0];
                }
                else {
                    return;
                }
            }
            if (mouseEvent.event[DragAndDropController_1.TRIGGER_MODIFIER]) {
                this._editor.updateOptions({
                    mouseStyle: 'copy'
                });
            }
            else {
                this._editor.updateOptions({
                    mouseStyle: 'default'
                });
            }
            if (this._dragSelection.containsPosition(target.position)) {
                this._removeDecoration();
            }
            else {
                this.showAt(target.position);
            }
        };
        DragAndDropController.prototype._onEditorMouseDrop = function (mouseEvent) {
            if (mouseEvent.target && (this._hitContent(mouseEvent.target) || this._hitMargin(mouseEvent.target)) && mouseEvent.target.position) {
                var newCursorPosition_1 = new position_1.Position(mouseEvent.target.position.lineNumber, mouseEvent.target.position.column);
                if (this._dragSelection === null) {
                    var newSelections = this._editor.getSelections().map(function (selection) {
                        if (selection.containsPosition(newCursorPosition_1)) {
                            return new selection_1.Selection(newCursorPosition_1.lineNumber, newCursorPosition_1.column, newCursorPosition_1.lineNumber, newCursorPosition_1.column);
                        }
                        else {
                            return selection;
                        }
                    });
                    this._editor.setSelections(newSelections);
                }
                else if (!this._dragSelection.containsPosition(newCursorPosition_1) ||
                    ((mouseEvent.event[DragAndDropController_1.TRIGGER_MODIFIER] ||
                        this._modiferPressed) && (this._dragSelection.getEndPosition().equals(newCursorPosition_1) || this._dragSelection.getStartPosition().equals(newCursorPosition_1)) // we allow users to paste content beside the selection
                    )) {
                    this._editor.pushUndoStop();
                    this._editor.executeCommand(DragAndDropController_1.ID, new dragAndDropCommand_1.DragAndDropCommand(this._dragSelection, newCursorPosition_1, mouseEvent.event[DragAndDropController_1.TRIGGER_MODIFIER] || this._modiferPressed));
                    this._editor.pushUndoStop();
                }
            }
            this._editor.updateOptions({
                mouseStyle: 'text'
            });
            this._removeDecoration();
            this._dragSelection = null;
            this._mouseDown = false;
        };
        DragAndDropController.prototype.showAt = function (position) {
            var _this = this;
            this._editor.changeDecorations(function (changeAccessor) {
                var newDecorations = [];
                newDecorations.push({
                    range: new range_1.Range(position.lineNumber, position.column, position.lineNumber, position.column),
                    options: DragAndDropController_1._DECORATION_OPTIONS
                });
                _this._dndDecorationIds = changeAccessor.deltaDecorations(_this._dndDecorationIds, newDecorations);
            });
            this._editor.revealPosition(position);
        };
        DragAndDropController.prototype._removeDecoration = function () {
            var _this = this;
            this._editor.changeDecorations(function (changeAccessor) {
                changeAccessor.deltaDecorations(_this._dndDecorationIds, []);
            });
        };
        DragAndDropController.prototype._hitContent = function (target) {
            return target.type === editorBrowser_1.MouseTargetType.CONTENT_TEXT ||
                target.type === editorBrowser_1.MouseTargetType.CONTENT_EMPTY;
        };
        DragAndDropController.prototype._hitMargin = function (target) {
            return target.type === editorBrowser_1.MouseTargetType.GUTTER_GLYPH_MARGIN ||
                target.type === editorBrowser_1.MouseTargetType.GUTTER_LINE_NUMBERS ||
                target.type === editorBrowser_1.MouseTargetType.GUTTER_LINE_DECORATIONS;
        };
        DragAndDropController.prototype.getId = function () {
            return DragAndDropController_1.ID;
        };
        DragAndDropController.prototype.dispose = function () {
            this._removeDecoration();
            this._dragSelection = null;
            this._mouseDown = false;
            this._modiferPressed = false;
            this._toUnhook = lifecycle_1.dispose(this._toUnhook);
        };
        DragAndDropController.ID = 'editor.contrib.dragAndDrop';
        DragAndDropController.TRIGGER_MODIFIER = platform_1.isMacintosh ? 'altKey' : 'ctrlKey';
        DragAndDropController.TRIGGER_KEY_VALUE = platform_1.isMacintosh ? 6 /* Alt */ : 5 /* Ctrl */;
        DragAndDropController._DECORATION_OPTIONS = textModelWithDecorations_1.ModelDecorationOptions.register({
            className: 'dnd-target'
        });
        DragAndDropController = DragAndDropController_1 = __decorate([
            editorBrowserExtensions_1.editorContribution
        ], DragAndDropController);
        return DragAndDropController;
        var DragAndDropController_1;
    }());
    exports.DragAndDropController = DragAndDropController;
});
//# sourceMappingURL=dnd.js.map