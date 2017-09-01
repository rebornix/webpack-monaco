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
define(["require", "exports", "vs/nls", "vs/base/common/platform", "vs/base/common/uri", "vs/base/common/errors", "vs/base/common/types", "vs/base/common/winjs.base", "vs/base/common/arrays", "vs/base/browser/dom", "vs/base/common/severity", "vs/base/browser/ui/actionbar/actionbar", "vs/base/common/actions", "vs/workbench/services/part/common/partService", "vs/platform/files/common/files", "vs/workbench/common/editor", "vs/workbench/services/editor/common/editorService", "vs/workbench/services/group/common/groupService", "vs/platform/message/common/message", "vs/platform/telemetry/common/telemetry", "vs/workbench/services/configuration/common/configuration", "vs/platform/windows/common/windows", "vs/platform/contextview/browser/contextView", "vs/platform/environment/common/environment", "vs/platform/keybinding/common/keybinding", "vs/workbench/services/configuration/common/configurationEditing", "vs/workbench/services/title/common/titleService", "vs/workbench/services/themes/common/workbenchThemeService", "vs/base/browser/browser", "vs/platform/commands/common/commands", "vs/workbench/services/viewlet/browser/viewlet", "vs/platform/editor/common/editor", "vs/platform/extensions/common/extensions", "vs/workbench/services/keybinding/electron-browser/keybindingService", "vs/workbench/common/theme", "electron", "vs/platform/workspace/common/workspace", "vs/workbench/services/workspace/common/workspaceEditing"], function (require, exports, nls, platform, uri_1, errors, types, winjs_base_1, arrays, DOM, severity_1, actionbar_1, actions_1, partService_1, files_1, editor_1, editorService_1, groupService_1, message_1, telemetry_1, configuration_1, windows_1, contextView_1, environment_1, keybinding_1, configurationEditing_1, titleService_1, workbenchThemeService_1, browser, commands_1, viewlet_1, editor_2, extensions_1, keybindingService_1, theme_1, electron_1, workspace_1, workspaceEditing_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var TextInputActions = [
        new actions_1.Action('undo', nls.localize('undo', "Undo"), null, true, function () { return document.execCommand('undo') && winjs_base_1.TPromise.as(true); }),
        new actions_1.Action('redo', nls.localize('redo', "Redo"), null, true, function () { return document.execCommand('redo') && winjs_base_1.TPromise.as(true); }),
        new actionbar_1.Separator(),
        new actions_1.Action('editor.action.clipboardCutAction', nls.localize('cut', "Cut"), null, true, function () { return document.execCommand('cut') && winjs_base_1.TPromise.as(true); }),
        new actions_1.Action('editor.action.clipboardCopyAction', nls.localize('copy', "Copy"), null, true, function () { return document.execCommand('copy') && winjs_base_1.TPromise.as(true); }),
        new actions_1.Action('editor.action.clipboardPasteAction', nls.localize('paste', "Paste"), null, true, function () { return document.execCommand('paste') && winjs_base_1.TPromise.as(true); }),
        new actionbar_1.Separator(),
        new actions_1.Action('editor.action.selectAll', nls.localize('selectAll', "Select All"), null, true, function () { return document.execCommand('selectAll') && winjs_base_1.TPromise.as(true); })
    ];
    var ElectronWindow = (function (_super) {
        __extends(ElectronWindow, _super);
        function ElectronWindow(shellContainer, editorService, editorGroupService, partService, windowsService, windowService, configurationService, titleService, themeService, messageService, configurationEditingService, commandService, extensionService, viewletService, contextMenuService, keybindingService, environmentService, telemetryService, contextService, workspaceEditingService) {
            var _this = _super.call(this, themeService) || this;
            _this.editorService = editorService;
            _this.editorGroupService = editorGroupService;
            _this.partService = partService;
            _this.windowsService = windowsService;
            _this.windowService = windowService;
            _this.configurationService = configurationService;
            _this.titleService = titleService;
            _this.themeService = themeService;
            _this.messageService = messageService;
            _this.configurationEditingService = configurationEditingService;
            _this.commandService = commandService;
            _this.extensionService = extensionService;
            _this.viewletService = viewletService;
            _this.contextMenuService = contextMenuService;
            _this.keybindingService = keybindingService;
            _this.environmentService = environmentService;
            _this.telemetryService = telemetryService;
            _this.contextService = contextService;
            _this.workspaceEditingService = workspaceEditingService;
            _this.registerListeners();
            _this.setup();
            return _this;
        }
        ElectronWindow.prototype.registerListeners = function () {
            var _this = this;
            // React to editor input changes
            this.editorGroupService.onEditorsChanged(function () {
                var file = editor_1.toResource(_this.editorService.getActiveEditorInput(), { supportSideBySide: true, filter: 'file' });
                _this.titleService.setRepresentedFilename(file ? file.fsPath : '');
            });
            // prevent opening a real URL inside the shell
            [DOM.EventType.DRAG_OVER, DOM.EventType.DROP].forEach(function (event) {
                window.document.body.addEventListener(event, function (e) {
                    DOM.EventHelper.stop(e);
                });
            });
            // Handle window.open() calls
            var $this = this;
            window.open = function (url, target, features, replace) {
                $this.windowsService.openExternal(url);
                return null;
            };
        };
        ElectronWindow.prototype.setup = function () {
            var _this = this;
            // Support runAction event
            electron_1.ipcRenderer.on('vscode:runAction', function (event, actionId) {
                _this.commandService.executeCommand(actionId, { from: 'menu' }).done(function (_) {
                    _this.telemetryService.publicLog('commandExecuted', { id: actionId, from: 'menu' });
                }, function (err) {
                    _this.messageService.show(severity_1.default.Error, err);
                });
            });
            // Support resolve keybindings event
            electron_1.ipcRenderer.on('vscode:resolveKeybindings', function (event, rawActionIds) {
                var actionIds = [];
                try {
                    actionIds = JSON.parse(rawActionIds);
                }
                catch (error) {
                    // should not happen
                }
                // Resolve keys using the keybinding service and send back to browser process
                _this.resolveKeybindings(actionIds).done(function (keybindings) {
                    if (keybindings.length) {
                        electron_1.ipcRenderer.send('vscode:keybindingsResolved', JSON.stringify(keybindings));
                    }
                }, function () { return errors.onUnexpectedError; });
            });
            // Send over all extension viewlets when extensions are ready
            this.extensionService.onReady().then(function () {
                electron_1.ipcRenderer.send('vscode:extensionViewlets', JSON.stringify(_this.viewletService.getViewlets().filter(function (v) { return !!v.extensionId; }).map(function (v) { return { id: v.id, label: v.name }; })));
            });
            electron_1.ipcRenderer.on('vscode:reportError', function (event, error) {
                if (error) {
                    var errorParsed = JSON.parse(error);
                    errorParsed.mainProcess = true;
                    errors.onUnexpectedError(errorParsed);
                }
            });
            // Support openFiles event for existing and new files
            electron_1.ipcRenderer.on('vscode:openFiles', function (event, request) { return _this.onOpenFiles(request); });
            // Support addFolders event if we have a workspace opened
            electron_1.ipcRenderer.on('vscode:addFolders', function (event, request) { return _this.onAddFolders(request); });
            // Emit event when vscode has loaded
            this.partService.joinCreation().then(function () {
                electron_1.ipcRenderer.send('vscode:workbenchLoaded', _this.windowService.getCurrentWindowId());
            });
            // Message support
            electron_1.ipcRenderer.on('vscode:showInfoMessage', function (event, message) {
                _this.messageService.show(severity_1.default.Info, message);
            });
            // Support toggling auto save
            electron_1.ipcRenderer.on('vscode.toggleAutoSave', function (event) {
                _this.toggleAutoSave();
            });
            // Fullscreen Events
            electron_1.ipcRenderer.on('vscode:enterFullScreen', function (event) {
                _this.partService.joinCreation().then(function () {
                    browser.setFullscreen(true);
                });
            });
            electron_1.ipcRenderer.on('vscode:leaveFullScreen', function (event) {
                _this.partService.joinCreation().then(function () {
                    browser.setFullscreen(false);
                });
            });
            // High Contrast Events
            electron_1.ipcRenderer.on('vscode:enterHighContrast', function (event) {
                var windowConfig = _this.configurationService.getConfiguration('window');
                if (windowConfig && windowConfig.autoDetectHighContrast) {
                    _this.partService.joinCreation().then(function () {
                        _this.themeService.setColorTheme(workbenchThemeService_1.VS_HC_THEME, null);
                    });
                }
            });
            electron_1.ipcRenderer.on('vscode:leaveHighContrast', function (event) {
                var windowConfig = _this.configurationService.getConfiguration('window');
                if (windowConfig && windowConfig.autoDetectHighContrast) {
                    _this.partService.joinCreation().then(function () {
                        _this.themeService.setColorTheme(workbenchThemeService_1.VS_DARK_THEME, null);
                    });
                }
            });
            // keyboard layout changed event
            electron_1.ipcRenderer.on('vscode:keyboardLayoutChanged', function (event, isISOKeyboard) {
                keybindingService_1.KeyboardMapperFactory.INSTANCE._onKeyboardLayoutChanged(isISOKeyboard);
            });
            // keyboard layout changed event
            electron_1.ipcRenderer.on('vscode:accessibilitySupportChanged', function (event, accessibilitySupportEnabled) {
                browser.setAccessibilitySupport(accessibilitySupportEnabled ? 2 /* Enabled */ : 1 /* Disabled */);
            });
            // Configuration changes
            var previousConfiguredZoomLevel;
            this.configurationService.onDidUpdateConfiguration(function (e) {
                var windowConfig = _this.configurationService.getConfiguration();
                var newZoomLevel = 0;
                if (windowConfig.window && typeof windowConfig.window.zoomLevel === 'number') {
                    newZoomLevel = windowConfig.window.zoomLevel;
                    // Leave early if the configured zoom level did not change (https://github.com/Microsoft/vscode/issues/1536)
                    if (previousConfiguredZoomLevel === newZoomLevel) {
                        return;
                    }
                    previousConfiguredZoomLevel = newZoomLevel;
                }
                if (electron_1.webFrame.getZoomLevel() !== newZoomLevel) {
                    electron_1.webFrame.setZoomLevel(newZoomLevel);
                    browser.setZoomFactor(electron_1.webFrame.getZoomFactor());
                    // See https://github.com/Microsoft/vscode/issues/26151
                    // Cannot be trusted because the webFrame might take some time
                    // until it really applies the new zoom level
                    browser.setZoomLevel(electron_1.webFrame.getZoomLevel(), /*isTrusted*/ false);
                }
            });
            // Context menu support in input/textarea
            window.document.addEventListener('contextmenu', function (e) {
                if (e.target instanceof HTMLElement) {
                    var target = e.target;
                    if (target.nodeName && (target.nodeName.toLowerCase() === 'input' || target.nodeName.toLowerCase() === 'textarea')) {
                        e.preventDefault();
                        e.stopPropagation();
                        _this.contextMenuService.showContextMenu({
                            getAnchor: function () { return e; },
                            getActions: function () { return winjs_base_1.TPromise.as(TextInputActions); }
                        });
                    }
                }
            });
        };
        ElectronWindow.prototype.resolveKeybindings = function (actionIds) {
            var _this = this;
            return winjs_base_1.TPromise.join([this.partService.joinCreation(), this.extensionService.onReady()]).then(function () {
                return arrays.coalesce(actionIds.map(function (id) {
                    var binding = _this.keybindingService.lookupKeybinding(id);
                    if (!binding) {
                        return null;
                    }
                    // first try to resolve a native accelerator
                    var electronAccelerator = binding.getElectronAccelerator();
                    if (electronAccelerator) {
                        return { id: id, label: electronAccelerator, isNative: true };
                    }
                    // we need this fallback to support keybindings that cannot show in electron menus (e.g. chords)
                    var acceleratorLabel = binding.getLabel();
                    if (acceleratorLabel) {
                        return { id: id, label: acceleratorLabel, isNative: false };
                    }
                    return null;
                }));
            });
        };
        ElectronWindow.prototype.onAddFolders = function (request) {
            var foldersToAdd = request.foldersToAdd.map(function (folderToAdd) { return uri_1.default.file(folderToAdd.filePath); });
            // Workspace: just add to workspace config
            if (this.contextService.hasMultiFolderWorkspace()) {
                this.workspaceEditingService.addRoots(foldersToAdd).done(null, errors.onUnexpectedError);
            }
            else {
                var workspaceFolders = [];
                // Folder of workspace is the first of multi root workspace, so add it
                if (this.contextService.hasFolderWorkspace()) {
                    workspaceFolders.push.apply(workspaceFolders, this.contextService.getWorkspace().roots);
                }
                // Fill in remaining ones from request
                workspaceFolders.push.apply(workspaceFolders, request.foldersToAdd.map(function (folderToAdd) { return uri_1.default.file(folderToAdd.filePath); }));
                // Create workspace and open (ensure no duplicates)
                this.windowService.createAndOpenWorkspace(arrays.distinct(workspaceFolders.map(function (folder) { return folder.fsPath; }), function (folder) { return platform.isLinux ? folder : folder.toLowerCase(); }));
            }
        };
        ElectronWindow.prototype.onOpenFiles = function (request) {
            var inputs = [];
            var diffMode = (request.filesToDiff.length === 2);
            if (!diffMode && request.filesToOpen) {
                inputs.push.apply(inputs, this.toInputs(request.filesToOpen, false));
            }
            if (!diffMode && request.filesToCreate) {
                inputs.push.apply(inputs, this.toInputs(request.filesToCreate, true));
            }
            if (diffMode) {
                inputs.push.apply(inputs, this.toInputs(request.filesToDiff, false));
            }
            if (inputs.length) {
                this.openResources(inputs, diffMode).done(null, errors.onUnexpectedError);
            }
        };
        ElectronWindow.prototype.openResources = function (resources, diffMode) {
            var _this = this;
            return this.partService.joinCreation().then(function () {
                // In diffMode we open 2 resources as diff
                if (diffMode && resources.length === 2) {
                    return _this.editorService.openEditor({ leftResource: resources[0].resource, rightResource: resources[1].resource, options: { pinned: true } });
                }
                // For one file, just put it into the current active editor
                if (resources.length === 1) {
                    return _this.editorService.openEditor(resources[0]);
                }
                // Otherwise open all
                var activeEditor = _this.editorService.getActiveEditor();
                return _this.editorService.openEditors(resources.map(function (r, index) {
                    return {
                        input: r,
                        position: activeEditor ? activeEditor.position : editor_2.Position.ONE
                    };
                }));
            });
        };
        ElectronWindow.prototype.toInputs = function (paths, isNew) {
            return paths.map(function (p) {
                var resource = uri_1.default.file(p.filePath);
                var input;
                if (isNew) {
                    input = { filePath: resource.fsPath, options: { pinned: true } };
                }
                else {
                    input = { resource: resource, options: { pinned: true } };
                }
                if (!isNew && p.lineNumber) {
                    input.options.selection = {
                        startLineNumber: p.lineNumber,
                        startColumn: p.columnNumber
                    };
                }
                return input;
            });
        };
        ElectronWindow.prototype.toggleAutoSave = function () {
            var setting = this.configurationService.lookup(ElectronWindow.AUTO_SAVE_SETTING);
            var userAutoSaveConfig = setting.user;
            if (types.isUndefinedOrNull(userAutoSaveConfig)) {
                userAutoSaveConfig = setting.default; // use default if setting not defined
            }
            var newAutoSaveValue;
            if ([files_1.AutoSaveConfiguration.AFTER_DELAY, files_1.AutoSaveConfiguration.ON_FOCUS_CHANGE, files_1.AutoSaveConfiguration.ON_WINDOW_CHANGE].some(function (s) { return s === userAutoSaveConfig; })) {
                newAutoSaveValue = files_1.AutoSaveConfiguration.OFF;
            }
            else {
                newAutoSaveValue = files_1.AutoSaveConfiguration.AFTER_DELAY;
            }
            this.configurationEditingService.writeConfiguration(configurationEditing_1.ConfigurationTarget.USER, { key: ElectronWindow.AUTO_SAVE_SETTING, value: newAutoSaveValue });
        };
        ElectronWindow.AUTO_SAVE_SETTING = 'files.autoSave';
        ElectronWindow = __decorate([
            __param(1, editorService_1.IWorkbenchEditorService),
            __param(2, groupService_1.IEditorGroupService),
            __param(3, partService_1.IPartService),
            __param(4, windows_1.IWindowsService),
            __param(5, windows_1.IWindowService),
            __param(6, configuration_1.IWorkspaceConfigurationService),
            __param(7, titleService_1.ITitleService),
            __param(8, workbenchThemeService_1.IWorkbenchThemeService),
            __param(9, message_1.IMessageService),
            __param(10, configurationEditing_1.IConfigurationEditingService),
            __param(11, commands_1.ICommandService),
            __param(12, extensions_1.IExtensionService),
            __param(13, viewlet_1.IViewletService),
            __param(14, contextView_1.IContextMenuService),
            __param(15, keybinding_1.IKeybindingService),
            __param(16, environment_1.IEnvironmentService),
            __param(17, telemetry_1.ITelemetryService),
            __param(18, workspace_1.IWorkspaceContextService),
            __param(19, workspaceEditing_1.IWorkspaceEditingService)
        ], ElectronWindow);
        return ElectronWindow;
    }(theme_1.Themable));
    exports.ElectronWindow = ElectronWindow;
});
//# sourceMappingURL=window.js.map