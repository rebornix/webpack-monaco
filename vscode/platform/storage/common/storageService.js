define(["require", "exports", "vs/base/common/types", "vs/base/common/errors", "vs/base/common/strings", "vs/platform/storage/common/storage"], function (require, exports, types, errors, strings, storage_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var StorageService = (function () {
        function StorageService(globalStorage, workspaceStorage, workspaceId, legacyWorkspaceId) {
            this.workspaceId = workspaceId;
            this._globalStorage = globalStorage;
            this._workspaceStorage = workspaceStorage || globalStorage;
            // Calculate workspace storage key
            this.workspaceKey = this.getWorkspaceKey(workspaceId);
            // Make sure to delete all workspace storage if the workspace has been recreated meanwhile
            // which is only possible if a id property is provided that we can check on
            if (types.isNumber(legacyWorkspaceId)) {
                this.cleanupWorkspaceScope(legacyWorkspaceId);
            }
        }
        Object.defineProperty(StorageService.prototype, "storageId", {
            get: function () {
                return this.workspaceId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StorageService.prototype, "globalStorage", {
            get: function () {
                return this._globalStorage;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(StorageService.prototype, "workspaceStorage", {
            get: function () {
                return this._workspaceStorage;
            },
            enumerable: true,
            configurable: true
        });
        StorageService.prototype.getWorkspaceKey = function (id) {
            if (!id) {
                return StorageService.NO_WORKSPACE_IDENTIFIER;
            }
            // Special case file:// URIs: strip protocol from key to produce shorter key
            var fileProtocol = 'file:///';
            if (id.indexOf(fileProtocol) === 0) {
                id = id.substr(fileProtocol.length);
            }
            // Always end with "/"
            return strings.rtrim(id, '/') + "/";
        };
        StorageService.prototype.cleanupWorkspaceScope = function (workspaceUid) {
            var _this = this;
            // Get stored identifier from storage
            var id = this.getInteger(StorageService.WORKSPACE_IDENTIFIER, storage_1.StorageScope.WORKSPACE);
            // If identifier differs, assume the workspace got recreated and thus clean all storage for this workspace
            if (types.isNumber(id) && workspaceUid !== id) {
                var keyPrefix = this.toStorageKey('', storage_1.StorageScope.WORKSPACE);
                var toDelete = [];
                var length_1 = this._workspaceStorage.length;
                for (var i = 0; i < length_1; i++) {
                    var key = this._workspaceStorage.key(i);
                    if (key.indexOf(StorageService.WORKSPACE_PREFIX) < 0) {
                        continue; // ignore stored things that don't belong to storage service or are defined globally
                    }
                    // Check for match on prefix
                    if (key.indexOf(keyPrefix) === 0) {
                        toDelete.push(key);
                    }
                }
                // Run the delete
                toDelete.forEach(function (keyToDelete) {
                    _this._workspaceStorage.removeItem(keyToDelete);
                });
            }
            // Store workspace identifier now
            if (workspaceUid !== id) {
                this.store(StorageService.WORKSPACE_IDENTIFIER, workspaceUid, storage_1.StorageScope.WORKSPACE);
            }
        };
        StorageService.prototype.clear = function () {
            this._globalStorage.clear();
            this._workspaceStorage.clear();
        };
        StorageService.prototype.store = function (key, value, scope) {
            if (scope === void 0) { scope = storage_1.StorageScope.GLOBAL; }
            var storage = (scope === storage_1.StorageScope.GLOBAL) ? this._globalStorage : this._workspaceStorage;
            if (types.isUndefinedOrNull(value)) {
                this.remove(key, scope); // we cannot store null or undefined, in that case we remove the key
                return;
            }
            var storageKey = this.toStorageKey(key, scope);
            // Store
            try {
                storage.setItem(storageKey, value);
            }
            catch (error) {
                errors.onUnexpectedError(error);
            }
        };
        StorageService.prototype.get = function (key, scope, defaultValue) {
            if (scope === void 0) { scope = storage_1.StorageScope.GLOBAL; }
            var storage = (scope === storage_1.StorageScope.GLOBAL) ? this._globalStorage : this._workspaceStorage;
            var value = storage.getItem(this.toStorageKey(key, scope));
            if (types.isUndefinedOrNull(value)) {
                return defaultValue;
            }
            return value;
        };
        StorageService.prototype.getInteger = function (key, scope, defaultValue) {
            if (scope === void 0) { scope = storage_1.StorageScope.GLOBAL; }
            var value = this.get(key, scope, defaultValue);
            if (types.isUndefinedOrNull(value)) {
                return defaultValue;
            }
            return parseInt(value, 10);
        };
        StorageService.prototype.getBoolean = function (key, scope, defaultValue) {
            if (scope === void 0) { scope = storage_1.StorageScope.GLOBAL; }
            var value = this.get(key, scope, defaultValue);
            if (types.isUndefinedOrNull(value)) {
                return defaultValue;
            }
            if (types.isString(value)) {
                return value.toLowerCase() === 'true' ? true : false;
            }
            return value ? true : false;
        };
        StorageService.prototype.remove = function (key, scope) {
            if (scope === void 0) { scope = storage_1.StorageScope.GLOBAL; }
            var storage = (scope === storage_1.StorageScope.GLOBAL) ? this._globalStorage : this._workspaceStorage;
            var storageKey = this.toStorageKey(key, scope);
            // Remove
            storage.removeItem(storageKey);
        };
        StorageService.prototype.toStorageKey = function (key, scope) {
            if (scope === storage_1.StorageScope.GLOBAL) {
                return StorageService.GLOBAL_PREFIX + key.toLowerCase();
            }
            return StorageService.WORKSPACE_PREFIX + this.workspaceKey + key.toLowerCase();
        };
        StorageService.COMMON_PREFIX = 'storage://';
        StorageService.GLOBAL_PREFIX = StorageService.COMMON_PREFIX + "global/";
        StorageService.WORKSPACE_PREFIX = StorageService.COMMON_PREFIX + "workspace/";
        StorageService.WORKSPACE_IDENTIFIER = 'workspaceidentifier';
        StorageService.NO_WORKSPACE_IDENTIFIER = '__$noWorkspace__';
        return StorageService;
    }());
    exports.StorageService = StorageService;
    var InMemoryLocalStorage = (function () {
        function InMemoryLocalStorage() {
            this.store = {};
        }
        Object.defineProperty(InMemoryLocalStorage.prototype, "length", {
            get: function () {
                return Object.keys(this.store).length;
            },
            enumerable: true,
            configurable: true
        });
        InMemoryLocalStorage.prototype.key = function (index) {
            var keys = Object.keys(this.store);
            if (keys.length > index) {
                return keys[index];
            }
            return null;
        };
        InMemoryLocalStorage.prototype.clear = function () {
            this.store = {};
        };
        InMemoryLocalStorage.prototype.setItem = function (key, value) {
            this.store[key] = value.toString();
        };
        InMemoryLocalStorage.prototype.getItem = function (key) {
            var item = this.store[key];
            if (!types.isUndefinedOrNull(item)) {
                return item;
            }
            return null;
        };
        InMemoryLocalStorage.prototype.removeItem = function (key) {
            delete this.store[key];
        };
        return InMemoryLocalStorage;
    }());
    exports.InMemoryLocalStorage = InMemoryLocalStorage;
    exports.inMemoryLocalStorageInstance = new InMemoryLocalStorage();
});
//# sourceMappingURL=storageService.js.map