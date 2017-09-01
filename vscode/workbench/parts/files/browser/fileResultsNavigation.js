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
define(["require", "exports", "vs/base/common/lifecycle", "vs/base/common/async", "vs/base/common/event"], function (require, exports, lifecycle_1, async_1, event_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FileResultsNavigation = (function (_super) {
        __extends(FileResultsNavigation, _super);
        function FileResultsNavigation(tree) {
            var _this = _super.call(this) || this;
            _this.tree = tree;
            _this._openFile = new event_1.Emitter();
            _this.openFile = _this._openFile.event;
            _this.throttler = new async_1.Throttler();
            _this._register(_this.tree.addListener('focus', function (e) { return _this.onFocus(e); }));
            _this._register(_this.tree.addListener('selection', function (e) { return _this.onSelection(e); }));
            return _this;
        }
        FileResultsNavigation.prototype.onFocus = function (event) {
            var element = this.tree.getFocus();
            this.tree.setSelection([element], { fromFocus: true });
            this._openFile.fire({
                editorOptions: {
                    preserveFocus: true,
                    pinned: false,
                    revealIfVisible: true
                },
                sideBySide: false,
                element: element,
                payload: event.payload
            });
        };
        FileResultsNavigation.prototype.onSelection = function (_a) {
            var payload = _a.payload;
            if (payload && payload.fromFocus) {
                return;
            }
            var keyboard = payload && payload.origin === 'keyboard';
            var originalEvent = payload && payload.originalEvent;
            var pinned = (payload && payload.origin === 'mouse' && originalEvent && originalEvent.detail === 2);
            if (pinned && originalEvent) {
                originalEvent.preventDefault(); // focus moves to editor, we need to prevent default
            }
            var sideBySide = (originalEvent && (originalEvent.ctrlKey || originalEvent.metaKey));
            var preserveFocus = !((keyboard && (!payload || !payload.preserveFocus)) || pinned || (payload && payload.focusEditor));
            this._openFile.fire({
                editorOptions: {
                    preserveFocus: preserveFocus,
                    pinned: pinned,
                    revealIfVisible: !sideBySide
                },
                sideBySide: sideBySide,
                element: this.tree.getSelection()[0],
                payload: payload
            });
        };
        return FileResultsNavigation;
    }(lifecycle_1.Disposable));
    exports.default = FileResultsNavigation;
});
//# sourceMappingURL=fileResultsNavigation.js.map