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
define(["require", "exports", "vs/base/common/paths", "vs/base/common/types", "vs/base/common/winjs.base", "vs/base/common/async", "vs/platform/environment/common/environment", "vs/platform/configuration/common/configuration", "vs/platform/commands/common/commands", "vs/workbench/services/editor/common/editorService", "vs/workbench/common/editor"], function (require, exports, paths, types, winjs_base_1, async_1, environment_1, configuration_1, commands_1, editorService_1, editor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConfigurationResolverService = (function () {
        function ConfigurationResolverService(envVariables, editorService, environmentService, configurationService, commandService) {
            var _this = this;
            this.editorService = editorService;
            this.configurationService = configurationService;
            this.commandService = commandService;
            this._execPath = environmentService.execPath;
            Object.keys(envVariables).forEach(function (key) {
                _this["env:" + key] = envVariables[key];
            });
        }
        Object.defineProperty(ConfigurationResolverService.prototype, "execPath", {
            get: function () {
                return this._execPath;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConfigurationResolverService.prototype, "cwd", {
            get: function () {
                return this.workspaceRoot;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConfigurationResolverService.prototype, "workspaceRoot", {
            get: function () {
                return this._workspaceRoot;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConfigurationResolverService.prototype, "workspaceRootFolderName", {
            get: function () {
                return this.workspaceRoot ? paths.basename(this.workspaceRoot) : '';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConfigurationResolverService.prototype, "file", {
            get: function () {
                return this.getFilePath();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConfigurationResolverService.prototype, "relativeFile", {
            get: function () {
                return (this.workspaceRoot) ? paths.relative(this.workspaceRoot, this.file) : this.file;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConfigurationResolverService.prototype, "fileBasename", {
            get: function () {
                return paths.basename(this.getFilePath());
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConfigurationResolverService.prototype, "fileBasenameNoExtension", {
            get: function () {
                var basename = this.fileBasename;
                return basename.slice(0, basename.length - paths.extname(basename).length);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConfigurationResolverService.prototype, "fileDirname", {
            get: function () {
                return paths.dirname(this.getFilePath());
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConfigurationResolverService.prototype, "fileExtname", {
            get: function () {
                return paths.extname(this.getFilePath());
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConfigurationResolverService.prototype, "lineNumber", {
            get: function () {
                var activeEditor = this.editorService.getActiveEditor();
                if (activeEditor) {
                    var editorControl = activeEditor.getControl();
                    if (editorControl) {
                        var lineNumber = editorControl.getSelection().positionLineNumber;
                        return String(lineNumber);
                    }
                }
                return '';
            },
            enumerable: true,
            configurable: true
        });
        ConfigurationResolverService.prototype.getFilePath = function () {
            var input = this.editorService.getActiveEditorInput();
            if (!input) {
                return '';
            }
            var fileResource = editor_1.toResource(input, { filter: 'file' });
            if (!fileResource) {
                return '';
            }
            return paths.normalize(fileResource.fsPath, true);
        };
        ConfigurationResolverService.prototype.resolve = function (root, value) {
            this._workspaceRoot = root.fsPath.toString();
            if (types.isString(value)) {
                return this.resolveString(root, value);
            }
            else if (types.isArray(value)) {
                return this.resolveArray(root, value);
            }
            else if (types.isObject(value)) {
                return this.resolveLiteral(root, value);
            }
            return value;
        };
        ConfigurationResolverService.prototype.resolveAny = function (root, value) {
            this._workspaceRoot = root.fsPath.toString();
            if (types.isString(value)) {
                return this.resolveString(root, value);
            }
            else if (types.isArray(value)) {
                return this.resolveAnyArray(root, value);
            }
            else if (types.isObject(value)) {
                return this.resolveAnyLiteral(root, value);
            }
            return value;
        };
        ConfigurationResolverService.prototype.resolveString = function (root, value) {
            var _this = this;
            var regexp = /\$\{(.*?)\}/g;
            var originalValue = value;
            var resolvedString = value.replace(regexp, function (match, name) {
                var newValue = _this[name];
                if (types.isString(newValue)) {
                    return newValue;
                }
                else {
                    return match && match.indexOf('env:') > 0 ? '' : match;
                }
            });
            return this.resolveConfigVariable(root, resolvedString, originalValue);
        };
        ConfigurationResolverService.prototype.resolveConfigVariable = function (root, value, originalValue) {
            var _this = this;
            var replacer = function (match, name) {
                var config = _this.configurationService.getConfiguration();
                var newValue;
                try {
                    var keys = name.split('.');
                    if (!keys || keys.length <= 0) {
                        return '';
                    }
                    while (keys.length > 1) {
                        var key = keys.shift();
                        if (!config || !config.hasOwnProperty(key)) {
                            return '';
                        }
                        config = config[key];
                    }
                    newValue = config && config.hasOwnProperty(keys[0]) ? config[keys[0]] : '';
                }
                catch (e) {
                    return '';
                }
                if (types.isString(newValue)) {
                    // Prevent infinite recursion and also support nested references (or tokens)
                    return newValue === originalValue ? '' : _this.resolveString(root, newValue);
                }
                else {
                    return _this.resolve(root, newValue) + '';
                }
            };
            return value.replace(/\$\{config:(.+?)\}/g, replacer);
        };
        ConfigurationResolverService.prototype.resolveLiteral = function (root, values) {
            var _this = this;
            var result = Object.create(null);
            Object.keys(values).forEach(function (key) {
                var value = values[key];
                result[key] = _this.resolve(root, value);
            });
            return result;
        };
        ConfigurationResolverService.prototype.resolveAnyLiteral = function (root, values) {
            var _this = this;
            var result = Object.create(null);
            Object.keys(values).forEach(function (key) {
                var value = values[key];
                result[key] = _this.resolveAny(root, value);
            });
            return result;
        };
        ConfigurationResolverService.prototype.resolveArray = function (root, value) {
            var _this = this;
            return value.map(function (s) { return _this.resolveString(root, s); });
        };
        ConfigurationResolverService.prototype.resolveAnyArray = function (root, value) {
            var _this = this;
            return value.map(function (s) { return _this.resolveAny(root, s); });
        };
        /**
         * Resolve all interactive variables in configuration #6569
         */
        ConfigurationResolverService.prototype.resolveInteractiveVariables = function (configuration, interactiveVariablesMap) {
            var _this = this;
            if (!configuration) {
                return winjs_base_1.TPromise.as(null);
            }
            // We need a map from interactive variables to keys because we only want to trigger an command once per key -
            // even though it might occur multiple times in configuration #7026.
            var interactiveVariablesToSubstitutes = {};
            var findInteractiveVariables = function (object) {
                Object.keys(object).forEach(function (key) {
                    if (object[key] && typeof object[key] === 'object') {
                        findInteractiveVariables(object[key]);
                    }
                    else if (typeof object[key] === 'string') {
                        var matches = /\${command:(.+)}/.exec(object[key]);
                        if (matches && matches.length === 2) {
                            var interactiveVariable = matches[1];
                            if (!interactiveVariablesToSubstitutes[interactiveVariable]) {
                                interactiveVariablesToSubstitutes[interactiveVariable] = [];
                            }
                            interactiveVariablesToSubstitutes[interactiveVariable].push({ object: object, key: key });
                        }
                    }
                });
            };
            findInteractiveVariables(configuration);
            var substitionCanceled = false;
            var factory = Object.keys(interactiveVariablesToSubstitutes).map(function (interactiveVariable) {
                return function () {
                    var commandId = null;
                    commandId = interactiveVariablesMap ? interactiveVariablesMap[interactiveVariable] : null;
                    if (!commandId) {
                        // Just launch any command if the interactive variable is not contributed by the adapter #12735
                        commandId = interactiveVariable;
                    }
                    return _this.commandService.executeCommand(commandId, configuration).then(function (result) {
                        if (result) {
                            interactiveVariablesToSubstitutes[interactiveVariable].forEach(function (substitute) {
                                if (substitute.object[substitute.key].indexOf("${command:" + interactiveVariable + "}") >= 0) {
                                    substitute.object[substitute.key] = substitute.object[substitute.key].replace("${command:" + interactiveVariable + "}", result);
                                }
                            });
                        }
                        else {
                            substitionCanceled = true;
                        }
                    });
                };
            });
            return async_1.sequence(factory).then(function () { return substitionCanceled ? null : configuration; });
        };
        ConfigurationResolverService = __decorate([
            __param(1, editorService_1.IWorkbenchEditorService),
            __param(2, environment_1.IEnvironmentService),
            __param(3, configuration_1.IConfigurationService),
            __param(4, commands_1.ICommandService)
        ], ConfigurationResolverService);
        return ConfigurationResolverService;
    }());
    exports.ConfigurationResolverService = ConfigurationResolverService;
});
//# sourceMappingURL=configurationResolverService.js.map