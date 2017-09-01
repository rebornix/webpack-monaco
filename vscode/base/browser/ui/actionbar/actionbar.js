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
define(["require", "exports", "vs/nls", "vs/base/common/lifecycle", "vs/base/browser/builder", "vs/base/browser/ui/selectBox/selectBox", "vs/base/common/actions", "vs/base/browser/dom", "vs/base/common/events", "vs/base/common/types", "vs/base/common/eventEmitter", "vs/base/browser/touch", "vs/base/browser/keyboardEvent", "vs/css!./actionbar"], function (require, exports, nls, lifecycle, builder_1, selectBox_1, actions_1, DOM, events_1, types, eventEmitter_1, touch_1, keyboardEvent_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseActionItem = (function (_super) {
        __extends(BaseActionItem, _super);
        function BaseActionItem(context, action, options) {
            var _this = _super.call(this) || this;
            _this.options = options;
            _this._callOnDispose = [];
            _this._context = context || _this;
            _this._action = action;
            if (action instanceof actions_1.Action) {
                _this._callOnDispose.push(action.onDidChange(function (event) {
                    if (!_this.builder) {
                        // we have not been rendered yet, so there
                        // is no point in updating the UI
                        return;
                    }
                    _this._handleActionChangeEvent(event);
                }));
            }
            return _this;
        }
        BaseActionItem.prototype._handleActionChangeEvent = function (event) {
            if (event.enabled !== void 0) {
                this._updateEnabled();
            }
            if (event.checked !== void 0) {
                this._updateChecked();
            }
            if (event.class !== void 0) {
                this._updateClass();
            }
            if (event.label !== void 0) {
                this._updateLabel();
                this._updateTooltip();
            }
            if (event.tooltip !== void 0) {
                this._updateTooltip();
            }
        };
        Object.defineProperty(BaseActionItem.prototype, "callOnDispose", {
            get: function () {
                return this._callOnDispose;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseActionItem.prototype, "actionRunner", {
            get: function () {
                return this._actionRunner;
            },
            set: function (actionRunner) {
                this._actionRunner = actionRunner;
            },
            enumerable: true,
            configurable: true
        });
        BaseActionItem.prototype.getAction = function () {
            return this._action;
        };
        BaseActionItem.prototype.isEnabled = function () {
            return this._action.enabled;
        };
        BaseActionItem.prototype.setActionContext = function (newContext) {
            this._context = newContext;
        };
        BaseActionItem.prototype.render = function (container) {
            var _this = this;
            this.builder = builder_1.$(container);
            this.gesture = new touch_1.Gesture(container);
            var enableDragging = this.options && this.options.draggable;
            if (enableDragging) {
                container.draggable = true;
            }
            this.builder.on(touch_1.EventType.Tap, function (e) { return _this.onClick(e); });
            this.builder.on(DOM.EventType.MOUSE_DOWN, function (e) {
                if (!enableDragging) {
                    DOM.EventHelper.stop(e); // do not run when dragging is on because that would disable it
                }
                if (_this._action.enabled && e.button === 0) {
                    _this.builder.addClass('active');
                }
            });
            this.builder.on(DOM.EventType.CLICK, function (e) {
                DOM.EventHelper.stop(e, true);
                // See https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Interact_with_the_clipboard
                // > Writing to the clipboard
                // > You can use the "cut" and "copy" commands without any special
                // permission if you are using them in a short-lived event handler
                // for a user action (for example, a click handler).
                // => to get the Copy and Paste context menu actions working on Firefox,
                // there should be no timeout here
                if (_this.options && _this.options.isMenu) {
                    _this.onClick(e);
                }
                else {
                    setTimeout(function () { return _this.onClick(e); }, 50);
                }
            });
            this.builder.on([DOM.EventType.MOUSE_UP, DOM.EventType.MOUSE_OUT], function (e) {
                DOM.EventHelper.stop(e);
                _this.builder.removeClass('active');
            });
        };
        BaseActionItem.prototype.onClick = function (event) {
            DOM.EventHelper.stop(event, true);
            var context;
            if (types.isUndefinedOrNull(this._context)) {
                context = event;
            }
            else {
                context = this._context;
                context.event = event;
            }
            this._actionRunner.run(this._action, context);
        };
        BaseActionItem.prototype.focus = function () {
            if (this.builder) {
                this.builder.domFocus();
            }
        };
        BaseActionItem.prototype.blur = function () {
            if (this.builder) {
                this.builder.domBlur();
            }
        };
        BaseActionItem.prototype._updateEnabled = function () {
            // implement in subclass
        };
        BaseActionItem.prototype._updateLabel = function () {
            // implement in subclass
        };
        BaseActionItem.prototype._updateTooltip = function () {
            // implement in subclass
        };
        BaseActionItem.prototype._updateClass = function () {
            // implement in subclass
        };
        BaseActionItem.prototype._updateChecked = function () {
            // implement in subclass
        };
        BaseActionItem.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            if (this.builder) {
                this.builder.destroy();
                this.builder = null;
            }
            if (this.gesture) {
                this.gesture.dispose();
                this.gesture = null;
            }
            this._callOnDispose = lifecycle.dispose(this._callOnDispose);
        };
        return BaseActionItem;
    }(eventEmitter_1.EventEmitter));
    exports.BaseActionItem = BaseActionItem;
    var Separator = (function (_super) {
        __extends(Separator, _super);
        function Separator(label, order) {
            var _this = _super.call(this, Separator.ID, label, label ? 'separator text' : 'separator') || this;
            _this.checked = false;
            _this.radio = false;
            _this.enabled = false;
            _this.order = order;
            return _this;
        }
        Separator.ID = 'vs.actions.separator';
        return Separator;
    }(actions_1.Action));
    exports.Separator = Separator;
    var ActionItem = (function (_super) {
        __extends(ActionItem, _super);
        function ActionItem(context, action, options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, context, action, options) || this;
            _this.options = options;
            _this.options.icon = options.icon !== undefined ? options.icon : false;
            _this.options.label = options.label !== undefined ? options.label : true;
            _this.cssClass = '';
            return _this;
        }
        ActionItem.prototype.render = function (container) {
            _super.prototype.render.call(this, container);
            this.$e = builder_1.$('a.action-label').appendTo(this.builder);
            if (this._action.id === Separator.ID) {
                // A separator is a presentation item
                this.$e.attr({ role: 'presentation' });
            }
            else {
                if (this.options.isMenu) {
                    this.$e.attr({ role: 'menuitem' });
                }
                else {
                    this.$e.attr({ role: 'button' });
                }
            }
            if (this.options.label && this.options.keybinding) {
                builder_1.$('span.keybinding').text(this.options.keybinding).appendTo(this.builder);
            }
            this._updateClass();
            this._updateLabel();
            this._updateTooltip();
            this._updateEnabled();
            this._updateChecked();
        };
        ActionItem.prototype.focus = function () {
            _super.prototype.focus.call(this);
            this.$e.domFocus();
        };
        ActionItem.prototype._updateLabel = function () {
            if (this.options.label) {
                this.$e.text(this.getAction().label);
            }
        };
        ActionItem.prototype._updateTooltip = function () {
            var title = null;
            if (this.getAction().tooltip) {
                title = this.getAction().tooltip;
            }
            else if (!this.options.label && this.getAction().label && this.options.icon) {
                title = this.getAction().label;
                if (this.options.keybinding) {
                    title = nls.localize({ key: 'titleLabel', comment: ['action title', 'action keybinding'] }, "{0} ({1})", title, this.options.keybinding);
                }
            }
            if (title) {
                this.$e.attr({ title: title });
            }
        };
        ActionItem.prototype._updateClass = function () {
            if (this.cssClass) {
                this.$e.removeClass(this.cssClass);
            }
            if (this.options.icon) {
                this.cssClass = this.getAction().class;
                this.$e.addClass('icon');
                if (this.cssClass) {
                    this.$e.addClass(this.cssClass);
                }
                this._updateEnabled();
            }
            else {
                this.$e.removeClass('icon');
            }
        };
        ActionItem.prototype._updateEnabled = function () {
            if (this.getAction().enabled) {
                this.builder.removeClass('disabled');
                this.$e.removeClass('disabled');
                this.$e.attr({ tabindex: 0 });
            }
            else {
                this.builder.addClass('disabled');
                this.$e.addClass('disabled');
                DOM.removeTabIndexAndUpdateFocus(this.$e.getHTMLElement());
            }
        };
        ActionItem.prototype._updateChecked = function () {
            if (this.getAction().checked) {
                this.$e.addClass('checked');
            }
            else {
                this.$e.removeClass('checked');
            }
        };
        ActionItem.prototype._updateRadio = function () {
            if (this.getAction().radio) {
                this.$e.addClass('radio');
            }
            else {
                this.$e.removeClass('radio');
            }
        };
        return ActionItem;
    }(BaseActionItem));
    exports.ActionItem = ActionItem;
    var ActionsOrientation;
    (function (ActionsOrientation) {
        ActionsOrientation[ActionsOrientation["HORIZONTAL"] = 1] = "HORIZONTAL";
        ActionsOrientation[ActionsOrientation["VERTICAL"] = 2] = "VERTICAL";
    })(ActionsOrientation = exports.ActionsOrientation || (exports.ActionsOrientation = {}));
    var defaultOptions = {
        orientation: ActionsOrientation.HORIZONTAL,
        context: null
    };
    var ActionBar = (function (_super) {
        __extends(ActionBar, _super);
        function ActionBar(container, options) {
            if (options === void 0) { options = defaultOptions; }
            var _this = _super.call(this) || this;
            _this.options = options;
            _this._context = options.context;
            _this.toDispose = [];
            _this._actionRunner = _this.options.actionRunner;
            if (!_this._actionRunner) {
                _this._actionRunner = new actions_1.ActionRunner();
                _this.toDispose.push(_this._actionRunner);
            }
            _this.toDispose.push(_this.addEmitter(_this._actionRunner));
            _this.items = [];
            _this.focusedItem = undefined;
            _this.domNode = document.createElement('div');
            _this.domNode.className = 'monaco-action-bar';
            if (options.animated !== false) {
                DOM.addClass(_this.domNode, 'animated');
            }
            var isVertical = _this.options.orientation === ActionsOrientation.VERTICAL;
            if (isVertical) {
                _this.domNode.className += ' vertical';
            }
            builder_1.$(_this.domNode).on(DOM.EventType.KEY_DOWN, function (e) {
                var event = new keyboardEvent_1.StandardKeyboardEvent(e);
                var eventHandled = true;
                if (event.equals(isVertical ? 16 /* UpArrow */ : 15 /* LeftArrow */)) {
                    _this.focusPrevious();
                }
                else if (event.equals(isVertical ? 18 /* DownArrow */ : 17 /* RightArrow */)) {
                    _this.focusNext();
                }
                else if (event.equals(9 /* Escape */)) {
                    _this.cancel();
                }
                else if (event.equals(3 /* Enter */) || event.equals(10 /* Space */)) {
                    // Nothing, just staying out of the else branch
                }
                else {
                    eventHandled = false;
                }
                if (eventHandled) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            });
            builder_1.$(_this.domNode).on(DOM.EventType.KEY_UP, function (e) {
                var event = new keyboardEvent_1.StandardKeyboardEvent(e);
                // Run action on Enter/Space
                if (event.equals(3 /* Enter */) || event.equals(10 /* Space */)) {
                    _this.doTrigger(event);
                    event.preventDefault();
                    event.stopPropagation();
                }
                else if (event.equals(2 /* Tab */) || event.equals(1024 /* Shift */ | 2 /* Tab */)) {
                    _this.updateFocusedItem();
                }
            });
            _this.focusTracker = DOM.trackFocus(_this.domNode);
            _this.focusTracker.addBlurListener(function () {
                if (document.activeElement === _this.domNode || !DOM.isAncestor(document.activeElement, _this.domNode)) {
                    _this.emit(DOM.EventType.BLUR, {});
                    _this.focusedItem = undefined;
                }
            });
            _this.focusTracker.addFocusListener(function () { return _this.updateFocusedItem(); });
            _this.actionsList = document.createElement('ul');
            _this.actionsList.className = 'actions-container';
            if (_this.options.isMenu) {
                _this.actionsList.setAttribute('role', 'menubar');
            }
            else {
                _this.actionsList.setAttribute('role', 'toolbar');
            }
            if (_this.options.ariaLabel) {
                _this.actionsList.setAttribute('aria-label', _this.options.ariaLabel);
            }
            _this.domNode.appendChild(_this.actionsList);
            ((container instanceof builder_1.Builder) ? container.getHTMLElement() : container).appendChild(_this.domNode);
            return _this;
        }
        ActionBar.prototype.setAriaLabel = function (label) {
            if (label) {
                this.actionsList.setAttribute('aria-label', label);
            }
            else {
                this.actionsList.removeAttribute('aria-label');
            }
        };
        ActionBar.prototype.updateFocusedItem = function () {
            for (var i = 0; i < this.actionsList.children.length; i++) {
                var elem = this.actionsList.children[i];
                if (DOM.isAncestor(document.activeElement, elem)) {
                    this.focusedItem = i;
                    break;
                }
            }
        };
        Object.defineProperty(ActionBar.prototype, "context", {
            get: function () {
                return this._context;
            },
            set: function (context) {
                this._context = context;
                this.items.forEach(function (i) { return i.setActionContext(context); });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActionBar.prototype, "actionRunner", {
            get: function () {
                return this._actionRunner;
            },
            set: function (actionRunner) {
                if (actionRunner) {
                    this._actionRunner = actionRunner;
                    this.items.forEach(function (item) { return item.actionRunner = actionRunner; });
                }
            },
            enumerable: true,
            configurable: true
        });
        ActionBar.prototype.getContainer = function () {
            return builder_1.$(this.domNode);
        };
        ActionBar.prototype.push = function (arg, options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            var actions = !Array.isArray(arg) ? [arg] : arg;
            var index = types.isNumber(options.index) ? options.index : null;
            actions.forEach(function (action) {
                var actionItemElement = document.createElement('li');
                actionItemElement.className = 'action-item';
                actionItemElement.setAttribute('role', 'presentation');
                // Prevent native context menu on actions
                builder_1.$(actionItemElement).on(DOM.EventType.CONTEXT_MENU, function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
                var item = null;
                if (_this.options.actionItemProvider) {
                    item = _this.options.actionItemProvider(action);
                }
                if (!item) {
                    item = new ActionItem(_this.context, action, options);
                }
                item.actionRunner = _this._actionRunner;
                item.setActionContext(_this.context);
                _this.addEmitter(item);
                item.render(actionItemElement);
                if (index === null || index < 0 || index >= _this.actionsList.children.length) {
                    _this.actionsList.appendChild(actionItemElement);
                }
                else {
                    _this.actionsList.insertBefore(actionItemElement, _this.actionsList.children[index++]);
                }
                _this.items.push(item);
            });
        };
        ActionBar.prototype.pull = function (index) {
            if (index >= 0 && index < this.items.length) {
                this.items.splice(index, 1);
                this.actionsList.removeChild(this.actionsList.childNodes[index]);
            }
        };
        ActionBar.prototype.clear = function () {
            this.items = lifecycle.dispose(this.items);
            builder_1.$(this.actionsList).empty();
        };
        ActionBar.prototype.length = function () {
            return this.items.length;
        };
        ActionBar.prototype.isEmpty = function () {
            return this.items.length === 0;
        };
        ActionBar.prototype.focus = function (selectFirst) {
            if (selectFirst && typeof this.focusedItem === 'undefined') {
                this.focusedItem = 0;
            }
            this.updateFocus();
        };
        ActionBar.prototype.focusNext = function () {
            if (typeof this.focusedItem === 'undefined') {
                this.focusedItem = this.items.length - 1;
            }
            var startIndex = this.focusedItem;
            var item;
            do {
                this.focusedItem = (this.focusedItem + 1) % this.items.length;
                item = this.items[this.focusedItem];
            } while (this.focusedItem !== startIndex && !item.isEnabled());
            if (this.focusedItem === startIndex && !item.isEnabled()) {
                this.focusedItem = undefined;
            }
            this.updateFocus();
        };
        ActionBar.prototype.focusPrevious = function () {
            if (typeof this.focusedItem === 'undefined') {
                this.focusedItem = 0;
            }
            var startIndex = this.focusedItem;
            var item;
            do {
                this.focusedItem = this.focusedItem - 1;
                if (this.focusedItem < 0) {
                    this.focusedItem = this.items.length - 1;
                }
                item = this.items[this.focusedItem];
            } while (this.focusedItem !== startIndex && !item.isEnabled());
            if (this.focusedItem === startIndex && !item.isEnabled()) {
                this.focusedItem = undefined;
            }
            this.updateFocus(true);
        };
        ActionBar.prototype.updateFocus = function (fromRight) {
            if (typeof this.focusedItem === 'undefined') {
                this.domNode.focus();
                return;
            }
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                var actionItem = item;
                if (i === this.focusedItem) {
                    if (types.isFunction(actionItem.focus)) {
                        actionItem.focus(fromRight);
                    }
                }
                else {
                    if (types.isFunction(actionItem.blur)) {
                        actionItem.blur();
                    }
                }
            }
        };
        ActionBar.prototype.doTrigger = function (event) {
            if (typeof this.focusedItem === 'undefined') {
                return; //nothing to focus
            }
            // trigger action
            var actionItem = this.items[this.focusedItem];
            if (actionItem instanceof BaseActionItem) {
                var context_1 = (actionItem._context === null || actionItem._context === undefined) ? event : actionItem._context;
                this.run(actionItem._action, context_1).done();
            }
        };
        ActionBar.prototype.cancel = function () {
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur(); // remove focus from focused action
            }
            this.emit(events_1.EventType.CANCEL);
        };
        ActionBar.prototype.run = function (action, context) {
            return this._actionRunner.run(action, context);
        };
        ActionBar.prototype.dispose = function () {
            if (this.items !== null) {
                lifecycle.dispose(this.items);
            }
            this.items = null;
            if (this.focusTracker) {
                this.focusTracker.dispose();
                this.focusTracker = null;
            }
            this.toDispose = lifecycle.dispose(this.toDispose);
            this.getContainer().destroy();
            _super.prototype.dispose.call(this);
        };
        return ActionBar;
    }(eventEmitter_1.EventEmitter));
    exports.ActionBar = ActionBar;
    var SelectActionItem = (function (_super) {
        __extends(SelectActionItem, _super);
        function SelectActionItem(ctx, action, options, selected) {
            var _this = _super.call(this, ctx, action) || this;
            _this.selectBox = new selectBox_1.SelectBox(options, selected);
            _this.toDispose = [];
            _this.toDispose.push(_this.selectBox);
            _this.registerListeners();
            return _this;
        }
        SelectActionItem.prototype.setOptions = function (options, selected) {
            this.selectBox.setOptions(options, selected);
        };
        SelectActionItem.prototype.select = function (index) {
            this.selectBox.select(index);
        };
        SelectActionItem.prototype.registerListeners = function () {
            var _this = this;
            this.toDispose.push(this.selectBox.onDidSelect(function (e) {
                _this.actionRunner.run(_this._action, _this.getActionContext(e.selected)).done();
            }));
        };
        SelectActionItem.prototype.getActionContext = function (option) {
            return option;
        };
        SelectActionItem.prototype.focus = function () {
            if (this.selectBox) {
                this.selectBox.focus();
            }
        };
        SelectActionItem.prototype.blur = function () {
            if (this.selectBox) {
                this.selectBox.blur();
            }
        };
        SelectActionItem.prototype.render = function (container) {
            this.selectBox.render(container);
        };
        SelectActionItem.prototype.dispose = function () {
            this.toDispose = lifecycle.dispose(this.toDispose);
            _super.prototype.dispose.call(this);
        };
        return SelectActionItem;
    }(BaseActionItem));
    exports.SelectActionItem = SelectActionItem;
});
//# sourceMappingURL=actionbar.js.map