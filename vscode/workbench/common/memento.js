define(["require", "exports", "vs/base/common/types", "vs/platform/storage/common/storage"], function (require, exports, types, storage_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Supported memento scopes.
     */
    var Scope;
    (function (Scope) {
        /**
         * The memento will be scoped to all workspaces of this domain.
         */
        Scope[Scope["GLOBAL"] = 0] = "GLOBAL";
        /**
         * The memento will be scoped to the current workspace.
         */
        Scope[Scope["WORKSPACE"] = 1] = "WORKSPACE";
    })(Scope = exports.Scope || (exports.Scope = {}));
    /**
     * A memento provides access to a datastructure that is persisted and restored as part of the workbench lifecycle.
     */
    var Memento = (function () {
        function Memento(id) {
            this.id = Memento.COMMON_PREFIX + id.toLowerCase();
        }
        /**
         * Returns a JSON Object that represents the data of this memento. The optional
         * parameter scope allows to specify the scope of the memento to load. If not
         * provided, the scope will be global, Memento.Scope.WORKSPACE can be used to
         * scope the memento to the workspace.
         */
        Memento.prototype.getMemento = function (storageService, scope) {
            if (scope === void 0) { scope = Scope.GLOBAL; }
            // Scope by Workspace
            if (scope === Scope.WORKSPACE) {
                var workspaceMemento = Memento.workspaceMementos[this.id];
                if (!workspaceMemento) {
                    workspaceMemento = new ScopedMemento(this.id, scope, storageService);
                    Memento.workspaceMementos[this.id] = workspaceMemento;
                }
                return workspaceMemento.getMemento();
            }
            // Use global scope
            var globalMemento = Memento.globalMementos[this.id];
            if (!globalMemento) {
                globalMemento = new ScopedMemento(this.id, scope, storageService);
                Memento.globalMementos[this.id] = globalMemento;
            }
            return globalMemento.getMemento();
        };
        /**
         * Saves all data of the mementos that have been loaded to the local storage. This includes
         * global and workspace scope.
         */
        Memento.prototype.saveMemento = function () {
            // Global
            if (Memento.globalMementos[this.id]) {
                Memento.globalMementos[this.id].save();
            }
            // Workspace
            if (Memento.workspaceMementos[this.id]) {
                Memento.workspaceMementos[this.id].save();
            }
        };
        // Mementos are static to ensure that for a given component with an id only ever one memento gets loaded
        Memento.globalMementos = {};
        Memento.workspaceMementos = {};
        Memento.COMMON_PREFIX = 'memento/';
        return Memento;
    }());
    exports.Memento = Memento;
    var ScopedMemento = (function () {
        function ScopedMemento(id, scope, storageService) {
            this.storageService = storageService;
            this.id = id;
            this.scope = scope;
            this.mementoObj = this.loadMemento();
        }
        ScopedMemento.prototype.getMemento = function () {
            return this.mementoObj;
        };
        ScopedMemento.prototype.loadMemento = function () {
            var storageScope = this.scope === Scope.GLOBAL ? storage_1.StorageScope.GLOBAL : storage_1.StorageScope.WORKSPACE;
            var memento = this.storageService.get(this.id, storageScope);
            if (memento) {
                return JSON.parse(memento);
            }
            return {};
        };
        ScopedMemento.prototype.save = function () {
            var storageScope = this.scope === Scope.GLOBAL ? storage_1.StorageScope.GLOBAL : storage_1.StorageScope.WORKSPACE;
            if (!types.isEmptyObject(this.mementoObj)) {
                this.storageService.store(this.id, JSON.stringify(this.mementoObj), storageScope);
            }
            else {
                this.storageService.remove(this.id, storageScope);
            }
        };
        return ScopedMemento;
    }());
});
//# sourceMappingURL=memento.js.map