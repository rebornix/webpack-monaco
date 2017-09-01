/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/event"], function (require, exports, event_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ViewLocation = (function () {
        function ViewLocation(_id) {
            this._id = _id;
        }
        Object.defineProperty(ViewLocation.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        ViewLocation.getContributedViewLocation = function (value) {
            switch (value) {
                case ViewLocation.Explorer.id: return ViewLocation.Explorer;
                case ViewLocation.Debug.id: return ViewLocation.Debug;
            }
            return void 0;
        };
        ViewLocation.Explorer = new ViewLocation('explorer');
        ViewLocation.Debug = new ViewLocation('debug');
        ViewLocation.Extensions = new ViewLocation('extensions');
        ViewLocation.SCM = new ViewLocation('scm');
        return ViewLocation;
    }());
    exports.ViewLocation = ViewLocation;
    exports.ViewsRegistry = new (function () {
        function class_1() {
            this._onViewsRegistered = new event_1.Emitter();
            this.onViewsRegistered = this._onViewsRegistered.event;
            this._onViewsDeregistered = new event_1.Emitter();
            this.onViewsDeregistered = this._onViewsDeregistered.event;
            this._onTreeViewDataProviderRegistered = new event_1.Emitter();
            this.onTreeViewDataProviderRegistered = this._onTreeViewDataProviderRegistered.event;
            this._views = new Map();
            this._treeViewDataPoviders = new Map();
        }
        class_1.prototype.registerViews = function (viewDescriptors) {
            if (viewDescriptors.length) {
                for (var _i = 0, viewDescriptors_1 = viewDescriptors; _i < viewDescriptors_1.length; _i++) {
                    var viewDescriptor = viewDescriptors_1[_i];
                    var views = this._views.get(viewDescriptor.location);
                    if (!views) {
                        views = [];
                        this._views.set(viewDescriptor.location, views);
                    }
                    views.push(viewDescriptor);
                }
                this._onViewsRegistered.fire(viewDescriptors);
            }
        };
        class_1.prototype.deregisterViews = function (ids, location) {
            var views = this._views.get(location);
            if (!views) {
                return;
            }
            var viewsToDeregister = views.filter(function (view) { return ids.indexOf(view.id) !== -1; });
            if (viewsToDeregister.length) {
                this._views.set(location, views.filter(function (view) { return ids.indexOf(view.id) === -1; }));
            }
            this._onViewsDeregistered.fire(viewsToDeregister);
        };
        class_1.prototype.registerTreeViewDataProvider = function (id, factory) {
            if (!this.isViewRegistered(id)) {
                // TODO: throw error
            }
            this._treeViewDataPoviders.set(id, factory);
            this._onTreeViewDataProviderRegistered.fire(id);
        };
        class_1.prototype.deregisterTreeViewDataProviders = function () {
            this._treeViewDataPoviders.clear();
        };
        class_1.prototype.getViews = function (loc) {
            return this._views.get(loc) || [];
        };
        class_1.prototype.getTreeViewDataProvider = function (id) {
            return this._treeViewDataPoviders.get(id);
        };
        class_1.prototype.isViewRegistered = function (id) {
            var registered = false;
            this._views.forEach(function (views) { return registered = registered || views.some(function (view) { return view.id === id; }); });
            return registered;
        };
        return class_1;
    }());
});
//# sourceMappingURL=viewsRegistry.js.map