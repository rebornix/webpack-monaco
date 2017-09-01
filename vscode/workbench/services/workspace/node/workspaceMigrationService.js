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
define(["require", "exports", "vs/base/common/winjs.base", "vs/base/common/uri", "vs/base/common/event", "vs/platform/workspace/common/workspace", "vs/platform/registry/common/platform", "vs/platform/configuration/common/configurationRegistry", "vs/platform/configuration/common/configuration", "vs/platform/lifecycle/common/lifecycle", "vs/platform/storage/common/migration", "vs/platform/storage/common/storage", "vs/workbench/services/configuration/common/jsonEditing"], function (require, exports, winjs_base_1, uri_1, event_1, workspace_1, platform_1, configurationRegistry_1, configuration_1, lifecycle_1, migration_1, storage_1, jsonEditing_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var WorkspaceMigrationService = (function () {
        function WorkspaceMigrationService(storageService, jsonEditingService, contextService, configurationService, lifecycleService) {
            this.storageService = storageService;
            this.jsonEditingService = jsonEditingService;
            this.contextService = contextService;
            this.configurationService = configurationService;
            this.lifecycleService = lifecycleService;
        }
        WorkspaceMigrationService.prototype.migrate = function (toWorkspaceId) {
            this.migrateStorage(toWorkspaceId);
            return this.migrateConfiguration(toWorkspaceId);
        };
        WorkspaceMigrationService.prototype.migrateStorage = function (toWorkspaceId) {
            var _this = this;
            // The shutdown sequence could have been stopped due to a veto. Make sure to
            // always dispose the shutdown listener if we are called again in the same session.
            if (this.shutdownListener) {
                this.shutdownListener.dispose();
                this.shutdownListener = void 0;
            }
            // Since many components write to storage only on shutdown, we register a shutdown listener
            // very late to be called as the last one.
            this.shutdownListener = event_1.once(this.lifecycleService.onShutdown)(function () {
                // TODO@Ben revisit this when we move away from local storage to a file based approach
                var storageImpl = _this.storageService;
                migration_1.migrateStorageToMultiRootWorkspace(storageImpl.storageId, toWorkspaceId, storageImpl.workspaceStorage);
            });
        };
        WorkspaceMigrationService.prototype.migrateConfiguration = function (toWorkspaceId) {
            if (!this.contextService.hasFolderWorkspace()) {
                return winjs_base_1.TPromise.as(void 0); // return early if not a folder workspace is opened
            }
            var configurationProperties = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).getConfigurationProperties();
            var targetWorkspaceConfiguration = {};
            for (var _i = 0, _a = this.configurationService.keys().workspace; _i < _a.length; _i++) {
                var key = _a[_i];
                if (configurationProperties[key] && configurationProperties[key].scope === configurationRegistry_1.ConfigurationScope.WINDOW) {
                    targetWorkspaceConfiguration[key] = this.configurationService.lookup(key).workspace;
                }
            }
            return this.jsonEditingService.write(uri_1.default.file(toWorkspaceId.configPath), { key: 'settings', value: targetWorkspaceConfiguration }, true);
        };
        WorkspaceMigrationService = __decorate([
            __param(0, storage_1.IStorageService),
            __param(1, jsonEditing_1.IJSONEditingService),
            __param(2, workspace_1.IWorkspaceContextService),
            __param(3, configuration_1.IConfigurationService),
            __param(4, lifecycle_1.ILifecycleService)
        ], WorkspaceMigrationService);
        return WorkspaceMigrationService;
    }());
    exports.WorkspaceMigrationService = WorkspaceMigrationService;
});
//# sourceMappingURL=workspaceMigrationService.js.map