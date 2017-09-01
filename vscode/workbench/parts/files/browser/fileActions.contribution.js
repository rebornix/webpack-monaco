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
define(["require", "exports", "vs/nls", "vs/platform/registry/common/platform", "vs/base/common/platform", "vs/base/browser/ui/actionbar/actionbar", "vs/workbench/browser/actions", "vs/workbench/parts/files/browser/fileActions", "vs/workbench/parts/files/browser/saveErrorHandler", "vs/platform/actions/common/actions", "vs/workbench/common/actionRegistry", "vs/platform/instantiation/common/instantiation", "vs/platform/workspace/common/workspace", "vs/platform/keybinding/common/keybinding", "vs/workbench/parts/files/common/explorerModel", "vs/base/common/keyCodes", "vs/workbench/browser/actions/workspaceActions", "vs/workbench/parts/files/browser/fileCommands", "vs/platform/commands/common/commands", "vs/platform/contextkey/common/contextkey", "vs/platform/keybinding/common/keybindingsRegistry", "vs/platform/environment/common/environment", "vs/workbench/parts/files/common/files"], function (require, exports, nls, platform_1, platform_2, actionbar_1, actions_1, fileActions_1, saveErrorHandler_1, actions_2, actionRegistry_1, instantiation_1, workspace_1, keybinding_1, explorerModel_1, keyCodes_1, workspaceActions_1, fileCommands_1, commands_1, contextkey_1, keybindingsRegistry_1, environment_1, files_1) {
    /*---------------------------------------------------------------------------------------------
     *  Copyright (c) Microsoft Corporation. All rights reserved.
     *  Licensed under the MIT License. See License.txt in the project root for license information.
     *--------------------------------------------------------------------------------------------*/
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var FilesViewerActionContributor = (function (_super) {
        __extends(FilesViewerActionContributor, _super);
        function FilesViewerActionContributor(instantiationService, contextService, keybindingService, environmentService) {
            var _this = _super.call(this) || this;
            _this.instantiationService = instantiationService;
            _this.contextService = contextService;
            _this.keybindingService = keybindingService;
            _this.environmentService = environmentService;
            return _this;
        }
        FilesViewerActionContributor.prototype.hasSecondaryActions = function (context) {
            var element = context.element;
            // Contribute only on Stat Objects (File Explorer)
            return element instanceof explorerModel_1.FileStat || element instanceof explorerModel_1.Model;
        };
        FilesViewerActionContributor.prototype.getSecondaryActions = function (context) {
            var stat = context.element;
            var tree = context.viewer;
            var actions = [];
            var separateOpen = false;
            if (stat instanceof explorerModel_1.Model) {
                return [this.instantiationService.createInstance(workspaceActions_1.AddRootFolderAction, workspaceActions_1.AddRootFolderAction.ID, workspaceActions_1.AddRootFolderAction.LABEL)];
            }
            // Open side by side
            if (!stat.isDirectory) {
                actions.push(this.instantiationService.createInstance(fileActions_1.OpenToSideAction, tree, stat.resource, false));
                separateOpen = true;
            }
            if (separateOpen) {
                actions.push(new actionbar_1.Separator(null, 50));
            }
            // Directory Actions
            if (stat.isDirectory) {
                // New File
                actions.push(this.instantiationService.createInstance(fileActions_1.NewFileAction, tree, stat));
                // New Folder
                actions.push(this.instantiationService.createInstance(fileActions_1.NewFolderAction, tree, stat));
                actions.push(new actionbar_1.Separator(null, 50));
            }
            else if (!stat.isDirectory) {
                // Run Compare
                var runCompareAction = this.instantiationService.createInstance(fileActions_1.CompareResourcesAction, stat.resource, tree);
                if (runCompareAction._isEnabled()) {
                    actions.push(runCompareAction);
                }
                // Select for Compare
                actions.push(this.instantiationService.createInstance(fileActions_1.SelectResourceForCompareAction, stat.resource, tree));
                actions.push(new actionbar_1.Separator(null, 100));
            }
            if (stat.isRoot && this.environmentService.appQuality !== 'stable') {
                var action = this.instantiationService.createInstance(workspaceActions_1.AddRootFolderAction, workspaceActions_1.AddRootFolderAction.ID, workspaceActions_1.AddRootFolderAction.LABEL);
                action.order = 52;
                actions.push(action);
                if (this.contextService.getWorkspace().roots.length > 1) {
                    action = this.instantiationService.createInstance(workspaceActions_1.RemoveRootFolderAction, stat.resource, workspaceActions_1.RemoveRootFolderAction.ID, workspaceActions_1.RemoveRootFolderAction.LABEL);
                    action.order = 53;
                    actions.push(action);
                }
                actions.push(new actionbar_1.Separator(null, 54));
            }
            // Copy File/Folder
            if (!stat.isRoot) {
                actions.push(this.instantiationService.createInstance(fileActions_1.CopyFileAction, tree, stat));
            }
            // Paste File/Folder
            if (stat.isDirectory) {
                actions.push(this.instantiationService.createInstance(fileActions_1.PasteFileAction, tree, stat));
            }
            // Rename File/Folder
            if (!stat.isRoot) {
                actions.push(new actionbar_1.Separator(null, 150));
                actions.push(this.instantiationService.createInstance(fileActions_1.TriggerRenameFileAction, tree, stat));
                // Delete File/Folder
                actions.push(this.instantiationService.createInstance(fileActions_1.MoveFileToTrashAction, tree, stat));
            }
            // Set Order
            var curOrder = 10;
            for (var i = 0; i < actions.length; i++) {
                var action = actions[i];
                if (!action.order) {
                    curOrder += 10;
                    action.order = curOrder;
                }
                else {
                    curOrder = action.order;
                }
            }
            return actions;
        };
        FilesViewerActionContributor.prototype.getActionItem = function (context, action) {
            if (context && context.element instanceof explorerModel_1.FileStat) {
                // Any other item with keybinding
                var keybinding = this.keybindingService.lookupKeybinding(action.id);
                if (keybinding) {
                    return new actionbar_1.ActionItem(context, action, { label: true, keybinding: keybinding.getLabel() });
                }
            }
            return null;
        };
        FilesViewerActionContributor = __decorate([
            __param(0, instantiation_1.IInstantiationService),
            __param(1, workspace_1.IWorkspaceContextService),
            __param(2, keybinding_1.IKeybindingService),
            __param(3, environment_1.IEnvironmentService)
        ], FilesViewerActionContributor);
        return FilesViewerActionContributor;
    }(actions_1.ActionBarContributor));
    var ExplorerViewersActionContributor = (function (_super) {
        __extends(ExplorerViewersActionContributor, _super);
        function ExplorerViewersActionContributor(instantiationService) {
            var _this = _super.call(this) || this;
            _this.instantiationService = instantiationService;
            return _this;
        }
        ExplorerViewersActionContributor.prototype.hasSecondaryActions = function (context) {
            var element = context.element;
            // Contribute only on Files (File Explorer and Open Files Viewer)
            return !!files_1.explorerItemToFileResource(element);
        };
        ExplorerViewersActionContributor.prototype.getSecondaryActions = function (context) {
            var actions = [];
            if (this.hasSecondaryActions(context)) {
                var fileResource = files_1.explorerItemToFileResource(context.element);
                var resource = fileResource.resource;
                // Reveal file in OS native explorer
                actions.push(this.instantiationService.createInstance(fileActions_1.RevealInOSAction, resource));
                // Copy Path
                actions.push(this.instantiationService.createInstance(fileActions_1.CopyPathAction, resource));
            }
            return actions;
        };
        ExplorerViewersActionContributor = __decorate([
            __param(0, instantiation_1.IInstantiationService)
        ], ExplorerViewersActionContributor);
        return ExplorerViewersActionContributor;
    }(actions_1.ActionBarContributor));
    // Contribute to Viewers that show Files
    var actionBarRegistry = platform_1.Registry.as(actions_1.Extensions.Actionbar);
    actionBarRegistry.registerActionBarContributor(actions_1.Scope.VIEWER, FilesViewerActionContributor);
    actionBarRegistry.registerActionBarContributor(actions_1.Scope.VIEWER, ExplorerViewersActionContributor);
    // Contribute Global Actions
    var category = nls.localize('filesCategory', "Files");
    var registry = platform_1.Registry.as(actionRegistry_1.Extensions.WorkbenchActions);
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(fileActions_1.GlobalCopyPathAction, fileActions_1.GlobalCopyPathAction.ID, fileActions_1.GlobalCopyPathAction.LABEL, { primary: keyCodes_1.KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 46 /* KEY_P */) }), 'Files: Copy Path of Active File', category);
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(fileActions_1.SaveFileAction, fileActions_1.SaveFileAction.ID, fileActions_1.SaveFileAction.LABEL, { primary: 2048 /* CtrlCmd */ | 49 /* KEY_S */ }), 'Files: Save', category);
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(fileActions_1.SaveAllAction, fileActions_1.SaveAllAction.ID, fileActions_1.SaveAllAction.LABEL, { primary: void 0, mac: { primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 49 /* KEY_S */ }, win: { primary: keyCodes_1.KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 49 /* KEY_S */) } }), 'Files: Save All', category);
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(fileActions_1.SaveFilesAction, fileActions_1.SaveFilesAction.ID, null /* only for programmatic trigger */), null);
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(fileActions_1.RevertFileAction, fileActions_1.RevertFileAction.ID, fileActions_1.RevertFileAction.LABEL), 'Files: Revert File', category);
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(fileActions_1.GlobalNewFileAction, fileActions_1.GlobalNewFileAction.ID, fileActions_1.GlobalNewFileAction.LABEL), 'Files: New File', category);
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(fileActions_1.GlobalNewFolderAction, fileActions_1.GlobalNewFolderAction.ID, fileActions_1.GlobalNewFolderAction.LABEL), 'Files: New Folder', category);
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(fileActions_1.GlobalCompareResourcesAction, fileActions_1.GlobalCompareResourcesAction.ID, fileActions_1.GlobalCompareResourcesAction.LABEL), 'Files: Compare Active File With...', category);
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(fileActions_1.FocusOpenEditorsView, fileActions_1.FocusOpenEditorsView.ID, fileActions_1.FocusOpenEditorsView.LABEL, { primary: keyCodes_1.KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 35 /* KEY_E */) }), 'Files: Focus on Open Editors View', category);
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(fileActions_1.FocusFilesExplorer, fileActions_1.FocusFilesExplorer.ID, fileActions_1.FocusFilesExplorer.LABEL), 'Files: Focus on Files Explorer', category);
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(fileActions_1.ShowActiveFileInExplorer, fileActions_1.ShowActiveFileInExplorer.ID, fileActions_1.ShowActiveFileInExplorer.LABEL), 'Files: Reveal Active File in Side Bar', category);
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(fileActions_1.CollapseExplorerView, fileActions_1.CollapseExplorerView.ID, fileActions_1.CollapseExplorerView.LABEL), 'Files: Collapse Folders in Explorer', category);
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(fileActions_1.RefreshExplorerView, fileActions_1.RefreshExplorerView.ID, fileActions_1.RefreshExplorerView.LABEL), 'Files: Refresh Explorer', category);
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(fileActions_1.SaveFileAsAction, fileActions_1.SaveFileAsAction.ID, fileActions_1.SaveFileAsAction.LABEL, { primary: 2048 /* CtrlCmd */ | 1024 /* Shift */ | 49 /* KEY_S */ }), 'Files: Save As...', category);
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(fileActions_1.GlobalNewUntitledFileAction, fileActions_1.GlobalNewUntitledFileAction.ID, fileActions_1.GlobalNewUntitledFileAction.LABEL, { primary: 2048 /* CtrlCmd */ | 44 /* KEY_N */ }), 'Files: New Untitled File', category);
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(fileActions_1.GlobalRevealInOSAction, fileActions_1.GlobalRevealInOSAction.ID, fileActions_1.GlobalRevealInOSAction.LABEL, { primary: keyCodes_1.KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 48 /* KEY_R */) }), 'Files: Reveal Active File', category);
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(fileActions_1.ShowOpenedFileInNewWindow, fileActions_1.ShowOpenedFileInNewWindow.ID, fileActions_1.ShowOpenedFileInNewWindow.LABEL, { primary: keyCodes_1.KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 45 /* KEY_O */) }), 'Files: Open Active File in New Window', category);
    registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(fileActions_1.CompareWithSavedAction, fileActions_1.CompareWithSavedAction.ID, fileActions_1.CompareWithSavedAction.LABEL, { primary: keyCodes_1.KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 34 /* KEY_D */) }), 'Files: Compare Active File with Saved', category);
    if (platform_2.isMacintosh) {
        registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(workspaceActions_1.OpenFileFolderAction, workspaceActions_1.OpenFileFolderAction.ID, workspaceActions_1.OpenFileFolderAction.LABEL, { primary: 2048 /* CtrlCmd */ | 45 /* KEY_O */ }), 'Files: Open...', category);
    }
    else {
        registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(fileActions_1.OpenFileAction, fileActions_1.OpenFileAction.ID, fileActions_1.OpenFileAction.LABEL, { primary: 2048 /* CtrlCmd */ | 45 /* KEY_O */ }), 'Files: Open File...', category);
        registry.registerWorkbenchAction(new actions_2.SyncActionDescriptor(workspaceActions_1.OpenFolderAction, workspaceActions_1.OpenFolderAction.ID, workspaceActions_1.OpenFolderAction.LABEL, { primary: keyCodes_1.KeyChord(2048 /* CtrlCmd */ | 41 /* KEY_K */, 2048 /* CtrlCmd */ | 45 /* KEY_O */) }), 'Files: Open Folder...', category);
    }
    // Commands
    commands_1.CommandsRegistry.registerCommand('_files.pickFolderAndOpen', fileCommands_1.openFolderPickerCommand);
    commands_1.CommandsRegistry.registerCommand('_files.windowOpen', fileCommands_1.openWindowCommand);
    commands_1.CommandsRegistry.registerCommand('workbench.action.files.openFileInNewWindow', fileCommands_1.openFileInNewWindowCommand);
    var explorerCommandsWeightBonus = 10; // give our commands a little bit more weight over other default list/tree commands
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: 'explorer.openToSide',
        weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(explorerCommandsWeightBonus),
        when: files_1.ExplorerFocusCondition,
        primary: 2048 /* CtrlCmd */ | 3 /* Enter */,
        mac: {
            primary: 256 /* WinCtrl */ | 3 /* Enter */
        },
        handler: fileCommands_1.openFocusedExplorerItemSideBySideCommand
    });
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: 'renameFile',
        weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(explorerCommandsWeightBonus),
        when: files_1.FilesExplorerFocusCondition,
        primary: 60 /* F2 */,
        mac: {
            primary: 3 /* Enter */
        },
        handler: fileCommands_1.renameFocusedFilesExplorerViewItemCommand
    });
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: 'moveFileToTrash',
        weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(explorerCommandsWeightBonus),
        when: files_1.FilesExplorerFocusCondition,
        primary: 20 /* Delete */,
        mac: {
            primary: 2048 /* CtrlCmd */ | 1 /* Backspace */
        },
        handler: fileCommands_1.moveFocusedFilesExplorerViewItemToTrashCommand
    });
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: 'deleteFile',
        weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(explorerCommandsWeightBonus),
        when: files_1.FilesExplorerFocusCondition,
        primary: 1024 /* Shift */ | 20 /* Delete */,
        mac: {
            primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 1 /* Backspace */
        },
        handler: fileCommands_1.deleteFocusedFilesExplorerViewItemCommand
    });
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: 'filesExplorer.copy',
        weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(explorerCommandsWeightBonus),
        when: files_1.FilesExplorerFocusCondition,
        primary: 2048 /* CtrlCmd */ | 33 /* KEY_C */,
        handler: fileCommands_1.copyFocusedFilesExplorerViewItem
    });
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: 'filesExplorer.paste',
        weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(explorerCommandsWeightBonus),
        when: files_1.FilesExplorerFocusCondition,
        primary: 2048 /* CtrlCmd */ | 52 /* KEY_V */,
        handler: fileActions_1.pasteIntoFocusedFilesExplorerViewItem
    });
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: 'copyFilePath',
        weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(explorerCommandsWeightBonus),
        when: files_1.ExplorerFocusCondition,
        primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 33 /* KEY_C */,
        win: {
            primary: 1024 /* Shift */ | 512 /* Alt */ | 33 /* KEY_C */
        },
        handler: fileCommands_1.copyPathOfFocusedExplorerItem
    });
    keybindingsRegistry_1.KeybindingsRegistry.registerCommandAndKeybindingRule({
        id: 'revealFileInOS',
        weight: keybindingsRegistry_1.KeybindingsRegistry.WEIGHT.workbenchContrib(explorerCommandsWeightBonus),
        when: files_1.ExplorerFocusCondition,
        primary: 2048 /* CtrlCmd */ | 512 /* Alt */ | 48 /* KEY_R */,
        win: {
            primary: 1024 /* Shift */ | 512 /* Alt */ | 48 /* KEY_R */
        },
        handler: fileCommands_1.revealInOSFocusedFilesExplorerItem
    });
    // Editor Title Context Menu
    appendEditorTitleContextMenuItem('_workbench.action.files.revealInOS', fileActions_1.RevealInOSAction.LABEL, fileCommands_1.revealInOSCommand);
    appendEditorTitleContextMenuItem('_workbench.action.files.copyPath', fileActions_1.CopyPathAction.LABEL, fileCommands_1.copyPathCommand);
    appendEditorTitleContextMenuItem('_workbench.action.files.revealInExplorer', nls.localize('revealInSideBar', "Reveal in Side Bar"), fileCommands_1.revealInExplorerCommand);
    function appendEditorTitleContextMenuItem(id, title, command) {
        // Command
        commands_1.CommandsRegistry.registerCommand(id, command);
        // Menu
        actions_2.MenuRegistry.appendMenuItem(actions_2.MenuId.EditorTitleContext, {
            command: { id: id, title: title },
            when: contextkey_1.ContextKeyExpr.equals('resourceScheme', 'file'),
            group: '2_files'
        });
    }
    // Editor Title Menu for Conflict Resolution
    appendSaveConflictEditorTitleAction('workbench.files.action.acceptLocalChanges', nls.localize('acceptLocalChanges', "Use your changes and overwrite disk contents"), 'save-conflict-action-accept-changes', -10, saveErrorHandler_1.acceptLocalChangesCommand);
    appendSaveConflictEditorTitleAction('workbench.files.action.revertLocalChanges', nls.localize('revertLocalChanges', "Discard your changes and revert to content on disk"), 'save-conflict-action-revert-changes', -9, saveErrorHandler_1.revertLocalChangesCommand);
    function appendSaveConflictEditorTitleAction(id, title, iconClass, order, command) {
        // Command
        commands_1.CommandsRegistry.registerCommand(id, command);
        // Action
        actions_2.MenuRegistry.appendMenuItem(actions_2.MenuId.EditorTitle, {
            command: { id: id, title: title, iconClass: iconClass },
            when: contextkey_1.ContextKeyExpr.equals(saveErrorHandler_1.CONFLICT_RESOLUTION_CONTEXT, true),
            group: 'navigation',
            order: order
        });
    }
});
//# sourceMappingURL=fileActions.contribution.js.map