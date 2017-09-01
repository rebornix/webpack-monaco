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
define(["require", "exports", "vs/nls", "vs/base/common/winjs.base", "vs/base/common/actions", "vs/base/common/platform", "vs/base/common/errors", "vs/base/browser/dom", "vs/base/common/keyCodes"], function (require, exports, nls, winjs_base_1, actions_1, platform, errors, dom, keyCodes_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ClickBehavior;
    (function (ClickBehavior) {
        /**
         * Handle the click when the mouse button is pressed but not released yet.
         */
        ClickBehavior[ClickBehavior["ON_MOUSE_DOWN"] = 0] = "ON_MOUSE_DOWN";
        /**
         * Handle the click when the mouse button is released.
         */
        ClickBehavior[ClickBehavior["ON_MOUSE_UP"] = 1] = "ON_MOUSE_UP";
    })(ClickBehavior = exports.ClickBehavior || (exports.ClickBehavior = {}));
    var KeybindingDispatcher = (function () {
        function KeybindingDispatcher() {
            this._arr = [];
        }
        KeybindingDispatcher.prototype.set = function (keybinding, callback) {
            this._arr.push({
                keybinding: keyCodes_1.createKeybinding(keybinding, platform.OS),
                callback: callback
            });
        };
        KeybindingDispatcher.prototype.dispatch = function (keybinding) {
            // Loop from the last to the first to handle overwrites
            for (var i = this._arr.length - 1; i >= 0; i--) {
                var item = this._arr[i];
                if (keybinding.equals(item.keybinding)) {
                    return item.callback;
                }
            }
            return null;
        };
        return KeybindingDispatcher;
    }());
    exports.KeybindingDispatcher = KeybindingDispatcher;
    var DefaultController = (function () {
        function DefaultController(options) {
            if (options === void 0) { options = { clickBehavior: ClickBehavior.ON_MOUSE_UP, keyboardSupport: true }; }
            var _this = this;
            this.options = options;
            this.downKeyBindingDispatcher = new KeybindingDispatcher();
            this.upKeyBindingDispatcher = new KeybindingDispatcher();
            if (typeof options.keyboardSupport !== 'boolean' || options.keyboardSupport) {
                this.downKeyBindingDispatcher.set(16 /* UpArrow */, function (t, e) { return _this.onUp(t, e); });
                this.downKeyBindingDispatcher.set(18 /* DownArrow */, function (t, e) { return _this.onDown(t, e); });
                this.downKeyBindingDispatcher.set(15 /* LeftArrow */, function (t, e) { return _this.onLeft(t, e); });
                this.downKeyBindingDispatcher.set(17 /* RightArrow */, function (t, e) { return _this.onRight(t, e); });
                if (platform.isMacintosh) {
                    this.downKeyBindingDispatcher.set(2048 /* CtrlCmd */ | 16 /* UpArrow */, function (t, e) { return _this.onLeft(t, e); });
                    this.downKeyBindingDispatcher.set(256 /* WinCtrl */ | 44 /* KEY_N */, function (t, e) { return _this.onDown(t, e); });
                    this.downKeyBindingDispatcher.set(256 /* WinCtrl */ | 46 /* KEY_P */, function (t, e) { return _this.onUp(t, e); });
                }
                this.downKeyBindingDispatcher.set(11 /* PageUp */, function (t, e) { return _this.onPageUp(t, e); });
                this.downKeyBindingDispatcher.set(12 /* PageDown */, function (t, e) { return _this.onPageDown(t, e); });
                this.downKeyBindingDispatcher.set(14 /* Home */, function (t, e) { return _this.onHome(t, e); });
                this.downKeyBindingDispatcher.set(13 /* End */, function (t, e) { return _this.onEnd(t, e); });
                this.downKeyBindingDispatcher.set(10 /* Space */, function (t, e) { return _this.onSpace(t, e); });
                this.downKeyBindingDispatcher.set(9 /* Escape */, function (t, e) { return _this.onEscape(t, e); });
                this.upKeyBindingDispatcher.set(3 /* Enter */, this.onEnter.bind(this));
                this.upKeyBindingDispatcher.set(2048 /* CtrlCmd */ | 3 /* Enter */, this.onEnter.bind(this));
            }
        }
        DefaultController.prototype.onMouseDown = function (tree, element, event, origin) {
            if (origin === void 0) { origin = 'mouse'; }
            if (this.options.clickBehavior === ClickBehavior.ON_MOUSE_DOWN && (event.leftButton || event.middleButton)) {
                if (event.target) {
                    if (event.target.tagName && event.target.tagName.toLowerCase() === 'input') {
                        return false; // Ignore event if target is a form input field (avoids browser specific issues)
                    }
                    if (dom.findParentWithClass(event.target, 'monaco-action-bar', 'row')) {
                        return false; // Ignore event if target is over an action bar of the row
                    }
                }
                // Propagate to onLeftClick now
                return this.onLeftClick(tree, element, event, origin);
            }
            return false;
        };
        DefaultController.prototype.onClick = function (tree, element, event) {
            var isMac = platform.isMacintosh;
            // A Ctrl click on the Mac is a context menu event
            if (isMac && event.ctrlKey) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
            if (event.target && event.target.tagName && event.target.tagName.toLowerCase() === 'input') {
                return false; // Ignore event if target is a form input field (avoids browser specific issues)
            }
            if (this.options.clickBehavior === ClickBehavior.ON_MOUSE_DOWN && (event.leftButton || event.middleButton)) {
                return false; // Already handled by onMouseDown
            }
            return this.onLeftClick(tree, element, event);
        };
        DefaultController.prototype.onLeftClick = function (tree, element, eventish, origin) {
            if (origin === void 0) { origin = 'mouse'; }
            var payload = { origin: origin, originalEvent: eventish };
            if (tree.getInput() === element) {
                tree.clearFocus(payload);
                tree.clearSelection(payload);
            }
            else {
                var isMouseDown = eventish && eventish.browserEvent && eventish.browserEvent.type === 'mousedown';
                if (!isMouseDown) {
                    eventish.preventDefault(); // we cannot preventDefault onMouseDown because this would break DND otherwise
                }
                eventish.stopPropagation();
                tree.DOMFocus();
                tree.setSelection([element], payload);
                tree.setFocus(element, payload);
                if (tree.isExpanded(element)) {
                    tree.collapse(element).done(null, errors.onUnexpectedError);
                }
                else {
                    tree.expand(element).done(null, errors.onUnexpectedError);
                }
            }
            return true;
        };
        DefaultController.prototype.onContextMenu = function (tree, element, event) {
            if (event.target && event.target.tagName && event.target.tagName.toLowerCase() === 'input') {
                return false; // allow context menu on input fields
            }
            // Prevent native context menu from showing up
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }
            return false;
        };
        DefaultController.prototype.onTap = function (tree, element, event) {
            var target = event.initialTarget;
            if (target && target.tagName && target.tagName.toLowerCase() === 'input') {
                return false; // Ignore event if target is a form input field (avoids browser specific issues)
            }
            return this.onLeftClick(tree, element, event, 'touch');
        };
        DefaultController.prototype.onKeyDown = function (tree, event) {
            return this.onKey(this.downKeyBindingDispatcher, tree, event);
        };
        DefaultController.prototype.onKeyUp = function (tree, event) {
            return this.onKey(this.upKeyBindingDispatcher, tree, event);
        };
        DefaultController.prototype.onKey = function (bindings, tree, event) {
            var handler = bindings.dispatch(event.toKeybinding());
            if (handler) {
                if (handler(tree, event)) {
                    event.preventDefault();
                    event.stopPropagation();
                    return true;
                }
            }
            return false;
        };
        DefaultController.prototype.onUp = function (tree, event) {
            var payload = { origin: 'keyboard', originalEvent: event };
            if (tree.getHighlight()) {
                tree.clearHighlight(payload);
            }
            else {
                tree.focusPrevious(1, payload);
                tree.reveal(tree.getFocus()).done(null, errors.onUnexpectedError);
            }
            return true;
        };
        DefaultController.prototype.onPageUp = function (tree, event) {
            var payload = { origin: 'keyboard', originalEvent: event };
            if (tree.getHighlight()) {
                tree.clearHighlight(payload);
            }
            else {
                tree.focusPreviousPage(payload);
                tree.reveal(tree.getFocus()).done(null, errors.onUnexpectedError);
            }
            return true;
        };
        DefaultController.prototype.onDown = function (tree, event) {
            var payload = { origin: 'keyboard', originalEvent: event };
            if (tree.getHighlight()) {
                tree.clearHighlight(payload);
            }
            else {
                tree.focusNext(1, payload);
                tree.reveal(tree.getFocus()).done(null, errors.onUnexpectedError);
            }
            return true;
        };
        DefaultController.prototype.onPageDown = function (tree, event) {
            var payload = { origin: 'keyboard', originalEvent: event };
            if (tree.getHighlight()) {
                tree.clearHighlight(payload);
            }
            else {
                tree.focusNextPage(payload);
                tree.reveal(tree.getFocus()).done(null, errors.onUnexpectedError);
            }
            return true;
        };
        DefaultController.prototype.onHome = function (tree, event) {
            var payload = { origin: 'keyboard', originalEvent: event };
            if (tree.getHighlight()) {
                tree.clearHighlight(payload);
            }
            else {
                tree.focusFirst(payload);
                tree.reveal(tree.getFocus()).done(null, errors.onUnexpectedError);
            }
            return true;
        };
        DefaultController.prototype.onEnd = function (tree, event) {
            var payload = { origin: 'keyboard', originalEvent: event };
            if (tree.getHighlight()) {
                tree.clearHighlight(payload);
            }
            else {
                tree.focusLast(payload);
                tree.reveal(tree.getFocus()).done(null, errors.onUnexpectedError);
            }
            return true;
        };
        DefaultController.prototype.onLeft = function (tree, event) {
            var payload = { origin: 'keyboard', originalEvent: event };
            if (tree.getHighlight()) {
                tree.clearHighlight(payload);
            }
            else {
                var focus = tree.getFocus();
                tree.collapse(focus).then(function (didCollapse) {
                    if (focus && !didCollapse) {
                        tree.focusParent(payload);
                        return tree.reveal(tree.getFocus());
                    }
                    return undefined;
                }).done(null, errors.onUnexpectedError);
            }
            return true;
        };
        DefaultController.prototype.onRight = function (tree, event) {
            var payload = { origin: 'keyboard', originalEvent: event };
            if (tree.getHighlight()) {
                tree.clearHighlight(payload);
            }
            else {
                var focus = tree.getFocus();
                tree.expand(focus).then(function (didExpand) {
                    if (focus && !didExpand) {
                        tree.focusFirstChild(payload);
                        return tree.reveal(tree.getFocus());
                    }
                    return undefined;
                }).done(null, errors.onUnexpectedError);
            }
            return true;
        };
        DefaultController.prototype.onEnter = function (tree, event) {
            var payload = { origin: 'keyboard', originalEvent: event };
            if (tree.getHighlight()) {
                return false;
            }
            var focus = tree.getFocus();
            if (focus) {
                tree.setSelection([focus], payload);
            }
            return true;
        };
        DefaultController.prototype.onSpace = function (tree, event) {
            if (tree.getHighlight()) {
                return false;
            }
            var focus = tree.getFocus();
            if (focus) {
                tree.toggleExpansion(focus);
            }
            return true;
        };
        DefaultController.prototype.onEscape = function (tree, event) {
            var payload = { origin: 'keyboard', originalEvent: event };
            if (tree.getHighlight()) {
                tree.clearHighlight(payload);
                return true;
            }
            if (tree.getSelection().length) {
                tree.clearSelection(payload);
                return true;
            }
            if (tree.getFocus()) {
                tree.clearFocus(payload);
                return true;
            }
            return false;
        };
        return DefaultController;
    }());
    exports.DefaultController = DefaultController;
    var DefaultDragAndDrop = (function () {
        function DefaultDragAndDrop() {
        }
        DefaultDragAndDrop.prototype.getDragURI = function (tree, element) {
            return null;
        };
        DefaultDragAndDrop.prototype.onDragStart = function (tree, data, originalEvent) {
            return;
        };
        DefaultDragAndDrop.prototype.onDragOver = function (tree, data, targetElement, originalEvent) {
            return null;
        };
        DefaultDragAndDrop.prototype.drop = function (tree, data, targetElement, originalEvent) {
            return;
        };
        return DefaultDragAndDrop;
    }());
    exports.DefaultDragAndDrop = DefaultDragAndDrop;
    var DefaultFilter = (function () {
        function DefaultFilter() {
        }
        DefaultFilter.prototype.isVisible = function (tree, element) {
            return true;
        };
        return DefaultFilter;
    }());
    exports.DefaultFilter = DefaultFilter;
    var DefaultSorter = (function () {
        function DefaultSorter() {
        }
        DefaultSorter.prototype.compare = function (tree, element, otherElement) {
            return 0;
        };
        return DefaultSorter;
    }());
    exports.DefaultSorter = DefaultSorter;
    var DefaultAccessibilityProvider = (function () {
        function DefaultAccessibilityProvider() {
        }
        DefaultAccessibilityProvider.prototype.getAriaLabel = function (tree, element) {
            return null;
        };
        return DefaultAccessibilityProvider;
    }());
    exports.DefaultAccessibilityProvider = DefaultAccessibilityProvider;
    var CollapseAllAction = (function (_super) {
        __extends(CollapseAllAction, _super);
        function CollapseAllAction(viewer, enabled) {
            var _this = _super.call(this, 'vs.tree.collapse', nls.localize('collapse', "Collapse"), 'monaco-tree-action collapse-all', enabled) || this;
            _this.viewer = viewer;
            return _this;
        }
        CollapseAllAction.prototype.run = function (context) {
            if (this.viewer.getHighlight()) {
                return winjs_base_1.TPromise.as(null); // Global action disabled if user is in edit mode from another action
            }
            this.viewer.collapseAll();
            this.viewer.clearSelection();
            this.viewer.clearFocus();
            this.viewer.DOMFocus();
            this.viewer.focusFirst();
            return winjs_base_1.TPromise.as(null);
        };
        return CollapseAllAction;
    }(actions_1.Action));
    exports.CollapseAllAction = CollapseAllAction;
});
//# sourceMappingURL=treeDefaults.js.map