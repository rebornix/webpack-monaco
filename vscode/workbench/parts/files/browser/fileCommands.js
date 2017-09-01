/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
define(["require", "exports", "vs/nls", "vs/base/common/paths", "vs/base/common/severity", "vs/base/common/winjs.base", "vs/workbench/services/editor/common/editorService", "vs/workbench/common/editor", "vs/platform/windows/common/windows", "vs/workbench/services/viewlet/browser/viewlet", "vs/platform/workspace/common/workspace", "vs/workbench/parts/files/common/files", "vs/workbench/parts/files/common/explorerModel", "vs/base/common/errors", "vs/platform/clipboard/common/clipboardService", "vs/base/common/labels", "vs/workbench/services/group/common/groupService", "vs/platform/message/common/message"], function (require, exports, nls, paths, severity_1, winjs_base_1, editorService_1, editor_1, windows_1, viewlet_1, workspace_1, files_1, explorerModel_1, errors, clipboardService_1, labels, groupService_1, message_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    // Commands
    exports.copyPathCommand = function (accessor, resource) {
        // Without resource, try to look at the active editor
        if (!resource) {
            var editorGroupService = accessor.get(groupService_1.IEditorGroupService);
            var editorService = accessor.get(editorService_1.IWorkbenchEditorService);
            var activeEditor = editorService.getActiveEditor();
            resource = activeEditor ? editor_1.toResource(activeEditor.input, { supportSideBySide: true, filter: 'file' }) : void 0;
            if (activeEditor) {
                editorGroupService.focusGroup(activeEditor.position); // focus back to active editor group
            }
        }
        if (resource) {
            var clipboardService = accessor.get(clipboardService_1.IClipboardService);
            clipboardService.writeText(labels.getPathLabel(resource));
        }
        else {
            var messageService = accessor.get(message_1.IMessageService);
            messageService.show(severity_1.default.Info, nls.localize('openFileToCopy', "Open a file first to copy its path"));
        }
    };
    exports.openFolderPickerCommand = function (accessor, forceNewWindow) {
        var windowService = accessor.get(windows_1.IWindowService);
        windowService.pickFolderAndOpen({ forceNewWindow: forceNewWindow });
    };
    exports.openWindowCommand = function (accessor, paths, forceNewWindow) {
        var windowsService = accessor.get(windows_1.IWindowsService);
        windowsService.openWindow(paths, { forceNewWindow: forceNewWindow });
    };
    exports.openFileInNewWindowCommand = function (accessor) {
        var windowService = accessor.get(windows_1.IWindowService);
        var editorService = accessor.get(editorService_1.IWorkbenchEditorService);
        var fileResource = editor_1.toResource(editorService.getActiveEditorInput(), { supportSideBySide: true, filter: 'file' });
        windowService.pickFileAndOpen({ forceNewWindow: true, dialogOptions: { defaultPath: fileResource ? paths.dirname(fileResource.fsPath) : void 0 } });
    };
    exports.revealInOSCommand = function (accessor, resource) {
        // Without resource, try to look at the active editor
        if (!resource) {
            var editorService = accessor.get(editorService_1.IWorkbenchEditorService);
            resource = editor_1.toResource(editorService.getActiveEditorInput(), { supportSideBySide: true, filter: 'file' });
        }
        if (resource) {
            var windowsService = accessor.get(windows_1.IWindowsService);
            windowsService.showItemInFolder(paths.normalize(resource.fsPath, true));
        }
        else {
            var messageService = accessor.get(message_1.IMessageService);
            messageService.show(severity_1.default.Info, nls.localize('openFileToReveal', "Open a file first to reveal"));
        }
    };
    exports.revealInExplorerCommand = function (accessor, resource) {
        var viewletService = accessor.get(viewlet_1.IViewletService);
        var contextService = accessor.get(workspace_1.IWorkspaceContextService);
        viewletService.openViewlet(files_1.VIEWLET_ID, false).then(function (viewlet) {
            var isInsideWorkspace = contextService.isInsideWorkspace(resource);
            if (isInsideWorkspace) {
                var explorerView = viewlet.getExplorerView();
                if (explorerView) {
                    explorerView.expand();
                    explorerView.select(resource, true);
                }
            }
            else {
                var openEditorsView = viewlet.getOpenEditorsView();
                if (openEditorsView) {
                    openEditorsView.expand();
                }
            }
        });
    };
    function openFocusedFilesExplorerViewItem(accessor, sideBySide) {
        withFocusedFilesExplorerViewItem(accessor).then(function (res) {
            if (res) {
                // Directory: Toggle expansion
                if (res.item.isDirectory) {
                    res.tree.toggleExpansion(res.item);
                }
                else {
                    var editorService = accessor.get(editorService_1.IWorkbenchEditorService);
                    editorService.openEditor({ resource: res.item.resource }, sideBySide).done(null, errors.onUnexpectedError);
                }
            }
        });
    }
    function openFocusedOpenedEditorsViewItem(accessor, sideBySide) {
        withFocusedOpenEditorsViewItem(accessor).then(function (res) {
            if (res) {
                var editorService = accessor.get(editorService_1.IWorkbenchEditorService);
                editorService.openEditor(res.item.editorInput, null, sideBySide);
            }
        });
    }
    function runActionOnFocusedFilesExplorerViewItem(accessor, id, context) {
        withFocusedFilesExplorerViewItem(accessor).then(function (res) {
            if (res) {
                res.explorer.getViewletState().actionProvider.runAction(res.tree, res.item, id, context).done(null, errors.onUnexpectedError);
            }
        });
    }
    function withVisibleExplorer(accessor) {
        var viewletService = accessor.get(viewlet_1.IViewletService);
        var activeViewlet = viewletService.getActiveViewlet();
        if (!activeViewlet || activeViewlet.getId() !== files_1.VIEWLET_ID) {
            return winjs_base_1.TPromise.as(void 0); // Return early if the active viewlet is not the explorer
        }
        return viewletService.openViewlet(files_1.VIEWLET_ID, false);
    }
    ;
    function withFocusedFilesExplorerViewItem(accessor) {
        return withFocusedFilesExplorer(accessor).then(function (res) {
            if (!res) {
                return void 0;
            }
            var tree = res.tree, explorer = res.explorer;
            if (!tree || !tree.getFocus()) {
                return void 0;
            }
            return { explorer: explorer, tree: tree, item: tree.getFocus() };
        });
    }
    exports.withFocusedFilesExplorerViewItem = withFocusedFilesExplorerViewItem;
    ;
    function withFocusedFilesExplorer(accessor) {
        return withVisibleExplorer(accessor).then(function (explorer) {
            if (!explorer || !explorer.getExplorerView()) {
                return void 0; // empty folder or hidden explorer
            }
            var tree = explorer.getExplorerView().getViewer();
            // Ignore if in highlight mode or not focused
            if (tree.getHighlight() || !tree.isDOMFocused()) {
                return void 0;
            }
            return { explorer: explorer, tree: tree };
        });
    }
    exports.withFocusedFilesExplorer = withFocusedFilesExplorer;
    ;
    function withFocusedOpenEditorsViewItem(accessor) {
        return withVisibleExplorer(accessor).then(function (explorer) {
            if (!explorer || !explorer.getOpenEditorsView()) {
                return void 0; // empty folder or hidden explorer
            }
            var tree = explorer.getOpenEditorsView().getViewer();
            // Ignore if in highlight mode or not focused
            var focus = tree.getFocus();
            if (tree.getHighlight() || !tree.isDOMFocused() || !(focus instanceof explorerModel_1.OpenEditor)) {
                return void 0;
            }
            return { explorer: explorer, tree: tree, item: focus };
        });
    }
    ;
    function withFocusedExplorerItem(accessor) {
        return withFocusedFilesExplorerViewItem(accessor).then(function (res) {
            if (res) {
                return res.item;
            }
            return withFocusedOpenEditorsViewItem(accessor).then(function (res) {
                if (res) {
                    return res.item;
                }
                return void 0;
            });
        });
    }
    ;
    exports.renameFocusedFilesExplorerViewItemCommand = function (accessor) {
        runActionOnFocusedFilesExplorerViewItem(accessor, 'renameFile');
    };
    exports.deleteFocusedFilesExplorerViewItemCommand = function (accessor) {
        runActionOnFocusedFilesExplorerViewItem(accessor, 'moveFileToTrash', { useTrash: false });
    };
    exports.moveFocusedFilesExplorerViewItemToTrashCommand = function (accessor) {
        runActionOnFocusedFilesExplorerViewItem(accessor, 'moveFileToTrash', { useTrash: true });
    };
    exports.copyFocusedFilesExplorerViewItem = function (accessor) {
        runActionOnFocusedFilesExplorerViewItem(accessor, 'filesExplorer.copy');
    };
    exports.copyPathOfFocusedExplorerItem = function (accessor) {
        withFocusedExplorerItem(accessor).then(function (item) {
            var file = files_1.explorerItemToFileResource(item);
            if (file) {
                exports.copyPathCommand(accessor, file.resource);
            }
        });
    };
    exports.openFocusedExplorerItemSideBySideCommand = function (accessor) {
        withFocusedExplorerItem(accessor).then(function (item) {
            if (item instanceof explorerModel_1.FileStat) {
                openFocusedFilesExplorerViewItem(accessor, true);
            }
            else {
                openFocusedOpenedEditorsViewItem(accessor, true);
            }
        });
    };
    exports.revealInOSFocusedFilesExplorerItem = function (accessor) {
        withFocusedExplorerItem(accessor).then(function (item) {
            var file = files_1.explorerItemToFileResource(item);
            if (file) {
                exports.revealInOSCommand(accessor, file.resource);
            }
        });
    };
});
//# sourceMappingURL=fileCommands.js.map