/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
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
define(["require", "exports", "vs/base/common/map", "vs/base/common/winjs.base", "vs/base/common/eventEmitter", "vs/platform/configuration/common/model", "vs/platform/configuration/common/configuration"], function (require, exports, map_1, winjs_base_1, eventEmitter_1, model_1, configuration_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var TestConfigurationService = (function (_super) {
        __extends(TestConfigurationService, _super);
        function TestConfigurationService() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.configuration = Object.create(null);
            _this.configurationByRoot = new map_1.TrieMap();
            return _this;
        }
        TestConfigurationService.prototype.reloadConfiguration = function (section) {
            return winjs_base_1.TPromise.as(this.getConfiguration());
        };
        TestConfigurationService.prototype.getConfiguration = function (section, overrides) {
            if (overrides && overrides.resource) {
                var configForResource = this.configurationByRoot.findSubstr(overrides.resource.fsPath);
                return configForResource || this.configuration;
            }
            return this.configuration;
        };
        TestConfigurationService.prototype.getConfigurationData = function () {
            return new configuration_1.Configuration(new configuration_1.ConfigurationModel(), new configuration_1.ConfigurationModel(this.configuration)).toData();
        };
        TestConfigurationService.prototype.setUserConfiguration = function (key, value, root) {
            if (root) {
                var configForRoot = this.configurationByRoot.lookUp(root.fsPath) || Object.create(null);
                configForRoot[key] = value;
                this.configurationByRoot.insert(root.fsPath, configForRoot);
            }
            else {
                this.configuration[key] = value;
            }
            return winjs_base_1.TPromise.as(null);
        };
        TestConfigurationService.prototype.onDidUpdateConfiguration = function () {
            return { dispose: function () { } };
        };
        TestConfigurationService.prototype.lookup = function (key, overrides) {
            var config = this.getConfiguration(undefined, overrides);
            return {
                value: configuration_1.getConfigurationValue(config, key),
                default: configuration_1.getConfigurationValue(config, key),
                user: configuration_1.getConfigurationValue(config, key),
                workspace: null,
                folder: null
            };
        };
        TestConfigurationService.prototype.keys = function () {
            return {
                default: model_1.getConfigurationKeys(),
                user: Object.keys(this.configuration),
                workspace: [],
                folder: []
            };
        };
        TestConfigurationService.prototype.values = function () {
            return {};
        };
        return TestConfigurationService;
    }(eventEmitter_1.EventEmitter));
    exports.TestConfigurationService = TestConfigurationService;
});
//# sourceMappingURL=testConfigurationService.js.map