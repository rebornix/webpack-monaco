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
define(["require", "exports", "vs/nls", "vs/base/common/lifecycle", "vs/base/common/event", "vs/base/common/winjs.base", "vs/base/common/strings", "vs/base/common/arrays", "vs/base/common/platform", "vs/base/common/objects", "vs/base/common/uri", "vs/base/common/network", "vs/base/common/paths", "vs/editor/common/editorCommon", "vs/platform/lifecycle/common/lifecycle", "vs/platform/storage/common/storage", "vs/platform/extensions/common/extensionsRegistry", "vs/platform/registry/common/platform", "vs/platform/jsonschemas/common/jsonContributionRegistry", "vs/platform/configuration/common/configuration", "vs/platform/files/common/files", "vs/platform/telemetry/common/telemetry", "vs/platform/workspace/common/workspace", "vs/platform/instantiation/common/instantiation", "vs/platform/commands/common/commands", "vs/workbench/parts/debug/common/debug", "vs/workbench/parts/debug/node/debugAdapter", "vs/workbench/services/editor/common/editorService", "vs/platform/quickOpen/common/quickOpen", "vs/workbench/services/configurationResolver/common/configurationResolver"], function (require, exports, nls, lifecycle_1, event_1, winjs_base_1, strings, arrays_1, platform_1, objects, uri_1, network_1, paths, editorCommon_1, lifecycle_2, storage_1, extensionsRegistry, platform_2, jsonContributionRegistry_1, configuration_1, files_1, telemetry_1, workspace_1, instantiation_1, commands_1, debug_1, debugAdapter_1, editorService_1, quickOpen_1, configurationResolver_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // debuggers extension point
    exports.debuggersExtPoint = extensionsRegistry.ExtensionsRegistry.registerExtensionPoint('debuggers', [], {
        description: nls.localize('vscode.extension.contributes.debuggers', 'Contributes debug adapters.'),
        type: 'array',
        defaultSnippets: [{ body: [{ type: '', extensions: [] }] }],
        items: {
            type: 'object',
            defaultSnippets: [{ body: { type: '', program: '', runtime: '', enableBreakpointsFor: { languageIds: [''] } } }],
            properties: {
                type: {
                    description: nls.localize('vscode.extension.contributes.debuggers.type', "Unique identifier for this debug adapter."),
                    type: 'string'
                },
                label: {
                    description: nls.localize('vscode.extension.contributes.debuggers.label', "Display name for this debug adapter."),
                    type: 'string'
                },
                program: {
                    description: nls.localize('vscode.extension.contributes.debuggers.program', "Path to the debug adapter program. Path is either absolute or relative to the extension folder."),
                    type: 'string'
                },
                args: {
                    description: nls.localize('vscode.extension.contributes.debuggers.args', "Optional arguments to pass to the adapter."),
                    type: 'array'
                },
                runtime: {
                    description: nls.localize('vscode.extension.contributes.debuggers.runtime', "Optional runtime in case the program attribute is not an executable but requires a runtime."),
                    type: 'string'
                },
                runtimeArgs: {
                    description: nls.localize('vscode.extension.contributes.debuggers.runtimeArgs', "Optional runtime arguments."),
                    type: 'array'
                },
                variables: {
                    description: nls.localize('vscode.extension.contributes.debuggers.variables', "Mapping from interactive variables (e.g ${action.pickProcess}) in `launch.json` to a command."),
                    type: 'object'
                },
                initialConfigurations: {
                    description: nls.localize('vscode.extension.contributes.debuggers.initialConfigurations', "Configurations for generating the initial \'launch.json\'."),
                    type: ['array', 'string'],
                },
                languages: {
                    description: nls.localize('vscode.extension.contributes.debuggers.languages', "List of languages for which the debug extension could be considered the \"default debugger\"."),
                    type: 'array'
                },
                adapterExecutableCommand: {
                    description: nls.localize('vscode.extension.contributes.debuggers.adapterExecutableCommand', "If specified VS Code will call this command to determine the executable path of the debug adapter and the arguments to pass."),
                    type: 'string'
                },
                startSessionCommand: {
                    description: nls.localize('vscode.extension.contributes.debuggers.startSessionCommand', "If specified VS Code will call this command for the \"debug\" or \"run\" actions targeted for this extension."),
                    type: 'string'
                },
                configurationSnippets: {
                    description: nls.localize('vscode.extension.contributes.debuggers.configurationSnippets', "Snippets for adding new configurations in \'launch.json\'."),
                    type: 'array'
                },
                configurationAttributes: {
                    description: nls.localize('vscode.extension.contributes.debuggers.configurationAttributes', "JSON schema configurations for validating \'launch.json\'."),
                    type: 'object'
                },
                windows: {
                    description: nls.localize('vscode.extension.contributes.debuggers.windows', "Windows specific settings."),
                    type: 'object',
                    properties: {
                        runtime: {
                            description: nls.localize('vscode.extension.contributes.debuggers.windows.runtime', "Runtime used for Windows."),
                            type: 'string'
                        }
                    }
                },
                osx: {
                    description: nls.localize('vscode.extension.contributes.debuggers.osx', "OS X specific settings."),
                    type: 'object',
                    properties: {
                        runtime: {
                            description: nls.localize('vscode.extension.contributes.debuggers.osx.runtime', "Runtime used for OSX."),
                            type: 'string'
                        }
                    }
                },
                linux: {
                    description: nls.localize('vscode.extension.contributes.debuggers.linux', "Linux specific settings."),
                    type: 'object',
                    properties: {
                        runtime: {
                            description: nls.localize('vscode.extension.contributes.debuggers.linux.runtime', "Runtime used for Linux."),
                            type: 'string'
                        }
                    }
                }
            }
        }
    });
    // breakpoints extension point #9037
    var breakpointsExtPoint = extensionsRegistry.ExtensionsRegistry.registerExtensionPoint('breakpoints', [], {
        description: nls.localize('vscode.extension.contributes.breakpoints', 'Contributes breakpoints.'),
        type: 'array',
        defaultSnippets: [{ body: [{ language: '' }] }],
        items: {
            type: 'object',
            defaultSnippets: [{ body: { language: '' } }],
            properties: {
                language: {
                    description: nls.localize('vscode.extension.contributes.breakpoints.language', "Allow breakpoints for this language."),
                    type: 'string'
                },
            }
        }
    });
    // debug general schema
    exports.schemaId = 'vscode://schemas/launch';
    var defaultCompound = { name: 'Compound', configurations: [] };
    var schema = {
        id: exports.schemaId,
        type: 'object',
        title: nls.localize('app.launch.json.title', "Launch"),
        required: ['version', 'configurations'],
        default: { version: '0.2.0', configurations: [], compounds: [] },
        properties: {
            version: {
                type: 'string',
                description: nls.localize('app.launch.json.version', "Version of this file format."),
                default: '0.2.0'
            },
            configurations: {
                type: 'array',
                description: nls.localize('app.launch.json.configurations', "List of configurations. Add new configurations or edit existing ones by using IntelliSense."),
                items: {
                    defaultSnippets: [],
                    'type': 'object',
                    oneOf: []
                }
            },
            compounds: {
                type: 'array',
                description: nls.localize('app.launch.json.compounds', "List of compounds. Each compound references multiple configurations which will get launched together."),
                items: {
                    type: 'object',
                    required: ['name', 'configurations'],
                    properties: {
                        name: {
                            type: 'string',
                            description: nls.localize('app.launch.json.compound.name', "Name of compound. Appears in the launch configuration drop down menu.")
                        },
                        configurations: {
                            type: 'array',
                            default: [],
                            items: {
                                type: 'string'
                            },
                            description: nls.localize('app.launch.json.compounds.configurations', "Names of configurations that will be started as part of this compound.")
                        }
                    },
                    default: defaultCompound
                },
                default: [
                    defaultCompound
                ]
            }
        }
    };
    var jsonRegistry = platform_2.Registry.as(jsonContributionRegistry_1.Extensions.JSONContribution);
    jsonRegistry.registerSchema(exports.schemaId, schema);
    var DEBUG_SELECTED_CONFIG_NAME_KEY = 'debug.selectedconfigname';
    var DEBUG_SELECTED_ROOT = 'debug.selectedroot';
    var DEBUG_CONFIG_MRU = 'debug.configmru';
    var MRU_SIZE = 5;
    var ConfigurationManager = (function () {
        function ConfigurationManager(contextService, fileService, telemetryService, editorService, configurationService, quickOpenService, configurationResolverService, instantiationService, commandService, storageService, lifecycleService) {
            var _this = this;
            this.contextService = contextService;
            this.fileService = fileService;
            this.telemetryService = telemetryService;
            this.editorService = editorService;
            this.configurationService = configurationService;
            this.quickOpenService = quickOpenService;
            this.configurationResolverService = configurationResolverService;
            this.instantiationService = instantiationService;
            this.commandService = commandService;
            this.storageService = storageService;
            this.breakpointModeIdsSet = new Set();
            this._onDidSelectConfigurationName = new event_1.Emitter();
            this._providers = new Map();
            this.adapters = [];
            this.toDispose = [];
            this.registerListeners(lifecycleService);
            this.initLaunches();
            var previousSelectedRoot = this.storageService.get(DEBUG_SELECTED_ROOT, storage_1.StorageScope.WORKSPACE);
            var filtered = this.launches.filter(function (l) { return l.workspaceUri.toString() === previousSelectedRoot; });
            var launchToSelect = filtered.length ? filtered[0] : this.launches.length ? this.launches[0] : undefined;
            this.selectConfiguration(launchToSelect, this.storageService.get(DEBUG_SELECTED_CONFIG_NAME_KEY, storage_1.StorageScope.WORKSPACE));
            this._mru = [];
            var mruRaw = JSON.parse(this.storageService.get(DEBUG_CONFIG_MRU, storage_1.StorageScope.WORKSPACE, '[]'));
            mruRaw.forEach(function (raw) {
                var launch = _this.launches.filter(function (l) { return l.workspaceUri.toString() === raw.uriStr; }).pop();
                if (launch) {
                    _this._mru.push({ name: name, launch: launch });
                }
            });
            if (this._mru.length < MRU_SIZE) {
                this.launches.forEach(function (launch) {
                    launch.getConfigurationNames().forEach(function (name) {
                        if (_this._mru.length < MRU_SIZE && _this._mru.indexOf({ name: name, launch: launch }) === -1) {
                            _this._mru.push({ name: name, launch: launch });
                        }
                    });
                });
            }
        }
        ConfigurationManager.prototype.registerDebugConfigurationProvider = function (handle, debugConfigurationProvider) {
            if (!debugConfigurationProvider) {
                return;
            }
            this._providers.set(handle, debugConfigurationProvider);
        };
        ConfigurationManager.prototype.unregisterDebugConfigurationProvider = function (handle) {
            return this._providers.delete(handle);
        };
        ConfigurationManager.prototype.resolveDebugConfiguration = function (folderUri, debugConfiguration) {
            // collect all candidates
            var providers = [];
            this._providers.forEach(function (provider) {
                if (provider.type === debugConfiguration.type && provider.resolveDebugConfiguration) {
                    providers.push(provider);
                }
            });
            // pipe the config through the promises sequentially
            return providers.reduce(function (promise, provider) {
                return promise.then(function (config) {
                    return provider.resolveDebugConfiguration(folderUri, config);
                });
            }, winjs_base_1.TPromise.as(debugConfiguration));
        };
        ConfigurationManager.prototype.provideDebugConfigurations = function (folderUri, type) {
            // collect all candidates
            var configs = [];
            this._providers.forEach(function (provider) {
                if (provider.type === type && provider.provideDebugConfigurations) {
                    configs.push(provider.provideDebugConfigurations(folderUri));
                }
            });
            // combine all configs into one array
            return winjs_base_1.TPromise.join(configs).then(function (results) {
                return [].concat.apply([], results);
            });
        };
        ConfigurationManager.prototype.registerListeners = function (lifecycleService) {
            var _this = this;
            exports.debuggersExtPoint.setHandler(function (extensions) {
                extensions.forEach(function (extension) {
                    extension.value.forEach(function (rawAdapter) {
                        if (!rawAdapter.type || (typeof rawAdapter.type !== 'string')) {
                            extension.collector.error(nls.localize('debugNoType', "Debug adapter 'type' can not be omitted and must be of type 'string'."));
                        }
                        if (rawAdapter.enableBreakpointsFor) {
                            rawAdapter.enableBreakpointsFor.languageIds.forEach(function (modeId) {
                                _this.breakpointModeIdsSet.add(modeId);
                            });
                        }
                        var duplicate = _this.adapters.filter(function (a) { return a.type === rawAdapter.type; }).pop();
                        if (duplicate) {
                            duplicate.merge(rawAdapter, extension.description);
                        }
                        else {
                            _this.adapters.push(_this.instantiationService.createInstance(debugAdapter_1.Adapter, rawAdapter, extension.description));
                        }
                    });
                });
                // update the schema to include all attributes, snippets and types from extensions.
                _this.adapters.forEach(function (adapter) {
                    var items = schema.properties['configurations'].items;
                    var schemaAttributes = adapter.getSchemaAttributes();
                    if (schemaAttributes) {
                        (_a = items.oneOf).push.apply(_a, schemaAttributes);
                    }
                    var configurationSnippets = adapter.configurationSnippets;
                    if (configurationSnippets) {
                        (_b = items.defaultSnippets).push.apply(_b, configurationSnippets);
                    }
                    var _a, _b;
                });
            });
            breakpointsExtPoint.setHandler(function (extensions) {
                extensions.forEach(function (ext) {
                    ext.value.forEach(function (breakpoints) {
                        _this.breakpointModeIdsSet.add(breakpoints.language);
                    });
                });
            });
            this.toDispose.push(this.contextService.onDidChangeWorkspaceRoots(function () {
                _this.initLaunches();
            }));
            this.toDispose.push(this.configurationService.onDidUpdateConfiguration(function (event) {
                var toSelect = _this.selectedLaunch && _this.selectedLaunch.getConfigurationNames().length ? _this.selectedLaunch : arrays_1.first(_this.launches, function (l) { return !!l.getConfigurationNames().length; }, _this.selectedLaunch);
                _this.selectConfiguration(toSelect);
            }));
            this.toDispose.push(lifecycleService.onShutdown(this.store, this));
        };
        ConfigurationManager.prototype.initLaunches = function () {
            var _this = this;
            var workspace = this.contextService.getWorkspace();
            this.launches = workspace ? workspace.roots.map(function (root) { return _this.instantiationService.createInstance(Launch, _this, root); }) : [];
        };
        ConfigurationManager.prototype.getLaunches = function () {
            return this.launches;
        };
        Object.defineProperty(ConfigurationManager.prototype, "selectedLaunch", {
            get: function () {
                return this._selectedLaunch;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConfigurationManager.prototype, "selectedName", {
            get: function () {
                return this._selectedName;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConfigurationManager.prototype, "onDidSelectConfiguration", {
            get: function () {
                return this._onDidSelectConfigurationName.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConfigurationManager.prototype, "mruConfigs", {
            get: function () {
                return this._mru;
            },
            enumerable: true,
            configurable: true
        });
        ConfigurationManager.prototype.selectConfiguration = function (launch, name, debugStarted) {
            var previousLaunch = this._selectedLaunch;
            var previousName = this._selectedName;
            this._selectedLaunch = launch;
            var names = launch ? launch.getConfigurationNames() : [];
            if (name && names.indexOf(name) >= 0) {
                this._selectedName = name;
            }
            if (names.indexOf(this.selectedName) === -1) {
                this._selectedName = names.length ? names[0] : undefined;
            }
            if (debugStarted && this._selectedLaunch && this._selectedName) {
                this._mru = this._mru.filter(function (entry) { return entry.launch.workspaceUri !== launch.workspaceUri || entry.name !== name; });
                this._mru.unshift({ launch: launch, name: name });
                if (this._mru.length > MRU_SIZE) {
                    this._mru.pop();
                }
            }
            if (this.selectedLaunch !== previousLaunch || this.selectedName !== previousName) {
                this._onDidSelectConfigurationName.fire();
            }
        };
        ConfigurationManager.prototype.canSetBreakpointsIn = function (model) {
            if (model.uri.scheme !== network_1.Schemas.file && model.uri.scheme !== debug_1.DEBUG_SCHEME) {
                return false;
            }
            if (this.configurationService.getConfiguration('debug').allowBreakpointsEverywhere) {
                return true;
            }
            var modeId = model ? model.getLanguageIdentifier().language : null;
            return this.breakpointModeIdsSet.has(modeId);
        };
        ConfigurationManager.prototype.getAdapter = function (type) {
            return this.adapters.filter(function (adapter) { return strings.equalsIgnoreCase(adapter.type, type); }).pop();
        };
        ConfigurationManager.prototype.guessAdapter = function (type) {
            var _this = this;
            if (type) {
                var adapter = this.getAdapter(type);
                return winjs_base_1.TPromise.as(adapter);
            }
            var editor = this.editorService.getActiveEditor();
            if (editor) {
                var codeEditor = editor.getControl();
                if (editorCommon_1.isCommonCodeEditor(codeEditor)) {
                    var model = codeEditor.getModel();
                    var language_1 = model ? model.getLanguageIdentifier().language : undefined;
                    var adapters = this.adapters.filter(function (a) { return a.languages && a.languages.indexOf(language_1) >= 0; });
                    if (adapters.length === 1) {
                        return winjs_base_1.TPromise.as(adapters[0]);
                    }
                }
            }
            return this.quickOpenService.pick(this.adapters.filter(function (a) { return a.hasInitialConfiguration(); }).concat([{ label: 'More...', separator: { border: true } }]), { placeHolder: nls.localize('selectDebug', "Select Environment") })
                .then(function (picked) {
                if (picked instanceof debugAdapter_1.Adapter) {
                    return picked;
                }
                if (picked) {
                    _this.commandService.executeCommand('debug.installAdditionalDebuggers');
                }
                return undefined;
            });
        };
        ConfigurationManager.prototype.getStartSessionCommand = function (type) {
            return this.guessAdapter(type).then(function (adapter) {
                if (adapter) {
                    return {
                        command: adapter.startSessionCommand,
                        type: adapter.type
                    };
                }
                return undefined;
            });
        };
        ConfigurationManager.prototype.store = function () {
            this.storageService.store(DEBUG_CONFIG_MRU, JSON.stringify(this._mru.map(function (entry) { return ({ name: entry.name, uri: entry.launch.uri }); })), storage_1.StorageScope.WORKSPACE);
            this.storageService.store(DEBUG_SELECTED_CONFIG_NAME_KEY, this.selectedName, storage_1.StorageScope.WORKSPACE);
            if (this._selectedLaunch) {
                this.storageService.store(DEBUG_SELECTED_ROOT, this._selectedLaunch.workspaceUri.toString(), storage_1.StorageScope.WORKSPACE);
            }
        };
        ConfigurationManager.prototype.dispose = function () {
            this.toDispose = lifecycle_1.dispose(this.toDispose);
        };
        ConfigurationManager = __decorate([
            __param(0, workspace_1.IWorkspaceContextService),
            __param(1, files_1.IFileService),
            __param(2, telemetry_1.ITelemetryService),
            __param(3, editorService_1.IWorkbenchEditorService),
            __param(4, configuration_1.IConfigurationService),
            __param(5, quickOpen_1.IQuickOpenService),
            __param(6, configurationResolver_1.IConfigurationResolverService),
            __param(7, instantiation_1.IInstantiationService),
            __param(8, commands_1.ICommandService),
            __param(9, storage_1.IStorageService),
            __param(10, lifecycle_2.ILifecycleService)
        ], ConfigurationManager);
        return ConfigurationManager;
    }());
    exports.ConfigurationManager = ConfigurationManager;
    var Launch = (function () {
        function Launch(configurationManager, workspaceUri, fileService, editorService, configurationService, configurationResolverService) {
            this.configurationManager = configurationManager;
            this.workspaceUri = workspaceUri;
            this.fileService = fileService;
            this.editorService = editorService;
            this.configurationService = configurationService;
            this.configurationResolverService = configurationResolverService;
            this.name = paths.basename(this.workspaceUri.fsPath);
        }
        Launch.prototype.getCompound = function (name) {
            var config = this.configurationService.getConfiguration('launch', { resource: this.workspaceUri });
            if (!config || !config.compounds) {
                return null;
            }
            return config.compounds.filter(function (compound) { return compound.name === name; }).pop();
        };
        Launch.prototype.getConfigurationNames = function () {
            var config = this.configurationService.getConfiguration('launch', { resource: this.workspaceUri });
            if (!config || !config.configurations) {
                return [];
            }
            else {
                var names = config.configurations.filter(function (cfg) { return cfg && typeof cfg.name === 'string'; }).map(function (cfg) { return cfg.name; });
                if (names.length > 0 && config.compounds) {
                    if (config.compounds) {
                        names.push.apply(names, config.compounds.filter(function (compound) { return typeof compound.name === 'string' && compound.configurations && compound.configurations.length; })
                            .map(function (compound) { return compound.name; }));
                    }
                }
                return names;
            }
        };
        Launch.prototype.getConfiguration = function (name) {
            var config = this.configurationService.getConfiguration('launch', { resource: this.workspaceUri });
            if (!config || !config.configurations) {
                return null;
            }
            return config.configurations.filter(function (config) { return config && config.name === name; }).shift();
        };
        Launch.prototype.resolveConfiguration = function (config) {
            var _this = this;
            var result = objects.deepClone(config);
            // Set operating system specific properties #1873
            var setOSProperties = function (flag, osConfig) {
                if (flag && osConfig) {
                    Object.keys(osConfig).forEach(function (key) {
                        result[key] = osConfig[key];
                    });
                }
            };
            setOSProperties(platform_1.isWindows, result.windows);
            setOSProperties(platform_1.isMacintosh, result.osx);
            setOSProperties(platform_1.isLinux, result.linux);
            // massage configuration attributes - append workspace path to relatvie paths, substitute variables in paths.
            Object.keys(result).forEach(function (key) {
                result[key] = _this.configurationResolverService.resolveAny(_this.workspaceUri, result[key]);
            });
            var adapter = this.configurationManager.getAdapter(result.type);
            return this.configurationResolverService.resolveInteractiveVariables(result, adapter ? adapter.variables : null);
        };
        Object.defineProperty(Launch.prototype, "uri", {
            get: function () {
                return uri_1.default.file(paths.join(this.workspaceUri.fsPath, '/.vscode/launch.json'));
            },
            enumerable: true,
            configurable: true
        });
        Launch.prototype.openConfigFile = function (sideBySide, type) {
            var _this = this;
            var resource = this.uri;
            var configFileCreated = false;
            return this.fileService.resolveContent(resource).then(function (content) { return content; }, function (err) {
                // launch.json not found: create one by collecting launch configs from debugConfigProviders
                return _this.configurationManager.guessAdapter(type).then(function (adapter) {
                    if (adapter) {
                        return _this.configurationManager.provideDebugConfigurations(_this.workspaceUri, adapter.type).then(function (initialConfigs) {
                            return adapter.getInitialConfigurationContent(_this.workspaceUri, initialConfigs);
                        });
                    }
                    else {
                        return undefined;
                    }
                }).then(function (content) {
                    if (!content) {
                        return undefined;
                    }
                    configFileCreated = true;
                    return _this.fileService.updateContent(resource, content).then(function () {
                        // convert string into IContent; see #32135
                        return { value: content };
                    });
                });
            }).then(function (content) {
                if (!content) {
                    return undefined;
                }
                var index = content.value.indexOf("\"" + _this.configurationManager.selectedName + "\"");
                var startLineNumber = 1;
                for (var i = 0; i < index; i++) {
                    if (content.value.charAt(i) === '\n') {
                        startLineNumber++;
                    }
                }
                var selection = startLineNumber > 1 ? { startLineNumber: startLineNumber, startColumn: 4 } : undefined;
                return _this.editorService.openEditor({
                    resource: resource,
                    options: {
                        forceOpen: true,
                        selection: selection,
                        pinned: configFileCreated,
                        revealIfVisible: true
                    },
                }, sideBySide);
            }, function (error) {
                throw new Error(nls.localize('DebugConfig.failed', "Unable to create 'launch.json' file inside the '.vscode' folder ({0}).", error));
            });
        };
        Launch = __decorate([
            __param(2, files_1.IFileService),
            __param(3, editorService_1.IWorkbenchEditorService),
            __param(4, configuration_1.IConfigurationService),
            __param(5, configurationResolver_1.IConfigurationResolverService)
        ], Launch);
        return Launch;
    }());
});
//# sourceMappingURL=debugConfigurationManager.js.map