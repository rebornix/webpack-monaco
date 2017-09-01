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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/common/network", "vs/base/common/winjs.base", "vs/nls", "vs/base/common/uri", "vs/base/common/paths", "vs/base/common/map", "vs/base/common/labels", "vs/base/common/strings", "vs/base/common/lifecycle", "vs/base/common/event", "vs/workbench/services/editor/common/editorService", "vs/platform/workspace/common/workspace", "vs/workbench/services/configuration/common/configuration", "vs/platform/editor/common/editor", "vs/workbench/services/group/common/groupService", "vs/platform/storage/common/storage", "vs/platform/files/common/files", "vs/platform/message/common/message", "vs/platform/extensions/common/extensions", "vs/platform/instantiation/common/instantiation", "vs/platform/environment/common/environment", "vs/workbench/services/configuration/common/configurationEditing", "vs/workbench/parts/preferences/common/preferences", "vs/workbench/parts/preferences/common/preferencesModels", "vs/platform/telemetry/common/telemetry", "vs/workbench/parts/preferences/browser/preferencesEditor", "vs/workbench/parts/preferences/browser/keybindingsEditor", "vs/editor/common/services/resolverService", "vs/editor/common/services/codeEditorService", "vs/editor/common/core/editOperation", "vs/editor/common/core/position", "vs/platform/keybinding/common/keybinding", "vs/editor/common/services/modelService", "vs/workbench/services/configuration/common/jsonEditing", "vs/platform/configuration/common/configurationRegistry", "vs/css!./media/preferences"], function (require, exports, network, winjs_base_1, nls, uri_1, paths, map_1, labels, strings, lifecycle_1, event_1, editorService_1, workspace_1, configuration_1, editor_1, groupService_1, storage_1, files_1, message_1, extensions_1, instantiation_1, environment_1, configurationEditing_1, preferences_1, preferencesModels_1, telemetry_1, preferencesEditor_1, keybindingsEditor_1, resolverService_1, codeEditorService_1, editOperation_1, position_1, keybinding_1, modelService_1, jsonEditing_1, configurationRegistry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var emptyEditableSettingsContent = '{\n}';
    var PreferencesService = (function (_super) {
        __extends(PreferencesService, _super);
        function PreferencesService(editorService, editorGroupService, fileService, configurationService, messageService, choiceService, contextService, instantiationService, storageService, environmentService, telemetryService, textModelResolverService, configurationEditingService, extensionService, keybindingService, modelService, jsonEditingService) {
            var _this = _super.call(this) || this;
            _this.editorService = editorService;
            _this.editorGroupService = editorGroupService;
            _this.fileService = fileService;
            _this.configurationService = configurationService;
            _this.messageService = messageService;
            _this.choiceService = choiceService;
            _this.contextService = contextService;
            _this.instantiationService = instantiationService;
            _this.storageService = storageService;
            _this.environmentService = environmentService;
            _this.telemetryService = telemetryService;
            _this.textModelResolverService = textModelResolverService;
            _this.configurationEditingService = configurationEditingService;
            _this.extensionService = extensionService;
            _this.modelService = modelService;
            _this.jsonEditingService = jsonEditingService;
            _this.lastOpenedSettingsInput = null;
            _this._onDispose = new event_1.Emitter();
            _this.defaultSettingsResource = uri_1.default.from({ scheme: network.Schemas.vscode, authority: 'defaultsettings', path: '/settings.json' });
            _this.defaultResourceSettingsResource = uri_1.default.from({ scheme: network.Schemas.vscode, authority: 'defaultsettings', path: '/resourceSettings.json' });
            _this.defaultKeybindingsResource = uri_1.default.from({ scheme: network.Schemas.vscode, authority: 'defaultsettings', path: '/keybindings.json' });
            _this.workspaceConfigSettingsResource = uri_1.default.from({ scheme: network.Schemas.vscode, authority: 'settings', path: '/workspaceSettings.json' });
            _this.defaultPreferencesEditorModels = new map_1.ResourceMap();
            _this.editorGroupService.onEditorsChanged(function () {
                var activeEditorInput = _this.editorService.getActiveEditorInput();
                if (activeEditorInput instanceof preferencesEditor_1.PreferencesEditorInput) {
                    _this.lastOpenedSettingsInput = activeEditorInput;
                }
            });
            // The default keybindings.json updates based on keyboard layouts, so here we make sure
            // if a model has been given out we update it accordingly.
            keybindingService.onDidUpdateKeybindings(function () {
                var model = modelService.getModel(_this.defaultKeybindingsResource);
                if (!model) {
                    // model has not been given out => nothing to do
                    return;
                }
                modelService.updateModel(model, preferencesModels_1.defaultKeybindingsContents(keybindingService));
            });
            return _this;
        }
        Object.defineProperty(PreferencesService.prototype, "userSettingsResource", {
            get: function () {
                return this.getEditableSettingsURI(configurationEditing_1.ConfigurationTarget.USER);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PreferencesService.prototype, "workspaceSettingsResource", {
            get: function () {
                return this.getEditableSettingsURI(configurationEditing_1.ConfigurationTarget.WORKSPACE);
            },
            enumerable: true,
            configurable: true
        });
        PreferencesService.prototype.getFolderSettingsResource = function (resource) {
            return this.getEditableSettingsURI(configurationEditing_1.ConfigurationTarget.FOLDER, resource);
        };
        PreferencesService.prototype.resolveContent = function (uri) {
            var workspaceSettingsUri = this.getEditableSettingsURI(configurationEditing_1.ConfigurationTarget.WORKSPACE);
            if (workspaceSettingsUri && workspaceSettingsUri.fsPath === uri.fsPath) {
                return this.resolveSettingsContentFromWorkspaceConfiguration();
            }
            return this.createPreferencesEditorModel(uri)
                .then(function (preferencesEditorModel) { return preferencesEditorModel ? preferencesEditorModel.content : null; });
        };
        PreferencesService.prototype.createPreferencesEditorModel = function (uri) {
            var _this = this;
            var promise = this.defaultPreferencesEditorModels.get(uri);
            if (promise) {
                return promise;
            }
            if (this.defaultSettingsResource.fsPath === uri.fsPath) {
                promise = winjs_base_1.TPromise.join([this.extensionService.onReady(), this.fetchMostCommonlyUsedSettings()])
                    .then(function (result) {
                    var mostCommonSettings = result[1];
                    var model = _this.instantiationService.createInstance(preferencesModels_1.DefaultSettingsEditorModel, uri, mostCommonSettings, configurationRegistry_1.ConfigurationScope.WINDOW);
                    return model;
                });
                this.defaultPreferencesEditorModels.set(uri, promise);
                return promise;
            }
            if (this.defaultResourceSettingsResource.fsPath === uri.fsPath) {
                promise = winjs_base_1.TPromise.join([this.extensionService.onReady(), this.fetchMostCommonlyUsedSettings()])
                    .then(function (result) {
                    var mostCommonSettings = result[1];
                    var model = _this.instantiationService.createInstance(preferencesModels_1.DefaultSettingsEditorModel, uri, mostCommonSettings, configurationRegistry_1.ConfigurationScope.RESOURCE);
                    return model;
                });
                this.defaultPreferencesEditorModels.set(uri, promise);
                return promise;
            }
            if (this.defaultKeybindingsResource.fsPath === uri.fsPath) {
                var model = this.instantiationService.createInstance(preferencesModels_1.DefaultKeybindingsEditorModel, uri);
                promise = winjs_base_1.TPromise.wrap(model);
                this.defaultPreferencesEditorModels.set(uri, promise);
                return promise;
            }
            if (this.workspaceConfigSettingsResource.fsPath === uri.fsPath) {
                promise = this.createEditableSettingsEditorModel(configurationEditing_1.ConfigurationTarget.WORKSPACE, uri);
                this.defaultPreferencesEditorModels.set(uri, promise);
                return promise;
            }
            if (this.getEditableSettingsURI(configurationEditing_1.ConfigurationTarget.USER).fsPath === uri.fsPath) {
                return this.createEditableSettingsEditorModel(configurationEditing_1.ConfigurationTarget.USER, uri);
            }
            var workspaceSettingsUri = this.getEditableSettingsURI(configurationEditing_1.ConfigurationTarget.WORKSPACE);
            if (workspaceSettingsUri && workspaceSettingsUri.fsPath === uri.fsPath) {
                return this.createEditableSettingsEditorModel(configurationEditing_1.ConfigurationTarget.WORKSPACE, workspaceSettingsUri);
            }
            if (this.contextService.hasMultiFolderWorkspace()) {
                return this.createEditableSettingsEditorModel(configurationEditing_1.ConfigurationTarget.FOLDER, uri);
            }
            return winjs_base_1.TPromise.wrap(null);
        };
        PreferencesService.prototype.openGlobalSettings = function () {
            return this.doOpenSettings(configurationEditing_1.ConfigurationTarget.USER, this.userSettingsResource);
        };
        PreferencesService.prototype.openWorkspaceSettings = function () {
            if (!this.contextService.hasWorkspace()) {
                this.messageService.show(message_1.Severity.Info, nls.localize('openFolderFirst', "Open a folder first to create workspace settings"));
                return winjs_base_1.TPromise.as(null);
            }
            return this.doOpenSettings(configurationEditing_1.ConfigurationTarget.WORKSPACE, this.workspaceSettingsResource);
        };
        PreferencesService.prototype.openFolderSettings = function (folder) {
            return this.doOpenSettings(configurationEditing_1.ConfigurationTarget.FOLDER, this.getEditableSettingsURI(configurationEditing_1.ConfigurationTarget.FOLDER, folder));
        };
        PreferencesService.prototype.switchSettings = function (target, resource) {
            var _this = this;
            var activeEditor = this.editorService.getActiveEditor();
            var activeEditorInput = activeEditor.input;
            if (activeEditorInput instanceof preferencesEditor_1.PreferencesEditorInput) {
                return this.getOrCreateEditableSettingsEditorInput(target, this.getEditableSettingsURI(target, resource))
                    .then(function (toInput) {
                    var replaceWith = new preferencesEditor_1.PreferencesEditorInput(_this.getPreferencesEditorInputName(target, resource), toInput.getDescription(), _this.instantiationService.createInstance(preferencesEditor_1.DefaultPreferencesEditorInput, _this.getDefaultSettingsResource(target)), toInput);
                    return _this.editorService.replaceEditors([{
                            toReplace: _this.lastOpenedSettingsInput,
                            replaceWith: replaceWith
                        }], activeEditor.position).then(function () {
                        _this.lastOpenedSettingsInput = replaceWith;
                    });
                });
            }
            else {
                this.doOpenSettings(target, resource);
                return undefined;
            }
        };
        PreferencesService.prototype.openGlobalKeybindingSettings = function (textual) {
            var _this = this;
            this.telemetryService.publicLog('openKeybindings', { textual: textual });
            if (textual) {
                var emptyContents = '// ' + nls.localize('emptyKeybindingsHeader', "Place your key bindings in this file to overwrite the defaults") + '\n[\n]';
                var editableKeybindings_1 = uri_1.default.file(this.environmentService.appKeybindingsPath);
                // Create as needed and open in editor
                return this.createIfNotExists(editableKeybindings_1, emptyContents).then(function () {
                    return _this.editorService.openEditors([
                        { input: { resource: _this.defaultKeybindingsResource, options: { pinned: true }, label: nls.localize('defaultKeybindings', "Default Keybindings"), description: '' }, position: editor_1.Position.ONE },
                        { input: { resource: editableKeybindings_1, options: { pinned: true } }, position: editor_1.Position.TWO },
                    ]).then(function () {
                        _this.editorGroupService.focusGroup(editor_1.Position.TWO);
                    });
                });
            }
            return this.editorService.openEditor(this.instantiationService.createInstance(keybindingsEditor_1.KeybindingsEditorInput), { pinned: true }).then(function () { return null; });
        };
        PreferencesService.prototype.configureSettingsForLanguage = function (language) {
            var _this = this;
            this.openGlobalSettings()
                .then(function (editor) {
                var codeEditor = codeEditorService_1.getCodeEditor(editor);
                _this.getPosition(language, codeEditor)
                    .then(function (position) {
                    codeEditor.setPosition(position);
                    codeEditor.focus();
                });
            });
        };
        PreferencesService.prototype.doOpenSettings = function (configurationTarget, resource) {
            var _this = this;
            var openDefaultSettings = !!this.configurationService.getConfiguration().workbench.settings.openDefaultSettings;
            return this.getOrCreateEditableSettingsEditorInput(configurationTarget, resource)
                .then(function (editableSettingsEditorInput) {
                if (openDefaultSettings) {
                    var defaultPreferencesEditorInput = _this.instantiationService.createInstance(preferencesEditor_1.DefaultPreferencesEditorInput, _this.getDefaultSettingsResource(configurationTarget));
                    var preferencesEditorInput = new preferencesEditor_1.PreferencesEditorInput(_this.getPreferencesEditorInputName(configurationTarget, resource), editableSettingsEditorInput.getDescription(), defaultPreferencesEditorInput, editableSettingsEditorInput);
                    _this.lastOpenedSettingsInput = preferencesEditorInput;
                    return _this.editorService.openEditor(preferencesEditorInput, { pinned: true });
                }
                return _this.editorService.openEditor(editableSettingsEditorInput, { pinned: true });
            });
        };
        PreferencesService.prototype.getDefaultSettingsResource = function (configurationTarget) {
            if (configurationTarget === configurationEditing_1.ConfigurationTarget.FOLDER) {
                return this.defaultResourceSettingsResource;
            }
            return this.defaultSettingsResource;
        };
        PreferencesService.prototype.getPreferencesEditorInputName = function (target, resource) {
            var name = preferences_1.getSettingsTargetName(target, resource, this.contextService);
            return target === configurationEditing_1.ConfigurationTarget.FOLDER ? nls.localize('folderSettingsName', "{0} (Folder Settings)", name) : name;
        };
        PreferencesService.prototype.getOrCreateEditableSettingsEditorInput = function (target, resource) {
            var _this = this;
            return this.createSettingsIfNotExists(target, resource)
                .then(function () { return _this.editorService.createInput({ resource: resource }); });
        };
        PreferencesService.prototype.createEditableSettingsEditorModel = function (configurationTarget, resource) {
            var _this = this;
            var settingsUri = this.getEditableSettingsURI(configurationTarget, resource);
            if (settingsUri) {
                if (settingsUri.fsPath === this.workspaceConfigSettingsResource.fsPath) {
                    return winjs_base_1.TPromise.join([this.textModelResolverService.createModelReference(settingsUri), this.textModelResolverService.createModelReference(this.contextService.getWorkspace().configuration)])
                        .then(function (_a) {
                        var reference = _a[0], workspaceConfigReference = _a[1];
                        return _this.instantiationService.createInstance(preferencesModels_1.WorkspaceConfigModel, reference, workspaceConfigReference, configurationTarget, _this._onDispose.event);
                    });
                }
                return this.textModelResolverService.createModelReference(settingsUri)
                    .then(function (reference) { return _this.instantiationService.createInstance(preferencesModels_1.SettingsEditorModel, reference, configurationTarget); });
            }
            return winjs_base_1.TPromise.wrap(null);
        };
        PreferencesService.prototype.resolveSettingsContentFromWorkspaceConfiguration = function () {
            if (this.contextService.hasMultiFolderWorkspace()) {
                return this.textModelResolverService.createModelReference(this.contextService.getWorkspace().configuration)
                    .then(function (reference) {
                    var model = reference.object.textEditorModel;
                    var settingsContent = preferencesModels_1.WorkspaceConfigModel.getSettingsContentFromConfigContent(model.getValue());
                    reference.dispose();
                    return winjs_base_1.TPromise.as(settingsContent ? settingsContent : emptyEditableSettingsContent);
                });
            }
            return winjs_base_1.TPromise.as(null);
        };
        PreferencesService.prototype.getEditableSettingsURI = function (configurationTarget, resource) {
            switch (configurationTarget) {
                case configurationEditing_1.ConfigurationTarget.USER:
                    return uri_1.default.file(this.environmentService.appSettingsPath);
                case configurationEditing_1.ConfigurationTarget.WORKSPACE:
                    var workspace = this.contextService.getWorkspace();
                    if (this.contextService.hasFolderWorkspace()) {
                        return this.toResource(paths.join('.vscode', 'settings.json'), workspace.roots[0]);
                    }
                    if (this.contextService.hasMultiFolderWorkspace()) {
                        return workspace.configuration;
                    }
                    return null;
                case configurationEditing_1.ConfigurationTarget.FOLDER:
                    var root = this.contextService.getRoot(resource);
                    return root ? this.toResource(paths.join('.vscode', 'settings.json'), root) : null;
            }
            return null;
        };
        PreferencesService.prototype.toResource = function (relativePath, root) {
            return uri_1.default.file(paths.join(root.fsPath, relativePath));
        };
        PreferencesService.prototype.createSettingsIfNotExists = function (target, resource) {
            if (this.contextService.hasMultiFolderWorkspace() && target === configurationEditing_1.ConfigurationTarget.WORKSPACE) {
                if (!this.configurationService.keys().workspace.length) {
                    return this.jsonEditingService.write(resource, { key: 'settings', value: {} }, true).then(null, function () { });
                }
            }
            return this.createIfNotExists(resource, emptyEditableSettingsContent).then(function () { });
        };
        PreferencesService.prototype.createIfNotExists = function (resource, contents) {
            var _this = this;
            return this.fileService.resolveContent(resource, { acceptTextOnly: true }).then(null, function (error) {
                if (error.fileOperationResult === files_1.FileOperationResult.FILE_NOT_FOUND) {
                    return _this.fileService.updateContent(resource, contents).then(null, function (error) {
                        return winjs_base_1.TPromise.wrapError(new Error(nls.localize('fail.createSettings', "Unable to create '{0}' ({1}).", labels.getPathLabel(resource, _this.contextService, _this.environmentService), error)));
                    });
                }
                return winjs_base_1.TPromise.wrapError(error);
            });
        };
        PreferencesService.prototype.fetchMostCommonlyUsedSettings = function () {
            return winjs_base_1.TPromise.wrap([
                'files.autoSave',
                'editor.fontSize',
                'editor.fontFamily',
                'editor.tabSize',
                'editor.renderWhitespace',
                'editor.cursorStyle',
                'editor.multiCursorModifier',
                'editor.insertSpaces',
                'editor.wordWrap',
                'files.exclude',
                'files.associations'
            ]);
        };
        PreferencesService.prototype.getPosition = function (language, codeEditor) {
            var _this = this;
            return this.createPreferencesEditorModel(this.userSettingsResource)
                .then(function (settingsModel) {
                var languageKey = "[" + language + "]";
                var setting = settingsModel.getPreference(languageKey);
                var model = codeEditor.getModel();
                var configuration = _this.configurationService.getConfiguration('editor');
                var eol = _this.configurationService.getConfiguration('files').eol;
                if (setting) {
                    if (setting.overrides.length) {
                        var lastSetting = setting.overrides[setting.overrides.length - 1];
                        var content = void 0;
                        if (lastSetting.valueRange.endLineNumber === setting.range.endLineNumber) {
                            content = ',' + eol + _this.spaces(2, configuration) + eol + _this.spaces(1, configuration);
                        }
                        else {
                            content = ',' + eol + _this.spaces(2, configuration);
                        }
                        var editOperation = editOperation_1.EditOperation.insert(new position_1.Position(lastSetting.valueRange.endLineNumber, lastSetting.valueRange.endColumn), content);
                        model.pushEditOperations([], [editOperation], function () { return []; });
                        return { lineNumber: lastSetting.valueRange.endLineNumber + 1, column: model.getLineMaxColumn(lastSetting.valueRange.endLineNumber + 1) };
                    }
                    return { lineNumber: setting.valueRange.startLineNumber, column: setting.valueRange.startColumn + 1 };
                }
                return _this.configurationEditingService.writeConfiguration(configurationEditing_1.ConfigurationTarget.USER, { key: languageKey, value: {} }, { donotSave: true })
                    .then(function () {
                    setting = settingsModel.getPreference(languageKey);
                    var content = eol + _this.spaces(2, configuration) + eol + _this.spaces(1, configuration);
                    var editOperation = editOperation_1.EditOperation.insert(new position_1.Position(setting.valueRange.endLineNumber, setting.valueRange.endColumn - 1), content);
                    model.pushEditOperations([], [editOperation], function () { return []; });
                    var lineNumber = setting.valueRange.endLineNumber + 1;
                    settingsModel.dispose();
                    return { lineNumber: lineNumber, column: model.getLineMaxColumn(lineNumber) };
                });
            });
        };
        PreferencesService.prototype.spaces = function (count, _a) {
            var tabSize = _a.tabSize, insertSpaces = _a.insertSpaces;
            return insertSpaces ? strings.repeat(' ', tabSize * count) : strings.repeat('\t', count);
        };
        PreferencesService.prototype.dispose = function () {
            this._onDispose.fire();
            this.defaultPreferencesEditorModels.clear();
            _super.prototype.dispose.call(this);
        };
        PreferencesService = __decorate([
            __param(0, editorService_1.IWorkbenchEditorService),
            __param(1, groupService_1.IEditorGroupService),
            __param(2, files_1.IFileService),
            __param(3, configuration_1.IWorkspaceConfigurationService),
            __param(4, message_1.IMessageService),
            __param(5, message_1.IChoiceService),
            __param(6, workspace_1.IWorkspaceContextService),
            __param(7, instantiation_1.IInstantiationService),
            __param(8, storage_1.IStorageService),
            __param(9, environment_1.IEnvironmentService),
            __param(10, telemetry_1.ITelemetryService),
            __param(11, resolverService_1.ITextModelService),
            __param(12, configurationEditing_1.IConfigurationEditingService),
            __param(13, extensions_1.IExtensionService),
            __param(14, keybinding_1.IKeybindingService),
            __param(15, modelService_1.IModelService),
            __param(16, jsonEditing_1.IJSONEditingService)
        ], PreferencesService);
        return PreferencesService;
    }(lifecycle_1.Disposable));
    exports.PreferencesService = PreferencesService;
});
//# sourceMappingURL=preferencesService.js.map