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
define(["require", "exports", "vs/nls", "vs/base/common/winjs.base", "vs/base/browser/dom", "vs/base/common/arrays", "vs/base/common/errors", "vs/base/browser/builder", "vs/base/browser/ui/actionbar/actionbar", "vs/workbench/browser/activity", "vs/platform/registry/common/platform", "vs/workbench/browser/part", "vs/workbench/browser/parts/activitybar/activitybarActions", "vs/workbench/services/viewlet/browser/viewlet", "vs/workbench/services/part/common/partService", "vs/platform/instantiation/common/instantiation", "vs/platform/extensions/common/extensions", "vs/platform/storage/common/storage", "vs/workbench/common/memento", "vs/platform/contextview/browser/contextView", "vs/base/browser/mouseEvent", "vs/base/common/lifecycle", "vs/workbench/browser/actions/toggleActivityBarVisibility", "vs/platform/theme/common/themeService", "vs/workbench/common/theme", "vs/platform/theme/common/colorRegistry", "vs/css!./media/activitybarpart"], function (require, exports, nls, winjs_base_1, DOM, arrays, errors_1, builder_1, actionbar_1, activity_1, platform_1, part_1, activitybarActions_1, viewlet_1, partService_1, instantiation_1, extensions_1, storage_1, memento_1, contextView_1, mouseEvent_1, lifecycle_1, toggleActivityBarVisibility_1, themeService_1, theme_1, colorRegistry_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ActivitybarPart = (function (_super) {
        __extends(ActivitybarPart, _super);
        function ActivitybarPart(id, viewletService, extensionService, storageService, contextMenuService, instantiationService, partService, themeService) {
            var _this = _super.call(this, id, { hasTitle: false }, themeService) || this;
            _this.viewletService = viewletService;
            _this.extensionService = extensionService;
            _this.storageService = storageService;
            _this.contextMenuService = contextMenuService;
            _this.instantiationService = instantiationService;
            _this.partService = partService;
            _this.globalActivityIdToActions = Object.create(null);
            _this.viewletIdToActionItems = Object.create(null);
            _this.viewletIdToActions = Object.create(null);
            _this.viewletIdToActivityStack = Object.create(null);
            _this.memento = _this.getMemento(_this.storageService, memento_1.Scope.GLOBAL);
            var pinnedViewlets = _this.memento[ActivitybarPart.PINNED_VIEWLETS];
            if (pinnedViewlets) {
                _this.pinnedViewlets = pinnedViewlets
                    .map(function (id) { return id === 'workbench.view.git' ? 'workbench.view.scm' : id; })
                    .filter(arrays.uniqueFilter(function (str) { return str; }));
            }
            else {
                _this.pinnedViewlets = _this.viewletService.getViewlets().map(function (v) { return v.id; });
            }
            _this.registerListeners();
            return _this;
        }
        ActivitybarPart.prototype.registerListeners = function () {
            var _this = this;
            // Activate viewlet action on opening of a viewlet
            this.toUnbind.push(this.viewletService.onDidViewletOpen(function (viewlet) { return _this.onDidViewletOpen(viewlet); }));
            // Deactivate viewlet action on close
            this.toUnbind.push(this.viewletService.onDidViewletClose(function (viewlet) { return _this.onDidViewletClose(viewlet); }));
        };
        ActivitybarPart.prototype.onDidViewletOpen = function (viewlet) {
            var id = viewlet.getId();
            if (this.viewletIdToActions[id]) {
                this.viewletIdToActions[id].activate();
            }
            var activeUnpinnedViewletShouldClose = this.activeUnpinnedViewlet && this.activeUnpinnedViewlet.id !== viewlet.getId();
            var activeUnpinnedViewletShouldShow = !this.getPinnedViewlets().some(function (v) { return v.id === viewlet.getId(); });
            if (activeUnpinnedViewletShouldShow || activeUnpinnedViewletShouldClose) {
                this.updateViewletSwitcher();
            }
        };
        ActivitybarPart.prototype.onDidViewletClose = function (viewlet) {
            var id = viewlet.getId();
            if (this.viewletIdToActions[id]) {
                this.viewletIdToActions[id].deactivate();
            }
        };
        ActivitybarPart.prototype.showGlobalActivity = function (globalActivityId, badge) {
            if (!badge) {
                throw errors_1.illegalArgument('badge');
            }
            var action = this.globalActivityIdToActions[globalActivityId];
            if (!action) {
                throw errors_1.illegalArgument('globalActivityId');
            }
            action.setBadge(badge);
            return lifecycle_1.toDisposable(function () { return action.setBadge(undefined); });
        };
        ActivitybarPart.prototype.showActivity = function (viewletId, badge, clazz) {
            var _this = this;
            if (!badge) {
                throw errors_1.illegalArgument('badge');
            }
            var activity = { badge: badge, clazz: clazz };
            var stack = this.viewletIdToActivityStack[viewletId] || (this.viewletIdToActivityStack[viewletId] = []);
            stack.unshift(activity);
            this.updateActivity(viewletId);
            return {
                dispose: function () {
                    var stack = _this.viewletIdToActivityStack[viewletId];
                    if (!stack) {
                        return;
                    }
                    var idx = stack.indexOf(activity);
                    if (idx < 0) {
                        return;
                    }
                    stack.splice(idx, 1);
                    if (stack.length === 0) {
                        delete _this.viewletIdToActivityStack[viewletId];
                    }
                    _this.updateActivity(viewletId);
                }
            };
        };
        ActivitybarPart.prototype.updateActivity = function (viewletId) {
            var action = this.viewletIdToActions[viewletId];
            if (!action) {
                return;
            }
            var stack = this.viewletIdToActivityStack[viewletId];
            if (!stack || !stack.length) {
                // reset
                action.setBadge(undefined);
            }
            else {
                // update
                var _a = stack[0], badge = _a.badge, clazz = _a.clazz;
                action.setBadge(badge);
                if (clazz) {
                    action.class = clazz;
                }
            }
        };
        ActivitybarPart.prototype.createContentArea = function (parent) {
            var _this = this;
            var $el = builder_1.$(parent);
            var $result = builder_1.$('.content').appendTo($el);
            // Top Actionbar with action items for each viewlet action
            this.createViewletSwitcher($result.clone());
            // Top Actionbar with action items for each viewlet action
            this.createGlobalActivityActionBar($result.getHTMLElement());
            // Contextmenu for viewlets
            builder_1.$(parent).on('contextmenu', function (e) {
                DOM.EventHelper.stop(e, true);
                _this.showContextMenu(e);
            }, this.toUnbind);
            // Allow to drop at the end to move viewlet to the end
            builder_1.$(parent).on(DOM.EventType.DROP, function (e) {
                var draggedViewlet = activitybarActions_1.ViewletActionItem.getDraggedViewlet();
                if (draggedViewlet) {
                    DOM.EventHelper.stop(e, true);
                    activitybarActions_1.ViewletActionItem.clearDraggedViewlet();
                    var targetId = _this.pinnedViewlets[_this.pinnedViewlets.length - 1];
                    if (targetId !== draggedViewlet.id) {
                        _this.move(draggedViewlet.id, _this.pinnedViewlets[_this.pinnedViewlets.length - 1]);
                    }
                }
            });
            return $result;
        };
        ActivitybarPart.prototype.updateStyles = function () {
            _super.prototype.updateStyles.call(this);
            // Part container
            var container = this.getContainer();
            var background = this.getColor(theme_1.ACTIVITY_BAR_BACKGROUND);
            container.style('background-color', background);
            var borderColor = this.getColor(theme_1.ACTIVITY_BAR_BORDER) || this.getColor(colorRegistry_1.contrastBorder);
            var isPositionLeft = this.partService.getSideBarPosition() === partService_1.Position.LEFT;
            container.style('box-sizing', borderColor && isPositionLeft ? 'border-box' : null);
            container.style('border-right-width', borderColor && isPositionLeft ? '1px' : null);
            container.style('border-right-style', borderColor && isPositionLeft ? 'solid' : null);
            container.style('border-right-color', isPositionLeft ? borderColor : null);
            container.style('border-left-width', borderColor && !isPositionLeft ? '1px' : null);
            container.style('border-left-style', borderColor && !isPositionLeft ? 'solid' : null);
            container.style('border-left-color', !isPositionLeft ? borderColor : null);
        };
        ActivitybarPart.prototype.showContextMenu = function (e) {
            var _this = this;
            var event = new mouseEvent_1.StandardMouseEvent(e);
            var actions = this.viewletService.getViewlets().map(function (viewlet) { return _this.instantiationService.createInstance(activitybarActions_1.ToggleViewletPinnedAction, viewlet); });
            actions.push(new actionbar_1.Separator());
            actions.push(this.instantiationService.createInstance(toggleActivityBarVisibility_1.ToggleActivityBarVisibilityAction, toggleActivityBarVisibility_1.ToggleActivityBarVisibilityAction.ID, nls.localize('hideActivitBar', "Hide Activity Bar")));
            this.contextMenuService.showContextMenu({
                getAnchor: function () { return { x: event.posx + 1, y: event.posy }; },
                getActions: function () { return winjs_base_1.TPromise.as(actions); },
                onHide: function () { return lifecycle_1.dispose(actions); }
            });
        };
        ActivitybarPart.prototype.createViewletSwitcher = function (div) {
            var _this = this;
            this.viewletSwitcherBar = new actionbar_1.ActionBar(div, {
                actionItemProvider: function (action) { return action instanceof activitybarActions_1.ViewletOverflowActivityAction ? _this.viewletOverflowActionItem : _this.viewletIdToActionItems[action.id]; },
                orientation: actionbar_1.ActionsOrientation.VERTICAL,
                ariaLabel: nls.localize('activityBarAriaLabel', "Active View Switcher"),
                animated: false
            });
            this.updateViewletSwitcher();
            // Update viewlet switcher when external viewlets become ready
            this.extensionService.onReady().then(function () { return _this.updateViewletSwitcher(); });
        };
        ActivitybarPart.prototype.createGlobalActivityActionBar = function (container) {
            var _this = this;
            var activityRegistry = platform_1.Registry.as(activity_1.GlobalActivityExtensions);
            var descriptors = activityRegistry.getActivities();
            var actions = descriptors
                .map(function (d) { return _this.instantiationService.createInstance(d); })
                .map(function (a) { return new activitybarActions_1.GlobalActivityAction(a); });
            this.globalActionBar = new actionbar_1.ActionBar(container, {
                actionItemProvider: function (a) { return _this.instantiationService.createInstance(activitybarActions_1.GlobalActivityActionItem, a); },
                orientation: actionbar_1.ActionsOrientation.VERTICAL,
                ariaLabel: nls.localize('globalActions', "Global Actions"),
                animated: false
            });
            actions.forEach(function (a) {
                _this.globalActivityIdToActions[a.id] = a;
                _this.globalActionBar.push(a);
            });
        };
        ActivitybarPart.prototype.updateViewletSwitcher = function () {
            var _this = this;
            if (!this.viewletSwitcherBar) {
                return; // We have not been rendered yet so there is nothing to update.
            }
            var viewletsToShow = this.getPinnedViewlets();
            // Always show the active viewlet even if it is marked to be hidden
            var activeViewlet = this.viewletService.getActiveViewlet();
            if (activeViewlet && !viewletsToShow.some(function (viewlet) { return viewlet.id === activeViewlet.getId(); })) {
                this.activeUnpinnedViewlet = this.viewletService.getViewlet(activeViewlet.getId());
                viewletsToShow.push(this.activeUnpinnedViewlet);
            }
            else {
                this.activeUnpinnedViewlet = void 0;
            }
            // Ensure we are not showing more viewlets than we have height for
            var overflows = false;
            if (this.dimension) {
                var availableHeight = this.dimension.height;
                if (this.globalActionBar) {
                    availableHeight -= (this.globalActionBar.items.length * ActivitybarPart.ACTIVITY_ACTION_HEIGHT); // adjust for global actions showing
                }
                var maxVisible = Math.floor(availableHeight / ActivitybarPart.ACTIVITY_ACTION_HEIGHT);
                overflows = viewletsToShow.length > maxVisible;
                if (overflows) {
                    viewletsToShow = viewletsToShow.slice(0, maxVisible - 1 /* make room for overflow action */);
                }
            }
            var visibleViewlets = Object.keys(this.viewletIdToActions);
            var visibleViewletsChange = !arrays.equals(viewletsToShow.map(function (viewlet) { return viewlet.id; }), visibleViewlets);
            // Pull out overflow action if there is a viewlet change so that we can add it to the end later
            if (this.viewletOverflowAction && visibleViewletsChange) {
                this.viewletSwitcherBar.pull(this.viewletSwitcherBar.length() - 1);
                this.viewletOverflowAction.dispose();
                this.viewletOverflowAction = null;
                this.viewletOverflowActionItem.dispose();
                this.viewletOverflowActionItem = null;
            }
            // Pull out viewlets that overflow or got hidden
            var viewletIdsToShow = viewletsToShow.map(function (v) { return v.id; });
            visibleViewlets.forEach(function (viewletId) {
                if (viewletIdsToShow.indexOf(viewletId) === -1) {
                    _this.pullViewlet(viewletId);
                }
            });
            // Built actions for viewlets to show
            var newViewletsToShow = viewletsToShow
                .filter(function (viewlet) { return !_this.viewletIdToActions[viewlet.id]; })
                .map(function (viewlet) { return _this.toAction(viewlet); });
            // Update when we have new viewlets to show
            if (newViewletsToShow.length) {
                // Add to viewlet switcher
                this.viewletSwitcherBar.push(newViewletsToShow, { label: true, icon: true });
                // Make sure to activate the active one
                var activeViewlet_1 = this.viewletService.getActiveViewlet();
                if (activeViewlet_1) {
                    var activeViewletEntry = this.viewletIdToActions[activeViewlet_1.getId()];
                    if (activeViewletEntry) {
                        activeViewletEntry.activate();
                    }
                }
                // Make sure to restore activity
                Object.keys(this.viewletIdToActions).forEach(function (viewletId) {
                    _this.updateActivity(viewletId);
                });
            }
            // Add overflow action as needed
            if (visibleViewletsChange && overflows) {
                this.viewletOverflowAction = this.instantiationService.createInstance(activitybarActions_1.ViewletOverflowActivityAction, function () { return _this.viewletOverflowActionItem.showMenu(); });
                this.viewletOverflowActionItem = this.instantiationService.createInstance(activitybarActions_1.ViewletOverflowActivityActionItem, this.viewletOverflowAction, function () { return _this.getOverflowingViewlets(); }, function (viewlet) { return _this.viewletIdToActivityStack[viewlet.id] && _this.viewletIdToActivityStack[viewlet.id][0].badge; });
                this.viewletSwitcherBar.push(this.viewletOverflowAction, { label: true, icon: true });
            }
        };
        ActivitybarPart.prototype.getOverflowingViewlets = function () {
            var viewlets = this.getPinnedViewlets();
            if (this.activeUnpinnedViewlet) {
                viewlets.push(this.activeUnpinnedViewlet);
            }
            var visibleViewlets = Object.keys(this.viewletIdToActions);
            return viewlets.filter(function (viewlet) { return visibleViewlets.indexOf(viewlet.id) === -1; });
        };
        ActivitybarPart.prototype.getVisibleViewlets = function () {
            var viewlets = this.viewletService.getViewlets();
            var visibleViewlets = Object.keys(this.viewletIdToActions);
            return viewlets.filter(function (viewlet) { return visibleViewlets.indexOf(viewlet.id) >= 0; });
        };
        ActivitybarPart.prototype.getPinnedViewlets = function () {
            var _this = this;
            return this.pinnedViewlets.map(function (viewletId) { return _this.viewletService.getViewlet(viewletId); }).filter(function (v) { return !!v; }); // ensure to remove those that might no longer exist
        };
        ActivitybarPart.prototype.pullViewlet = function (viewletId) {
            var index = Object.keys(this.viewletIdToActions).indexOf(viewletId);
            if (index >= 0) {
                this.viewletSwitcherBar.pull(index);
                var action = this.viewletIdToActions[viewletId];
                action.dispose();
                delete this.viewletIdToActions[viewletId];
                var actionItem = this.viewletIdToActionItems[action.id];
                actionItem.dispose();
                delete this.viewletIdToActionItems[action.id];
            }
        };
        ActivitybarPart.prototype.toAction = function (viewlet) {
            var action = this.instantiationService.createInstance(activitybarActions_1.ViewletActivityAction, viewlet);
            this.viewletIdToActionItems[action.id] = this.instantiationService.createInstance(activitybarActions_1.ViewletActionItem, action);
            this.viewletIdToActions[viewlet.id] = action;
            return action;
        };
        ActivitybarPart.prototype.getPinned = function () {
            return this.pinnedViewlets;
        };
        ActivitybarPart.prototype.unpin = function (viewletId) {
            var _this = this;
            if (!this.isPinned(viewletId)) {
                return;
            }
            var activeViewlet = this.viewletService.getActiveViewlet();
            var defaultViewletId = this.viewletService.getDefaultViewletId();
            var visibleViewlets = this.getVisibleViewlets();
            var unpinPromise;
            // Case: viewlet is not the active one or the active one is a different one
            // Solv: we do nothing
            if (!activeViewlet || activeViewlet.getId() !== viewletId) {
                unpinPromise = winjs_base_1.TPromise.as(null);
            }
            else if (defaultViewletId !== viewletId && this.isPinned(defaultViewletId)) {
                unpinPromise = this.viewletService.openViewlet(defaultViewletId, true);
            }
            else if (visibleViewlets.length === 1) {
                unpinPromise = this.partService.setSideBarHidden(true);
            }
            else {
                unpinPromise = this.viewletService.openViewlet(visibleViewlets.filter(function (viewlet) { return viewlet.id !== viewletId; })[0].id, true);
            }
            unpinPromise.then(function () {
                // then remove from pinned and update switcher
                var index = _this.pinnedViewlets.indexOf(viewletId);
                _this.pinnedViewlets.splice(index, 1);
                _this.updateViewletSwitcher();
            });
        };
        ActivitybarPart.prototype.isPinned = function (viewletId) {
            return this.pinnedViewlets.indexOf(viewletId) >= 0;
        };
        ActivitybarPart.prototype.pin = function (viewletId, update) {
            var _this = this;
            if (update === void 0) { update = true; }
            if (this.isPinned(viewletId)) {
                return;
            }
            // first open that viewlet
            this.viewletService.openViewlet(viewletId, true).then(function () {
                // then update
                _this.pinnedViewlets.push(viewletId);
                _this.pinnedViewlets = arrays.distinct(_this.pinnedViewlets);
                if (update) {
                    _this.updateViewletSwitcher();
                }
            });
        };
        ActivitybarPart.prototype.move = function (viewletId, toViewletId) {
            var _this = this;
            // Make sure a moved viewlet gets pinned
            if (!this.isPinned(viewletId)) {
                this.pin(viewletId, false /* defer update, we take care of it */);
            }
            var fromIndex = this.pinnedViewlets.indexOf(viewletId);
            var toIndex = this.pinnedViewlets.indexOf(toViewletId);
            this.pinnedViewlets.splice(fromIndex, 1);
            this.pinnedViewlets.splice(toIndex, 0, viewletId);
            // Clear viewlets that are impacted by the move
            var visibleViewlets = Object.keys(this.viewletIdToActions);
            for (var i = Math.min(fromIndex, toIndex); i < visibleViewlets.length; i++) {
                this.pullViewlet(visibleViewlets[i]);
            }
            // timeout helps to prevent artifacts from showing up
            setTimeout(function () {
                _this.updateViewletSwitcher();
            }, 0);
        };
        /**
         * Layout title, content and status area in the given dimension.
         */
        ActivitybarPart.prototype.layout = function (dimension) {
            // Pass to super
            var sizes = _super.prototype.layout.call(this, dimension);
            this.dimension = sizes[1];
            // Update switcher to handle overflow issues
            this.updateViewletSwitcher();
            return sizes;
        };
        ActivitybarPart.prototype.dispose = function () {
            if (this.viewletSwitcherBar) {
                this.viewletSwitcherBar.dispose();
                this.viewletSwitcherBar = null;
            }
            if (this.globalActionBar) {
                this.globalActionBar.dispose();
                this.globalActionBar = null;
            }
            _super.prototype.dispose.call(this);
        };
        ActivitybarPart.prototype.shutdown = function () {
            // Persist Hidden State
            this.memento[ActivitybarPart.PINNED_VIEWLETS] = this.pinnedViewlets;
            // Pass to super
            _super.prototype.shutdown.call(this);
        };
        ActivitybarPart.ACTIVITY_ACTION_HEIGHT = 50;
        ActivitybarPart.PINNED_VIEWLETS = 'workbench.activity.pinnedViewlets';
        ActivitybarPart = __decorate([
            __param(1, viewlet_1.IViewletService),
            __param(2, extensions_1.IExtensionService),
            __param(3, storage_1.IStorageService),
            __param(4, contextView_1.IContextMenuService),
            __param(5, instantiation_1.IInstantiationService),
            __param(6, partService_1.IPartService),
            __param(7, themeService_1.IThemeService)
        ], ActivitybarPart);
        return ActivitybarPart;
    }(part_1.Part));
    exports.ActivitybarPart = ActivitybarPart;
});
//# sourceMappingURL=activitybarPart.js.map