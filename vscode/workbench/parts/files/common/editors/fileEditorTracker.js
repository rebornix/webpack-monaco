var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "vs/base/common/winjs.base", "vs/base/common/errors", "vs/base/common/uri", "vs/base/common/paths", "vs/editor/common/editorCommon", "vs/workbench/common/editor", "vs/workbench/parts/files/common/files", "vs/workbench/services/textfile/common/textfiles", "vs/platform/files/common/files", "vs/workbench/parts/files/common/editors/fileEditorInput", "vs/workbench/services/group/common/groupService", "vs/platform/lifecycle/common/lifecycle", "vs/workbench/services/editor/common/editorService", "vs/base/common/lifecycle", "vs/base/common/arrays", "vs/platform/environment/common/environment", "vs/platform/configuration/common/configuration", "vs/base/common/platform"], function (require, exports, winjs_base_1, errors, uri_1, paths, editorCommon_1, editor_1, files_1, textfiles_1, files_2, fileEditorInput_1, groupService_1, lifecycle_1, editorService_1, lifecycle_2, arrays_1, environment_1, configuration_1, platform_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var FileEditorTracker = (function () {
        function FileEditorTracker(editorService, textFileService, lifecycleService, editorGroupService, fileService, environmentService, configurationService) {
            this.editorService = editorService;
            this.textFileService = textFileService;
            this.lifecycleService = lifecycleService;
            this.editorGroupService = editorGroupService;
            this.fileService = fileService;
            this.environmentService = environmentService;
            this.configurationService = configurationService;
            this.toUnbind = [];
            this.stacks = editorGroupService.getStacksModel();
            this.onConfigurationUpdated(configurationService.getConfiguration());
            this.registerListeners();
        }
        FileEditorTracker.prototype.getId = function () {
            return 'vs.files.fileEditorTracker';
        };
        FileEditorTracker.prototype.registerListeners = function () {
            var _this = this;
            // Update editors from operation changes
            this.toUnbind.push(this.fileService.onAfterOperation(function (e) { return _this.onFileOperation(e); }));
            // Update editors from disk changes
            this.toUnbind.push(this.fileService.onFileChanges(function (e) { return _this.onFileChanges(e); }));
            // Lifecycle
            this.lifecycleService.onShutdown(this.dispose, this);
            // Configuration
            this.toUnbind.push(this.configurationService.onDidUpdateConfiguration(function (e) { return _this.onConfigurationUpdated(_this.configurationService.getConfiguration()); }));
        };
        FileEditorTracker.prototype.onConfigurationUpdated = function (configuration) {
            if (configuration.workbench && configuration.workbench.editor && typeof configuration.workbench.editor.closeOnFileDelete === 'boolean') {
                this.closeOnFileDelete = configuration.workbench.editor.closeOnFileDelete;
            }
            else {
                this.closeOnFileDelete = true; // default
            }
        };
        // Note: there is some duplication with the other file event handler below. Since we cannot always rely on the disk events
        // carrying all necessary data in all environments, we also use the file operation events to make sure operations are handled.
        // In any case there is no guarantee if the local event is fired first or the disk one. Thus, code must handle the case
        // that the event ordering is random as well as might not carry all information needed.
        FileEditorTracker.prototype.onFileOperation = function (e) {
            // Handle moves specially when file is opened
            if (e.operation === files_2.FileOperation.MOVE) {
                this.handleMovedFileInOpenedEditors(e.resource, e.target.resource);
            }
            // Handle deletes
            if (e.operation === files_2.FileOperation.DELETE || e.operation === files_2.FileOperation.MOVE) {
                this.handleDeletes(e.resource, false, e.target ? e.target.resource : void 0);
            }
        };
        FileEditorTracker.prototype.onFileChanges = function (e) {
            // Handle updates
            this.handleUpdates(e);
            // Handle deletes
            if (e.gotDeleted()) {
                this.handleDeletes(e, true);
            }
        };
        FileEditorTracker.prototype.handleDeletes = function (arg1, isExternal, movedTo) {
            var _this = this;
            var nonDirtyFileEditors = this.getOpenedFileEditors(false /* non-dirty only */);
            nonDirtyFileEditors.forEach(function (editor) {
                var resource = editor.getResource();
                // Handle deletes in opened editors depending on:
                // - the user has not disabled the setting closeOnFileDelete
                // - the file change is local or external
                // - the input is not resolved (we need to dispose because we cannot restore otherwise since we do not have the contents)
                if (_this.closeOnFileDelete || !isExternal || !editor.isResolved()) {
                    // Do NOT close any opened editor that matches the resource path (either equal or being parent) of the
                    // resource we move to (movedTo). Otherwise we would close a resource that has been renamed to the same
                    // path but different casing.
                    if (movedTo && paths.isEqualOrParent(resource.fsPath, movedTo.fsPath, !platform_1.isLinux /* ignorecase */) && resource.fsPath.indexOf(movedTo.fsPath) === 0) {
                        return;
                    }
                    var matches = false;
                    if (arg1 instanceof files_2.FileChangesEvent) {
                        matches = arg1.contains(resource, files_2.FileChangeType.DELETED);
                    }
                    else {
                        matches = paths.isEqualOrParent(resource.fsPath, arg1.fsPath, !platform_1.isLinux /* ignorecase */);
                    }
                    if (!matches) {
                        return;
                    }
                    // We have received reports of users seeing delete events even though the file still
                    // exists (network shares issue: https://github.com/Microsoft/vscode/issues/13665).
                    // Since we do not want to close an editor without reason, we have to check if the
                    // file is really gone and not just a faulty file event (TODO@Ben revisit when we
                    // have a more stable file watcher in place for this scenario).
                    // This only applies to external file events, so we need to check for the isExternal
                    // flag.
                    var checkExists = void 0;
                    if (isExternal) {
                        checkExists = winjs_base_1.TPromise.timeout(100).then(function () { return _this.fileService.existsFile(resource); });
                    }
                    else {
                        checkExists = winjs_base_1.TPromise.as(false);
                    }
                    checkExists.done(function (exists) {
                        if (!exists && !editor.isDisposed()) {
                            editor.dispose();
                        }
                        else if (_this.environmentService.verbose) {
                            console.warn("File exists even though we received a delete event: " + resource.toString());
                        }
                    });
                }
            });
        };
        FileEditorTracker.prototype.getOpenedFileEditors = function (dirtyState) {
            var editors = [];
            var stacks = this.editorGroupService.getStacksModel();
            stacks.groups.forEach(function (group) {
                group.getEditors().forEach(function (editor) {
                    if (editor instanceof fileEditorInput_1.FileEditorInput) {
                        if (!!editor.isDirty() === dirtyState) {
                            editors.push(editor);
                        }
                    }
                    else if (editor instanceof editor_1.SideBySideEditorInput) {
                        var master = editor.master;
                        var details = editor.details;
                        if (master instanceof fileEditorInput_1.FileEditorInput) {
                            if (!!master.isDirty() === dirtyState) {
                                editors.push(master);
                            }
                        }
                        if (details instanceof fileEditorInput_1.FileEditorInput) {
                            if (!!details.isDirty() === dirtyState) {
                                editors.push(details);
                            }
                        }
                    }
                });
            });
            return editors;
        };
        FileEditorTracker.prototype.handleMovedFileInOpenedEditors = function (oldResource, newResource) {
            var _this = this;
            var stacks = this.editorGroupService.getStacksModel();
            stacks.groups.forEach(function (group) {
                group.getEditors().forEach(function (input) {
                    if (input instanceof fileEditorInput_1.FileEditorInput) {
                        var resource = input.getResource();
                        // Update Editor if file (or any parent of the input) got renamed or moved
                        if (paths.isEqualOrParent(resource.fsPath, oldResource.fsPath, !platform_1.isLinux /* ignorecase */)) {
                            var reopenFileResource = void 0;
                            if (oldResource.toString() === resource.toString()) {
                                reopenFileResource = newResource; // file got moved
                            }
                            else {
                                var index = files_2.indexOf(resource.fsPath, oldResource.fsPath, !platform_1.isLinux /* ignorecase */);
                                reopenFileResource = uri_1.default.file(paths.join(newResource.fsPath, resource.fsPath.substr(index + oldResource.fsPath.length + 1))); // parent folder got moved
                            }
                            // Reopen
                            _this.editorService.openEditor({
                                resource: reopenFileResource,
                                options: {
                                    preserveFocus: true,
                                    pinned: group.isPinned(input),
                                    index: group.indexOf(input),
                                    inactive: !group.isActive(input),
                                    viewState: _this.getViewStateFor(oldResource, group)
                                }
                            }, stacks.positionOfGroup(group)).done(null, errors.onUnexpectedError);
                        }
                    }
                });
            });
        };
        FileEditorTracker.prototype.getViewStateFor = function (resource, group) {
            var stacks = this.editorGroupService.getStacksModel();
            var editors = this.editorService.getVisibleEditors();
            for (var i = 0; i < editors.length; i++) {
                var editor = editors[i];
                if (editor && editor.position === stacks.positionOfGroup(group)) {
                    var resource_1 = editor_1.toResource(editor.input, { filter: 'file' });
                    if (resource_1 && paths.isEqual(resource_1.fsPath, resource_1.fsPath)) {
                        var control = editor.getControl();
                        if (editorCommon_1.isCommonCodeEditor(control)) {
                            return control.saveViewState();
                        }
                    }
                }
            }
            return void 0;
        };
        FileEditorTracker.prototype.handleUpdates = function (e) {
            var _this = this;
            // Collect distinct (saved) models to update.
            //
            // Note: we also consider the added event because it could be that a file was added
            // and updated right after.
            var modelsToUpdate = arrays_1.distinct(e.getUpdated().concat(e.getAdded()).map(function (u) { return _this.textFileService.models.get(u.resource); })
                .filter(function (model) { return model && !model.isDirty(); }), function (m) { return m.getResource().toString(); });
            // Handle updates to visible editors specially to preserve view state
            var visibleModels = this.handleUpdatesToVisibleEditors(e);
            // Handle updates to remaining models that are not visible
            modelsToUpdate.forEach(function (model) {
                if (visibleModels.indexOf(model) >= 0) {
                    return; // already updated
                }
                // Load model to update
                model.load().done(null, errors.onUnexpectedError);
            });
        };
        FileEditorTracker.prototype.handleUpdatesToVisibleEditors = function (e) {
            var _this = this;
            var updatedModels = [];
            var editors = this.editorService.getVisibleEditors();
            editors.forEach(function (editor) {
                var fileResource = editor_1.toResource(editor.input, { filter: 'file', supportSideBySide: true });
                // File Editor
                if (fileResource) {
                    // File got added or updated, so check for model and update
                    // Note: we also consider the added event because it could be that a file was added
                    // and updated right after.
                    if (e.contains(fileResource, files_2.FileChangeType.UPDATED) || e.contains(fileResource, files_2.FileChangeType.ADDED)) {
                        // Text file: check for last save time
                        var textModel_1 = _this.textFileService.models.get(fileResource);
                        if (textModel_1) {
                            // We only ever update models that are in good saved state
                            if (!textModel_1.isDirty()) {
                                var codeEditor_1 = editor.getControl();
                                var viewState_1 = codeEditor_1.saveViewState();
                                var lastKnownEtag_1 = textModel_1.getETag();
                                textModel_1.load().done(function () {
                                    // only restore the view state if the model changed and the editor is still showing it
                                    if (textModel_1.getETag() !== lastKnownEtag_1 && codeEditor_1.getModel() === textModel_1.textEditorModel) {
                                        codeEditor_1.restoreViewState(viewState_1);
                                    }
                                }, errors.onUnexpectedError);
                                updatedModels.push(textModel_1);
                            }
                        }
                        else if (editor.getId() === files_1.BINARY_FILE_EDITOR_ID) {
                            _this.editorService.openEditor(editor.input, { forceOpen: true, preserveFocus: true }, editor.position).done(null, errors.onUnexpectedError);
                        }
                    }
                }
            });
            return updatedModels;
        };
        FileEditorTracker.prototype.dispose = function () {
            this.toUnbind = lifecycle_2.dispose(this.toUnbind);
        };
        FileEditorTracker = __decorate([
            __param(0, editorService_1.IWorkbenchEditorService),
            __param(1, textfiles_1.ITextFileService),
            __param(2, lifecycle_1.ILifecycleService),
            __param(3, groupService_1.IEditorGroupService),
            __param(4, files_2.IFileService),
            __param(5, environment_1.IEnvironmentService),
            __param(6, configuration_1.IConfigurationService)
        ], FileEditorTracker);
        return FileEditorTracker;
    }());
    exports.FileEditorTracker = FileEditorTracker;
});
//# sourceMappingURL=fileEditorTracker.js.map