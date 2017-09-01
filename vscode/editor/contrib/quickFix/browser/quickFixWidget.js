/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/async", "vs/base/browser/dom", "vs/editor/common/core/position", "vs/base/common/actions", "vs/base/common/event"], function (require, exports, async_1, dom_1, position_1, actions_1, event_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var QuickFixContextMenu = (function () {
        function QuickFixContextMenu(editor, contextMenuService, commandService) {
            this._onDidExecuteCodeAction = new event_1.Emitter();
            this.onDidExecuteCodeAction = this._onDidExecuteCodeAction.event;
            this._editor = editor;
            this._contextMenuService = contextMenuService;
            this._commandService = commandService;
        }
        QuickFixContextMenu.prototype.show = function (fixes, at) {
            var _this = this;
            var actions = fixes.then(function (value) {
                return value.map(function (command) {
                    return new actions_1.Action(command.id, command.title, undefined, true, function () {
                        return async_1.always((_a = _this._commandService).executeCommand.apply(_a, [command.id].concat(command.arguments)), function () { return _this._onDidExecuteCodeAction.fire(undefined); });
                        var _a;
                    });
                });
            });
            this._contextMenuService.showContextMenu({
                getAnchor: function () {
                    if (position_1.Position.isIPosition(at)) {
                        at = _this._toCoords(at);
                    }
                    return at;
                },
                getActions: function () { return actions; },
                onHide: function () { _this._visible = false; }
            });
        };
        Object.defineProperty(QuickFixContextMenu.prototype, "isVisible", {
            get: function () {
                return this._visible;
            },
            enumerable: true,
            configurable: true
        });
        QuickFixContextMenu.prototype._toCoords = function (position) {
            this._editor.revealPosition(position);
            this._editor.render();
            // Translate to absolute editor position
            var cursorCoords = this._editor.getScrolledVisiblePosition(this._editor.getPosition());
            var editorCoords = dom_1.getDomNodePagePosition(this._editor.getDomNode());
            var x = editorCoords.left + cursorCoords.left;
            var y = editorCoords.top + cursorCoords.top + cursorCoords.height;
            return { x: x, y: y };
        };
        return QuickFixContextMenu;
    }());
    exports.QuickFixContextMenu = QuickFixContextMenu;
});
//# sourceMappingURL=quickFixWidget.js.map