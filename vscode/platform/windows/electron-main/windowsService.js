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
define(["require", "exports", "vs/base/common/winjs.base", "vs/base/common/lifecycle", "vs/base/common/objects", "vs/base/common/uri", "vs/platform/windows/common/windows", "vs/platform/environment/common/environment", "electron", "vs/base/common/event", "vs/base/node/event", "vs/platform/url/common/url", "vs/platform/lifecycle/electron-main/lifecycleMain", "vs/platform/windows/electron-main/windows", "vs/platform/history/common/history"], function (require, exports, winjs_base_1, lifecycle_1, objects_1, uri_1, windows_1, environment_1, electron_1, event_1, event_2, url_1, lifecycleMain_1, windows_2, history_1) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var WindowsService = (function () {
        function WindowsService(sharedProcess, windowsMainService, environmentService, urlService, lifecycleService, historyService) {
            var _this = this;
            this.sharedProcess = sharedProcess;
            this.windowsMainService = windowsMainService;
            this.environmentService = environmentService;
            this.lifecycleService = lifecycleService;
            this.historyService = historyService;
            this.disposables = [];
            this.onWindowOpen = event_2.fromEventEmitter(electron_1.app, 'browser-window-created', function (_, w) { return w.id; });
            this.onWindowFocus = event_2.fromEventEmitter(electron_1.app, 'browser-window-focus', function (_, w) { return w.id; });
            this.onWindowBlur = event_2.fromEventEmitter(electron_1.app, 'browser-window-blur', function (_, w) { return w.id; });
            // Catch file URLs
            event_1.chain(urlService.onOpenURL)
                .filter(function (uri) { return uri.authority === 'file' && !!uri.path; })
                .map(function (uri) { return uri_1.default.file(uri.fsPath); })
                .on(this.openFileForURI, this, this.disposables);
            // Catch extension URLs when there are no windows open
            event_1.chain(urlService.onOpenURL)
                .filter(function (uri) { return /^extension/.test(uri.path); })
                .filter(function () { return _this.windowsMainService.getWindowCount() === 0; })
                .on(this.openExtensionForURI, this, this.disposables);
        }
        WindowsService.prototype.pickFileFolderAndOpen = function (options) {
            this.windowsMainService.pickFileFolderAndOpen(options);
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.pickFileAndOpen = function (options) {
            this.windowsMainService.pickFileAndOpen(options);
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.pickFolderAndOpen = function (options) {
            this.windowsMainService.pickFolderAndOpen(options);
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.reloadWindow = function (windowId) {
            var codeWindow = this.windowsMainService.getWindowById(windowId);
            if (codeWindow) {
                this.windowsMainService.reload(codeWindow);
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.openDevTools = function (windowId) {
            var codeWindow = this.windowsMainService.getWindowById(windowId);
            if (codeWindow) {
                codeWindow.win.webContents.openDevTools();
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.toggleDevTools = function (windowId) {
            var codeWindow = this.windowsMainService.getWindowById(windowId);
            if (codeWindow) {
                var contents = codeWindow.win.webContents;
                if (codeWindow.hasHiddenTitleBarStyle() && !codeWindow.win.isFullScreen() && !contents.isDevToolsOpened()) {
                    contents.openDevTools({ mode: 'undocked' }); // due to https://github.com/electron/electron/issues/3647
                }
                else {
                    contents.toggleDevTools();
                }
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.closeWorkspace = function (windowId) {
            var codeWindow = this.windowsMainService.getWindowById(windowId);
            if (codeWindow) {
                this.windowsMainService.closeWorkspace(codeWindow);
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.openWorkspace = function (windowId) {
            var codeWindow = this.windowsMainService.getWindowById(windowId);
            if (codeWindow) {
                this.windowsMainService.openWorkspace(codeWindow);
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.createAndOpenWorkspace = function (windowId, folders, path) {
            var codeWindow = this.windowsMainService.getWindowById(windowId);
            if (codeWindow) {
                this.windowsMainService.createAndOpenWorkspace(codeWindow, folders, path);
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.saveAndOpenWorkspace = function (windowId, path) {
            var codeWindow = this.windowsMainService.getWindowById(windowId);
            if (codeWindow) {
                this.windowsMainService.saveAndOpenWorkspace(codeWindow, path);
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.toggleFullScreen = function (windowId) {
            var codeWindow = this.windowsMainService.getWindowById(windowId);
            if (codeWindow) {
                codeWindow.toggleFullScreen();
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.setRepresentedFilename = function (windowId, fileName) {
            var codeWindow = this.windowsMainService.getWindowById(windowId);
            if (codeWindow) {
                codeWindow.setRepresentedFilename(fileName);
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.addRecentlyOpened = function (files) {
            this.historyService.addRecentlyOpened(void 0, files);
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.removeFromRecentlyOpened = function (paths) {
            this.historyService.removeFromRecentlyOpened(paths);
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.clearRecentlyOpened = function () {
            this.historyService.clearRecentlyOpened();
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.getRecentlyOpened = function (windowId) {
            var codeWindow = this.windowsMainService.getWindowById(windowId);
            if (codeWindow) {
                return winjs_base_1.TPromise.as(this.historyService.getRecentlyOpened(codeWindow.config.workspace || codeWindow.config.folderPath, codeWindow.config.filesToOpen));
            }
            return winjs_base_1.TPromise.as(this.historyService.getRecentlyOpened());
        };
        WindowsService.prototype.focusWindow = function (windowId) {
            var codeWindow = this.windowsMainService.getWindowById(windowId);
            if (codeWindow) {
                codeWindow.win.focus();
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.closeWindow = function (windowId) {
            var codeWindow = this.windowsMainService.getWindowById(windowId);
            if (codeWindow) {
                codeWindow.win.close();
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.isFocused = function (windowId) {
            var codeWindow = this.windowsMainService.getWindowById(windowId);
            if (codeWindow) {
                return winjs_base_1.TPromise.as(codeWindow.win.isFocused());
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.isMaximized = function (windowId) {
            var codeWindow = this.windowsMainService.getWindowById(windowId);
            if (codeWindow) {
                return winjs_base_1.TPromise.as(codeWindow.win.isMaximized());
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.maximizeWindow = function (windowId) {
            var codeWindow = this.windowsMainService.getWindowById(windowId);
            if (codeWindow) {
                codeWindow.win.maximize();
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.unmaximizeWindow = function (windowId) {
            var codeWindow = this.windowsMainService.getWindowById(windowId);
            if (codeWindow) {
                codeWindow.win.unmaximize();
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.onWindowTitleDoubleClick = function (windowId) {
            var codeWindow = this.windowsMainService.getWindowById(windowId);
            if (codeWindow) {
                codeWindow.onWindowTitleDoubleClick();
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.setDocumentEdited = function (windowId, flag) {
            var codeWindow = this.windowsMainService.getWindowById(windowId);
            if (codeWindow && codeWindow.win.isDocumentEdited() !== flag) {
                codeWindow.win.setDocumentEdited(flag);
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.openWindow = function (paths, options) {
            if (!paths || !paths.length) {
                return winjs_base_1.TPromise.as(null);
            }
            this.windowsMainService.open({
                context: windows_1.OpenContext.API,
                cli: this.environmentService.args,
                pathsToOpen: paths,
                forceNewWindow: options && options.forceNewWindow,
                forceReuseWindow: options && options.forceReuseWindow,
                forceOpenWorkspaceAsFile: options && options.forceOpenWorkspaceAsFile
            });
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.openNewWindow = function () {
            this.windowsMainService.openNewWindow(windows_1.OpenContext.API);
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.showWindow = function (windowId) {
            var codeWindow = this.windowsMainService.getWindowById(windowId);
            if (codeWindow) {
                codeWindow.win.show();
            }
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.getWindows = function () {
            var windows = this.windowsMainService.getWindows();
            var result = windows.map(function (w) { return ({ id: w.id, workspace: w.openedWorkspace, openedFolderPath: w.openedFolderPath, title: w.win.getTitle(), filename: w.getRepresentedFilename() }); });
            return winjs_base_1.TPromise.as(result);
        };
        WindowsService.prototype.getWindowCount = function () {
            return winjs_base_1.TPromise.as(this.windowsMainService.getWindows().length);
        };
        WindowsService.prototype.log = function (severity) {
            var messages = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                messages[_i - 1] = arguments[_i];
            }
            (_a = console[severity]).apply.apply(_a, [console].concat(messages));
            return winjs_base_1.TPromise.as(null);
            var _a;
        };
        WindowsService.prototype.showItemInFolder = function (path) {
            electron_1.shell.showItemInFolder(path);
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.openExternal = function (url) {
            return winjs_base_1.TPromise.as(electron_1.shell.openExternal(url));
        };
        WindowsService.prototype.startCrashReporter = function (config) {
            electron_1.crashReporter.start(config);
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.quit = function () {
            this.windowsMainService.quit();
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.relaunch = function (options) {
            this.lifecycleService.relaunch(options);
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.whenSharedProcessReady = function () {
            return this.sharedProcess.whenReady();
        };
        WindowsService.prototype.toggleSharedProcess = function () {
            this.sharedProcess.toggle();
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.openFileForURI = function (uri) {
            var cli = objects_1.assign(Object.create(null), this.environmentService.args, { goto: true });
            var pathsToOpen = [uri.fsPath];
            this.windowsMainService.open({ context: windows_1.OpenContext.API, cli: cli, pathsToOpen: pathsToOpen });
            return winjs_base_1.TPromise.as(null);
        };
        /**
         * This should only fire whenever an extension URL is open
         * and there are no windows to handle it.
         */
        WindowsService.prototype.openExtensionForURI = function (uri) {
            var cli = objects_1.assign(Object.create(null), this.environmentService.args);
            this.windowsMainService.open({ context: windows_1.OpenContext.API, cli: cli });
            return winjs_base_1.TPromise.as(null);
        };
        WindowsService.prototype.dispose = function () {
            this.disposables = lifecycle_1.dispose(this.disposables);
        };
        WindowsService = __decorate([
            __param(1, windows_2.IWindowsMainService),
            __param(2, environment_1.IEnvironmentService),
            __param(3, url_1.IURLService),
            __param(4, lifecycleMain_1.ILifecycleService),
            __param(5, history_1.IHistoryMainService)
        ], WindowsService);
        return WindowsService;
    }());
    exports.WindowsService = WindowsService;
});
//# sourceMappingURL=windowsService.js.map