define(["require", "exports", "vs/platform/registry/common/platform", "vs/platform/statusbar/common/statusbar", "vs/platform/instantiation/common/descriptors"], function (require, exports, platform_1, statusbarService, descriptors_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StatusbarAlignment = statusbarService.StatusbarAlignment;
    var StatusbarItemDescriptor = (function () {
        function StatusbarItemDescriptor(ctor, alignment, priority) {
            this.syncDescriptor = descriptors_1.createSyncDescriptor(ctor);
            this.alignment = alignment || exports.StatusbarAlignment.LEFT;
            this.priority = priority || 0;
        }
        return StatusbarItemDescriptor;
    }());
    exports.StatusbarItemDescriptor = StatusbarItemDescriptor;
    var StatusbarRegistry = (function () {
        function StatusbarRegistry() {
            this._items = [];
        }
        Object.defineProperty(StatusbarRegistry.prototype, "items", {
            get: function () {
                return this._items;
            },
            enumerable: true,
            configurable: true
        });
        StatusbarRegistry.prototype.registerStatusbarItem = function (descriptor) {
            this._items.push(descriptor);
        };
        return StatusbarRegistry;
    }());
    exports.Extensions = {
        Statusbar: 'workbench.contributions.statusbar'
    };
    platform_1.Registry.add(exports.Extensions.Statusbar, new StatusbarRegistry());
});
//# sourceMappingURL=statusbar.js.map