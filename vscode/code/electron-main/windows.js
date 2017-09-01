/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", "path", "original-fs", "vs/nls", "vs/base/common/arrays", "vs/base/common/objects", "vs/platform/backup/common/backup", "vs/platform/environment/common/environment", "vs/platform/storage/node/storage", "vs/code/electron-main/window", "electron", "vs/code/node/paths", "vs/platform/lifecycle/electron-main/lifecycleMain", "vs/platform/configuration/common/configuration", "vs/platform/log/common/log", "vs/platform/windows/common/windows", "vs/code/node/windowsFinder", "vs/base/common/event", "vs/platform/node/product", "vs/platform/telemetry/common/telemetry", "vs/base/common/paths", "vs/platform/history/common/history", "vs/base/common/platform", "vs/base/common/winjs.base", "vs/platform/workspaces/common/workspaces", "vs/platform/instantiation/common/instantiation", "vs/base/common/labels"], function (require, exports, path, fs, nls_1, arrays, objects_1, backup_1, environment_1, storage_1, window_1, electron_1, paths_1, lifecycleMain_1, configuration_1, log_1, windows_1, windowsFinder_1, event_1, product_1, telemetry_1, paths_2, history_1, platform_1, winjs_base_1, workspaces_1, instantiation_1, labels_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var WindowError;
    (function (WindowError) {
        WindowError[WindowError["UNRESPONSIVE"] = 0] = "UNRESPONSIVE";
        WindowError[WindowError["CRASHED"] = 1] = "CRASHED";
    })(WindowError || (WindowError = {}));
    var WindowsManager = (function () {
        function WindowsManager(logService, storageService, environmentService, lifecycleService, backupService, telemetryService, configurationService, historyService, workspacesService, instantiationService) {
            this.logService = logService;
            this.storageService = storageService;
            this.environmentService = environmentService;
            this.lifecycleService = lifecycleService;
            this.backupService = backupService;
            this.telemetryService = telemetryService;
            this.configurationService = configurationService;
            this.historyService = historyService;
            this.workspacesService = workspacesService;
            this.instantiationService = instantiationService;
            this._onWindowReady = new event_1.Emitter();
            this.onWindowReady = this._onWindowReady.event;
            this._onWindowClose = new event_1.Emitter();
            this.onWindowClose = this._onWindowClose.event;
            this._onActiveWindowChanged = new event_1.Emitter();
            this.onActiveWindowChanged = this._onActiveWindowChanged.event;
            this._onWindowReload = new event_1.Emitter();
            this.onWindowReload = this._onWindowReload.event;
            this._onWindowsCountChanged = new event_1.Emitter();
            this.onWindowsCountChanged = this._onWindowsCountChanged.event;
            this.windowsState = this.storageService.getItem(WindowsManager.windowsStateStorageKey) || { openedWindows: [] };
            this.fileDialog = new FileDialog(environmentService, telemetryService, storageService, this);
            this.migrateLegacyWindowState();
        }
        WindowsManager.prototype.migrateLegacyWindowState = function () {
            var _this = this;
            var state = this.windowsState;
            // TODO@Ben migration from previous openedFolders to new openedWindows property
            if (Array.isArray(state.openedFolders) && state.openedFolders.length > 0) {
                state.openedWindows = state.openedFolders;
                state.openedFolders = void 0;
            }
            else if (!state.openedWindows) {
                state.openedWindows = [];
            }
            // TODO@Ben migration from previous workspacePath in window state to folderPath
            var states = [];
            states.push(state.lastActiveWindow);
            states.push(state.lastPluginDevelopmentHostWindow);
            states.push.apply(states, state.openedWindows);
            states.forEach(function (state) {
                if (!state) {
                    return;
                }
                if (typeof state.workspacePath === 'string') {
                    state.folderPath = state.workspacePath;
                    state.workspacePath = void 0;
                }
                // TODO@Ben migration to new workspace ID
                if (state.workspace) {
                    state.workspace.id = _this.workspacesService.getWorkspaceId(state.workspace.configPath);
                }
            });
        };
        WindowsManager.prototype.ready = function (initialUserEnv) {
            this.initialUserEnv = initialUserEnv;
            this.registerListeners();
        };
        WindowsManager.prototype.registerListeners = function () {
            var _this = this;
            // React to windows focus changes
            electron_1.app.on('browser-window-focus', function () {
                setTimeout(function () {
                    _this._onActiveWindowChanged.fire(_this.getLastActiveWindow());
                });
            });
            // React to workbench loaded events from windows
            electron_1.ipcMain.on('vscode:workbenchLoaded', function (event, windowId) {
                _this.logService.log('IPC#vscode-workbenchLoaded');
                var win = _this.getWindowById(windowId);
                if (win) {
                    win.setReady();
                    // Event
                    _this._onWindowReady.fire(win);
                }
            });
            // React to HC color scheme changes (Windows)
            if (platform_1.isWindows) {
                electron_1.systemPreferences.on('inverted-color-scheme-changed', function () {
                    if (electron_1.systemPreferences.isInvertedColorScheme()) {
                        _this.sendToAll('vscode:enterHighContrast');
                    }
                    else {
                        _this.sendToAll('vscode:leaveHighContrast');
                    }
                });
            }
            // Handle various lifecycle events around windows
            this.lifecycleService.onBeforeWindowUnload(function (e) { return _this.onBeforeWindowUnload(e); });
            this.lifecycleService.onBeforeWindowClose(function (win) { return _this.onBeforeWindowClose(win); });
            this.lifecycleService.onBeforeQuit(function () { return _this.onBeforeQuit(); });
            this.onWindowsCountChanged(function (e) {
                if (e.newCount - e.oldCount > 0) {
                    // clear last closed window state when a new window opens. this helps on macOS where
                    // otherwise closing the last window, opening a new window and then quitting would
                    // use the state of the previously closed window when restarting.
                    _this.lastClosedWindowState = void 0;
                }
            });
        };
        // Note that onBeforeQuit() and onBeforeWindowClose() are fired in different order depending on the OS:
        // - macOS: since the app will not quit when closing the last window, you will always first get
        //          the onBeforeQuit() event followed by N onbeforeWindowClose() events for each window
        // - other: on other OS, closing the last window will quit the app so the order depends on the
        //          user interaction: closing the last window will first trigger onBeforeWindowClose()
        //          and then onBeforeQuit(). Using the quit action however will first issue onBeforeQuit()
        //          and then onBeforeWindowClose().
        //
        // Here is the behaviour on different OS dependig on action taken (Electron 1.7.x):
        //
        // Legend
        // -  quit(N): quit application with N windows opened
        // - close(1): close one window via the window close button
        // - closeAll: close all windows via the taskbar command
        // - onBeforeQuit(N): number of windows reported in this event handler
        // - onBeforeWindowClose(N, M): number of windows reported and quitRequested boolean in this event handler
        //
        // macOS
        // 	-     quit(1): onBeforeQuit(1), onBeforeWindowClose(1, true)
        // 	-     quit(2): onBeforeQuit(2), onBeforeWindowClose(2, true), onBeforeWindowClose(2, true)
        // 	-     quit(0): onBeforeQuit(0)
        // 	-    close(1): onBeforeWindowClose(1, false)
        //
        // Windows
        // 	-     quit(1): onBeforeQuit(1), onBeforeWindowClose(1, true)
        // 	-     quit(2): onBeforeQuit(2), onBeforeWindowClose(2, true), onBeforeWindowClose(2, true)
        // 	-    close(1): onBeforeWindowClose(2, false)[not last window]
        // 	-    close(1): onBeforeWindowClose(1, false), onBeforequit(0)[last window]
        // 	- closeAll(2): onBeforeWindowClose(2, false), onBeforeWindowClose(2, false), onBeforeQuit(0)
        //
        // Linux
        // 	-     quit(1): onBeforeQuit(1), onBeforeWindowClose(1, true)
        // 	-     quit(2): onBeforeQuit(2), onBeforeWindowClose(2, true), onBeforeWindowClose(2, true)
        // 	-    close(1): onBeforeWindowClose(2, false)[not last window]
        // 	-    close(1): onBeforeWindowClose(1, false), onBeforequit(0)[last window]
        // 	- closeAll(2): onBeforeWindowClose(2, false), onBeforeWindowClose(2, false), onBeforeQuit(0)
        //
        WindowsManager.prototype.onBeforeQuit = function () {
            var _this = this;
            var currentWindowsState = {
                openedWindows: [],
                openedFolders: [],
                lastPluginDevelopmentHostWindow: this.windowsState.lastPluginDevelopmentHostWindow,
                lastActiveWindow: this.lastClosedWindowState
            };
            // 1.) Find a last active window (pick any other first window otherwise)
            if (!currentWindowsState.lastActiveWindow) {
                var activeWindow = this.getLastActiveWindow();
                if (!activeWindow || activeWindow.isExtensionDevelopmentHost) {
                    activeWindow = WindowsManager.WINDOWS.filter(function (w) { return !w.isExtensionDevelopmentHost; })[0];
                }
                if (activeWindow) {
                    currentWindowsState.lastActiveWindow = this.toWindowState(activeWindow);
                }
            }
            // 2.) Find extension host window
            var extensionHostWindow = WindowsManager.WINDOWS.filter(function (w) { return w.isExtensionDevelopmentHost && !w.isExtensionTestHost; })[0];
            if (extensionHostWindow) {
                currentWindowsState.lastPluginDevelopmentHostWindow = this.toWindowState(extensionHostWindow);
            }
            // 3.) All windows (except extension host) for N >= 2 to support restoreWindows: all or for auto update
            //
            // Carefull here: asking a window for its window state after it has been closed returns bogus values (width: 0, height: 0)
            // so if we ever want to persist the UI state of the last closed window (window count === 1), it has
            // to come from the stored lastClosedWindowState on Win/Linux at least
            if (this.getWindowCount() > 1) {
                currentWindowsState.openedWindows = WindowsManager.WINDOWS.filter(function (w) { return !w.isExtensionDevelopmentHost; }).map(function (w) { return _this.toWindowState(w); });
            }
            // Persist
            this.storageService.setItem(WindowsManager.windowsStateStorageKey, currentWindowsState);
        };
        // See note on #onBeforeQuit() for details how these events are flowing
        WindowsManager.prototype.onBeforeWindowClose = function (win) {
            if (this.lifecycleService.isQuitRequested()) {
                return; // during quit, many windows close in parallel so let it be handled in the before-quit handler
            }
            // On Window close, update our stored UI state of this window
            var state = this.toWindowState(win);
            if (win.isExtensionDevelopmentHost && !win.isExtensionTestHost) {
                this.windowsState.lastPluginDevelopmentHostWindow = state; // do not let test run window state overwrite our extension development state
            }
            else if (!win.isExtensionDevelopmentHost && (!!win.openedWorkspace || !!win.openedFolderPath)) {
                this.windowsState.openedWindows.forEach(function (o) {
                    var sameWorkspace = win.openedWorkspace && o.workspace && o.workspace.id === win.openedWorkspace.id;
                    var sameFolder = win.openedFolderPath && paths_2.isEqual(o.folderPath, win.openedFolderPath, !platform_1.isLinux /* ignorecase */);
                    if (sameWorkspace || sameFolder) {
                        o.uiState = state.uiState;
                    }
                });
            }
            // On Windows and Linux closing the last window will trigger quit. Since we are storing all UI state
            // before quitting, we need to remember the UI state of this window to be able to persist it.
            // On macOS we keep the last closed window state ready in case the user wants to quit right after or
            // wants to open another window, in which case we use this state over the persisted one.
            if (this.getWindowCount() === 1) {
                this.lastClosedWindowState = state;
            }
        };
        WindowsManager.prototype.toWindowState = function (win) {
            return {
                workspace: win.openedWorkspace,
                folderPath: win.openedFolderPath,
                backupPath: win.backupPath,
                uiState: win.serializeWindowState()
            };
        };
        WindowsManager.prototype.open = function (openConfig) {
            var _this = this;
            var pathsToOpen = this.getPathsToOpen(openConfig);
            // When run with --add, take the folders that are to be opened as
            // folders that should be added to the currently active window.
            var foldersToAdd = [];
            if (openConfig.addMode && product_1.default.quality !== 'stable') {
                foldersToAdd = pathsToOpen.filter(function (path) { return !!path.folderPath; }).map(function (path) { return ({ filePath: path.folderPath }); });
                pathsToOpen = pathsToOpen.filter(function (path) { return !path.folderPath; });
            }
            var filesToOpen = pathsToOpen.filter(function (path) { return !!path.filePath && !path.createFilePath; });
            var filesToCreate = pathsToOpen.filter(function (path) { return !!path.filePath && path.createFilePath; });
            // When run with --diff, take the files to open as files to diff
            // if there are exactly two files provided.
            var filesToDiff = [];
            if (openConfig.diffMode && filesToOpen.length === 2) {
                filesToDiff = filesToOpen;
                filesToOpen = [];
                filesToCreate = []; // diff ignores other files that do not exist
            }
            //
            // These are windows to open to show workspaces
            //
            var workspacesToOpen = arrays.distinct(pathsToOpen.filter(function (win) { return !!win.workspace; }).map(function (win) { return win.workspace; }), function (workspace) { return workspace.id; }); // prevent duplicates
            //
            // These are windows to open to show either folders or files (including diffing files or creating them)
            //
            var foldersToOpen = arrays.distinct(pathsToOpen.filter(function (win) { return win.folderPath && !win.filePath; }).map(function (win) { return win.folderPath; }), function (folder) { return platform_1.isLinux ? folder : folder.toLowerCase(); }); // prevent duplicates
            //
            // These are windows to restore because of hot-exit or from previous session (only performed once on startup!)
            //
            var foldersToRestore = [];
            var workspacesToRestore = [];
            var emptyToRestore = [];
            if (openConfig.initialStartup && !openConfig.cli.extensionDevelopmentPath) {
                foldersToRestore = this.backupService.getFolderBackupPaths();
                workspacesToRestore = this.backupService.getWorkspaceBackups(); // collect from workspaces with hot-exit backups
                workspacesToRestore.push.apply(// collect from workspaces with hot-exit backups
                workspacesToRestore, this.workspacesService.getUntitledWorkspacesSync()); // collect from previous window session
                emptyToRestore = this.backupService.getEmptyWindowBackupPaths();
                emptyToRestore.push.apply(emptyToRestore, pathsToOpen.filter(function (w) { return !w.workspace && !w.folderPath && w.backupPath; }).map(function (w) { return path.basename(w.backupPath); })); // add empty windows with backupPath
                emptyToRestore = arrays.distinct(emptyToRestore); // prevent duplicates
            }
            //
            // These are empty windows to open
            //
            var emptyToOpen = pathsToOpen.filter(function (win) { return !win.workspace && !win.folderPath && !win.filePath && !win.backupPath; }).length;
            // Open based on config
            var usedWindows = this.doOpen(openConfig, workspacesToOpen, workspacesToRestore, foldersToOpen, foldersToRestore, emptyToRestore, emptyToOpen, filesToOpen, filesToCreate, filesToDiff, foldersToAdd);
            // Make sure the last active window gets focus if we opened multiple
            if (usedWindows.length > 1 && this.windowsState.lastActiveWindow) {
                var lastActiveWindw = usedWindows.filter(function (w) { return w.backupPath === _this.windowsState.lastActiveWindow.backupPath; });
                if (lastActiveWindw.length) {
                    lastActiveWindw[0].focus();
                }
            }
            // Remember in recent document list (unless this opens for extension development)
            // Also do not add paths when files are opened for diffing, only if opened individually
            if (!usedWindows.some(function (w) { return w.isExtensionDevelopmentHost; }) && !openConfig.cli.diff) {
                var recentlyOpenedWorkspaces_1 = [];
                var recentlyOpenedFiles_1 = [];
                pathsToOpen.forEach(function (win) {
                    if (win.workspace || win.folderPath) {
                        recentlyOpenedWorkspaces_1.push(win.workspace || win.folderPath);
                    }
                    else if (win.filePath) {
                        recentlyOpenedFiles_1.push(win.filePath);
                    }
                });
                this.historyService.addRecentlyOpened(recentlyOpenedWorkspaces_1, recentlyOpenedFiles_1);
            }
            // If we got started with --wait from the CLI, we need to signal to the outside when the window
            // used for the edit operation is closed so that the waiting process can continue. We do this by
            // deleting the waitMarkerFilePath.
            if (openConfig.context === windows_1.OpenContext.CLI && openConfig.cli.wait && openConfig.cli.waitMarkerFilePath && usedWindows.length === 1 && usedWindows[0]) {
                this.waitForWindowClose(usedWindows[0].id).done(function () { return fs.unlink(openConfig.cli.waitMarkerFilePath, function (error) { return void 0; }); });
            }
            return usedWindows;
        };
        WindowsManager.prototype.doOpen = function (openConfig, workspacesToOpen, workspacesToRestore, foldersToOpen, foldersToRestore, emptyToRestore, emptyToOpen, filesToOpen, filesToCreate, filesToDiff, foldersToAdd) {
            var _this = this;
            var usedWindows = [];
            // Settings can decide if files/folders open in new window or not
            var _a = this.shouldOpenNewWindow(openConfig), openFolderInNewWindow = _a.openFolderInNewWindow, openFilesInNewWindow = _a.openFilesInNewWindow;
            // Handle folders to add by looking for the last active workspace (not on initial startup)
            if (!openConfig.initialStartup && foldersToAdd.length > 0) {
                var lastActiveWindow = this.getLastActiveWindow();
                if (lastActiveWindow) {
                    usedWindows.push(this.doAddFoldersToExistingWidow(lastActiveWindow, foldersToAdd));
                }
                // Reset because we handled them
                foldersToAdd = [];
            }
            // Handle files to open/diff or to create when we dont open a folder and we do not restore any folder/untitled from hot-exit
            var potentialWindowsCount = foldersToOpen.length + foldersToRestore.length + workspacesToOpen.length + workspacesToRestore.length + emptyToRestore.length;
            if (potentialWindowsCount === 0 && (filesToOpen.length > 0 || filesToCreate.length > 0 || filesToDiff.length > 0)) {
                // Find suitable window or folder path to open files in
                var fileToCheck = filesToOpen[0] || filesToCreate[0] || filesToDiff[0];
                var bestWindowOrFolder = windowsFinder_1.findBestWindowOrFolderForFile({
                    windows: WindowsManager.WINDOWS,
                    newWindow: openFilesInNewWindow,
                    reuseWindow: openConfig.forceReuseWindow,
                    context: openConfig.context,
                    filePath: fileToCheck && fileToCheck.filePath,
                    userHome: this.environmentService.userHome,
                    workspaceResolver: function (workspace) { return _this.workspacesService.resolveWorkspaceSync(workspace.configPath); }
                });
                // We found a window to open the files in
                if (bestWindowOrFolder instanceof window_1.CodeWindow) {
                    // Window is workspace
                    if (bestWindowOrFolder.openedWorkspace) {
                        workspacesToOpen.push(bestWindowOrFolder.openedWorkspace);
                    }
                    else if (bestWindowOrFolder.openedFolderPath) {
                        foldersToOpen.push(bestWindowOrFolder.openedFolderPath);
                    }
                    else {
                        // Do open files
                        usedWindows.push(this.doOpenFilesInExistingWindow(bestWindowOrFolder, filesToOpen, filesToCreate, filesToDiff));
                        // Reset these because we handled them
                        filesToOpen = [];
                        filesToCreate = [];
                        filesToDiff = [];
                    }
                }
                else if (typeof bestWindowOrFolder === 'string') {
                    foldersToOpen.push(bestWindowOrFolder);
                }
                else {
                    usedWindows.push(this.openInBrowserWindow({
                        userEnv: openConfig.userEnv,
                        cli: openConfig.cli,
                        initialStartup: openConfig.initialStartup,
                        filesToOpen: filesToOpen,
                        filesToCreate: filesToCreate,
                        filesToDiff: filesToDiff,
                        forceNewWindow: true
                    }));
                    // Reset these because we handled them
                    filesToOpen = [];
                    filesToCreate = [];
                    filesToDiff = [];
                }
            }
            // Handle workspaces to open (instructed and to restore)
            var allWorkspacesToOpen = arrays.distinct(workspacesToOpen.concat(workspacesToRestore), function (workspace) { return workspace.id; }); // prevent duplicates
            if (allWorkspacesToOpen.length > 0) {
                // Check for existing instances
                var windowsOnWorkspace_1 = arrays.coalesce(allWorkspacesToOpen.map(function (workspaceToOpen) { return windowsFinder_1.findWindowOnWorkspace(WindowsManager.WINDOWS, workspaceToOpen); }));
                if (windowsOnWorkspace_1.length > 0) {
                    var windowOnWorkspace = windowsOnWorkspace_1[0];
                    // Do open files
                    usedWindows.push(this.doOpenFilesInExistingWindow(windowOnWorkspace, filesToOpen, filesToCreate, filesToDiff));
                    // Reset these because we handled them
                    filesToOpen = [];
                    filesToCreate = [];
                    filesToDiff = [];
                    openFolderInNewWindow = true; // any other folders to open must open in new window then
                }
                // Open remaining ones
                allWorkspacesToOpen.forEach(function (workspaceToOpen) {
                    if (windowsOnWorkspace_1.some(function (win) { return win.openedWorkspace.id === workspaceToOpen.id; })) {
                        return; // ignore folders that are already open
                    }
                    // Do open folder
                    usedWindows.push(_this.doOpenFolderOrWorkspace(openConfig, { workspace: workspaceToOpen }, openFolderInNewWindow, filesToOpen, filesToCreate, filesToDiff));
                    // Reset these because we handled them
                    filesToOpen = [];
                    filesToCreate = [];
                    filesToDiff = [];
                    openFolderInNewWindow = true; // any other folders to open must open in new window then
                });
            }
            // Handle folders to open (instructed and to restore)
            var allFoldersToOpen = arrays.distinct(foldersToOpen.concat(foldersToRestore), function (folder) { return platform_1.isLinux ? folder : folder.toLowerCase(); }); // prevent duplicates
            if (allFoldersToOpen.length > 0) {
                // Check for existing instances
                var windowsOnFolderPath_1 = arrays.coalesce(allFoldersToOpen.map(function (folderToOpen) { return windowsFinder_1.findWindowOnWorkspace(WindowsManager.WINDOWS, folderToOpen); }));
                if (windowsOnFolderPath_1.length > 0) {
                    var windowOnFolderPath = windowsOnFolderPath_1[0];
                    // Do open files
                    usedWindows.push(this.doOpenFilesInExistingWindow(windowOnFolderPath, filesToOpen, filesToCreate, filesToDiff));
                    // Reset these because we handled them
                    filesToOpen = [];
                    filesToCreate = [];
                    filesToDiff = [];
                    openFolderInNewWindow = true; // any other folders to open must open in new window then
                }
                // Open remaining ones
                allFoldersToOpen.forEach(function (folderToOpen) {
                    if (windowsOnFolderPath_1.some(function (win) { return paths_2.isEqual(win.openedFolderPath, folderToOpen, !platform_1.isLinux /* ignorecase */); })) {
                        return; // ignore folders that are already open
                    }
                    // Do open folder
                    usedWindows.push(_this.doOpenFolderOrWorkspace(openConfig, { folderPath: folderToOpen }, openFolderInNewWindow, filesToOpen, filesToCreate, filesToDiff));
                    // Reset these because we handled them
                    filesToOpen = [];
                    filesToCreate = [];
                    filesToDiff = [];
                    openFolderInNewWindow = true; // any other folders to open must open in new window then
                });
            }
            // Handle empty to restore
            if (emptyToRestore.length > 0) {
                emptyToRestore.forEach(function (emptyWindowBackupFolder) {
                    usedWindows.push(_this.openInBrowserWindow({
                        userEnv: openConfig.userEnv,
                        cli: openConfig.cli,
                        initialStartup: openConfig.initialStartup,
                        filesToOpen: filesToOpen,
                        filesToCreate: filesToCreate,
                        filesToDiff: filesToDiff,
                        forceNewWindow: true,
                        emptyWindowBackupFolder: emptyWindowBackupFolder
                    }));
                    // Reset these because we handled them
                    filesToOpen = [];
                    filesToCreate = [];
                    filesToDiff = [];
                    openFolderInNewWindow = true; // any other folders to open must open in new window then
                });
            }
            // Handle empty to open (only if no other window opened)
            if (usedWindows.length === 0) {
                for (var i = 0; i < emptyToOpen; i++) {
                    usedWindows.push(this.openInBrowserWindow({
                        userEnv: openConfig.userEnv,
                        cli: openConfig.cli,
                        initialStartup: openConfig.initialStartup,
                        forceNewWindow: openFolderInNewWindow
                    }));
                    openFolderInNewWindow = true; // any other window to open must open in new window then
                }
            }
            return arrays.distinct(usedWindows);
        };
        WindowsManager.prototype.doOpenFilesInExistingWindow = function (window, filesToOpen, filesToCreate, filesToDiff) {
            window.focus(); // make sure window has focus
            window.ready().then(function (readyWindow) {
                readyWindow.send('vscode:openFiles', { filesToOpen: filesToOpen, filesToCreate: filesToCreate, filesToDiff: filesToDiff });
            });
            return window;
        };
        WindowsManager.prototype.doAddFoldersToExistingWidow = function (window, foldersToAdd) {
            window.focus(); // make sure window has focus
            window.ready().then(function (readyWindow) {
                readyWindow.send('vscode:addFolders', { foldersToAdd: foldersToAdd });
            });
            return window;
        };
        WindowsManager.prototype.doOpenFolderOrWorkspace = function (openConfig, folderOrWorkspace, openInNewWindow, filesToOpen, filesToCreate, filesToDiff, windowToUse) {
            var browserWindow = this.openInBrowserWindow({
                userEnv: openConfig.userEnv,
                cli: openConfig.cli,
                initialStartup: openConfig.initialStartup,
                workspace: folderOrWorkspace.workspace,
                folderPath: folderOrWorkspace.folderPath,
                filesToOpen: filesToOpen,
                filesToCreate: filesToCreate,
                filesToDiff: filesToDiff,
                forceNewWindow: openInNewWindow,
                windowToUse: windowToUse
            });
            return browserWindow;
        };
        WindowsManager.prototype.getPathsToOpen = function (openConfig) {
            var windowsToOpen;
            var convertFoldersToWorkspace = false;
            // Extract paths: from API
            if (openConfig.pathsToOpen && openConfig.pathsToOpen.length > 0) {
                windowsToOpen = this.doExtractPathsFromAPI(openConfig);
                convertFoldersToWorkspace = true;
            }
            else if (openConfig.forceEmpty) {
                windowsToOpen = [Object.create(null)];
            }
            else if (openConfig.cli._.length > 0) {
                windowsToOpen = this.doExtractPathsFromCLI(openConfig.cli);
                convertFoldersToWorkspace = true;
            }
            else {
                windowsToOpen = this.doGetWindowsFromLastSession();
            }
            // Convert multiple folders into workspace (if opened via API or CLI)
            // This will ensure to open these folders in one window instead of multiple
            if (convertFoldersToWorkspace && product_1.default.quality !== 'stable') {
                var foldersToOpen = windowsToOpen.filter(function (path) { return !!path.folderPath; });
                if (foldersToOpen.length > 1) {
                    var workspace = this.workspacesService.createWorkspaceSync(foldersToOpen.map(function (folder) { return folder.folderPath; }));
                    // Add workspace and remove folders thereby
                    windowsToOpen.push({ workspace: workspace });
                    windowsToOpen = windowsToOpen.filter(function (path) { return !path.folderPath; });
                }
            }
            return windowsToOpen;
        };
        WindowsManager.prototype.doExtractPathsFromAPI = function (openConfig) {
            var _this = this;
            var pathsToOpen = openConfig.pathsToOpen.map(function (pathToOpen) {
                var path = _this.parsePath(pathToOpen, { gotoLineMode: openConfig.cli && openConfig.cli.goto, forceOpenWorkspaceAsFile: openConfig.forceOpenWorkspaceAsFile });
                // Warn if the requested path to open does not exist
                if (!path) {
                    var options = {
                        title: product_1.default.nameLong,
                        type: 'info',
                        buttons: [nls_1.localize('ok', "OK")],
                        message: nls_1.localize('pathNotExistTitle', "Path does not exist"),
                        detail: nls_1.localize('pathNotExistDetail', "The path '{0}' does not seem to exist anymore on disk.", pathToOpen),
                        noLink: true
                    };
                    var activeWindow = electron_1.BrowserWindow.getFocusedWindow();
                    if (activeWindow) {
                        electron_1.dialog.showMessageBox(activeWindow, options);
                    }
                    else {
                        electron_1.dialog.showMessageBox(options);
                    }
                }
                return path;
            });
            // get rid of nulls
            pathsToOpen = arrays.coalesce(pathsToOpen);
            return pathsToOpen;
        };
        WindowsManager.prototype.doExtractPathsFromCLI = function (cli) {
            var _this = this;
            var pathsToOpen = arrays.coalesce(cli._.map(function (candidate) { return _this.parsePath(candidate, { ignoreFileNotFound: true, gotoLineMode: cli.goto }); }));
            if (pathsToOpen.length > 0) {
                return pathsToOpen;
            }
            // No path provided, return empty to open empty
            return [Object.create(null)];
        };
        WindowsManager.prototype.doGetWindowsFromLastSession = function () {
            var _this = this;
            var restoreWindows = this.getRestoreWindowsSetting();
            var lastActiveWindow = this.windowsState.lastActiveWindow;
            switch (restoreWindows) {
                // none: we always open an empty window
                case 'none':
                    return [Object.create(null)];
                // one: restore last opened workspace/folder or empty window
                case 'one':
                    if (lastActiveWindow) {
                        // workspace
                        var candidateWorkspace = lastActiveWindow.workspace;
                        if (candidateWorkspace) {
                            var validatedWorkspace = this.parsePath(candidateWorkspace.configPath);
                            if (validatedWorkspace && validatedWorkspace.workspace) {
                                return [validatedWorkspace];
                            }
                        }
                        else if (lastActiveWindow.folderPath) {
                            var validatedFolder = this.parsePath(lastActiveWindow.folderPath);
                            if (validatedFolder && validatedFolder.folderPath) {
                                return [validatedFolder];
                            }
                        }
                        else if (lastActiveWindow.backupPath) {
                            return [{ backupPath: lastActiveWindow.backupPath }];
                        }
                    }
                    break;
                // all: restore all windows
                // folders: restore last opened folders only
                case 'all':
                case 'folders':
                    var windowsToOpen = [];
                    // Workspaces
                    var workspaceCandidates = this.windowsState.openedWindows.filter(function (w) { return !!w.workspace; }).map(function (w) { return w.workspace; });
                    if (lastActiveWindow && lastActiveWindow.workspace) {
                        workspaceCandidates.push(lastActiveWindow.workspace);
                    }
                    windowsToOpen.push.apply(windowsToOpen, workspaceCandidates.map(function (candidate) { return _this.parsePath(candidate.configPath); }).filter(function (window) { return window && window.workspace; }));
                    // Folders
                    var folderCandidates = this.windowsState.openedWindows.filter(function (w) { return !!w.folderPath; }).map(function (w) { return w.folderPath; });
                    if (lastActiveWindow && lastActiveWindow.folderPath) {
                        folderCandidates.push(lastActiveWindow.folderPath);
                    }
                    windowsToOpen.push.apply(windowsToOpen, folderCandidates.map(function (candidate) { return _this.parsePath(candidate); }).filter(function (window) { return window && window.folderPath; }));
                    // Windows that were Empty
                    if (restoreWindows === 'all') {
                        var lastOpenedEmpty = this.windowsState.openedWindows.filter(function (w) { return !w.workspace && !w.folderPath && w.backupPath; }).map(function (w) { return w.backupPath; });
                        var lastActiveEmpty = lastActiveWindow && !lastActiveWindow.workspace && !lastActiveWindow.folderPath && lastActiveWindow.backupPath;
                        if (lastActiveEmpty) {
                            lastOpenedEmpty.push(lastActiveEmpty);
                        }
                        windowsToOpen.push.apply(windowsToOpen, lastOpenedEmpty.map(function (backupPath) { return ({ backupPath: backupPath }); }));
                    }
                    if (windowsToOpen.length > 0) {
                        return windowsToOpen;
                    }
                    break;
            }
            // Always fallback to empty window
            return [Object.create(null)];
        };
        WindowsManager.prototype.getRestoreWindowsSetting = function () {
            var restoreWindows;
            if (this.lifecycleService.wasRestarted) {
                restoreWindows = 'all'; // always reopen all windows when an update was applied
            }
            else {
                var windowConfig = this.configurationService.getConfiguration('window');
                restoreWindows = ((windowConfig && windowConfig.restoreWindows) || 'one');
                if (restoreWindows === 'one' /* default */ && windowConfig && windowConfig.reopenFolders) {
                    restoreWindows = windowConfig.reopenFolders; // TODO@Ben migration
                }
                if (['all', 'folders', 'one', 'none'].indexOf(restoreWindows) === -1) {
                    restoreWindows = 'one';
                }
            }
            return restoreWindows;
        };
        WindowsManager.prototype.parsePath = function (anyPath, options) {
            if (!anyPath) {
                return null;
            }
            var parsedPath;
            var gotoLineMode = options && options.gotoLineMode;
            if (options && options.gotoLineMode) {
                parsedPath = paths_1.parseLineAndColumnAware(anyPath);
                anyPath = parsedPath.path;
            }
            var candidate = path.normalize(anyPath);
            try {
                var candidateStat = fs.statSync(candidate);
                if (candidateStat) {
                    if (candidateStat.isFile()) {
                        // Workspace (unless disabled via flag)
                        if (!options || !options.forceOpenWorkspaceAsFile) {
                            var workspace = this.workspacesService.resolveWorkspaceSync(candidate);
                            if (workspace) {
                                return { workspace: { id: workspace.id, configPath: workspace.configPath } };
                            }
                        }
                        // File
                        return {
                            filePath: candidate,
                            lineNumber: gotoLineMode ? parsedPath.line : void 0,
                            columnNumber: gotoLineMode ? parsedPath.column : void 0
                        };
                    }
                    // Folder
                    return {
                        folderPath: candidate
                    };
                }
            }
            catch (error) {
                this.historyService.removeFromRecentlyOpened([candidate]); // since file does not seem to exist anymore, remove from recent
                if (options && options.ignoreFileNotFound) {
                    return { filePath: candidate, createFilePath: true }; // assume this is a file that does not yet exist
                }
            }
            return null;
        };
        WindowsManager.prototype.shouldOpenNewWindow = function (openConfig) {
            // let the user settings override how folders are open in a new window or same window unless we are forced
            var windowConfig = this.configurationService.getConfiguration('window');
            var openFolderInNewWindowConfig = (windowConfig && windowConfig.openFoldersInNewWindow) || 'default' /* default */;
            var openFilesInNewWindowConfig = (windowConfig && windowConfig.openFilesInNewWindow) || 'off' /* default */;
            var openFolderInNewWindow = (openConfig.preferNewWindow || openConfig.forceNewWindow) && !openConfig.forceReuseWindow;
            if (!openConfig.forceNewWindow && !openConfig.forceReuseWindow && (openFolderInNewWindowConfig === 'on' || openFolderInNewWindowConfig === 'off')) {
                openFolderInNewWindow = (openFolderInNewWindowConfig === 'on');
            }
            // let the user settings override how files are open in a new window or same window unless we are forced (not for extension development though)
            var openFilesInNewWindow;
            if (openConfig.forceNewWindow || openConfig.forceReuseWindow) {
                openFilesInNewWindow = openConfig.forceNewWindow && !openConfig.forceReuseWindow;
            }
            else {
                if (openConfig.context === windows_1.OpenContext.DOCK) {
                    openFilesInNewWindow = true; // only on macOS do we allow to open files in a new window if this is triggered via DOCK context
                }
                if (!openConfig.cli.extensionDevelopmentPath && (openFilesInNewWindowConfig === 'on' || openFilesInNewWindowConfig === 'off')) {
                    openFilesInNewWindow = (openFilesInNewWindowConfig === 'on');
                }
            }
            return { openFolderInNewWindow: openFolderInNewWindow, openFilesInNewWindow: openFilesInNewWindow };
        };
        WindowsManager.prototype.openExtensionDevelopmentHostWindow = function (openConfig) {
            // Reload an existing extension development host window on the same path
            // We currently do not allow more than one extension development window
            // on the same extension path.
            var existingWindow = windowsFinder_1.findWindowOnExtensionDevelopmentPath(WindowsManager.WINDOWS, openConfig.cli.extensionDevelopmentPath);
            if (existingWindow) {
                this.reload(existingWindow, openConfig.cli);
                existingWindow.focus(); // make sure it gets focus and is restored
                return;
            }
            // Fill in previously opened workspace unless an explicit path is provided and we are not unit testing
            if (openConfig.cli._.length === 0 && !openConfig.cli.extensionTestsPath) {
                var extensionDevelopmentWindowState = this.windowsState.lastPluginDevelopmentHostWindow;
                var workspaceToOpen = extensionDevelopmentWindowState && (extensionDevelopmentWindowState.workspace || extensionDevelopmentWindowState.folderPath);
                if (workspaceToOpen) {
                    openConfig.cli._ = [workspaces_1.isSingleFolderWorkspaceIdentifier(workspaceToOpen) ? workspaceToOpen : workspaceToOpen.configPath];
                }
            }
            // Make sure we are not asked to open a workspace or folder that is already opened
            if (openConfig.cli._.some(function (path) { return !!windowsFinder_1.findWindowOnWorkspaceOrFolderPath(WindowsManager.WINDOWS, path); })) {
                openConfig.cli._ = [];
            }
            // Open it
            this.open({ context: openConfig.context, cli: openConfig.cli, forceNewWindow: true, forceEmpty: openConfig.cli._.length === 0, userEnv: openConfig.userEnv });
        };
        WindowsManager.prototype.openInBrowserWindow = function (options) {
            var _this = this;
            // Build IWindowConfiguration from config and options
            var configuration = objects_1.mixin({}, options.cli); // inherit all properties from CLI
            configuration.appRoot = this.environmentService.appRoot;
            configuration.execPath = process.execPath;
            configuration.userEnv = objects_1.assign({}, this.initialUserEnv, options.userEnv || {});
            configuration.isInitialStartup = options.initialStartup;
            configuration.workspace = options.workspace;
            configuration.folderPath = options.folderPath;
            configuration.filesToOpen = options.filesToOpen;
            configuration.filesToCreate = options.filesToCreate;
            configuration.filesToDiff = options.filesToDiff;
            configuration.nodeCachedDataDir = this.environmentService.nodeCachedDataDir;
            // if we know the backup folder upfront (for empty windows to restore), we can set it
            // directly here which helps for restoring UI state associated with that window.
            // For all other cases we first call into registerEmptyWindowBackupSync() to set it before
            // loading the window.
            if (options.emptyWindowBackupFolder) {
                configuration.backupPath = path.join(this.environmentService.backupHome, options.emptyWindowBackupFolder);
            }
            var window;
            if (!options.forceNewWindow) {
                window = options.windowToUse || this.getLastActiveWindow();
                if (window) {
                    window.focus();
                }
            }
            // New window
            if (!window) {
                var windowConfig = this.configurationService.getConfiguration('window');
                var state = this.getNewWindowState(configuration);
                // Window state is not from a previous session: only allow fullscreen if we inherit it or user wants fullscreen
                var allowFullscreen = void 0;
                if (state.hasDefaultState) {
                    allowFullscreen = (windowConfig && windowConfig.newWindowDimensions && ['fullscreen', 'inherit'].indexOf(windowConfig.newWindowDimensions) >= 0);
                }
                else {
                    allowFullscreen = this.lifecycleService.wasRestarted || (windowConfig && windowConfig.restoreFullscreen);
                }
                if (state.mode === window_1.WindowMode.Fullscreen && !allowFullscreen) {
                    state.mode = window_1.WindowMode.Normal;
                }
                window = this.instantiationService.createInstance(window_1.CodeWindow, {
                    state: state,
                    extensionDevelopmentPath: configuration.extensionDevelopmentPath,
                    isExtensionTestHost: !!configuration.extensionTestsPath
                });
                // Add to our list of windows
                WindowsManager.WINDOWS.push(window);
                // Indicate number change via event
                this._onWindowsCountChanged.fire({ oldCount: WindowsManager.WINDOWS.length - 1, newCount: WindowsManager.WINDOWS.length });
                // Window Events
                window.win.webContents.removeAllListeners('devtools-reload-page'); // remove built in listener so we can handle this on our own
                window.win.webContents.on('devtools-reload-page', function () { return _this.reload(window); });
                window.win.webContents.on('crashed', function () { return _this.onWindowError(window, WindowError.CRASHED); });
                window.win.on('unresponsive', function () { return _this.onWindowError(window, WindowError.UNRESPONSIVE); });
                window.win.on('closed', function () { return _this.onWindowClosed(window); });
                // Lifecycle
                this.lifecycleService.registerWindow(window);
            }
            else {
                // Some configuration things get inherited if the window is being reused and we are
                // in extension development host mode. These options are all development related.
                var currentWindowConfig = window.config;
                if (!configuration.extensionDevelopmentPath && currentWindowConfig && !!currentWindowConfig.extensionDevelopmentPath) {
                    configuration.extensionDevelopmentPath = currentWindowConfig.extensionDevelopmentPath;
                    configuration.verbose = currentWindowConfig.verbose;
                    configuration.debugBrkPluginHost = currentWindowConfig.debugBrkPluginHost;
                    configuration.debugId = currentWindowConfig.debugId;
                    configuration.debugPluginHost = currentWindowConfig.debugPluginHost;
                    configuration['extensions-dir'] = currentWindowConfig['extensions-dir'];
                }
            }
            // Only load when the window has not vetoed this
            this.lifecycleService.unload(window, lifecycleMain_1.UnloadReason.LOAD).done(function (veto) {
                if (!veto) {
                    // Register window for backups
                    if (!configuration.extensionDevelopmentPath) {
                        if (configuration.workspace) {
                            configuration.backupPath = _this.backupService.registerWorkspaceBackupSync(configuration.workspace);
                        }
                        else if (configuration.folderPath) {
                            configuration.backupPath = _this.backupService.registerFolderBackupSync(configuration.folderPath);
                        }
                        else {
                            configuration.backupPath = _this.backupService.registerEmptyWindowBackupSync(options.emptyWindowBackupFolder);
                        }
                    }
                    // Load it
                    window.load(configuration);
                }
            });
            return window;
        };
        WindowsManager.prototype.getNewWindowState = function (configuration) {
            var lastActive = this.getLastActiveWindow();
            // Restore state unless we are running extension tests
            if (!configuration.extensionTestsPath) {
                // extension development host Window - load from stored settings if any
                if (!!configuration.extensionDevelopmentPath && this.windowsState.lastPluginDevelopmentHostWindow) {
                    return this.windowsState.lastPluginDevelopmentHostWindow.uiState;
                }
                // Known Workspace - load from stored settings
                if (configuration.workspace) {
                    var stateForWorkspace = this.windowsState.openedWindows.filter(function (o) { return o.workspace && o.workspace.id === configuration.workspace.id; }).map(function (o) { return o.uiState; });
                    if (stateForWorkspace.length) {
                        return stateForWorkspace[0];
                    }
                }
                // Known Folder - load from stored settings
                if (configuration.folderPath) {
                    var stateForFolder = this.windowsState.openedWindows.filter(function (o) { return paths_2.isEqual(o.folderPath, configuration.folderPath, !platform_1.isLinux /* ignorecase */); }).map(function (o) { return o.uiState; });
                    if (stateForFolder.length) {
                        return stateForFolder[0];
                    }
                }
                else if (configuration.backupPath) {
                    var stateForEmptyWindow = this.windowsState.openedWindows.filter(function (o) { return o.backupPath === configuration.backupPath; }).map(function (o) { return o.uiState; });
                    if (stateForEmptyWindow.length) {
                        return stateForEmptyWindow[0];
                    }
                }
                // First Window
                var lastActiveState = this.lastClosedWindowState || this.windowsState.lastActiveWindow;
                if (!lastActive && lastActiveState) {
                    return lastActiveState.uiState;
                }
            }
            //
            // In any other case, we do not have any stored settings for the window state, so we come up with something smart
            //
            // We want the new window to open on the same display that the last active one is in
            var displayToUse;
            var displays = electron_1.screen.getAllDisplays();
            // Single Display
            if (displays.length === 1) {
                displayToUse = displays[0];
            }
            else {
                // on mac there is 1 menu per window so we need to use the monitor where the cursor currently is
                if (platform_1.isMacintosh) {
                    var cursorPoint = electron_1.screen.getCursorScreenPoint();
                    displayToUse = electron_1.screen.getDisplayNearestPoint(cursorPoint);
                }
                // if we have a last active window, use that display for the new window
                if (!displayToUse && lastActive) {
                    displayToUse = electron_1.screen.getDisplayMatching(lastActive.getBounds());
                }
                // fallback to primary display or first display
                if (!displayToUse) {
                    displayToUse = electron_1.screen.getPrimaryDisplay() || displays[0];
                }
            }
            var state = window_1.defaultWindowState();
            state.x = displayToUse.bounds.x + (displayToUse.bounds.width / 2) - (state.width / 2);
            state.y = displayToUse.bounds.y + (displayToUse.bounds.height / 2) - (state.height / 2);
            // Check for newWindowDimensions setting and adjust accordingly
            var windowConfig = this.configurationService.getConfiguration('window');
            var ensureNoOverlap = true;
            if (windowConfig && windowConfig.newWindowDimensions) {
                if (windowConfig.newWindowDimensions === 'maximized') {
                    state.mode = window_1.WindowMode.Maximized;
                    ensureNoOverlap = false;
                }
                else if (windowConfig.newWindowDimensions === 'fullscreen') {
                    state.mode = window_1.WindowMode.Fullscreen;
                    ensureNoOverlap = false;
                }
                else if (windowConfig.newWindowDimensions === 'inherit' && lastActive) {
                    var lastActiveState = lastActive.serializeWindowState();
                    if (lastActiveState.mode === window_1.WindowMode.Fullscreen) {
                        state.mode = window_1.WindowMode.Fullscreen; // only take mode (fixes https://github.com/Microsoft/vscode/issues/19331)
                    }
                    else {
                        state = lastActiveState;
                    }
                    ensureNoOverlap = false;
                }
            }
            if (ensureNoOverlap) {
                state = this.ensureNoOverlap(state);
            }
            state.hasDefaultState = true; // flag as default state
            return state;
        };
        WindowsManager.prototype.ensureNoOverlap = function (state) {
            if (WindowsManager.WINDOWS.length === 0) {
                return state;
            }
            var existingWindowBounds = WindowsManager.WINDOWS.map(function (win) { return win.getBounds(); });
            while (existingWindowBounds.some(function (b) { return b.x === state.x || b.y === state.y; })) {
                state.x += 30;
                state.y += 30;
            }
            return state;
        };
        WindowsManager.prototype.reload = function (win, cli) {
            var _this = this;
            // Only reload when the window has not vetoed this
            this.lifecycleService.unload(win, lifecycleMain_1.UnloadReason.RELOAD).done(function (veto) {
                if (!veto) {
                    win.reload(void 0, cli);
                    // Emit
                    _this._onWindowReload.fire(win.id);
                }
            });
        };
        WindowsManager.prototype.closeWorkspace = function (win) {
            this.openInBrowserWindow({
                cli: this.environmentService.args,
                windowToUse: win
            });
        };
        WindowsManager.prototype.saveAndOpenWorkspace = function (window, path) {
            if (!window || !window.win || window.readyState !== windows_1.ReadyState.READY || !window.openedWorkspace || !path) {
                return winjs_base_1.TPromise.as(null); // return early if the window is not ready or disposed or does not have a workspace
            }
            return this.doSaveAndOpenWorkspace(window, window.openedWorkspace, path);
        };
        WindowsManager.prototype.createAndOpenWorkspace = function (window, folders, path) {
            var _this = this;
            if (!window || !window.win || window.readyState !== windows_1.ReadyState.READY) {
                return winjs_base_1.TPromise.as(null); // return early if the window is not ready or disposed
            }
            return this.workspacesService.createWorkspace(folders).then(function (workspace) {
                return _this.doSaveAndOpenWorkspace(window, workspace, path);
            });
        };
        WindowsManager.prototype.doSaveAndOpenWorkspace = function (window, workspace, path) {
            var _this = this;
            var savePromise;
            if (path) {
                savePromise = this.workspacesService.saveWorkspace(workspace, path);
            }
            else {
                savePromise = winjs_base_1.TPromise.as(workspace);
            }
            return savePromise.then(function (workspace) {
                window.focus();
                // Only open workspace when the window has not vetoed this
                return _this.lifecycleService.unload(window, lifecycleMain_1.UnloadReason.RELOAD, workspace).done(function (veto) {
                    if (!veto) {
                        // Register window for backups and migrate current backups over
                        var backupPath = void 0;
                        if (window.config && !window.config.extensionDevelopmentPath) {
                            backupPath = _this.backupService.registerWorkspaceBackupSync(workspace, window.config.backupPath);
                        }
                        // Craft a new window configuration to use for the transition
                        var configuration = objects_1.mixin({}, window.config);
                        configuration.folderPath = void 0;
                        configuration.workspace = workspace;
                        configuration.backupPath = backupPath;
                        // Reload
                        window.reload(configuration);
                    }
                });
            });
        };
        WindowsManager.prototype.openWorkspace = function (window) {
            if (window === void 0) { window = this.getLastActiveWindow(); }
            var defaultPath;
            if (window && window.openedWorkspace && !this.workspacesService.isUntitledWorkspace(window.openedWorkspace)) {
                defaultPath = path.dirname(window.openedWorkspace.configPath);
            }
            else {
                defaultPath = this.getWorkspaceDialogDefaultPath(window ? (window.openedWorkspace || window.openedFolderPath) : void 0);
            }
            this.pickFileAndOpen({
                windowId: window ? window.id : void 0,
                dialogOptions: {
                    buttonLabel: labels_1.mnemonicLabel(nls_1.localize({ key: 'openWorkspace', comment: ['&& denotes a mnemonic'] }, "&&Open")),
                    title: nls_1.localize('openWorkspaceTitle', "Open Workspace"),
                    filters: workspaces_1.WORKSPACE_FILTER,
                    properties: ['openFile'],
                    defaultPath: defaultPath
                }
            });
        };
        WindowsManager.prototype.getWorkspaceDialogDefaultPath = function (workspace) {
            var defaultPath;
            if (workspace) {
                if (workspaces_1.isSingleFolderWorkspaceIdentifier(workspace)) {
                    defaultPath = path.dirname(workspace);
                }
                else {
                    var resolvedWorkspace = this.workspacesService.resolveWorkspaceSync(workspace.configPath);
                    if (resolvedWorkspace && resolvedWorkspace.folders.length > 0) {
                        defaultPath = path.dirname(resolvedWorkspace.folders[0].path);
                    }
                }
            }
            return defaultPath;
        };
        WindowsManager.prototype.onBeforeWindowUnload = function (e) {
            var windowClosing = e.reason === lifecycleMain_1.UnloadReason.CLOSE;
            var windowLoading = e.reason === lifecycleMain_1.UnloadReason.LOAD;
            if (!windowClosing && !windowLoading) {
                return; // only interested when window is closing or loading
            }
            var workspace = e.window.openedWorkspace;
            if (!workspace || !this.workspacesService.isUntitledWorkspace(workspace)) {
                return; // only care about untitled workspaces to ask for saving
            }
            if (windowClosing && !platform_1.isMacintosh && this.getWindowCount() === 1) {
                return; // Windows/Linux: quits when last window is closed, so do not ask then
            }
            this.promptToSaveUntitledWorkspace(e, workspace);
        };
        WindowsManager.prototype.promptToSaveUntitledWorkspace = function (e, workspace) {
            var ConfirmResult;
            (function (ConfirmResult) {
                ConfirmResult[ConfirmResult["SAVE"] = 0] = "SAVE";
                ConfirmResult[ConfirmResult["DONT_SAVE"] = 1] = "DONT_SAVE";
                ConfirmResult[ConfirmResult["CANCEL"] = 2] = "CANCEL";
            })(ConfirmResult || (ConfirmResult = {}));
            var save = { label: labels_1.mnemonicLabel(nls_1.localize({ key: 'save', comment: ['&& denotes a mnemonic'] }, "&&Save")), result: ConfirmResult.SAVE };
            var dontSave = { label: labels_1.mnemonicLabel(nls_1.localize({ key: 'doNotSave', comment: ['&& denotes a mnemonic'] }, "Do&&n't Save")), result: ConfirmResult.DONT_SAVE };
            var cancel = { label: nls_1.localize('cancel', "Cancel"), result: ConfirmResult.CANCEL };
            var buttons = [];
            if (platform_1.isWindows) {
                buttons.push(save, dontSave, cancel);
            }
            else if (platform_1.isLinux) {
                buttons.push(dontSave, cancel, save);
            }
            else {
                buttons.push(save, cancel, dontSave);
            }
            var options = {
                title: this.environmentService.appNameLong,
                message: nls_1.localize('saveWorkspaceMessage', "Do you want to save your workspace configuration as a file?"),
                detail: nls_1.localize('saveWorkspaceDetail', "Save your workspace if you plan to open it again."),
                noLink: true,
                type: 'warning',
                buttons: buttons.map(function (button) { return button.label; }),
                cancelId: buttons.indexOf(cancel)
            };
            if (platform_1.isLinux) {
                options.defaultId = 2;
            }
            var res = electron_1.dialog.showMessageBox(e.window.win, options);
            switch (buttons[res].result) {
                // Cancel: veto unload
                case ConfirmResult.CANCEL:
                    e.veto(true);
                    break;
                // Don't Save: delete workspace
                case ConfirmResult.DONT_SAVE:
                    this.workspacesService.deleteUntitledWorkspaceSync(workspace);
                    e.veto(false);
                    break;
                // Save: save workspace, but do not veto unload
                case ConfirmResult.SAVE: {
                    var target = electron_1.dialog.showSaveDialog(e.window.win, {
                        buttonLabel: labels_1.mnemonicLabel(nls_1.localize({ key: 'save', comment: ['&& denotes a mnemonic'] }, "&&Save")),
                        title: nls_1.localize('saveWorkspace', "Save Workspace"),
                        filters: workspaces_1.WORKSPACE_FILTER,
                        defaultPath: this.getWorkspaceDialogDefaultPath(workspace)
                    });
                    if (target) {
                        e.veto(this.workspacesService.saveWorkspace(workspace, target).then(function () { return false; }, function () { return false; }));
                    }
                    else {
                        e.veto(true); // keep veto if no target was provided
                    }
                }
            }
        };
        WindowsManager.prototype.focusLastActive = function (cli, context) {
            var lastActive = this.getLastActiveWindow();
            if (lastActive) {
                lastActive.focus();
                return lastActive;
            }
            // No window - open new empty one
            return this.open({ context: context, cli: cli, forceEmpty: true })[0];
        };
        WindowsManager.prototype.getLastActiveWindow = function () {
            return windowsFinder_1.getLastActiveWindow(WindowsManager.WINDOWS);
        };
        WindowsManager.prototype.openNewWindow = function (context) {
            this.open({ context: context, cli: this.environmentService.args, forceNewWindow: true, forceEmpty: true });
        };
        WindowsManager.prototype.waitForWindowClose = function (windowId) {
            var _this = this;
            return new winjs_base_1.TPromise(function (c) {
                var toDispose = _this.onWindowClose(function (id) {
                    if (id === windowId) {
                        toDispose.dispose();
                        c(null);
                    }
                });
            });
        };
        WindowsManager.prototype.sendToFocused = function (channel) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var focusedWindow = this.getFocusedWindow() || this.getLastActiveWindow();
            if (focusedWindow) {
                focusedWindow.sendWhenReady.apply(focusedWindow, [channel].concat(args));
            }
        };
        WindowsManager.prototype.sendToAll = function (channel, payload, windowIdsToIgnore) {
            WindowsManager.WINDOWS.forEach(function (w) {
                if (windowIdsToIgnore && windowIdsToIgnore.indexOf(w.id) >= 0) {
                    return; // do not send if we are instructed to ignore it
                }
                w.sendWhenReady(channel, payload);
            });
        };
        WindowsManager.prototype.getFocusedWindow = function () {
            var win = electron_1.BrowserWindow.getFocusedWindow();
            if (win) {
                return this.getWindowById(win.id);
            }
            return null;
        };
        WindowsManager.prototype.getWindowById = function (windowId) {
            var res = WindowsManager.WINDOWS.filter(function (w) { return w.id === windowId; });
            if (res && res.length === 1) {
                return res[0];
            }
            return null;
        };
        WindowsManager.prototype.getWindows = function () {
            return WindowsManager.WINDOWS;
        };
        WindowsManager.prototype.getWindowCount = function () {
            return WindowsManager.WINDOWS.length;
        };
        WindowsManager.prototype.onWindowError = function (window, error) {
            var _this = this;
            this.logService.error(error === WindowError.CRASHED ? '[VS Code]: render process crashed!' : '[VS Code]: detected unresponsive');
            // Unresponsive
            if (error === WindowError.UNRESPONSIVE) {
                electron_1.dialog.showMessageBox(window.win, {
                    title: product_1.default.nameLong,
                    type: 'warning',
                    buttons: [nls_1.localize('reopen', "Reopen"), nls_1.localize('wait', "Keep Waiting"), nls_1.localize('close', "Close")],
                    message: nls_1.localize('appStalled', "The window is no longer responding"),
                    detail: nls_1.localize('appStalledDetail', "You can reopen or close the window or keep waiting."),
                    noLink: true
                }, function (result) {
                    if (!window.win) {
                        return; // Return early if the window has been going down already
                    }
                    if (result === 0) {
                        window.reload();
                    }
                    else if (result === 2) {
                        _this.onBeforeWindowClose(window); // 'close' event will not be fired on destroy(), so run it manually
                        window.win.destroy(); // make sure to destroy the window as it is unresponsive
                    }
                });
            }
            else {
                electron_1.dialog.showMessageBox(window.win, {
                    title: product_1.default.nameLong,
                    type: 'warning',
                    buttons: [nls_1.localize('reopen', "Reopen"), nls_1.localize('close', "Close")],
                    message: nls_1.localize('appCrashed', "The window has crashed"),
                    detail: nls_1.localize('appCrashedDetail', "We are sorry for the inconvenience! You can reopen the window to continue where you left off."),
                    noLink: true
                }, function (result) {
                    if (!window.win) {
                        return; // Return early if the window has been going down already
                    }
                    if (result === 0) {
                        window.reload();
                    }
                    else if (result === 1) {
                        _this.onBeforeWindowClose(window); // 'close' event will not be fired on destroy(), so run it manually
                        window.win.destroy(); // make sure to destroy the window as it has crashed
                    }
                });
            }
        };
        WindowsManager.prototype.onWindowClosed = function (win) {
            // Tell window
            win.dispose();
            // Remove from our list so that Electron can clean it up
            var index = WindowsManager.WINDOWS.indexOf(win);
            WindowsManager.WINDOWS.splice(index, 1);
            // Emit
            this._onWindowsCountChanged.fire({ oldCount: WindowsManager.WINDOWS.length + 1, newCount: WindowsManager.WINDOWS.length });
            this._onWindowClose.fire(win.id);
        };
        WindowsManager.prototype.pickFileFolderAndOpen = function (options) {
            this.doPickAndOpen(options, true /* pick folders */, true /* pick files */);
        };
        WindowsManager.prototype.pickFolderAndOpen = function (options) {
            this.doPickAndOpen(options, true /* pick folders */, false /* pick files */);
        };
        WindowsManager.prototype.pickFileAndOpen = function (options) {
            this.doPickAndOpen(options, false /* pick folders */, true /* pick files */);
        };
        WindowsManager.prototype.doPickAndOpen = function (options, pickFolders, pickFiles) {
            var internalOptions = options;
            internalOptions.pickFolders = pickFolders;
            internalOptions.pickFiles = pickFiles;
            if (!internalOptions.dialogOptions) {
                internalOptions.dialogOptions = Object.create(null);
            }
            if (!internalOptions.dialogOptions.title) {
                if (pickFolders && pickFiles) {
                    internalOptions.dialogOptions.title = nls_1.localize('open', "Open");
                }
                else if (pickFolders) {
                    internalOptions.dialogOptions.title = nls_1.localize('openFolder', "Open Folder");
                }
                else {
                    internalOptions.dialogOptions.title = nls_1.localize('openFile', "Open File");
                }
            }
            if (!internalOptions.telemetryEventName) {
                if (pickFolders && pickFiles) {
                    internalOptions.telemetryEventName = 'openFileFolder';
                }
                else if (pickFolders) {
                    internalOptions.telemetryEventName = 'openFolder';
                }
                else {
                    internalOptions.telemetryEventName = 'openFile';
                }
            }
            this.fileDialog.pickAndOpen(internalOptions);
        };
        WindowsManager.prototype.quit = function () {
            var _this = this;
            // If the user selected to exit from an extension development host window, do not quit, but just
            // close the window unless this is the last window that is opened.
            var window = this.getFocusedWindow();
            if (window && window.isExtensionDevelopmentHost && this.getWindowCount() > 1) {
                window.win.close();
            }
            else {
                setTimeout(function () {
                    _this.lifecycleService.quit();
                }, 10 /* delay to unwind callback stack (IPC) */);
            }
        };
        WindowsManager.windowsStateStorageKey = 'windowsState';
        WindowsManager.WINDOWS = [];
        WindowsManager = __decorate([
            __param(0, log_1.ILogService),
            __param(1, storage_1.IStorageService),
            __param(2, environment_1.IEnvironmentService),
            __param(3, lifecycleMain_1.ILifecycleService),
            __param(4, backup_1.IBackupMainService),
            __param(5, telemetry_1.ITelemetryService),
            __param(6, configuration_1.IConfigurationService),
            __param(7, history_1.IHistoryMainService),
            __param(8, workspaces_1.IWorkspacesMainService),
            __param(9, instantiation_1.IInstantiationService)
        ], WindowsManager);
        return WindowsManager;
    }());
    exports.WindowsManager = WindowsManager;
    var FileDialog = (function () {
        function FileDialog(environmentService, telemetryService, storageService, windowsMainService) {
            this.environmentService = environmentService;
            this.telemetryService = telemetryService;
            this.storageService = storageService;
            this.windowsMainService = windowsMainService;
        }
        FileDialog.prototype.pickAndOpen = function (options) {
            var _this = this;
            this.getFileOrFolderPaths(options, function (paths) {
                var numberOfPaths = paths ? paths.length : 0;
                // Telemetry
                if (options.telemetryEventName) {
                    _this.telemetryService.publicLog(options.telemetryEventName, __assign({}, options.telemetryExtraData, { outcome: numberOfPaths ? 'success' : 'canceled', numberOfPaths: numberOfPaths }));
                }
                // Open
                if (numberOfPaths) {
                    _this.windowsMainService.open({
                        context: windows_1.OpenContext.DIALOG,
                        cli: _this.environmentService.args,
                        pathsToOpen: paths,
                        forceNewWindow: options.forceNewWindow,
                        forceOpenWorkspaceAsFile: options.dialogOptions && !objects_1.equals(options.dialogOptions.filters, workspaces_1.WORKSPACE_FILTER)
                    });
                }
            });
        };
        FileDialog.prototype.getFileOrFolderPaths = function (options, clb) {
            var _this = this;
            // Ensure dialog options
            if (!options.dialogOptions) {
                options.dialogOptions = Object.create(null);
            }
            // Ensure defaultPath
            if (!options.dialogOptions.defaultPath) {
                options.dialogOptions.defaultPath = this.storageService.getItem(FileDialog.workingDirPickerStorageKey);
            }
            // Ensure properties
            if (typeof options.pickFiles === 'boolean' || typeof options.pickFolders === 'boolean') {
                options.dialogOptions.properties = void 0; // let it override based on the booleans
                if (options.pickFiles && options.pickFolders) {
                    options.dialogOptions.properties = ['multiSelections', 'openDirectory', 'openFile', 'createDirectory'];
                }
            }
            if (!options.dialogOptions.properties) {
                options.dialogOptions.properties = ['multiSelections', options.pickFolders ? 'openDirectory' : 'openFile', 'createDirectory'];
            }
            // Show Dialog
            var focusedWindow = this.windowsMainService.getWindowById(options.windowId) || this.windowsMainService.getFocusedWindow();
            electron_1.dialog.showOpenDialog(focusedWindow && focusedWindow.win, options.dialogOptions, function (paths) {
                if (paths && paths.length > 0) {
                    // Remember path in storage for next time
                    _this.storageService.setItem(FileDialog.workingDirPickerStorageKey, path.dirname(paths[0]));
                    // Return
                    return clb(paths);
                }
                return clb(void (0));
            });
        };
        FileDialog.workingDirPickerStorageKey = 'pickerWorkingDir';
        return FileDialog;
    }());
});
//# sourceMappingURL=windows.js.map