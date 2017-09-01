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
define(["require", "exports", "vs/nls", "vs/base/browser/dom", "vs/base/common/winjs.base", "vs/base/browser/builder", "vs/base/browser/dnd", "vs/base/common/actions", "vs/base/browser/ui/actionbar/actionbar", "vs/workbench/services/activity/common/activityBarService", "vs/base/common/event", "vs/platform/contextview/browser/contextView", "vs/platform/commands/common/commands", "vs/platform/instantiation/common/instantiation", "vs/platform/keybinding/common/keybinding", "vs/base/common/lifecycle", "vs/workbench/services/viewlet/browser/viewlet", "vs/workbench/services/part/common/partService", "vs/platform/theme/common/themeService", "vs/workbench/common/theme", "vs/platform/theme/common/colorRegistry", "vs/base/browser/mouseEvent", "vs/base/browser/keyboardEvent", "vs/css!./media/activityaction"], function (require, exports, nls, DOM, winjs_base_1, builder_1, dnd_1, actions_1, actionbar_1, activityBarService_1, event_1, contextView_1, commands_1, instantiation_1, keybinding_1, lifecycle_1, viewlet_1, partService_1, themeService_1, theme_1, colorRegistry_1, mouseEvent_1, keyboardEvent_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ActivityAction = (function (_super) {
        __extends(ActivityAction, _super);
        function ActivityAction(_activity) {
            var _this = _super.call(this, _activity.id, _activity.name, _activity.cssClass) || this;
            _this._activity = _activity;
            _this._onDidChangeBadge = new event_1.Emitter();
            _this.badge = null;
            return _this;
        }
        Object.defineProperty(ActivityAction.prototype, "activity", {
            get: function () {
                return this._activity;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ActivityAction.prototype, "onDidChangeBadge", {
            get: function () {
                return this._onDidChangeBadge.event;
            },
            enumerable: true,
            configurable: true
        });
        ActivityAction.prototype.activate = function () {
            if (!this.checked) {
                this._setChecked(true);
            }
        };
        ActivityAction.prototype.deactivate = function () {
            if (this.checked) {
                this._setChecked(false);
            }
        };
        ActivityAction.prototype.getBadge = function () {
            return this.badge;
        };
        ActivityAction.prototype.setBadge = function (badge) {
            this.badge = badge;
            this._onDidChangeBadge.fire(this);
        };
        return ActivityAction;
    }(actions_1.Action));
    exports.ActivityAction = ActivityAction;
    var ViewletActivityAction = (function (_super) {
        __extends(ViewletActivityAction, _super);
        function ViewletActivityAction(viewlet, viewletService, partService) {
            var _this = _super.call(this, viewlet) || this;
            _this.viewlet = viewlet;
            _this.viewletService = viewletService;
            _this.partService = partService;
            _this.lastRun = 0;
            return _this;
        }
        ViewletActivityAction.prototype.run = function (event) {
            var _this = this;
            if (event instanceof MouseEvent && event.button === 2) {
                return winjs_base_1.TPromise.as(false); // do not run on right click
            }
            // prevent accident trigger on a doubleclick (to help nervous people)
            var now = Date.now();
            if (now > this.lastRun /* https://github.com/Microsoft/vscode/issues/25830 */ && now - this.lastRun < ViewletActivityAction.preventDoubleClickDelay) {
                return winjs_base_1.TPromise.as(true);
            }
            this.lastRun = now;
            var sideBarVisible = this.partService.isVisible(partService_1.Parts.SIDEBAR_PART);
            var activeViewlet = this.viewletService.getActiveViewlet();
            // Hide sidebar if selected viewlet already visible
            if (sideBarVisible && activeViewlet && activeViewlet.getId() === this.viewlet.id) {
                return this.partService.setSideBarHidden(true);
            }
            return this.viewletService.openViewlet(this.viewlet.id, true)
                .then(function () { return _this.activate(); });
        };
        ViewletActivityAction.preventDoubleClickDelay = 300;
        ViewletActivityAction = __decorate([
            __param(1, viewlet_1.IViewletService),
            __param(2, partService_1.IPartService)
        ], ViewletActivityAction);
        return ViewletActivityAction;
    }(ActivityAction));
    exports.ViewletActivityAction = ViewletActivityAction;
    var ActivityActionItem = (function (_super) {
        __extends(ActivityActionItem, _super);
        function ActivityActionItem(action, options, themeService) {
            var _this = _super.call(this, null, action, options) || this;
            _this.themeService = themeService;
            _this.themeService.onThemeChange(_this.onThemeChange, _this, _this._callOnDispose);
            action.onDidChangeBadge(_this.handleBadgeChangeEvenet, _this, _this._callOnDispose);
            return _this;
        }
        Object.defineProperty(ActivityActionItem.prototype, "activity", {
            get: function () {
                return this._action.activity;
            },
            enumerable: true,
            configurable: true
        });
        ActivityActionItem.prototype.updateStyles = function () {
            var theme = this.themeService.getTheme();
            // Label
            if (this.$label) {
                var background = theme.getColor(theme_1.ACTIVITY_BAR_FOREGROUND);
                this.$label.style('background-color', background ? background.toString() : null);
            }
            // Badge
            if (this.$badgeContent) {
                var badgeForeground = theme.getColor(theme_1.ACTIVITY_BAR_BADGE_FOREGROUND);
                var badgeBackground = theme.getColor(theme_1.ACTIVITY_BAR_BADGE_BACKGROUND);
                var contrastBorderColor = theme.getColor(colorRegistry_1.contrastBorder);
                this.$badgeContent.style('color', badgeForeground ? badgeForeground.toString() : null);
                this.$badgeContent.style('background-color', badgeBackground ? badgeBackground.toString() : null);
                this.$badgeContent.style('border-style', contrastBorderColor ? 'solid' : null);
                this.$badgeContent.style('border-width', contrastBorderColor ? '1px' : null);
                this.$badgeContent.style('border-color', contrastBorderColor ? contrastBorderColor.toString() : null);
            }
        };
        ActivityActionItem.prototype.render = function (container) {
            var _this = this;
            _super.prototype.render.call(this, container);
            // Make the container tab-able for keyboard navigation
            this.$container = builder_1.$(container).attr({
                tabIndex: '0',
                role: 'button',
                title: this.activity.name
            });
            // Try hard to prevent keyboard only focus feedback when using mouse
            this.$container.on(DOM.EventType.MOUSE_DOWN, function () {
                _this.$container.addClass('clicked');
            });
            this.$container.on(DOM.EventType.MOUSE_UP, function () {
                if (_this.mouseUpTimeout) {
                    clearTimeout(_this.mouseUpTimeout);
                }
                _this.mouseUpTimeout = setTimeout(function () {
                    _this.$container.removeClass('clicked');
                }, 800); // delayed to prevent focus feedback from showing on mouse up
            });
            // Label
            this.$label = builder_1.$('a.action-label').appendTo(this.builder);
            if (this.activity.cssClass) {
                this.$label.addClass(this.activity.cssClass);
            }
            this.$badge = this.builder.clone().div({ 'class': 'badge' }, function (badge) {
                _this.$badgeContent = badge.div({ 'class': 'badge-content' });
            });
            this.$badge.hide();
            this.updateStyles();
        };
        ActivityActionItem.prototype.onThemeChange = function (theme) {
            this.updateStyles();
        };
        ActivityActionItem.prototype.setBadge = function (badge) {
            this.updateBadge(badge);
        };
        ActivityActionItem.prototype.updateBadge = function (badge) {
            this.$badgeContent.empty();
            this.$badge.hide();
            if (badge) {
                // Number
                if (badge instanceof activityBarService_1.NumberBadge) {
                    if (badge.number) {
                        this.$badgeContent.text(badge.number > 99 ? '99+' : badge.number.toString());
                        this.$badge.show();
                    }
                }
                else if (badge instanceof activityBarService_1.TextBadge) {
                    this.$badgeContent.text(badge.text);
                    this.$badge.show();
                }
                else if (badge instanceof activityBarService_1.IconBadge) {
                    this.$badge.show();
                }
                else if (badge instanceof activityBarService_1.ProgressBadge) {
                    this.$badge.show();
                }
                var description = badge.getDescription();
                this.$label.attr('aria-label', this.activity.name + " - " + description);
                this.$label.title(description);
            }
        };
        ActivityActionItem.prototype.handleBadgeChangeEvenet = function () {
            var action = this.getAction();
            if (action instanceof ActivityAction) {
                this.updateBadge(action.getBadge());
            }
        };
        ActivityActionItem.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            if (this.mouseUpTimeout) {
                clearTimeout(this.mouseUpTimeout);
            }
            this.$badge.destroy();
        };
        ActivityActionItem = __decorate([
            __param(2, themeService_1.IThemeService)
        ], ActivityActionItem);
        return ActivityActionItem;
    }(actionbar_1.BaseActionItem));
    exports.ActivityActionItem = ActivityActionItem;
    var ViewletActionItem = (function (_super) {
        __extends(ViewletActionItem, _super);
        function ViewletActionItem(action, contextMenuService, activityBarService, keybindingService, instantiationService, themeService) {
            var _this = _super.call(this, action, { draggable: true }, themeService) || this;
            _this.action = action;
            _this.contextMenuService = contextMenuService;
            _this.activityBarService = activityBarService;
            _this.keybindingService = keybindingService;
            _this.cssClass = action.class;
            _this._keybinding = _this.getKeybindingLabel(_this.viewlet.id);
            if (!ViewletActionItem.manageExtensionAction) {
                ViewletActionItem.manageExtensionAction = instantiationService.createInstance(ManageExtensionAction);
            }
            if (!ViewletActionItem.toggleViewletPinnedAction) {
                ViewletActionItem.toggleViewletPinnedAction = instantiationService.createInstance(ToggleViewletPinnedAction, void 0);
            }
            return _this;
        }
        Object.defineProperty(ViewletActionItem.prototype, "viewlet", {
            get: function () {
                return this.action.activity;
            },
            enumerable: true,
            configurable: true
        });
        ViewletActionItem.prototype.getKeybindingLabel = function (id) {
            var kb = this.keybindingService.lookupKeybinding(id);
            if (kb) {
                return kb.getLabel();
            }
            return null;
        };
        ViewletActionItem.prototype.render = function (container) {
            var _this = this;
            _super.prototype.render.call(this, container);
            this.$container.on('contextmenu', function (e) {
                DOM.EventHelper.stop(e, true);
                _this.showContextMenu(container);
            });
            // Allow to drag
            this.$container.on(DOM.EventType.DRAG_START, function (e) {
                e.dataTransfer.effectAllowed = 'move';
                _this.setDraggedViewlet(_this.viewlet);
                // Trigger the action even on drag start to prevent clicks from failing that started a drag
                if (!_this.getAction().checked) {
                    _this.getAction().run();
                }
            });
            // Drag enter
            var counter = 0; // see https://github.com/Microsoft/vscode/issues/14470
            this.$container.on(DOM.EventType.DRAG_ENTER, function (e) {
                var draggedViewlet = ViewletActionItem.getDraggedViewlet();
                if (draggedViewlet && draggedViewlet.id !== _this.viewlet.id) {
                    counter++;
                    _this.updateFromDragging(container, true);
                }
            });
            // Drag leave
            this.$container.on(DOM.EventType.DRAG_LEAVE, function (e) {
                var draggedViewlet = ViewletActionItem.getDraggedViewlet();
                if (draggedViewlet) {
                    counter--;
                    if (counter === 0) {
                        _this.updateFromDragging(container, false);
                    }
                }
            });
            // Drag end
            this.$container.on(DOM.EventType.DRAG_END, function (e) {
                var draggedViewlet = ViewletActionItem.getDraggedViewlet();
                if (draggedViewlet) {
                    counter = 0;
                    _this.updateFromDragging(container, false);
                    ViewletActionItem.clearDraggedViewlet();
                }
            });
            // Drop
            this.$container.on(DOM.EventType.DROP, function (e) {
                DOM.EventHelper.stop(e, true);
                var draggedViewlet = ViewletActionItem.getDraggedViewlet();
                if (draggedViewlet && draggedViewlet.id !== _this.viewlet.id) {
                    _this.updateFromDragging(container, false);
                    ViewletActionItem.clearDraggedViewlet();
                    _this.activityBarService.move(draggedViewlet.id, _this.viewlet.id);
                }
            });
            // Keybinding
            this.keybinding = this._keybinding; // force update
            // Activate on drag over to reveal targets
            [this.$badge, this.$label].forEach(function (b) { return new dnd_1.DelayedDragHandler(b.getHTMLElement(), function () {
                if (!ViewletActionItem.getDraggedViewlet() && !_this.getAction().checked) {
                    _this.getAction().run();
                }
            }); });
            this.updateStyles();
        };
        ViewletActionItem.prototype.updateFromDragging = function (element, isDragging) {
            var theme = this.themeService.getTheme();
            var dragBackground = theme.getColor(theme_1.ACTIVITY_BAR_DRAG_AND_DROP_BACKGROUND);
            element.style.backgroundColor = isDragging && dragBackground ? dragBackground.toString() : null;
        };
        ViewletActionItem.getDraggedViewlet = function () {
            return ViewletActionItem.draggedViewlet;
        };
        ViewletActionItem.prototype.setDraggedViewlet = function (viewlet) {
            ViewletActionItem.draggedViewlet = viewlet;
        };
        ViewletActionItem.clearDraggedViewlet = function () {
            ViewletActionItem.draggedViewlet = void 0;
        };
        ViewletActionItem.prototype.showContextMenu = function (container) {
            var _this = this;
            var actions = [ViewletActionItem.toggleViewletPinnedAction];
            if (this.viewlet.extensionId) {
                actions.push(new actionbar_1.Separator());
                actions.push(ViewletActionItem.manageExtensionAction);
            }
            var isPinned = this.activityBarService.isPinned(this.viewlet.id);
            if (isPinned) {
                ViewletActionItem.toggleViewletPinnedAction.label = nls.localize('removeFromActivityBar', "Remove from Activity Bar");
            }
            else {
                ViewletActionItem.toggleViewletPinnedAction.label = nls.localize('keepInActivityBar', "Keep in Activity Bar");
            }
            this.contextMenuService.showContextMenu({
                getAnchor: function () { return container; },
                getActionsContext: function () { return _this.viewlet; },
                getActions: function () { return winjs_base_1.TPromise.as(actions); }
            });
        };
        ViewletActionItem.prototype.focus = function () {
            this.$container.domFocus();
        };
        Object.defineProperty(ViewletActionItem.prototype, "keybinding", {
            set: function (keybinding) {
                this._keybinding = keybinding;
                if (!this.$label) {
                    return;
                }
                var title;
                if (keybinding) {
                    title = nls.localize('titleKeybinding', "{0} ({1})", this.activity.name, keybinding);
                }
                else {
                    title = this.activity.name;
                }
                this.$label.title(title);
                this.$badge.title(title);
                this.$container.title(title);
            },
            enumerable: true,
            configurable: true
        });
        ViewletActionItem.prototype._updateClass = function () {
            if (this.cssClass) {
                this.$badge.removeClass(this.cssClass);
            }
            this.cssClass = this.getAction().class;
            this.$badge.addClass(this.cssClass);
        };
        ViewletActionItem.prototype._updateChecked = function () {
            if (this.getAction().checked) {
                this.$container.addClass('checked');
            }
            else {
                this.$container.removeClass('checked');
            }
        };
        ViewletActionItem.prototype._updateEnabled = function () {
            if (this.getAction().enabled) {
                this.builder.removeClass('disabled');
            }
            else {
                this.builder.addClass('disabled');
            }
        };
        ViewletActionItem.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            ViewletActionItem.clearDraggedViewlet();
            this.$label.destroy();
        };
        ViewletActionItem = __decorate([
            __param(1, contextView_1.IContextMenuService),
            __param(2, activityBarService_1.IActivityBarService),
            __param(3, keybinding_1.IKeybindingService),
            __param(4, instantiation_1.IInstantiationService),
            __param(5, themeService_1.IThemeService)
        ], ViewletActionItem);
        return ViewletActionItem;
    }(ActivityActionItem));
    exports.ViewletActionItem = ViewletActionItem;
    var ViewletOverflowActivityAction = (function (_super) {
        __extends(ViewletOverflowActivityAction, _super);
        function ViewletOverflowActivityAction(showMenu) {
            var _this = _super.call(this, {
                id: 'activitybar.additionalViewlets.action',
                name: nls.localize('additionalViews', "Additional Views"),
                cssClass: 'toggle-more'
            }) || this;
            _this.showMenu = showMenu;
            return _this;
        }
        ViewletOverflowActivityAction.prototype.run = function (event) {
            this.showMenu();
            return winjs_base_1.TPromise.as(true);
        };
        return ViewletOverflowActivityAction;
    }(ActivityAction));
    exports.ViewletOverflowActivityAction = ViewletOverflowActivityAction;
    var ViewletOverflowActivityActionItem = (function (_super) {
        __extends(ViewletOverflowActivityActionItem, _super);
        function ViewletOverflowActivityActionItem(action, getOverflowingViewlets, getBadge, instantiationService, viewletService, contextMenuService, themeService) {
            var _this = _super.call(this, action, null, themeService) || this;
            _this.getOverflowingViewlets = getOverflowingViewlets;
            _this.getBadge = getBadge;
            _this.instantiationService = instantiationService;
            _this.viewletService = viewletService;
            _this.contextMenuService = contextMenuService;
            _this.cssClass = action.class;
            _this.name = action.label;
            return _this;
        }
        ViewletOverflowActivityActionItem.prototype.showMenu = function () {
            var _this = this;
            if (this.actions) {
                lifecycle_1.dispose(this.actions);
            }
            this.actions = this.getActions();
            this.contextMenuService.showContextMenu({
                getAnchor: function () { return _this.builder.getHTMLElement(); },
                getActions: function () { return winjs_base_1.TPromise.as(_this.actions); },
                onHide: function () { return lifecycle_1.dispose(_this.actions); }
            });
        };
        ViewletOverflowActivityActionItem.prototype.getActions = function () {
            var _this = this;
            var activeViewlet = this.viewletService.getActiveViewlet();
            return this.getOverflowingViewlets().map(function (viewlet) {
                var action = _this.instantiationService.createInstance(OpenViewletAction, viewlet);
                action.radio = activeViewlet && activeViewlet.getId() === action.id;
                var badge = _this.getBadge(action.viewlet);
                var suffix;
                if (badge instanceof activityBarService_1.NumberBadge) {
                    suffix = badge.number;
                }
                else if (badge instanceof activityBarService_1.TextBadge) {
                    suffix = badge.text;
                }
                if (suffix) {
                    action.label = nls.localize('numberBadge', "{0} ({1})", action.viewlet.name, suffix);
                }
                else {
                    action.label = action.viewlet.name;
                }
                return action;
            });
        };
        ViewletOverflowActivityActionItem.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this.actions = lifecycle_1.dispose(this.actions);
        };
        ViewletOverflowActivityActionItem = __decorate([
            __param(3, instantiation_1.IInstantiationService),
            __param(4, viewlet_1.IViewletService),
            __param(5, contextView_1.IContextMenuService),
            __param(6, themeService_1.IThemeService)
        ], ViewletOverflowActivityActionItem);
        return ViewletOverflowActivityActionItem;
    }(ActivityActionItem));
    exports.ViewletOverflowActivityActionItem = ViewletOverflowActivityActionItem;
    var ManageExtensionAction = (function (_super) {
        __extends(ManageExtensionAction, _super);
        function ManageExtensionAction(commandService) {
            var _this = _super.call(this, 'activitybar.manage.extension', nls.localize('manageExtension', "Manage Extension")) || this;
            _this.commandService = commandService;
            return _this;
        }
        ManageExtensionAction.prototype.run = function (viewlet) {
            return this.commandService.executeCommand('_extensions.manage', viewlet.extensionId);
        };
        ManageExtensionAction = __decorate([
            __param(0, commands_1.ICommandService)
        ], ManageExtensionAction);
        return ManageExtensionAction;
    }(actions_1.Action));
    var OpenViewletAction = (function (_super) {
        __extends(OpenViewletAction, _super);
        function OpenViewletAction(_viewlet, partService, viewletService) {
            var _this = _super.call(this, _viewlet.id, _viewlet.name) || this;
            _this._viewlet = _viewlet;
            _this.partService = partService;
            _this.viewletService = viewletService;
            return _this;
        }
        Object.defineProperty(OpenViewletAction.prototype, "viewlet", {
            get: function () {
                return this._viewlet;
            },
            enumerable: true,
            configurable: true
        });
        OpenViewletAction.prototype.run = function () {
            var sideBarVisible = this.partService.isVisible(partService_1.Parts.SIDEBAR_PART);
            var activeViewlet = this.viewletService.getActiveViewlet();
            // Hide sidebar if selected viewlet already visible
            if (sideBarVisible && activeViewlet && activeViewlet.getId() === this.viewlet.id) {
                return this.partService.setSideBarHidden(true);
            }
            return this.viewletService.openViewlet(this.viewlet.id, true);
        };
        OpenViewletAction = __decorate([
            __param(1, partService_1.IPartService),
            __param(2, viewlet_1.IViewletService)
        ], OpenViewletAction);
        return OpenViewletAction;
    }(actions_1.Action));
    var ToggleViewletPinnedAction = (function (_super) {
        __extends(ToggleViewletPinnedAction, _super);
        function ToggleViewletPinnedAction(viewlet, activityBarService) {
            var _this = _super.call(this, 'activitybar.show.toggleViewletPinned', viewlet ? viewlet.name : nls.localize('toggle', "Toggle View Pinned")) || this;
            _this.viewlet = viewlet;
            _this.activityBarService = activityBarService;
            _this.checked = _this.viewlet && _this.activityBarService.isPinned(_this.viewlet.id);
            return _this;
        }
        ToggleViewletPinnedAction.prototype.run = function (context) {
            var viewlet = this.viewlet || context;
            if (this.activityBarService.isPinned(viewlet.id)) {
                this.activityBarService.unpin(viewlet.id);
            }
            else {
                this.activityBarService.pin(viewlet.id);
            }
            return winjs_base_1.TPromise.as(true);
        };
        ToggleViewletPinnedAction = __decorate([
            __param(1, activityBarService_1.IActivityBarService)
        ], ToggleViewletPinnedAction);
        return ToggleViewletPinnedAction;
    }(actions_1.Action));
    exports.ToggleViewletPinnedAction = ToggleViewletPinnedAction;
    var GlobalActivityAction = (function (_super) {
        __extends(GlobalActivityAction, _super);
        function GlobalActivityAction(activity) {
            return _super.call(this, activity) || this;
        }
        return GlobalActivityAction;
    }(ActivityAction));
    exports.GlobalActivityAction = GlobalActivityAction;
    var GlobalActivityActionItem = (function (_super) {
        __extends(GlobalActivityActionItem, _super);
        function GlobalActivityActionItem(action, themeService, contextMenuService) {
            var _this = _super.call(this, action, { draggable: false }, themeService) || this;
            _this.contextMenuService = contextMenuService;
            return _this;
        }
        GlobalActivityActionItem.prototype.render = function (container) {
            var _this = this;
            _super.prototype.render.call(this, container);
            // Context menus are triggered on mouse down so that an item can be picked
            // and executed with releasing the mouse over it
            this.$container.on(DOM.EventType.MOUSE_DOWN, function (e) {
                DOM.EventHelper.stop(e, true);
                var event = new mouseEvent_1.StandardMouseEvent(e);
                _this.showContextMenu({ x: event.posx, y: event.posy });
            });
            this.$container.on(DOM.EventType.KEY_UP, function (e) {
                var event = new keyboardEvent_1.StandardKeyboardEvent(e);
                if (event.equals(3 /* Enter */) || event.equals(10 /* Space */)) {
                    DOM.EventHelper.stop(e, true);
                    _this.showContextMenu(_this.$container.getHTMLElement());
                }
            });
        };
        GlobalActivityActionItem.prototype.showContextMenu = function (location) {
            var globalAction = this._action;
            var activity = globalAction.activity;
            var actions = activity.getActions();
            this.contextMenuService.showContextMenu({
                getAnchor: function () { return location; },
                getActions: function () { return winjs_base_1.TPromise.as(actions); },
                onHide: function () { return lifecycle_1.dispose(actions); }
            });
        };
        GlobalActivityActionItem = __decorate([
            __param(1, themeService_1.IThemeService),
            __param(2, contextView_1.IContextMenuService)
        ], GlobalActivityActionItem);
        return GlobalActivityActionItem;
    }(ActivityActionItem));
    exports.GlobalActivityActionItem = GlobalActivityActionItem;
    themeService_1.registerThemingParticipant(function (theme, collector) {
        // Styling with Outline color (e.g. high contrast theme)
        var outline = theme.getColor(colorRegistry_1.activeContrastBorder);
        if (outline) {
            collector.addRule("\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item:before {\n\t\t\t\tcontent: \"\";\n\t\t\t\tposition: absolute;\n\t\t\t\ttop: 9px;\n\t\t\t\tleft: 9px;\n\t\t\t\theight: 32px;\n\t\t\t\twidth: 32px;\n\t\t\t\topacity: 0.6;\n\t\t\t}\n\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item.active:before,\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item.active:hover:before,\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item.checked:before,\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item.checked:hover:before {\n\t\t\t\toutline: 1px solid;\n\t\t\t}\n\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item:hover:before {\n\t\t\t\toutline: 1px dashed;\n\t\t\t}\n\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item.active:before,\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item.checked:before,\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item:hover:before {\n\t\t\t\topacity: 1;\n\t\t\t}\n\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item:focus:before {\n\t\t\t\tborder-left-color: " + outline + ";\n\t\t\t}\n\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item.active:before,\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item.active:hover:before,\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item.checked:before,\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item.checked:hover:before,\n\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item:hover:before {\n\t\t\t\toutline-color: " + outline + ";\n\t\t\t}\n\t\t");
        }
        else {
            var focusBorderColor = theme.getColor(colorRegistry_1.focusBorder);
            if (focusBorderColor) {
                collector.addRule("\n\t\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item.active .action-label,\n\t\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item.checked .action-label,\n\t\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item:focus .action-label,\n\t\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item:hover .action-label {\n\t\t\t\t\topacity: 1;\n\t\t\t\t}\n\n\t\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item .action-label {\n\t\t\t\t\topacity: 0.6;\n\t\t\t\t}\n\n\t\t\t\t.monaco-workbench > .activitybar > .content .monaco-action-bar .action-item:focus:before {\n\t\t\t\t\tborder-left-color: " + focusBorderColor + ";\n\t\t\t\t}\n\t\t\t");
            }
        }
    });
});
//# sourceMappingURL=activitybarActions.js.map