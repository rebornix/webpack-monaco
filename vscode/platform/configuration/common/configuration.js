/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/base/common/arrays", "vs/base/common/types", "vs/base/common/objects", "vs/base/common/uri", "vs/base/common/map", "vs/platform/instantiation/common/instantiation"], function (require, exports, arrays, types, objects, uri_1, map_1, instantiation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IConfigurationService = instantiation_1.createDecorator('configurationService');
    var ConfigurationSource;
    (function (ConfigurationSource) {
        ConfigurationSource[ConfigurationSource["Default"] = 1] = "Default";
        ConfigurationSource[ConfigurationSource["User"] = 2] = "User";
        ConfigurationSource[ConfigurationSource["Workspace"] = 3] = "Workspace";
    })(ConfigurationSource = exports.ConfigurationSource || (exports.ConfigurationSource = {}));
    /**
     * A helper function to get the configuration value with a specific settings path (e.g. config.some.setting)
     */
    function getConfigurationValue(config, settingPath, defaultValue) {
        function accessSetting(config, path) {
            var current = config;
            for (var i = 0; i < path.length; i++) {
                if (typeof current !== 'object' || current === null) {
                    return undefined;
                }
                current = current[path[i]];
            }
            return current;
        }
        var path = settingPath.split('.');
        var result = accessSetting(config, path);
        return typeof result === 'undefined' ? defaultValue : result;
    }
    exports.getConfigurationValue = getConfigurationValue;
    function merge(base, add, overwrite) {
        Object.keys(add).forEach(function (key) {
            if (key in base) {
                if (types.isObject(base[key]) && types.isObject(add[key])) {
                    merge(base[key], add[key], overwrite);
                }
                else if (overwrite) {
                    base[key] = add[key];
                }
            }
            else {
                base[key] = add[key];
            }
        });
    }
    exports.merge = merge;
    var ConfigurationModel = (function () {
        function ConfigurationModel(_contents, _keys, _overrides) {
            if (_contents === void 0) { _contents = {}; }
            if (_keys === void 0) { _keys = []; }
            if (_overrides === void 0) { _overrides = []; }
            this._contents = _contents;
            this._keys = _keys;
            this._overrides = _overrides;
        }
        Object.defineProperty(ConfigurationModel.prototype, "contents", {
            get: function () {
                return this._contents;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConfigurationModel.prototype, "overrides", {
            get: function () {
                return this._overrides;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConfigurationModel.prototype, "keys", {
            get: function () {
                return this._keys;
            },
            enumerable: true,
            configurable: true
        });
        ConfigurationModel.prototype.getContentsFor = function (section) {
            return objects.clone(this.contents[section]);
        };
        ConfigurationModel.prototype.override = function (identifier) {
            var result = new ConfigurationModel();
            var contents = objects.clone(this.contents);
            if (this._overrides) {
                for (var _i = 0, _a = this._overrides; _i < _a.length; _i++) {
                    var override = _a[_i];
                    if (override.identifiers.indexOf(identifier) !== -1) {
                        merge(contents, override.contents, true);
                    }
                }
            }
            result._contents = contents;
            return result;
        };
        ConfigurationModel.prototype.merge = function (other, overwrite) {
            if (overwrite === void 0) { overwrite = true; }
            var mergedModel = new ConfigurationModel();
            this.doMerge(mergedModel, this, overwrite);
            this.doMerge(mergedModel, other, overwrite);
            return mergedModel;
        };
        ConfigurationModel.prototype.doMerge = function (source, target, overwrite) {
            if (overwrite === void 0) { overwrite = true; }
            merge(source.contents, objects.clone(target.contents), overwrite);
            var overrides = objects.clone(source._overrides);
            var _loop_1 = function (override) {
                var sourceOverride = overrides.filter(function (o) { return arrays.equals(o.identifiers, override.identifiers); })[0];
                if (sourceOverride) {
                    merge(sourceOverride.contents, override.contents, overwrite);
                }
                else {
                    overrides.push(override);
                }
            };
            for (var _i = 0, _a = target._overrides; _i < _a.length; _i++) {
                var override = _a[_i];
                _loop_1(override);
            }
            source._overrides = overrides;
        };
        return ConfigurationModel;
    }());
    exports.ConfigurationModel = ConfigurationModel;
    var Configuration = (function () {
        function Configuration(_defaults, _user, _workspaceConfiguration, folders, _workspace) {
            if (_workspaceConfiguration === void 0) { _workspaceConfiguration = new ConfigurationModel(); }
            if (folders === void 0) { folders = new map_1.StrictResourceMap(); }
            this._defaults = _defaults;
            this._user = _user;
            this._workspaceConfiguration = _workspaceConfiguration;
            this.folders = folders;
            this._workspace = _workspace;
            this.merge();
        }
        Object.defineProperty(Configuration.prototype, "defaults", {
            get: function () {
                return this._defaults;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Configuration.prototype, "user", {
            get: function () {
                return this._user;
            },
            enumerable: true,
            configurable: true
        });
        Configuration.prototype.merge = function () {
            this._globalConfiguration = new ConfigurationModel().merge(this._defaults).merge(this._user);
            this._workspaceConsolidatedConfiguration = new ConfigurationModel().merge(this._globalConfiguration).merge(this._workspaceConfiguration);
            this._legacyWorkspaceConsolidatedConfiguration = null;
            this._foldersConsolidatedConfigurations = new map_1.StrictResourceMap();
            for (var _i = 0, _a = this.folders.keys(); _i < _a.length; _i++) {
                var folder = _a[_i];
                this.mergeFolder(folder);
            }
        };
        Configuration.prototype.mergeFolder = function (folder) {
            this._foldersConsolidatedConfigurations.set(folder, new ConfigurationModel().merge(this._workspaceConsolidatedConfiguration).merge(this.folders.get(folder)));
        };
        Configuration.prototype.getValue = function (section, overrides) {
            if (section === void 0) { section = ''; }
            if (overrides === void 0) { overrides = {}; }
            var configModel = this.getConsolidateConfigurationModel(overrides);
            return section ? configModel.getContentsFor(section) : configModel.contents;
        };
        Configuration.prototype.lookup = function (key, overrides) {
            if (overrides === void 0) { overrides = {}; }
            // make sure to clone the configuration so that the receiver does not tamper with the values
            var consolidateConfigurationModel = this.getConsolidateConfigurationModel(overrides);
            var folderConfigurationModel = this.getFolderConfigurationModelForResource(overrides.resource);
            return {
                default: objects.clone(getConfigurationValue(overrides.overrideIdentifier ? this._defaults.override(overrides.overrideIdentifier).contents : this._defaults.contents, key)),
                user: objects.clone(getConfigurationValue(overrides.overrideIdentifier ? this._user.override(overrides.overrideIdentifier).contents : this._user.contents, key)),
                workspace: objects.clone(this._workspace ? getConfigurationValue(overrides.overrideIdentifier ? this._workspaceConfiguration.override(overrides.overrideIdentifier).contents : this._workspaceConfiguration.contents, key) : void 0),
                folder: objects.clone(folderConfigurationModel ? getConfigurationValue(overrides.overrideIdentifier ? folderConfigurationModel.override(overrides.overrideIdentifier).contents : folderConfigurationModel.contents, key) : void 0),
                value: objects.clone(getConfigurationValue(consolidateConfigurationModel.contents, key))
            };
        };
        Configuration.prototype.lookupLegacy = function (key) {
            if (!this._legacyWorkspaceConsolidatedConfiguration) {
                this._legacyWorkspaceConsolidatedConfiguration = this._workspace ? new ConfigurationModel().merge(this._workspaceConfiguration).merge(this.folders.get(this._workspace.roots[0])) : null;
            }
            var consolidateConfigurationModel = this.getConsolidateConfigurationModel({});
            return {
                default: objects.clone(getConfigurationValue(this._defaults.contents, key)),
                user: objects.clone(getConfigurationValue(this._user.contents, key)),
                workspace: objects.clone(this._legacyWorkspaceConsolidatedConfiguration ? getConfigurationValue(this._legacyWorkspaceConsolidatedConfiguration.contents, key) : void 0),
                folder: void 0,
                value: objects.clone(getConfigurationValue(consolidateConfigurationModel.contents, key))
            };
        };
        Configuration.prototype.keys = function (overrides) {
            if (overrides === void 0) { overrides = {}; }
            var folderConfigurationModel = this.getFolderConfigurationModelForResource(overrides.resource);
            return {
                default: this._defaults.keys,
                user: this._user.keys,
                workspace: this._workspaceConfiguration.keys,
                folder: folderConfigurationModel ? folderConfigurationModel.keys : []
            };
        };
        Configuration.prototype.values = function () {
            var result = Object.create(null);
            var keyset = this.keys();
            var keys = keyset.workspace.concat(keyset.user, keyset.default).sort();
            var lastKey;
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var key = keys_1[_i];
                if (key !== lastKey) {
                    lastKey = key;
                    result[key] = this.lookup(key);
                }
            }
            return result;
        };
        Configuration.prototype.values2 = function () {
            var result = new Map();
            var keyset = this.keys();
            var keys = keyset.workspace.concat(keyset.user, keyset.default).sort();
            var lastKey;
            for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
                var key = keys_2[_i];
                if (key !== lastKey) {
                    lastKey = key;
                    result.set(key, this.lookup(key));
                }
            }
            return result;
        };
        Configuration.prototype.getConsolidateConfigurationModel = function (overrides) {
            var configurationModel = this.getConsolidatedConfigurationModelForResource(overrides);
            return overrides.overrideIdentifier ? configurationModel.override(overrides.overrideIdentifier) : configurationModel;
        };
        Configuration.prototype.getConsolidatedConfigurationModelForResource = function (_a) {
            var resource = _a.resource;
            if (!this._workspace) {
                return this._globalConfiguration;
            }
            if (!resource) {
                return this._workspaceConsolidatedConfiguration;
            }
            var root = this._workspace.getRoot(resource);
            if (!root) {
                return this._workspaceConsolidatedConfiguration;
            }
            return this._foldersConsolidatedConfigurations.get(root) || this._workspaceConsolidatedConfiguration;
        };
        Configuration.prototype.getFolderConfigurationModelForResource = function (resource) {
            if (!this._workspace || !resource) {
                return null;
            }
            var root = this._workspace.getRoot(resource);
            return root ? this.folders.get(root) : null;
        };
        Configuration.prototype.toData = function () {
            var _this = this;
            return {
                defaults: {
                    contents: this._defaults.contents,
                    overrides: this._defaults.overrides,
                    keys: this._defaults.keys
                },
                user: {
                    contents: this._user.contents,
                    overrides: this._user.overrides,
                    keys: this._user.keys
                },
                workspace: {
                    contents: this._workspaceConfiguration.contents,
                    overrides: this._workspaceConfiguration.overrides,
                    keys: this._workspaceConfiguration.keys
                },
                folders: this.folders.keys().reduce(function (result, folder) {
                    var _a = _this.folders.get(folder), contents = _a.contents, overrides = _a.overrides, keys = _a.keys;
                    result[folder.toString()] = { contents: contents, overrides: overrides, keys: keys };
                    return result;
                }, Object.create({}))
            };
        };
        Configuration.parse = function (data, workspace) {
            var defaultConfiguration = Configuration.parseConfigurationModel(data.defaults);
            var userConfiguration = Configuration.parseConfigurationModel(data.user);
            var workspaceConfiguration = Configuration.parseConfigurationModel(data.workspace);
            var folders = Object.keys(data.folders).reduce(function (result, key) {
                result.set(uri_1.default.parse(key), Configuration.parseConfigurationModel(data.folders[key]));
                return result;
            }, new map_1.StrictResourceMap());
            return new Configuration(defaultConfiguration, userConfiguration, workspaceConfiguration, folders, workspace);
        };
        Configuration.parseConfigurationModel = function (model) {
            return new ConfigurationModel(model.contents, model.keys, model.overrides);
        };
        return Configuration;
    }());
    exports.Configuration = Configuration;
});
//# sourceMappingURL=configuration.js.map