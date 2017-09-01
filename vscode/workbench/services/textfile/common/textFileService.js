define(["require", "exports", "vs/nls", "vs/base/common/winjs.base", "vs/base/common/uri", "vs/base/common/paths", "vs/base/common/errors", "vs/base/common/objects", "vs/base/common/event", "vs/base/common/platform", "vs/workbench/services/textfile/common/textfiles", "vs/workbench/common/editor", "vs/platform/lifecycle/common/lifecycle", "vs/platform/files/common/files", "vs/base/common/lifecycle", "vs/workbench/services/untitled/common/untitledEditorService", "vs/workbench/services/textfile/common/textFileEditorModelManager", "vs/platform/message/common/message", "vs/base/common/map", "vs/base/common/network"], function (require, exports, nls, winjs_base_1, uri_1, paths, errors, objects, event_1, platform, textfiles_1, editor_1, lifecycle_1, files_1, lifecycle_2, untitledEditorService_1, textFileEditorModelManager_1, message_1, map_1, network_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * The workbench file service implementation implements the raw file service spec and adds additional methods on top.
     *
     * It also adds diagnostics and logging around file system operations.
     */
    var TextFileService = (function () {
        function TextFileService(lifecycleService, contextService, configurationService, telemetryService, fileService, untitledEditorService, instantiationService, messageService, environmentService, backupFileService, windowsService, historyService) {
            this.lifecycleService = lifecycleService;
            this.contextService = contextService;
            this.configurationService = configurationService;
            this.telemetryService = telemetryService;
            this.fileService = fileService;
            this.untitledEditorService = untitledEditorService;
            this.instantiationService = instantiationService;
            this.messageService = messageService;
            this.environmentService = environmentService;
            this.backupFileService = backupFileService;
            this.windowsService = windowsService;
            this.historyService = historyService;
            this.toUnbind = [];
            this._onAutoSaveConfigurationChange = new event_1.Emitter();
            this.toUnbind.push(this._onAutoSaveConfigurationChange);
            this._onFilesAssociationChange = new event_1.Emitter();
            this.toUnbind.push(this._onFilesAssociationChange);
            this._models = this.instantiationService.createInstance(textFileEditorModelManager_1.TextFileEditorModelManager);
            var configuration = this.configurationService.getConfiguration();
            this.currentFilesAssociationConfig = configuration && configuration.files && configuration.files.associations;
            this.onConfigurationChange(configuration);
            this.telemetryService.publicLog('autoSave', this.getAutoSaveConfiguration());
            this.registerListeners();
        }
        Object.defineProperty(TextFileService.prototype, "models", {
            get: function () {
                return this._models;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextFileService.prototype, "onAutoSaveConfigurationChange", {
            get: function () {
                return this._onAutoSaveConfigurationChange.event;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextFileService.prototype, "onFilesAssociationChange", {
            get: function () {
                return this._onFilesAssociationChange.event;
            },
            enumerable: true,
            configurable: true
        });
        TextFileService.prototype.registerListeners = function () {
            var _this = this;
            // Lifecycle
            this.lifecycleService.onWillShutdown(function (event) { return event.veto(_this.beforeShutdown(event.reason)); });
            this.lifecycleService.onShutdown(this.dispose, this);
            // Configuration changes
            this.toUnbind.push(this.configurationService.onDidUpdateConfiguration(function (e) { return _this.onConfigurationChange(_this.configurationService.getConfiguration()); }));
        };
        TextFileService.prototype.beforeShutdown = function (reason) {
            var _this = this;
            // Dirty files need treatment on shutdown
            var dirty = this.getDirty();
            if (dirty.length) {
                // If auto save is enabled, save all files and then check again for dirty files
                var handleAutoSave = void 0;
                if (this.getAutoSaveMode() !== textfiles_1.AutoSaveMode.OFF) {
                    handleAutoSave = this.saveAll(false /* files only */).then(function () { return _this.getDirty(); });
                }
                else {
                    handleAutoSave = winjs_base_1.TPromise.as(dirty);
                }
                return handleAutoSave.then(function (dirty) {
                    // If we still have dirty files, we either have untitled ones or files that cannot be saved
                    // or auto save was not enabled and as such we did not save any dirty files to disk automatically
                    if (dirty.length) {
                        // If hot exit is enabled, backup dirty files and allow to exit without confirmation
                        if (_this.isHotExitEnabled) {
                            return _this.backupBeforeShutdown(dirty, _this.models, reason).then(function (result) {
                                if (result.didBackup) {
                                    return _this.noVeto({ cleanUpBackups: false }); // no veto and no backup cleanup (since backup was successful)
                                }
                                // since a backup did not happen, we have to confirm for the dirty files now
                                return _this.confirmBeforeShutdown();
                            }, function (errors) {
                                var firstError = errors[0];
                                _this.messageService.show(message_1.Severity.Error, nls.localize('files.backup.failSave', "Files could not be backed up (Error: {0}), try saving your files to exit.", firstError.message));
                                return true; // veto, the backups failed
                            });
                        }
                        // Otherwise just confirm from the user what to do with the dirty files
                        return _this.confirmBeforeShutdown();
                    }
                    return void 0;
                });
            }
            // No dirty files: no veto
            return this.noVeto({ cleanUpBackups: true });
        };
        TextFileService.prototype.backupBeforeShutdown = function (dirtyToBackup, textFileEditorModelManager, reason) {
            var _this = this;
            return this.windowsService.getWindowCount().then(function (windowCount) {
                // When quit is requested skip the confirm callback and attempt to backup all workspaces.
                // When quit is not requested the confirm callback should be shown when the window being
                // closed is the only VS Code window open, except for on Mac where hot exit is only
                // ever activated when quit is requested.
                var doBackup;
                switch (reason) {
                    case lifecycle_1.ShutdownReason.CLOSE:
                        if (_this.contextService.hasWorkspace() && _this.configuredHotExit === files_1.HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE) {
                            doBackup = true; // backup if a folder is open and onExitAndWindowClose is configured
                        }
                        else if (windowCount > 1 || platform.isMacintosh) {
                            doBackup = false; // do not backup if a window is closed that does not cause quitting of the application
                        }
                        else {
                            doBackup = true; // backup if last window is closed on win/linux where the application quits right after
                        }
                        break;
                    case lifecycle_1.ShutdownReason.QUIT:
                        doBackup = true; // backup because next start we restore all backups
                        break;
                    case lifecycle_1.ShutdownReason.RELOAD:
                        doBackup = true; // backup because after window reload, backups restore
                        break;
                    case lifecycle_1.ShutdownReason.LOAD:
                        if (_this.contextService.hasWorkspace() && _this.configuredHotExit === files_1.HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE) {
                            doBackup = true; // backup if a folder is open and onExitAndWindowClose is configured
                        }
                        else {
                            doBackup = false; // do not backup because we are switching contexts
                        }
                        break;
                }
                if (!doBackup) {
                    return winjs_base_1.TPromise.as({ didBackup: false });
                }
                // Telemetry
                _this.telemetryService.publicLog('hotExit:triggered', { reason: reason, windowCount: windowCount, fileCount: dirtyToBackup.length });
                // Backup
                return _this.backupAll(dirtyToBackup, textFileEditorModelManager).then(function () { return { didBackup: true }; });
            });
        };
        TextFileService.prototype.backupAll = function (dirtyToBackup, textFileEditorModelManager) {
            // split up between files and untitled
            var filesToBackup = [];
            var untitledToBackup = [];
            dirtyToBackup.forEach(function (s) {
                if (s.scheme === network_1.Schemas.file) {
                    filesToBackup.push(textFileEditorModelManager.get(s));
                }
                else if (s.scheme === untitledEditorService_1.UNTITLED_SCHEMA) {
                    untitledToBackup.push(s);
                }
            });
            return this.doBackupAll(filesToBackup, untitledToBackup);
        };
        TextFileService.prototype.doBackupAll = function (dirtyFileModels, untitledResources) {
            var _this = this;
            // Handle file resources first
            return winjs_base_1.TPromise.join(dirtyFileModels.map(function (model) { return _this.backupFileService.backupResource(model.getResource(), model.getValue(), model.getVersionId()); })).then(function (results) {
                // Handle untitled resources
                var untitledModelPromises = untitledResources
                    .filter(function (untitled) { return _this.untitledEditorService.exists(untitled); })
                    .map(function (untitled) { return _this.untitledEditorService.loadOrCreate({ resource: untitled }); });
                return winjs_base_1.TPromise.join(untitledModelPromises).then(function (untitledModels) {
                    var untitledBackupPromises = untitledModels.map(function (model) {
                        return _this.backupFileService.backupResource(model.getResource(), model.getValue(), model.getVersionId());
                    });
                    return winjs_base_1.TPromise.join(untitledBackupPromises).then(function () { return void 0; });
                });
            });
        };
        TextFileService.prototype.confirmBeforeShutdown = function () {
            var _this = this;
            var confirm = this.confirmSave();
            // Save
            if (confirm === editor_1.ConfirmResult.SAVE) {
                return this.saveAll(true /* includeUntitled */).then(function (result) {
                    if (result.results.some(function (r) { return !r.success; })) {
                        return true; // veto if some saves failed
                    }
                    return _this.noVeto({ cleanUpBackups: true });
                });
            }
            else if (confirm === editor_1.ConfirmResult.DONT_SAVE) {
                // Make sure to revert untitled so that they do not restore
                // see https://github.com/Microsoft/vscode/issues/29572
                this.untitledEditorService.revertAll();
                return this.noVeto({ cleanUpBackups: true });
            }
            else if (confirm === editor_1.ConfirmResult.CANCEL) {
                return true; // veto
            }
            return void 0;
        };
        TextFileService.prototype.noVeto = function (options) {
            if (!options.cleanUpBackups) {
                return false;
            }
            return this.cleanupBackupsBeforeShutdown().then(function () { return false; }, function () { return false; });
        };
        TextFileService.prototype.cleanupBackupsBeforeShutdown = function () {
            if (this.environmentService.isExtensionDevelopment) {
                return winjs_base_1.TPromise.as(void 0);
            }
            return this.backupFileService.discardAllWorkspaceBackups();
        };
        TextFileService.prototype.onConfigurationChange = function (configuration) {
            var wasAutoSaveEnabled = (this.getAutoSaveMode() !== textfiles_1.AutoSaveMode.OFF);
            var autoSaveMode = (configuration && configuration.files && configuration.files.autoSave) || files_1.AutoSaveConfiguration.OFF;
            switch (autoSaveMode) {
                case files_1.AutoSaveConfiguration.AFTER_DELAY:
                    this.configuredAutoSaveDelay = configuration && configuration.files && configuration.files.autoSaveDelay;
                    this.configuredAutoSaveOnFocusChange = false;
                    this.configuredAutoSaveOnWindowChange = false;
                    break;
                case files_1.AutoSaveConfiguration.ON_FOCUS_CHANGE:
                    this.configuredAutoSaveDelay = void 0;
                    this.configuredAutoSaveOnFocusChange = true;
                    this.configuredAutoSaveOnWindowChange = false;
                    break;
                case files_1.AutoSaveConfiguration.ON_WINDOW_CHANGE:
                    this.configuredAutoSaveDelay = void 0;
                    this.configuredAutoSaveOnFocusChange = false;
                    this.configuredAutoSaveOnWindowChange = true;
                    break;
                default:
                    this.configuredAutoSaveDelay = void 0;
                    this.configuredAutoSaveOnFocusChange = false;
                    this.configuredAutoSaveOnWindowChange = false;
                    break;
            }
            // Emit as event
            this._onAutoSaveConfigurationChange.fire(this.getAutoSaveConfiguration());
            // save all dirty when enabling auto save
            if (!wasAutoSaveEnabled && this.getAutoSaveMode() !== textfiles_1.AutoSaveMode.OFF) {
                this.saveAll().done(null, errors.onUnexpectedError);
            }
            // Check for change in files associations
            var filesAssociation = configuration && configuration.files && configuration.files.associations;
            if (!objects.equals(this.currentFilesAssociationConfig, filesAssociation)) {
                this.currentFilesAssociationConfig = filesAssociation;
                this._onFilesAssociationChange.fire();
            }
            // Hot exit
            var hotExitMode = configuration && configuration.files && configuration.files.hotExit;
            if (hotExitMode === files_1.HotExitConfiguration.OFF || hotExitMode === files_1.HotExitConfiguration.ON_EXIT_AND_WINDOW_CLOSE) {
                this.configuredHotExit = hotExitMode;
            }
            else {
                this.configuredHotExit = files_1.HotExitConfiguration.ON_EXIT;
            }
        };
        TextFileService.prototype.getDirty = function (resources) {
            // Collect files
            var dirty = this.getDirtyFileModels(resources).map(function (m) { return m.getResource(); });
            // Add untitled ones
            dirty.push.apply(dirty, this.untitledEditorService.getDirty(resources));
            return dirty;
        };
        TextFileService.prototype.isDirty = function (resource) {
            // Check for dirty file
            if (this._models.getAll(resource).some(function (model) { return model.isDirty(); })) {
                return true;
            }
            // Check for dirty untitled
            return this.untitledEditorService.getDirty().some(function (dirty) { return !resource || dirty.toString() === resource.toString(); });
        };
        TextFileService.prototype.save = function (resource, options) {
            // Run a forced save if we detect the file is not dirty so that save participants can still run
            if (options && options.force && resource.scheme === network_1.Schemas.file && !this.isDirty(resource)) {
                var model_1 = this._models.get(resource);
                if (model_1) {
                    model_1.save({ force: true, reason: textfiles_1.SaveReason.EXPLICIT }).then(function () { return !model_1.isDirty(); });
                }
            }
            return this.saveAll([resource], options).then(function (result) { return result.results.length === 1 && result.results[0].success; });
        };
        TextFileService.prototype.saveAll = function (arg1, options) {
            // get all dirty
            var toSave = [];
            if (Array.isArray(arg1)) {
                toSave = this.getDirty(arg1);
            }
            else {
                toSave = this.getDirty();
            }
            // split up between files and untitled
            var filesToSave = [];
            var untitledToSave = [];
            toSave.forEach(function (s) {
                if (s.scheme === network_1.Schemas.file) {
                    filesToSave.push(s);
                }
                else if ((Array.isArray(arg1) || arg1 === true /* includeUntitled */) && s.scheme === untitledEditorService_1.UNTITLED_SCHEMA) {
                    untitledToSave.push(s);
                }
            });
            return this.doSaveAll(filesToSave, untitledToSave, options);
        };
        TextFileService.prototype.doSaveAll = function (fileResources, untitledResources, options) {
            var _this = this;
            // Handle files first that can just be saved
            return this.doSaveAllFiles(fileResources, options).then(function (result) {
                // Preflight for untitled to handle cancellation from the dialog
                var targetsForUntitled = [];
                for (var i = 0; i < untitledResources.length; i++) {
                    var untitled = untitledResources[i];
                    if (_this.untitledEditorService.exists(untitled)) {
                        var targetPath = void 0;
                        // Untitled with associated file path don't need to prompt
                        if (_this.untitledEditorService.hasAssociatedFilePath(untitled)) {
                            targetPath = untitled.fsPath;
                        }
                        else {
                            targetPath = _this.promptForPath(_this.suggestFileName(untitled));
                            if (!targetPath) {
                                return winjs_base_1.TPromise.as({
                                    results: fileResources.concat(untitledResources).map(function (r) {
                                        return {
                                            source: r
                                        };
                                    })
                                });
                            }
                        }
                        targetsForUntitled.push(uri_1.default.file(targetPath));
                    }
                }
                // Handle untitled
                var untitledSaveAsPromises = [];
                targetsForUntitled.forEach(function (target, index) {
                    var untitledSaveAsPromise = _this.saveAs(untitledResources[index], target).then(function (uri) {
                        result.results.push({
                            source: untitledResources[index],
                            target: uri,
                            success: !!uri
                        });
                    });
                    untitledSaveAsPromises.push(untitledSaveAsPromise);
                });
                return winjs_base_1.TPromise.join(untitledSaveAsPromises).then(function () {
                    return result;
                });
            });
        };
        TextFileService.prototype.doSaveAllFiles = function (resources, options) {
            if (options === void 0) { options = Object.create(null); }
            var dirtyFileModels = this.getDirtyFileModels(Array.isArray(resources) ? resources : void 0 /* Save All */)
                .filter(function (model) {
                if (model.hasState(textfiles_1.ModelState.CONFLICT) && (options.reason === textfiles_1.SaveReason.AUTO || options.reason === textfiles_1.SaveReason.FOCUS_CHANGE || options.reason === textfiles_1.SaveReason.WINDOW_CHANGE)) {
                    return false; // if model is in save conflict, do not save unless save reason is explicit or not provided at all
                }
                return true;
            });
            var mapResourceToResult = new map_1.ResourceMap();
            dirtyFileModels.forEach(function (m) {
                mapResourceToResult.set(m.getResource(), {
                    source: m.getResource()
                });
            });
            return winjs_base_1.TPromise.join(dirtyFileModels.map(function (model) {
                return model.save(options).then(function () {
                    if (!model.isDirty()) {
                        mapResourceToResult.get(model.getResource()).success = true;
                    }
                });
            })).then(function (r) {
                return {
                    results: mapResourceToResult.values()
                };
            });
        };
        TextFileService.prototype.getFileModels = function (arg1) {
            var _this = this;
            if (Array.isArray(arg1)) {
                var models_1 = [];
                arg1.forEach(function (resource) {
                    models_1.push.apply(models_1, _this.getFileModels(resource));
                });
                return models_1;
            }
            return this._models.getAll(arg1);
        };
        TextFileService.prototype.getDirtyFileModels = function (arg1) {
            return this.getFileModels(arg1).filter(function (model) { return model.isDirty(); });
        };
        TextFileService.prototype.saveAs = function (resource, target) {
            // Get to target resource
            if (!target) {
                var dialogPath = resource.fsPath;
                if (resource.scheme === untitledEditorService_1.UNTITLED_SCHEMA) {
                    dialogPath = this.suggestFileName(resource);
                }
                var pathRaw = this.promptForPath(dialogPath);
                if (pathRaw) {
                    target = uri_1.default.file(pathRaw);
                }
            }
            if (!target) {
                return winjs_base_1.TPromise.as(null); // user canceled
            }
            // Just save if target is same as models own resource
            if (resource.toString() === target.toString()) {
                return this.save(resource).then(function () { return resource; });
            }
            // Do it
            return this.doSaveAs(resource, target);
        };
        TextFileService.prototype.doSaveAs = function (resource, target) {
            var _this = this;
            // Retrieve text model from provided resource if any
            var modelPromise = winjs_base_1.TPromise.as(null);
            if (resource.scheme === network_1.Schemas.file) {
                modelPromise = winjs_base_1.TPromise.as(this._models.get(resource));
            }
            else if (resource.scheme === untitledEditorService_1.UNTITLED_SCHEMA && this.untitledEditorService.exists(resource)) {
                modelPromise = this.untitledEditorService.loadOrCreate({ resource: resource });
            }
            return modelPromise.then(function (model) {
                // We have a model: Use it (can be null e.g. if this file is binary and not a text file or was never opened before)
                if (model) {
                    return _this.doSaveTextFileAs(model, resource, target);
                }
                // Otherwise we can only copy
                return _this.fileService.copyFile(resource, target);
            }).then(function () {
                // Revert the source
                return _this.revert(resource).then(function () {
                    // Done: return target
                    return target;
                });
            });
        };
        TextFileService.prototype.doSaveTextFileAs = function (sourceModel, resource, target) {
            var _this = this;
            var targetModelResolver;
            // Prefer an existing model if it is already loaded for the given target resource
            var targetModel = this.models.get(target);
            if (targetModel && targetModel.isResolved()) {
                targetModelResolver = winjs_base_1.TPromise.as(targetModel);
            }
            else {
                targetModelResolver = this.fileService.resolveFile(target).then(function (stat) { return stat; }, function () { return null; }).then(function (stat) { return stat || _this.fileService.updateContent(target, ''); }).then(function (stat) {
                    return _this.models.loadOrCreate(target);
                });
            }
            return targetModelResolver.then(function (targetModel) {
                // take over encoding and model value from source model
                targetModel.updatePreferredEncoding(sourceModel.getEncoding());
                targetModel.textEditorModel.setValue(sourceModel.getValue());
                // save model
                return targetModel.save();
            }, function (error) {
                // binary model: delete the file and run the operation again
                if (error.fileOperationResult === files_1.FileOperationResult.FILE_IS_BINARY || error.fileOperationResult === files_1.FileOperationResult.FILE_TOO_LARGE) {
                    return _this.fileService.del(target).then(function () { return _this.doSaveTextFileAs(sourceModel, resource, target); });
                }
                return winjs_base_1.TPromise.wrapError(error);
            });
        };
        TextFileService.prototype.suggestFileName = function (untitledResource) {
            var root = this.historyService.getLastActiveWorkspaceRoot();
            if (root) {
                return uri_1.default.file(paths.join(root.fsPath, this.untitledEditorService.suggestFileName(untitledResource))).fsPath;
            }
            return this.untitledEditorService.suggestFileName(untitledResource);
        };
        TextFileService.prototype.revert = function (resource, options) {
            return this.revertAll([resource], options).then(function (result) { return result.results.length === 1 && result.results[0].success; });
        };
        TextFileService.prototype.revertAll = function (resources, options) {
            var _this = this;
            // Revert files first
            return this.doRevertAllFiles(resources, options).then(function (operation) {
                // Revert untitled
                var reverted = _this.untitledEditorService.revertAll(resources);
                reverted.forEach(function (res) { return operation.results.push({ source: res, success: true }); });
                return operation;
            });
        };
        TextFileService.prototype.doRevertAllFiles = function (resources, options) {
            var fileModels = options && options.force ? this.getFileModels(resources) : this.getDirtyFileModels(resources);
            var mapResourceToResult = new map_1.ResourceMap();
            fileModels.forEach(function (m) {
                mapResourceToResult.set(m.getResource(), {
                    source: m.getResource()
                });
            });
            return winjs_base_1.TPromise.join(fileModels.map(function (model) {
                return model.revert(options && options.soft).then(function () {
                    if (!model.isDirty()) {
                        mapResourceToResult.get(model.getResource()).success = true;
                    }
                }, function (error) {
                    // FileNotFound means the file got deleted meanwhile, so still record as successful revert
                    if (error.fileOperationResult === files_1.FileOperationResult.FILE_NOT_FOUND) {
                        mapResourceToResult.get(model.getResource()).success = true;
                    }
                    else {
                        return winjs_base_1.TPromise.wrapError(error);
                    }
                    return void 0;
                });
            })).then(function (r) {
                return {
                    results: mapResourceToResult.values()
                };
            });
        };
        TextFileService.prototype.getAutoSaveMode = function () {
            if (this.configuredAutoSaveOnFocusChange) {
                return textfiles_1.AutoSaveMode.ON_FOCUS_CHANGE;
            }
            if (this.configuredAutoSaveOnWindowChange) {
                return textfiles_1.AutoSaveMode.ON_WINDOW_CHANGE;
            }
            if (this.configuredAutoSaveDelay && this.configuredAutoSaveDelay > 0) {
                return this.configuredAutoSaveDelay <= 1000 ? textfiles_1.AutoSaveMode.AFTER_SHORT_DELAY : textfiles_1.AutoSaveMode.AFTER_LONG_DELAY;
            }
            return textfiles_1.AutoSaveMode.OFF;
        };
        TextFileService.prototype.getAutoSaveConfiguration = function () {
            return {
                autoSaveDelay: this.configuredAutoSaveDelay && this.configuredAutoSaveDelay > 0 ? this.configuredAutoSaveDelay : void 0,
                autoSaveFocusChange: this.configuredAutoSaveOnFocusChange,
                autoSaveApplicationChange: this.configuredAutoSaveOnWindowChange
            };
        };
        Object.defineProperty(TextFileService.prototype, "isHotExitEnabled", {
            get: function () {
                return !this.environmentService.isExtensionDevelopment && this.configuredHotExit !== files_1.HotExitConfiguration.OFF;
            },
            enumerable: true,
            configurable: true
        });
        TextFileService.prototype.dispose = function () {
            this.toUnbind = lifecycle_2.dispose(this.toUnbind);
            // Clear all caches
            this._models.clear();
        };
        return TextFileService;
    }());
    exports.TextFileService = TextFileService;
});
//# sourceMappingURL=textFileService.js.map