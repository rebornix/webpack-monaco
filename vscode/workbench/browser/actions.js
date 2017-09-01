define(["require", "exports", "vs/base/common/winjs.base", "vs/platform/registry/common/platform", "vs/base/common/types", "vs/base/browser/ui/actionbar/actionbar"], function (require, exports, winjs_base_1, platform_1, types, actionbar_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * The action bar contributor allows to add actions to an actionbar in a given context.
     */
    var ActionBarContributor = (function () {
        function ActionBarContributor() {
        }
        /**
         * Returns true if this contributor has actions for the given context.
         */
        ActionBarContributor.prototype.hasActions = function (context) {
            return false;
        };
        /**
         * Returns an array of primary actions in the given context.
         */
        ActionBarContributor.prototype.getActions = function (context) {
            return [];
        };
        /**
         * Returns true if this contributor has secondary actions for the given context.
         */
        ActionBarContributor.prototype.hasSecondaryActions = function (context) {
            return false;
        };
        /**
         * Returns an array of secondary actions in the given context.
         */
        ActionBarContributor.prototype.getSecondaryActions = function (context) {
            return [];
        };
        /**
         * Can return a specific IActionItem to render the given action.
         */
        ActionBarContributor.prototype.getActionItem = function (context, action) {
            return null;
        };
        return ActionBarContributor;
    }());
    exports.ActionBarContributor = ActionBarContributor;
    /**
     * Some predefined scopes to contribute actions to
     */
    exports.Scope = {
        /**
         * Actions inside the global activity bar (DEPRECATED)
         */
        GLOBAL: 'global',
        /**
         * Actions inside viewlets.
         */
        VIEWLET: 'viewlet',
        /**
         * Actions inside panels.
         */
        PANEL: 'panel',
        /**
         * Actions inside editors.
         */
        EDITOR: 'editor',
        /**
         * Actions inside tree widgets.
         */
        VIEWER: 'viewer'
    };
    /**
     * The ContributableActionProvider leverages the actionbar contribution model to find actions.
     */
    var ContributableActionProvider = (function () {
        function ContributableActionProvider() {
            this.registry = platform_1.Registry.as(exports.Extensions.Actionbar);
        }
        ContributableActionProvider.prototype.toContext = function (tree, element) {
            return {
                viewer: tree,
                element: element
            };
        };
        ContributableActionProvider.prototype.hasActions = function (tree, element) {
            var context = this.toContext(tree, element);
            var contributors = this.registry.getActionBarContributors(exports.Scope.VIEWER);
            for (var i = 0; i < contributors.length; i++) {
                var contributor = contributors[i];
                if (contributor.hasActions(context)) {
                    return true;
                }
            }
            return false;
        };
        ContributableActionProvider.prototype.getActions = function (tree, element) {
            var actions = [];
            var context = this.toContext(tree, element);
            // Collect Actions
            var contributors = this.registry.getActionBarContributors(exports.Scope.VIEWER);
            for (var i = 0; i < contributors.length; i++) {
                var contributor = contributors[i];
                if (contributor.hasActions(context)) {
                    actions.push.apply(actions, contributor.getActions(context));
                }
            }
            return winjs_base_1.TPromise.as(prepareActions(actions));
        };
        ContributableActionProvider.prototype.hasSecondaryActions = function (tree, element) {
            var context = this.toContext(tree, element);
            var contributors = this.registry.getActionBarContributors(exports.Scope.VIEWER);
            for (var i = 0; i < contributors.length; i++) {
                var contributor = contributors[i];
                if (contributor.hasSecondaryActions(context)) {
                    return true;
                }
            }
            return false;
        };
        ContributableActionProvider.prototype.getSecondaryActions = function (tree, element) {
            var actions = [];
            var context = this.toContext(tree, element);
            // Collect Actions
            var contributors = this.registry.getActionBarContributors(exports.Scope.VIEWER);
            for (var i = 0; i < contributors.length; i++) {
                var contributor = contributors[i];
                if (contributor.hasSecondaryActions(context)) {
                    actions.push.apply(actions, contributor.getSecondaryActions(context));
                }
            }
            return winjs_base_1.TPromise.as(prepareActions(actions));
        };
        ContributableActionProvider.prototype.getActionItem = function (tree, element, action) {
            var contributors = this.registry.getActionBarContributors(exports.Scope.VIEWER);
            var context = this.toContext(tree, element);
            for (var i = contributors.length - 1; i >= 0; i--) {
                var contributor = contributors[i];
                var itemProvider = contributor.getActionItem(context, action);
                if (itemProvider) {
                    return itemProvider;
                }
            }
            return null;
        };
        return ContributableActionProvider;
    }());
    exports.ContributableActionProvider = ContributableActionProvider;
    // Helper function used in parts to massage actions before showing in action areas
    function prepareActions(actions) {
        if (!actions.length) {
            return actions;
        }
        // Patch order if not provided
        for (var l = 0; l < actions.length; l++) {
            var a = actions[l];
            if (types.isUndefinedOrNull(a.order)) {
                a.order = l;
            }
        }
        // Sort by order
        actions = actions.sort(function (first, second) {
            var firstOrder = first.order;
            var secondOrder = second.order;
            if (firstOrder < secondOrder) {
                return -1;
            }
            else if (firstOrder > secondOrder) {
                return 1;
            }
            else {
                return 0;
            }
        });
        // Clean up leading separators
        var firstIndexOfAction = -1;
        for (var i = 0; i < actions.length; i++) {
            if (actions[i].id === actionbar_1.Separator.ID) {
                continue;
            }
            firstIndexOfAction = i;
            break;
        }
        if (firstIndexOfAction === -1) {
            return [];
        }
        actions = actions.slice(firstIndexOfAction);
        // Clean up trailing separators
        for (var h = actions.length - 1; h >= 0; h--) {
            var isSeparator = actions[h].id === actionbar_1.Separator.ID;
            if (isSeparator) {
                actions.splice(h, 1);
            }
            else {
                break;
            }
        }
        // Clean up separator duplicates
        var foundAction = false;
        for (var k = actions.length - 1; k >= 0; k--) {
            var isSeparator = actions[k].id === actionbar_1.Separator.ID;
            if (isSeparator && !foundAction) {
                actions.splice(k, 1);
            }
            else if (!isSeparator) {
                foundAction = true;
            }
            else if (isSeparator) {
                foundAction = false;
            }
        }
        return actions;
    }
    exports.prepareActions = prepareActions;
    exports.Extensions = {
        Actionbar: 'workbench.contributions.actionbar'
    };
    var ActionBarRegistry = (function () {
        function ActionBarRegistry() {
            this.actionBarContributorConstructors = [];
            this.actionBarContributorInstances = Object.create(null);
        }
        ActionBarRegistry.prototype.setInstantiationService = function (service) {
            this.instantiationService = service;
            while (this.actionBarContributorConstructors.length > 0) {
                var entry = this.actionBarContributorConstructors.shift();
                this.createActionBarContributor(entry.scope, entry.ctor);
            }
        };
        ActionBarRegistry.prototype.createActionBarContributor = function (scope, ctor) {
            var instance = this.instantiationService.createInstance(ctor);
            var target = this.actionBarContributorInstances[scope];
            if (!target) {
                target = this.actionBarContributorInstances[scope] = [];
            }
            target.push(instance);
        };
        ActionBarRegistry.prototype.getContributors = function (scope) {
            return this.actionBarContributorInstances[scope] || [];
        };
        ActionBarRegistry.prototype.getActionBarActionsForContext = function (scope, context) {
            var actions = [];
            // Go through contributors for scope
            this.getContributors(scope).forEach(function (contributor) {
                // Primary Actions
                if (contributor.hasActions(context)) {
                    actions.push.apply(actions, contributor.getActions(context));
                }
            });
            return actions;
        };
        ActionBarRegistry.prototype.getSecondaryActionBarActionsForContext = function (scope, context) {
            var actions = [];
            // Go through contributors
            this.getContributors(scope).forEach(function (contributor) {
                // Secondary Actions
                if (contributor.hasSecondaryActions(context)) {
                    actions.push.apply(actions, contributor.getSecondaryActions(context));
                }
            });
            return actions;
        };
        ActionBarRegistry.prototype.getActionItemForContext = function (scope, context, action) {
            var contributors = this.getContributors(scope);
            for (var i = 0; i < contributors.length; i++) {
                var contributor = contributors[i];
                var item = contributor.getActionItem(context, action);
                if (item) {
                    return item;
                }
            }
            return null;
        };
        ActionBarRegistry.prototype.registerActionBarContributor = function (scope, ctor) {
            if (!this.instantiationService) {
                this.actionBarContributorConstructors.push({
                    scope: scope,
                    ctor: ctor
                });
            }
            else {
                this.createActionBarContributor(scope, ctor);
            }
        };
        ActionBarRegistry.prototype.getActionBarContributors = function (scope) {
            return this.getContributors(scope).slice(0);
        };
        return ActionBarRegistry;
    }());
    platform_1.Registry.add(exports.Extensions.Actionbar, new ActionBarRegistry());
});
//# sourceMappingURL=actions.js.map