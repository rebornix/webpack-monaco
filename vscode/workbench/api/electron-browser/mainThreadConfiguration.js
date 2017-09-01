var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/platform/registry/common/platform", "vs/platform/configuration/common/configurationRegistry", "vs/platform/workspace/common/workspace", "vs/workbench/services/configuration/common/configuration", "vs/workbench/services/configuration/common/configurationEditing", "../node/extHost.protocol", "vs/workbench/api/electron-browser/extHostCustomers"], function (require, exports, platform_1, configurationRegistry_1, workspace_1, configuration_1, configurationEditing_1, extHost_protocol_1, extHostCustomers_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var MainThreadConfiguration = (function () {
        function MainThreadConfiguration(extHostContext, _configurationEditingService, _workspaceContextService, configurationService) {
            this._configurationEditingService = _configurationEditingService;
            this._workspaceContextService = _workspaceContextService;
            var proxy = extHostContext.get(extHost_protocol_1.ExtHostContext.ExtHostConfiguration);
            this._configurationListener = configurationService.onDidUpdateConfiguration(function () {
                proxy.$acceptConfigurationChanged(configurationService.getConfigurationData());
            });
        }
        MainThreadConfiguration.prototype.dispose = function () {
            this._configurationListener.dispose();
        };
        MainThreadConfiguration.prototype.$updateConfigurationOption = function (target, key, value, resource) {
            return this.writeConfiguration(target, key, value, resource);
        };
        MainThreadConfiguration.prototype.$removeConfigurationOption = function (target, key, resource) {
            return this.writeConfiguration(target, key, undefined, resource);
        };
        MainThreadConfiguration.prototype.writeConfiguration = function (target, key, value, resource) {
            return this._configurationEditingService.writeConfiguration(target ? target : this.deriveConfigurationTarget(key, resource), { key: key, value: value }, { donotNotifyError: true, scopes: { resource: resource } });
        };
        MainThreadConfiguration.prototype.deriveConfigurationTarget = function (key, resource) {
            if (resource && this._workspaceContextService.hasMultiFolderWorkspace()) {
                var configurationProperties = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).getConfigurationProperties();
                if (configurationProperties[key] && configurationProperties[key].scope === configurationRegistry_1.ConfigurationScope.RESOURCE) {
                    return configurationEditing_1.ConfigurationTarget.FOLDER;
                }
            }
            return configurationEditing_1.ConfigurationTarget.WORKSPACE;
        };
        MainThreadConfiguration = __decorate([
            extHostCustomers_1.extHostNamedCustomer(extHost_protocol_1.MainContext.MainThreadConfiguration),
            __param(1, configurationEditing_1.IConfigurationEditingService),
            __param(2, workspace_1.IWorkspaceContextService),
            __param(3, configuration_1.IWorkspaceConfigurationService)
        ], MainThreadConfiguration);
        return MainThreadConfiguration;
    }());
    exports.MainThreadConfiguration = MainThreadConfiguration;
});
//# sourceMappingURL=mainThreadConfiguration.js.map