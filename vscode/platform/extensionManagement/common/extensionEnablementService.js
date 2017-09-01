/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/nls", "vs/base/common/winjs.base", "vs/base/common/arrays", "vs/base/common/event", "vs/base/common/lifecycle", "vs/platform/extensionManagement/common/extensionManagement", "vs/platform/extensionManagement/common/extensionManagementUtil", "vs/platform/workspace/common/workspace", "vs/platform/storage/common/storage", "vs/platform/environment/common/environment"], function (require, exports, nls_1, winjs_base_1, arrays_1, event_1, lifecycle_1, extensionManagement_1, extensionManagementUtil_1, workspace_1, storage_1, environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DISABLED_EXTENSIONS_STORAGE_PATH = 'extensions/disabled';
    var ExtensionEnablementService = (function () {
        function ExtensionEnablementService(storageService, contextService, environmentService, extensionManagementService) {
            this.storageService = storageService;
            this.contextService = contextService;
            this.environmentService = environmentService;
            this.extensionManagementService = extensionManagementService;
            this.disposables = [];
            this._onEnablementChanged = new event_1.Emitter();
            this.onEnablementChanged = this._onEnablementChanged.event;
            extensionManagementService.onDidUninstallExtension(this.onDidUninstallExtension, this, this.disposables);
        }
        Object.defineProperty(ExtensionEnablementService.prototype, "hasWorkspace", {
            get: function () {
                return this.contextService.hasWorkspace();
            },
            enumerable: true,
            configurable: true
        });
        ExtensionEnablementService.prototype.getGloballyDisabledExtensions = function () {
            return this.getDisabledExtensions(storage_1.StorageScope.GLOBAL);
        };
        ExtensionEnablementService.prototype.getWorkspaceDisabledExtensions = function () {
            return this.getDisabledExtensions(storage_1.StorageScope.WORKSPACE);
        };
        ExtensionEnablementService.prototype.canEnable = function (identifier) {
            if (this.environmentService.disableExtensions) {
                return false;
            }
            if (this.getGloballyDisabledExtensions().indexOf(identifier) !== -1) {
                return true;
            }
            if (this.getWorkspaceDisabledExtensions().indexOf(identifier) !== -1) {
                return true;
            }
            return false;
        };
        ExtensionEnablementService.prototype.setEnablement = function (identifier, enable, workspace) {
            if (workspace === void 0) { workspace = false; }
            if (workspace && !this.hasWorkspace) {
                return winjs_base_1.TPromise.wrapError(new Error(nls_1.localize('noWorkspace', "No workspace.")));
            }
            if (this.environmentService.disableExtensions) {
                return winjs_base_1.TPromise.wrap(false);
            }
            if (enable) {
                if (workspace) {
                    return this.enableExtension(identifier, storage_1.StorageScope.WORKSPACE);
                }
                else {
                    return this.enableExtension(identifier, storage_1.StorageScope.GLOBAL);
                }
            }
            else {
                if (workspace) {
                    return this.disableExtension(identifier, storage_1.StorageScope.WORKSPACE);
                }
                else {
                    return this.disableExtension(identifier, storage_1.StorageScope.GLOBAL);
                }
            }
        };
        ExtensionEnablementService.prototype.disableExtension = function (identifier, scope) {
            var disabledExtensions = this.getDisabledExtensions(scope);
            var index = disabledExtensions.indexOf(identifier);
            if (index === -1) {
                disabledExtensions.push(identifier);
                this.setDisabledExtensions(disabledExtensions, scope, identifier);
                return winjs_base_1.TPromise.wrap(true);
            }
            return winjs_base_1.TPromise.wrap(false);
        };
        ExtensionEnablementService.prototype.enableExtension = function (identifier, scope, fireEvent) {
            if (fireEvent === void 0) { fireEvent = true; }
            var disabledExtensions = this.getDisabledExtensions(scope);
            var index = disabledExtensions.indexOf(identifier);
            if (index !== -1) {
                disabledExtensions.splice(index, 1);
                this.setDisabledExtensions(disabledExtensions, scope, identifier, fireEvent);
                return winjs_base_1.TPromise.wrap(true);
            }
            return winjs_base_1.TPromise.wrap(false);
        };
        ExtensionEnablementService.prototype.getDisabledExtensions = function (scope) {
            if (scope === storage_1.StorageScope.WORKSPACE && !this.hasWorkspace) {
                return [];
            }
            var value = this.storageService.get(DISABLED_EXTENSIONS_STORAGE_PATH, scope, '');
            return value ? arrays_1.distinct(value.split(',')).map(function (id) { return extensionManagementUtil_1.adoptToGalleryExtensionId(id); }) : [];
        };
        ExtensionEnablementService.prototype.setDisabledExtensions = function (disabledExtensions, scope, extension, fireEvent) {
            if (fireEvent === void 0) { fireEvent = true; }
            if (disabledExtensions.length) {
                this.storageService.store(DISABLED_EXTENSIONS_STORAGE_PATH, disabledExtensions.join(','), scope);
            }
            else {
                this.storageService.remove(DISABLED_EXTENSIONS_STORAGE_PATH, scope);
            }
            if (fireEvent) {
                this._onEnablementChanged.fire(extension);
            }
        };
        ExtensionEnablementService.prototype.onDidUninstallExtension = function (_a) {
            var id = _a.id, error = _a.error;
            if (!error) {
                id = extensionManagementUtil_1.getIdAndVersionFromLocalExtensionId(id).id;
                if (id) {
                    this.enableExtension(id, storage_1.StorageScope.WORKSPACE, false);
                    this.enableExtension(id, storage_1.StorageScope.GLOBAL, false);
                }
            }
        };
        ExtensionEnablementService.prototype.dispose = function () {
            this.disposables = lifecycle_1.dispose(this.disposables);
        };
        ExtensionEnablementService = __decorate([
            __param(0, storage_1.IStorageService),
            __param(1, workspace_1.IWorkspaceContextService),
            __param(2, environment_1.IEnvironmentService),
            __param(3, extensionManagement_1.IExtensionManagementService)
        ], ExtensionEnablementService);
        return ExtensionEnablementService;
    }());
    exports.ExtensionEnablementService = ExtensionEnablementService;
});
//# sourceMappingURL=extensionEnablementService.js.map