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
define(["require", "exports", "vs/platform/registry/common/platform", "vs/base/common/json", "vs/platform/configuration/common/configurationRegistry", "vs/platform/configuration/common/configuration"], function (require, exports, platform_1, json, configurationRegistry_1, configuration_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    function getDefaultValues() {
        var valueTreeRoot = Object.create(null);
        var properties = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).getConfigurationProperties();
        for (var key in properties) {
            var value = properties[key].default;
            addToValueTree(valueTreeRoot, key, value, function (message) { return console.error("Conflict in default settings: " + message); });
        }
        return valueTreeRoot;
    }
    exports.getDefaultValues = getDefaultValues;
    function toValuesTree(properties, conflictReporter) {
        var root = Object.create(null);
        for (var key in properties) {
            addToValueTree(root, key, properties[key], conflictReporter);
        }
        return root;
    }
    exports.toValuesTree = toValuesTree;
    function addToValueTree(settingsTreeRoot, key, value, conflictReporter) {
        var segments = key.split('.');
        var last = segments.pop();
        var curr = settingsTreeRoot;
        for (var i = 0; i < segments.length; i++) {
            var s = segments[i];
            var obj = curr[s];
            switch (typeof obj) {
                case 'undefined':
                    obj = curr[s] = Object.create(null);
                    break;
                case 'object':
                    break;
                default:
                    conflictReporter("Ignoring " + key + " as " + segments.slice(0, i + 1).join('.') + " is " + JSON.stringify(obj));
                    return;
            }
            curr = obj;
        }
        ;
        if (typeof curr === 'object') {
            curr[last] = value; // workaround https://github.com/Microsoft/vscode/issues/13606
        }
        else {
            conflictReporter("Ignoring " + key + " as " + segments.join('.') + " is " + JSON.stringify(curr));
        }
    }
    function getConfigurationKeys() {
        var properties = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).getConfigurationProperties();
        return Object.keys(properties);
    }
    exports.getConfigurationKeys = getConfigurationKeys;
    var DefaultConfigurationModel = (function (_super) {
        __extends(DefaultConfigurationModel, _super);
        function DefaultConfigurationModel() {
            var _this = _super.call(this, getDefaultValues()) || this;
            _this._keys = getConfigurationKeys();
            _this._overrides = Object.keys(_this._contents)
                .filter(function (key) { return configurationRegistry_1.OVERRIDE_PROPERTY_PATTERN.test(key); })
                .map(function (key) {
                return {
                    identifiers: [overrideIdentifierFromKey(key).trim()],
                    contents: toValuesTree(_this._contents[key], function (message) { return console.error("Conflict in default settings file: " + message); })
                };
            });
            return _this;
        }
        Object.defineProperty(DefaultConfigurationModel.prototype, "keys", {
            get: function () {
                return this._keys;
            },
            enumerable: true,
            configurable: true
        });
        return DefaultConfigurationModel;
    }(configuration_1.ConfigurationModel));
    exports.DefaultConfigurationModel = DefaultConfigurationModel;
    var CustomConfigurationModel = (function (_super) {
        __extends(CustomConfigurationModel, _super);
        function CustomConfigurationModel(content, name) {
            if (content === void 0) { content = ''; }
            if (name === void 0) { name = ''; }
            var _this = _super.call(this) || this;
            _this.name = name;
            _this._parseErrors = [];
            if (content) {
                _this.update(content);
            }
            return _this;
        }
        Object.defineProperty(CustomConfigurationModel.prototype, "errors", {
            get: function () {
                return this._parseErrors;
            },
            enumerable: true,
            configurable: true
        });
        CustomConfigurationModel.prototype.update = function (content) {
            var _this = this;
            var parsed = {};
            var overrides = [];
            var currentProperty = null;
            var currentParent = [];
            var previousParents = [];
            var parseErrors = [];
            function onValue(value) {
                if (Array.isArray(currentParent)) {
                    currentParent.push(value);
                }
                else if (currentProperty) {
                    currentParent[currentProperty] = value;
                }
                if (configurationRegistry_1.OVERRIDE_PROPERTY_PATTERN.test(currentProperty)) {
                    onOverrideSettingsValue(currentProperty, value);
                }
            }
            function onOverrideSettingsValue(property, value) {
                overrides.push({
                    identifiers: [overrideIdentifierFromKey(property).trim()],
                    raw: value,
                    contents: null
                });
            }
            var visitor = {
                onObjectBegin: function () {
                    var object = {};
                    onValue(object);
                    previousParents.push(currentParent);
                    currentParent = object;
                    currentProperty = null;
                },
                onObjectProperty: function (name) {
                    currentProperty = name;
                },
                onObjectEnd: function () {
                    currentParent = previousParents.pop();
                },
                onArrayBegin: function () {
                    var array = [];
                    onValue(array);
                    previousParents.push(currentParent);
                    currentParent = array;
                    currentProperty = null;
                },
                onArrayEnd: function () {
                    currentParent = previousParents.pop();
                },
                onLiteralValue: onValue,
                onError: function (error) {
                    parseErrors.push({ error: error });
                }
            };
            if (content) {
                try {
                    json.visit(content, visitor);
                    parsed = currentParent[0] || {};
                }
                catch (e) {
                    console.error("Error while parsing settings file " + this.name + ": " + e);
                    this._parseErrors = [e];
                }
            }
            this.processRaw(parsed);
            var configurationProperties = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).getConfigurationProperties();
            this._overrides = overrides.map(function (override) {
                // Filter unknown and non-overridable properties
                var raw = {};
                for (var key in override.raw) {
                    if (configurationProperties[key] && configurationProperties[key].overridable) {
                        raw[key] = override.raw[key];
                    }
                }
                return {
                    identifiers: override.identifiers,
                    contents: toValuesTree(raw, function (message) { return console.error("Conflict in settings file " + _this.name + ": " + message); })
                };
            });
        };
        CustomConfigurationModel.prototype.processRaw = function (raw) {
            var _this = this;
            this._contents = toValuesTree(raw, function (message) { return console.error("Conflict in settings file " + _this.name + ": " + message); });
            this._keys = Object.keys(raw);
        };
        return CustomConfigurationModel;
    }(configuration_1.ConfigurationModel));
    exports.CustomConfigurationModel = CustomConfigurationModel;
    function overrideIdentifierFromKey(key) {
        return key.substring(1, key.length - 1);
    }
    exports.overrideIdentifierFromKey = overrideIdentifierFromKey;
    function keyFromOverrideIdentifier(overrideIdentifier) {
        return "[" + overrideIdentifier + "]";
    }
    exports.keyFromOverrideIdentifier = keyFromOverrideIdentifier;
});
//# sourceMappingURL=model.js.map