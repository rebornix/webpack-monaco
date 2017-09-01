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
define(["require", "exports", "vs/base/common/winjs.base", "vs/nls", "vs/base/common/platform", "vs/base/common/async", "vs/base/common/paths", "vs/base/common/uri", "vs/base/common/errors", "vs/base/common/errorMessage", "vs/base/common/strings", "vs/base/common/events", "vs/base/common/severity", "vs/base/common/diagnostics", "vs/base/common/actions", "vs/base/browser/ui/inputbox/inputBox", "vs/base/common/lifecycle", "vs/workbench/parts/files/common/files", "vs/base/common/labels", "vs/workbench/services/textfile/common/textfiles", "vs/platform/files/common/files", "vs/workbench/common/editor", "vs/workbench/parts/files/common/explorerModel", "vs/workbench/services/untitled/common/untitledEditorService", "vs/workbench/services/editor/common/editorService", "vs/workbench/browser/viewlet", "vs/workbench/services/group/common/groupService", "vs/platform/quickOpen/common/quickOpen", "vs/workbench/services/history/common/history", "vs/workbench/services/viewlet/browser/viewlet", "vs/platform/editor/common/editor", "vs/platform/instantiation/common/instantiation", "vs/platform/message/common/message", "vs/platform/workspace/common/workspace", "vs/editor/common/services/codeEditorService", "vs/workbench/services/backup/common/backup", "vs/platform/windows/common/windows", "vs/workbench/parts/files/browser/fileCommands", "vs/platform/environment/common/environment", "vs/editor/common/services/resolverService", "vs/editor/common/services/modelService", "vs/editor/common/services/modeService", "vs/css!./media/fileactions"], function (require, exports, winjs_base_1, nls, platform_1, async_1, paths, uri_1, errors, errorMessage_1, strings, events_1, severity_1, diagnostics, actions_1, inputBox_1, lifecycle_1, files_1, labels, textfiles_1, files_2, editor_1, explorerModel_1, untitledEditorService_1, editorService_1, viewlet_1, groupService_1, quickOpen_1, history_1, viewlet_2, editor_2, instantiation_1, message_1, workspace_1, codeEditorService_1, backup_1, windows_1, fileCommands_1, environment_1, resolverService_1, modelService_1, modeService_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var BaseErrorReportingAction = (function (_super) {
        __extends(BaseErrorReportingAction, _super);
        function BaseErrorReportingAction(id, label, _messageService) {
            var _this = _super.call(this, id, label) || this;
            _this._messageService = _messageService;
            return _this;
        }
        Object.defineProperty(BaseErrorReportingAction.prototype, "messageService", {
            get: function () {
                return this._messageService;
            },
            enumerable: true,
            configurable: true
        });
        BaseErrorReportingAction.prototype.onError = function (error) {
            if (error.message === 'string') {
                error = error.message;
            }
            this._messageService.show(message_1.Severity.Error, errorMessage_1.toErrorMessage(error, false));
        };
        BaseErrorReportingAction.prototype.onErrorWithRetry = function (error, retry, extraAction) {
            var actions = [
                new actions_1.Action(this.id, nls.localize('retry', "Retry"), null, true, function () { return retry(); }),
                message_1.CancelAction
            ];
            if (extraAction) {
                actions.unshift(extraAction);
            }
            var errorWithRetry = {
                actions: actions,
                message: errorMessage_1.toErrorMessage(error, false)
            };
            this._messageService.show(message_1.Severity.Error, errorWithRetry);
        };
        return BaseErrorReportingAction;
    }(actions_1.Action));
    exports.BaseErrorReportingAction = BaseErrorReportingAction;
    var BaseFileAction = (function (_super) {
        __extends(BaseFileAction, _super);
        function BaseFileAction(id, label, _fileService, _messageService, _textFileService) {
            var _this = _super.call(this, id, label, _messageService) || this;
            _this._fileService = _fileService;
            _this._textFileService = _textFileService;
            _this.enabled = false;
            return _this;
        }
        Object.defineProperty(BaseFileAction.prototype, "fileService", {
            get: function () {
                return this._fileService;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseFileAction.prototype, "textFileService", {
            get: function () {
                return this._textFileService;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseFileAction.prototype, "element", {
            get: function () {
                return this._element;
            },
            set: function (element) {
                this._element = element;
            },
            enumerable: true,
            configurable: true
        });
        BaseFileAction.prototype._isEnabled = function () {
            return true;
        };
        BaseFileAction.prototype._updateEnablement = function () {
            this.enabled = !!(this._fileService && this._isEnabled());
        };
        BaseFileAction = __decorate([
            __param(2, files_2.IFileService),
            __param(3, message_1.IMessageService),
            __param(4, textfiles_1.ITextFileService)
        ], BaseFileAction);
        return BaseFileAction;
    }(BaseErrorReportingAction));
    exports.BaseFileAction = BaseFileAction;
    var TriggerRenameFileAction = (function (_super) {
        __extends(TriggerRenameFileAction, _super);
        function TriggerRenameFileAction(tree, element, fileService, messageService, textFileService, instantiationService) {
            var _this = _super.call(this, TriggerRenameFileAction.ID, nls.localize('rename', "Rename"), fileService, messageService, textFileService) || this;
            _this.tree = tree;
            _this.element = element;
            _this.renameAction = instantiationService.createInstance(RenameFileAction, element);
            _this._updateEnablement();
            return _this;
        }
        TriggerRenameFileAction.prototype.validateFileName = function (parent, name) {
            return this.renameAction.validateFileName(this.element.parent, name);
        };
        TriggerRenameFileAction.prototype.run = function (context) {
            var _this = this;
            if (!context) {
                return winjs_base_1.TPromise.wrapError(new Error('No context provided to BaseEnableFileRenameAction.'));
            }
            var viewletState = context.viewletState;
            if (!viewletState) {
                return winjs_base_1.TPromise.wrapError(new Error('Invalid viewlet state provided to BaseEnableFileRenameAction.'));
            }
            var stat = context.stat;
            if (!stat) {
                return winjs_base_1.TPromise.wrapError(new Error('Invalid stat provided to BaseEnableFileRenameAction.'));
            }
            viewletState.setEditable(stat, {
                action: this.renameAction,
                validator: function (value) {
                    var message = _this.validateFileName(_this.element.parent, value);
                    if (!message) {
                        return null;
                    }
                    return {
                        content: message,
                        formatContent: true,
                        type: inputBox_1.MessageType.ERROR
                    };
                }
            });
            this.tree.refresh(stat, false).then(function () {
                _this.tree.setHighlight(stat);
                var unbind = _this.tree.addListener(events_1.EventType.HIGHLIGHT, function (e) {
                    if (!e.highlight) {
                        viewletState.clearEditable(stat);
                        _this.tree.refresh(stat).done(null, errors.onUnexpectedError);
                        unbind.dispose();
                    }
                });
            }).done(null, errors.onUnexpectedError);
            return void 0;
        };
        TriggerRenameFileAction.ID = 'renameFile';
        TriggerRenameFileAction = __decorate([
            __param(2, files_2.IFileService),
            __param(3, message_1.IMessageService),
            __param(4, textfiles_1.ITextFileService),
            __param(5, instantiation_1.IInstantiationService)
        ], TriggerRenameFileAction);
        return TriggerRenameFileAction;
    }(BaseFileAction));
    exports.TriggerRenameFileAction = TriggerRenameFileAction;
    var BaseRenameAction = (function (_super) {
        __extends(BaseRenameAction, _super);
        function BaseRenameAction(id, label, element, fileService, messageService, textFileService) {
            var _this = _super.call(this, id, label, fileService, messageService, textFileService) || this;
            _this.element = element;
            return _this;
        }
        BaseRenameAction.prototype.run = function (context) {
            var _this = this;
            if (!context) {
                return winjs_base_1.TPromise.wrapError(new Error('No context provided to BaseRenameFileAction.'));
            }
            var name = context.value;
            if (!name) {
                return winjs_base_1.TPromise.wrapError(new Error('No new name provided to BaseRenameFileAction.'));
            }
            // Automatically trim whitespaces and trailing dots to produce nice file names
            name = getWellFormedFileName(name);
            var existingName = getWellFormedFileName(this.element.name);
            // Return early if name is invalid or didn't change
            if (name === existingName || this.validateFileName(this.element.parent, name)) {
                return winjs_base_1.TPromise.as(null);
            }
            // Call function and Emit Event through viewer
            var promise = this.runAction(name).then(null, function (error) {
                _this.onError(error);
            });
            return promise;
        };
        BaseRenameAction.prototype.validateFileName = function (parent, name) {
            var source = this.element.name;
            var target = name;
            if (!platform_1.isLinux) {
                source = source.toLowerCase();
                target = target.toLowerCase();
            }
            if (getWellFormedFileName(source) === getWellFormedFileName(target)) {
                return null;
            }
            return validateFileName(parent, name, false);
        };
        BaseRenameAction = __decorate([
            __param(3, files_2.IFileService),
            __param(4, message_1.IMessageService),
            __param(5, textfiles_1.ITextFileService)
        ], BaseRenameAction);
        return BaseRenameAction;
    }(BaseFileAction));
    exports.BaseRenameAction = BaseRenameAction;
    var RenameFileAction = (function (_super) {
        __extends(RenameFileAction, _super);
        function RenameFileAction(element, fileService, messageService, textFileService, backupFileService) {
            var _this = _super.call(this, RenameFileAction.ID, nls.localize('rename', "Rename"), element, fileService, messageService, textFileService) || this;
            _this.backupFileService = backupFileService;
            _this._updateEnablement();
            return _this;
        }
        RenameFileAction.prototype.runAction = function (newName) {
            var _this = this;
            var dirty = this.textFileService.getDirty().filter(function (d) { return paths.isEqualOrParent(d.fsPath, _this.element.resource.fsPath, !platform_1.isLinux /* ignorecase */); });
            var dirtyRenamed = [];
            return winjs_base_1.TPromise.join(dirty.map(function (d) {
                var targetPath = paths.join(_this.element.parent.resource.fsPath, newName);
                var renamed;
                // If the dirty file itself got moved, just reparent it to the target folder
                if (paths.isEqual(_this.element.resource.fsPath, d.fsPath)) {
                    renamed = uri_1.default.file(targetPath);
                }
                else {
                    renamed = uri_1.default.file(paths.join(targetPath, d.fsPath.substr(_this.element.resource.fsPath.length + 1)));
                }
                dirtyRenamed.push(renamed);
                var model = _this.textFileService.models.get(d);
                return _this.backupFileService.backupResource(renamed, model.getValue(), model.getVersionId());
            }))
                .then(function () { return _this.textFileService.revertAll(dirty, { soft: true /* do not attempt to load content from disk */ }); })
                .then(function () { return _this.fileService.rename(_this.element.resource, newName).then(null, function (error) {
                return winjs_base_1.TPromise.join(dirtyRenamed.map(function (d) { return _this.backupFileService.discardResourceBackup(d); })).then(function () {
                    _this.onErrorWithRetry(error, function () { return _this.runAction(newName); });
                });
            }); })
                .then(function () {
                return winjs_base_1.TPromise.join(dirtyRenamed.map(function (t) { return _this.textFileService.models.loadOrCreate(t); }));
            });
        };
        RenameFileAction.ID = 'workbench.files.action.renameFile';
        RenameFileAction = __decorate([
            __param(1, files_2.IFileService),
            __param(2, message_1.IMessageService),
            __param(3, textfiles_1.ITextFileService),
            __param(4, backup_1.IBackupFileService)
        ], RenameFileAction);
        return RenameFileAction;
    }(BaseRenameAction));
    /* Base New File/Folder Action */
    var BaseNewAction = (function (_super) {
        __extends(BaseNewAction, _super);
        function BaseNewAction(id, label, tree, isFile, editableAction, element, fileService, messageService, textFileService) {
            var _this = _super.call(this, id, label, fileService, messageService, textFileService) || this;
            if (element) {
                _this.presetFolder = element.isDirectory ? element : element.parent;
            }
            _this.tree = tree;
            _this.isFile = isFile;
            _this.renameAction = editableAction;
            return _this;
        }
        BaseNewAction.prototype.run = function (context) {
            var _this = this;
            if (!context) {
                return winjs_base_1.TPromise.wrapError(new Error('No context provided to BaseNewAction.'));
            }
            var viewletState = context.viewletState;
            if (!viewletState) {
                return winjs_base_1.TPromise.wrapError(new Error('Invalid viewlet state provided to BaseNewAction.'));
            }
            var folder = this.presetFolder;
            if (!folder) {
                var focus_1 = this.tree.getFocus();
                if (focus_1) {
                    folder = focus_1.isDirectory ? focus_1 : focus_1.parent;
                }
                else {
                    var input = this.tree.getInput();
                    folder = input instanceof explorerModel_1.Model ? input.roots[0] : input;
                }
            }
            if (!folder) {
                return winjs_base_1.TPromise.wrapError(new Error('Invalid parent folder to create.'));
            }
            return this.tree.reveal(folder, 0.5).then(function () {
                return _this.tree.expand(folder).then(function () {
                    var stat = explorerModel_1.NewStatPlaceholder.addNewStatPlaceholder(folder, !_this.isFile);
                    _this.renameAction.element = stat;
                    viewletState.setEditable(stat, {
                        action: _this.renameAction,
                        validator: function (value) {
                            var message = _this.renameAction.validateFileName(folder, value);
                            if (!message) {
                                return null;
                            }
                            return {
                                content: message,
                                formatContent: true,
                                type: inputBox_1.MessageType.ERROR
                            };
                        }
                    });
                    return _this.tree.refresh(folder).then(function () {
                        return _this.tree.expand(folder).then(function () {
                            return _this.tree.reveal(stat, 0.5).then(function () {
                                _this.tree.setHighlight(stat);
                                var unbind = _this.tree.addListener(events_1.EventType.HIGHLIGHT, function (e) {
                                    if (!e.highlight) {
                                        stat.destroy();
                                        _this.tree.refresh(folder).done(null, errors.onUnexpectedError);
                                        unbind.dispose();
                                    }
                                });
                            });
                        });
                    });
                });
            });
        };
        BaseNewAction = __decorate([
            __param(6, files_2.IFileService),
            __param(7, message_1.IMessageService),
            __param(8, textfiles_1.ITextFileService)
        ], BaseNewAction);
        return BaseNewAction;
    }(BaseFileAction));
    exports.BaseNewAction = BaseNewAction;
    /* New File */
    var NewFileAction = (function (_super) {
        __extends(NewFileAction, _super);
        function NewFileAction(tree, element, fileService, messageService, textFileService, instantiationService) {
            var _this = _super.call(this, 'explorer.newFile', nls.localize('newFile', "New File"), tree, true, instantiationService.createInstance(CreateFileAction, element), null, fileService, messageService, textFileService) || this;
            _this.class = 'explorer-action new-file';
            _this._updateEnablement();
            return _this;
        }
        NewFileAction = __decorate([
            __param(2, files_2.IFileService),
            __param(3, message_1.IMessageService),
            __param(4, textfiles_1.ITextFileService),
            __param(5, instantiation_1.IInstantiationService)
        ], NewFileAction);
        return NewFileAction;
    }(BaseNewAction));
    exports.NewFileAction = NewFileAction;
    /* New Folder */
    var NewFolderAction = (function (_super) {
        __extends(NewFolderAction, _super);
        function NewFolderAction(tree, element, fileService, messageService, textFileService, instantiationService) {
            var _this = _super.call(this, 'explorer.newFolder', nls.localize('newFolder', "New Folder"), tree, false, instantiationService.createInstance(CreateFolderAction, element), null, fileService, messageService, textFileService) || this;
            _this.class = 'explorer-action new-folder';
            _this._updateEnablement();
            return _this;
        }
        NewFolderAction = __decorate([
            __param(2, files_2.IFileService),
            __param(3, message_1.IMessageService),
            __param(4, textfiles_1.ITextFileService),
            __param(5, instantiation_1.IInstantiationService)
        ], NewFolderAction);
        return NewFolderAction;
    }(BaseNewAction));
    exports.NewFolderAction = NewFolderAction;
    var BaseGlobalNewAction = (function (_super) {
        __extends(BaseGlobalNewAction, _super);
        function BaseGlobalNewAction(id, label, viewletService, instantiationService, messageService) {
            var _this = _super.call(this, id, label) || this;
            _this.viewletService = viewletService;
            _this.instantiationService = instantiationService;
            _this.messageService = messageService;
            return _this;
        }
        BaseGlobalNewAction.prototype.run = function () {
            var _this = this;
            return this.viewletService.openViewlet(files_1.VIEWLET_ID, true).then(function (viewlet) {
                return winjs_base_1.TPromise.timeout(100).then(function () {
                    viewlet.focus();
                    var explorer = viewlet;
                    var explorerView = explorer.getExplorerView();
                    // Not having a folder opened
                    if (!explorerView) {
                        return _this.messageService.show(message_1.Severity.Info, nls.localize('openFolderFirst', "Open a folder first to create files or folders within."));
                    }
                    if (!explorerView.isExpanded()) {
                        explorerView.expand();
                    }
                    var action = _this.toDispose = _this.instantiationService.createInstance(_this.getAction(), explorerView.getViewer(), null);
                    return explorer.getActionRunner().run(action);
                });
            });
        };
        BaseGlobalNewAction.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            if (this.toDispose) {
                this.toDispose.dispose();
                this.toDispose = null;
            }
        };
        BaseGlobalNewAction = __decorate([
            __param(2, viewlet_2.IViewletService),
            __param(3, instantiation_1.IInstantiationService),
            __param(4, message_1.IMessageService)
        ], BaseGlobalNewAction);
        return BaseGlobalNewAction;
    }(actions_1.Action));
    exports.BaseGlobalNewAction = BaseGlobalNewAction;
    /* Create new file from anywhere: Open untitled */
    var GlobalNewUntitledFileAction = (function (_super) {
        __extends(GlobalNewUntitledFileAction, _super);
        function GlobalNewUntitledFileAction(id, label, editorService) {
            var _this = _super.call(this, id, label) || this;
            _this.editorService = editorService;
            return _this;
        }
        GlobalNewUntitledFileAction.prototype.run = function () {
            return this.editorService.openEditor({ options: { pinned: true } }); // untitled are always pinned
        };
        GlobalNewUntitledFileAction.ID = 'workbench.action.files.newUntitledFile';
        GlobalNewUntitledFileAction.LABEL = nls.localize('newUntitledFile', "New Untitled File");
        GlobalNewUntitledFileAction = __decorate([
            __param(2, editorService_1.IWorkbenchEditorService)
        ], GlobalNewUntitledFileAction);
        return GlobalNewUntitledFileAction;
    }(actions_1.Action));
    exports.GlobalNewUntitledFileAction = GlobalNewUntitledFileAction;
    /* Create new file from anywhere */
    var GlobalNewFileAction = (function (_super) {
        __extends(GlobalNewFileAction, _super);
        function GlobalNewFileAction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GlobalNewFileAction.prototype.getAction = function () {
            return NewFileAction;
        };
        GlobalNewFileAction.ID = 'explorer.newFile';
        GlobalNewFileAction.LABEL = nls.localize('newFile', "New File");
        return GlobalNewFileAction;
    }(BaseGlobalNewAction));
    exports.GlobalNewFileAction = GlobalNewFileAction;
    /* Create new folder from anywhere */
    var GlobalNewFolderAction = (function (_super) {
        __extends(GlobalNewFolderAction, _super);
        function GlobalNewFolderAction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GlobalNewFolderAction.prototype.getAction = function () {
            return NewFolderAction;
        };
        GlobalNewFolderAction.ID = 'explorer.newFolder';
        GlobalNewFolderAction.LABEL = nls.localize('newFolder', "New Folder");
        return GlobalNewFolderAction;
    }(BaseGlobalNewAction));
    exports.GlobalNewFolderAction = GlobalNewFolderAction;
    /* Create New File/Folder (only used internally by explorerViewer) */
    var BaseCreateAction = (function (_super) {
        __extends(BaseCreateAction, _super);
        function BaseCreateAction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        BaseCreateAction.prototype.validateFileName = function (parent, name) {
            if (this.element instanceof explorerModel_1.NewStatPlaceholder) {
                return validateFileName(parent, name, false);
            }
            return _super.prototype.validateFileName.call(this, parent, name);
        };
        return BaseCreateAction;
    }(BaseRenameAction));
    exports.BaseCreateAction = BaseCreateAction;
    /* Create New File (only used internally by explorerViewer) */
    var CreateFileAction = (function (_super) {
        __extends(CreateFileAction, _super);
        function CreateFileAction(element, fileService, editorService, messageService, textFileService) {
            var _this = _super.call(this, CreateFileAction.ID, CreateFileAction.LABEL, element, fileService, messageService, textFileService) || this;
            _this.editorService = editorService;
            _this._updateEnablement();
            return _this;
        }
        CreateFileAction.prototype.runAction = function (fileName) {
            var _this = this;
            return this.fileService.createFile(uri_1.default.file(paths.join(this.element.parent.resource.fsPath, fileName))).then(function (stat) {
                return _this.editorService.openEditor({ resource: stat.resource, options: { pinned: true } });
            }, function (error) {
                _this.onErrorWithRetry(error, function () { return _this.runAction(fileName); });
            });
        };
        CreateFileAction.ID = 'workbench.files.action.createFileFromExplorer';
        CreateFileAction.LABEL = nls.localize('createNewFile', "New File");
        CreateFileAction = __decorate([
            __param(1, files_2.IFileService),
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, message_1.IMessageService),
            __param(4, textfiles_1.ITextFileService)
        ], CreateFileAction);
        return CreateFileAction;
    }(BaseCreateAction));
    exports.CreateFileAction = CreateFileAction;
    /* Create New Folder (only used internally by explorerViewer) */
    var CreateFolderAction = (function (_super) {
        __extends(CreateFolderAction, _super);
        function CreateFolderAction(element, fileService, messageService, textFileService) {
            var _this = _super.call(this, CreateFolderAction.ID, CreateFolderAction.LABEL, null, fileService, messageService, textFileService) || this;
            _this._updateEnablement();
            return _this;
        }
        CreateFolderAction.prototype.runAction = function (fileName) {
            var _this = this;
            return this.fileService.createFolder(uri_1.default.file(paths.join(this.element.parent.resource.fsPath, fileName))).then(null, function (error) {
                _this.onErrorWithRetry(error, function () { return _this.runAction(fileName); });
            });
        };
        CreateFolderAction.ID = 'workbench.files.action.createFolderFromExplorer';
        CreateFolderAction.LABEL = nls.localize('createNewFolder', "New Folder");
        CreateFolderAction = __decorate([
            __param(1, files_2.IFileService),
            __param(2, message_1.IMessageService),
            __param(3, textfiles_1.ITextFileService)
        ], CreateFolderAction);
        return CreateFolderAction;
    }(BaseCreateAction));
    exports.CreateFolderAction = CreateFolderAction;
    var BaseDeleteFileAction = (function (_super) {
        __extends(BaseDeleteFileAction, _super);
        function BaseDeleteFileAction(id, label, tree, element, useTrash, fileService, messageService, textFileService) {
            var _this = _super.call(this, id, label, fileService, messageService, textFileService) || this;
            _this.tree = tree;
            _this.element = element;
            _this.useTrash = useTrash && !paths.isUNC(element.resource.fsPath); // on UNC shares there is no trash
            _this._updateEnablement();
            return _this;
        }
        BaseDeleteFileAction.prototype.run = function (context) {
            var _this = this;
            // Remove highlight
            if (this.tree) {
                this.tree.clearHighlight();
            }
            // Read context
            if (context) {
                if (context.event) {
                    var bypassTrash = (platform_1.isMacintosh && context.event.altKey) || (!platform_1.isMacintosh && context.event.shiftKey);
                    if (bypassTrash) {
                        this.useTrash = false;
                    }
                }
                else if (typeof context.useTrash === 'boolean') {
                    this.useTrash = context.useTrash;
                }
            }
            var primaryButton;
            if (this.useTrash) {
                primaryButton = platform_1.isWindows ? nls.localize('deleteButtonLabelRecycleBin', "&&Move to Recycle Bin") : nls.localize({ key: 'deleteButtonLabelTrash', comment: ['&& denotes a mnemonic'] }, "&&Move to Trash");
            }
            else {
                primaryButton = nls.localize({ key: 'deleteButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Delete");
            }
            // Handle dirty
            var revertPromise = winjs_base_1.TPromise.as(null);
            var dirty = this.textFileService.getDirty().filter(function (d) { return paths.isEqualOrParent(d.fsPath, _this.element.resource.fsPath, !platform_1.isLinux /* ignorecase */); });
            if (dirty.length) {
                var message = void 0;
                if (this.element.isDirectory) {
                    if (dirty.length === 1) {
                        message = nls.localize('dirtyMessageFolderOneDelete', "You are deleting a folder with unsaved changes in 1 file. Do you want to continue?");
                    }
                    else {
                        message = nls.localize('dirtyMessageFolderDelete', "You are deleting a folder with unsaved changes in {0} files. Do you want to continue?", dirty.length);
                    }
                }
                else {
                    message = nls.localize('dirtyMessageFileDelete', "You are deleting a file with unsaved changes. Do you want to continue?");
                }
                var res = this.messageService.confirm({
                    message: message,
                    type: 'warning',
                    detail: nls.localize('dirtyWarning', "Your changes will be lost if you don't save them."),
                    primaryButton: primaryButton
                });
                if (!res) {
                    return winjs_base_1.TPromise.as(null);
                }
                this.skipConfirm = true; // since we already asked for confirmation
                revertPromise = this.textFileService.revertAll(dirty);
            }
            // Check if file is dirty in editor and save it to avoid data loss
            return revertPromise.then(function () {
                // Ask for Confirm
                if (!_this.skipConfirm) {
                    var confirm_1;
                    if (_this.useTrash) {
                        confirm_1 = {
                            message: _this.element.isDirectory ? nls.localize('confirmMoveTrashMessageFolder', "Are you sure you want to delete '{0}' and its contents?", _this.element.name) : nls.localize('confirmMoveTrashMessageFile', "Are you sure you want to delete '{0}'?", _this.element.name),
                            detail: platform_1.isWindows ? nls.localize('undoBin', "You can restore from the recycle bin.") : nls.localize('undoTrash', "You can restore from the trash."),
                            primaryButton: primaryButton,
                            type: 'question'
                        };
                    }
                    else {
                        confirm_1 = {
                            message: _this.element.isDirectory ? nls.localize('confirmDeleteMessageFolder', "Are you sure you want to permanently delete '{0}' and its contents?", _this.element.name) : nls.localize('confirmDeleteMessageFile', "Are you sure you want to permanently delete '{0}'?", _this.element.name),
                            detail: nls.localize('irreversible', "This action is irreversible!"),
                            primaryButton: primaryButton,
                            type: 'warning'
                        };
                    }
                    if (!_this.messageService.confirm(confirm_1)) {
                        return winjs_base_1.TPromise.as(null);
                    }
                }
                // Call function
                var servicePromise = _this.fileService.del(_this.element.resource, _this.useTrash).then(function () {
                    if (_this.element.parent) {
                        _this.tree.setFocus(_this.element.parent); // move focus to parent
                    }
                }, function (error) {
                    // Allow to retry
                    var extraAction;
                    if (_this.useTrash) {
                        extraAction = new actions_1.Action('permanentDelete', nls.localize('permDelete', "Delete Permanently"), null, true, function () { _this.useTrash = false; _this.skipConfirm = true; return _this.run(); });
                    }
                    _this.onErrorWithRetry(error, function () { return _this.run(); }, extraAction);
                    // Focus back to tree
                    _this.tree.DOMFocus();
                });
                return servicePromise;
            });
        };
        BaseDeleteFileAction = __decorate([
            __param(5, files_2.IFileService),
            __param(6, message_1.IMessageService),
            __param(7, textfiles_1.ITextFileService)
        ], BaseDeleteFileAction);
        return BaseDeleteFileAction;
    }(BaseFileAction));
    exports.BaseDeleteFileAction = BaseDeleteFileAction;
    /* Move File/Folder to trash */
    var MoveFileToTrashAction = (function (_super) {
        __extends(MoveFileToTrashAction, _super);
        function MoveFileToTrashAction(tree, element, fileService, messageService, textFileService) {
            return _super.call(this, MoveFileToTrashAction.ID, nls.localize('delete', "Delete"), tree, element, true, fileService, messageService, textFileService) || this;
        }
        MoveFileToTrashAction.ID = 'moveFileToTrash';
        MoveFileToTrashAction = __decorate([
            __param(2, files_2.IFileService),
            __param(3, message_1.IMessageService),
            __param(4, textfiles_1.ITextFileService)
        ], MoveFileToTrashAction);
        return MoveFileToTrashAction;
    }(BaseDeleteFileAction));
    exports.MoveFileToTrashAction = MoveFileToTrashAction;
    /* Import File */
    var ImportFileAction = (function (_super) {
        __extends(ImportFileAction, _super);
        function ImportFileAction(tree, element, clazz, fileService, editorService, messageService, textFileService) {
            var _this = _super.call(this, ImportFileAction.ID, nls.localize('importFiles', "Import Files"), fileService, messageService, textFileService) || this;
            _this.editorService = editorService;
            _this.tree = tree;
            _this.element = element;
            if (clazz) {
                _this.class = clazz;
            }
            _this._updateEnablement();
            return _this;
        }
        ImportFileAction.prototype.getViewer = function () {
            return this.tree;
        };
        ImportFileAction.prototype.run = function (context) {
            var _this = this;
            var importPromise = winjs_base_1.TPromise.as(null).then(function () {
                var input = context.input;
                if (input.paths && input.paths.length > 0) {
                    // Find parent for import
                    var targetElement_1;
                    if (_this.element) {
                        targetElement_1 = _this.element;
                    }
                    else {
                        var input_1 = _this.tree.getInput();
                        targetElement_1 = _this.tree.getFocus() || (input_1 instanceof explorerModel_1.Model ? input_1.roots[0] : input_1);
                    }
                    if (!targetElement_1.isDirectory) {
                        targetElement_1 = targetElement_1.parent;
                    }
                    // Resolve target to check for name collisions and ask user
                    return _this.fileService.resolveFile(targetElement_1.resource).then(function (targetStat) {
                        // Check for name collisions
                        var targetNames = {};
                        targetStat.children.forEach(function (child) {
                            targetNames[platform_1.isLinux ? child.name : child.name.toLowerCase()] = child;
                        });
                        var overwrite = true;
                        if (input.paths.some(function (path) {
                            return !!targetNames[platform_1.isLinux ? paths.extname(path) : paths.extname(path).toLowerCase()];
                        })) {
                            var confirm_2 = {
                                message: nls.localize('confirmOverwrite', "A file or folder with the same name already exists in the destination folder. Do you want to replace it?"),
                                detail: nls.localize('irreversible', "This action is irreversible!"),
                                primaryButton: nls.localize({ key: 'replaceButtonLabel', comment: ['&& denotes a mnemonic'] }, "&&Replace"),
                                type: 'warning'
                            };
                            overwrite = _this.messageService.confirm(confirm_2);
                        }
                        if (!overwrite) {
                            return void 0;
                        }
                        // Run import in sequence
                        var importPromisesFactory = [];
                        input.paths.forEach(function (path) {
                            importPromisesFactory.push(function () {
                                var sourceFile = uri_1.default.file(path);
                                var targetFile = uri_1.default.file(paths.join(targetElement_1.resource.fsPath, paths.basename(path)));
                                // if the target exists and is dirty, make sure to revert it. otherwise the dirty contents
                                // of the target file would replace the contents of the imported file. since we already
                                // confirmed the overwrite before, this is OK.
                                var revertPromise = winjs_base_1.TPromise.as(null);
                                if (_this.textFileService.isDirty(targetFile)) {
                                    revertPromise = _this.textFileService.revertAll([targetFile], { soft: true });
                                }
                                return revertPromise.then(function () {
                                    return _this.fileService.importFile(sourceFile, targetElement_1.resource).then(function (res) {
                                        // if we only import one file, just open it directly
                                        if (input.paths.length === 1) {
                                            _this.editorService.openEditor({ resource: res.stat.resource, options: { pinned: true } }).done(null, errors.onUnexpectedError);
                                        }
                                    }, function (error) { return _this.onError(error); });
                                });
                            });
                        });
                        return async_1.sequence(importPromisesFactory);
                    });
                }
                return void 0;
            });
            return importPromise.then(function () {
                _this.tree.clearHighlight();
            }, function (error) {
                _this.onError(error);
                _this.tree.clearHighlight();
            });
        };
        ImportFileAction.ID = 'workbench.files.action.importFile';
        ImportFileAction = __decorate([
            __param(3, files_2.IFileService),
            __param(4, editorService_1.IWorkbenchEditorService),
            __param(5, message_1.IMessageService),
            __param(6, textfiles_1.ITextFileService)
        ], ImportFileAction);
        return ImportFileAction;
    }(BaseFileAction));
    exports.ImportFileAction = ImportFileAction;
    // Copy File/Folder
    var fileToCopy;
    var CopyFileAction = (function (_super) {
        __extends(CopyFileAction, _super);
        function CopyFileAction(tree, element, fileService, messageService, textFileService) {
            var _this = _super.call(this, CopyFileAction.ID, nls.localize('copyFile', "Copy"), fileService, messageService, textFileService) || this;
            _this.tree = tree;
            _this.element = element;
            _this._updateEnablement();
            return _this;
        }
        CopyFileAction.prototype.run = function () {
            // Remember as file/folder to copy
            fileToCopy = this.element;
            // Remove highlight
            if (this.tree) {
                this.tree.clearHighlight();
            }
            this.tree.DOMFocus();
            return winjs_base_1.TPromise.as(null);
        };
        CopyFileAction.ID = 'filesExplorer.copy';
        CopyFileAction = __decorate([
            __param(2, files_2.IFileService),
            __param(3, message_1.IMessageService),
            __param(4, textfiles_1.ITextFileService)
        ], CopyFileAction);
        return CopyFileAction;
    }(BaseFileAction));
    exports.CopyFileAction = CopyFileAction;
    // Paste File/Folder
    var PasteFileAction = (function (_super) {
        __extends(PasteFileAction, _super);
        function PasteFileAction(tree, element, fileService, messageService, textFileService, instantiationService) {
            var _this = _super.call(this, PasteFileAction.ID, nls.localize('pasteFile', "Paste"), fileService, messageService, textFileService) || this;
            _this.instantiationService = instantiationService;
            _this.tree = tree;
            _this.element = element;
            if (!_this.element) {
                var input = _this.tree.getInput();
                _this.element = input instanceof explorerModel_1.Model ? input.roots[0] : input;
            }
            _this._updateEnablement();
            return _this;
        }
        PasteFileAction.prototype._isEnabled = function () {
            // Need at least a file to copy
            if (!fileToCopy) {
                return false;
            }
            // Check if file was deleted or moved meanwhile
            var exists = fileToCopy.root.find(fileToCopy.resource);
            if (!exists) {
                fileToCopy = null;
                return false;
            }
            // Check if target is ancestor of pasted folder
            if (!paths.isEqual(this.element.resource.fsPath, fileToCopy.resource.fsPath) && paths.isEqualOrParent(this.element.resource.fsPath, fileToCopy.resource.fsPath, !platform_1.isLinux /* ignorecase */)) {
                return false;
            }
            return true;
        };
        PasteFileAction.prototype.run = function () {
            var _this = this;
            // Find target
            var target;
            if (this.element.resource.toString() === fileToCopy.resource.toString()) {
                target = this.element.parent;
            }
            else {
                target = this.element.isDirectory ? this.element : this.element.parent;
            }
            // Reuse duplicate action
            var pasteAction = this.instantiationService.createInstance(DuplicateFileAction, this.tree, fileToCopy, target);
            return pasteAction.run().then(function () {
                _this.tree.DOMFocus();
            });
        };
        PasteFileAction.ID = 'filesExplorer.paste';
        PasteFileAction = __decorate([
            __param(2, files_2.IFileService),
            __param(3, message_1.IMessageService),
            __param(4, textfiles_1.ITextFileService),
            __param(5, instantiation_1.IInstantiationService)
        ], PasteFileAction);
        return PasteFileAction;
    }(BaseFileAction));
    exports.PasteFileAction = PasteFileAction;
    exports.pasteIntoFocusedFilesExplorerViewItem = function (accessor) {
        var instantiationService = accessor.get(instantiation_1.IInstantiationService);
        fileCommands_1.withFocusedFilesExplorer(accessor).then(function (res) {
            if (res) {
                var pasteAction = instantiationService.createInstance(PasteFileAction, res.tree, res.tree.getFocus());
                if (pasteAction._isEnabled()) {
                    pasteAction.run().done(null, errors.onUnexpectedError);
                }
            }
        });
    };
    // Duplicate File/Folder
    var DuplicateFileAction = (function (_super) {
        __extends(DuplicateFileAction, _super);
        function DuplicateFileAction(tree, element, target, fileService, editorService, messageService, textFileService) {
            var _this = _super.call(this, 'workbench.files.action.duplicateFile', nls.localize('duplicateFile', "Duplicate"), fileService, messageService, textFileService) || this;
            _this.editorService = editorService;
            _this.tree = tree;
            _this.element = element;
            _this.target = (target && target.isDirectory) ? target : element.parent;
            _this._updateEnablement();
            return _this;
        }
        DuplicateFileAction.prototype.run = function () {
            var _this = this;
            // Remove highlight
            if (this.tree) {
                this.tree.clearHighlight();
            }
            // Copy File
            var result = this.fileService.copyFile(this.element.resource, this.findTarget()).then(function (stat) {
                if (!stat.isDirectory) {
                    return _this.editorService.openEditor({ resource: stat.resource, options: { pinned: true } });
                }
                return void 0;
            }, function (error) { return _this.onError(error); });
            return result;
        };
        DuplicateFileAction.prototype.findTarget = function () {
            var name = this.element.name;
            var candidate = uri_1.default.file(paths.join(this.target.resource.fsPath, name));
            while (true) {
                if (!this.element.root.find(candidate)) {
                    break;
                }
                name = this.toCopyName(name, this.element.isDirectory);
                candidate = uri_1.default.file(paths.join(this.target.resource.fsPath, name));
            }
            return candidate;
        };
        DuplicateFileAction.prototype.toCopyName = function (name, isFolder) {
            // file.1.txt=>file.2.txt
            if (!isFolder && name.match(/(.*\.)(\d+)(\..*)$/)) {
                return name.replace(/(.*\.)(\d+)(\..*)$/, function (match, g1, g2, g3) { return g1 + (parseInt(g2) + 1) + g3; });
            }
            // file.txt=>file.1.txt
            var lastIndexOfDot = name.lastIndexOf('.');
            if (!isFolder && lastIndexOfDot >= 0) {
                return strings.format('{0}.1{1}', name.substr(0, lastIndexOfDot), name.substr(lastIndexOfDot));
            }
            // folder.1=>folder.2
            if (isFolder && name.match(/(\d+)$/)) {
                return name.replace(/(\d+)$/, function (match) {
                    var groups = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        groups[_i - 1] = arguments[_i];
                    }
                    return String(parseInt(groups[0]) + 1);
                });
            }
            // file/folder=>file.1/folder.1
            return strings.format('{0}.1', name);
        };
        DuplicateFileAction = __decorate([
            __param(3, files_2.IFileService),
            __param(4, editorService_1.IWorkbenchEditorService),
            __param(5, message_1.IMessageService),
            __param(6, textfiles_1.ITextFileService)
        ], DuplicateFileAction);
        return DuplicateFileAction;
    }(BaseFileAction));
    exports.DuplicateFileAction = DuplicateFileAction;
    // Open to the side
    var OpenToSideAction = (function (_super) {
        __extends(OpenToSideAction, _super);
        function OpenToSideAction(tree, resource, preserveFocus, editorService) {
            var _this = _super.call(this, OpenToSideAction.ID, OpenToSideAction.LABEL) || this;
            _this.editorService = editorService;
            _this.tree = tree;
            _this.preserveFocus = preserveFocus;
            _this.resource = resource;
            _this.updateEnablement();
            return _this;
        }
        OpenToSideAction.prototype.updateEnablement = function () {
            var activeEditor = this.editorService.getActiveEditor();
            this.enabled = (!activeEditor || activeEditor.position !== editor_2.Position.THREE);
        };
        OpenToSideAction.prototype.run = function () {
            // Remove highlight
            this.tree.clearHighlight();
            // Set side input
            return this.editorService.openEditor({
                resource: this.resource,
                options: {
                    preserveFocus: this.preserveFocus
                }
            }, true);
        };
        OpenToSideAction.ID = 'explorer.openToSide';
        OpenToSideAction.LABEL = nls.localize('openToSide', "Open to the Side");
        OpenToSideAction = __decorate([
            __param(3, editorService_1.IWorkbenchEditorService)
        ], OpenToSideAction);
        return OpenToSideAction;
    }(actions_1.Action));
    exports.OpenToSideAction = OpenToSideAction;
    var globalResourceToCompare;
    var SelectResourceForCompareAction = (function (_super) {
        __extends(SelectResourceForCompareAction, _super);
        function SelectResourceForCompareAction(resource, tree) {
            var _this = _super.call(this, 'workbench.files.action.selectForCompare', nls.localize('compareSource', "Select for Compare")) || this;
            _this.tree = tree;
            _this.resource = resource;
            _this.enabled = true;
            return _this;
        }
        SelectResourceForCompareAction.prototype.run = function () {
            // Remember as source file to compare
            globalResourceToCompare = this.resource;
            // Remove highlight
            if (this.tree) {
                this.tree.clearHighlight();
                this.tree.DOMFocus();
            }
            return winjs_base_1.TPromise.as(null);
        };
        return SelectResourceForCompareAction;
    }(actions_1.Action));
    exports.SelectResourceForCompareAction = SelectResourceForCompareAction;
    // Global Compare with
    var GlobalCompareResourcesAction = (function (_super) {
        __extends(GlobalCompareResourcesAction, _super);
        function GlobalCompareResourcesAction(id, label, quickOpenService, instantiationService, editorService, historyService, contextService, messageService, environmentService) {
            var _this = _super.call(this, id, label) || this;
            _this.quickOpenService = quickOpenService;
            _this.instantiationService = instantiationService;
            _this.editorService = editorService;
            _this.historyService = historyService;
            _this.contextService = contextService;
            _this.messageService = messageService;
            _this.environmentService = environmentService;
            return _this;
        }
        GlobalCompareResourcesAction.prototype.run = function () {
            var _this = this;
            var activeResource = editor_1.toResource(this.editorService.getActiveEditorInput(), { filter: ['file', 'untitled'] });
            if (activeResource) {
                // Keep as resource to compare
                globalResourceToCompare = activeResource;
                var history_2 = this.historyService.getHistory();
                var picks = history_2.map(function (input) {
                    var resource;
                    var label;
                    var description;
                    if (input instanceof editor_1.EditorInput) {
                        resource = editor_1.toResource(input, { filter: ['file', 'untitled'] });
                    }
                    else {
                        resource = input.resource;
                    }
                    // Cannot compare file with self - exclude active file
                    if (!!resource && resource.toString() === globalResourceToCompare.toString()) {
                        return void 0;
                    }
                    if (!resource) {
                        return void 0; // only support to compare with files and untitled
                    }
                    label = paths.basename(resource.fsPath);
                    description = resource.scheme === 'file' ? labels.getPathLabel(paths.dirname(resource.fsPath), _this.contextService, _this.environmentService) : void 0;
                    return { input: input, resource: resource, label: label, description: description };
                }).filter(function (p) { return !!p; });
                return this.quickOpenService.pick(picks, { placeHolder: nls.localize('pickHistory', "Select a previously opened file to compare with"), autoFocus: { autoFocusFirstEntry: true }, matchOnDescription: true }).then(function (pick) {
                    if (pick) {
                        var compareAction_1 = _this.instantiationService.createInstance(CompareResourcesAction, pick.resource, null);
                        if (compareAction_1._isEnabled()) {
                            compareAction_1.run().done(function () { return compareAction_1.dispose(); });
                        }
                        else {
                            _this.messageService.show(message_1.Severity.Info, nls.localize('unableToFileToCompare', "The selected file can not be compared with '{0}'.", paths.basename(globalResourceToCompare.fsPath)));
                        }
                    }
                });
            }
            else {
                this.messageService.show(message_1.Severity.Info, nls.localize('openFileToCompare', "Open a file first to compare it with another file."));
            }
            return winjs_base_1.TPromise.as(true);
        };
        GlobalCompareResourcesAction.ID = 'workbench.files.action.compareFileWith';
        GlobalCompareResourcesAction.LABEL = nls.localize('globalCompareFile', "Compare Active File With...");
        GlobalCompareResourcesAction = __decorate([
            __param(2, quickOpen_1.IQuickOpenService),
            __param(3, instantiation_1.IInstantiationService),
            __param(4, editorService_1.IWorkbenchEditorService),
            __param(5, history_1.IHistoryService),
            __param(6, workspace_1.IWorkspaceContextService),
            __param(7, message_1.IMessageService),
            __param(8, environment_1.IEnvironmentService)
        ], GlobalCompareResourcesAction);
        return GlobalCompareResourcesAction;
    }(actions_1.Action));
    exports.GlobalCompareResourcesAction = GlobalCompareResourcesAction;
    // Compare with Resource
    var CompareResourcesAction = (function (_super) {
        __extends(CompareResourcesAction, _super);
        function CompareResourcesAction(resource, tree, editorService, contextService, environmentService) {
            var _this = _super.call(this, 'workbench.files.action.compareFiles', CompareResourcesAction.computeLabel(resource, contextService, environmentService)) || this;
            _this.editorService = editorService;
            _this.tree = tree;
            _this.resource = resource;
            return _this;
        }
        CompareResourcesAction.computeLabel = function (resource, contextService, environmentService) {
            if (globalResourceToCompare) {
                var leftResourceName = paths.basename(globalResourceToCompare.fsPath);
                var rightResourceName = paths.basename(resource.fsPath);
                // If the file names are identical, add more context by looking at the parent folder
                if (leftResourceName === rightResourceName) {
                    var folderPaths = labels.shorten([
                        labels.getPathLabel(paths.dirname(globalResourceToCompare.fsPath), contextService, environmentService),
                        labels.getPathLabel(paths.dirname(resource.fsPath), contextService, environmentService)
                    ]);
                    leftResourceName = paths.join(folderPaths[0], leftResourceName);
                    rightResourceName = paths.join(folderPaths[1], rightResourceName);
                }
                return nls.localize('compareWith', "Compare '{0}' with '{1}'", leftResourceName, rightResourceName);
            }
            return nls.localize('compareFiles', "Compare Files");
        };
        CompareResourcesAction.prototype._isEnabled = function () {
            // Need at least a resource to compare
            if (!globalResourceToCompare) {
                return false;
            }
            // Check if file was deleted or moved meanwhile (explorer only)
            if (this.tree) {
                var input = this.tree.getInput();
                if (input instanceof explorerModel_1.FileStat || input instanceof explorerModel_1.Model) {
                    var exists = input instanceof explorerModel_1.Model ? input.findClosest(globalResourceToCompare) : input.find(globalResourceToCompare);
                    if (!exists) {
                        globalResourceToCompare = null;
                        return false;
                    }
                }
            }
            // Check if target is identical to source
            if (this.resource.toString() === globalResourceToCompare.toString()) {
                return false;
            }
            return true;
        };
        CompareResourcesAction.prototype.run = function () {
            // Remove highlight
            if (this.tree) {
                this.tree.clearHighlight();
            }
            return this.editorService.openEditor({
                leftResource: globalResourceToCompare,
                rightResource: this.resource
            });
        };
        CompareResourcesAction = __decorate([
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, workspace_1.IWorkspaceContextService),
            __param(4, environment_1.IEnvironmentService)
        ], CompareResourcesAction);
        return CompareResourcesAction;
    }(actions_1.Action));
    exports.CompareResourcesAction = CompareResourcesAction;
    // Refresh Explorer Viewer
    var RefreshViewExplorerAction = (function (_super) {
        __extends(RefreshViewExplorerAction, _super);
        function RefreshViewExplorerAction(explorerView, clazz) {
            return _super.call(this, 'workbench.files.action.refreshFilesExplorer', nls.localize('refresh', "Refresh"), clazz, true, function (context) { return explorerView.refresh(); }) || this;
        }
        return RefreshViewExplorerAction;
    }(actions_1.Action));
    exports.RefreshViewExplorerAction = RefreshViewExplorerAction;
    var BaseSaveFileAction = (function (_super) {
        __extends(BaseSaveFileAction, _super);
        function BaseSaveFileAction(id, label, messageService) {
            return _super.call(this, id, label, messageService) || this;
        }
        BaseSaveFileAction.prototype.run = function (context) {
            var _this = this;
            return this.doRun(context).then(function () { return true; }, function (error) {
                _this.onError(error);
                return null;
            });
        };
        return BaseSaveFileAction;
    }(BaseErrorReportingAction));
    exports.BaseSaveFileAction = BaseSaveFileAction;
    var BaseSaveOneFileAction = (function (_super) {
        __extends(BaseSaveOneFileAction, _super);
        function BaseSaveOneFileAction(id, label, editorService, textFileService, editorGroupService, untitledEditorService, messageService) {
            var _this = _super.call(this, id, label, messageService) || this;
            _this.editorService = editorService;
            _this.textFileService = textFileService;
            _this.editorGroupService = editorGroupService;
            _this.untitledEditorService = untitledEditorService;
            _this.enabled = true;
            return _this;
        }
        BaseSaveOneFileAction.prototype.setResource = function (resource) {
            this.resource = resource;
        };
        BaseSaveOneFileAction.prototype.doRun = function (context) {
            var _this = this;
            var source;
            if (this.resource) {
                source = this.resource;
            }
            else {
                source = editor_1.toResource(this.editorService.getActiveEditorInput(), { supportSideBySide: true, filter: ['file', 'untitled'] });
            }
            if (source) {
                // Save As (or Save untitled with associated path)
                if (this.isSaveAs() || source.scheme === 'untitled') {
                    var encodingOfSource_1;
                    if (source.scheme === 'untitled') {
                        encodingOfSource_1 = this.untitledEditorService.getEncoding(source);
                    }
                    else if (source.scheme === 'file') {
                        var textModel = this.textFileService.models.get(source);
                        encodingOfSource_1 = textModel && textModel.getEncoding(); // text model can be null e.g. if this is a binary file!
                    }
                    var viewStateOfSource_1;
                    var activeEditor = this.editorService.getActiveEditor();
                    var editor = codeEditorService_1.getCodeEditor(activeEditor);
                    if (editor) {
                        var activeResource = editor_1.toResource(activeEditor.input, { supportSideBySide: true, filter: ['file', 'untitled'] });
                        if (activeResource && activeResource.toString() === source.toString()) {
                            viewStateOfSource_1 = editor.saveViewState();
                        }
                    }
                    // Special case: an untitled file with associated path gets saved directly unless "saveAs" is true
                    var savePromise = void 0;
                    if (!this.isSaveAs() && source.scheme === 'untitled' && this.untitledEditorService.hasAssociatedFilePath(source)) {
                        savePromise = this.textFileService.save(source).then(function (result) {
                            if (result) {
                                return uri_1.default.file(source.fsPath);
                            }
                            return null;
                        });
                    }
                    else {
                        savePromise = this.textFileService.saveAs(source);
                    }
                    return savePromise.then(function (target) {
                        if (!target || target.toString() === source.toString()) {
                            return void 0; // save canceled or same resource used
                        }
                        var replaceWith = {
                            resource: target,
                            encoding: encodingOfSource_1,
                            options: {
                                pinned: true,
                                viewState: viewStateOfSource_1
                            }
                        };
                        return _this.editorService.replaceEditors([{
                                toReplace: { resource: source },
                                replaceWith: replaceWith
                            }]).then(function () { return true; });
                    });
                }
                // Pin the active editor if we are saving it
                if (!this.resource) {
                    var editor = this.editorService.getActiveEditor();
                    if (editor) {
                        this.editorGroupService.pinEditor(editor.position, editor.input);
                    }
                }
                // Just save
                return this.textFileService.save(source, { force: true /* force a change to the file to trigger external watchers if any */ });
            }
            return winjs_base_1.TPromise.as(false);
        };
        BaseSaveOneFileAction = __decorate([
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, textfiles_1.ITextFileService),
            __param(4, groupService_1.IEditorGroupService),
            __param(5, untitledEditorService_1.IUntitledEditorService),
            __param(6, message_1.IMessageService)
        ], BaseSaveOneFileAction);
        return BaseSaveOneFileAction;
    }(BaseSaveFileAction));
    exports.BaseSaveOneFileAction = BaseSaveOneFileAction;
    var SaveFileAction = (function (_super) {
        __extends(SaveFileAction, _super);
        function SaveFileAction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SaveFileAction.prototype.isSaveAs = function () {
            return false;
        };
        SaveFileAction.ID = 'workbench.action.files.save';
        SaveFileAction.LABEL = nls.localize('save', "Save");
        return SaveFileAction;
    }(BaseSaveOneFileAction));
    exports.SaveFileAction = SaveFileAction;
    var SaveFileAsAction = (function (_super) {
        __extends(SaveFileAsAction, _super);
        function SaveFileAsAction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SaveFileAsAction.prototype.isSaveAs = function () {
            return true;
        };
        SaveFileAsAction.ID = 'workbench.action.files.saveAs';
        SaveFileAsAction.LABEL = nls.localize('saveAs', "Save As...");
        return SaveFileAsAction;
    }(BaseSaveOneFileAction));
    exports.SaveFileAsAction = SaveFileAsAction;
    var BaseSaveAllAction = (function (_super) {
        __extends(BaseSaveAllAction, _super);
        function BaseSaveAllAction(id, label, editorService, editorGroupService, textFileService, untitledEditorService, messageService) {
            var _this = _super.call(this, id, label, messageService) || this;
            _this.editorService = editorService;
            _this.editorGroupService = editorGroupService;
            _this.textFileService = textFileService;
            _this.untitledEditorService = untitledEditorService;
            _this.toDispose = [];
            _this.lastIsDirty = _this.textFileService.isDirty();
            _this.enabled = _this.lastIsDirty;
            _this.registerListeners();
            return _this;
        }
        BaseSaveAllAction.prototype.registerListeners = function () {
            var _this = this;
            // listen to files being changed locally
            this.toDispose.push(this.textFileService.models.onModelsDirty(function (e) { return _this.updateEnablement(true); }));
            this.toDispose.push(this.textFileService.models.onModelsSaved(function (e) { return _this.updateEnablement(false); }));
            this.toDispose.push(this.textFileService.models.onModelsReverted(function (e) { return _this.updateEnablement(false); }));
            this.toDispose.push(this.textFileService.models.onModelsSaveError(function (e) { return _this.updateEnablement(true); }));
            if (this.includeUntitled()) {
                this.toDispose.push(this.untitledEditorService.onDidChangeDirty(function (resource) { return _this.updateEnablement(_this.untitledEditorService.isDirty(resource)); }));
            }
        };
        BaseSaveAllAction.prototype.updateEnablement = function (isDirty) {
            if (this.lastIsDirty !== isDirty) {
                this.enabled = this.textFileService.isDirty();
                this.lastIsDirty = this.enabled;
            }
        };
        BaseSaveAllAction.prototype.doRun = function (context) {
            var _this = this;
            var stacks = this.editorGroupService.getStacksModel();
            // Store some properties per untitled file to restore later after save is completed
            var mapUntitledToProperties = Object.create(null);
            this.untitledEditorService.getDirty().forEach(function (resource) {
                var activeInGroups = [];
                var indexInGroups = [];
                var encoding = _this.untitledEditorService.getEncoding(resource);
                // For each group
                stacks.groups.forEach(function (group, groupIndex) {
                    // Find out if editor is active in group
                    var activeEditor = group.activeEditor;
                    var activeResource = editor_1.toResource(activeEditor, { supportSideBySide: true });
                    activeInGroups[groupIndex] = (activeResource && activeResource.toString() === resource.toString());
                    // Find index of editor in group
                    indexInGroups[groupIndex] = -1;
                    group.getEditors().forEach(function (editor, editorIndex) {
                        var editorResource = editor_1.toResource(editor, { supportSideBySide: true });
                        if (editorResource && editorResource.toString() === resource.toString()) {
                            indexInGroups[groupIndex] = editorIndex;
                            return;
                        }
                    });
                });
                mapUntitledToProperties[resource.toString()] = { encoding: encoding, indexInGroups: indexInGroups, activeInGroups: activeInGroups };
            });
            // Save all
            return this.textFileService.saveAll(this.getSaveAllArguments(context)).then(function (results) {
                // Reopen saved untitled editors
                var untitledToReopen = [];
                results.results.forEach(function (result) {
                    if (!result.success || result.source.scheme !== 'untitled') {
                        return;
                    }
                    var untitledProps = mapUntitledToProperties[result.source.toString()];
                    if (!untitledProps) {
                        return;
                    }
                    // For each position where the untitled file was opened
                    untitledProps.indexInGroups.forEach(function (indexInGroup, index) {
                        if (indexInGroup >= 0) {
                            untitledToReopen.push({
                                input: {
                                    resource: result.target,
                                    encoding: untitledProps.encoding,
                                    options: {
                                        pinned: true,
                                        index: indexInGroup,
                                        preserveFocus: true,
                                        inactive: !untitledProps.activeInGroups[index]
                                    }
                                },
                                position: index
                            });
                        }
                    });
                });
                if (untitledToReopen.length) {
                    return _this.editorService.openEditors(untitledToReopen).then(function () { return true; });
                }
                return void 0;
            });
        };
        BaseSaveAllAction.prototype.dispose = function () {
            this.toDispose = lifecycle_1.dispose(this.toDispose);
            _super.prototype.dispose.call(this);
        };
        BaseSaveAllAction = __decorate([
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, groupService_1.IEditorGroupService),
            __param(4, textfiles_1.ITextFileService),
            __param(5, untitledEditorService_1.IUntitledEditorService),
            __param(6, message_1.IMessageService)
        ], BaseSaveAllAction);
        return BaseSaveAllAction;
    }(BaseSaveFileAction));
    exports.BaseSaveAllAction = BaseSaveAllAction;
    var SaveAllAction = (function (_super) {
        __extends(SaveAllAction, _super);
        function SaveAllAction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(SaveAllAction.prototype, "class", {
            get: function () {
                return 'explorer-action save-all';
            },
            enumerable: true,
            configurable: true
        });
        SaveAllAction.prototype.getSaveAllArguments = function () {
            return this.includeUntitled();
        };
        SaveAllAction.prototype.includeUntitled = function () {
            return true;
        };
        SaveAllAction.ID = 'workbench.action.files.saveAll';
        SaveAllAction.LABEL = nls.localize('saveAll', "Save All");
        return SaveAllAction;
    }(BaseSaveAllAction));
    exports.SaveAllAction = SaveAllAction;
    var SaveAllInGroupAction = (function (_super) {
        __extends(SaveAllInGroupAction, _super);
        function SaveAllInGroupAction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(SaveAllInGroupAction.prototype, "class", {
            get: function () {
                return 'explorer-action save-all';
            },
            enumerable: true,
            configurable: true
        });
        SaveAllInGroupAction.prototype.getSaveAllArguments = function (editorIdentifier) {
            if (!editorIdentifier) {
                return this.includeUntitled();
            }
            var editorGroup = editorIdentifier.group;
            var resourcesToSave = [];
            editorGroup.getEditors().forEach(function (editor) {
                var resource = editor_1.toResource(editor, { supportSideBySide: true, filter: ['file', 'untitled'] });
                if (resource) {
                    resourcesToSave.push(resource);
                }
            });
            return resourcesToSave;
        };
        SaveAllInGroupAction.prototype.includeUntitled = function () {
            return true;
        };
        SaveAllInGroupAction.ID = 'workbench.files.action.saveAllInGroup';
        SaveAllInGroupAction.LABEL = nls.localize('saveAllInGroup', "Save All in Group");
        return SaveAllInGroupAction;
    }(BaseSaveAllAction));
    exports.SaveAllInGroupAction = SaveAllInGroupAction;
    var SaveFilesAction = (function (_super) {
        __extends(SaveFilesAction, _super);
        function SaveFilesAction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SaveFilesAction.prototype.getSaveAllArguments = function () {
            return this.includeUntitled();
        };
        SaveFilesAction.prototype.includeUntitled = function () {
            return false;
        };
        SaveFilesAction.ID = 'workbench.action.files.saveFiles';
        SaveFilesAction.LABEL = nls.localize('saveFiles', "Save Dirty Files");
        return SaveFilesAction;
    }(BaseSaveAllAction));
    exports.SaveFilesAction = SaveFilesAction;
    var RevertFileAction = (function (_super) {
        __extends(RevertFileAction, _super);
        function RevertFileAction(id, label, editorService, textFileService) {
            var _this = _super.call(this, id, label) || this;
            _this.editorService = editorService;
            _this.textFileService = textFileService;
            _this.enabled = true;
            return _this;
        }
        RevertFileAction.prototype.setResource = function (resource) {
            this.resource = resource;
        };
        RevertFileAction.prototype.run = function () {
            var resource;
            if (this.resource) {
                resource = this.resource;
            }
            else {
                resource = editor_1.toResource(this.editorService.getActiveEditorInput(), { supportSideBySide: true, filter: 'file' });
            }
            if (resource && resource.scheme !== 'untitled') {
                return this.textFileService.revert(resource, { force: true });
            }
            return winjs_base_1.TPromise.as(true);
        };
        RevertFileAction.ID = 'workbench.action.files.revert';
        RevertFileAction.LABEL = nls.localize('revert', "Revert File");
        RevertFileAction = __decorate([
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, textfiles_1.ITextFileService)
        ], RevertFileAction);
        return RevertFileAction;
    }(actions_1.Action));
    exports.RevertFileAction = RevertFileAction;
    var FocusOpenEditorsView = (function (_super) {
        __extends(FocusOpenEditorsView, _super);
        function FocusOpenEditorsView(id, label, viewletService) {
            var _this = _super.call(this, id, label) || this;
            _this.viewletService = viewletService;
            return _this;
        }
        FocusOpenEditorsView.prototype.run = function () {
            return this.viewletService.openViewlet(files_1.VIEWLET_ID, true).then(function (viewlet) {
                var openEditorsView = viewlet.getOpenEditorsView();
                if (openEditorsView) {
                    openEditorsView.expand();
                    openEditorsView.getViewer().DOMFocus();
                }
            });
        };
        FocusOpenEditorsView.ID = 'workbench.files.action.focusOpenEditorsView';
        FocusOpenEditorsView.LABEL = nls.localize({ key: 'focusOpenEditors', comment: ['Open is an adjective'] }, "Focus on Open Editors View");
        FocusOpenEditorsView = __decorate([
            __param(2, viewlet_2.IViewletService)
        ], FocusOpenEditorsView);
        return FocusOpenEditorsView;
    }(actions_1.Action));
    exports.FocusOpenEditorsView = FocusOpenEditorsView;
    var FocusFilesExplorer = (function (_super) {
        __extends(FocusFilesExplorer, _super);
        function FocusFilesExplorer(id, label, viewletService) {
            var _this = _super.call(this, id, label) || this;
            _this.viewletService = viewletService;
            return _this;
        }
        FocusFilesExplorer.prototype.run = function () {
            return this.viewletService.openViewlet(files_1.VIEWLET_ID, true).then(function (viewlet) {
                var view = viewlet.getExplorerView();
                if (view) {
                    view.expand();
                    view.getViewer().DOMFocus();
                }
            });
        };
        FocusFilesExplorer.ID = 'workbench.files.action.focusFilesExplorer';
        FocusFilesExplorer.LABEL = nls.localize('focusFilesExplorer', "Focus on Files Explorer");
        FocusFilesExplorer = __decorate([
            __param(2, viewlet_2.IViewletService)
        ], FocusFilesExplorer);
        return FocusFilesExplorer;
    }(actions_1.Action));
    exports.FocusFilesExplorer = FocusFilesExplorer;
    var ShowActiveFileInExplorer = (function (_super) {
        __extends(ShowActiveFileInExplorer, _super);
        function ShowActiveFileInExplorer(id, label, editorService, instantiationService, messageService) {
            var _this = _super.call(this, id, label) || this;
            _this.editorService = editorService;
            _this.instantiationService = instantiationService;
            _this.messageService = messageService;
            return _this;
        }
        ShowActiveFileInExplorer.prototype.run = function () {
            var fileResource = editor_1.toResource(this.editorService.getActiveEditorInput(), { supportSideBySide: true, filter: 'file' });
            if (fileResource) {
                this.instantiationService.invokeFunction.apply(this.instantiationService, [fileCommands_1.revealInExplorerCommand, fileResource]);
            }
            else {
                this.messageService.show(severity_1.default.Info, nls.localize('openFileToShow', "Open a file first to show it in the explorer"));
            }
            return winjs_base_1.TPromise.as(true);
        };
        ShowActiveFileInExplorer.ID = 'workbench.files.action.showActiveFileInExplorer';
        ShowActiveFileInExplorer.LABEL = nls.localize('showInExplorer', "Reveal Active File in Side Bar");
        ShowActiveFileInExplorer = __decorate([
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, instantiation_1.IInstantiationService),
            __param(4, message_1.IMessageService)
        ], ShowActiveFileInExplorer);
        return ShowActiveFileInExplorer;
    }(actions_1.Action));
    exports.ShowActiveFileInExplorer = ShowActiveFileInExplorer;
    var CollapseExplorerView = (function (_super) {
        __extends(CollapseExplorerView, _super);
        function CollapseExplorerView(id, label, viewletService) {
            var _this = _super.call(this, id, label) || this;
            _this.viewletService = viewletService;
            return _this;
        }
        CollapseExplorerView.prototype.run = function () {
            return this.viewletService.openViewlet(files_1.VIEWLET_ID, true).then(function (viewlet) {
                var explorerView = viewlet.getExplorerView();
                if (explorerView) {
                    var viewer = explorerView.getViewer();
                    if (viewer) {
                        var action = new viewlet_1.CollapseAction(viewer, true, null);
                        action.run().done();
                        action.dispose();
                    }
                }
            });
        };
        CollapseExplorerView.ID = 'workbench.files.action.collapseExplorerFolders';
        CollapseExplorerView.LABEL = nls.localize('collapseExplorerFolders', "Collapse Folders in Explorer");
        CollapseExplorerView = __decorate([
            __param(2, viewlet_2.IViewletService)
        ], CollapseExplorerView);
        return CollapseExplorerView;
    }(actions_1.Action));
    exports.CollapseExplorerView = CollapseExplorerView;
    var RefreshExplorerView = (function (_super) {
        __extends(RefreshExplorerView, _super);
        function RefreshExplorerView(id, label, viewletService) {
            var _this = _super.call(this, id, label) || this;
            _this.viewletService = viewletService;
            return _this;
        }
        RefreshExplorerView.prototype.run = function () {
            return this.viewletService.openViewlet(files_1.VIEWLET_ID, true).then(function (viewlet) {
                var explorerView = viewlet.getExplorerView();
                if (explorerView) {
                    explorerView.refresh();
                }
            });
        };
        RefreshExplorerView.ID = 'workbench.files.action.refreshFilesExplorer';
        RefreshExplorerView.LABEL = nls.localize('refreshExplorer', "Refresh Explorer");
        RefreshExplorerView = __decorate([
            __param(2, viewlet_2.IViewletService)
        ], RefreshExplorerView);
        return RefreshExplorerView;
    }(actions_1.Action));
    exports.RefreshExplorerView = RefreshExplorerView;
    var OpenFileAction = (function (_super) {
        __extends(OpenFileAction, _super);
        function OpenFileAction(id, label, editorService, windowService) {
            var _this = _super.call(this, id, label) || this;
            _this.editorService = editorService;
            _this.windowService = windowService;
            return _this;
        }
        OpenFileAction.prototype.run = function (event, data) {
            var fileResource = editor_1.toResource(this.editorService.getActiveEditorInput(), { supportSideBySide: true, filter: 'file' });
            return this.windowService.pickFileAndOpen({ telemetryExtraData: data, dialogOptions: { defaultPath: fileResource ? paths.dirname(fileResource.fsPath) : void 0 } });
        };
        OpenFileAction.ID = 'workbench.action.files.openFile';
        OpenFileAction.LABEL = nls.localize('openFile', "Open File...");
        OpenFileAction = __decorate([
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, windows_1.IWindowService)
        ], OpenFileAction);
        return OpenFileAction;
    }(actions_1.Action));
    exports.OpenFileAction = OpenFileAction;
    var ShowOpenedFileInNewWindow = (function (_super) {
        __extends(ShowOpenedFileInNewWindow, _super);
        function ShowOpenedFileInNewWindow(id, label, windowsService, editorService, messageService) {
            var _this = _super.call(this, id, label) || this;
            _this.windowsService = windowsService;
            _this.editorService = editorService;
            _this.messageService = messageService;
            return _this;
        }
        ShowOpenedFileInNewWindow.prototype.run = function () {
            var fileResource = editor_1.toResource(this.editorService.getActiveEditorInput(), { supportSideBySide: true, filter: 'file' });
            if (fileResource) {
                this.windowsService.openWindow([fileResource.fsPath], { forceNewWindow: true, forceOpenWorkspaceAsFile: true });
            }
            else {
                this.messageService.show(severity_1.default.Info, nls.localize('openFileToShowInNewWindow', "Open a file first to open in new window"));
            }
            return winjs_base_1.TPromise.as(true);
        };
        ShowOpenedFileInNewWindow.ID = 'workbench.action.files.showOpenedFileInNewWindow';
        ShowOpenedFileInNewWindow.LABEL = nls.localize('openFileInNewWindow', "Open Active File in New Window");
        ShowOpenedFileInNewWindow = __decorate([
            __param(2, windows_1.IWindowsService),
            __param(3, editorService_1.IWorkbenchEditorService),
            __param(4, message_1.IMessageService)
        ], ShowOpenedFileInNewWindow);
        return ShowOpenedFileInNewWindow;
    }(actions_1.Action));
    exports.ShowOpenedFileInNewWindow = ShowOpenedFileInNewWindow;
    var RevealInOSAction = (function (_super) {
        __extends(RevealInOSAction, _super);
        function RevealInOSAction(resource, instantiationService) {
            var _this = _super.call(this, 'revealFileInOS', RevealInOSAction.LABEL) || this;
            _this.resource = resource;
            _this.instantiationService = instantiationService;
            _this.order = 45;
            return _this;
        }
        RevealInOSAction.prototype.run = function () {
            this.instantiationService.invokeFunction.apply(this.instantiationService, [fileCommands_1.revealInOSCommand, this.resource]);
            return winjs_base_1.TPromise.as(true);
        };
        RevealInOSAction.LABEL = platform_1.isWindows ? nls.localize('revealInWindows', "Reveal in Explorer") : platform_1.isMacintosh ? nls.localize('revealInMac', "Reveal in Finder") : nls.localize('openContainer', "Open Containing Folder");
        RevealInOSAction = __decorate([
            __param(1, instantiation_1.IInstantiationService)
        ], RevealInOSAction);
        return RevealInOSAction;
    }(actions_1.Action));
    exports.RevealInOSAction = RevealInOSAction;
    var GlobalRevealInOSAction = (function (_super) {
        __extends(GlobalRevealInOSAction, _super);
        function GlobalRevealInOSAction(id, label, editorService, instantiationService, messageService) {
            var _this = _super.call(this, id, label) || this;
            _this.editorService = editorService;
            _this.instantiationService = instantiationService;
            _this.messageService = messageService;
            return _this;
        }
        GlobalRevealInOSAction.prototype.run = function () {
            this.instantiationService.invokeFunction.apply(this.instantiationService, [fileCommands_1.revealInOSCommand]);
            return winjs_base_1.TPromise.as(true);
        };
        GlobalRevealInOSAction.ID = 'workbench.action.files.revealActiveFileInWindows';
        GlobalRevealInOSAction.LABEL = platform_1.isWindows ? nls.localize('revealActiveFileInWindows', "Reveal Active File in Windows Explorer") : (platform_1.isMacintosh ? nls.localize('revealActiveFileInMac', "Reveal Active File in Finder") : nls.localize('openActiveFileContainer', "Open Containing Folder of Active File"));
        GlobalRevealInOSAction = __decorate([
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, instantiation_1.IInstantiationService),
            __param(4, message_1.IMessageService)
        ], GlobalRevealInOSAction);
        return GlobalRevealInOSAction;
    }(actions_1.Action));
    exports.GlobalRevealInOSAction = GlobalRevealInOSAction;
    var CopyPathAction = (function (_super) {
        __extends(CopyPathAction, _super);
        function CopyPathAction(resource, instantiationService) {
            var _this = _super.call(this, 'copyFilePath', CopyPathAction.LABEL) || this;
            _this.resource = resource;
            _this.instantiationService = instantiationService;
            _this.order = 140;
            return _this;
        }
        CopyPathAction.prototype.run = function () {
            this.instantiationService.invokeFunction.apply(this.instantiationService, [fileCommands_1.copyPathCommand, this.resource]);
            return winjs_base_1.TPromise.as(true);
        };
        CopyPathAction.LABEL = nls.localize('copyPath', "Copy Path");
        CopyPathAction = __decorate([
            __param(1, instantiation_1.IInstantiationService)
        ], CopyPathAction);
        return CopyPathAction;
    }(actions_1.Action));
    exports.CopyPathAction = CopyPathAction;
    var GlobalCopyPathAction = (function (_super) {
        __extends(GlobalCopyPathAction, _super);
        function GlobalCopyPathAction(id, label, editorService, editorGroupService, messageService, instantiationService) {
            var _this = _super.call(this, id, label) || this;
            _this.editorService = editorService;
            _this.editorGroupService = editorGroupService;
            _this.messageService = messageService;
            _this.instantiationService = instantiationService;
            return _this;
        }
        GlobalCopyPathAction.prototype.run = function () {
            this.instantiationService.invokeFunction.apply(this.instantiationService, [fileCommands_1.copyPathCommand]);
            return winjs_base_1.TPromise.as(true);
        };
        GlobalCopyPathAction.ID = 'workbench.action.files.copyPathOfActiveFile';
        GlobalCopyPathAction.LABEL = nls.localize('copyPathOfActive', "Copy Path of Active File");
        GlobalCopyPathAction = __decorate([
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, groupService_1.IEditorGroupService),
            __param(4, message_1.IMessageService),
            __param(5, instantiation_1.IInstantiationService)
        ], GlobalCopyPathAction);
        return GlobalCopyPathAction;
    }(actions_1.Action));
    exports.GlobalCopyPathAction = GlobalCopyPathAction;
    function validateFileName(parent, name, allowOverwriting) {
        if (allowOverwriting === void 0) { allowOverwriting = false; }
        // Produce a well formed file name
        name = getWellFormedFileName(name);
        // Name not provided
        if (!name || name.length === 0 || /^\s+$/.test(name)) {
            return nls.localize('emptyFileNameError', "A file or folder name must be provided.");
        }
        // Do not allow to overwrite existing file
        if (!allowOverwriting) {
            if (parent.children && parent.children.some(function (c) {
                if (platform_1.isLinux) {
                    return c.name === name;
                }
                return c.name.toLowerCase() === name.toLowerCase();
            })) {
                return nls.localize('fileNameExistsError', "A file or folder **{0}** already exists at this location. Please choose a different name.", name);
            }
        }
        // Invalid File name
        if (!paths.isValidBasename(name)) {
            return nls.localize('invalidFileNameError', "The name **{0}** is not valid as a file or folder name. Please choose a different name.", name);
        }
        // Max length restriction (on Windows)
        if (platform_1.isWindows) {
            var fullPathLength = name.length + parent.resource.fsPath.length + 1 /* path segment */;
            if (fullPathLength > 255) {
                return nls.localize('filePathTooLongError', "The name **{0}** results in a path that is too long. Please choose a shorter name.", name);
            }
        }
        return null;
    }
    exports.validateFileName = validateFileName;
    function getWellFormedFileName(filename) {
        if (!filename) {
            return filename;
        }
        // Trim whitespaces
        filename = strings.trim(strings.trim(filename, ' '), '\t');
        // Remove trailing dots
        filename = strings.rtrim(filename, '.');
        return filename;
    }
    exports.getWellFormedFileName = getWellFormedFileName;
    var CompareWithSavedAction = (function (_super) {
        __extends(CompareWithSavedAction, _super);
        function CompareWithSavedAction(id, label, editorService, textFileService, fileService, messageService, modeService, modelService, textModelService) {
            var _this = _super.call(this, id, label) || this;
            _this.editorService = editorService;
            _this.textFileService = textFileService;
            _this.fileService = fileService;
            _this.modeService = modeService;
            _this.modelService = modelService;
            textModelService.registerTextModelContentProvider(CompareWithSavedAction.SCHEME, _this);
            _this.enabled = true;
            return _this;
        }
        CompareWithSavedAction.prototype.setResource = function (resource) {
            this.resource = resource;
        };
        CompareWithSavedAction.prototype.run = function () {
            var resource;
            if (this.resource) {
                resource = this.resource;
            }
            else {
                resource = editor_1.toResource(this.editorService.getActiveEditorInput(), { supportSideBySide: true, filter: 'file' });
            }
            if (resource && resource.scheme === 'file') {
                var name_1 = paths.basename(resource.fsPath);
                var editorLabel = nls.localize('modifiedLabel', "{0} (on disk) ↔ {1}", name_1, name_1);
                return this.editorService.openEditor({ leftResource: uri_1.default.from({ scheme: CompareWithSavedAction.SCHEME, path: resource.fsPath }), rightResource: resource, label: editorLabel });
            }
            return winjs_base_1.TPromise.as(true);
        };
        CompareWithSavedAction.prototype.provideTextContent = function (resource) {
            var _this = this;
            // Make sure our file from disk is resolved up to date
            return this.resolveEditorModel(resource).then(function (codeEditorModel) {
                // Make sure to keep contents on disk up to date when it changes
                if (!_this.fileWatcher) {
                    _this.fileWatcher = _this.fileService.onFileChanges(function (changes) {
                        if (changes.contains(resource, files_2.FileChangeType.UPDATED)) {
                            _this.resolveEditorModel(resource, false /* do not create if missing */).done(null, errors.onUnexpectedError); // update model when resource changes
                        }
                    });
                    var disposeListener_1 = codeEditorModel.onWillDispose(function () {
                        disposeListener_1.dispose();
                        _this.fileWatcher.dispose();
                        _this.fileWatcher = void 0;
                    });
                }
                return codeEditorModel;
            });
        };
        CompareWithSavedAction.prototype.resolveEditorModel = function (resource, createAsNeeded) {
            var _this = this;
            if (createAsNeeded === void 0) { createAsNeeded = true; }
            var fileOnDiskResource = uri_1.default.file(resource.fsPath);
            return this.textFileService.resolveTextContent(fileOnDiskResource).then(function (content) {
                var codeEditorModel = _this.modelService.getModel(resource);
                if (codeEditorModel) {
                    _this.modelService.updateModel(codeEditorModel, content.value);
                }
                else if (createAsNeeded) {
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
        CompareWithSavedAction.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            if (this.fileWatcher) {
                this.fileWatcher.dispose();
                this.fileWatcher = void 0;
            }
        };
        CompareWithSavedAction.ID = 'workbench.files.action.compareWithSaved';
        CompareWithSavedAction.LABEL = nls.localize('compareWithSaved', "Compare Active File with Saved");
        CompareWithSavedAction.SCHEME = 'showModifications';
        CompareWithSavedAction = __decorate([
            __param(2, editorService_1.IWorkbenchEditorService),
            __param(3, textfiles_1.ITextFileService),
            __param(4, files_2.IFileService),
            __param(5, message_1.IMessageService),
            __param(6, modeService_1.IModeService),
            __param(7, modelService_1.IModelService),
            __param(8, resolverService_1.ITextModelService)
        ], CompareWithSavedAction);
        return CompareWithSavedAction;
    }(actions_1.Action));
    exports.CompareWithSavedAction = CompareWithSavedAction;
    // Diagnostics support
    var diag;
    if (!diag) {
        diag = diagnostics.register('FileActionsDiagnostics', function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log(args[1] + ' - ' + args[0] + ' (time: ' + args[2].getTime() + ' [' + args[2].toUTCString() + '])');
        });
    }
});
//# sourceMappingURL=fileActions.js.map