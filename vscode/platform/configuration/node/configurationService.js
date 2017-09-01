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
define(["require", "exports", "vs/base/common/winjs.base", "vs/base/node/config", "vs/platform/registry/common/platform", "vs/platform/configuration/common/configurationRegistry", "vs/base/common/lifecycle", "vs/platform/configuration/common/configuration", "vs/platform/configuration/common/model", "vs/base/common/event", "vs/platform/environment/common/environment", "vs/base/common/errors"], function (require, exports, winjs_base_1, config_1, platform_1, configurationRegistry_1, lifecycle_1, configuration_1, model_1, event_1, environment_1, errors_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConfigurationService = (function (_super) {
        __extends(ConfigurationService, _super);
        function ConfigurationService(environmentService) {
            var _this = _super.call(this) || this;
            _this._onDidUpdateConfiguration = _this._register(new event_1.Emitter());
            _this.onDidUpdateConfiguration = _this._onDidUpdateConfiguration.event;
            _this.userConfigModelWatcher = new config_1.ConfigWatcher(environmentService.appSettingsPath, {
                changeBufferDelay: 300, onError: function (error) { return errors_1.onUnexpectedError(error); }, defaultConfig: new model_1.CustomConfigurationModel(null, environmentService.appSettingsPath), parse: function (content, parseErrors) {
                    var userConfigModel = new model_1.CustomConfigurationModel(content, environmentService.appSettingsPath);
                    parseErrors = userConfigModel.errors.slice();
                    return userConfigModel;
                }
            });
            _this._register(lifecycle_1.toDisposable(function () { return _this.userConfigModelWatcher.dispose(); }));
            // Listeners
            _this._register(_this.userConfigModelWatcher.onDidUpdateConfiguration(function () { return _this.onConfigurationChange(configuration_1.ConfigurationSource.User); }));
            _this._register(platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).onDidRegisterConfiguration(function () { return _this.onConfigurationChange(configuration_1.ConfigurationSource.Default); }));
            return _this;
        }
        ConfigurationService.prototype.configuration = function () {
            return this._configuration || (this._configuration = this.consolidateConfigurations());
        };
        ConfigurationService.prototype.onConfigurationChange = function (source) {
            this.reset(); // reset our caches
            var cache = this.configuration();
            this._onDidUpdateConfiguration.fire({
                source: source,
                sourceConfig: source === configuration_1.ConfigurationSource.Default ? cache.defaults.contents : cache.user.contents
            });
        };
        ConfigurationService.prototype.reloadConfiguration = function (section) {
            var _this = this;
            return new winjs_base_1.TPromise(function (c) {
                _this.userConfigModelWatcher.reload(function () {
                    _this.reset(); // reset our caches
                    c(_this.getConfiguration(section));
                });
            });
        };
        ConfigurationService.prototype.getConfiguration = function (section, options) {
            return this.configuration().getValue(section, options);
        };
        ConfigurationService.prototype.lookup = function (key, overrides) {
            return this.configuration().lookup(key, overrides);
        };
        ConfigurationService.prototype.keys = function (overrides) {
            return this.configuration().keys(overrides);
        };
        ConfigurationService.prototype.values = function () {
            return this._configuration.values();
        };
        ConfigurationService.prototype.getConfigurationData = function () {
            return this.configuration().toData();
        };
        ConfigurationService.prototype.reset = function () {
            this._configuration = this.consolidateConfigurations();
        };
        ConfigurationService.prototype.consolidateConfigurations = function () {
            var defaults = new model_1.DefaultConfigurationModel();
            var user = this.userConfigModelWatcher.getConfig();
            return new configuration_1.Configuration(defaults, user);
        };
        ConfigurationService = __decorate([
            __param(0, environment_1.IEnvironmentService)
        ], ConfigurationService);
        return ConfigurationService;
    }(lifecycle_1.Disposable));
    exports.ConfigurationService = ConfigurationService;
});
//# sourceMappingURL=configurationService.js.map