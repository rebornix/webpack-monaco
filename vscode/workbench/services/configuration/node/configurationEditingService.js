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
define(["require", "exports", "vs/nls", "vs/base/common/winjs.base", "vs/base/common/paths", "vs/base/common/uri", "vs/base/common/json", "vs/base/node/encoding", "vs/base/common/strings", "vs/base/common/jsonEdit", "vs/base/common/async", "vs/editor/common/core/editOperation", "vs/platform/registry/common/platform", "vs/editor/common/core/range", "vs/editor/common/core/selection", "vs/platform/workspace/common/workspace", "vs/platform/environment/common/environment", "vs/workbench/services/textfile/common/textfiles", "vs/platform/configuration/common/configuration", "vs/platform/configuration/common/model", "vs/workbench/services/configuration/common/configuration", "vs/platform/files/common/files", "vs/workbench/services/configuration/common/configurationEditing", "vs/editor/common/services/resolverService", "vs/platform/configuration/common/configurationRegistry", "vs/platform/message/common/message", "vs/platform/commands/common/commands"], function (require, exports, nls, winjs_base_1, paths, uri_1, json, encoding, strings, jsonEdit_1, async_1, editOperation_1, platform_1, range_1, selection_1, workspace_1, environment_1, textfiles_1, configuration_1, model_1, configuration_2, files_1, configurationEditing_1, resolverService_1, configurationRegistry_1, message_1, commands_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConfigurationEditingService = (function () {
        function ConfigurationEditingService(configurationService, contextService, environmentService, fileService, textModelResolverService, textFileService, choiceService, messageService, commandService) {
            this.configurationService = configurationService;
            this.contextService = contextService;
            this.environmentService = environmentService;
            this.fileService = fileService;
            this.textModelResolverService = textModelResolverService;
            this.textFileService = textFileService;
            this.choiceService = choiceService;
            this.messageService = messageService;
            this.commandService = commandService;
            this.queue = new async_1.Queue();
        }
        ConfigurationEditingService.prototype.writeConfiguration = function (target, value, options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            return this.queue.queue(function () { return _this.doWriteConfiguration(target, value, options) // queue up writes to prevent race conditions
                .then(function () { return null; }, function (error) {
                if (!options.donotNotifyError) {
                    _this.onError(error, target, value, options.scopes);
                }
                return winjs_base_1.TPromise.wrapError(error);
            }); });
        };
        ConfigurationEditingService.prototype.doWriteConfiguration = function (target, value, options) {
            var _this = this;
            var operation = this.getConfigurationEditOperation(target, value, options.scopes || {});
            var checkDirtyConfiguration = !(options.force || options.donotSave);
            var saveConfiguration = options.force || !options.donotSave;
            return this.resolveAndValidate(target, operation, checkDirtyConfiguration, options.scopes || {})
                .then(function (reference) { return _this.writeToBuffer(reference.object.textEditorModel, operation, saveConfiguration)
                .then(function () { return reference.dispose(); }); });
        };
        ConfigurationEditingService.prototype.writeToBuffer = function (model, operation, save) {
            var _this = this;
            var edit = this.getEdits(model, operation)[0];
            if (this.applyEditsToBuffer(edit, model) && save) {
                return this.textFileService.save(operation.resource, { skipSaveParticipants: true /* programmatic change */ })
                    .then(function () { return _this.configurationService.reloadConfiguration(); });
            }
            return winjs_base_1.TPromise.as(null);
        };
        ConfigurationEditingService.prototype.applyEditsToBuffer = function (edit, model) {
            var startPosition = model.getPositionAt(edit.offset);
            var endPosition = model.getPositionAt(edit.offset + edit.length);
            var range = new range_1.Range(startPosition.lineNumber, startPosition.column, endPosition.lineNumber, endPosition.column);
            var currentText = model.getValueInRange(range);
            if (edit.content !== currentText) {
                var editOperation = currentText ? editOperation_1.EditOperation.replace(range, edit.content) : editOperation_1.EditOperation.insert(startPosition, edit.content);
                model.pushEditOperations([new selection_1.Selection(startPosition.lineNumber, startPosition.column, startPosition.lineNumber, startPosition.column)], [editOperation], function () { return []; });
                return true;
            }
            return false;
        };
        ConfigurationEditingService.prototype.onError = function (error, target, value, scopes) {
            switch (error.code) {
                case configurationEditing_1.ConfigurationEditingErrorCode.ERROR_INVALID_CONFIGURATION:
                    this.onInvalidConfigurationError(error, target);
                    break;
                case configurationEditing_1.ConfigurationEditingErrorCode.ERROR_CONFIGURATION_FILE_DIRTY:
                    this.onConfigurationFileDirtyError(error, target, value, scopes);
                    break;
                default:
                    this.messageService.show(message_1.Severity.Error, error.message);
            }
        };
        ConfigurationEditingService.prototype.onInvalidConfigurationError = function (error, target) {
            var _this = this;
            this.choiceService.choose(message_1.Severity.Error, error.message, [nls.localize('open', "Open Settings"), nls.localize('close', "Close")], 1)
                .then(function (option) {
                switch (option) {
                    case 0:
                        _this.openSettings(target);
                }
            });
        };
        ConfigurationEditingService.prototype.onConfigurationFileDirtyError = function (error, target, value, scopes) {
            var _this = this;
            this.choiceService.choose(message_1.Severity.Error, error.message, [nls.localize('saveAndRetry', "Save Settings and Retry"), nls.localize('open', "Open Settings"), nls.localize('close', "Close")], 2)
                .then(function (option) {
                switch (option) {
                    case 0:
                        _this.writeConfiguration(target, value, { force: true, scopes: scopes });
                        break;
                    case 1:
                        _this.openSettings(target);
                        break;
                }
            });
        };
        ConfigurationEditingService.prototype.openSettings = function (target) {
            this.commandService.executeCommand(configurationEditing_1.ConfigurationTarget.USER === target ? 'workbench.action.openGlobalSettings' : 'workbench.action.openWorkspaceSettings');
        };
        ConfigurationEditingService.prototype.wrapError = function (code, target, operation) {
            var message = this.toErrorMessage(code, target, operation);
            return winjs_base_1.TPromise.wrapError(new configurationEditing_1.ConfigurationEditingError(message, code));
        };
        ConfigurationEditingService.prototype.toErrorMessage = function (error, target, operation) {
            switch (error) {
                // API constraints
                case configurationEditing_1.ConfigurationEditingErrorCode.ERROR_UNKNOWN_KEY: return nls.localize('errorUnknownKey', "Unable to write to {0} because {1} is not a registered configuration.", this.stringifyTarget(target), operation.key);
                case configurationEditing_1.ConfigurationEditingErrorCode.ERROR_INVALID_FOLDER_CONFIGURATION: return nls.localize('errorInvalidFolderConfiguration', "Unable to write to Folder Settings because {0} does not support the folder resource scope.", operation.key);
                case configurationEditing_1.ConfigurationEditingErrorCode.ERROR_INVALID_USER_TARGET: return nls.localize('errorInvalidUserTarget', "Unable to write to User Settings because {0} does not support for global scope.", operation.key);
                case configurationEditing_1.ConfigurationEditingErrorCode.ERROR_INVALID_FOLDER_TARGET: return nls.localize('errorInvalidFolderTarget', "Unable to write to Folder Settings because no resource is provided.");
                case configurationEditing_1.ConfigurationEditingErrorCode.ERROR_NO_WORKSPACE_OPENED: return nls.localize('errorNoWorkspaceOpened', "Unable to write to {0} because no workspace is opened. Please open a workspace first and try again.", this.stringifyTarget(target));
                // User issues
                case configurationEditing_1.ConfigurationEditingErrorCode.ERROR_INVALID_CONFIGURATION:
                    {
                        if (target === configurationEditing_1.ConfigurationTarget.USER) {
                            return nls.localize('errorInvalidConfiguration', "Unable to write into settings. Please open **User Settings** to correct errors/warnings in the file and try again.");
                        }
                        return nls.localize('errorInvalidConfigurationWorkspace', "Unable to write into settings. Please open **Workspace Settings** to correct errors/warnings in the file and try again.");
                    }
                    ;
                case configurationEditing_1.ConfigurationEditingErrorCode.ERROR_CONFIGURATION_FILE_DIRTY:
                    {
                        if (target === configurationEditing_1.ConfigurationTarget.USER) {
                            return nls.localize('errorConfigurationFileDirty', "Unable to write into settings because the file is dirty. Please save the **User Settings** file and try again.");
                        }
                        return nls.localize('errorConfigurationFileDirtyWorkspace', "Unable to write into settings because the file is dirty. Please save the **Workspace Settings** file and try again.");
                    }
                    ;
            }
        };
        ConfigurationEditingService.prototype.stringifyTarget = function (target) {
            switch (target) {
                case configurationEditing_1.ConfigurationTarget.USER:
                    return nls.localize('userTarget', "User Settings");
                case configurationEditing_1.ConfigurationTarget.WORKSPACE:
                    return nls.localize('workspaceTarget', "Workspace Settings");
                case configurationEditing_1.ConfigurationTarget.FOLDER:
                    return nls.localize('folderTarget', "Folder Settings");
            }
        };
        ConfigurationEditingService.prototype.getEdits = function (model, edit) {
            var _a = model.getOptions(), tabSize = _a.tabSize, insertSpaces = _a.insertSpaces;
            var eol = model.getEOL();
            var value = edit.value, jsonPath = edit.jsonPath;
            // Without jsonPath, the entire configuration file is being replaced, so we just use JSON.stringify
            if (!jsonPath.length) {
                var content = JSON.stringify(value, null, insertSpaces ? strings.repeat(' ', tabSize) : '\t');
                return [{
                        content: content,
                        length: content.length,
                        offset: 0
                    }];
            }
            return jsonEdit_1.setProperty(model.getValue(), jsonPath, value, { tabSize: tabSize, insertSpaces: insertSpaces, eol: eol });
        };
        ConfigurationEditingService.prototype.resolveModelReference = function (resource) {
            var _this = this;
            return this.fileService.existsFile(resource)
                .then(function (exists) {
                var result = exists ? winjs_base_1.TPromise.as(null) : _this.fileService.updateContent(resource, '{}', { encoding: encoding.UTF8 });
                return result.then(function () { return _this.textModelResolverService.createModelReference(resource); });
            });
        };
        ConfigurationEditingService.prototype.hasParseErrors = function (model, operation) {
            // If we write to a workspace standalone file and replace the entire contents (no key provided)
            // we can return here because any parse errors can safely be ignored since all contents are replaced
            if (operation.isWorkspaceStandalone && !operation.key) {
                return false;
            }
            var parseErrors = [];
            json.parse(model.getValue(), parseErrors, { allowTrailingComma: true });
            return parseErrors.length > 0;
        };
        ConfigurationEditingService.prototype.resolveAndValidate = function (target, operation, checkDirty, overrides) {
            var _this = this;
            // Any key must be a known setting from the registry (unless this is a standalone config)
            if (!operation.isWorkspaceStandalone) {
                var validKeys = this.configurationService.keys().default;
                if (validKeys.indexOf(operation.key) < 0 && !configurationRegistry_1.OVERRIDE_PROPERTY_PATTERN.test(operation.key)) {
                    return this.wrapError(configurationEditing_1.ConfigurationEditingErrorCode.ERROR_UNKNOWN_KEY, target, operation);
                }
            }
            // Target cannot be user if is standalone
            if (operation.isWorkspaceStandalone && target === configurationEditing_1.ConfigurationTarget.USER) {
                return this.wrapError(configurationEditing_1.ConfigurationEditingErrorCode.ERROR_INVALID_USER_TARGET, target, operation);
            }
            // Target cannot be workspace or folder if no workspace opened
            if ((target === configurationEditing_1.ConfigurationTarget.WORKSPACE || target === configurationEditing_1.ConfigurationTarget.FOLDER) && !this.contextService.hasWorkspace()) {
                return this.wrapError(configurationEditing_1.ConfigurationEditingErrorCode.ERROR_NO_WORKSPACE_OPENED, target, operation);
            }
            if (target === configurationEditing_1.ConfigurationTarget.FOLDER) {
                if (!operation.resource) {
                    return this.wrapError(configurationEditing_1.ConfigurationEditingErrorCode.ERROR_INVALID_FOLDER_TARGET, target, operation);
                }
                var configurationProperties = platform_1.Registry.as(configurationRegistry_1.Extensions.Configuration).getConfigurationProperties();
                if (configurationProperties[operation.key].scope !== configurationRegistry_1.ConfigurationScope.RESOURCE) {
                    return this.wrapError(configurationEditing_1.ConfigurationEditingErrorCode.ERROR_INVALID_FOLDER_CONFIGURATION, target, operation);
                }
            }
            return this.resolveModelReference(operation.resource)
                .then(function (reference) {
                var model = reference.object.textEditorModel;
                if (_this.hasParseErrors(model, operation)) {
                    return _this.wrapError(configurationEditing_1.ConfigurationEditingErrorCode.ERROR_INVALID_CONFIGURATION, target, operation);
                }
                // Target cannot be dirty if not writing into buffer
                if (checkDirty && _this.textFileService.isDirty(operation.resource)) {
                    return _this.wrapError(configurationEditing_1.ConfigurationEditingErrorCode.ERROR_CONFIGURATION_FILE_DIRTY, target, operation);
                }
                return reference;
            });
        };
        ConfigurationEditingService.prototype.getConfigurationEditOperation = function (target, config, overrides) {
            var workspace = this.contextService.getWorkspace();
            // Check for standalone workspace configurations
            if (config.key) {
                var standaloneConfigurationKeys = Object.keys(configuration_2.WORKSPACE_STANDALONE_CONFIGURATIONS);
                for (var i = 0; i < standaloneConfigurationKeys.length; i++) {
                    var key_1 = standaloneConfigurationKeys[i];
                    var resource_1 = this.getConfigurationFileResource(target, configuration_2.WORKSPACE_STANDALONE_CONFIGURATIONS[key_1], overrides.resource);
                    // Check for prefix
                    if (config.key === key_1) {
                        var jsonPath_1 = workspace && workspace.configuration && resource_1 && workspace.configuration.fsPath === resource_1.fsPath ? [key_1] : [];
                        return { key: jsonPath_1[jsonPath_1.length - 1], jsonPath: jsonPath_1, value: config.value, resource: resource_1, isWorkspaceStandalone: true };
                    }
                    // Check for prefix.<setting>
                    var keyPrefix = key_1 + ".";
                    if (config.key.indexOf(keyPrefix) === 0) {
                        var jsonPath_2 = workspace && workspace.configuration && resource_1 && workspace.configuration.fsPath === resource_1.fsPath ? [key_1, config.key.substr(keyPrefix.length)] : [config.key.substr(keyPrefix.length)];
                        return { key: jsonPath_2[jsonPath_2.length - 1], jsonPath: jsonPath_2, value: config.value, resource: resource_1, isWorkspaceStandalone: true };
                    }
                }
            }
            var key = config.key;
            var jsonPath = overrides.overrideIdentifier ? [model_1.keyFromOverrideIdentifier(overrides.overrideIdentifier), key] : [key];
            if (target === configurationEditing_1.ConfigurationTarget.USER) {
                return { key: key, jsonPath: jsonPath, value: config.value, resource: uri_1.default.file(this.environmentService.appSettingsPath) };
            }
            var resource = this.getConfigurationFileResource(target, configuration_2.WORKSPACE_CONFIG_DEFAULT_PATH, overrides.resource);
            if (workspace && workspace.configuration && resource && workspace.configuration.fsPath === resource.fsPath) {
                jsonPath = ['settings'].concat(jsonPath);
            }
            return { key: key, jsonPath: jsonPath, value: config.value, resource: resource };
        };
        ConfigurationEditingService.prototype.getConfigurationFileResource = function (target, relativePath, resource) {
            if (target === configurationEditing_1.ConfigurationTarget.USER) {
                return uri_1.default.file(this.environmentService.appSettingsPath);
            }
            var workspace = this.contextService.getWorkspace();
            if (workspace) {
                if (target === configurationEditing_1.ConfigurationTarget.WORKSPACE) {
                    return this.contextService.hasMultiFolderWorkspace() ? workspace.configuration : this.toResource(relativePath, workspace.roots[0]);
                }
                if (target === configurationEditing_1.ConfigurationTarget.FOLDER && this.contextService.hasMultiFolderWorkspace()) {
                    if (resource) {
                        var root = this.contextService.getRoot(resource);
                        if (root) {
                            return this.toResource(relativePath, root);
                        }
                    }
                }
            }
            return null;
        };
        ConfigurationEditingService.prototype.toResource = function (relativePath, root) {
            return uri_1.default.file(paths.join(root.fsPath, relativePath));
        };
        ConfigurationEditingService = __decorate([
            __param(0, configuration_1.IConfigurationService),
            __param(1, workspace_1.IWorkspaceContextService),
            __param(2, environment_1.IEnvironmentService),
            __param(3, files_1.IFileService),
            __param(4, resolverService_1.ITextModelService),
            __param(5, textfiles_1.ITextFileService),
            __param(6, message_1.IChoiceService),
            __param(7, message_1.IMessageService),
            __param(8, commands_1.ICommandService)
        ], ConfigurationEditingService);
        return ConfigurationEditingService;
    }());
    exports.ConfigurationEditingService = ConfigurationEditingService;
});
//# sourceMappingURL=configurationEditingService.js.map