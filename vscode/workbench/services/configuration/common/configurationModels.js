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
define(["require", "exports", "vs/base/common/objects", "vs/platform/configuration/common/model", "vs/platform/configuration/common/configuration", "vs/platform/registry/common/platform", "vs/platform/configuration/common/configurationRegistry", "vs/workbench/services/configuration/common/configuration"], function (require, exports, objects_1, model_1, configuration_1, platform_1, configurationRegistry_1, configuration_2) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var WorkspaceConfigurationModel = (function (_super) {
        __extends(WorkspaceConfigurationModel, _super);
        function WorkspaceConfigurationModel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        WorkspaceConfigurationModel.prototype.update = function (content) {
            _super.prototype.update.call(this, content);
            this._worksapaceSettings = new configuration_1.ConfigurationModel(this._worksapaceSettings.contents, this._worksapaceSettings.keys, this.overrides);
            this._workspaceConfiguration = this.consolidate();
        };
        Object.defineProperty(WorkspaceConfigurationModel.prototype, "folders", {
            get: function () {
                return this._folders;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(WorkspaceConfigurationModel.prototype, "workspaceConfiguration", {
            get: function () {
                return this._workspaceConfiguration;
            },
            enumerable: true,
            configurable: true
        });
        WorkspaceConfigurationModel.prototype.processRaw = function (raw) {
            this._raw = raw;
            this._folders = (this._raw['folders'] || []).map(function (folder) { return folder.path; });
            this._worksapaceSettings = this.parseConfigurationModel('settings');
            this._tasksConfiguration = this.parseConfigurationModel('tasks');
            this._launchConfiguration = this.parseConfigurationModel('launch');
            _super.prototype.processRaw.call(this, raw);
        };
        WorkspaceConfigurationModel.prototype.parseConfigurationModel = function (section) {
            var rawSection = this._raw[section] || {};
            var contents = model_1.toValuesTree(rawSection, function (message) { return console.error("Conflict in section '" + section + "' of workspace configuration file " + message); });
            return new configuration_1.ConfigurationModel(contents, Object.keys(rawSection));
        };
        WorkspaceConfigurationModel.prototype.consolidate = function () {
            var keys = this._worksapaceSettings.keys.concat(this._tasksConfiguration.keys.map(function (key) { return "tasks." + key; }), this._launchConfiguration.keys.map(function (key) { return "launch." + key; }));
            var mergedContents = new configuration_1.ConfigurationModel({}, keys)
                .merge(this._worksapaceSettings)
                .merge(this._tasksConfiguration)
                .merge(this._launchConfiguration);
            return new configuration_1.ConfigurationModel(mergedContents.contents, keys, mergedContents.overrides);
        };
        return WorkspaceConfigurationModel;
    }(model_1.CustomConfigurationModel));
    exports.WorkspaceConfigurationModel = WorkspaceConfigurationModel;
    var ScopedConfigurationModel = (function (_super) {
        __extends(ScopedConfigurationModel, _super);
        function ScopedConfigurationModel(content, name, scope) {
            var _this = _super.call(this, null, name) || this;
            _this.scope = scope;
            _this.update(content);
            return _this;
        }
        ScopedConfigurationModel.prototype.update = function (content) {
            _super.prototype.update.call(this, content);
            var contents = Object.create(null);
            contents[this.scope] = this.contents;
            this._contents = contents;
        };
        return ScopedConfigurationModel;
    }(model_1.CustomConfigurationModel));
    exports.ScopedConfigurationModel = ScopedConfigurationModel;
    var FolderSettingsModel = (function (_super) {
        __extends(FolderSettingsModel, _super);
        function FolderSettingsModel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        FolderSettingsModel.prototype.processRaw = function (raw) {
            this._raw = raw;
            var processedRaw = {};
            this._unsupportedKeys = [];
            var configurationProperties = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).getConfigurationProperties();
            for (var key in raw) {
                if (this.isNotExecutable(key, configurationProperties)) {
                    processedRaw[key] = raw[key];
                }
                else {
                    this._unsupportedKeys.push(key);
                }
            }
            return _super.prototype.processRaw.call(this, processedRaw);
        };
        FolderSettingsModel.prototype.reprocess = function () {
            this.processRaw(this._raw);
        };
        Object.defineProperty(FolderSettingsModel.prototype, "unsupportedKeys", {
            get: function () {
                return this._unsupportedKeys || [];
            },
            enumerable: true,
            configurable: true
        });
        FolderSettingsModel.prototype.isNotExecutable = function (key, configurationProperties) {
            var propertySchema = configurationProperties[key];
            if (!propertySchema) {
                return true; // Unknown propertis are ignored from checks
            }
            return !propertySchema.isExecutable;
        };
        FolderSettingsModel.prototype.createWorkspaceConfigurationModel = function () {
            return this.createScopedConfigurationModel(configurationRegistry_1.ConfigurationScope.WINDOW);
        };
        FolderSettingsModel.prototype.createFolderScopedConfigurationModel = function () {
            return this.createScopedConfigurationModel(configurationRegistry_1.ConfigurationScope.RESOURCE);
        };
        FolderSettingsModel.prototype.createScopedConfigurationModel = function (scope) {
            var workspaceRaw = {};
            var configurationProperties = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).getConfigurationProperties();
            for (var key in this._raw) {
                if (this.getScope(key, configurationProperties) === scope) {
                    workspaceRaw[key] = this._raw[key];
                }
            }
            var workspaceContents = model_1.toValuesTree(workspaceRaw, function (message) { return console.error("Conflict in workspace settings file: " + message); });
            var workspaceKeys = Object.keys(workspaceRaw);
            return new configuration_1.ConfigurationModel(workspaceContents, workspaceKeys, objects_1.clone(this._overrides));
        };
        FolderSettingsModel.prototype.getScope = function (key, configurationProperties) {
            var propertySchema = configurationProperties[key];
            return propertySchema ? propertySchema.scope : configurationRegistry_1.ConfigurationScope.WINDOW;
        };
        return FolderSettingsModel;
    }(model_1.CustomConfigurationModel));
    exports.FolderSettingsModel = FolderSettingsModel;
    var FolderConfigurationModel = (function (_super) {
        __extends(FolderConfigurationModel, _super);
        function FolderConfigurationModel(workspaceSettingsConfig, scopedConfigs, scope) {
            var _this = _super.call(this) || this;
            _this.workspaceSettingsConfig = workspaceSettingsConfig;
            _this.scopedConfigs = scopedConfigs;
            _this.scope = scope;
            _this.consolidate();
            return _this;
        }
        FolderConfigurationModel.prototype.consolidate = function () {
            this._contents = {};
            this._overrides = [];
            this.doMerge(this, configurationRegistry_1.ConfigurationScope.WINDOW === this.scope ? this.workspaceSettingsConfig : this.workspaceSettingsConfig.createFolderScopedConfigurationModel());
            for (var _i = 0, _a = this.scopedConfigs; _i < _a.length; _i++) {
                var configModel = _a[_i];
                this.doMerge(this, configModel);
            }
        };
        Object.defineProperty(FolderConfigurationModel.prototype, "keys", {
            get: function () {
                var keys = this.workspaceSettingsConfig.keys.slice();
                this.scopedConfigs.forEach(function (scopedConfigModel) {
                    Object.keys(configuration_2.WORKSPACE_STANDALONE_CONFIGURATIONS).forEach(function (scope) {
                        if (scopedConfigModel.scope === scope) {
                            keys.push.apply(keys, scopedConfigModel.keys.map(function (key) { return scope + "." + key; }));
                        }
                    });
                });
                return keys;
            },
            enumerable: true,
            configurable: true
        });
        FolderConfigurationModel.prototype.update = function () {
            this.workspaceSettingsConfig.reprocess();
            this.consolidate();
        };
        return FolderConfigurationModel;
    }(model_1.CustomConfigurationModel));
    exports.FolderConfigurationModel = FolderConfigurationModel;
});
//# sourceMappingURL=configurationModels.js.map