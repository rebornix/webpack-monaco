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
define(["require", "exports", "vs/base/common/winjs.base", "vs/base/common/actions", "vs/nls", "vs/base/common/arrays", "vs/platform/windows/common/windows", "vs/platform/workspace/common/workspace", "vs/workbench/services/workspace/common/workspaceEditing", "vs/base/common/uri", "vs/workbench/services/viewlet/browser/viewlet", "vs/platform/instantiation/common/instantiation", "vs/platform/workspaces/common/workspaces", "vs/platform/message/common/message", "vs/platform/environment/common/environment", "vs/base/common/platform", "vs/base/common/paths", "vs/base/common/labels", "vs/platform/files/common/files", "vs/workbench/services/editor/common/editorService"], function (require, exports, winjs_base_1, actions_1, nls, arrays_1, windows_1, workspace_1, workspaceEditing_1, uri_1, viewlet_1, instantiation_1, workspaces_1, message_1, environment_1, platform_1, paths_1, labels_1, files_1, editorService_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var OpenFolderAction = (function (_super) {
        __extends(OpenFolderAction, _super);
        function OpenFolderAction(id, label, windowService) {
            var _this = _super.call(this, id, label) || this;
            _this.windowService = windowService;
            return _this;
        }
        OpenFolderAction.prototype.run = function (event, data) {
            return this.windowService.pickFolderAndOpen({ telemetryExtraData: data });
        };
        OpenFolderAction.ID = 'workbench.action.files.openFolder';
        OpenFolderAction.LABEL = nls.localize('openFolder', "Open Folder...");
        OpenFolderAction = __decorate([
            __param(2, windows_1.IWindowService)
        ], OpenFolderAction);
        return OpenFolderAction;
    }(actions_1.Action));
    exports.OpenFolderAction = OpenFolderAction;
    var OpenFileFolderAction = (function (_super) {
        __extends(OpenFileFolderAction, _super);
        function OpenFileFolderAction(id, label, windowService) {
            var _this = _super.call(this, id, label) || this;
            _this.windowService = windowService;
            return _this;
        }
        OpenFileFolderAction.prototype.run = function (event, data) {
            return this.windowService.pickFileFolderAndOpen({ telemetryExtraData: data });
        };
        OpenFileFolderAction.ID = 'workbench.action.files.openFileFolder';
        OpenFileFolderAction.LABEL = nls.localize('openFileFolder', "Open...");
        OpenFileFolderAction = __decorate([
            __param(2, windows_1.IWindowService)
        ], OpenFileFolderAction);
        return OpenFileFolderAction;
    }(actions_1.Action));
    exports.OpenFileFolderAction = OpenFileFolderAction;
    var BaseWorkspacesAction = (function (_super) {
        __extends(BaseWorkspacesAction, _super);
        function BaseWorkspacesAction(id, label, windowService, environmentService, contextService) {
            var _this = _super.call(this, id, label) || this;
            _this.windowService = windowService;
            _this.environmentService = environmentService;
            _this.contextService = contextService;
            return _this;
        }
        BaseWorkspacesAction.prototype.pickFolders = function (buttonLabel, title) {
            var workspace = this.contextService.getWorkspace();
            var defaultPath;
            if (workspace && workspace.roots.length > 0) {
                defaultPath = paths_1.dirname(workspace.roots[0].fsPath); // pick the parent of the first root by default
            }
            return this.windowService.showOpenDialog({
                buttonLabel: buttonLabel,
                title: title,
                properties: ['multiSelections', 'openDirectory', 'createDirectory'],
                defaultPath: defaultPath
            });
        };
        return BaseWorkspacesAction;
    }(actions_1.Action));
    exports.BaseWorkspacesAction = BaseWorkspacesAction;
    var AddRootFolderAction = (function (_super) {
        __extends(AddRootFolderAction, _super);
        function AddRootFolderAction(id, label, windowService, contextService, environmentService, instantiationService, workspaceEditingService, viewletService) {
            var _this = _super.call(this, id, label, windowService, environmentService, contextService) || this;
            _this.instantiationService = instantiationService;
            _this.workspaceEditingService = workspaceEditingService;
            _this.viewletService = viewletService;
            return _this;
        }
        AddRootFolderAction.prototype.run = function () {
            var _this = this;
            if (!this.contextService.hasWorkspace()) {
                return this.instantiationService.createInstance(NewWorkspaceAction, NewWorkspaceAction.ID, NewWorkspaceAction.LABEL, []).run();
            }
            if (this.contextService.hasFolderWorkspace()) {
                return this.instantiationService.createInstance(NewWorkspaceAction, NewWorkspaceAction.ID, NewWorkspaceAction.LABEL, this.contextService.getWorkspace().roots).run();
            }
            var folders = _super.prototype.pickFolders.call(this, labels_1.mnemonicLabel(nls.localize({ key: 'add', comment: ['&& denotes a mnemonic'] }, "&&Add")), nls.localize('addFolderToWorkspaceTitle', "Add Folder to Workspace"));
            if (!folders || !folders.length) {
                return winjs_base_1.TPromise.as(null);
            }
            return this.workspaceEditingService.addRoots(folders.map(function (folder) { return uri_1.default.file(folder); })).then(function () {
                return _this.viewletService.openViewlet(_this.viewletService.getDefaultViewletId(), true);
            });
        };
        AddRootFolderAction.ID = 'workbench.action.addRootFolder';
        AddRootFolderAction.LABEL = nls.localize('addFolderToWorkspace', "Add Folder to Workspace...");
        AddRootFolderAction = __decorate([
            __param(2, windows_1.IWindowService),
            __param(3, workspace_1.IWorkspaceContextService),
            __param(4, environment_1.IEnvironmentService),
            __param(5, instantiation_1.IInstantiationService),
            __param(6, workspaceEditing_1.IWorkspaceEditingService),
            __param(7, viewlet_1.IViewletService)
        ], AddRootFolderAction);
        return AddRootFolderAction;
    }(BaseWorkspacesAction));
    exports.AddRootFolderAction = AddRootFolderAction;
    var NewWorkspaceAction = (function (_super) {
        __extends(NewWorkspaceAction, _super);
        function NewWorkspaceAction(id, label, presetRoots, windowService, contextService, environmentService, workspacesService, windowsService) {
            var _this = _super.call(this, id, label, windowService, environmentService, contextService) || this;
            _this.presetRoots = presetRoots;
            _this.workspacesService = workspacesService;
            _this.windowsService = windowsService;
            return _this;
        }
        NewWorkspaceAction.prototype.run = function () {
            var folders = this.pickFolders(labels_1.mnemonicLabel(nls.localize({ key: 'select', comment: ['&& denotes a mnemonic'] }, "&&Select")), nls.localize('selectWorkspace', "Select Folders for Workspace"));
            if (folders && folders.length) {
                return this.createWorkspace(this.presetRoots.concat(folders.map(function (folder) { return uri_1.default.file(folder); })));
            }
            return winjs_base_1.TPromise.as(null);
        };
        NewWorkspaceAction.prototype.createWorkspace = function (folders) {
            var workspaceFolders = arrays_1.distinct(folders.map(function (folder) { return folder.fsPath; }), function (folder) { return platform_1.isLinux ? folder : folder.toLowerCase(); });
            return this.windowService.createAndOpenWorkspace(workspaceFolders);
        };
        NewWorkspaceAction.ID = 'workbench.action.newWorkspace';
        NewWorkspaceAction.LABEL = nls.localize('newWorkspace', "New Workspace...");
        NewWorkspaceAction = __decorate([
            __param(3, windows_1.IWindowService),
            __param(4, workspace_1.IWorkspaceContextService),
            __param(5, environment_1.IEnvironmentService),
            __param(6, workspaces_1.IWorkspacesService),
            __param(7, windows_1.IWindowsService)
        ], NewWorkspaceAction);
        return NewWorkspaceAction;
    }(BaseWorkspacesAction));
    var RemoveRootFolderAction = (function (_super) {
        __extends(RemoveRootFolderAction, _super);
        function RemoveRootFolderAction(rootUri, id, label, workspaceEditingService) {
            var _this = _super.call(this, id, label) || this;
            _this.rootUri = rootUri;
            _this.workspaceEditingService = workspaceEditingService;
            return _this;
        }
        RemoveRootFolderAction.prototype.run = function () {
            return this.workspaceEditingService.removeRoots([this.rootUri]);
        };
        RemoveRootFolderAction.ID = 'workbench.action.removeRootFolder';
        RemoveRootFolderAction.LABEL = nls.localize('removeFolderFromWorkspace', "Remove Folder from Workspace");
        RemoveRootFolderAction = __decorate([
            __param(3, workspaceEditing_1.IWorkspaceEditingService)
        ], RemoveRootFolderAction);
        return RemoveRootFolderAction;
    }(actions_1.Action));
    exports.RemoveRootFolderAction = RemoveRootFolderAction;
    var SaveWorkspaceAsAction = (function (_super) {
        __extends(SaveWorkspaceAsAction, _super);
        function SaveWorkspaceAsAction(id, label, windowService, environmentService, contextService, workspacesService, windowsService, messageService) {
            var _this = _super.call(this, id, label, windowService, environmentService, contextService) || this;
            _this.workspacesService = workspacesService;
            _this.windowsService = windowsService;
            _this.messageService = messageService;
            return _this;
        }
        SaveWorkspaceAsAction.prototype.run = function () {
            if (!this.contextService.hasWorkspace()) {
                this.messageService.show(message_1.Severity.Info, nls.localize('saveEmptyWorkspaceNotSupported', "Please open a workspace first to save."));
                return winjs_base_1.TPromise.as(null);
            }
            var configPath = this.getNewWorkspaceConfigPath();
            if (configPath) {
                if (this.contextService.hasFolderWorkspace()) {
                    return this.saveFolderWorkspace(configPath);
                }
                if (this.contextService.hasMultiFolderWorkspace()) {
                    return this.saveWorkspace(configPath);
                }
            }
            return winjs_base_1.TPromise.as(null);
        };
        SaveWorkspaceAsAction.prototype.saveWorkspace = function (configPath) {
            return this.windowService.saveAndOpenWorkspace(configPath);
        };
        SaveWorkspaceAsAction.prototype.saveFolderWorkspace = function (configPath) {
            var workspaceFolders = this.contextService.getWorkspace().roots.map(function (root) { return root.fsPath; });
            return this.windowService.createAndOpenWorkspace(workspaceFolders, configPath);
        };
        SaveWorkspaceAsAction.prototype.getNewWorkspaceConfigPath = function () {
            var workspace = this.contextService.getWorkspace();
            var defaultPath;
            if (this.contextService.hasMultiFolderWorkspace() && !this.isUntitledWorkspace(workspace.configuration.fsPath)) {
                defaultPath = workspace.configuration.fsPath;
            }
            else if (workspace && workspace.roots.length > 0) {
                defaultPath = paths_1.dirname(workspace.roots[0].fsPath); // pick the parent of the first root by default
            }
            return this.windowService.showSaveDialog({
                buttonLabel: labels_1.mnemonicLabel(nls.localize({ key: 'save', comment: ['&& denotes a mnemonic'] }, "&&Save")),
                title: nls.localize('saveWorkspace', "Save Workspace"),
                filters: workspaces_1.WORKSPACE_FILTER,
                defaultPath: defaultPath
            });
        };
        SaveWorkspaceAsAction.prototype.isUntitledWorkspace = function (path) {
            return files_1.isParent(path, this.environmentService.workspacesHome, !platform_1.isLinux /* ignore case */);
        };
        SaveWorkspaceAsAction.ID = 'workbench.action.saveWorkspaceAs';
        SaveWorkspaceAsAction.LABEL = nls.localize('saveWorkspaceAsAction', "Save Workspace As...");
        SaveWorkspaceAsAction = __decorate([
            __param(2, windows_1.IWindowService),
            __param(3, environment_1.IEnvironmentService),
            __param(4, workspace_1.IWorkspaceContextService),
            __param(5, workspaces_1.IWorkspacesService),
            __param(6, windows_1.IWindowsService),
            __param(7, message_1.IMessageService)
        ], SaveWorkspaceAsAction);
        return SaveWorkspaceAsAction;
    }(BaseWorkspacesAction));
    exports.SaveWorkspaceAsAction = SaveWorkspaceAsAction;
    var OpenWorkspaceAction = (function (_super) {
        __extends(OpenWorkspaceAction, _super);
        function OpenWorkspaceAction(id, label, windowService) {
            var _this = _super.call(this, id, label) || this;
            _this.windowService = windowService;
            return _this;
        }
        OpenWorkspaceAction.prototype.run = function () {
            return this.windowService.openWorkspace();
        };
        OpenWorkspaceAction.ID = 'workbench.action.openWorkspace';
        OpenWorkspaceAction.LABEL = nls.localize('openWorkspaceAction', "Open Workspace...");
        OpenWorkspaceAction = __decorate([
            __param(2, windows_1.IWindowService)
        ], OpenWorkspaceAction);
        return OpenWorkspaceAction;
    }(actions_1.Action));
    exports.OpenWorkspaceAction = OpenWorkspaceAction;
    var OpenWorkspaceConfigFileAction = (function (_super) {
        __extends(OpenWorkspaceConfigFileAction, _super);
        function OpenWorkspaceConfigFileAction(id, label, workspaceContextService, editorService) {
            var _this = _super.call(this, id, label) || this;
            _this.workspaceContextService = workspaceContextService;
            _this.editorService = editorService;
            _this.enabled = _this.workspaceContextService.hasMultiFolderWorkspace();
            return _this;
        }
        OpenWorkspaceConfigFileAction.prototype.run = function () {
            return this.editorService.openEditor({ resource: this.workspaceContextService.getWorkspace().configuration });
        };
        OpenWorkspaceConfigFileAction.ID = 'workbench.action.openWorkspaceConfigFile';
        OpenWorkspaceConfigFileAction.LABEL = nls.localize('openWorkspaceConfigFile', "Open Workspace Configuration File");
        OpenWorkspaceConfigFileAction = __decorate([
            __param(2, workspace_1.IWorkspaceContextService),
            __param(3, editorService_1.IWorkbenchEditorService)
        ], OpenWorkspaceConfigFileAction);
        return OpenWorkspaceConfigFileAction;
    }(actions_1.Action));
    exports.OpenWorkspaceConfigFileAction = OpenWorkspaceConfigFileAction;
});
//# sourceMappingURL=workspaceActions.js.map