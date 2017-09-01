define(["require", "exports", "vs/base/common/objects", "vs/base/common/event", "./extHostTypes", "vs/platform/configuration/common/configuration", "vs/workbench/services/configuration/common/configurationEditing"], function (require, exports, objects_1, event_1, extHostTypes_1, configuration_1, configurationEditing_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function lookUp(tree, key) {
        if (key) {
            var parts = key.split('.');
            var node = tree;
            for (var i = 0; node && i < parts.length; i++) {
                node = node[parts[i]];
            }
            return node;
        }
    }
    var ExtHostConfiguration = (function () {
        function ExtHostConfiguration(proxy, extHostWorkspace, data) {
            this._onDidChangeConfiguration = new event_1.Emitter();
            this._proxy = proxy;
            this._extHostWorkspace = extHostWorkspace;
            this._configuration = configuration_1.Configuration.parse(data, extHostWorkspace.workspace);
        }
        Object.defineProperty(ExtHostConfiguration.prototype, "onDidChangeConfiguration", {
            get: function () {
                return this._onDidChangeConfiguration && this._onDidChangeConfiguration.event;
            },
            enumerable: true,
            configurable: true
        });
        ExtHostConfiguration.prototype.$acceptConfigurationChanged = function (data) {
            this._configuration = configuration_1.Configuration.parse(data, this._extHostWorkspace.workspace);
            this._onDidChangeConfiguration.fire(undefined);
        };
        ExtHostConfiguration.prototype.getConfiguration = function (section, resource) {
            var _this = this;
            var config = section
                ? lookUp(this._configuration.getValue(null, { resource: resource }), section)
                : this._configuration.getValue(null, { resource: resource });
            function parseConfigurationTarget(arg) {
                if (arg === void 0 || arg === null) {
                    return null;
                }
                if (typeof arg === 'boolean') {
                    return arg ? configurationEditing_1.ConfigurationTarget.USER : configurationEditing_1.ConfigurationTarget.WORKSPACE;
                }
                switch (arg) {
                    case extHostTypes_1.ConfigurationTarget.Global: return configurationEditing_1.ConfigurationTarget.USER;
                    case extHostTypes_1.ConfigurationTarget.Workspace: return configurationEditing_1.ConfigurationTarget.WORKSPACE;
                    case extHostTypes_1.ConfigurationTarget.WorkspaceFolder: return configurationEditing_1.ConfigurationTarget.FOLDER;
                }
            }
            var result = {
                has: function (key) {
                    return typeof lookUp(config, key) !== 'undefined';
                },
                get: function (key, defaultValue) {
                    var result = lookUp(config, key);
                    if (typeof result === 'undefined') {
                        result = defaultValue;
                    }
                    return result;
                },
                update: function (key, value, arg) {
                    key = section ? section + "." + key : key;
                    var target = parseConfigurationTarget(arg);
                    if (value !== void 0) {
                        return _this._proxy.$updateConfigurationOption(target, key, value, resource);
                    }
                    else {
                        return _this._proxy.$removeConfigurationOption(target, key, resource);
                    }
                },
                inspect: function (key) {
                    key = section ? section + "." + key : key;
                    var config = _this._configuration.lookup(key, { resource: resource });
                    if (config) {
                        return {
                            key: key,
                            defaultValue: config.default,
                            globalValue: config.user,
                            workspaceValue: config.workspace,
                            workspaceFolderValue: config.folder
                        };
                    }
                    return undefined;
                }
            };
            if (typeof config === 'object') {
                objects_1.mixin(result, config, false);
            }
            return Object.freeze(result);
        };
        return ExtHostConfiguration;
    }());
    exports.ExtHostConfiguration = ExtHostConfiguration;
});
//# sourceMappingURL=extHostConfiguration.js.map