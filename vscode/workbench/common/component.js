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
define(["require", "exports", "vs/workbench/common/memento", "vs/workbench/common/theme"], function (require, exports, memento_1, theme_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var Component = (function (_super) {
        __extends(Component, _super);
        function Component(id, themeService) {
            var _this = _super.call(this, themeService) || this;
            _this.id = id;
            _this.componentMemento = new memento_1.Memento(_this.id);
            return _this;
        }
        Component.prototype.getId = function () {
            return this.id;
        };
        /**
        * Returns a JSON Object that represents the data of this memento. The optional
        * parameter scope allows to specify the scope of the memento to load. If not
        * provided, the scope will be global, Scope.WORKSPACE can be used to
        * scope the memento to the workspace.
        *
        * Mementos are shared across components with the same id. This means that multiple components
        * with the same id will store data into the same data structure.
        */
        Component.prototype.getMemento = function (storageService, scope) {
            if (scope === void 0) { scope = memento_1.Scope.GLOBAL; }
            return this.componentMemento.getMemento(storageService, scope);
        };
        /**
        * Saves all data of the mementos that have been loaded to the local storage. This includes
        * global and workspace scope.
        *
        * Mementos are shared across components with the same id. This means that multiple components
        * with the same id will store data into the same data structure.
        */
        Component.prototype.saveMemento = function () {
            this.componentMemento.saveMemento();
        };
        Component.prototype.shutdown = function () {
            // Save Memento
            this.saveMemento();
        };
        return Component;
    }(theme_1.Themable));
    exports.Component = Component;
});
//# sourceMappingURL=component.js.map