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
define(["require", "exports", "vs/base/common/uri", "vs/base/common/paths", "vs/base/common/winjs.base", "vs/base/common/event", "vs/base/common/map", "vs/base/common/arrays", "vs/base/common/objects", "vs/base/common/errors", "vs/base/common/collections", "vs/base/common/lifecycle", "vs/base/common/async", "vs/base/node/pfs", "vs/platform/jsonschemas/common/jsonContributionRegistry", "vs/base/node/extfs", "vs/platform/workspace/common/workspace", "vs/platform/files/common/files", "vs/base/common/platform", "vs/base/node/config", "vs/platform/configuration/common/model", "vs/workbench/services/configuration/common/configurationModels", "vs/platform/configuration/common/configuration", "vs/workbench/services/configuration/common/configuration", "vs/platform/configuration/node/configurationService", "vs/nls", "vs/platform/registry/common/platform", "vs/platform/extensions/common/extensionsRegistry", "vs/platform/configuration/common/configurationRegistry", "crypto", "vs/platform/workspaces/common/workspaces"], function (require, exports, uri_1, paths, winjs_base_1, event_1, map_1, arrays_1, objects, errors, collections, lifecycle_1, async_1, pfs_1, jsonContributionRegistry_1, extfs, workspace_1, files_1, platform_1, config_1, model_1, configurationModels_1, configuration_1, configuration_2, configurationService_1, nls, platform_2, extensionsRegistry_1, configurationRegistry_1, crypto_1, workspaces_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var configurationRegistry = platform_2.Registry.as(configurationRegistry_1.Extensions.Configuration);
    // BEGIN VSCode extension point `configuration`
    var configurationExtPoint = extensionsRegistry_1.ExtensionsRegistry.registerExtensionPoint('configuration', [], {
        description: nls.localize('vscode.extension.contributes.configuration', 'Contributes configuration settings.'),
        type: 'object',
        defaultSnippets: [{ body: { title: '', properties: {} } }],
        properties: {
            title: {
                description: nls.localize('vscode.extension.contributes.configuration.title', 'A summary of the settings. This label will be used in the settings file as separating comment.'),
                type: 'string'
            },
            properties: {
                description: nls.localize('vscode.extension.contributes.configuration.properties', 'Description of the configuration properties.'),
                type: 'object',
                additionalProperties: {
                    anyOf: [
                        { $ref: 'http://json-schema.org/draft-04/schema#' },
                        {
                            type: 'object',
                            properties: {
                                isExecutable: {
                                    type: 'boolean'
                                },
                                scope: {
                                    type: 'string',
                                    enum: ['window', 'resource'],
                                    default: 'window',
                                    enumDescriptions: [
                                        nls.localize('scope.window.description', "Window specific configuration, which can be configured in the User or Workspace settings."),
                                        nls.localize('scope.resource.description', "Resource specific configuration, which can be configured in the User, Workspace or Folder settings.")
                                    ],
                                    description: nls.localize('scope.description', "Scope in which the configuration is applicable. Available scopes are `window` and `resource`.")
                                }
                            }
                        }
                    ]
                }
            }
        }
    });
    configurationExtPoint.setHandler(function (extensions) {
        var configurations = [];
        for (var i = 0; i < extensions.length; i++) {
            var configuration = objects.clone(extensions[i].value);
            var collector = extensions[i].collector;
            if (configuration.type && configuration.type !== 'object') {
                collector.warn(nls.localize('invalid.type', "if set, 'configuration.type' must be set to 'object"));
            }
            else {
                configuration.type = 'object';
            }
            if (configuration.title && (typeof configuration.title !== 'string')) {
                collector.error(nls.localize('invalid.title', "'configuration.title' must be a string"));
            }
            validateProperties(configuration, collector);
            configuration.id = extensions[i].description.id;
            configurations.push(configuration);
        }
        configurationRegistry.registerConfigurations(configurations, false);
    });
    // END VSCode extension point `configuration`
    // BEGIN VSCode extension point `configurationDefaults`
    var defaultConfigurationExtPoint = extensionsRegistry_1.ExtensionsRegistry.registerExtensionPoint('configurationDefaults', [], {
        description: nls.localize('vscode.extension.contributes.defaultConfiguration', 'Contributes default editor configuration settings by language.'),
        type: 'object',
        defaultSnippets: [{ body: {} }],
        patternProperties: {
            '\\[.*\\]$': {
                type: 'object',
                default: {},
                $ref: configurationRegistry_1.editorConfigurationSchemaId,
            }
        }
    });
    defaultConfigurationExtPoint.setHandler(function (extensions) {
        var defaultConfigurations = extensions.map(function (extension) {
            var id = extension.description.id;
            var name = extension.description.name;
            var defaults = objects.clone(extension.value);
            return {
                id: id, name: name, defaults: defaults
            };
        });
        configurationRegistry.registerDefaultConfigurations(defaultConfigurations);
    });
    // END VSCode extension point `configurationDefaults`
    function validateProperties(configuration, collector) {
        var properties = configuration.properties;
        if (properties) {
            if (typeof properties !== 'object') {
                collector.error(nls.localize('invalid.properties', "'configuration.properties' must be an object"));
                configuration.properties = {};
            }
            for (var key in properties) {
                var message = configurationRegistry_1.validateProperty(key);
                var propertyConfiguration = configuration.properties[key];
                propertyConfiguration.scope = propertyConfiguration.scope && propertyConfiguration.scope.toString() === 'resource' ? configurationRegistry_1.ConfigurationScope.RESOURCE : configurationRegistry_1.ConfigurationScope.WINDOW;
                if (message) {
                    collector.warn(message);
                    delete properties[key];
                }
            }
        }
        var subNodes = configuration.allOf;
        if (subNodes) {
            for (var _i = 0, subNodes_1 = subNodes; _i < subNodes_1.length; _i++) {
                var node = subNodes_1[_i];
                validateProperties(node, collector);
            }
        }
    }
    var WorkspaceService = (function (_super) {
        __extends(WorkspaceService, _super);
        function WorkspaceService() {
            var _this = _super.call(this) || this;
            _this.workspace = null;
            _this.legacyWorkspace = null;
            _this._onDidUpdateConfiguration = _this._register(new event_1.Emitter());
            _this.onDidUpdateConfiguration = _this._onDidUpdateConfiguration.event;
            _this._onDidChangeWorkspaceRoots = _this._register(new event_1.Emitter());
            _this.onDidChangeWorkspaceRoots = _this._onDidChangeWorkspaceRoots.event;
            _this._onDidChangeWorkspaceName = _this._register(new event_1.Emitter());
            _this.onDidChangeWorkspaceName = _this._onDidChangeWorkspaceName.event;
            _this._configuration = new Configuration(new configuration_1.Configuration(new configuration_1.ConfigurationModel(), new configuration_1.ConfigurationModel()), new configuration_1.ConfigurationModel(), new map_1.StrictResourceMap(), _this.workspace);
            return _this;
        }
        WorkspaceService.prototype.getLegacyWorkspace = function () {
            return this.legacyWorkspace;
        };
        WorkspaceService.prototype.getWorkspace = function () {
            return this.workspace;
        };
        WorkspaceService.prototype.hasWorkspace = function () {
            return !!this.workspace;
        };
        WorkspaceService.prototype.hasFolderWorkspace = function () {
            return this.workspace && !this.workspace.configuration;
        };
        WorkspaceService.prototype.hasMultiFolderWorkspace = function () {
            return this.workspace && !!this.workspace.configuration;
        };
        WorkspaceService.prototype.getRoot = function (resource) {
            return this.workspace ? this.workspace.getRoot(resource) : null;
        };
        Object.defineProperty(WorkspaceService.prototype, "workspaceUri", {
            get: function () {
                return this.workspace ? this.workspace.roots[0] : null;
            },
            enumerable: true,
            configurable: true
        });
        WorkspaceService.prototype.isInsideWorkspace = function (resource) {
            return !!this.getRoot(resource);
        };
        WorkspaceService.prototype.toResource = function (workspaceRelativePath) {
            return this.workspace ? this.legacyWorkspace.toResource(workspaceRelativePath) : null;
        };
        WorkspaceService.prototype.initialize = function (trigger) {
            var _this = this;
            if (trigger === void 0) { trigger = true; }
            this.resetCaches();
            return this.updateConfiguration()
                .then(function () {
                if (trigger) {
                    _this.triggerConfigurationChange();
                }
            });
        };
        WorkspaceService.prototype.reloadConfiguration = function (section) {
            return winjs_base_1.TPromise.as(this.getConfiguration(section));
        };
        WorkspaceService.prototype.getConfigurationData = function () {
            return this._configuration.toData();
        };
        WorkspaceService.prototype.getConfiguration = function (section, overrides) {
            return this._configuration.getValue(section, overrides);
        };
        WorkspaceService.prototype.lookup = function (key, overrides) {
            return this._configuration.lookup(key, overrides);
        };
        WorkspaceService.prototype.keys = function (overrides) {
            return this._configuration.keys(overrides);
        };
        WorkspaceService.prototype.values = function () {
            return this._configuration.values();
        };
        WorkspaceService.prototype.getUnsupportedWorkspaceKeys = function () {
            return [];
        };
        WorkspaceService.prototype.isInWorkspaceContext = function () {
            return false;
        };
        WorkspaceService.prototype.triggerConfigurationChange = function () {
            this._onDidUpdateConfiguration.fire({ source: configuration_1.ConfigurationSource.Workspace, sourceConfig: void 0 });
        };
        WorkspaceService.prototype.handleWorkspaceFileEvents = function (event) {
            // implemented by sub classes
        };
        WorkspaceService.prototype.resetCaches = function () {
            // implemented by sub classes
        };
        WorkspaceService.prototype.updateConfiguration = function () {
            // implemented by sub classes
            return winjs_base_1.TPromise.as(false);
        };
        return WorkspaceService;
    }(lifecycle_1.Disposable));
    exports.WorkspaceService = WorkspaceService;
    var EmptyWorkspaceServiceImpl = (function (_super) {
        __extends(EmptyWorkspaceServiceImpl, _super);
        function EmptyWorkspaceServiceImpl(environmentService) {
            var _this = _super.call(this) || this;
            _this.baseConfigurationService = _this._register(new configurationService_1.ConfigurationService(environmentService));
            _this._register(_this.baseConfigurationService.onDidUpdateConfiguration(function (e) { return _this.onBaseConfigurationChanged(e); }));
            _this.resetCaches();
            return _this;
        }
        EmptyWorkspaceServiceImpl.prototype.reloadConfiguration = function (section) {
            var _this = this;
            var current = this._configuration;
            return this.baseConfigurationService.reloadConfiguration()
                .then(function () { return _this.initialize(false); }) // Reinitialize to ensure we are hitting the disk
                .then(function () {
                // Check and trigger
                if (!_this._configuration.equals(current)) {
                    _this.triggerConfigurationChange();
                }
                return _super.prototype.reloadConfiguration.call(_this, section);
            });
        };
        EmptyWorkspaceServiceImpl.prototype.onBaseConfigurationChanged = function (_a) {
            var source = _a.source, sourceConfig = _a.sourceConfig;
            if (this._configuration.updateBaseConfiguration(this.baseConfigurationService.configuration())) {
                this._onDidUpdateConfiguration.fire({ source: source, sourceConfig: sourceConfig });
            }
        };
        EmptyWorkspaceServiceImpl.prototype.resetCaches = function () {
            this._configuration = new Configuration(this.baseConfigurationService.configuration(), new configuration_1.ConfigurationModel(), new map_1.StrictResourceMap(), null);
        };
        EmptyWorkspaceServiceImpl.prototype.triggerConfigurationChange = function () {
            this._onDidUpdateConfiguration.fire({ source: configuration_1.ConfigurationSource.User, sourceConfig: this._configuration.user.contents });
        };
        return EmptyWorkspaceServiceImpl;
    }(WorkspaceService));
    exports.EmptyWorkspaceServiceImpl = EmptyWorkspaceServiceImpl;
    var WorkspaceServiceImpl = (function (_super) {
        __extends(WorkspaceServiceImpl, _super);
        function WorkspaceServiceImpl(workspaceIdentifier, environmentService, workspacesService, workspaceSettingsRootFolder) {
            if (workspaceSettingsRootFolder === void 0) { workspaceSettingsRootFolder = configuration_2.WORKSPACE_CONFIG_FOLDER_DEFAULT_NAME; }
            var _this = _super.call(this) || this;
            _this.workspaceIdentifier = workspaceIdentifier;
            _this.environmentService = environmentService;
            _this.workspacesService = workspacesService;
            _this.workspaceSettingsRootFolder = workspaceSettingsRootFolder;
            if (workspaces_1.isSingleFolderWorkspaceIdentifier(workspaceIdentifier)) {
                _this.folderPath = uri_1.default.file(workspaceIdentifier);
            }
            else {
                _this.workspaceConfigPath = uri_1.default.file(workspaceIdentifier.configPath);
            }
            _this.workspaceConfiguration = _this._register(new WorkspaceConfiguration());
            _this.baseConfigurationService = _this._register(new configurationService_1.ConfigurationService(environmentService));
            return _this;
        }
        WorkspaceServiceImpl.prototype.getUnsupportedWorkspaceKeys = function () {
            return this.hasFolderWorkspace() ? this._configuration.getFolderConfigurationModel(this.workspace.roots[0]).workspaceSettingsConfig.unsupportedKeys : [];
        };
        WorkspaceServiceImpl.prototype.initialize = function (trigger) {
            var _this = this;
            if (trigger === void 0) { trigger = true; }
            if (!this.workspace) {
                return this.initializeWorkspace()
                    .then(function () { return _super.prototype.initialize.call(_this, trigger); });
            }
            if (this.hasMultiFolderWorkspace()) {
                return this.workspaceConfiguration.load(this.workspaceConfigPath)
                    .then(function () { return _super.prototype.initialize.call(_this, trigger); });
            }
            return _super.prototype.initialize.call(this, trigger);
        };
        WorkspaceServiceImpl.prototype.reloadConfiguration = function (section) {
            var _this = this;
            var current = this._configuration;
            return this.baseConfigurationService.reloadConfiguration()
                .then(function () { return _this.initialize(false); }) // Reinitialize to ensure we are hitting the disk
                .then(function () {
                // Check and trigger
                if (!_this._configuration.equals(current)) {
                    _this.triggerConfigurationChange();
                }
                return _super.prototype.reloadConfiguration.call(_this, section);
            });
        };
        WorkspaceServiceImpl.prototype.handleWorkspaceFileEvents = function (event) {
            var _this = this;
            winjs_base_1.TPromise.join(this.workspace.roots.map(function (folder) { return _this.cachedFolderConfigs.get(folder).handleWorkspaceFileEvents(event); })) // handle file event for each folder
                .then(function (folderConfigurations) {
                return folderConfigurations.map(function (configuration, index) { return ({ configuration: configuration, folder: _this.workspace.roots[index] }); })
                    .filter(function (folderConfiguration) { return !!folderConfiguration.configuration; }) // Filter folders which are not impacted by events
                    .map(function (folderConfiguration) { return _this.updateFolderConfiguration(folderConfiguration.folder, folderConfiguration.configuration, true); }) // Update the configuration of impacted folders
                    .reduce(function (result, value) { return result || value; }, false);
            }) // Check if the effective configuration of folder is changed
                .then(function (changed) { return changed ? _this.triggerConfigurationChange() : void 0; }); // Trigger event if changed
        };
        WorkspaceServiceImpl.prototype.resetCaches = function () {
            this.cachedFolderConfigs = new map_1.StrictResourceMap();
            this._configuration = new Configuration(this.baseConfigurationService.configuration(), new configuration_1.ConfigurationModel(), new map_1.StrictResourceMap(), this.workspace);
            this.initCachesForFolders(this.workspace.roots);
        };
        WorkspaceServiceImpl.prototype.initializeWorkspace = function () {
            var _this = this;
            return (this.workspaceConfigPath ? this.initializeMulitFolderWorkspace() : this.initializeSingleFolderWorkspace())
                .then(function () {
                _this._register(_this.baseConfigurationService.onDidUpdateConfiguration(function (e) { return _this.onBaseConfigurationChanged(e); }));
            });
        };
        // TODO@Sandeep use again once we can change workspace without window reload
        // private onWorkspaceChange(configPath: URI): TPromise<void> {
        // 	let workspaceName = this.workspace.name;
        // 	this.workspaceConfigPath = configPath;
        // 	// Reset the workspace if current workspace is single folder
        // 	if (this.hasFolderWorkspace()) {
        // 		this.folderPath = null;
        // 		this.workspace = null;
        // 	}
        // 	// Update workspace configuration path with new path
        // 	else {
        // 		this.workspace.configuration = configPath;
        // 		this.workspace.name = getWorkspaceLabel({ id: this.workspace.id, configPath: this.workspace.configuration.fsPath }, this.environmentService);
        // 	}
        // 	return this.initialize().then(() => {
        // 		if (workspaceName !== this.workspace.name) {
        // 			this._onDidChangeWorkspaceName.fire();
        // 		}
        // 	});
        // }
        WorkspaceServiceImpl.prototype.initializeMulitFolderWorkspace = function () {
            var _this = this;
            this.registerWorkspaceConfigSchema();
            return this.workspaceConfiguration.load(this.workspaceConfigPath)
                .then(function () {
                var workspaceConfigurationModel = _this.workspaceConfiguration.workspaceConfigurationModel;
                if (!workspaceConfigurationModel.folders.length) {
                    return winjs_base_1.TPromise.wrapError(new Error('Invalid workspace configuraton file ' + _this.workspaceConfigPath));
                }
                var workspaceId = _this.workspaceIdentifier.id;
                var workspaceName = workspaces_1.getWorkspaceLabel({ id: workspaceId, configPath: _this.workspaceConfigPath.fsPath }, _this.environmentService);
                _this.workspace = new workspace_1.Workspace(workspaceId, workspaceName, _this.parseWorkspaceFolders(workspaceConfigurationModel.folders), _this.workspaceConfigPath);
                _this.legacyWorkspace = new workspace_1.LegacyWorkspace(_this.workspace.roots[0]);
                _this._register(_this.workspaceConfiguration.onDidUpdateConfiguration(function () { return _this.onWorkspaceConfigurationChanged(); }));
                return null;
            });
        };
        WorkspaceServiceImpl.prototype.parseWorkspaceFolders = function (configuredFolders) {
            var _this = this;
            return configuredFolders.map(function (configuredFolder) {
                if (paths.isAbsolute(configuredFolder)) {
                    return uri_1.default.file(configuredFolder);
                }
                return uri_1.default.file(paths.join(paths.dirname(_this.workspaceConfigPath.fsPath), configuredFolder));
            });
        };
        WorkspaceServiceImpl.prototype.registerWorkspaceConfigSchema = function () {
            var contributionRegistry = platform_2.Registry.as(jsonContributionRegistry_1.Extensions.JSONContribution);
            if (!contributionRegistry.getSchemaContributions().schemas['vscode://schemas/workspaceConfig']) {
                contributionRegistry.registerSchema('vscode://schemas/workspaceConfig', {
                    default: {
                        folders: [
                            {
                                path: ''
                            }
                        ],
                        settings: {}
                    },
                    required: ['folders'],
                    properties: {
                        'folders': {
                            minItems: 1,
                            uniqueItems: true,
                            description: nls.localize('workspaceConfig.folders.description', "List of folders to be loaded in the workspace. Must be a file path. e.g. `/root/folderA` or `./folderA` for a relative path that will be resolved against the location of the workspace file."),
                            items: {
                                type: 'object',
                                default: { path: '' },
                                properties: {
                                    path: {
                                        type: 'string',
                                        description: nls.localize('workspaceConfig.folder.description', "A file path. e.g. `/root/folderA` or `./folderA` for a relative path that will be resolved against the location of the workspace file.")
                                    }
                                }
                            }
                        },
                        'settings': {
                            type: 'object',
                            default: {},
                            description: nls.localize('workspaceConfig.settings.description', "Workspace settings"),
                            $ref: configurationRegistry_1.schemaId
                        }
                    }
                });
            }
        };
        WorkspaceServiceImpl.prototype.initializeSingleFolderWorkspace = function () {
            var _this = this;
            return pfs_1.stat(this.folderPath.fsPath)
                .then(function (workspaceStat) {
                var ctime = platform_1.isLinux ? workspaceStat.ino : workspaceStat.birthtime.getTime(); // On Linux, birthtime is ctime, so we cannot use it! We use the ino instead!
                var id = crypto_1.createHash('md5').update(_this.folderPath.fsPath).update(ctime ? String(ctime) : '').digest('hex');
                var folder = uri_1.default.file(_this.folderPath.fsPath);
                _this.workspace = new workspace_1.Workspace(id, paths.basename(_this.folderPath.fsPath), [folder], null);
                _this.legacyWorkspace = new workspace_1.LegacyWorkspace(folder, ctime);
                return winjs_base_1.TPromise.as(null);
            });
        };
        WorkspaceServiceImpl.prototype.initCachesForFolders = function (folders) {
            for (var _i = 0, folders_1 = folders; _i < folders_1.length; _i++) {
                var folder = folders_1[_i];
                this.cachedFolderConfigs.set(folder, this._register(new FolderConfiguration(folder, this.workspaceSettingsRootFolder, this.hasMultiFolderWorkspace() ? configurationRegistry_1.ConfigurationScope.RESOURCE : configurationRegistry_1.ConfigurationScope.WINDOW)));
                this.updateFolderConfiguration(folder, new configurationModels_1.FolderConfigurationModel(new configurationModels_1.FolderSettingsModel(null), [], configurationRegistry_1.ConfigurationScope.RESOURCE), false);
            }
        };
        WorkspaceServiceImpl.prototype.updateConfiguration = function (folders) {
            var _this = this;
            if (folders === void 0) { folders = this.workspace.roots; }
            return winjs_base_1.TPromise.join(folders.map(function (folder) { return _this.cachedFolderConfigs.get(folder).loadConfiguration()
                .then(function (configuration) { return _this.updateFolderConfiguration(folder, configuration, true); }); }).slice())
                .then(function (changed) { return changed.reduce(function (result, value) { return result || value; }, false); })
                .then(function (changed) { return _this.updateWorkspaceConfiguration(true) || changed; });
        };
        WorkspaceServiceImpl.prototype.onBaseConfigurationChanged = function (_a) {
            var _this = this;
            var source = _a.source, sourceConfig = _a.sourceConfig;
            if (source === configuration_1.ConfigurationSource.Default) {
                this.workspace.roots.forEach(function (folder) { return _this._configuration.getFolderConfigurationModel(folder).update(); });
            }
            if (this._configuration.updateBaseConfiguration(this.baseConfigurationService.configuration())) {
                this._onDidUpdateConfiguration.fire({ source: source, sourceConfig: sourceConfig });
            }
        };
        WorkspaceServiceImpl.prototype.onWorkspaceConfigurationChanged = function () {
            var _this = this;
            var configuredFolders = this.parseWorkspaceFolders(this.workspaceConfiguration.workspaceConfigurationModel.folders);
            var foldersChanged = !arrays_1.equals(this.workspace.roots, configuredFolders, function (r1, r2) { return r1.fsPath === r2.fsPath; });
            if (foldersChanged) {
                this.workspace.roots = configuredFolders;
                this.onFoldersChanged()
                    .then(function (configurationChanged) {
                    _this._onDidChangeWorkspaceRoots.fire();
                    if (configurationChanged) {
                        _this.triggerConfigurationChange();
                    }
                });
            }
            else {
                var configurationChanged = this.updateWorkspaceConfiguration(true);
                if (configurationChanged) {
                    this.triggerConfigurationChange();
                }
            }
        };
        WorkspaceServiceImpl.prototype.onFoldersChanged = function () {
            var _this = this;
            var configurationChangedOnRemoval = false;
            var _loop_1 = function (key) {
                if (!this_1.workspace.roots.filter(function (folder) { return folder.toString() === key.toString(); })[0]) {
                    this_1.cachedFolderConfigs.delete(key);
                    if (this_1._configuration.deleteFolderConfiguration(key)) {
                        configurationChangedOnRemoval = true;
                    }
                }
            };
            var this_1 = this;
            // Remove the configurations of deleted folders
            for (var _i = 0, _a = this.cachedFolderConfigs.keys(); _i < _a.length; _i++) {
                var key = _a[_i];
                _loop_1(key);
            }
            // Initialize the newly added folders
            var toInitialize = this.workspace.roots.filter(function (folder) { return !_this.cachedFolderConfigs.has(folder); });
            if (toInitialize.length) {
                this.initCachesForFolders(toInitialize);
                return this.updateConfiguration(toInitialize)
                    .then(function (changed) { return configurationChangedOnRemoval || changed; });
            }
            else if (configurationChangedOnRemoval) {
                this.updateWorkspaceConfiguration(false);
                return winjs_base_1.TPromise.as(true);
            }
            return winjs_base_1.TPromise.as(false);
        };
        WorkspaceServiceImpl.prototype.updateFolderConfiguration = function (folder, folderConfiguration, compare) {
            var configurationChanged = this._configuration.updateFolderConfiguration(folder, folderConfiguration, compare);
            if (this.hasFolderWorkspace()) {
                // Workspace configuration changed
                configurationChanged = this.updateWorkspaceConfiguration(compare) || configurationChanged;
            }
            return configurationChanged;
        };
        WorkspaceServiceImpl.prototype.updateWorkspaceConfiguration = function (compare) {
            var workspaceConfiguration = this.hasMultiFolderWorkspace() ? this.workspaceConfiguration.workspaceConfigurationModel.workspaceConfiguration : this._configuration.getFolderConfigurationModel(this.workspace.roots[0]);
            return this._configuration.updateWorkspaceConfiguration(workspaceConfiguration, compare);
        };
        WorkspaceServiceImpl.prototype.triggerConfigurationChange = function () {
            this._onDidUpdateConfiguration.fire({ source: configuration_1.ConfigurationSource.Workspace, sourceConfig: this._configuration.getFolderConfigurationModel(this.workspace.roots[0]).contents });
        };
        return WorkspaceServiceImpl;
    }(WorkspaceService));
    exports.WorkspaceServiceImpl = WorkspaceServiceImpl;
    var WorkspaceConfiguration = (function (_super) {
        __extends(WorkspaceConfiguration, _super);
        function WorkspaceConfiguration() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._workspaceConfigurationWatcherDisposables = [];
            _this._onDidUpdateConfiguration = _this._register(new event_1.Emitter());
            _this.onDidUpdateConfiguration = _this._onDidUpdateConfiguration.event;
            return _this;
        }
        WorkspaceConfiguration.prototype.load = function (workspaceConfigPath) {
            var _this = this;
            if (this._workspaceConfigPath && this._workspaceConfigPath.fsPath === workspaceConfigPath.fsPath) {
                return this._reload();
            }
            this._workspaceConfigPath = workspaceConfigPath;
            this._workspaceConfigurationWatcherDisposables = lifecycle_1.dispose(this._workspaceConfigurationWatcherDisposables);
            return new winjs_base_1.TPromise(function (c, e) {
                _this._workspaceConfigurationWatcher = new config_1.ConfigWatcher(_this._workspaceConfigPath.fsPath, {
                    changeBufferDelay: 300, onError: function (error) { return errors.onUnexpectedError(error); }, defaultConfig: new configurationModels_1.WorkspaceConfigurationModel(null, _this._workspaceConfigPath.fsPath), parse: function (content, parseErrors) {
                        var workspaceConfigurationModel = new configurationModels_1.WorkspaceConfigurationModel(content, _this._workspaceConfigPath.fsPath);
                        parseErrors = workspaceConfigurationModel.errors.slice();
                        return workspaceConfigurationModel;
                    }, initCallback: function () { return c(null); }
                });
                _this._workspaceConfigurationWatcherDisposables.push(lifecycle_1.toDisposable(function () { return _this._workspaceConfigurationWatcher.dispose(); }));
                _this._workspaceConfigurationWatcher.onDidUpdateConfiguration(function () { return _this._onDidUpdateConfiguration.fire(); }, _this, _this._workspaceConfigurationWatcherDisposables);
            });
        };
        Object.defineProperty(WorkspaceConfiguration.prototype, "workspaceConfigurationModel", {
            get: function () {
                return this._workspaceConfigurationWatcher ? this._workspaceConfigurationWatcher.getConfig() : new configurationModels_1.WorkspaceConfigurationModel();
            },
            enumerable: true,
            configurable: true
        });
        WorkspaceConfiguration.prototype._reload = function () {
            var _this = this;
            return new winjs_base_1.TPromise(function (c) { return _this._workspaceConfigurationWatcher.reload(function () { return c(null); }); });
        };
        WorkspaceConfiguration.prototype.dispose = function () {
            lifecycle_1.dispose(this._workspaceConfigurationWatcherDisposables);
            _super.prototype.dispose.call(this);
        };
        return WorkspaceConfiguration;
    }(lifecycle_1.Disposable));
    var FolderConfiguration = (function (_super) {
        __extends(FolderConfiguration, _super);
        function FolderConfiguration(folder, configFolderRelativePath, scope) {
            var _this = _super.call(this) || this;
            _this.folder = folder;
            _this.configFolderRelativePath = configFolderRelativePath;
            _this.scope = scope;
            _this.reloadConfigurationEventEmitter = new event_1.Emitter();
            _this.workspaceFilePathToConfiguration = Object.create(null);
            _this.reloadConfigurationScheduler = _this._register(new async_1.RunOnceScheduler(function () { return _this.loadConfiguration().then(function (configuration) { return _this.reloadConfigurationEventEmitter.fire(configuration); }, errors.onUnexpectedError); }, FolderConfiguration.RELOAD_CONFIGURATION_DELAY));
            return _this;
        }
        FolderConfiguration.prototype.loadConfiguration = function () {
            var _this = this;
            // Load workspace locals
            return this.loadWorkspaceConfigFiles().then(function (workspaceConfigFiles) {
                // Consolidate (support *.json files in the workspace settings folder)
                var workspaceSettingsConfig = workspaceConfigFiles[configuration_2.WORKSPACE_CONFIG_DEFAULT_PATH] || new configurationModels_1.FolderSettingsModel(null);
                var otherConfigModels = Object.keys(workspaceConfigFiles).filter(function (key) { return key !== configuration_2.WORKSPACE_CONFIG_DEFAULT_PATH; }).map(function (key) { return workspaceConfigFiles[key]; });
                return new configurationModels_1.FolderConfigurationModel(workspaceSettingsConfig, otherConfigModels, _this.scope);
            });
        };
        FolderConfiguration.prototype.loadWorkspaceConfigFiles = function () {
            var _this = this;
            // once: when invoked for the first time we fetch json files that contribute settings
            if (!this.bulkFetchFromWorkspacePromise) {
                this.bulkFetchFromWorkspacePromise = resolveStat(this.toResource(this.configFolderRelativePath)).then(function (stat) {
                    if (!stat.isDirectory) {
                        return winjs_base_1.TPromise.as([]);
                    }
                    return resolveContents(stat.children.filter(function (stat) {
                        var isJson = paths.extname(stat.resource.fsPath) === '.json';
                        if (!isJson) {
                            return false; // only JSON files
                        }
                        return _this.isWorkspaceConfigurationFile(_this.toFolderRelativePath(stat.resource)); // only workspace config files
                    }).map(function (stat) { return stat.resource; }));
                }, function (err) { return []; } /* never fail this call */)
                    .then(function (contents) {
                    contents.forEach(function (content) { return _this.workspaceFilePathToConfiguration[_this.toFolderRelativePath(content.resource)] = winjs_base_1.TPromise.as(_this.createConfigModel(content)); });
                }, errors.onUnexpectedError);
            }
            // on change: join on *all* configuration file promises so that we can merge them into a single configuration object. this
            // happens whenever a config file changes, is deleted, or added
            return this.bulkFetchFromWorkspacePromise.then(function () { return winjs_base_1.TPromise.join(_this.workspaceFilePathToConfiguration); });
        };
        FolderConfiguration.prototype.handleWorkspaceFileEvents = function (event) {
            var _this = this;
            var events = event.changes;
            var affectedByChanges = false;
            // Find changes that affect workspace configuration files
            for (var i = 0, len = events.length; i < len; i++) {
                var resource = events[i].resource;
                var isJson = paths.extname(resource.fsPath) === '.json';
                var isDeletedSettingsFolder = (events[i].type === files_1.FileChangeType.DELETED && paths.isEqual(paths.basename(resource.fsPath), this.configFolderRelativePath));
                if (!isJson && !isDeletedSettingsFolder) {
                    continue; // only JSON files or the actual settings folder
                }
                var workspacePath = this.toFolderRelativePath(resource);
                if (!workspacePath) {
                    continue; // event is not inside workspace
                }
                // Handle case where ".vscode" got deleted
                if (workspacePath === this.configFolderRelativePath && events[i].type === files_1.FileChangeType.DELETED) {
                    this.workspaceFilePathToConfiguration = Object.create(null);
                    affectedByChanges = true;
                }
                // only valid workspace config files
                if (!this.isWorkspaceConfigurationFile(workspacePath)) {
                    continue;
                }
                // insert 'fetch-promises' for add and update events and
                // remove promises for delete events
                switch (events[i].type) {
                    case files_1.FileChangeType.DELETED:
                        affectedByChanges = collections.remove(this.workspaceFilePathToConfiguration, workspacePath);
                        break;
                    case files_1.FileChangeType.UPDATED:
                    case files_1.FileChangeType.ADDED:
                        this.workspaceFilePathToConfiguration[workspacePath] = resolveContent(resource).then(function (content) { return _this.createConfigModel(content); }, errors.onUnexpectedError);
                        affectedByChanges = true;
                }
            }
            if (!affectedByChanges) {
                return winjs_base_1.TPromise.as(null);
            }
            return new winjs_base_1.TPromise(function (c, e) {
                var disposable = _this.reloadConfigurationEventEmitter.event(function (configuration) {
                    disposable.dispose();
                    c(configuration);
                });
                // trigger reload of the configuration if we are affected by changes
                if (!_this.reloadConfigurationScheduler.isScheduled()) {
                    _this.reloadConfigurationScheduler.schedule();
                }
            });
        };
        FolderConfiguration.prototype.createConfigModel = function (content) {
            var path = this.toFolderRelativePath(content.resource);
            if (path === configuration_2.WORKSPACE_CONFIG_DEFAULT_PATH) {
                return new configurationModels_1.FolderSettingsModel(content.value, content.resource.toString());
            }
            else {
                var matches = /\/([^\.]*)*\.json/.exec(path);
                if (matches && matches[1]) {
                    return new configurationModels_1.ScopedConfigurationModel(content.value, content.resource.toString(), matches[1]);
                }
            }
            return new model_1.CustomConfigurationModel(null);
        };
        FolderConfiguration.prototype.isWorkspaceConfigurationFile = function (folderRelativePath) {
            return [configuration_2.WORKSPACE_CONFIG_DEFAULT_PATH, configuration_2.WORKSPACE_STANDALONE_CONFIGURATIONS.launch, configuration_2.WORKSPACE_STANDALONE_CONFIGURATIONS.tasks].some(function (p) { return p === folderRelativePath; });
        };
        FolderConfiguration.prototype.toResource = function (folderRelativePath) {
            if (typeof folderRelativePath === 'string') {
                return uri_1.default.file(paths.join(this.folder.fsPath, folderRelativePath));
            }
            return null;
        };
        FolderConfiguration.prototype.toFolderRelativePath = function (resource, toOSPath) {
            if (this.contains(resource)) {
                return paths.normalize(paths.relative(this.folder.fsPath, resource.fsPath), toOSPath);
            }
            return null;
        };
        FolderConfiguration.prototype.contains = function (resource) {
            if (resource) {
                return paths.isEqualOrParent(resource.fsPath, this.folder.fsPath, !platform_1.isLinux /* ignorecase */);
            }
            return false;
        };
        FolderConfiguration.RELOAD_CONFIGURATION_DELAY = 50;
        return FolderConfiguration;
    }(lifecycle_1.Disposable));
    // node.hs helper functions
    function resolveContents(resources) {
        var contents = [];
        return winjs_base_1.TPromise.join(resources.map(function (resource) {
            return resolveContent(resource).then(function (content) {
                contents.push(content);
            });
        })).then(function () { return contents; });
    }
    function resolveContent(resource) {
        return pfs_1.readFile(resource.fsPath).then(function (contents) { return ({ resource: resource, value: contents.toString() }); });
    }
    function resolveStat(resource) {
        return new winjs_base_1.TPromise(function (c, e) {
            extfs.readdir(resource.fsPath, function (error, children) {
                if (error) {
                    if (error.code === 'ENOTDIR') {
                        c({ resource: resource });
                    }
                    else {
                        e(error);
                    }
                }
                else {
                    c({
                        resource: resource,
                        isDirectory: true,
                        children: children.map(function (child) { return { resource: uri_1.default.file(paths.join(resource.fsPath, child)) }; })
                    });
                }
            });
        });
    }
    var Configuration = (function (_super) {
        __extends(Configuration, _super);
        function Configuration(_baseConfiguration, workspaceConfiguration, folders, workspace) {
            var _this = _super.call(this, _baseConfiguration.defaults, _baseConfiguration.user, workspaceConfiguration, folders, workspace) || this;
            _this._baseConfiguration = _baseConfiguration;
            _this.folders = folders;
            return _this;
        }
        Configuration.prototype.updateBaseConfiguration = function (baseConfiguration) {
            var current = new Configuration(this._baseConfiguration, this._workspaceConfiguration, this.folders, this._workspace);
            this._baseConfiguration = baseConfiguration;
            this._defaults = this._baseConfiguration.defaults;
            this._user = this._baseConfiguration.user;
            this.merge();
            return !this.equals(current);
        };
        Configuration.prototype.updateWorkspaceConfiguration = function (workspaceConfiguration, compare) {
            if (compare === void 0) { compare = true; }
            var current = new Configuration(this._baseConfiguration, this._workspaceConfiguration, this.folders, this._workspace);
            this._workspaceConfiguration = workspaceConfiguration;
            this.merge();
            return compare && !this.equals(current);
        };
        Configuration.prototype.updateFolderConfiguration = function (resource, configuration, compare) {
            var current = this.getValue(null, { resource: resource });
            this.folders.set(resource, configuration);
            this.mergeFolder(resource);
            return compare && !objects.equals(current, this.getValue(null, { resource: resource }));
        };
        Configuration.prototype.deleteFolderConfiguration = function (folder) {
            if (this._workspace && this._workspace.roots.length > 0 && this._workspace.roots[0].fsPath === folder.fsPath) {
                // Do not remove workspace configuration
                return false;
            }
            var changed = this.folders.get(folder).keys.length > 0;
            this.folders.delete(folder);
            this._foldersConsolidatedConfigurations.delete(folder);
            return changed;
        };
        Configuration.prototype.getFolderConfigurationModel = function (folder) {
            return this.folders.get(folder);
        };
        Configuration.prototype.equals = function (other) {
            if (!other || !(other instanceof Configuration)) {
                return false;
            }
            if (!objects.equals(this.getValue(), other.getValue())) {
                return false;
            }
            if (this._foldersConsolidatedConfigurations.size !== other._foldersConsolidatedConfigurations.size) {
                return false;
            }
            for (var _i = 0, _a = this._foldersConsolidatedConfigurations.keys(); _i < _a.length; _i++) {
                var resource = _a[_i];
                if (!objects.equals(this.getValue(null, { resource: resource }), other.getValue(null, { resource: resource }))) {
                    return false;
                }
            }
            return true;
        };
        return Configuration;
    }(configuration_1.Configuration));
    exports.Configuration = Configuration;
});
//# sourceMappingURL=configuration.js.map