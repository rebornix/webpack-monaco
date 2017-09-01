var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/common/winjs.base", "vs/nls", "vs/base/common/errors", "vs/base/common/errorMessage", "vs/base/common/paths", "vs/base/common/actions", "vs/base/common/uri", "vs/workbench/parts/files/browser/fileActions", "vs/platform/files/common/files", "vs/platform/environment/common/environment", "vs/workbench/services/editor/common/editorService", "vs/workbench/services/textfile/common/textfiles", "vs/platform/instantiation/common/instantiation", "vs/platform/message/common/message", "vs/editor/common/services/modeService", "vs/editor/common/services/modelService", "vs/base/common/lifecycle", "vs/workbench/services/textfile/common/textFileEditorModel", "vs/editor/common/services/resolverService", "vs/base/common/map", "vs/workbench/services/group/common/groupService", "vs/workbench/common/editor/diffEditorInput", "vs/workbench/common/editor/resourceEditorInput", "vs/platform/contextkey/common/contextkey"], function (require, exports, winjs_base_1, nls, errors, errorMessage_1, paths, actions_1, uri_1, fileActions_1, files_1, environment_1, editorService_1, textfiles_1, instantiation_1, message_1, modeService_1, modelService_1, lifecycle_1, textFileEditorModel_1, resolverService_1, map_1, groupService_1, diffEditorInput_1, resourceEditorInput_1, contextkey_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CONFLICT_RESOLUTION_CONTEXT = 'saveConflictResolutionContext';
    exports.CONFLICT_RESOLUTION_SCHEME = 'conflictResolution';
    // A handler for save error happening with conflict resolution actions
    var SaveErrorHandler = (function () {
        function SaveErrorHandler(messageService, textFileService, textModelResolverService, modelService, modeService, instantiationService, editorGroupService, contextKeyService, editorService) {
            this.messageService = messageService;
            this.textFileService = textFileService;
            this.textModelResolverService = textModelResolverService;
            this.modelService = modelService;
            this.modeService = modeService;
            this.instantiationService = instantiationService;
            this.editorGroupService = editorGroupService;
            this.editorService = editorService;
            this.messages = new map_1.ResourceMap();
            this.conflictResolutionContext = new contextkey_1.RawContextKey(exports.CONFLICT_RESOLUTION_CONTEXT, false).bindTo(contextKeyService);
            this.toUnbind = [];
            // Register as text model content provider that supports to load a resource as it actually
            // is stored on disk as opposed to using the file:// scheme that will return a dirty buffer
            // if there is one.
            this.textModelResolverService.registerTextModelContentProvider(exports.CONFLICT_RESOLUTION_SCHEME, this);
            // Hook into model
            textFileEditorModel_1.TextFileEditorModel.setSaveErrorHandler(this);
            this.registerListeners();
        }
        SaveErrorHandler.prototype.provideTextContent = function (resource) {
            var _this = this;
            var fileOnDiskResource = uri_1.default.file(resource.fsPath);
            // Make sure our file from disk is resolved up to date
            return this.textFileService.resolveTextContent(fileOnDiskResource).then(function (content) {
                var codeEditorModel = _this.modelService.getModel(resource);
                if (codeEditorModel) {
                    _this.modelService.updateModel(codeEditorModel, content.value);
                }
                else {
                    var fileOnDiskModel = _this.modelService.getModel(fileOnDiskResource);
                    var mode = void 0;
                    if (fileOnDiskModel) {
                        mode = _this.modeService.getOrCreateMode(fileOnDiskModel.getModeId());
                    }
                    else {
                        mode = _this.modeService.getOrCreateModeByFilenameOrFirstLine(fileOnDiskResource.fsPath);
                    }
                    codeEditorModel = _this.modelService.createModel(content.value, mode, resource);
                }
                return codeEditorModel;
            });
        };
        SaveErrorHandler.prototype.getId = function () {
            return 'vs.files.saveerrorhandler';
        };
        SaveErrorHandler.prototype.registerListeners = function () {
            var _this = this;
            this.toUnbind.push(this.textFileService.models.onModelSaved(function (e) { return _this.onFileSavedOrReverted(e.resource); }));
            this.toUnbind.push(this.textFileService.models.onModelReverted(function (e) { return _this.onFileSavedOrReverted(e.resource); }));
            this.toUnbind.push(this.editorGroupService.onEditorsChanged(function () { return _this.onEditorsChanged(); }));
        };
        SaveErrorHandler.prototype.onEditorsChanged = function () {
            var isActiveEditorSaveConflictResolution = false;
            var activeEditor = this.editorService.getActiveEditor();
            if (activeEditor && activeEditor.input instanceof diffEditorInput_1.DiffEditorInput && activeEditor.input.originalInput instanceof resourceEditorInput_1.ResourceEditorInput) {
                var resource = activeEditor.input.originalInput.getResource();
                isActiveEditorSaveConflictResolution = resource && resource.scheme === exports.CONFLICT_RESOLUTION_SCHEME;
            }
            this.conflictResolutionContext.set(isActiveEditorSaveConflictResolution);
        };
        SaveErrorHandler.prototype.onFileSavedOrReverted = function (resource) {
            var hideMessage = this.messages.get(resource);
            if (hideMessage) {
                hideMessage();
                this.messages.delete(resource);
            }
        };
        SaveErrorHandler.prototype.onSaveError = function (error, model) {
            var _this = this;
            var message;
            var resource = model.getResource();
            // Dirty write prevention
            if (error.fileOperationResult === files_1.FileOperationResult.FILE_MODIFIED_SINCE) {
                message = this.instantiationService.createInstance(ResolveSaveConflictMessage, model, null);
            }
            else {
                var isReadonly = error.fileOperationResult === files_1.FileOperationResult.FILE_READ_ONLY;
                var actions = [];
                // Save As
                actions.push(new actions_1.Action('workbench.files.action.saveAs', fileActions_1.SaveFileAsAction.LABEL, null, true, function () {
                    var saveAsAction = _this.instantiationService.createInstance(fileActions_1.SaveFileAsAction, fileActions_1.SaveFileAsAction.ID, fileActions_1.SaveFileAsAction.LABEL);
                    saveAsAction.setResource(resource);
                    saveAsAction.run().done(function () { return saveAsAction.dispose(); }, errors.onUnexpectedError);
                    return winjs_base_1.TPromise.as(true);
                }));
                // Discard
                actions.push(new actions_1.Action('workbench.files.action.discard', nls.localize('discard', "Discard"), null, true, function () {
                    var revertFileAction = _this.instantiationService.createInstance(fileActions_1.RevertFileAction, fileActions_1.RevertFileAction.ID, fileActions_1.RevertFileAction.LABEL);
                    revertFileAction.setResource(resource);
                    revertFileAction.run().done(function () { return revertFileAction.dispose(); }, errors.onUnexpectedError);
                    return winjs_base_1.TPromise.as(true);
                }));
                // Retry
                if (isReadonly) {
                    actions.push(new actions_1.Action('workbench.files.action.overwrite', nls.localize('overwrite', "Overwrite"), null, true, function () {
                        if (!model.isDisposed()) {
                            model.save({ overwriteReadonly: true }).done(null, errors.onUnexpectedError);
                        }
                        return winjs_base_1.TPromise.as(true);
                    }));
                }
                else {
                    actions.push(new actions_1.Action('workbench.files.action.retry', nls.localize('retry', "Retry"), null, true, function () {
                        var saveFileAction = _this.instantiationService.createInstance(fileActions_1.SaveFileAction, fileActions_1.SaveFileAction.ID, fileActions_1.SaveFileAction.LABEL);
                        saveFileAction.setResource(resource);
                        saveFileAction.run().done(function () { return saveFileAction.dispose(); }, errors.onUnexpectedError);
                        return winjs_base_1.TPromise.as(true);
                    }));
                }
                // Cancel
                actions.push(message_1.CancelAction);
                var errorMessage = void 0;
                if (isReadonly) {
                    errorMessage = nls.localize('readonlySaveError', "Failed to save '{0}': File is write protected. Select 'Overwrite' to remove protection.", paths.basename(resource.fsPath));
                }
                else {
                    errorMessage = nls.localize('genericSaveError', "Failed to save '{0}': {1}", paths.basename(resource.fsPath), errorMessage_1.toErrorMessage(error, false));
                }
                message = {
                    message: errorMessage,
                    actions: actions
                };
            }
            // Show message and keep function to hide in case the file gets saved/reverted
            this.messages.set(model.getResource(), this.messageService.show(message_1.Severity.Error, message));
        };
        SaveErrorHandler.prototype.dispose = function () {
            this.toUnbind = lifecycle_1.dispose(this.toUnbind);
            this.messages.clear();
        };
        SaveErrorHandler = __decorate([
            __param(0, message_1.IMessageService),
            __param(1, textfiles_1.ITextFileService),
            __param(2, resolverService_1.ITextModelService),
            __param(3, modelService_1.IModelService),
            __param(4, modeService_1.IModeService),
            __param(5, instantiation_1.IInstantiationService),
            __param(6, groupService_1.IEditorGroupService),
            __param(7, contextkey_1.IContextKeyService),
            __param(8, editorService_1.IWorkbenchEditorService)
        ], SaveErrorHandler);
        return SaveErrorHandler;
    }());
    exports.SaveErrorHandler = SaveErrorHandler;
    var pendingResolveSaveConflictMessages = [];
    function clearPendingResolveSaveConflictMessages() {
        while (pendingResolveSaveConflictMessages.length > 0) {
            pendingResolveSaveConflictMessages.pop()();
        }
    }
    // A message with action to resolve a save conflict
    var ResolveSaveConflictMessage = (function () {
        function ResolveSaveConflictMessage(model, message, messageService, editorService, environmentService) {
            var _this = this;
            this.messageService = messageService;
            this.editorService = editorService;
            this.environmentService = environmentService;
            this.model = model;
            var resource = model.getResource();
            if (message) {
                this.message = message;
            }
            else {
                this.message = nls.localize('staleSaveError', "Failed to save '{0}': The content on disk is newer. Click on **Compare** to compare your version with the one on disk.", paths.basename(resource.fsPath));
            }
            this.actions = [
                new actions_1.Action('workbench.files.action.resolveConflict', nls.localize('compareChanges', "Compare"), null, true, function () {
                    if (!_this.model.isDisposed()) {
                        var name_1 = paths.basename(resource.fsPath);
                        var editorLabel = nls.localize('saveConflictDiffLabel', "{0} (on disk) ↔ {1} (in {2}) - Resolve save conflict", name_1, name_1, _this.environmentService.appNameLong);
                        return _this.editorService.openEditor({ leftResource: uri_1.default.from({ scheme: exports.CONFLICT_RESOLUTION_SCHEME, path: resource.fsPath }), rightResource: resource, label: editorLabel, options: { pinned: true } }).then(function () {
                            // Inform user
                            pendingResolveSaveConflictMessages.push(_this.messageService.show(message_1.Severity.Info, nls.localize('userGuide', "Use the actions in the editor tool bar to the right to either **undo** your changes or **overwrite** the content on disk with your changes")));
                        });
                    }
                    return winjs_base_1.TPromise.as(true);
                })
            ];
        }
        ResolveSaveConflictMessage = __decorate([
            __param(2, message_1.IMessageService),
            __param(3, editorService_1.IWorkbenchEditorService),
            __param(4, environment_1.IEnvironmentService)
        ], ResolveSaveConflictMessage);
        return ResolveSaveConflictMessage;
    }());
    exports.acceptLocalChangesCommand = function (accessor, resource) {
        var editorService = accessor.get(editorService_1.IWorkbenchEditorService);
        var resolverService = accessor.get(resolverService_1.ITextModelService);
        var editor = editorService.getActiveEditor();
        var input = editor.input;
        var position = editor.position;
        resolverService.createModelReference(resource).then(function (reference) {
            var model = reference.object;
            var localModelValue = model.getValue();
            clearPendingResolveSaveConflictMessages(); // hide any previously shown message about how to use these actions
            // revert to be able to save
            return model.revert().then(function () {
                // Restore user value
                model.textEditorModel.setValue(localModelValue);
                // Trigger save
                return model.save().then(function () {
                    // Reopen file input
                    return editorService.openEditor({ resource: model.getResource() }, position).then(function () {
                        // Clean up
                        input.dispose();
                        reference.dispose();
                    });
                });
            });
        });
    };
    exports.revertLocalChangesCommand = function (accessor, resource) {
        var editorService = accessor.get(editorService_1.IWorkbenchEditorService);
        var resolverService = accessor.get(resolverService_1.ITextModelService);
        var editor = editorService.getActiveEditor();
        var input = editor.input;
        var position = editor.position;
        resolverService.createModelReference(resource).then(function (reference) {
            var model = reference.object;
            clearPendingResolveSaveConflictMessages(); // hide any previously shown message about how to use these actions
            // Revert on model
            return model.revert().then(function () {
                // Reopen file input
                return editorService.openEditor({ resource: model.getResource() }, position).then(function () {
                    // Clean up
                    input.dispose();
                    reference.dispose();
                });
            });
        });
    };
});
//# sourceMappingURL=saveErrorHandler.js.map