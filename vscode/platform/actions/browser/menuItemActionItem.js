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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/nls", "vs/platform/keybinding/common/keybinding", "vs/platform/actions/common/actions", "vs/platform/message/common/message", "vs/base/common/severity", "vs/base/common/lifecycle", "vs/base/browser/ui/actionbar/actionbar", "vs/base/browser/event", "vs/base/common/event"], function (require, exports, nls_1, keybinding_1, actions_1, message_1, severity_1, lifecycle_1, actionbar_1, event_1, event_2) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function fillInActions(menu, options, target, isPrimaryGroup) {
        if (isPrimaryGroup === void 0) { isPrimaryGroup = function (group) { return group === 'navigation'; }; }
        var groups = menu.getActions(options);
        if (groups.length === 0) {
            return;
        }
        for (var _i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
            var tuple = groups_1[_i];
            var group = tuple[0], actions = tuple[1];
            if (isPrimaryGroup(group)) {
                var head = Array.isArray(target) ? target : target.primary;
                // split contributed actions at the point where order
                // changes form lt zero to gte
                var pivot = 0;
                for (; pivot < actions.length; pivot++) {
                    if (actions[pivot].order >= 0) {
                        break;
                    }
                }
                // prepend contributed actions with order lte zero
                head.unshift.apply(head, actions.slice(0, pivot));
                // find the first separator which marks the end of the
                // navigation group - might be the whole array length
                var sep = 0;
                while (sep < head.length) {
                    if (head[sep] instanceof actionbar_1.Separator) {
                        break;
                    }
                    sep++;
                }
                // append contributed actions with order gt zero
                head.splice.apply(head, [sep, 0].concat(actions.slice(pivot)));
            }
            else {
                var to = Array.isArray(target) ? target : target.secondary;
                if (to.length > 0) {
                    to.push(new actionbar_1.Separator());
                }
                to.push.apply(to, actions);
            }
        }
    }
    exports.fillInActions = fillInActions;
    function createActionItem(action, keybindingService, messageService) {
        if (action instanceof actions_1.MenuItemAction) {
            return new MenuItemActionItem(action, keybindingService, messageService);
        }
        return undefined;
    }
    exports.createActionItem = createActionItem;
    var _altKey = new (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var _this = _super.call(this) || this;
            _this._subscriptions = [];
            _this._subscriptions.push(event_1.domEvent(document.body, 'keydown')(function (e) { return _this.fire(e.altKey); }));
            _this._subscriptions.push(event_1.domEvent(document.body, 'keyup')(function (e) { return _this.fire(false); }));
            _this._subscriptions.push(event_1.domEvent(document.body, 'mouseleave')(function (e) { return _this.fire(false); }));
            _this._subscriptions.push(event_1.domEvent(document.body, 'blur')(function (e) { return _this.fire(false); }));
            return _this;
        }
        class_1.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this._subscriptions = lifecycle_1.dispose(this._subscriptions);
        };
        return class_1;
    }(event_2.Emitter));
    var MenuItemActionItem = (function (_super) {
        __extends(MenuItemActionItem, _super);
        function MenuItemActionItem(action, _keybindingService, _messageService) {
            var _this = _super.call(this, undefined, action, { icon: !!action.class, label: !action.class }) || this;
            _this._keybindingService = _keybindingService;
            _this._messageService = _messageService;
            _this._wantsAltCommand = false;
            return _this;
        }
        Object.defineProperty(MenuItemActionItem.prototype, "_commandAction", {
            get: function () {
                return this._wantsAltCommand && this._action.alt || this._action;
            },
            enumerable: true,
            configurable: true
        });
        MenuItemActionItem.prototype.onClick = function (event) {
            var _this = this;
            event.preventDefault();
            event.stopPropagation();
            this.actionRunner.run(this._commandAction)
                .done(undefined, function (err) { return _this._messageService.show(severity_1.default.Error, err); });
        };
        MenuItemActionItem.prototype.render = function (container) {
            var _this = this;
            _super.prototype.render.call(this, container);
            var mouseOver = false;
            var altDown = false;
            var updateAltState = function () {
                var wantsAltCommand = mouseOver && altDown;
                if (wantsAltCommand !== _this._wantsAltCommand) {
                    _this._wantsAltCommand = wantsAltCommand;
                    _this._updateLabel();
                    _this._updateTooltip();
                    _this._updateClass();
                }
            };
            this._callOnDispose.push(_altKey.event(function (value) {
                altDown = value;
                updateAltState();
            }));
            this._callOnDispose.push(event_1.domEvent(container, 'mouseleave')(function (_) {
                mouseOver = false;
                updateAltState();
            }));
            this._callOnDispose.push(event_1.domEvent(container, 'mouseenter')(function (e) {
                mouseOver = true;
                updateAltState();
            }));
        };
        MenuItemActionItem.prototype._updateLabel = function () {
            if (this.options.label) {
                this.$e.text(this._commandAction.label);
            }
        };
        MenuItemActionItem.prototype._updateTooltip = function () {
            var element = this.$e.getHTMLElement();
            var keybinding = this._keybindingService.lookupKeybinding(this._commandAction.id);
            var keybindingLabel = keybinding && keybinding.getLabel();
            element.title = keybindingLabel
                ? nls_1.localize('titleAndKb', "{0} ({1})", this._commandAction.label, keybindingLabel)
                : this._commandAction.label;
        };
        MenuItemActionItem.prototype._updateClass = function () {
            if (this.options.icon) {
                var element = this.$e.getHTMLElement();
                if (this._commandAction !== this._action) {
                    element.classList.remove(this._action.class);
                }
                else if (this._action.alt) {
                    element.classList.remove(this._action.alt.class);
                }
                element.classList.add('icon', this._commandAction.class);
            }
        };
        MenuItemActionItem = __decorate([
            __param(1, keybinding_1.IKeybindingService),
            __param(2, message_1.IMessageService)
        ], MenuItemActionItem);
        return MenuItemActionItem;
    }(actionbar_1.ActionItem));
    exports.MenuItemActionItem = MenuItemActionItem;
});
//# sourceMappingURL=menuItemActionItem.js.map